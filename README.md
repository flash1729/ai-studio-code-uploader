# AI Studio Code Uploader

[![CI Status](https://github.com/your-repo/ai-studio-code-uploader/actions/workflows/ci.yml/badge.svg)](https://github.com/your-repo/ai-studio-code-uploader/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An extension that automatically renames code files to `.txt` on upload for Google AI Studio, allowing you to upload your code without manual renaming.

## Features

- **Automatic File Renaming:** Intercepts file uploads on `aistudio.google.com` and renames supported code files to `.txt` in-memory.
- **Drag-and-Drop Support:** Seamlessly handles files that are dragged and dropped onto the page.
- **Configurable File Extensions:** Supports a wide range of common code files by default, and allows you to add your own custom extensions through the popup.
- **Configurable Selectors:** Allows you to define the CSS selectors for file inputs, making the extension resilient to website updates.
- **Quick-Toggle Shortcut:** Use `Ctrl+Shift+U` (`MacCtrl+Shift+U` on Mac) to quickly enable or disable the extension. The icon changes to show the current status.
- **Live Upload Log:** The popup UI shows a live list of the most recently renamed files, including the original name, new name, and timestamp.

## Installation

Once the extension is published, you will be able to install it from the Chrome Web Store.

For now, to install it manually:

1.  Clone this repository or download the source code as a ZIP file.
2.  Open your browser and navigate to `chrome://extensions`.
3.  Enable "Developer mode" using the toggle switch in the top-right corner.
4.  Click the "Load unpacked" button.
5.  Select the directory where you cloned or unzipped the source code.

## Usage

1.  Navigate to [Google AI Studio](https://aistudio.google.com/).
2.  Ensure the extension is enabled (the icon should be in full color).
3.  Click on any file upload button or drag files onto a drop zone.
4.  Select one or more supported code files (e.g., `my_script.py`).
5.  The extension will automatically rename the file to `my_script.txt` before it is uploaded. You can see a log of renamed files in the popup.

## Development

This project uses a Docker-based development environment to ensure consistency and bypass any local environment issues.

### Prerequisites
- Docker Desktop installed and running.

### Setup
1.  Clone the repository.
2.  In the project root, build the container:
    ```bash
    docker-compose build
    ```
3.  To run commands, get an interactive shell into the container:
    ```bash
    docker-compose run --rm shell
    ```
4.  Inside the container shell, you can run all project scripts:
    ```bash
    # Install dependencies
    pnpm install

    # Run linter
    pnpm lint

    # Run tests
    pnpm test
    ```

### Local Development without Docker (If Environment is Correctly Configured)
If your local environment is correctly configured (Node.js v18+, pnpm), you can run commands directly:
1.  Install dependencies: `pnpm install`
2.  Load the extension in your browser using "Load unpacked" as described in the Installation section.
3.  Make changes to the source files.
4.  Reload the extension from the `chrome://extensions` page.

## Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on code style, testing, and how to submit a pull request.
