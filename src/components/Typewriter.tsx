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
 */
const Typewriter = ({ text = "", texts, delay = 100 }: TypewriterProps) => {
  const phrases = useMemo(
    () => (texts && texts.length ? texts : [text]),
    [texts, text]
  );
  const [display, setDisplay] = useState("");
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = phrases[phraseIdx % phrases.length];
    let timeout: ReturnType<typeof setTimeout> | undefined;

    if (!deleting && display === current) {
      // Full phrase typed: hold, then start deleting.
      timeout = setTimeout(() => setDeleting(true), 2000);
    } else if (deleting && display === "") {
      // Fully deleted: advance to the next phrase.
      setDeleting(false);
      setPhraseIdx((prev) => (prev + 1) % phrases.length);
    } else {
      timeout = setTimeout(
        () =>
          setDisplay(current.substring(0, display.length + (deleting ? -1 : 1))),
        deleting ? delay / 2 : delay
      );
    }
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
