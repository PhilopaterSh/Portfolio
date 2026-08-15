import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Typewriter from "./Typewriter";
import { profileImg } from "../assets";
import { contact, resumeLastUpdated } from "../data/portfolioData";

const Hero = () => {
  return (
    <header className="hero-section">
      <div className="hero-content">
        <motion.div
          className="hero-text"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="hero-title">
            <span>Philopater</span>
            <span> Shenouda</span>
            <span className="hero-alias"> (PhilopaterSh)</span>
          </h1>
          <h2 className="hero-subtitle">
            <Typewriter text="Junior Penetration Tester" delay={80} />
          </h2>
          <p className="hero-description">
            Information Technology graduate and <strong>Junior Penetration Tester (PhilopaterSh)</strong> specializing
            in offensive security, web & network vulnerability assessment, and security automation.
            Passionate about <strong>Red Teaming</strong>, ethical hacking, and bug bounty hunting.
          </p>
          <div className="social-pill-container">
            <a
              href={contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="social-pill"
            >
              LinkedIn
            </a>
            <a
              href={contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="social-pill"
            >
              GitHub
            </a>
            <a
              href={contact.tryHackMe}
              target="_blank"
              rel="noopener noreferrer"
              className="social-pill"
            >
              TryHackMe
            </a>
            <a href={contact.x} target="_blank" rel="noopener noreferrer" className="social-pill">
              X{" "}
            </a>
            <a
              href={contact.medium}
              target="_blank"
              rel="noopener noreferrer"
              className="social-pill"
            >
              Medium
            </a>
          </div>
          <div className="hero-btns-row">
            <a href="#contact" className="main-cta">
              Initiate Contact
            </a>
            <a
              href={`${import.meta.env.BASE_URL}CV_Philopater.pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="secondary-cta cv-btn"
            >
              Download CV
            </a>
            <Link to="/Resume" className="secondary-cta cv-btn">
              View Resume
            </Link>
          </div>
          <p className="cv-updated-note">CV updated: {resumeLastUpdated}</p>
        </motion.div>
        <motion.div
          className="hero-image-wrapper-container"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="hero-image-wrapper">
            <img
              src={profileImg}
              alt="Philopater Shenouda (PhilopaterSh) - Junior Penetration Tester"
              className="hero-image"
              width="600"
              height="600"
              decoding="async"
              fetchPriority="high"
            />
          </div>
          <div className="status-badge">Available for Work</div>
        </motion.div>
      </div>
    </header>
  );
};

export default Hero;
