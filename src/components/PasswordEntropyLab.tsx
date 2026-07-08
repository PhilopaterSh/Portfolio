import { useState, useEffect } from "react";
import { useTheme } from "../ThemeContext";

interface PasswordEntropyLabProps {
  password: string;
  setPassword: (pwd: string) => void;
}

const calculateEntropy = (pwd: string) => {
  if (!pwd) return 0;
  let poolSize = 0;
  if (/[a-z]/.test(pwd)) poolSize += 26;
  if (/[A-Z]/.test(pwd)) poolSize += 26;
  if (/[0-9]/.test(pwd)) poolSize += 10;
  if (/[^a-zA-Z0-9]/.test(pwd)) poolSize += 32;
  const result = pwd.length * Math.log2(poolSize);
  return parseFloat(result.toFixed(2));
};

const PasswordEntropyLab = ({ password, setPassword }: PasswordEntropyLabProps) => {
  const { theme } = useTheme();
  const [entropy, setEntropy] = useState(0);
  const [strength, setStrength] = useState("");
  const [color, setColor] = useState("#555");
  const [copyStatus, setCopyStatus] = useState<"IDLE" | "COPIED" | "FAILED">("IDLE");

  const generateSecurePassword = () => {
    const length = 16;
    const sets = [
      "abcdefghijklmnopqrstuvwxyz",
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      "0123456789",
      "!@#$%^&*()_+~`|}{[]:;?><,./-=",
    ];
    const allChars = sets.join("");
    const passwordArray: string[] = [];
    sets.forEach((set) => {
      const array = new Uint32Array(1);
      window.crypto.getRandomValues(array);
      passwordArray.push(set.charAt(array[0] % set.length));
    });
    const remainingLength = length - passwordArray.length;
    const randomArray = new Uint32Array(remainingLength);
    window.crypto.getRandomValues(randomArray);
    for (let i = 0; i < remainingLength; i++) {
      passwordArray.push(allChars.charAt(randomArray[i] % allChars.length));
    }
    for (let i = passwordArray.length - 1; i > 0; i--) {
      const jArray = new Uint32Array(1);
      window.crypto.getRandomValues(jArray);
      const j = jArray[0] % (i + 1);
      [passwordArray[i], passwordArray[j]] = [passwordArray[j], passwordArray[i]];
    }
    setPassword(passwordArray.join(""));
    setCopyStatus("IDLE");
  };

  const copyToClipboard = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopyStatus("COPIED");
      setTimeout(() => setCopyStatus("IDLE"), 2000);
    } catch {
      setCopyStatus("FAILED");
      setTimeout(() => setCopyStatus("IDLE"), 2000);
    }
  };

  useEffect(() => {
    const e = calculateEntropy(password);
    setEntropy(e);
    if (e === 0) {
      setStrength("Empty");
      setColor("#555");
    } else if (e < 28) {
      setStrength("Very Weak");
      setColor("#ff4d4d");
    } else if (e < 36) {
      setStrength("Weak");
      setColor("#ffa500");
    } else if (e < 60) {
      setStrength("Moderate");
      setColor("#ffff00");
    } else if (e < 128) {
      setStrength("Strong");
      setColor("#00ff41");
    } else {
      setStrength("Very Strong");
      setColor("#00d4ff");
    }
  }, [password]);

  return (
    <div className="awareness-card">
      <div className="entropy-header">
        <h2 className="entropy-title">
          <span className="entropy-icon" aria-hidden="true">🛡️</span> Password Entropy
        </h2>
        <div className="entropy-actions">
          <button
            onClick={generateSecurePassword}
            className="entropy-btn entropy-btn--generate"
          >
            GENERATE
          </button>
          <button
            onClick={copyToClipboard}
            disabled={!password || copyStatus !== "IDLE"}
            className={`entropy-btn entropy-btn--copy ${copyStatus === "FAILED" ? "entropy-btn--copy-failed" : ""}`}
          >
            {copyStatus === "COPIED" ? "COPIED!" : copyStatus === "FAILED" ? "FAILED" : "COPY"}
          </button>
        </div>
      </div>

      <div className="password-input-wrapper">
        <input
          type="text"
          placeholder="Enter sequence for analysis..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="password-input"
        />
      </div>

      <div className="entropy-strength-row">
        <span className="entropy-strength-label">STRENGTH_LEVEL</span>
        <span className="entropy-strength-value" style={{ color }}>
          {strength.toUpperCase()}
        </span>
      </div>

      <div className="entropy-bar-track">
        <div
          className="entropy-bar-fill"
          style={{
            width: `${Math.min((entropy / 128) * 100, 100)}%`,
            backgroundColor: color,
          }}
        ></div>
      </div>

      <div className="entropy-value-container">
        <div className="entropy-value" style={{ color }}>
          {entropy}
        </div>
        <div className="entropy-label">ENTROPY_BITS</div>
      </div>
    </div>
  );
};

export default PasswordEntropyLab;
