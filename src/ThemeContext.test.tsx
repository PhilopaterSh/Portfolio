import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ThemeProvider, useTheme } from "./ThemeContext";

const Consumer = () => {
  const { theme, resolvedTheme, setTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="resolved">{resolvedTheme}</span>
      <button onClick={() => setTheme("dark")}>set-dark</button>
      <button onClick={() => setTheme("light")}>set-light</button>
    </div>
  );
};

describe("ThemeContext", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("defaults to system theme when nothing is stored", () => {
    render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>
    );
    expect(screen.getByTestId("theme")).toHaveTextContent("system");
  });

  it("restores a previously saved theme from localStorage", () => {
    localStorage.setItem("theme", "dark");
    render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>
    );
    expect(screen.getByTestId("theme")).toHaveTextContent("dark");
    expect(screen.getByTestId("resolved")).toHaveTextContent("dark");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  it("updates the resolved theme and persists it when the user switches theme", () => {
    render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>
    );

    act(() => {
      screen.getByText("set-light").click();
    });

    expect(screen.getByTestId("theme")).toHaveTextContent("light");
    expect(screen.getByTestId("resolved")).toHaveTextContent("light");
    expect(localStorage.getItem("theme")).toBe("light");
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  });
});
