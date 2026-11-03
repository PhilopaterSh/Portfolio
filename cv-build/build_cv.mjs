// CV builder - Philopater Shenouda (2026-11) - dual variant from one source.
// FACTS LAYER: drift-prone facts (work periods, contact, profile links, cert
// issue dates, volunteering ranges) come from ../resume.json (JSON Resume
// standard, generated from src/data/portfolioData.ts) with fail-loud drift
// exits. Deliberate CV tailoring (display names, bullet phrasing, credential
// IDs) stays here. CONFIDENTIAL bullets (Classera engagement detail, ITechPro
// program) live in cv-build/cv.private.json which is gitignored - the build
// fails loudly when that file is absent, because the full CV is a local-only
// artifact by design.
// usage: node cv-build/build_cv.mjs [out.docx] [--onepage]
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  TabStopType,
  BorderStyle,
} from "docx";

const CVDIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(CVDIR, "..");
const PRIVATE_PATH = path.join(CVDIR, "cv.private.json");

const ONEPAGE = process.argv.includes("--onepage");
const OUT_ARG = process.argv.slice(2).find((a) => !a.startsWith("--"));
const OUT = OUT_ARG || path.join(CVDIR, ONEPAGE ? "staging-onepage.docx" : "staging-master.docx");
const RESUME_PATH = path.join(ROOT, "resume.json");

const resume = JSON.parse(fs.readFileSync(RESUME_PATH, "utf8"));
const b = resume.basics;
const PROFILES = {};
for (const p of b.profiles) PROFILES[p.network.toLowerCase()] = p.url;
const stripUrl = (u) => u.replace(/^https?:\/\//, "").replace(/\/$/, "");

let PRIVATE = null;
if (fs.existsSync(PRIVATE_PATH)) {
  PRIVATE = JSON.parse(fs.readFileSync(PRIVATE_PATH, "utf8"));
} else {
  console.error(`MISSING ${PRIVATE_PATH}`);
  console.error("The full CV embeds confidential engagement bullets that live only in the");
  console.error("local, gitignored cv.private.json - the CV is a local-only artifact by design.");
  process.exit(1);
}
const privateWork = (key) => {
  const entry = PRIVATE?.work?.[key];
  if (!entry) {
    console.error(`cv.private.json has no work entry "${key}"`);
    process.exit(1);
  }
  return entry;
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const isoToMon = (iso) => {
  const [y, m] = iso.split("-");
  return `${MONTHS[Number(m) - 1]} ${y}`;
};
// Year-precision values (convention: month-day 01-01 / 12-31) display as bare years.
const isoToDisplay = (iso, isEnd) => {
  const [, m, d] = iso.split("-");
  const yearOnly = isEnd ? m === "12" && d === "31" : m === "01" && d === "01";
  return yearOnly ? iso.slice(0, 4) : isoToMon(iso);
};
const rangeOf = (w) =>
  w.endDate
    ? `${isoToDisplay(w.startDate)} - ${isoToDisplay(w.endDate, true)}`
    : `${isoToDisplay(w.startDate)} - Present`;

const WORK = {};
for (const w of resume.work) WORK[w.name] = w;
const RANGE = (key) => {
  const w = WORK[key];
  if (!w) {
    console.error(`SSOT DRIFT: work entry "${key}" not found in ${RESUME_PATH}`);
    process.exit(1);
  }
  return rangeOf(w);
};
const certDate = (keyPrefix) => {
  const c = resume.certificates.find((c) => c.name.startsWith(keyPrefix));
  if (!c) {
    console.error(`SSOT DRIFT: certificate "${keyPrefix}" not found in ${RESUME_PATH}`);
    process.exit(1);
  }
  return isoToMon(c.date);
};
const volRange = (org) => {
  const v = resume.volunteer.find((x) => x.organization === org);
  if (!v) {
    console.error(`SSOT DRIFT: volunteering entry "${org}" not found in ${RESUME_PATH}`);
    process.exit(1);
  }
  return rangeOf(v);
};
// The CV compresses the ongoing Scouts role to its start year; the SSOT keeps
// month precision ("May 2019").
const volStartYear = (org) =>
  volRange(org) && resume.volunteer.find((x) => x.organization === org).startDate.slice(0, 4);

const R_CLASSERA = RANGE("Classera");
const R_DIGILIANS = RANGE("Digilians Pioneers");
const R_BOUNTY = RANGE("Bug Bounty Hunter");
const R_NTI = RANGE("National Telecommunication Institute (NTI)");
const R_DEPI = RANGE("Digital Egypt Pioneers Initiative (DEPI)");
const R_SCOUTS_YEAR = volStartYear("Egyptian Air Scouts Association");
const R_DECI = volRange("Digital Egypt Cubs Initiative (DECI)");

const PRIVATE_CLASSERA = privateWork("Classera");
const PRIVATE_ITECHPRO = privateWork("ITechPro");

const C = { dark: "1A3352", accent: "2980B9", body: "2C3E50", sec: "5D6D7E" };

const SZ = ONEPAGE
  ? {
      name: 38,
      headline: 19,
      contact: 16,
      heading: 20,
      entry: 18,
      body: 17,
      line: 256,
      headBefore: 60,
      headAfter: 24,
      bulletAfter: 2,
      entryBefore: 36,
      entryAfter: 4,
      MARGIN: 720,
    }
  : {
      name: 40,
      headline: 20,
      contact: 17,
      heading: 22,
      entry: 20,
      body: 19,
      line: 276,
      headBefore: 150,
      headAfter: 50,
      bulletAfter: 20,
      entryBefore: 100,
      entryAfter: 10,
      MARGIN: 850,
    };

const FONT = "Calibri";
const CONTENT_W = 11906 - SZ.MARGIN * 2;

const t = (text, opts = {}) =>
  new TextRun({ text, font: FONT, size: SZ.body, color: C.body, ...opts });

const sectionHeading = (txt) =>
  new Paragraph({
    keepNext: true,
    spacing: { before: SZ.headBefore, after: SZ.headAfter, line: SZ.line },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: C.accent, space: 2 } },
    children: [t(txt, { size: SZ.heading, bold: true, color: C.accent })],
  });

