import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader";
import { technicalSkills, softSkills } from "../data/portfolioData";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const SkillsSection = () => {
  return (
    <motion.section
      id="skills"
      className="content-section"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={itemVariants}
    >
      <SectionHeader num="09" title="Skills" />

      <div className="skills-wrapper">
        <div className="skills-column">
          <h3 className="sub-section-title">Technical Skills</h3>
          <div className="skills-grid">
            {technicalSkills.map((group, i) => (
              <div key={i} className="skill-group">
                <h4>{group.category}</h4>
                <div className="skills-tags">
                  {group.items.map((s, j) => (
                    <span key={j} className="skill-tag">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="skills-column soft-skills-section">
          <h3 className="sub-section-title">Soft Skills</h3>
          <div className="skills-tags">
            {softSkills.map((s, i) => (
              <span key={i} className="skill-tag soft">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default SkillsSection;
