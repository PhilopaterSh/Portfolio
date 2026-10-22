import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import NetworkTrace from "./NetworkTrace";
import { fetchNetworkTrace } from "../utils/networkTrace";

vi.mock("../utils/networkTrace", () => ({
  fetchNetworkTrace: vi.fn(),
}));

describe("NetworkTrace", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("discloses the providers and does not make a request while idle", () => {
    render(<NetworkTrace />);

    expect(screen.getByText(/sends that address to ipapi/i)).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(/no trace has been run/i);
    expect(fetchNetworkTrace).not.toHaveBeenCalled();
  });

  it("starts a live lookup only after an explicit action", async () => {
    vi.mocked(fetchNetworkTrace).mockResolvedValue({
      ip: "203.0.113.7",
      city: "Cairo",
      region: "Cairo",
      country_name: "Egypt",
      country_code: "EG",
      postal: "00000",
      timezone: "Africa/Cairo",
      org: "Example ISP",
      simulated: false,
    });

    render(<NetworkTrace />);
    fireEvent.click(screen.getByRole("button", { name: "RUN LIVE TRACE" }));

    await waitFor(() => expect(screen.getByText("203.0.113.7")).toBeInTheDocument());
    expect(fetchNetworkTrace).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("SIMULATED DEMO DATA")).not.toBeInTheDocument();
  });

  it("runs the local demo without invoking the network lookup", async () => {
    render(<NetworkTrace />);
    fireEvent.click(screen.getByRole("button", { name: "RUN LOCAL DEMO" }));

    expect(await screen.findByText("SIMULATED DEMO DATA")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(/all displayed values are simulated/i);
    expect(fetchNetworkTrace).not.toHaveBeenCalled();
  });

  it("offers neutral retry and demo guidance when a live lookup fails", async () => {
    vi.mocked(fetchNetworkTrace).mockRejectedValue(new Error("blocked"));
    render(<NetworkTrace />);
    fireEvent.click(screen.getByRole("button", { name: "RUN LIVE TRACE" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/may be unavailable or.*blocked/i);
    expect(screen.getByRole("button", { name: "RUN LOCAL DEMO" })).toBeEnabled();
    expect(screen.queryByText(/disable extensions/i)).not.toBeInTheDocument();
  });
});
