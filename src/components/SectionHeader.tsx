import { motion } from "framer-motion";

interface SectionHeaderProps {
  num: string;
  title: string;
}

const SectionHeader = ({ num, title }: SectionHeaderProps) => (
  <motion.div
    className="section-header"
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
  >
    <span className="section-num">{num}</span>
    <h2>{title}</h2>
  </motion.div>
);

export default SectionHeader;
