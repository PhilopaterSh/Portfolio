import { Suspense, lazy } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import AboutSection from "../components/AboutSection";
import ScrollToTop from "../components/ScrollToTop";

/**
 * Below-fold sections and the footer load as lazy chunks: nothing under the
 * fold needs to execute before the hero paints, so the LCP critical path
 * carries only the shell. One Suspense boundary per region renders null while
 * chunks arrive — sections are content-visibility-hidden until scrolled anyway.
 */
const ExperienceSection = lazy(() => import("../components/ExperienceSection"));
const EducationSection = lazy(() => import("../components/EducationSection"));
const ProjectsSection = lazy(() => import("../components/ProjectsSection"));
const WriteupsSection = lazy(() => import("../components/WriteupsSection"));
const TestimonialsSection = lazy(() => import("../components/TestimonialsSection"));
const CertificationsSection = lazy(() => import("../components/CertificationsSection"));
const VolunteeringSection = lazy(() => import("../components/VolunteeringSection"));
const SkillsSection = lazy(() => import("../components/SkillsSection"));
const LanguagesSection = lazy(() => import("../components/LanguagesSection"));
const ContactFooter = lazy(() => import("../components/ContactFooter"));

/** Landing page composing the hero shell eagerly and every other section lazily. */
const Home = () => {
  return (
    <div className="portfolio-root">
      <div className="background-glow"></div>
      <Navbar />
      <Hero />
      <main className="main-content">
        <AboutSection />
        <Suspense fallback={null}>
          <ExperienceSection />
          <EducationSection />
          <ProjectsSection />
          <WriteupsSection />
          <TestimonialsSection />
          <CertificationsSection />
          <VolunteeringSection />
          <SkillsSection />
          <LanguagesSection />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <ContactFooter />
      </Suspense>
      <ScrollToTop />
    </div>
  );
};

export default Home;
