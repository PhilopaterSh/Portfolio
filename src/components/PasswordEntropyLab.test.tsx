import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import PasswordEntropyLab from "./PasswordEntropyLab";

describe("PasswordEntropyLab", () => {
  it("shows Empty strength with no password", () => {
    render(<PasswordEntropyLab password="" setPassword={vi.fn()} />);
    expect(screen.getByText("EMPTY")).toBeInTheDocument();
  });

  it("shows Very Strong strength and matching entropy bits for a long mixed password", () => {
    render(<PasswordEntropyLab password="Tr0ub4dor&3xtra-long!" setPassword={vi.fn()} />);
    expect(screen.getByText("VERY STRONG")).toBeInTheDocument();
    expect(screen.getByText("ENTROPY_BITS")).toBeInTheDocument();
  });

  it("updates strength when the password prop changes", () => {
    const { rerender } = render(<PasswordEntropyLab password="a" setPassword={vi.fn()} />);
    expect(screen.getByText("VERY WEAK")).toBeInTheDocument();

    rerender(<PasswordEntropyLab password="Aa1!Aa1!Aa1!Aa1!Aa1!" setPassword={vi.fn()} />);
    expect(screen.getByText("VERY STRONG")).toBeInTheDocument();
  });
});