const entryLine = (company, role, date, extra = null) => {
  const kids = [
    t(company + "  ", { size: SZ.entry, bold: true, color: C.dark }),
    t("|  " + role, { size: SZ.entry, color: C.accent }),
  ];
  if (extra) kids.push(t("  " + extra, { size: SZ.entry - 1, color: C.sec }));
  kids.push(new TextRun({ text: "\t" + date, font: FONT, size: SZ.entry - 2, color: C.sec }));
  return new Paragraph({
    keepNext: true,
    spacing: { before: SZ.entryBefore, after: SZ.entryAfter, line: SZ.line },
    tabStops: [{ type: TabStopType.RIGHT, position: CONTENT_W }],
    children: kids,
  });
};

const bullet = (runs, opts = {}) => {
  const children = Array.isArray(runs) ? runs : [t(runs)];
  return new Paragraph({
    spacing: { before: 0, after: SZ.bulletAfter, line: SZ.line },
    indent: { left: 240, hanging: 240 },
    children: [t("\u2022  ", { color: C.accent, bold: true }), ...children],
    ...opts,
  });
};

const bodyPara = (runs, opts = {}) => {
  const children = Array.isArray(runs) ? runs : [t(runs)];
  return new Paragraph({
    spacing: { before: 0, after: SZ.bulletAfter, line: SZ.line },
    children,
    ...opts,
  });
};

// ---------------- shared header ----------------
const children = [];
children.push(
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 10, line: SZ.line },
    children: [t("PHILOPATER SHENOUDA", { size: SZ.name, bold: true, color: C.dark })],
  }),
);
children.push(
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 20, line: SZ.line },
    children: [
      t("Penetration Tester | Web & Network VAPT | Bug Bounty (HackerOne \u00b7 Bugcrowd)", {
        size: SZ.headline,
        bold: true,
        color: C.accent,
      }),
    ],
  }),
);
children.push(
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 5, line: SZ.line },
    children: [
      t(
        `${b.location.city}, ${b.location.country} \u00b7 ${b.phone.replace(/^(\+\d{2})(\d{3})(\d{3})(\d{4})$/, "$1 $2 $3 $4")} \u00b7 ${b.email}`,
        { size: SZ.contact },
      ),
    ],
  }),
);
children.push(
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 20, line: SZ.line },
    children: [
      t(
        `${stripUrl(PROFILES.linkedin)} \u00b7 ${stripUrl(PROFILES.github)} \u00b7 ${stripUrl(b.website)} \u00b7 ${stripUrl(PROFILES.medium)}`,
        { size: SZ.contact },
      ),
    ],
  }),
);

