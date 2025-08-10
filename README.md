# AI Studio Code Uploader

A Chrome extension that automatically renames code files to `.txt` on upload for Google AI Studio, allowing you to upload your code without manual renaming.

## Features

- **Automatic Renaming:** Intercepts file uploads on `aistudio.google.com` and renames supported code files to `.txt` in-memory.
- **Wide Language Support:** Works with a comprehensive list of common programming and configuration file extensions.
- **Seamless Integration:** Works with standard file inputs and dynamically loaded content.
- **User-Friendly Popup:** Provides a simple UI to enable/disable the extension and view recent activity.
- **Secure and Private:** No data is collected or transmitted. All operations happen locally in your browser.

## Supported File Types

The extension supports the following file extensions:

`.py`, `.js`, `.ts`, `.cpp`, `.c`, `.cs`, `.java`, `.go`, `.php`, `.rs`, `.md`, `.json`, `.yml`, `.yaml`, `.html`, `.css`, `.sh`, `.bat`, `.pl`, `.rb`, `.jsx`, `.tsx`, `.vue`, `.svelte`, `.dart`, `.kt`, `.swift`, `.r`, `.sql`, `.xml`, `.toml`, `.ini`, `.cfg`, `.conf`

**Custom Extensions:** You can easily add any custom file extensions you want through the extension's popup interface. Simply click on the extension icon in your Chrome toolbar and use the "Custom Extensions" section to add any file type you need (e.g., `.log`, `.diff`, `.config`, etc.).

## Installation

1.  Download the `ai-studio-code-uploader` directory or clone the repository.
2.  Open Google Chrome and navigate to `chrome://extensions`.
3.  Enable "Developer mode" using the toggle switch in the top-right corner.
4.  Click the "Load unpacked" button.
5.  Select the `ai-studio-code-uploader` directory.

The extension is now installed and active.

## How to Use

1.  Navigate to [Google AI Studio](https://aistudio.google.com/).
2.  Click on any file upload button.
3.  Select one or more supported code files (e.g., `my_script.py`).
4.  The extension will automatically rename the file to `my_script.txt` before it is uploaded. You can see a log of renamed files in the popup.

## Development

To set up the development environment:

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/ai-studio-code-uploader.git
    ```
2.  Follow the installation steps above to load the extension in Chrome.
3.  Make changes to the source files (`content-script.js`, `popup.html`, etc.).
4.  Go to `chrome://extensions` and click the "Reload" button for the extension to apply your changes.

## Troubleshooting

- **Extension not working:** Ensure the extension is enabled in `chrome://extensions` and on the popup UI. Check the browser's developer console (F12) on the AI Studio page for any error messages from `[AI Studio Uploader]`.
- **File not renamed:** Make sure the file extension is in the supported list. If not, you can add it to the `SUPPORTED_EXTENSIONS` set in `content-script.js`.

## License

This project is licensed under the MIT License.
