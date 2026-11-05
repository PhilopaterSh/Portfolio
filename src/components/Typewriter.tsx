import { useState, useEffect, useMemo } from "react";

interface TypewriterProps {
  /** Single text to type once (used when `texts` is not provided). */
  text?: string;
  /** Phrases to type, hold, delete, and cycle through forever. */
  texts?: string[];
  /** Milliseconds between characters. */
  delay?: number;
}

/** Types phrases character by character with a blinking cursor block.
 * With `texts`, cycles: type -> hold 2s -> delete -> next phrase.
 * All state updates are deferred to timer callbacks (no sync setState in effect).
 */
const Typewriter = ({ text = "", texts, delay = 100 }: TypewriterProps) => {
  const phrases = useMemo(() => (texts && texts.length ? texts : [text]), [texts, text]);
  const [display, setDisplay] = useState("");
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = phrases[phraseIdx % phrases.length];
    let nextDelay: number;
    let advance: () => void;

    if (!deleting && display === current) {
      // Full phrase typed: hold, then start deleting.
      nextDelay = 2000;
      advance = () => setDeleting(true);
    } else if (deleting && display === "") {
      // Fully deleted: advance to the next phrase.
      nextDelay = 150;
      advance = () => {
        setDeleting(false);
        setPhraseIdx((prev) => (prev + 1) % phrases.length);
      };
    } else {
      nextDelay = deleting ? delay / 2 : delay;
      advance = () => setDisplay(current.substring(0, display.length + (deleting ? -1 : 1)));
    }

    const timeout = setTimeout(advance, nextDelay);
    return () => clearTimeout(timeout);
  }, [display, deleting, phraseIdx, phrases, delay]);

  return (
    <span>
      {display}
      <span className="typewriter-cursor">|</span>
    </span>
  );
};

export default Typewriter;
