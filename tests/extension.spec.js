const { test, expect, _chromium } = require("@playwright/test");
const path = require("path");

// Path to the extension
const extensionPath = path.join(__dirname, "..");

test.describe("AI Studio Code Uploader Extension", () => {
  let browserContext;
  let page;

  test.beforeAll(async () => {
    // Launch a persistent browser context with the extension loaded
    browserContext = await _chromium.launchPersistentContext("", {
      headless: false, // Set to true for CI
      args: [
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`,
      ],
    });
  });

  test.afterAll(async () => {
    await browserContext.close();
  });

  test.beforeEach(async () => {
    page = await browserContext.newPage();
    // Navigate to the mock page served locally
    await page.goto("http://localhost:8080/tests/mock_page.html");
  });

  test.afterEach(async () => {
    await page.close();
  });

  test("should rename a file selected via file input", async () => {
    const fileInput = page.locator("#file-input");

    // Create a dummy file to upload
    await fileInput.setInputFiles({
      name: "test.py",
      mimeType: "text/x-python",
      buffer: Buffer.from("print('hello world')"),
    });

    // Check the file name inside the input
    const fileName = await fileInput.evaluate((input) => input.files[0].name);
    expect(fileName).toBe("test.txt");
  });

  test("should rename a file dropped into the drop zone", async () => {
    const dropZone = page.locator("#drop-zone");
    const fileInput = page.locator("#file-input");

    // Create a DataTransfer object to simulate the drop
    const dataTransfer = await page.evaluateHandle(() => {
      const dt = new DataTransfer();
      const file = new File(["console.log('test')"], "test.js", { type: "application/javascript" });
      dt.items.add(file);
      return dt;
    });

    // Dispatch the drop event
    await dropZone.dispatchEvent("drop", { dataTransfer });

    // Check that the file was processed and assigned to the input
    const fileName = await fileInput.evaluate((input) => input.files[0].name);
    expect(fileName).toBe("test.txt");
  });
});
