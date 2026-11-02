import type { Variants } from "framer-motion";

/** Shared reveal variant: items fade in and rise 20px into view. */
export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};
