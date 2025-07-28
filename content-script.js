/**
 * @file content-script.js
 * @description This script runs on aistudio.google.com to handle file uploads.
 * It intercepts file input changes, renames code files to .txt in-memory,
 * and updates the file input to allow uploading to AI Studio.
 */

/**
 * A set of supported file extensions that will be renamed to .txt.
 * This makes checking for supported file types efficient.
 * @type {Set<string>}
 */
const SUPPORTED_EXTENSIONS = new Set([
  '.py', '.js', '.ts', '.cpp', '.c', '.cs', '.java', '.go', '.php', '.rs', '.md',
  '.json', '.yml', '.yaml', '.html', '.css', '.sh', '.bat', '.pl', '.rb', '.jsx',
  '.tsx', '.vue', '.svelte', '.dart', '.kt', '.swift', '.r', '.sql', '.xml',
  '.toml', '.ini', '.cfg', '.conf'
]);

/**
 * Renames a file to have a .txt extension while preserving its content and metadata.
 * @param {File} file - The original file object to be renamed.
 * @returns {File} A new File object with the .txt extension.
 */
function renameFileToTxt(file) {
  const originalName = file.name;
  const lastDotIndex = originalName.lastIndexOf('.');
  
  // Handle files with no extension or hidden files starting with a dot.
  const baseName = lastDotIndex > 0 ? originalName.substring(0, lastDotIndex) : originalName;
  const newName = `${baseName}.txt`;

  // Create a new File object with the new name. The content is passed as a blob.
  // The original file's lastModified timestamp is preserved.
  const newFile = new File([file], newName, {
    type: 'text/plain',
    lastModified: file.lastModified,
  });

  return newFile;
}

/**
 * Handles the 'change' event on file input elements. It processes the selected
 * files, renames them if necessary, and updates the input's file list.
 * @param {Event} event - The file input change event.
 */
function handleFileInputChange(event) {
  const input = event.target;
  if (!input.files || input.files.length === 0) {
    return;
  }

  const originalFiles = Array.from(input.files);
  const dataTransfer = new DataTransfer();
  let filesModified = false;

  const processedFiles = originalFiles.map(file => {
    const lastDotIndex = file.name.lastIndexOf('.');
    const extension = lastDotIndex > 0 ? file.name.substring(lastDotIndex).toLowerCase() : '';
    
    if (extension && SUPPORTED_EXTENSIONS.has(extension)) {
      const newFile = renameFileToTxt(file);
      dataTransfer.items.add(newFile);
      filesModified = true;
      return { original: file.name, newName: newFile.name };
    } else {
      dataTransfer.items.add(file);
      return null;
    }
  });

  if (filesModified) {
    // Update the input's files with the renamed files
    try {
      input.files = dataTransfer.files;
    } catch (e) {
      // Fallback: Override the files property
      Object.defineProperty(input, 'files', {
        value: dataTransfer.files,
        writable: false,
        configurable: true
      });
    }

    // Log the activity for the popup to display
    const activityLog = processedFiles.filter(p => p !== null);
    if (activityLog.length > 0) {
      chrome.runtime.sendMessage({ action: 'logActivity', data: activityLog }).catch(() => {
        // Silently ignore popup communication errors
      });
    }
    
    // Trigger multiple events to ensure AI Studio detects the change
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    
    // Add a small delay and trigger again to ensure AI Studio processes it
    setTimeout(() => {
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }, 100);
  }
}

/**
 * Attaches the file input change listener to all existing file inputs on the page.
 * It adds a custom attribute to prevent attaching multiple listeners to the same element.
 */
