/**
 * @file popup.js
 * @description This script manages the popup UI, including the enable/disable toggle
 * and custom extension management.
 */

document.addEventListener('DOMContentLoaded', () => {
    const enabledToggle = document.getElementById('extension-enabled');
    const statusText = document.getElementById('status-text');
    const fileTypesList = document.getElementById('file-types-list');
    const customExtensionInput = document.getElementById('custom-extension-input');
    const addExtensionBtn = document.getElementById('add-extension-btn');
    const customExtensionsList = document.getElementById('custom-extensions-list');

    const supportedExtensions = [
        '.py', '.js', '.ts', '.cpp', '.c', '.cs', '.java', '.go', '.php', '.rs', '.md',
        '.json', '.yml', '.yaml', '.html', '.css', '.sh', '.bat', '.pl', '.rb', '.jsx',
        '.tsx', '.vue', '.svelte', '.dart', '.kt', '.swift', '.r', '.sql', '.xml',
        '.toml', '.ini', '.cfg', '.conf'
    ];

    // Populate the supported file types list
    supportedExtensions.forEach(ext => {
        const span = document.createElement('span');
        span.textContent = ext;
        fileTypesList.appendChild(span);
    });

    // Load saved state from chrome.storage
    chrome.storage.sync.get(['extensionEnabled', 'customExtensions'], (data) => {
        const isEnabled = data.extensionEnabled !== false; // Default to true
        enabledToggle.checked = isEnabled;
        statusText.textContent = isEnabled ? 'Enabled' : 'Disabled';
        statusText.style.color = isEnabled ? '#4CAF50' : '#f44336';

        const customExtensions = data.customExtensions || [];
        updateCustomExtensionsList(customExtensions);
    });

    // Handle toggle switch changes
    enabledToggle.addEventListener('change', () => {
        const isEnabled = enabledToggle.checked;
        chrome.storage.sync.set({ extensionEnabled: isEnabled }, () => {
            statusText.textContent = isEnabled ? 'Enabled' : 'Disabled';
            statusText.style.color = isEnabled ? '#4CAF50' : '#f44336';
            
            // Notify the content script to enable/disable its functionality
            chrome.tabs.query({ url: "https://aistudio.google.com/*" }, (tabs) => {
                tabs.forEach(tab => {
                    chrome.tabs.sendMessage(tab.id, {
                        action: 'toggleExtension',
                        enabled: isEnabled
                    });
                });
            });
        });
    });

    // Handle adding custom extensions
    addExtensionBtn.addEventListener('click', addCustomExtension);
    customExtensionInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addCustomExtension();
        }
    });

    function addCustomExtension() {
        const input = customExtensionInput.value.trim();
        if (!input) return;

        // Normalize the extension (ensure it starts with a dot)
        const extension = input.startsWith('.') ? input.toLowerCase() : `.${input.toLowerCase()}`;
        
        // Validate extension format
        if (!/^\.[a-z0-9]+$/.test(extension)) {
            alert('Please enter a valid extension (e.g., .diff, .log)');
            return;
        }

        // Check if it's already in default extensions
        if (supportedExtensions.includes(extension)) {
            alert('This extension is already supported by default');
            customExtensionInput.value = '';
            return;
        }

        chrome.storage.sync.get('customExtensions', (data) => {
            const customExtensions = data.customExtensions || [];
            
            // Check if already added
            if (customExtensions.includes(extension)) {
                alert('Extension already added');
                customExtensionInput.value = '';
                return;
            }

            // Add new extension
            const updatedExtensions = [...customExtensions, extension];
            chrome.storage.sync.set({ customExtensions: updatedExtensions }, () => {
                updateCustomExtensionsList(updatedExtensions);
                customExtensionInput.value = '';
                
                // Notify content script to reload extensions
                chrome.tabs.query({ url: "https://aistudio.google.com/*" }, (tabs) => {
                    tabs.forEach(tab => {
                        chrome.tabs.sendMessage(tab.id, {
                            action: 'updateExtensions',
                            customExtensions: updatedExtensions
                        });
                    });
                });
            });
        });
    }

    function removeCustomExtension(extension) {
        chrome.storage.sync.get('customExtensions', (data) => {
            const customExtensions = data.customExtensions || [];
            const updatedExtensions = customExtensions.filter(ext => ext !== extension);
            
            chrome.storage.sync.set({ customExtensions: updatedExtensions }, () => {
                updateCustomExtensionsList(updatedExtensions);
                
                // Notify content script to reload extensions
                chrome.tabs.query({ url: "https://aistudio.google.com/*" }, (tabs) => {
                    tabs.forEach(tab => {
                        chrome.tabs.sendMessage(tab.id, {
                            action: 'updateExtensions',
                            customExtensions: updatedExtensions
                        });
                    });
                });
            });
        });
    }

    function updateCustomExtensionsList(customExtensions) {
        customExtensionsList.innerHTML = '';
        
        if (customExtensions.length === 0) {
            customExtensionsList.innerHTML = '<span style="color: #999; font-style: italic; font-size: 12px;">No custom extensions added</span>';
            return;
        }

        customExtensions.forEach(extension => {
            const tag = document.createElement('div');
            tag.className = 'extension-tag';
            tag.innerHTML = `
                <span>${extension}</span>
                <button class="remove-btn" title="Remove extension">×</button>
            `;
            
            tag.querySelector('.remove-btn').addEventListener('click', () => {
                removeCustomExtension(extension);
            });
            
            customExtensionsList.appendChild(tag);
        });
    }
});