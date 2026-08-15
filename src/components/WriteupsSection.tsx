import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader";
import { writeups } from "../data/portfolioData";
import type { Writeup } from "../data/portfolioData";

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

const WriteupCard = ({ w }: { w: Writeup }) => (
  <motion.article
    className={`writeup-card ${w.featured ? "featured-writeup" : ""}`}
    variants={itemVariants}
    whileHover={{
      y: -8,
      boxShadow: "0 0 25px rgba(0, 242, 255, 0.15)",
    }}
  >
    <div className="writeup-top-meta">
      <span className="writeup-badge">{w.badge}</span>
      <div className="writeup-platform-time">
        <span className="writeup-platform">{w.platform}</span>
        <span className="writeup-dot">•</span>
        <span className="writeup-read-time">{w.readTime}</span>
      </div>
    </div>

    <h3 className="writeup-title">{w.title}</h3>
    <p className="writeup-desc">{w.desc}</p>

    <div className="writeup-tags">
      {w.tags.map((tag, idx) => (
        <span key={idx} className="tool-tag">
          {tag}
        </span>
      ))}
    </div>

    <div className="writeup-footer">
      <a
        href={w.link}
        target="_blank"
        rel="noopener noreferrer"
        className="project-link writeup-action-link"
        aria-label={`Read ${w.title}`}
      >
        Read Full Writeup & Research →
      </a>
    </div>
  </motion.article>
);

const WriteupsSection = () => {
  return (
    <motion.section
      id="writeups"
      className="content-section"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      <SectionHeader num="05" title="Security Writeups & Research" />
      <p className="section-subtitle-text">
        Documenting hands-on penetration testing methodologies, CTF machine walkthroughs, exploit
        analyses, and custom security automation research.
      </p>
      <div className="writeups-grid">
        {writeups.map((w: Writeup, i) => (
          <WriteupCard key={i} w={w} />
        ))}
      </div>
    </motion.section>
  );
};

export default WriteupsSection;
