/**
 * Application bootstrap: mounts the root App in React StrictMode.
 *
 * Intentionally uses `createRoot().render()` rather than hydration; the static
 * HTML documents in dist are first-paint previews that React replaces on load.
 */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
