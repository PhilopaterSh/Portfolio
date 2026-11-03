// CV build verification: text-diff the staged docx against the approved
// outputs, sweep forbidden dashes, assert SSOT-sourced periods, and report
// PDF page counts via LibreOffice when available. Local tool - the approved
// paths live outside the repository.
// usage: node cv-build/verify_cv.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import AdmZip from "adm-zip";
import { execFileSync } from "node:child_process";

const CVDIR = path.dirname(fileURLToPath(import.meta.url));
const APPROVED = {
  master: "D:/CV/Master General CV/Philopater Shenouda CV - Master 2026-11.docx",
  onepage: "D:/CV/Master General CV/Philopater Shenouda CV - Penetration Tester - 1 Page.docx",
};
const STAGED = {
  master: path.join(CVDIR, "staging-master.docx"),
  onepage: path.join(CVDIR, "staging-onepage.docx"),
};
const resume = JSON.parse(fs.readFileSync(path.join(CVDIR, "..", "resume.json"), "utf8"));

let failures = 0;
const fail = (msg) => {
  failures += 1;
  console.error("FAIL:", msg);
};

/** Extracts visible text from a docx (document.xml, tags stripped). */
function docxText(file) {
  const zip = new AdmZip(file);
  const xml = zip.readAsText("word/document.xml");
  return xml
    .replace(/<\/w:p>/g, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{2,}/g, "\n")
    .trim();
}
const norm = (s) => s.replace(/\s+/g, " ").trim();

// 1. Text regression: staged vs approved (whitespace-normalized).
for (const variant of Object.keys(STAGED)) {
  const a = norm(docxText(APPROVED[variant]));
  const b = norm(docxText(STAGED[variant]));
  if (a === b) {
    console.log(`PASS: ${variant} text identical to approved output (${a.length} chars)`);
  } else {
    fail(`${variant} text differs from approved output`);
    const aw = new Set(a.split(" "));
    const bw = new Set(b.split(" "));
    console.error(
      "  only-in-approved:",
      [...aw]
        .filter((w) => !bw.has(w))
        .slice(0, 12)
        .join(" | "),
    );
    console.error(
      "  only-in-staged:  ",
      [...bw]
        .filter((w) => !aw.has(w))
        .slice(0, 12)
        .join(" | "),
    );
  }
}

// 2. Dash sweep (humanizer rule): no em/en dashes in staged text.
for (const variant of Object.keys(STAGED)) {
  const text = docxText(STAGED[variant]);
  const bad = text.match(/[\u2013\u2014]/g);
  if (bad) fail(`${variant} contains ${bad.length} em/en dash(es)`);
  else console.log(`PASS: ${variant} dash sweep = 0`);
  if (/undefined|NaN/.test(text)) fail(`${variant} contains undefined/NaN`);
}

// 3. SSOT cross-check: the work entries the CV renders in full must carry the
// exact resume.json periods (compressed/omitted entries are curated, not drift).
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const isoToMon = (iso) => `${MONTHS[Number(iso.split("-")[1]) - 1]} ${iso.slice(0, 4)}`;
const masterText = norm(docxText(STAGED.master));
const CURATED = [
  "Classera",
  "Digilians Pioneers",
  "Bug Bounty Hunter",
  "National Telecommunication Institute (NTI)",
  "Digital Egypt Pioneers Initiative (DEPI)",
];
for (const key of CURATED) {
  const w = resume.work.find((x) => x.name === key);
  if (!w) {
    fail(`resume.json has no work entry "${key}"`);
    continue;
  }
  const start = isoToMon(w.startDate);
  const end = w.endDate ? isoToMon(w.endDate) : "Present";
  const needle = w.endDate ? `${start} - ${end}` : `${start} - Present`;
  if (!masterText.includes(needle)) fail(`master missing SSOT period "${needle}" for ${key}`);
}
console.log("PASS: curated resume.json work periods present in master text");

// 4. PDF page counts via LibreOffice (informational; expected master=2, onepage=1).
const candidates = [
  "soffice",
  "C:/Program Files/LibreOffice/program/soffice.exe",
  "C:/Program Files (x86)/LibreOffice/program/soffice.exe",
];
let soffice = null;
for (const c of candidates) {
  try {
    execFileSync(c, ["--version"], { stdio: "pipe", timeout: 20000 });
    soffice = c;
    break;
  } catch {
    // try next candidate
  }
}
if (soffice) {
  for (const variant of Object.keys(STAGED)) {
    execFileSync(
      soffice,
      ["--headless", "--convert-to", "pdf", "--outdir", CVDIR, STAGED[variant]],
      { stdio: "pipe", timeout: 120000 },
    );
    const pdf = STAGED[variant].replace(/\.docx$/, ".pdf");
    const raw = fs.readFileSync(pdf, "latin1");
    const count = (raw.match(/\/Type\s*\/Page[^s]/g) || []).length;
    console.log(`INFO: ${variant} PDF pages = ${count}`);
  }
} else {
  console.log("INFO: LibreOffice not found - PDF page count skipped");
}

console.log(
  failures
    ? `VERIFY FAILED: ${failures} failure(s)`
    : "VERIFY OK: staged builds match approved outputs",
);
process.exit(failures ? 1 : 0);
