const puppeteer = require("puppeteer");
const { spawn } = require("child_process");
const path = require("path");

(async () => {
  console.log("Starting Vite preview server...");
  const preview = spawn("npx", ["vite", "preview", "--host", "127.0.0.1", "--port", "4173"], {
    shell: true,
    stdio: "inherit",
  });

  console.log("Waiting for server to be ready...");
  const baseUrl = "http://127.0.0.1:4173/Portfolio/";
  const startedAt = Date.now();
  while (Date.now() - startedAt < 30000) {
    try {
      const response = await fetch(baseUrl);
      if (response.ok) break;
    } catch {
      // The preview server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  console.log("Launching browser...");
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  const url = `${baseUrl}Resume`;

  console.log(`Navigating to: ${url}`);
  try {
    await page.goto(url, {
      waitUntil: "networkidle0",
      timeout: 60000,
    });

    await page.setViewport({ width: 794, height: 1123 });
    await page.waitForSelector(".ats-cv", { timeout: 15000 });

    const isResumePage = await page.evaluate(() => {
      return Boolean(document.querySelector(".ats-cv")) && (document.title.includes("CV") || document.title.includes("Resume"));
    });

    if (!isResumePage) {
      throw new Error("Resume page did not render. Refusing to generate PDF from the wrong route.");
    }

    console.log("Generating PDF...");
    await page.pdf({
      path: path.join(__dirname, "../dist/CV_Philopater.pdf"),
      format: "A4",
      printBackground: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });

    console.log("PDF generated successfully at dist/CV_Philopater.pdf");
  } catch (error) {
    console.error("Error during PDF generation:", error);
    process.exit(1);
  } finally {
    await browser.close();
    preview.kill();
    // Force exit to ensure the preview server is closed
    setTimeout(() => process.exit(0), 1000);
  }
})();
