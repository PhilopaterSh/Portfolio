import { useState, useEffect } from "react";

interface TypewriterProps {
  text: string;
  delay?: number;
}

/** Types `text` one character at a time and keeps a blinking cursor block.
 *
 * @param text - String to reveal character by character.
 * @param delay - Milliseconds between characters.
 */
const Typewriter = ({ text, delay = 100 }: TypewriterProps) => {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText((prevText) => prevText + text[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, delay, text]);

  return (
    <span>
      {currentText}
      <span className="typewriter-cursor">|</span>
    </span>
  );
};

export default Typewriter;
