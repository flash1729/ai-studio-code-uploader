# Contributing to AI Studio Code Uploader

We welcome contributions from the community! Thank you for your interest in improving the extension.

## How to Contribute

1.  **Find an issue:** Look for an existing issue to work on or create a new one to discuss a new feature or bug.
2.  **Fork the repository:** Create your own fork of the project.
3.  **Create a branch:** Create a feature branch from `main` for your changes.
4.  **Make your changes:** Implement your feature or bug fix.
5.  **Submit a Pull Request (PR):** Open a PR from your feature branch to the `main` branch of the original repository.

## Development Setup

Please refer to the [Development section in the README.md](README.md#development) for instructions on how to set up the development environment using Docker.

## Code Style

This project uses [Prettier](https://prettier.io/) for automatic code formatting and [ESLint](https://eslint.org/) for linting.

-   **Formatting:** Please run the formatter before committing your changes.
    ```bash
    pnpm format
    ```
-   **Linting:** Ensure your code passes all linting checks.
    ```bash
    pnpm lint
    ```
The CI pipeline will automatically check for formatting and linting errors on every pull request.

## Testing

This project uses [Playwright](https://playwright.dev/) for end-to-end testing.

-   **Running Tests:** To run the full test suite, use the `test` script.
    ```bash
    pnpm test
    ```
    This will start a local server for the mock page and then run the Playwright tests against it.
-   **Writing Tests:** All new features and bug fixes should be accompanied by corresponding tests in the `tests/` directory.

The CI pipeline will run the full test suite on every pull request.

## Pull Request Process

1.  Ensure your PR is linked to an existing issue.
2.  Make sure your code is well-formatted and passes all linting and testing checks.
3.  Provide a clear and descriptive title and summary for your PR. Explain the "what" and "why" of your changes.
4.  Your PR will be reviewed by a maintainer. Please be prepared to make changes based on the feedback.

Thank you for contributing!
