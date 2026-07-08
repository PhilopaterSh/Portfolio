import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader";
import { testimonialImages } from "../data/portfolioData";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const TestimonialsSection = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    if (testimonialImages.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonialImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.section
      id="testimonials"
      className="content-section"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={itemVariants}
    >
      <SectionHeader num="05" title="Testimonials" />
      <div className="testimonial-slider-container">
        <div
          className="slider-track"
          style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
        >
          {testimonialImages.map((img, i) => (
            <div key={i} className="slider-item">
              <img
                src={img}
                alt={`Testimonial ${i + 1}`}
                className="slider-img"
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
              />
            </div>
          ))}
        </div>

        <div className="slider-dots" role="tablist" aria-label="Testimonial slides">
          {testimonialImages.map((_, i) => (
            <button
              key={i}
              className={`dot ${i === currentTestimonial ? "active" : ""}`}
              onClick={() => setCurrentTestimonial(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              aria-current={i === currentTestimonial ? "true" : undefined}
              role="tab"
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default TestimonialsSection;