function attachListenersToExistingInputs() {
  const fileInputs = document.querySelectorAll('input[type="file"]');
  fileInputs.forEach(input => {
    if (!input.dataset.codeUploaderAttached) {
      // Listen to multiple events that could indicate file selection
      input.addEventListener('change', handleFileInputChange);
      input.addEventListener('input', handleFileInputChange);
      
      // Override the files property setter to catch programmatic changes
      const originalFilesDescriptor = Object.getOwnPropertyDescriptor(input, 'files') || 
                                    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'files');
      
      if (originalFilesDescriptor && originalFilesDescriptor.set) {
        Object.defineProperty(input, 'files', {
          get: originalFilesDescriptor.get,
          set: function(value) {
            originalFilesDescriptor.set.call(this, value);
            if (value && value.length > 0) {
              handleFileInputChange({ target: this });
            }
          },
          configurable: true
        });
      }
      
      input.dataset.codeUploaderAttached = 'true';
    }
  });
}

/**
 * Observes the DOM for newly added file inputs and attaches listeners to them.
 * This is essential for single-page applications where content is loaded dynamically.
 */
function observeForNewInputs() {
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Check if the added node itself is a file input
            if (node.matches('input[type="file"]') && !node.dataset.codeUploaderAttached) {
              // Listen to multiple events
              node.addEventListener('change', handleFileInputChange);
              node.addEventListener('input', handleFileInputChange);
              
              // Override files property setter
              const originalFilesDescriptor = Object.getOwnPropertyDescriptor(node, 'files') || 
                                            Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'files');
              
              if (originalFilesDescriptor && originalFilesDescriptor.set) {
                Object.defineProperty(node, 'files', {
                  get: originalFilesDescriptor.get,
                  set: function(value) {
                    originalFilesDescriptor.set.call(this, value);
                    if (value && value.length > 0) {
                      handleFileInputChange({ target: this });
                    }
                  },
                  configurable: true
                });
              }
              
              node.dataset.codeUploaderAttached = 'true';
            }
            // Check for file inputs within the added node's subtree
            const newInputs = node.querySelectorAll('input[type="file"]');
            newInputs.forEach(input => {
              if (!input.dataset.codeUploaderAttached) {
                // Listen to multiple events
                input.addEventListener('change', handleFileInputChange);
                input.addEventListener('input', handleFileInputChange);
                
                // Override files property setter
                const originalFilesDescriptor = Object.getOwnPropertyDescriptor(input, 'files') || 
                                              Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'files');
                
                if (originalFilesDescriptor && originalFilesDescriptor.set) {
                  Object.defineProperty(input, 'files', {
                    get: originalFilesDescriptor.get,
                    set: function(value) {
                      originalFilesDescriptor.set.call(this, value);
                      if (value && value.length > 0) {
                        handleFileInputChange({ target: this });
                      }
                    },
                    configurable: true
                  });
                }
                
                input.dataset.codeUploaderAttached = 'true';
              }
            });
          }
        });
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

/**
 * Initializes the content script by attaching listeners and setting up the observer.
 * It also listens for messages from the popup, such as enabling/disabling the extension.
 */
function initialize() {
  chrome.storage.sync.get('extensionEnabled', (data) => {
    if (data.extensionEnabled !== false) { // Enabled by default
      attachListenersToExistingInputs();
      observeForNewInputs();
      
      // Add global click listener to detect file upload button clicks
      document.addEventListener('click', (event) => {
        // Check if clicked element or its parent might trigger file upload
        const target = event.target;
        if (target.matches('button, [role="button"], .upload-btn, [data-testid*="upload"], [aria-label*="upload" i], [aria-label*="attach" i]') ||
            target.closest('button, [role="button"], .upload-btn, [data-testid*="upload"], [aria-label*="upload" i], [aria-label*="attach" i]')) {
          // Wait a bit for any new file inputs to be created
          setTimeout(() => {
            attachListenersToExistingInputs();
          }, 100);
        }
      });
      
    }
  });

  // Listen for messages from the popup to toggle the extension's functionality
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'toggleExtension') {
      if (message.enabled) {
        attachListenersToExistingInputs();
        observeForNewInputs();
      }
      sendResponse({ success: true });
    }
  });
}

// Only initialize if we're on AI Studio
if (window.location.hostname.includes('aistudio.google.com')) {
  initialize();
}