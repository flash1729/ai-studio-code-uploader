/**
 * @file popup.js
 * @description This script manages the popup UI, including the enable/disable toggle
 * and custom extension management.
 */

document.addEventListener("DOMContentLoaded", () => {
  const enabledToggle = document.getElementById("extension-enabled");
  const statusText = document.getElementById("status-text");
  const fileTypesList = document.getElementById("file-types-list");
  const customExtensionInput = document.getElementById("custom-extension-input");
  const addExtensionBtn = document.getElementById("add-extension-btn");
  const customExtensionsList = document.getElementById("custom-extensions-list");

  const selectorsInput = document.getElementById("custom-selectors-input");
  const saveSelectorsBtn = document.getElementById("save-selectors-btn");

  const renamedFilesList = document.getElementById("renamed-files-list");
  const clearLogBtn = document.getElementById("clear-log-btn");

  const supportedExtensions = [".py", ".js", ".ts", ".cpp", ".c", ".cs", ".java", ".go", ".php", ".rs", ".md", ".json", ".yml", ".yaml", ".html", ".css", ".sh", ".bat", ".pl", ".rb", ".jsx", ".tsx", ".vue", ".svelte", ".dart", ".kt", ".swift", ".r", ".sql", ".xml", ".toml", ".ini", ".cfg", ".conf"];

  // Populate the supported file types list
  supportedExtensions.forEach((ext) => {
    const span = document.createElement("span");
    span.textContent = ext;
    fileTypesList.appendChild(span);
  });

  // Load saved state from chrome.storage
  chrome.storage.sync.get(["extensionEnabled", "customExtensions", "targetSelectors"], (data) => {
    const isEnabled = data.extensionEnabled !== false; // Default to true
    enabledToggle.checked = isEnabled;
    statusText.textContent = isEnabled ? "Enabled" : "Disabled";
    statusText.style.color = isEnabled ? "#4CAF50" : "#f44336";

    const customExtensions = data.customExtensions || [];
    updateCustomExtensionsList(customExtensions);

    const targetSelectors = data.targetSelectors || [];
    selectorsInput.value = targetSelectors.join(", ");
  });

  // Load renamed files log from local storage
  chrome.storage.local.get("renamedFiles", (data) => {
    const renamedFiles = data.renamedFiles || [];
    updateRenamedFilesList(renamedFiles);
  });

  // Handle toggle switch changes
  enabledToggle.addEventListener("change", () => {
    const isEnabled = enabledToggle.checked;
    chrome.storage.sync.set({ extensionEnabled: isEnabled }, () => {
      statusText.textContent = isEnabled ? "Enabled" : "Disabled";
      statusText.style.color = isEnabled ? "#4CAF50" : "#f44336";

      // Notify the content script to enable/disable its functionality
      chrome.tabs.query({ url: "https://aistudio.google.com/*" }, (tabs) => {
        tabs.forEach((tab) => {
          chrome.tabs.sendMessage(tab.id, {
            action: "toggleExtension",
            enabled: isEnabled,
          });
        });
      });
    });
  });

  // Handle adding custom extensions
  addExtensionBtn.addEventListener("click", addCustomExtension);
  customExtensionInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addCustomExtension();
    }
  });

  function addCustomExtension() {
    const input = customExtensionInput.value.trim();
    if (!input) return;

    // Normalize the extension (ensure it starts with a dot)
    const extension = input.startsWith(".") ? input.toLowerCase() : `.${input.toLowerCase()}`;

    // Validate extension format
    if (!/^\.[a-z0-9]+$/.test(extension)) {
      alert("Please enter a valid extension (e.g., .diff, .log)");
      return;
    }

    // Check if it's already in default extensions
    if (supportedExtensions.includes(extension)) {
      alert("This extension is already supported by default");
      customExtensionInput.value = "";
      return;
    }

    chrome.storage.sync.get("customExtensions", (data) => {
      const customExtensions = data.customExtensions || [];

      // Check if already added
      if (customExtensions.includes(extension)) {
        alert("Extension already added");
        customExtensionInput.value = "";
        return;
      }

      // Add new extension
      const updatedExtensions = [...customExtensions, extension];
      chrome.storage.sync.set({ customExtensions: updatedExtensions }, () => {
        updateCustomExtensionsList(updatedExtensions);
        customExtensionInput.value = "";

        // Notify content script to reload extensions
        chrome.tabs.query({ url: "https://aistudio.google.com/*" }, (tabs) => {
          tabs.forEach((tab) => {
            chrome.tabs.sendMessage(tab.id, {
              action: "updateExtensions",
              customExtensions: updatedExtensions,
            });
          });
        });
      });
    });
  }

  function removeCustomExtension(extension) {
    chrome.storage.sync.get("customExtensions", (data) => {
      const customExtensions = data.customExtensions || [];
      const updatedExtensions = customExtensions.filter((ext) => ext !== extension);

      chrome.storage.sync.set({ customExtensions: updatedExtensions }, () => {
        updateCustomExtensionsList(updatedExtensions);

        // Notify content script to reload extensions
        chrome.tabs.query({ url: "https://aistudio.google.com/*" }, (tabs) => {
          tabs.forEach((tab) => {
            chrome.tabs.sendMessage(tab.id, {
              action: "updateExtensions",
              customExtensions: updatedExtensions,
            });
          });
        });
      });
    });
  }

  function updateCustomExtensionsList(customExtensions) {
    customExtensionsList.innerHTML = "";

    if (customExtensions.length === 0) {
      customExtensionsList.innerHTML = '<span style="color: #999; font-style: italic; font-size: 12px;">No custom extensions added</span>';
      return;
    }

    customExtensions.forEach((extension) => {
      const tag = document.createElement("div");
      tag.className = "extension-tag";
      tag.innerHTML = `
                <span>${extension}</span>
                <button class="remove-btn" title="Remove extension">×</button>
            `;

      tag.querySelector(".remove-btn").addEventListener("click", () => {
        removeCustomExtension(extension);
      });

      customExtensionsList.appendChild(tag);
    });
  }

  // Handle saving custom selectors
  saveSelectorsBtn.addEventListener("click", saveTargetSelectors);

  function saveTargetSelectors() {
    const selectorsString = selectorsInput.value.trim();
    const selectorsArray = selectorsString.split(",").map(s => s.trim()).filter(Boolean);

    chrome.storage.sync.set({ targetSelectors: selectorsArray }, () => {
      // Notify content script to reload selectors
      chrome.tabs.query({ url: "https://aistudio.google.com/*" }, (tabs) => {
        tabs.forEach((tab) => {
          chrome.tabs.sendMessage(tab.id, {
            action: "updateSelectors",
            targetSelectors: selectorsArray
          });
        });
      });
      // Optionally, provide feedback to the user
      const originalText = saveSelectorsBtn.textContent;
      saveSelectorsBtn.textContent = "Saved!";
      setTimeout(() => {
        saveSelectorsBtn.textContent = originalText;
      }, 2000);
    });
  }

  function updateRenamedFilesList(files) {
    renamedFilesList.innerHTML = "";

    if (files.length === 0) {
      renamedFilesList.innerHTML = '<span class="empty-list-text">No files renamed yet.</span>';
      return;
    }

    files.forEach(file => {
      const item = document.createElement("div");
      item.className = "renamed-file-item";

      const original = document.createElement("span");
      original.className = "original-name";
      original.textContent = file.originalName;

      const arrow = document.createElement("span");
      arrow.className = "arrow";
      arrow.textContent = "→";

      const newName = document.createElement("span");
      newName.className = "new-name";
      newName.textContent = file.newName;

      const timestamp = document.createElement("span");
      timestamp.className = "timestamp";
      timestamp.textContent = new Date(file.timestamp).toLocaleString();

      item.appendChild(original);
      item.appendChild(arrow);
      item.appendChild(newName);
      item.appendChild(timestamp);
      renamedFilesList.appendChild(item);
    });
  }

  clearLogBtn.addEventListener("click", () => {
    chrome.storage.local.set({ renamedFiles: [] }, () => {
      updateRenamedFilesList([]);
    });
  });
});
