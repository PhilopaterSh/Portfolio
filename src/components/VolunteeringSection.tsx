import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader";
import { volunteering } from "../data/portfolioData";
import type { Volunteering } from "../data/portfolioData";

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

const VolunteeringCard = ({ v }: { v: Volunteering }) => (
  <motion.div className="exp-card" variants={itemVariants} whileHover={{ y: -5 }}>
    <div className="exp-sidebar">
      <span className="exp-year">{v.period}</span>
      {v.image && (
        <img
          src={v.image}
          alt={`${v.organization} logo`}
          className="company-logo company-logo--compact company-logo--spaced"
          loading="lazy"
          decoding="async"
        />
      )}
    </div>
    <div className="exp-main">
      <h3>{v.role}</h3>
      <h4 className="company-name">{v.organization}</h4>
      <p className="volunteering-desc">{v.desc}</p>
    </div>
  </motion.div>
);

const VolunteeringSection = () => {
  return (
    <motion.section
      id="volunteering"
      className="content-section"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      <SectionHeader num="08" title="Volunteering" />
      <div className="exp-list">
        {volunteering.map((v: Volunteering, i) => (
          <VolunteeringCard key={i} v={v} />
        ))}
      </div>
    </motion.section>
  );
};

export default VolunteeringSection;
