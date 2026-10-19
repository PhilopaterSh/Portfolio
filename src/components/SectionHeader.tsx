import { m } from "framer-motion";

interface SectionHeaderProps {
  num: string;
  title: string;
}

/** Numbered section heading ("01 Profile") with a slide-in reveal on scroll.
 *
 * @param num - Zero-padded section number rendered in the accent color.
 * @param title - Section title rendered as the h2.
 */
const SectionHeader = ({ num, title }: SectionHeaderProps) => (
  <m.div
    className="section-header"
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
  >
    <span className="section-num">{num}</span>
    <h2>{title}</h2>
  </m.div>
);

export default SectionHeader;
