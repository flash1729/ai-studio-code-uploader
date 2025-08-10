# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-08-10

### Added
- **Initial Release:** First stable version of the AI Studio Code Uploader extension.
- **Core Functionality:** Automatically renames code files to `.txt` on upload via file picker.
- **Drag-and-Drop Support:** Added full support for renaming files from drag-and-drop operations.
- **Configurable Selectors:** Implemented a UI to allow users to configure the CSS selectors for file inputs, making the extension resilient to DOM changes.
- **UX Improvements:**
    - Redesigned popup UI with a clear status indicator.
    - Added a live list of recently renamed files with timestamps.
    - Implemented a keyboard shortcut (`Ctrl+Shift+U`) to quickly enable/disable the extension.
    - Added a disabled icon state for visual feedback.
- **Developer Foundations:**
    - Set up ESLint and Prettier for consistent code style.
    - Added a Docker-based development environment for consistency.
- **Testing Infrastructure:**
    - Established an end-to-end testing suite with Playwright.
    - Created a mock page for isolated testing of extension features.
- **CI/CD Pipeline:**
    - Implemented a GitHub Actions workflow to automate linting, testing, manifest validation, and building a release `.zip` artifact.
