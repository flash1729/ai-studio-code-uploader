# Privacy Policy for AI Studio Code Uploader

**Last Updated:** 2025-08-10

This Privacy Policy describes how the AI Studio Code Uploader browser extension ("the extension") handles your data.

## Data Collection and Usage

The AI Studio Code Uploader extension is designed with your privacy in mind.

-   **No Personal Data is Collected:** We do not collect, store, or transmit any of your personal information.
-   **No Server-Side Processing:** All the extension's functionality, including file renaming, happens locally within your browser. No data is sent to any external servers owned or operated by us.
-   **Settings Synchronization:** The extension uses `chrome.storage.sync` to save your preferences (such as custom file extensions and target selectors). This data is managed by your browser and synchronized across your devices where you are logged into the same browser account. This data is not accessible to us.
-   **Local History:** The extension uses `chrome.storage.local` to keep a temporary log of recently renamed files for your convenience. This data is stored only on your local machine and is not transmitted anywhere. You can clear this history at any time from the extension's popup.

## Permissions

The extension requests the following permissions to function:

-   `scripting`: To run the file processing logic on the `aistudio.google.com` domain.
-   `storage`: To save your settings and the local rename history.
-   `action`: To update the extension's icon to show its enabled/disabled status.
-   `notifications`: Reserved for future features to provide feedback. Currently unused.

## Changes to This Policy

We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.

## Contact Us

If you have any questions about this Privacy Policy, please open an issue on our [GitHub repository](https://github.com/your-repo/ai-studio-code-uploader).
