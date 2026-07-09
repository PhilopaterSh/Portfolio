import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { ThemeProvider } from "./ThemeContext";
import ErrorBoundary from "./components/ErrorBoundary";
import "./styles/base.css";
import "./styles/navbar.css";
import "./styles/hero.css";
import "./styles/content.css";
import "./styles/awareness.css";
import "./styles/responsive.css";

const CybersecurityAwareness = lazy(() => import("./pages/CybersecurityAwareness"));
const Resume = lazy(() => import("./pages/Resume"));

const RouteLoadingFallback = () => (
  <div
    style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "var(--accent-green, #00f2ff)",
      fontFamily: "monospace",
    }}
  >
    &gt; LOADING_MODULE...
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Router basename="/Portfolio">
          <Suspense fallback={<RouteLoadingFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/Cybersecurity_Awareness" element={<CybersecurityAwareness />} />
              <Route path="/Resume" element={<Resume />} />
            </Routes>
          </Suspense>
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
