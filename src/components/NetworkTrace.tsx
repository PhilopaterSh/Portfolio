import { useState } from "react";
import { fetchNetworkTrace, type NetworkTraceData } from "../utils/networkTrace";

type TraceStatus =
  "idle" | "live-loading" | "demo-loading" | "live-success" | "demo-success" | "error";

const demoData: NetworkTraceData = {
  ip: "192.0.2.24",
  city: "Example City",
  region: "Example Region",
  country_name: "Example Country",
  country_code: "EX",
  postal: "00000",
  timezone: "UTC",
  org: "Example Network",
  simulated: true,
};

/** Displays the privacy disclosure and optional live or local network trace. */
const NetworkTrace = () => {
  const [locationData, setLocationData] = useState<NetworkTraceData | null>(null);
  const [status, setStatus] = useState<TraceStatus>("idle");

  const runLiveTrace = async () => {
    setStatus("live-loading");
    setLocationData(null);
    try {
      setLocationData(await fetchNetworkTrace());
      setStatus("live-success");
    } catch {
      setStatus("error");
    }
  };

  const runDemo = () => {
    setStatus("demo-loading");
    setLocationData(null);
    window.setTimeout(() => {
      setLocationData(demoData);
      setStatus("demo-success");
    }, 350);
  };

  const isLoading = status === "live-loading" || status === "demo-loading";
  const statusMessage = {
    idle: "No trace has been run. Choose live trace or local demo.",
    "live-loading": "Live trace is running.",
    "demo-loading": "Preparing local simulated data.",
    "live-success": "Live trace completed.",
    "demo-success": "Local demo completed. All displayed values are simulated.",
    error: "The lookup could not be completed. You can retry or use the local demo.",
  }[status];

  const fields = locationData
    ? [
        { label: "PUBLIC_IP", value: locationData.ip, color: "var(--accent-green)" },
        { label: "CITY", value: locationData.city },
        { label: "REGION", value: locationData.region },
        {
          label: "COUNTRY",
          value: `${locationData.country_name} (${locationData.country_code})`,
        },
        { label: "POSTAL", value: locationData.postal },
        { label: "TIMEZONE", value: locationData.timezone },
        { label: "ISP", value: locationData.org, fullWidth: true },
      ]
    : [];

  return (
    <div className="awareness-card">
      <div className="trace-header">
        <div>
          <h2 className="trace-title">
            <span className="trace-icon" aria-hidden="true">
              🌐
            </span>{" "}
            Network Identity Trace
          </h2>
          <p className="trace-description">
            This optional live lookup sends a request to ipify to obtain your public IP address,
            then sends that address to ipapi for approximate network and location details. Results
            may include city, region, country, postal code, timezone, and network provider. Review
            each provider&apos;s privacy information before choosing a live trace. The local demo
            makes no network requests.
          </p>
        </div>
        <div className="trace-actions">
          <button onClick={runLiveTrace} disabled={isLoading} className="trace-btn">
            {status === "live-loading" ? "SCANNING..." : "RUN LIVE TRACE"}
          </button>
          <button onClick={runDemo} disabled={isLoading} className="trace-simulate-btn">
            RUN LOCAL DEMO
          </button>
        </div>
      </div>

      <p className="trace-status" role="status" aria-live="polite" aria-atomic="true">
        {statusMessage}
      </p>

      {status === "error" && (
        <div className="trace-error" role="alert">
          <span>The providers may be unavailable or the request may have been blocked.</span>
          <span>Retry the live lookup or use the local demo.</span>
        </div>
      )}

      {locationData ? (
        <>
          {locationData.simulated && <p className="trace-simulated-label">SIMULATED DEMO DATA</p>}
          <div className="trace-grid">
            {fields.map((item) => (
              <div key={item.label} className={`trace-item ${item.fullWidth ? "full-width" : ""}`}>
                <div className="trace-item-label">{item.label}</div>
                <div
                  className="trace-item-value"
                  style={{ color: item.color || "var(--text-primary)" }}
                >
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="trace-idle">
          No lookup starts automatically. Choose live trace only after reviewing the disclosure, or
          try the local demo.
        </div>
      )}
    </div>
  );
};

export default NetworkTrace;