// ---------------- PROFILE ----------------
children.push(sectionHeading("PROFILE"));
const profileTail = ONEPAGE
  ? "Builds Go/Python security automation, including an autonomous AI-assisted pentesting framework, and publishes reproducible findings with OWASP, NIST, and ISO 27001-aligned remediation."
  : "Builds production-grade security automation in Go and Python, including an autonomous AI-assisted pentesting framework, and publishes reproducible findings with OWASP, NIST, and ISO 27001-aligned remediation guidance.";
children.push(
  bodyPara(
    "Penetration Tester Trainee at Classera delivering authorized web and API security assessments, backed by a 1,330-hour national cybersecurity scholarship (Digilians, Egyptian Military Academy) and 2,100+ hours of structured security training. Huawei HCIA-Datacom and Fortinet NSE 4 certified, with a responsible-disclosure track record on HackerOne and Bugcrowd covering IDOR, broken access control, XSS, and OTP/MFA logic bypasses. " +
      profileTail,
  ),
);

// ---------------- CORE SKILLS ----------------
children.push(sectionHeading("CORE SKILLS"));
const skills = ONEPAGE
  ? [
      [
        "Offensive Security:",
        " Web & Network Penetration Testing, API Security Testing, Bug Bounty, Vulnerability Assessment, OWASP Top 10 / API Top 10, Privilege Escalation, Active Directory.",
      ],
      [
        "Tools & Automation:",
        " Burp Suite, Nmap, Metasploit, Nessus, OpenVAS, Wireshark, Hydra, Scapy, Kali Linux \u00b7 Go, Python, Bash, PowerShell, Git & GitHub, AI/LLM agent tooling (LangChain, local LLMs).",
      ],
      [
        "Network Security & GRC:",
        " FortiGate administration (FortiOS 7.6: policies, NAT, IPsec VPN, threat prevention), Routing & Switching (HCIA-Datacom, CCNA-equivalent) \u00b7 Technical & executive report writing, CVSS v3.1, OWASP ASVS, NIST CSF 2.0, ISO 27001, Incident Response (ECIH).",
      ],
    ]
  : [
      [
        "Offensive Security:",
        " Web & Network Penetration Testing, API Security Testing, Bug Bounty, Vulnerability Assessment, OWASP Top 10 / API Top 10, Privilege Escalation, Active Directory.",
      ],
      [
        "Tools:",
        " Burp Suite, Nmap, Metasploit, Nessus, OpenVAS, Wireshark, Hydra, Scapy, Kali Linux.",
      ],
      [
        "Automation & AI:",
        " Go (Golang), Python, Bash, PowerShell, Git & GitHub, AI/LLM agent security tooling (LangChain, local LLMs).",
      ],
      [
        "Network Security:",
        " FortiGate administration (FortiOS 7.6: security policies, NAT, IPsec VPN, threat prevention), Routing & Switching (HCIA-Datacom, CCNA-equivalent), VLANs, DNS/DHCP security.",
      ],
      [
        "Reporting & GRC:",
        " Technical & executive vulnerability report writing, CVSS v3.1, OWASP ASVS, NIST CSF 2.0, ISO 27001, Incident Response (ECIH).",
      ],
    ];
for (const [label, rest] of skills) {
  children.push(
    bodyPara([t(label, { bold: true, color: C.dark }), t(rest)], { indent: { left: 40 } }),
  );
}

// ---------------- EXPERIENCE ----------------
children.push(sectionHeading("PROFESSIONAL EXPERIENCE"));

// Classera: public one-liner on the site; engagement-detail bullets are
// confidential and live only in cv.private.json.
children.push(
  entryLine(
    "Classera",
    "Penetration Tester Trainee",
    R_CLASSERA,
    PRIVATE_CLASSERA.location ?? "Cairo",
  ),
);
for (const text of ONEPAGE ? PRIVATE_CLASSERA.bullets.onepage : PRIVATE_CLASSERA.bullets.master) {
  children.push(bullet(text));
}

children.push(
  entryLine(
    "ITechPro",
    "Product Security Assessment Trainee (PT-03)",
    PRIVATE_ITECHPRO.period,
    PRIVATE_ITECHPRO.location ?? "Remote, Part-time",
  ),
);
for (const text of ONEPAGE ? PRIVATE_ITECHPRO.bullets.onepage : PRIVATE_ITECHPRO.bullets.master) {
  children.push(bullet(text));
}

