/**
 * @file background.js
 * @description Service worker for the extension, handles commands and other background tasks.
 */

// Listen for the command to toggle the extension's enabled state
chrome.commands.onCommand.addListener(async (command) => {
  if (command === "toggle-extension") {
    // Get the current state
    const { extensionEnabled = true } = await chrome.storage.sync.get("extensionEnabled");

    // Flip the state
    const newState = !extensionEnabled;

    // Save the new state
    await chrome.storage.sync.set({ extensionEnabled: newState });

    // Optional: Update the icon to reflect the new state
    const iconPath = newState ? "icons/logo.png" : "icons/logo-disabled.png"; // Assuming a disabled icon exists
    chrome.action.setIcon({ path: iconPath });
  }
});

// Also, listen for startup to set the initial icon state
chrome.runtime.onStartup.addListener(async () => {
  const { extensionEnabled = true } = await chrome.storage.sync.get("extensionEnabled");
  const iconPath = extensionEnabled ? "icons/logo.png" : "icons/logo-disabled.png";
  chrome.action.setIcon({ path: iconPath });
});

// And when the extension is installed
chrome.runtime.onInstalled.addListener(async () => {
    const { extensionEnabled = true } = await chrome.storage.sync.get("extensionEnabled");
    const iconPath = extensionEnabled ? "icons/logo.png" : "icons/logo-disabled.png";
    chrome.action.setIcon({ path: iconPath });
});
