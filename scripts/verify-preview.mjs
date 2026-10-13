import assert from "node:assert/strict";
import puppeteer from "puppeteer";

const baseUrl = process.env.PORTFOLIO_PREVIEW_URL ?? "http://127.0.0.1:4173/Portfolio/";
const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });

try {
  const page = await browser.newPage();
  let traceRequests = 0;
  await page.setRequestInterception(true);
  page.on("request", (request) => {
    if (/api\.ipify\.org|ipapi\.co/.test(request.url())) traceRequests += 1;
    if (new URL(request.url()).origin === new URL(baseUrl).origin) request.continue();
    else request.abort();
  });

  const open = async (route, selector) => {
    await page.goto(new URL(route, baseUrl).href, { waitUntil: "networkidle0" });
    await page.waitForSelector(selector);
  };

  await open("", ".portfolio-root");
  const home = await page.evaluate(() => ({
    title: document.title,
    canonical: document.querySelector('link[rel="canonical"]')?.href,
  }));
  assert.equal(home.canonical, "https://philopatersh.github.io/Portfolio/");
  const imageSizing = await page.evaluate(() =>
    [...document.images]
      .filter((image) => !image.hasAttribute("width") || !image.hasAttribute("height"))
      .map((image) => image.currentSrc || image.src),
  );
  assert.deepEqual(imageSizing, [], "all rendered portfolio images must reserve intrinsic space");
  await page.waitForSelector(".project-card .project-link");
  await page.waitForSelector(".writeup-card .writeup-action-link");
  const contentLinks = await page.$$eval(
    ".project-card .project-link, .writeup-card .writeup-action-link",
    (links) => links.map((link) => ({ href: link.href, label: link.textContent.trim() })),
  );
  assert.ok(contentLinks.length > 0);
  assert.ok(contentLinks.every(({ href }) => href.startsWith("https://")));
  for (const articleUrl of [
    "https://medium.com/@PhilopaterSh/basic-pentesting-walkthrough-2fdd9d0c30d6",
    "https://medium.com/@PhilopaterSh/hackthebox-com-machines-cap-519d78712a82",
    "https://medium.com/@PhilopaterSh/google-xss-game-6dbd1c8b3eb8",
    "https://medium.com/@PhilopaterSh/tryhackme-blue-writeup-walkthrough-with-answers-765c273485e2",
  ]) {
    assert.ok(
      contentLinks.some(({ href }) => href === articleUrl),
      `missing article card: ${articleUrl}`,
    );
  }
  const projectOutcomes = await page.$$eval(".major-project .detail-item", (items) =>
    items
      .filter((item) => item.textContent?.startsWith("Outcome:"))
      .map((item) => item.textContent),
  );

  await open("Resume/", ".ats-cv");
  const resume = await page.evaluate(() => ({
    title: document.title,
    canonical: document.querySelector('link[rel="canonical"]')?.href,
  }));
  assert.match(resume.title, /Resume/);
  assert.equal(resume.canonical, "https://philopatersh.github.io/Portfolio/Resume/");
  const resumeText = await page.$eval(".ats-cv", (node) => node.textContent ?? "");
  assert.ok(projectOutcomes.every((outcome) => resumeText.includes(outcome.trim())));
  assert.doesNotMatch(resumeText, /60% reduction|25%|40% more comprehensive/);

  await open("Resume", ".ats-cv");
  assert.equal(
    await page.$eval('link[rel="canonical"]', (link) => link.href),
    "https://philopatersh.github.io/Portfolio/Resume/",
    "the legacy no-slash URL must resolve to canonical Resume metadata",
  );

  await open("Cybersecurity_Awareness/", ".trace-actions");
  assert.equal(traceRequests, 0, "the awareness page must not initiate a network trace");
  await page.setViewport({ width: 360, height: 800 });
  await page.focus(".nav-toggle");
  await page.keyboard.press("Enter");
  assert.equal(
    await page.$eval(".nav-toggle", (button) => button.getAttribute("aria-expanded")),
    "true",
  );
  await page.keyboard.press("Enter");
  assert.equal(
    await page.$eval(".nav-toggle", (button) => button.getAttribute("aria-expanded")),
    "false",
  );
  await page.locator(".password-input").fill("TestPassphrase42!");
  assert.notEqual(await page.$eval(".entropy-strength-value", (node) => node.textContent), "EMPTY");
  assert.ok(await page.$eval(".checklist-item", (node) => node.textContent.includes("Length")));
  await page.click(".trace-actions .trace-simulate-btn");
  await page.waitForSelector(".trace-simulated-label");
  assert.equal(traceRequests, 0, "the local demo must not contact either provider");

  await open("unknown/", ".not-found-page");
  const notFound = await page.evaluate(() => ({
    title: document.title,
    robots: document.querySelector('meta[name="robots"]')?.content,
    hasCanonical: Boolean(document.querySelector('link[rel="canonical"]')),
  }));
  assert.equal(notFound.robots, "noindex, follow");
  assert.equal(notFound.hasCanonical, false);

  await page.click(".not-found-page a");
  await page.waitForSelector(".portfolio-root");
  assert.equal(
    await page.$eval('link[rel="canonical"]', (link) => link.href),
    "https://philopatersh.github.io/Portfolio/",
    "canonical metadata must return after leaving an unknown route",
  );

  for (const route of ["", "Resume/", "Cybersecurity_Awareness/"]) {
    await page.setViewport({ width: 360, height: 800 });
    await open(route, route === "" ? ".portfolio-root" : "body");
    const dimensions = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      content: document.documentElement.scrollWidth,
    }));
    assert.ok(
      dimensions.content <= dimensions.viewport,
      `${route || "home"} overflows at 360px: ${JSON.stringify(dimensions)}`,
    );
    if (route === "") {
      const cardBounds = await page.$$eval(".project-card, .writeup-card", (cards) =>
        cards.map((card) => ({
          left: card.getBoundingClientRect().left,
          right: card.getBoundingClientRect().right,
        })),
      );
      assert.ok(
        cardBounds.every(({ left, right }) => left >= 0 && right <= 360),
        `project/writeup cards must fit the mobile viewport: ${JSON.stringify(cardBounds)}`,
      );
    }
  }

  console.log(
    JSON.stringify(
      {
        home,
        resume,
        notFound,
        contentLinks: contentLinks.length,
        demoTraceRequests: traceRequests,
        keyboardMenu: "passed",
        passwordEntropyAndChecklist: "passed",
        mobileWidth: 360,
      },
      null,
      2,
    ),
  );
} finally {
  await browser.close();
}
