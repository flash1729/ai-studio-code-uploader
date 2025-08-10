import "./vendor/browser-polyfill.js";

/**
 * @file background.js
 * @description Service worker for the extension, handles commands and other background tasks.
 */

// Listen for the command to toggle the extension's enabled state
browser.commands.onCommand.addListener(async (command) => {
  if (command === "toggle-extension") {
    // Get the current state
    const { extensionEnabled = true } = await browser.storage.sync.get("extensionEnabled");

    // Flip the state
    const newState = !extensionEnabled;

    // Save the new state
    await browser.storage.sync.set({ extensionEnabled: newState });

    // Optional: Update the icon to reflect the new state
    const iconPath = newState ? "icons/icon128.png" : "icons/logo-disabled.png"; // Use a specific icon size
    browser.action.setIcon({ path: iconPath });
  }
});

// Also, listen for startup to set the initial icon state
browser.runtime.onStartup.addListener(async () => {
  const { extensionEnabled = true } = await browser.storage.sync.get("extensionEnabled");
  const iconPath = extensionEnabled ? "icons/icon128.png" : "icons/logo-disabled.png";
  browser.action.setIcon({ path: iconPath });
});

// And when the extension is installed
browser.runtime.onInstalled.addListener(async () => {
    const { extensionEnabled = true } = await browser.storage.sync.get("extensionEnabled");
    const iconPath = extensionEnabled ? "icons/icon128.png" : "icons/logo-disabled.png";
    browser.action.setIcon({ path: iconPath });
});
