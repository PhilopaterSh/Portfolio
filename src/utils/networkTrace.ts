/** Data returned by the optional live network trace. */
export interface NetworkTraceData {
  ip: string;
  city: string;
  region: string;
  country_name: string;
  country_code: string;
  postal: string;
  timezone: string;
  org: string;
  simulated: boolean;
}

const unavailable = "Unavailable";

/** Converts an unknown provider value to a safe display string. */
function displayValue(value: unknown): string {
  return typeof value === "string" && value.trim() ? value.trim() : unavailable;
}

/** Validates the IP response before using it in the second provider request. */
export function readPublicIp(value: unknown): string {
  if (!value || typeof value !== "object" || !("ip" in value)) {
    throw new Error("The IP provider returned an invalid response.");
  }

  const ip = (value as { ip?: unknown }).ip;
  if (typeof ip !== "string" || !ip.trim()) {
    throw new Error("The IP provider returned an invalid address.");
  }

  return ip.trim();
}

/** Normalizes the location provider response, preserving partial data safely. */
export function normalizeLocation(value: unknown): NetworkTraceData {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("The location provider returned an invalid response.");
  }

  const data = value as Record<string, unknown>;
  if (data.error === true) {
    throw new Error("The location provider could not complete the lookup.");
  }

  return {
    ip: displayValue(data.ip),
    city: displayValue(data.city),
    region: displayValue(data.region),
    country_name: displayValue(data.country_name),
    country_code: displayValue(data.country_code),
    postal: displayValue(data.postal),
    timezone: displayValue(data.timezone),
    org: displayValue(data.org),
    simulated: false,
  };
}

/**
 * Performs the visitor-initiated requests to ipify and ipapi.
 *
 * Runs only when the visitor selects the live trace: resolves the public IP
 * first (ipify), then uses it to fetch location/network details (ipapi).
 * Provider failures and malformed responses throw so the component can render
 * a neutral error state.
 *
 * @returns Normalized trace data with `simulated: false`.
 */
export async function fetchNetworkTrace(): Promise<NetworkTraceData> {
  const ipResponse = await fetch("https://api.ipify.org?format=json");
  if (!ipResponse.ok) throw new Error("The IP provider request failed.");

  const ip = readPublicIp(await ipResponse.json());
  const locationResponse = await fetch(`https://ipapi.co/${encodeURIComponent(ip)}/json/`);
  if (!locationResponse.ok) throw new Error("The location provider request failed.");

  return normalizeLocation(await locationResponse.json());
}