children.push(
  entryLine("Digilians Pioneers (MCIT National Scholarship)", "Cybersecurity Trainee", R_DIGILIANS),
);
if (ONEPAGE) {
  children.push(
    bullet(
      "Selected for a fully funded residential 9-month diploma (1,330 accredited hours) at the Egyptian Military Academy with MCIT, NTI, Google, AWS, Palo Alto Networks, and Fortinet.",
    ),
  );
  children.push(
    bullet(
      "Executed red/blue team operations in enterprise-simulated environments: web pentesting (OWASP Top 10), network exploitation, digital forensics, malware analysis, and incident triage; configured FortiOS 7.6 NGFWs (policies, NAT, IPsec VPN, threat prevention) and enterprise routing/switching aligned with HCIA-Datacom standards.",
    ),
  );
  children.push(
    bullet([
      t("Capstone: ", { bold: true, color: C.dark }),
      t("led a technical team building "),
      t("Argus", { bold: true, color: C.dark }),
      t(
        ", an autonomous AI framework automating reconnaissance and vulnerability-discovery workflows in an air-gapped environment.",
      ),
    ]),
  );
} else {
  children.push(
    bullet(
      "Selected for a fully funded, residential 9-month diploma (1,330 accredited hours) at the Egyptian Military Academy with MCIT, NTI, Google, AWS, Palo Alto Networks, and Fortinet.",
    ),
  );
  children.push(
    bullet(
      "Executed hands-on red and blue team operations in enterprise-simulated environments: web application pentesting (OWASP Top 10), network vulnerability exploitation, digital forensics, malware behavior analysis, and incident triage to detect and mitigate simulated threats.",
    ),
  );
  children.push(
    bullet(
      "Configured enterprise perimeter security on Fortinet FortiOS 7.6 NGFWs (security policies, NAT, IPsec VPN tunnels, threat prevention modules) and enterprise routing/switching aligned with Huawei HCIA-Datacom standards.",
    ),
  );
  children.push(
    bullet([
      t("Capstone: ", { bold: true, color: C.dark }),
      t("led a technical team building "),
      t("Argus", { bold: true, color: C.dark }),
      t(
        ", an autonomous AI framework automating reconnaissance and initial vulnerability-discovery workflows within a secure, air-gapped local environment.",
      ),
    ]),
  );
}

children.push(
  entryLine(
    "Independent Security Researcher",
    "Bug Bounty (HackerOne / Bugcrowd)",
    R_BOUNTY,
    "Part-time",
  ),
);
if (ONEPAGE) {
  children.push(
    bullet(
      "Discovered, validated, and responsibly disclosed high-severity vulnerabilities across enterprise scopes: IDOR, broken access control, PII exposure, XSS, and OTP/MFA logic bypasses; authored reproducible PoCs and remediation steps that earned accepted reports and bounties.",
    ),
  );
} else {
  children.push(
    bullet(
      "Discovered, validated, and responsibly disclosed high-severity vulnerabilities across enterprise scopes: IDOR, broken access control, PII exposure, XSS, and OTP/MFA logic bypasses.",
    ),
  );
  children.push(
    bullet(
      "Demonstrated impact by manipulating HTTP requests, bypassing multi-factor authentication (MFA) logic, and escalating to administrative privileges; authored reproducible technical PoCs with clear remediation steps that earned accepted reports and vendor bounties.",
    ),
  );
}

children.push(
  entryLine("National Telecommunication Institute (NTI)", "Ethical Hacking Intern", R_NTI),
);
if (ONEPAGE) {
  children.push(
    bullet(
      "Completed a 288-hour intensive program simulating advanced web, network, and mobile Red Team exercises against enterprise and Active Directory environments; automated reconnaissance and packet-manipulation workflows with custom Python and Go scripts using Nmap, Burp Suite, Metasploit, and Wireshark.",
    ),
  );
} else {
  children.push(
    bullet(
      "Completed a 288-hour intensive program simulating advanced web, network, and mobile Red Team exercises and real-world attack campaigns against enterprise network architectures and Active Directory environments.",
    ),
  );
  children.push(
    bullet(
      "Utilized Nmap, Burp Suite, Metasploit, Wireshark, and Hydra for structured reconnaissance, exploitation, and post-exploitation; developed custom Python and Go scripts automating network packet manipulation and exploit research workflows.",
    ),
  );
}

