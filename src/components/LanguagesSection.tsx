import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const LanguagesSection = () => {
  return (
    <motion.section
      id="languages"
      className="content-section mini-section"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={itemVariants}
    >
      <SectionHeader num="09" title="Languages" />
      <div className="languages-container">
        <div className="lang-card">
          <div className="lang-info">
            <span className="lang-code">AR</span>
            <h3>Arabic</h3>
            <p>Native Speaker</p>
          </div>
          <div className="lang-level-bar">
            <div className="level-progress" style={{ width: "100%" }}></div>
          </div>
        </div>

        <div className="lang-card">
          <div className="lang-info">
            <span className="lang-code">EN</span>
            <h3>English</h3>
            <p>Conversational / Professional</p>
          </div>
          <div className="lang-level-bar">
            <div className="level-progress" style={{ width: "75%" }}></div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default LanguagesSection;
