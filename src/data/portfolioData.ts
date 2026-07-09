import {
  digiliansLogo,
  ntiLogo,
  depiLogo,
  yatLogo,
  asorcLogo,
  eeluLogo,
  bugcrowdLogo,
  hackeroneLogo,
  scoutLogo,
  deciLogo,
  img3,
  img4,
  ss1,
  ss2,
  ss3,
  ss4,
  sc1,
  sc2,
  sc3,
  sc4,
  sc5,
} from "../assets";

export { hackeroneLogo, bugcrowdLogo };

export const testimonialImages = [img3, img4, ss1, ss2, ss3, ss4, sc1, sc2, sc3, sc4, sc5];

export interface Experience {
  company: string;
  period: string;
  role: string;
  image?: string;
  images?: string[];
  link?: string;
  highlights: string[];
}

export interface Project {
  title: string;
  tag: string;
  desc: string;
  problem: string;
  solution: string;
  tools: string[];
  outcome: string;
  link: string;
  isMajor?: boolean;
}

export interface Volunteering {
  role: string;
  organization: string;
  period: string;
  image: string;
  desc: string;
}

export interface Certification {
  name: string;
  date: string;
}

export interface SkillCategory {
  category: string;
  items: string[];
}

export interface Language {
  name: string;
  level: string;
}

export interface ContactInfo {
  location: string;
  phone: string;
  email: string;
  linkedin: string;
  github: string;
  medium: string;
  tryHackMe: string;
  x: string;
  whatsapp: string;
}

export const about = {
  introduction:
    "Information Technology graduate and Junior Penetration Tester specializing in offensive security, vulnerability management, and risk analysis. Backed by intensive practical training from NTI, DEPI, and a prestigious cybersecurity diploma, I possess a proven track record in conducting structured web and network security assessments.",
  careerObjective:
    "As a Bug Bounty Hunter on Bugcrowd and HackerOne, I leverage a true Red Team mindset to identify and responsibly disclose critical vulnerabilities, including IDOR, PII Breaches, Broken Access Control, XSS, and OTP Bypasses. Adept at building custom automation tools in Go and Python, as well as delivering clear, compliance-aligned remediation reports that secure complex enterprise environments.",
  field: "Junior Penetration Tester",
};

export const contact: ContactInfo = {
  location: "Cairo, Egypt",
  phone: "+201555181415",
  email: "Philopater.Pentester@outlook.com",
  linkedin: "https://linkedin.com/in/philopater-shenouda",
  github: "https://github.com/PhilopaterSh",
  medium: "https://medium.com/@PhilopaterSh",
  tryHackMe: "https://tryhackme.com/p/PhilopaterSh",
  x: "https://x.com/PhilopaterSh",
  whatsapp: "https://wa.me/message/YMTBQC253E7DE1",
};

export const resumeLastUpdated = "June 2026";

