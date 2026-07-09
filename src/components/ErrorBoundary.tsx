import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Unhandled error in component tree:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            padding: "2rem",
            textAlign: "center",
            fontFamily: "monospace",
            color: "#00f2ff",
            background: "#0a0e17",
          }}
        >
          <div style={{ fontSize: "1.25rem" }}>&gt; SYSTEM_ERROR: SOMETHING WENT WRONG.</div>
          <a href="/Portfolio/" style={{ color: "#00f2ff", textDecoration: "underline" }}>
            RETURN TO HOME
          </a>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
