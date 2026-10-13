import { describe, expect, it, vi } from "vitest";
import { fetchNetworkTrace, normalizeLocation, readPublicIp } from "./networkTrace";

describe("network trace response handling", () => {
  it("accepts an IP string and trims whitespace", () => {
    expect(readPublicIp({ ip: "  203.0.113.7 " })).toBe("203.0.113.7");
  });

  it.each([null, {}, { ip: null }, { ip: 7 }, { ip: " " }])(
    "rejects invalid IP responses: %j",
    (value) => expect(() => readPublicIp(value)).toThrow(),
  );

  it("normalizes complete and partial location data", () => {
    expect(normalizeLocation({ ip: "203.0.113.7", city: "Cairo" })).toMatchObject({
      ip: "203.0.113.7",
      city: "Cairo",
      region: "Unavailable",
      org: "Unavailable",
      simulated: false,
    });
  });

  it.each([null, [], "bad", { error: true }, { error: true, reason: "limited" }])(
    "rejects unusable or provider-error responses: %j",
    (value) => expect(() => normalizeLocation(value)).toThrow(),
  );

  it("handles HTTP failures without issuing the second request", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false });
    vi.stubGlobal("fetch", fetchMock);

    await expect(fetchNetworkTrace()).rejects.toThrow("IP provider request failed");
    expect(fetchMock).toHaveBeenCalledTimes(1);

    vi.unstubAllGlobals();
  });

  it("requests location only after validating the IP response", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ ip: "203.0.113.7" }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ city: "Cairo" }) });
    vi.stubGlobal("fetch", fetchMock);

    await expect(fetchNetworkTrace()).resolves.toMatchObject({ city: "Cairo", simulated: false });
    expect(fetchMock.mock.calls[1][0]).toBe("https://ipapi.co/203.0.113.7/json/");

    vi.unstubAllGlobals();
  });
});
