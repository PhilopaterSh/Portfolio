import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader";
import { about } from "../data/portfolioData";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const AboutSection = () => {
  return (
    <motion.section
      id="about"
      className="content-section"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={itemVariants}
    >
      <SectionHeader num="01" title="Profile" />
      <div className="about-grid">
        <div className="about-text">
          <p className="about-lead">
            <strong>Field of Specialization:</strong> {about.field}
          </p>
          <p className="about-lead">{about.introduction}</p>
          <div className="career-objective">
            <h3 className="career-objective-title">Career Objective</h3>
            <p>{about.careerObjective}</p>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default AboutSection;
