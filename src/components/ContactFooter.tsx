import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import emailjs from "@emailjs/browser";
import SectionHeader from "./SectionHeader";
import { contact } from "../data/portfolioData";

const ContactFooter = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [formError, setFormError] = useState("");

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      setFormStatus("error");
      setFormError("CONFIG_MISSING: EMAILJS ENV VARS NOT SET (see .env.example).");
      setTimeout(() => setFormStatus("idle"), 5000);
      return;
    }

    setFormStatus("sending");
    setFormError("");

    emailjs.sendForm(serviceId, templateId, formRef.current, publicKey).then(
      () => {
        setFormStatus("success");
        if (formRef.current) formRef.current.reset();
        setTimeout(() => setFormStatus("idle"), 5000);
      },
      (error) => {
        console.error("EmailJS Error:", error);
        setFormStatus("error");
        setFormError("CONNECTION_FAILED: UNABLE TO TRANSMIT DATA.");
        setTimeout(() => setFormStatus("idle"), 5000);
      },
    );
  };

  return (
    <footer id="contact" className="footer-section">
      <div className="contact-box">
        <SectionHeader num="11" title="Initiate Secure Connection" />
        <p className="contact-info-text">
          Cairo, Egypt |{" "}
          <a href={contact.whatsapp} target="_blank" rel="noopener noreferrer" className="wa-link">
            WhatsApp
          </a>
        </p>
        <p className="contact-info-text email-text">{contact.email}</p>

        <form ref={formRef} onSubmit={sendEmail} className="contact-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="from_name">&gt; VISITOR_NAME</label>
              <input
                type="text"
                name="from_name"
                id="from_name"
                placeholder="Your name..."
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="from_email">&gt; CONTACT_EMAIL</label>
              <input
                type="email"
                name="from_email"
                id="from_email"
                placeholder="Your email address..."
                required
              />
            </div>
            <div className="form-group full-width">
              <label htmlFor="email_subject">&gt; MESSAGE_SUBJECT</label>
              <input
                type="text"
                name="email_subject"
                id="email_subject"
                placeholder="What is this about?..."
                required
              />
            </div>
            <div className="form-group full-width">
              <label htmlFor="message">&gt; MESSAGE_CONTENT</label>
              <textarea
                name="message"
                id="message"
                rows={5}
                placeholder="Type your message here..."
                required
              ></textarea>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="main-cta send-btn" disabled={formStatus === "sending"}>
              {formStatus === "idle" && "SEND_MESSAGE"}
              {formStatus === "sending" && "ENCRYPTING & SENDING..."}
              {formStatus === "success" && "MESSAGE_SENT_SUCCESSFULLY"}
              {formStatus === "error" && "RETRY_TRANSMISSION"}
            </button>
          </div>

          <AnimatePresence>
            {formStatus === "success" && (
              <motion.div
                className="form-feedback success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                [ SYSTEM: MESSAGE RECEIVED. SECURE CHANNEL ESTABLISHED. ]
              </motion.div>
            )}
            {formStatus === "error" && (
              <motion.div
                className="form-feedback error"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                [ ERROR: {formError} ]
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
      <p className="copyright">© 2026 PHILOPATER SHENOUDA SEDKIY. ALL SYSTEMS SECURE.</p>
    </footer>
  );
};

export default ContactFooter;
