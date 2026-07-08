import { useEffect } from "react";
import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader";
import { certs } from "../data/portfolioData";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const CertificationsSection = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//cdn.credly.com/assets/utilities/embed.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <motion.section
      id="certs"
      className="content-section"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={itemVariants}
    >
      <SectionHeader num="06" title="Certifications" />

      <div className="credly-badges-container">
        <div
          data-iframe-width="150"
          data-iframe-height="270"
          data-share-badge-id="c6090422-235d-46c0-afa1-c4e883cdd29c"
          data-share-badge-host="https://www.credly.com"
        ></div>
      </div>

      <div className="certs-grid">
        {certs.map((c, i) => (
          <motion.div
            key={i}
            className="cert-item-v2"
            whileHover={{ scale: 1.05, borderColor: "var(--accent-green)" }}
          >
            <span className="cert-name">{c.name}</span>
            <span className="cert-date">{c.date}</span>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default CertificationsSection;
