/**
 * @file popup.js
 * @description This script manages the popup UI, including the enable/disable toggle
 * and displaying activity logs from storage.
 */

document.addEventListener('DOMContentLoaded', () => {
    const enabledToggle = document.getElementById('extension-enabled');
    const statusText = document.getElementById('status-text');
    const fileTypesList = document.getElementById('file-types-list');
    const activityLog = document.getElementById('activity-log');

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
    chrome.storage.sync.get(['extensionEnabled', 'activityLog'], (data) => {
        const isEnabled = data.extensionEnabled !== false; // Default to true
        enabledToggle.checked = isEnabled;
        statusText.textContent = isEnabled ? 'Enabled' : 'Disabled';
        statusText.style.color = isEnabled ? '#4CAF50' : '#f44336';

        const log = data.activityLog || [];
        updateActivityLog(log);
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

    // Function to update the activity log in the popup
    function updateActivityLog(log) {
        activityLog.innerHTML = '';
        if (log.length === 0) {
            activityLog.innerHTML = '<li>No activity yet.</li>';
            return;
        }
        // Show the last 5 entries in reverse chronological order
        log.slice(-5).reverse().forEach(entry => {
            const li = document.createElement('li');
            li.textContent = `Renamed '${entry.original}' to '${entry.newName}'`;
            activityLog.appendChild(li);
        });
    }

    // Listen for activity logs from the content script
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === 'logActivity') {
            chrome.storage.sync.get('activityLog', (data) => {
                const log = data.activityLog || [];
                // Add new entries to the beginning of the log
                const newLog = [...message.data, ...log];
                // Keep the log from growing indefinitely
                if (newLog.length > 50) {
                    newLog.length = 50;
                }
                chrome.storage.sync.set({ activityLog: newLog }, () => {
                    updateActivityLog(newLog);
                });
            });
        }
    });
});