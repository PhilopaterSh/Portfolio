import { act, fireEvent, render, screen } from "@testing-library/react";
import { LazyMotion, domAnimation } from "framer-motion";
import { afterEach, describe, expect, it, vi } from "vitest";
import TestimonialsSection from "./TestimonialsSection";

describe("TestimonialsSection rotation controls", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("allows visitors to pause and resume automatic rotation", () => {
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
      },
    );
    vi.useFakeTimers();
    const { container } = render(
      <LazyMotion features={domAnimation} strict>
        <TestimonialsSection />
      </LazyMotion>,
    );
    const track = container.querySelector(".slider-track");
    const pauseButton = screen.getByRole("button", { name: "Pause testimonial rotation" });

    fireEvent.click(pauseButton);
    act(() => vi.advanceTimersByTime(8000));
    expect(track).toHaveStyle({ transform: "translateX(-0%)" });

    fireEvent.click(screen.getByRole("button", { name: "Resume testimonial rotation" }));
    act(() => vi.advanceTimersByTime(4000));
    expect(track).toHaveStyle({ transform: "translateX(-100%)" });
  });
});
