import { useEffect } from "react";
import {
  about,
  experiences,
  education,
  certs,
  technicalSkills,
  softSkills,
  projects,
  languages,
  contact,
} from "../data/portfolioData";

const Resume = () => {
  useEffect(() => {
    document.title = "CV - Philopater Shenouda";
  }, []);

  const featuredCerts = certs.slice(0, 10);

  return (
    <div className="ats-cv">
      <div className="ats-cv__page">
        <header className="ats-cv__header">
          <h1 className="ats-cv__name">Philopater Shenouda</h1>
          <div className="ats-cv__gradient"></div>
          <div className="ats-cv__contact">
            <span>{contact.phone}</span>
            <span className="ats-cv__sep">|</span>
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
            <span className="ats-cv__sep">|</span>
            <a href={contact.linkedin} target="_blank" rel="noreferrer">linkedin.com/in/philopater-shenouda</a>
            <span className="ats-cv__sep">|</span>
            <a href={contact.github} target="_blank" rel="noreferrer">github.com/PhilopaterSh</a>
            <span className="ats-cv__sep">|</span>
            <span>{contact.location}</span>
          </div>
        </header>

        <section className="ats-cv__section">
          <h2 className="ats-cv__section-title">Professional Summary</h2>
          <p className="ats-cv__summary">{about.careerObjective}</p>
        </section>

        <section className="ats-cv__section">
          <h2 className="ats-cv__section-title">Core Competencies</h2>
          <div className="ats-cv__competencies">
            {technicalSkills.flatMap((cat) =>
              cat.items.map((skill, i) => (
                <span key={`${cat.category}-${i}`} className="ats-cv__tag">{skill}</span>
              ))
            )}
            {softSkills.map((s, i) => (
              <span key={`soft-${i}`} className="ats-cv__tag">{s}</span>
            ))}
          </div>
        </section>

        <section className="ats-cv__section">
          <h2 className="ats-cv__section-title">Professional Experience</h2>
          {experiences.map((exp, i) => (
            <div key={i} className="ats-cv__job">
              <div className="ats-cv__job-header">
                <span className="ats-cv__job-company">{exp.company}</span>
                <span className="ats-cv__job-period">{exp.period}</span>
              </div>
              <div className="ats-cv__job-role">{exp.role}</div>
              <ul className="ats-cv__job-list">
                {exp.highlights.map((h, j) => (
                  <li key={j}>{h}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section className="ats-cv__section">
          <h2 className="ats-cv__section-title">Key Projects</h2>
          {projects.filter(p => p.isMajor).map((proj, i) => (
            <div key={i} className="ats-cv__project">
              <div className="ats-cv__project-header">
                <span className="ats-cv__project-title">{proj.title}</span>
                <span className="ats-cv__project-badge">{proj.tag}</span>
              </div>
              <p className="ats-cv__project-desc"><strong>Problem:</strong> {proj.problem}</p>
              <p className="ats-cv__project-desc"><strong>Solution:</strong> {proj.solution}</p>
              <p className="ats-cv__project-desc"><strong>Outcome:</strong> {proj.outcome}</p>
            </div>
          ))}
        </section>

        <section className="ats-cv__section">
          <h2 className="ats-cv__section-title">Education</h2>
          <div className="ats-cv__edu">
            <div className="ats-cv__edu-header">
              <span className="ats-cv__edu-title">{education.degree}</span>
              <span className="ats-cv__edu-year">{education.period}</span>
            </div>
            <span className="ats-cv__edu-org">{education.university}</span>
            <p className="ats-cv__edu-desc">{education.details}</p>
          </div>
        </section>

        <section className="ats-cv__section">
          <h2 className="ats-cv__section-title">Certifications</h2>
          <div className="ats-cv__cert-table">
            {featuredCerts.map((cert, i) => (
              <div key={i} className="ats-cv__cert-row">
                <span className="ats-cv__cert-name">{cert.name}</span>
                <span className="ats-cv__cert-date">{cert.date}</span>
              </div>
            ))}
          </div>
          {certs.length > featuredCerts.length && (
            <p className="ats-cv__cert-note">
              Additional certifications available on portfolio.
            </p>
          )}
        </section>

        <section className="ats-cv__section">
          <h2 className="ats-cv__section-title">Languages</h2>
          <div className="ats-cv__langs">
            {languages.map((lang, i) => (
              <span key={i} className="ats-cv__lang"><strong>{lang.name}</strong> — {lang.level}</span>
            ))}
          </div>
        </section>
      </div>

      <style>{`
        .ats-cv {
          background: #fff;
          color: #1a1a2e;
          font-family: 'Liberation Sans', 'Helvetica Neue', Arial, 'DejaVu Sans', sans-serif;
          font-size: 11px;
          line-height: 1.5;
          padding: 20px;
          font-variant-ligatures: none;
          font-feature-settings: "liga" 0, "clig" 0, "dlig" 0;
        }

        .ats-cv__page {
          max-width: 816px;
          margin: 0 auto;
        }

        .ats-cv__header {
          margin-bottom: 20px;
        }

        .ats-cv__name {
          font-size: 28px;
          font-weight: 700;
          color: #1a1a2e;
          letter-spacing: -0.02em;
          margin-bottom: 6px;
          line-height: 1.1;
          text-transform: none;
        }

        .ats-cv__gradient {
          height: 2px;
          background: linear-gradient(to right, #157a8a, #6a2c8c);
          border-radius: 1px;
          margin-bottom: 10px;
        }

        .ats-cv__contact {
          display: flex;
          flex-wrap: wrap;
          gap: 8px 14px;
          font-size: 10.5px;
          color: #555;
        }

        .ats-cv__contact a {
          color: #555;
          text-decoration: none;
        }

        .ats-cv__sep {
          color: #ccc;
        }

        .ats-cv__section {
          margin-bottom: 18px;
        }

        .ats-cv__section-title {
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #157a8a;
          border-bottom: 1.5px solid #e2e2e2;
          padding-bottom: 4px;
          margin-bottom: 10px;
          line-height: 1.2;
        }

        .ats-cv__summary {
          font-size: 11px;
          line-height: 1.7;
          color: #2f2f2f;
        }

        .ats-cv__competencies {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .ats-cv__tag {
          font-size: 10px;
          font-weight: 500;
          color: #136c7a;
          background: #e8f4f6;
          padding: 4px 10px;
          border-radius: 3px;
          border: 1px solid #d0e8ec;
          white-space: nowrap;
        }

        .ats-cv__job {
          margin-bottom: 14px;
        }

        .ats-cv__job-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 12px;
          margin-bottom: 4px;
        }

        .ats-cv__job-company {
          font-size: 12.5px;
          font-weight: 600;
          color: #6a2c8c;
        }

        .ats-cv__job-period {
          font-size: 10.5px;
          color: #777;
          white-space: nowrap;
        }

        .ats-cv__job-role {
          font-size: 11px;
          font-weight: 600;
          color: #333;
          margin-bottom: 6px;
        }

        .ats-cv__job-list {
          padding-left: 18px;
          margin-top: 6px;
        }

        .ats-cv__job-list li {
          font-size: 10.5px;
          line-height: 1.6;
          color: #333;
          margin-bottom: 4px;
        }

        .ats-cv__project {
          margin-bottom: 12px;
        }

        .ats-cv__project-header {
          display: flex;
          align-items: baseline;
          gap: 8px;
          margin-bottom: 4px;
        }

        .ats-cv__project-title {
          font-size: 11.5px;
          font-weight: 600;
          color: #6a2c8c;
        }

        .ats-cv__project-badge {
          font-size: 9px;
          font-weight: 500;
          color: #157a8a;
          background: #e8f4f6;
          padding: 1px 6px;
          border-radius: 2px;
        }

        .ats-cv__project-desc {
          font-size: 10.5px;
          color: #444;
          margin-top: 3px;
          line-height: 1.55;
        }

        .ats-cv__edu {
          margin-bottom: 8px;
        }

        .ats-cv__edu-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 12px;
        }

        .ats-cv__edu-title {
          font-weight: 600;
          font-size: 11px;
          color: #333;
        }

        .ats-cv__edu-org {
          color: #6a2c8c;
          font-weight: 500;
          font-size: 11px;
        }

        .ats-cv__edu-year {
          font-size: 10px;
          color: #777;
          white-space: nowrap;
        }

        .ats-cv__edu-desc {
          font-size: 10px;
          color: #666;
          margin-top: 2px;
          line-height: 1.5;
        }

        .ats-cv__cert-table {
          width: 100%;
        }

        .ats-cv__cert-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding-bottom: 6px;
          gap: 12px;
        }

        .ats-cv__cert-name {
          font-size: 10.5px;
          font-weight: 500;
          color: #333;
        }

        .ats-cv__cert-date {
          font-size: 10px;
          color: #777;
          white-space: nowrap;
          text-align: right;
        }

        .ats-cv__cert-note {
          font-size: 10px;
          color: #666;
          margin-top: 6px;
        }

        .ats-cv__langs {
          display: flex;
          flex-wrap: wrap;
          gap: 6px 20px;
        }

        .ats-cv__lang {
          font-size: 10.5px;
          color: #444;
        }

        .ats-cv__lang strong {
          font-weight: 600;
          color: #333;
        }

        @media print {
          @page { margin: 10mm; }
          .ats-cv { padding: 0; }
        }
      `}</style>
    </div>
  );
};

export default Resume;
