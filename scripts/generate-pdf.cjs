const puppeteer = require("puppeteer");
const { spawn } = require("child_process");
const { createServer } = require("net");
const path = require("path");

function findFreePort() {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (!address || typeof address === "string") {
        server.close();
        reject(new Error("Could not determine an available preview port."));
        return;
      }
      server.close((error) => (error ? reject(error) : resolve(address.port)));
    });
  });
}

async function waitForPreview(url, processHandle) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < 30000) {
    if (processHandle.exitCode !== null) {
      throw new Error(`Vite preview exited early with code ${processHandle.exitCode}.`);
    }
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(1000) });
      if (response.ok) return;
    } catch {
      // The preview server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error("Vite preview did not become ready within 30 seconds.");
}

async function stopPreview(processHandle) {
  if (processHandle.exitCode !== null) return;
  const stopped = new Promise((resolve) => processHandle.once("close", resolve));
  processHandle.kill();
  await Promise.race([stopped, new Promise((resolve) => setTimeout(resolve, 3000))]);
}

async function generatePdf() {
  const port = await findFreePort();
  const baseUrl = `http://127.0.0.1:${port}/Portfolio/`;
  const viteCli = path.resolve(__dirname, "../node_modules/vite/bin/vite.js");
  const preview = spawn(
    process.execPath,
    [viteCli, "preview", "--host", "127.0.0.1", "--port", String(port), "--strictPort"],
    { stdio: "ignore" },
  );
  let browser;

  try {
    console.log("Waiting for Vite preview server...");
    await waitForPreview(baseUrl, preview);

    console.log("Launching browser...");
    browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 794, height: 1123 });
    const url = `${baseUrl}Resume/`;

    console.log(`Navigating to: ${url}`);
    await page.goto(url, { waitUntil: "networkidle0", timeout: 60000 });
    await page.waitForSelector(".ats-cv", { timeout: 15000 });

    const isResumePage = await page.evaluate(() => {
      return Boolean(document.querySelector(".ats-cv")) && document.title.includes("Resume");
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
  } finally {
    if (browser) await browser.close();
    await stopPreview(preview);
  }
}

generatePdf().catch((error) => {
  console.error("Error during PDF generation:", error);
  process.exitCode = 1;
});
