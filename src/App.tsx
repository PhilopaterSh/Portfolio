import './App.css'
import profileImg from './assets/profile.png'

function App() {
  const experiences = [
    {
      company: "Digital Pioneers",
      period: "Dec 2025 – Sep 2026",
      role: "Participant",
      highlights: [
        "Selected for a nationally sponsored scholarship in collaboration with the Egyptian Military Academy and global partners (Google, AWS, Microsoft, Cisco, etc.).",
        "Completed a 9-month intensive diploma emphasizing penetration testing, vulnerability analysis, and system hardening.",
        "Developed expertise in security frameworks aligned with international standards.",
        "Applied SMART goals and Agile methodologies to manage final project deliverables using tools like Notion and Excel."
      ]
    },
    {
      company: "YAT Learning Centers",
      period: "Feb 2024 – Sep 2025",
      role: "Technical Trainer in DECI Program",
      highlights: [
        "Mentored and trained 100+ students (ages 12-17) in the Digital Egypt Cubs Initiative (DECI).",
        "Cultivated a 'Problem-Solving Mindset' by teaching students to deconstruct complex technical issues before coding.",
        "Successfully increased the overall technical awareness of participants by over 30%.",
        "Adapted complex security concepts into age-appropriate content for high engagement."
      ]
    },
    {
      company: "National Telecommunication Institute (NTI)",
      period: "Feb – May 2025",
      role: "Penetration Testing Intern",
      highlights: [
        "Participated in an intensive 288-hour program covering web, network, mobile PT, and system hardening.",
        "Gained hands-on experience with Nmap, Burp Suite, Metasploit, and Wireshark in simulated attack scenarios.",
        "Developed Python scripts for network packet manipulation and web exploitation automation.",
        "Strengthened knowledge in Windows AD security and Linux administration."
      ]
    },
    {
      company: "Digital Egypt Pioneers Initiative (DEPI)",
      period: "Apr – Oct 2024",
      role: "Vulnerability Analyst Intern",
      highlights: [
        "Conducted vulnerability scanning on VMs and external systems using Nessus and OpenVAS.",
        "Performed authorized PT on platforms like PortSwigger Academy, TryHackMe, and Hack The Box.",
        "Exploited vulnerabilities including SQLi, XSS, and CSRF using Metasploit and Burp Suite to understand remediation."
      ]
    }
  ];

  const projects = [
    {
      title: "Ph.Sh_URL",
      desc: "Developed a Go-based tool for automated URL extraction and filtering, inspired by VirusTotalX. Enhanced performance and automation workflow.",
      tag: "Go / Automation",
      link: "https://github.com/PhilopaterSh/Ph.Sh_URL"
    },
    {
      title: "Ph.Sh-Subdomain",
      desc: "Built a high-performance subdomain enumeration tool in Go integrating multiple passive data sources with concurrent discovery support.",
      tag: "Go / Recon",
      link: "https://github.com/PhilopaterSh/Ph.Sh-Subdomain"
    },
    {
      title: "Electronics E-store (Grad Project)",
      desc: "Programmed an AI server in Python and established an API to connect it with a PHP backend for seamless machine-learning integration. (Grade: A+)",
      tag: "Python / AI / PHP",
      link: "#"
    }
  ];

  const certs = [
    { name: "ECIH v2 (Certified Incident Handler)", date: "2024" },
    { name: "Red Hat System Administration I & II", date: "Nov 2023" },
    { name: "Web App & Network Penetration Testing", date: "Nov 2023" },
    { name: "eLearnSecurity Junior PT (eJPT v1)", date: "Aug 2023" },
    { name: "OWASP Top 10 (Web)", date: "July 2023" },
    { name: "Certified Ethical Hacker (CEH)", date: "July 2023" },
    { name: "Implementation of Computer Network Fundamentals", date: "July 2023" },
    { name: "Jr Penetration Tester", date: "July 2022" },
    { name: "Windows OS and Domain Controllers", date: "Oct 2022" }
  ];

  const technicalSkills = [
    { category: "Web Security", items: ["OWASP Top 10", "SQLi", "XSS", "SSRF", "LFI/RFI", "Root Cause Analysis"] },
    { category: "Testing & Audit", items: ["Network PT", "Vulnerability Assessment", "Burp Suite", "Metasploit", "Nmap"] },
    { category: "OS & Hardening", items: ["Red Hat", "Kali Linux", "Windows Server", "AD Security", "System Hardening"] },
    { category: "Automation", items: ["Python", "Go", "PowerShell", "Bash Scripting", "API Integration"] },
    { category: "Networking", items: ["TCP/IP", "DNS", "HTTP/HTTPS", "Traffic Analysis", "Wireshark"] }
  ];

  const softSkills = [
    "Analytical Thinking", "Problem-Solving Under Pressure", "Self-Learning", 
    "Technical Communication", "Teamwork & Collaboration", "Time Management"
  ];

  return (
    <div className="portfolio-root">
      <div className="background-glow"></div>
      
      <nav className="nav-container">
        <div className="nav-logo">P.SHENOUDA<span className="cursor">_</span></div>
        <div className="nav-links">
          <a href="#about">ABOUT</a>
          <a href="#experience">EXPERIENCE</a>
          <a href="#projects">PROJECTS</a>
          <a href="#skills">SKILLS</a>
          <a href="#contact" className="nav-cta">GET IN TOUCH</a>
        </div>
      </nav>

      <header className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h2 className="hero-subtitle">Junior Penetration Tester</h2>
            <h1 className="hero-title">Philopater Shenouda Sedkiy</h1>
            <p className="hero-description">
              Information Technology graduate specializing in <strong>Vulnerability Assessment</strong>, 
              <strong>Red Teaming</strong>, and <strong>Security Automation</strong>. 
              Proven track record in delivering actionable vulnerability reports.
            </p>
            <div className="social-pill-container">
              <a href="https://linkedin.com/in/philopater-shenouda" target="_blank" className="social-pill">LinkedIn</a>
              <a href="https://github.com/PhilopaterSh" target="_blank" className="social-pill">GitHub</a>
              <a href="https://medium.com/@PhilopaterSh" target="_blank" className="social-pill">Medium</a>
            </div>
            <div className="hero-btns-row">
              <a href="#contact" className="main-cta">Initiate Contact</a>
              <a href="/CV_Philopater.pdf" target="_blank" className="secondary-cta cv-btn">Download CV</a>
            </div>
          </div>
          <div className="hero-image-wrapper">
            <img src={profileImg} alt="Philopater Shenouda" className="hero-image" />
            <div className="status-badge">Available for Work</div>
          </div>
        </div>
      </header>

      <main className="main-content">
        <section id="about" className="content-section">
          <div className="section-header">
            <span className="section-num">01</span>
            <h2>Profile</h2>
          </div>
          <div className="about-grid">
            <div className="about-text">
              <p>
                As a freelance security researcher, I conduct deep-dive assessments and deliver structured reports. 
                My background includes intensive training at NTI and DEPI, and mentoring 100+ students in 
                cybersecurity awareness. I am passionate about building security labs and continuous 
                professional development in the Red Teaming space.
              </p>
              <div className="edu-card mini">
                <h4>Education</h4>
                <p>Bachelor of Information Technology | EELU | GPA 3.08/4</p>
                <p><strong>Languages:</strong> Arabic (Native) | English (Conversational)</p>
              </div>
            </div>
          </div>
        </section>

        <section id="experience" className="content-section">
          <div className="section-header">
            <span className="section-num">02</span>
            <h2>Professional Experience</h2>
          </div>
          <div className="exp-list">
            {experiences.map((exp, i) => (
              <div key={i} className="exp-card">
                <div className="exp-sidebar">
                  <span className="exp-year">{exp.period}</span>
                </div>
                <div className="exp-main">
                  <h3>{exp.role}</h3>
                  <h4 className="company-name">{exp.company}</h4>
                  <ul className="exp-highlights">
                    {exp.highlights.map((h, j) => <li key={j}>{h}</li>)}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="projects" className="content-section">
          <div className="section-header">
            <span className="section-num">03</span>
            <h2>Projects & Tools</h2>
          </div>
          <div className="projects-grid">
            {projects.map((p, i) => (
              <div key={i} className="project-card">
                <div className="project-tag">{p.tag}</div>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
                {p.link !== "#" && <a href={p.link} className="project-link">View Repository →</a>}
              </div>
            ))}
          </div>
        </section>

        <section id="skills" className="content-section">
          <div className="section-header">
            <span className="section-num">04</span>
            <h2>Technical Expertise</h2>
          </div>
          <div className="skills-grid">
            {technicalSkills.map((group, i) => (
              <div key={i} className="skill-group">
                <h4>{group.category}</h4>
                <div className="skills-tags">
                  {group.items.map((s, j) => <span key={j} className="skill-tag">{s}</span>)}
                </div>
              </div>
            ))}
          </div>
          <div className="soft-skills-container" style={{marginTop: '40px'}}>
            <h4 style={{marginBottom: '15px', fontSize: '0.9rem', color: '#888'}}>SOFT SKILLS</h4>
            <div className="skills-tags">
              {softSkills.map((s, i) => <span key={i} className="skill-tag soft">{s}</span>)}
            </div>
          </div>
        </section>

        <section id="certs" className="content-section">
          <div className="section-header">
            <span className="section-num">05</span>
            <h2>Certifications</h2>
          </div>
          <div className="certs-grid">
            {certs.map((c, i) => (
              <div key={i} className="cert-item-v2">
                <span className="cert-name">{c.name}</span>
                <span className="cert-date">{c.date}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer id="contact" className="footer-section">
        <div className="contact-box">
          <h2>Initiate Secure Connection</h2>
          <p>Cairo, Egypt | +201555181415</p>
          <p>Philopater.Pentester@outlook.com</p>
          <div className="footer-links">
            <a href="mailto:Philopater.Pentester@outlook.com" className="main-cta">Email Me</a>
          </div>
        </div>
        <p className="copyright">© 2026 PHILOPATER SHENOUDA SEDKIY. ALL SYSTEMS SECURE.</p>
      </footer>
    </div>
  )
}

export default App
