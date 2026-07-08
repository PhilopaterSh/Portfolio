import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader";
import { education } from "../data/portfolioData";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const EducationSection = () => {
  return (
    <motion.section
      id="education"
      className="content-section"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={itemVariants}
    >
      <SectionHeader num="03" title="Education" />
      <div className="exp-list">
        <div className="exp-card">
          <div className="exp-sidebar">
            <span className="exp-year">{education.period}</span>
            <img
              src={education.logo}
              alt={`${education.university} logo`}
              className="company-logo"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="exp-main">
            <h3>{education.degree}</h3>
            <h4 className="company-name">{education.university}</h4>
            <p className="education-details">{education.details}</p>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default EducationSection;
