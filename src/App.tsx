import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import { ThemeProvider } from "./ThemeContext";
import ErrorBoundary from "./components/ErrorBoundary";
import { getRouteMetadata } from "./utils/routeMetadata";
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

/** Keeps browser metadata aligned with the current route and marks unknown paths noindex. */
function RouteMetadataHead() {
  const { pathname } = useLocation();

  useEffect(() => {
    const metadata = getRouteMetadata(pathname);
    document.title = metadata?.title ?? "Page not found | PhilopaterSh";

    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (description) {
      description.content =
        metadata?.description ??
        "The requested page could not be found. Return to the portfolio home page.";
    }

    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (metadata) {
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.rel = "canonical";
        document.head.append(canonical);
      }
      canonical.href = metadata.canonicalUrl;
    } else {
      canonical?.remove();
    }

    const title = metadata?.title ?? "Page not found | PhilopaterSh";
    const summary =
      metadata?.description ??
      "The requested page could not be found. Return to the portfolio home page.";
    const values = {
      "og:url": metadata?.canonicalUrl ?? window.location.href,
      "og:title": title,
      "og:description": summary,
      "og:image": metadata?.socialImageUrl ?? "",
      "og:image:alt": metadata?.socialImageAlt ?? "",
      "twitter:title": title,
      "twitter:description": summary,
      "twitter:image": metadata?.socialImageUrl ?? "",
      robots: metadata ? "index, follow" : "noindex, follow",
    };

    for (const [key, content] of Object.entries(values)) {
      const attribute = key === "robots" || key.startsWith("twitter:") ? "name" : "property";
      const selector = `meta[${attribute}="${key}"]`;
      let element = document.querySelector<HTMLMetaElement>(selector);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, key);
        document.head.append(element);
      }
      element.content = content;
    }
  }, [pathname]);

  return null;
}

/** Explains that the requested URL does not match a published portfolio route. */
function NotFoundPage() {
  return (
    <main className="not-found-page">
      <h1>Page not found</h1>
      <p>The page may have moved or the address may be incorrect.</p>
      <Link to="/">Return to the portfolio home page</Link>
    </main>
  );
}

/** Composes the portfolio routes, shared metadata, theme, and error boundary. */
function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Router basename="/Portfolio">
          <Suspense fallback={<RouteLoadingFallback />}>
            <RouteMetadataHead />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/Cybersecurity_Awareness" element={<CybersecurityAwareness />} />
              <Route path="/Resume" element={<Resume />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
