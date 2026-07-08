import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CybersecurityAwareness from "./pages/CybersecurityAwareness";
import Resume from "./pages/Resume";
import { ThemeProvider } from "./ThemeContext";
import "./styles/base.css";
import "./styles/navbar.css";
import "./styles/hero.css";
import "./styles/content.css";
import "./styles/awareness.css";
import "./styles/responsive.css";

function App() {
  return (
    <ThemeProvider>
      <Router basename="/Portfolio">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/Cybersecurity_Awareness"
            element={<CybersecurityAwareness />}
          />
          <Route path="/Resume" element={<Resume />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
