import { useState } from "react";
import Navbar from "../components/Navbar";
import PasswordEntropyLab from "../components/PasswordEntropyLab";
import SecurityChecklist from "../components/SecurityChecklist";
import FormulaCard from "../components/FormulaCard";
import BruteForceAnalysis from "../components/BruteForceAnalysis";
import TimeToCrack from "../components/TimeToCrack";
import NetworkTrace from "../components/NetworkTrace";

const criteria = [
  { label: "Length (12+ chars)", met: false, gain: "+~40 bits" },
  { label: "Uppercase Letters", met: false, gain: "+~26 bits" },
  { label: "Numbers (0-9)", met: false, gain: "+~10 bits" },
  { label: "Special Symbols", met: false, gain: "+~32 bits" },
];

const timeScale = [
  { min: 0, max: 27.99, bits: "< 28", time: "Instant", color: "#ff4d4d", desc: "Instantly crackable via basic brute-force." },
  { min: 28, max: 59.99, bits: "28 - 59", time: "Minutes to Years", color: "#ffff00", desc: "Vulnerable to specialized hardware attacks." },
  { min: 60, max: 127.99, bits: "60 - 127", time: "Centuries", color: "#00ff41", desc: "Secure against modern supercomputing." },
  { min: 128, max: Infinity, bits: "128+", time: "Infinite", color: "#00d4ff", desc: "Mathematically resilient to all known attacks." },
];

const CybersecurityAwareness = () => {
  const [password, setPassword] = useState("");

  const entropy = password
    ? (() => {
        let poolSize = 0;
        if (/[a-z]/.test(password)) poolSize += 26;
        if (/[A-Z]/.test(password)) poolSize += 26;
        if (/[0-9]/.test(password)) poolSize += 10;
        if (/[^a-zA-Z0-9]/.test(password)) poolSize += 32;
        return parseFloat((password.length * Math.log2(poolSize)).toFixed(2));
      })()
    : 0;

  const currentCriteria = criteria.map((c) => ({
    ...c,
    met:
      c.label === "Length (12+ chars)"
        ? password.length >= 12
        : c.label === "Uppercase Letters"
          ? /[A-Z]/.test(password)
          : c.label === "Numbers (0-9)"
            ? /[0-9]/.test(password)
            : /[^a-zA-Z0-9]/.test(password),
  }));

  const isComplete = password.length > 0 && currentCriteria.every((c) => c.met);

  return (
    <div className="awareness-root">
      <Navbar />
      <header className="awareness-header">
        <h1>Cybersecurity Awareness</h1>
        <p>
          Interactive analysis tool for measuring cryptographic resilience.
          Understand how mathematical entropy defines the boundary between
          secure access and system vulnerability.
        </p>
      </header>

      <div className="awareness-grid-main">
        <PasswordEntropyLab password={password} setPassword={setPassword} />
        <SecurityChecklist criteria={currentCriteria} isComplete={isComplete} />
      </div>

      <div className="awareness-grid-secondary">
        <FormulaCard />
        <BruteForceAnalysis entropy={entropy} color={entropy >= 128 ? "#00d4ff" : entropy >= 60 ? "#00ff41" : entropy >= 36 ? "#ffff00" : entropy >= 28 ? "#ffa500" : entropy > 0 ? "#ff4d4d" : "#555"} />
        <TimeToCrack timeScale={timeScale} entropy={entropy} password={password} />
      </div>

      <div className="awareness-trace-section">
        <NetworkTrace />
      </div>

      <footer className="awareness-footer">
        // ENCRYPTION_REQUIRED // SYSTEM_SECURE //
      </footer>
    </div>
  );
};

export default CybersecurityAwareness;
