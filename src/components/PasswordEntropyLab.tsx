import { useState, useMemo } from "react";
import { calculateEntropy } from "../utils/passwordEntropy";

interface PasswordEntropyLabProps {
  password: string;
  setPassword: (pwd: string) => void;
}

const strengthForEntropy = (e: number): { strength: string; color: string } => {
  if (e === 0) return { strength: "Empty", color: "#555" };
  if (e < 28) return { strength: "Very Weak", color: "#ff4d4d" };
  if (e < 36) return { strength: "Weak", color: "#ffa500" };
  if (e < 60) return { strength: "Moderate", color: "#ffff00" };
  if (e < 128) return { strength: "Strong", color: "#00ff41" };
  return { strength: "Very Strong", color: "#00d4ff" };
};

const PasswordEntropyLab = ({ password, setPassword }: PasswordEntropyLabProps) => {
  const [copyStatus, setCopyStatus] = useState<"IDLE" | "COPIED" | "FAILED">("IDLE");
  const entropy = useMemo(() => calculateEntropy(password), [password]);
  const { strength, color } = useMemo(() => strengthForEntropy(entropy), [entropy]);

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

  return (
    <div className="awareness-card">
      <div className="entropy-header">
        <h2 className="entropy-title">
          <span className="entropy-icon" aria-hidden="true">
            🛡️
          </span>{" "}
          Password Entropy
        </h2>
        <div className="entropy-actions">
          <button onClick={generateSecurePassword} className="entropy-btn entropy-btn--generate">
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
