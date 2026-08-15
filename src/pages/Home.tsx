import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import AboutSection from "../components/AboutSection";
import ExperienceSection from "../components/ExperienceSection";
import EducationSection from "../components/EducationSection";
import ProjectsSection from "../components/ProjectsSection";
import WriteupsSection from "../components/WriteupsSection";
import TestimonialsSection from "../components/TestimonialsSection";
import CertificationsSection from "../components/CertificationsSection";
import VolunteeringSection from "../components/VolunteeringSection";
import SkillsSection from "../components/SkillsSection";
import LanguagesSection from "../components/LanguagesSection";
import ContactFooter from "../components/ContactFooter";
import ScrollToTop from "../components/ScrollToTop";

const Home = () => {
  useEffect(() => {
    document.title = "Philopater Shenouda (PhilopaterSh) | Junior Penetration Tester";
  }, []);

  return (
    <div className="portfolio-root">
      <div className="background-glow"></div>
      <Navbar />
      <Hero />
      <main className="main-content">
        <AboutSection />
        <ExperienceSection />
        <EducationSection />
        <ProjectsSection />
        <WriteupsSection />
        <TestimonialsSection />
        <CertificationsSection />
        <VolunteeringSection />
        <SkillsSection />
        <LanguagesSection />
      </main>
      <ContactFooter />
      <ScrollToTop />
    </div>
  );
};

export default Home;