export const experiences: Experience[] = [
  {
    company: "Digilians Pioneers",
    period: "Dec 2025 - Sep 2026",
    role: "Cybersecurity Participant (Diploma)",
    image: digiliansLogo,
    highlights: [
      "Selected for a prestigious national scholarship in collaboration with the Egyptian Military Academy and global tech leaders (Google, AWS, Palo Alto, Fortinet).",
      "Developed practical expertise in VAPT, system hardening, and security frameworks through an intensive industry-aligned curriculum.",
      "Applied Agile methodologies and SMART goals within cross-functional teams to manage project deliverables using Notion and Excel.",
    ],
  },
  {
    company: "Bug Bounty Hunter",
    period: "Aug 2025 - Dec 2025",
    role: "Bug Bounty Hunter (Part-time)",
    images: [bugcrowdLogo, hackeroneLogo],
    highlights: [
      "Discovered and responsibly disclosed critical vulnerabilities across enterprise target scopes, including IDOR, PII Breaches, Broken Access Control, XSS, and OTP Bypasses.",
      "Demonstrated high-impact flaws by manipulating HTTP requests, bypassing multi-factor authentication (MFA) logic, and hijacking administrative privileges.",
      "Authored detailed vulnerability reports with technical proof-of-concepts (PoCs) and actionable remediation strategies.",
    ],
  },
  {
    company: "National Telecommunication Institute (NTI)",
    period: "Feb 2025 - May 2025",
    role: "Ethical Hacking Intern",
    image: ntiLogo,
    highlights: [
      "Participated in an intensive 288-hour program simulating advanced web and network Red Team exercises and real-world attack campaigns.",
      "Utilized Nmap, Burp Suite, Metasploit, and Wireshark for target reconnaissance, traffic analysis, and Active Directory exploitation.",
      "Developed custom Python and Go scripts to automate network packet manipulation and optimize exploit research workflows.",
    ],
  },
  {
    company: "Digital Egypt Pioneers Initiative (DEPI)",
    period: "Apr 2024 - Oct 2024",
    role: "Vulnerability Analyst Intern",
    image: depiLogo,
    highlights: [
      "Conducted automated and manual vulnerability analysis using Nessus and OpenVAS, mapping infrastructure flaws to NIST and ISO 27001 compliance frameworks.",
      "Exploited OWASP Top 10 flaws (SQLi, XSS, CSRF) within simulated staging environments to validate risk severity and document hardening techniques.",
    ],
  },
  {
    company: "YAT Learning Centers",
    period: "Feb 2024 - Sep 2025",
    role: "Technical Trainer (DECI Program - Part-time)",
    image: yatLogo,
    highlights: [
      "Instructed 100+ students in programming and cybersecurity, simplifying complex security and ethical hacking into engaging models.",
      "Increased technical awareness by 30% through simplified security frameworks and hands-on demonstrations.",
    ],
  },
  {
    company: "ASORC - Assiut Oil Refining Company",
    period: "Sep 2022",
    role: "IT & Network Trainee",
    image: asorcLogo,
    highlights: [
      "Rotated through various departments, including the Network department and Data Center, to gain hands-on IT infrastructure experience.",
      "Assisted with server management, router and switch configurations, and overall network security setups.",
    ],
  },
];

export const projects: Project[] = [
  {
    title: "PhilopaterSh URL",
    tag: "Go / Automation",
    desc: "Go-based tool for automated URL extraction and filtering, featuring enhanced performance and multiple data sources.",
    problem:
      "Existing URL extraction tools were often slow and missed endpoints by not integrating enough data sources, which hindered the reconnaissance phase of security assessments.",
    solution:
      "Developed a high-performance, concurrent tool in Go that aggregates data from multiple passive sources and applies intelligent filtering to extract unique URLs efficiently.",
    tools: ["Go (Golang)", "Concurrency", "HTTP APIs", "Regex"],
    outcome:
      "Achieved a 60% reduction in recon time and improved the discovery of sensitive endpoints by 25% in various testing scenarios.",
    link: "https://github.com/PhilopaterSh/Ph.Sh_url",
    isMajor: true,
  },
  {
    title: "PhilopaterSh Subdomain",
    tag: "Go / Recon",
    desc: "High-performance subdomain enumeration tool in Go integrating multiple passive data sources with concurrent discovery.",
    problem:
      "Fragmented subdomain data across different providers made it difficult to get a complete view of a target's attack surface during the discovery phase.",
    solution:
      "Built a Go-based tool that integrates various passive API sources with active concurrent discovery to provide a comprehensive and accurate list of subdomains.",
    tools: ["Go", "JSON APIs", "Parallel Processing", "DNS Recon"],
    outcome:
      "Streamlined the discovery phase, providing a 40% more comprehensive view of target infrastructures compared to traditional single-source tools.",
    link: "https://github.com/PhilopaterSh/Ph.Sh-Subdomain",
    isMajor: false,
  },
];

export const volunteering: Volunteering[] = [
  {
    role: "Assistant Group Leader",
    organization: "Egyptian Air Scouts Association",
    period: "May 2019 - Present",
    image: scoutLogo,
    desc: "Initiated and organized scouting events and recreational activities for preparatory students, fostering leadership, discipline, and teamwork through camp management and interactive workshops.",
  },
  {
    role: "Technical Mentor",
    organization: "Digital Egypt Cubs Initiative (DECI)",
    period: "2024 - Present",
    image: deciLogo,
    desc: "Volunteered to guide and mentor students aged 12-17 in the fundamentals of cybersecurity and ethical hacking, helping them build a strong foundation in digital safety.",
  },
];

