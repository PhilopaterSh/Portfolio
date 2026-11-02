// Generates resume.json (JSON Resume open standard) from the site's single
// source of truth, src/data/portfolioData.ts, so the CV, the website, and any
// JSON Resume tooling all consume the same facts. Run with --check to verify
// the committed resume.json is still in sync with the site data.
//
// portfolioData.ts imports webp assets through extensionless TS paths, so the
// module is bundled with esbuild (already present via vite) before import.

import { mkdtempSync, rmSync, writeFileSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { build as esbuildBuild } from "esbuild";
import { format as prettierFormat, resolveConfig as prettierResolveConfig } from "prettier";

const ROOT = resolve(import.meta.dirname, "..");
const OUT = join(ROOT, "resume.json");
const CHECK = process.argv.includes("--check");

const MONTHS = {
  jan: "01",
  january: "01",
  feb: "02",
  february: "02",
  mar: "03",
  march: "03",
  apr: "04",
  april: "04",
  may: "05",
  jun: "06",
  june: "06",
  jul: "07",
  july: "07",
  aug: "08",
  august: "08",
  sep: "09",
  sept: "09",
  september: "09",
  oct: "10",
  october: "10",
  nov: "11",
  november: "11",
  dec: "12",
  december: "12",
};

/**
 * Parses a portfolioData period string into schema dates.
 * "Oct 2026 - Present" -> {startDate: "2026-10-01"}; "2020 - 2024" ->
 * {startDate: "2020-01-01", endDate: "2024-12-31"} (year-only values use
 * month/day boundaries by convention, never invented precision).
 * @param {string} period - Display period, e.g. "Dec 2025 - Sep 2026".
 * @returns {{startDate?: string, endDate?: string}} Schema date fields.
 */
function parsePeriod(period) {
  const [rawStart, rawEnd] = period.split("-").map((s) => s.trim());
  const startDate = toIsoDate(rawStart, "01");
  const out = { startDate };
  if (rawEnd && !/present/i.test(rawEnd)) out.endDate = toIsoDate(rawEnd, "12");
  return out;
}

/**
 * Converts "Oct 2026" or "2026" into an ISO date string.
 * @param {string} value - Month-Year or bare year.
 * @param {string} fallbackDay - Day boundary for month-less precision.
 * @returns {string} ISO date, e.g. "2026-10-01".
 */
function toIsoDate(value, fallbackDay) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value; // already ISO
  const [monthName, year] = value.split(" ");
  const month = MONTHS[monthName.toLowerCase()];
  if (month) return `${year}-${month}-${fallbackDay}`;
  // Bare year: apply the month/day boundary that matches the range side.
  return `${monthName}-${fallbackDay}-${fallbackDay === "12" ? "31" : "01"}`;
}