children.push(
  entryLine(
    "Digital Egypt Pioneers Initiative (DEPI, MCIT)",
    "Vulnerability Analyst Intern",
    R_DEPI,
  ),
);
if (ONEPAGE) {
  children.push(
    bullet(
      "Conducted automated and manual vulnerability analysis (Nessus, OpenVAS) mapped to NIST CSF and ISO 27001, manually validating severity to eliminate false positives; exploited OWASP Top 10 flaws (SQLi, XSS, CSRF) in staging environments and TryHackMe / HackTheBox / PortSwigger labs.",
    ),
  );
} else {
  children.push(
    bullet(
      "Conducted automated and manual vulnerability analysis using Nessus and OpenVAS, mapping infrastructure flaws to NIST CSF and ISO 27001 compliance frameworks; manually validated severity against OWASP Top 10 standards to eliminate false positives.",
    ),
  );
  children.push(
    bullet(
      "Exploited OWASP Top 10 flaws (SQLi, XSS, CSRF) within simulated staging environments; executed vulnerability assessments and pentests on complex lab systems (TryHackMe, HackTheBox, PortSwigger) using Metasploit, Burp Suite, and Kali Linux.",
    ),
  );
}

if (!ONEPAGE) {
  children.push(
    bullet(
      [
        t("Additional Experience: ", { bold: true, color: C.dark }),
        t(
          `YAT Learning Centers - Technical Trainer (100+ students in computer science and cybersecurity, +30% measured comprehension, 2024 - 2025) \u00b7 Digital Fortress EG - Penetration Testing Intern (live-target reconnaissance, exploitation, and reporting, 2025).`,
        ),
      ],
      { indent: { left: 40, hanging: 0 }, spacing: { before: 60, after: 0, line: SZ.line } },
    ),
  );
}

// ---------------- PROJECTS ----------------
children.push(sectionHeading("SECURITY PROJECTS & OPEN SOURCE"));
if (ONEPAGE) {
  children.push(
    bullet([
      t("Argus", { bold: true, color: C.dark }),
      t(
        " (Python, LangChain, local LLMs) \u00b7 github.com/PhilopaterSh/Argus-Digilians - integrates 21 registered security tools automating reconnaissance, contextual attack workflows, and report generation; hardened public release with OWASP-aligned fixes (XSRF protection, dependency hash pinning, shell-injection quoting) and CI gating.",
      ),
    ]),
  );
  children.push(
    bullet([
      t("Ph.Sh_URL", { bold: true, color: C.dark }),
      t(
        " (Go) \u00b7 github.com/PhilopaterSh/Ph.Sh_URL - concurrent URL extraction aggregating passive threat-intelligence feeds; cut reconnaissance time 60%, raised sensitive-endpoint discovery 25% \u00b7 ",
      ),
      t("Ph.Sh-Subdomain", { bold: true, color: C.dark }),
      t(
        " (Go) \u00b7 github.com/PhilopaterSh/Ph.Sh-Subdomain - multi-source subdomain enumeration, 40% broader attack-surface coverage \u00b7 ",
      ),
      t("Publications: ", { bold: true, color: C.dark }),
      t("7 Medium writeups + HCIA-Datacom V2.0 GitBook study guide."),
    ]),
  );
} else {
  children.push(
    bullet([
      t("Argus - Autonomous AI-Assisted Pentesting Framework", { bold: true, color: C.dark }),
      t(
        " (Python, LangChain, local LLMs) \u00b7 github.com/PhilopaterSh/Argus-Digilians: integrates 21 registered security tools automating reconnaissance, contextual attack workflows, and report generation; hardened public release with OWASP-aligned fixes (XSRF protection, dependency hash pinning, shell-injection quoting) and CI gating.",
      ),
    ]),
  );
  children.push(
    bullet([
      t("Ph.Sh_URL", { bold: true, color: C.dark }),
      t(
        " (Go) \u00b7 github.com/PhilopaterSh/Ph.Sh_URL: concurrent URL extraction and filtering tool aggregating multiple passive threat-intelligence feeds; cut reconnaissance time 60% and raised sensitive-endpoint discovery 25% during bug bounty work.",
      ),
    ]),
  );
  children.push(
    bullet([
      t("Ph.Sh-Subdomain", { bold: true, color: C.dark }),
      t(
        " (Go) \u00b7 github.com/PhilopaterSh/Ph.Sh-Subdomain: asynchronous multi-source subdomain enumeration combining passive APIs with concurrent DNS resolution; 40% broader attack-surface coverage than single-source tools.",
      ),
    ]),
  );
  children.push(
    bullet([
      t("Publications: ", { bold: true, color: C.dark }),
      t(
        "7 Medium security writeups + a published HCIA-Datacom V2.0 GitBook study guide (medium.com/@PhilopaterSh).",
      ),
    ]),
  );
}

