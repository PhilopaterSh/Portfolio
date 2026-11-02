import { m } from "framer-motion";
import { itemVariants } from "../animations/itemVariants";
import SectionHeader from "./SectionHeader";
import { about } from "../data/portfolioData";

/** Profile section: field of specialization, intro copy, and career objective from `about`. */
const AboutSection = () => {
  return (
    <m.section
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
    </m.section>
  );
};

export default AboutSection;