/** Loads the named exports of portfolioData.ts via an esbuild temp bundle. */
async function loadSiteData() {
  const dir = mkdtempSync(join(tmpdir(), "resume-export-"));
  try {
    const bundle = join(dir, "portfolioData.mjs");
    await esbuildBuild({
      entryPoints: [join(ROOT, "src", "data", "portfolioData.ts")],
      bundle: true,
      format: "esm",
      platform: "node",
      outfile: bundle,
      logLevel: "silent",
      // Logos are irrelevant to the resume document; stub them out.
      loader: { ".webp": "empty", ".png": "empty" },
    });
    return await import(pathToFileURL(bundle).href);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

/**
 * Maps the site data onto the JSON Resume schema.
 * @param {Record<string, any>} data - Exports of src/data/portfolioData.ts.
 * @returns {Record<string, any>} JSON Resume document.
 */
function buildResume(data) {
  const {
    about,
    contact,
    experiences,
    projects,
    writeups,
    volunteering,
    certs,
    technicalSkills,
    softSkills,
    languages,
    education,
  } = data;
  const [city, country] = contact.location.split(",").map((s) => s.trim());

  return {
    basics: {
      name: "Philopater Shenouda",
      label: about.field,
      summary: `${about.introduction}\n\n${about.careerObjective}`,
      email: contact.email,
      phone: contact.phone,
      website: "https://philopatersh.github.io/Portfolio/",
      location: { city, country },
      profiles: [
        { network: "GitHub", username: "PhilopaterSh", url: contact.github },
        { network: "LinkedIn", username: "philopater-shenouda", url: contact.linkedin },
        { network: "Medium", username: "@PhilopaterSh", url: contact.medium },
        { network: "TryHackMe", username: "PhilopaterSh", url: contact.tryHackMe },
        { network: "X", username: "PhilopaterSh", url: contact.x },
        { network: "WhatsApp", username: "PhilopaterSh", url: contact.whatsapp },
      ],
    },
    work: experiences.map((e) => {
      // Single-month periods ("Sep 2022") are finite engagements, not ongoing
      // ones: emit an identical start/end so consumers don't render "Present".
      const singleMonth = !e.period.includes("-") && !/present/i.test(e.period);
      const dates = singleMonth
        ? { startDate: toIsoDate(e.period.trim(), "01"), endDate: toIsoDate(e.period.trim(), "01") }
        : parsePeriod(e.period);
      return {
        name: e.company,
        position: e.role,
        location: e.location ?? undefined,
        highlights: e.highlights,
        ...dates,
      };
    }),
    volunteer: volunteering.map((v) => ({
      organization: v.organization,
      position: v.role,
      summary: v.desc,
      startDate: toIsoDate(v.period.split("-")[0].trim(), "01"),
      ...(/present/i.test(v.period)
        ? {}
        : { endDate: toIsoDate(v.period.split("-")[1].trim(), "12") }),
    })),
    education: [
      {
        institution: education.university,
        area: "Information Technology",
        studyType: education.degree,
        ...parsePeriod(education.period),
      },
    ],
    certificates: certs.map((c) => ({ name: c.name, date: toIsoDate(c.date, "01") })),
    projects: projects.map((p) => ({
      name: p.title,
      description: p.desc,
      highlights: [`Problem: ${p.problem}`, `Solution: ${p.solution}`],
      keywords: p.tools,
      url: p.link,
    })),
    skills: technicalSkills.map((s) => ({ name: s.category, keywords: s.items })),
    languages: languages.map((l) => ({ language: l.name, fluency: l.level })),
    interests: softSkills.length
      ? [{ name: "Professional Strengths", keywords: softSkills }]
      : undefined,
    // writeups: not part of the JSON Resume schema; consumed by the site only.
    publications: writeups
      .filter((w) => w.link.includes("medium.com"))
      .map((w) => ({ name: w.title, publisher: "Medium", url: w.link })),
  };
}

const data = await loadSiteData();
const resume = buildResume(data);
// Emit in the repo's Prettier style so the formatting gate and the sync gate
// validate the same bytes.
const prettierConfig = (await prettierResolveConfig(join(ROOT, "package.json"))) ?? {};
const serialized = await prettierFormat(JSON.stringify(resume, null, 2), {
  ...prettierConfig,
  parser: "json",
});

const { validate: rawValidate } = await import("@jsonresume/schema");
// The official validator exposes a callback API: validate(resume, cb(errors, valid)).
const { errors } = await new Promise((resolveValidation) => {
  rawValidate(resume, (validationErrors, valid) =>
    resolveValidation({ errors: valid ? [] : (validationErrors ?? []), valid }),
  );
});
if (errors.length) {
  console.error("resume.json failed JSON Resume schema validation:");
  for (const e of errors) console.error(`- ${e.stack ?? e.message ?? String(e)}`);
  process.exit(1);
}

if (CHECK) {
  const committed = readFileSync(OUT, "utf8");
  if (committed !== serialized) {
    console.error("resume.json is out of sync with src/data/portfolioData.ts.");
    console.error("Run `npm run export:resume` and commit the result.");
    process.exit(1);
  }
  console.log("resume.json is in sync with the site data and schema-valid.");
} else {
  writeFileSync(OUT, serialized);
  console.log(
    `resume.json written: ${Object.keys(resume).length} top-level sections, schema-valid.`,
  );
}