// ---------------- CERTIFICATIONS ----------------
children.push(sectionHeading("CERTIFICATIONS"));
const certs = [
  `eLearnSecurity Junior Penetration Tester (eJPT) - INE / Netriders (ID: e3846066b91b6ddd) \u00b7 ${certDate("eLearnSecurity Junior PT")}`,
  `Fortinet NSE 4 - FortiOS Administrator (FCP - FortiGate Administrator) - Fortinet (ID: 1291801951PS) \u00b7 ${certDate("Fortinet NSE 4")} \u00b7 valid to Aug 2028`,
  `EC-Council Certified Incident Handler (ECIH v2) - EC-Council (ID: 710621) \u00b7 ${certDate("EC-Council Certified Incident Handler")}`,
  `Google Cybersecurity Professional Certificate - Google (ID: 7PUFLHHFI89P) \u00b7 ${certDate("Google Cybersecurity Professional Certificate")}`,
  `Huawei HCIA-Datacom V2.0 - Huawei (ID: 010103901855810455291409) \u00b7 ${certDate("Huawei HCIA-Datacom")} \u00b7 valid to Oct 2029`,
];
for (const c of certs) children.push(bullet(c));
if (!ONEPAGE) {
  children.push(
    bullet(
      "Selected training: Red Hat System Administration I (MaharaTech / ITI, 2023) \u00b7 Hack The Box Information Gathering - Web (2026) \u00b7 DEPI VAPT Track (240h, 2024)",
    ),
  );
}

// ---------------- EDUCATION ----------------
children.push(sectionHeading("EDUCATION"));
children.push(
  entryLine(
    "The Egyptian E-Learning University (EELU)",
    "Bachelor of Information Technology",
    "Sep 2020 - Jun 2024",
  ),
);
children.push(
  bullet(
    "GPA 3.08/4.0 \u00b7 Graduation Project: Electronics E-store (Grade: A+) - Python ML models + Flask REST microservice integrated with a PHP e-commerce backend.",
  ),
);

// ---------------- LEADERSHIP / LANGUAGES ----------------
if (!ONEPAGE) {
  children.push(sectionHeading("LEADERSHIP & VOLUNTEERING"));
  children.push(
    bodyPara(
      `Assistant Group Leader & Youth Mentor, Egyptian Air Scouts Association (${R_SCOUTS_YEAR} - Present) \u00b7 Volunteer Technical Mentor, Digital Egypt Cubs Initiative (${R_DECI}).`,
    ),
  );
}
if (ONEPAGE) {
  children.push(
    bodyPara(
      [
        t("LANGUAGES: ", { bold: true, color: C.dark }),
        t("Arabic (Native) \u00b7 English (Conversational / Professional)"),
      ],
      { spacing: { after: 0, line: SZ.line } },
    ),
  );
} else {
  children.push(sectionHeading("LANGUAGES"));
  children.push(
    bodyPara("Arabic: Native \u00b7 English: Conversational / Professional", {
      spacing: { after: 0, line: SZ.line },
    }),
  );
}

// ---------------- build ----------------
const doc = new Document({
  creator: "Philopater Shenouda",
  title: "Philopater Shenouda CV - Penetration Tester",
  description: ONEPAGE ? "1-page application variant" : "Master General CV 2026-11",
  sections: [
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: {
            top: ONEPAGE ? 520 : 680,
            bottom: ONEPAGE ? 440 : 620,
            left: SZ.MARGIN,
            right: SZ.MARGIN,
          },
        },
      },
      children,
    },
  ],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(OUT, buf);
  console.log("WROTE", OUT, buf.length, "bytes");
});