export const certs: Certification[] = [
  {
    name: "Cybersecurity Leadership and Management (L1 & L2)",
    date: "May 2026",
  },
  {
    name: "Governance, Risk, and Compliance (GRC) Specialist",
    date: "May 2026",
  },
  {
    name: "Information Gathering - Web Edition (HTB)",
    date: "May 2026",
  },
  { name: "Google Cybersecurity Professional Certificate", date: "April 2026" },
  { name: "Malware Analysis & Reverse Engineering", date: "Sep 2024" },
  {
    name: "Vulnerability Analyst / Pentester (DEPI)",
    date: "Oct 2024",
  },
  {
    name: "EC-Council Certified Incident Handler (ECIH) v2",
    date: "May 2024",
  },
  { name: "ITI Introduction to Cybersecurity Bootcamp", date: "Sep 2023" },
  { name: "eLearnSecurity Junior PT (eJPT v1)", date: "Aug 2023" },
  { name: "Certified Ethical Hacker (CEH)", date: "July 2023" },
  { name: "OWASP Top 10 & API Security Top 10", date: "July 2023" },
  { name: "External Pentest Playbook (TCM Security)", date: "July 2023" },
  { name: "Cyber Security Engineer (ITI)", date: "Jan 2023" },
  { name: "(ISC)2 Candidate", date: "Dec 2022" },
  { name: "Introduction to Cybersecurity (Palo Alto)", date: "Aug 2022" },
];

export const technicalSkills: SkillCategory[] = [
  {
    category: "Web Application Security",
    items: [
      "OWASP Top 10",
      "API Security Top 10",
      "SQL Injection (SQLi)",
      "Cross-Site Scripting (XSS)",
      "SSRF & LFI/RFI",
      "Broken Access Control",
    ],
  },
  {
    category: "Offensive Security & Pentesting",
    items: [
      "Network Penetration Testing",
      "Vulnerability Scanning (Nessus)",
      "Exploitation (Metasploit)",
      "Red Teaming & Infrastructure Security",
      "Payload Development",
      "Information Gathering (HTB)",
    ],
  },
  {
    category: "Incident Response & Malware Analysis",
    items: [
      "Cybersecurity Incident Response (ECIH)",
      "Malware Sandbox & Analysis",
      "Executable File Analysis",
      "SIEM (Google/SIEM Tools)",
      "Threat Detection & Response",
    ],
  },
  {
    category: "Networking & Traffic Analysis",
    items: [
      "TCP/IP & Networking Protocols",
      "DNS Security & IPv4",
      "Traffic Analysis & Wireshark",
      "Switching & Routing (CCNA)",
      "Intrusion Detection/Prevention (IDS/IPS)",
    ],
  },
  {
    category: "AI, Automation & Scripting",
    items: [
      "Large Language Models (LLMs) & ChatGPT",
      "Machine Learning & AI Strategy",
      "Python & Go for Security",
      "Bash & PowerShell Scripting",
      "Security Automation",
    ],
  },
  {
    category: "GRC & Professional Documentation",
    items: [
      "Governance, Risk, and Compliance (GRC)",
      "Security Frameworks & CIA Triad",
      "Cybersecurity Leadership & Management",
      "Agile Quality Work (IBM)",
      "Technical Reporting & Mentorship",
    ],
  },
];

export const softSkills = [
  "Leadership & Team Management",
  "Agile Methodologies",
  "Analytical Problem-Solving",
  "Technical Communication",
  "Continuous Self-Learning",
  "Research Coordination",
  "Professional Ethics",
  "Adaptability",
];

export const languages: Language[] = [
  { name: "Arabic", level: "Native Speaker" },
  { name: "English", level: "Conversational / Professional" },
];

export const education = {
  period: "2020 - 2024",
  degree: "Bachelor of Information Technology",
  university: "The Egyptian E-Learning University (EELU)",
  logo: eeluLogo,
  details:
    "GPA: 3.08/4.0. Graduation Project: Electronics E-store (Grade: A+). Responsible for programming an AI server in Python and establishing an API to connect it with a PHP backend.",
};
