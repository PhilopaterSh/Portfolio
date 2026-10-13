import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import SectionHeader from "./SectionHeader";
import { testimonialImages } from "../data/portfolioData";
import { imageDimensions } from "../assets";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const TestimonialsSection = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(preference.matches);
    updatePreference();
    preference.addEventListener("change", updatePreference);
    return () => preference.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (testimonialImages.length <= 1 || isPaused || prefersReducedMotion) return;
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonialImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isPaused, prefersReducedMotion]);

  return (
    <motion.section
      id="testimonials"
      className="content-section"
      initial={shouldReduceMotion ? false : "hidden"}
      whileInView={shouldReduceMotion ? undefined : "visible"}
      viewport={{ once: true, margin: "-100px" }}
      variants={itemVariants}
    >
      <SectionHeader num="06" title="Testimonials" />
      <div className="testimonial-slider-container">
        <div
          className="slider-track"
          style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
        >
          {testimonialImages.map((img, i) => (
            <div key={i} className="slider-item">
              <img
                src={img}
                width={imageDimensions[img]?.width}
                height={imageDimensions[img]?.height}
                alt={`Philopater Shenouda (PhilopaterSh) - Professional Testimonial & Security Assessment Recommendation ${i + 1}`}
                className="slider-img"
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
              />
            </div>
          ))}
        </div>

        <div className="slider-controls">
          <div className="slider-dots" role="group" aria-label="Testimonial slides">
            {testimonialImages.map((_, i) => (
              <button
                key={i}
                className={`dot ${i === currentTestimonial ? "active" : ""}`}
                onClick={() => setCurrentTestimonial(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                aria-current={i === currentTestimonial ? "true" : undefined}
                aria-pressed={i === currentTestimonial}
              />
            ))}
          </div>
          <button
            type="button"
            className="slider-rotation-control"
            onClick={() => setIsPaused((paused) => !paused)}
            aria-pressed={isPaused || prefersReducedMotion}
          >
            {isPaused || prefersReducedMotion
              ? "Resume testimonial rotation"
              : "Pause testimonial rotation"}
          </button>
        </div>
      </div>
    </motion.section>
  );
};

export default TestimonialsSection;
