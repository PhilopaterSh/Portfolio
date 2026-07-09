import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader";
import { experiences } from "../data/portfolioData";
import type { Experience } from "../data/portfolioData";
import { hackeroneLogo, bugcrowdLogo } from "../data/portfolioData";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const ExperienceCard = ({ exp }: { exp: Experience }) => (
  <motion.div className="exp-card" variants={itemVariants} whileHover={{ y: -5 }}>
    <div className="exp-sidebar">
      <span className="exp-year">{exp.period}</span>
      <div className="company-logos-container">
        {exp.image && (
          <img
            src={exp.image}
            alt={`${exp.company} logo`}
            className="company-logo company-logo--compact"
            loading="lazy"
            decoding="async"
          />
        )}
        {exp.images &&
          exp.images.map((img: string, idx: number) => (
            <div key={idx} className="company-logo-row">
              <img
                src={img}
                alt={`${exp.company} logo ${idx + 1}`}
                className={`company-logo company-logo--compact logo-visibility-fix ${img === hackeroneLogo ? "logo-visibility-fix-hackerone" : ""}`}
                loading="lazy"
                decoding="async"
              />
              {img === bugcrowdLogo && (
                <a
                  href="https://bugcrowd.com/h/PhilopaterSh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="profile-link-badge"
                >
                  View Profile →
                </a>
              )}
              {img === hackeroneLogo && (
                <a
                  href="https://hackerone.com/philopatersh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="profile-link-badge"
                >
                  View Profile →
                </a>
              )}
            </div>
          ))}
      </div>
    </div>
    <div className="exp-main">
      <h3>{exp.role}</h3>
      <h4 className="company-name">
        {exp.company}
        {exp.link && (
          <a
            href={exp.link}
            target="_blank"
            rel="noopener noreferrer"
            className="company-link-badge"
          >
            View Profile →
          </a>
        )}
      </h4>
      <ul className="exp-highlights">
        {exp.highlights.map((h: string, j: number) => (
          <li key={j}>{h}</li>
        ))}
      </ul>
    </div>
  </motion.div>
);

const ExperienceSection = () => {
  return (
    <motion.section
      id="experience"
      className="content-section"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      <SectionHeader num="02" title="Professional Experience" />
      <div className="exp-list">
        {experiences.map((exp: Experience, i) => (
          <ExperienceCard key={i} exp={exp} />
        ))}
      </div>
    </motion.section>
  );
};

export default ExperienceSection;
