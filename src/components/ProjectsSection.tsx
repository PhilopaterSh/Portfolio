import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader";
import { projects } from "../data/portfolioData";
import type { Project } from "../data/portfolioData";

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

const ProjectCard = ({ p }: { p: Project }) => (
  <motion.div
    className={`project-card ${p.isMajor ? "major-project" : ""}`}
    variants={itemVariants}
    whileHover={{
      y: -10,
      boxShadow: "0 0 25px rgba(0, 255, 65, 0.15)",
    }}
  >
    <div className="project-tag">
      {p.tag}{" "}
      {p.isMajor && <span className="featured-badge">Major Project</span>}
    </div>
    <h3>{p.title}</h3>
    <p className="project-desc">{p.desc}</p>

    <div className="project-details-grid">
      <div className="detail-item">
        <strong>Problem:</strong> <p>{p.problem}</p>
      </div>
      <div className="detail-item">
        <strong>Solution:</strong> <p>{p.solution}</p>
      </div>
      <div className="detail-item">
        <strong>Tools:</strong>
        <div className="tools-tags">
          {p.tools?.map((tool: string, j: number) => (
            <span key={j} className="tool-tag">
              {tool}
            </span>
          ))}
        </div>
      </div>
      <div className="detail-item">
        <strong>Outcome:</strong> <p>{p.outcome}</p>
      </div>
    </div>

    {p.link !== "#" && (
      <a
        href={p.link}
        target="_blank"
        rel="noopener noreferrer"
        className="project-link"
      >
        View Repository →
      </a>
    )}
  </motion.div>
);

const ProjectsSection = () => {
  return (
    <motion.section
      id="projects"
      className="content-section"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      <SectionHeader num="04" title="Projects & Tools" />
      <div className="projects-grid">
        {projects.map((p: Project, i) => (
          <ProjectCard key={i} p={p} />
        ))}
      </div>
    </motion.section>
  );
};

export default ProjectsSection;
