import { useState } from "react";
import { useTheme } from "../ThemeContext";

interface LocationData {
  ip: string;
  city: string;
  region: string;
  country_name: string;
  country_code: string;
  postal: string;
  timezone: string;
  org: string;
}

const NetworkTrace = () => {
  const { theme } = useTheme();
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const fetchLocation = async () => {
    setLoadingLocation(true);
    setLocationError(null);
    try {
      const ipResponse = await fetch("https://api.ipify.org?format=json");
      if (!ipResponse.ok) throw new Error("Could not retrieve IP address.");
      const { ip } = await ipResponse.json();

      const geoResponse = await fetch(`https://ipapi.co/${ip}/json/`);
      if (!geoResponse.ok) throw new Error("Could not retrieve geographical info.");
      const data = await geoResponse.json();

      if (data.error) throw new Error(data.reason || "Provider error");

      setLocationData({
        ip: data.ip,
        city: data.city,
        region: data.region,
        country_name: data.country_name,
        country_code: data.country_code,
        postal: data.postal,
        timezone: data.timezone,
        org: data.org,
      });
    } catch (error) {
      console.error("Trace Error:", error);
      setLocationError(
        "SECURITY_BLOCK: Your browser or Ad-Blocker is preventing the connection to ipify/ipapi. Disable extensions to see your real network identity.",
      );
    } finally {
      setLoadingLocation(false);
    }
  };

  const handleSimulate = () => {
    setLocationError(null);
    setLoadingLocation(true);
    setTimeout(() => {
      setLocationData({
        ip: "192.168.1.254 [SIMULATED]",
        city: "Cyber City",
        region: "Secure Zone",
        country_name: "The Web",
        country_code: "WW",
        postal: "00000",
        timezone: "GMT/UTC",
        org: "Shadow Network Solutions Inc.",
      });
      setLoadingLocation(false);
    }, 800);
  };

  return (
    <div className="awareness-card">
      <div className="trace-header">
        <div>
          <h2 className="trace-title">
            <span className="trace-icon" aria-hidden="true">🌐</span> Network Identity Trace
          </h2>
          <p className="trace-description">
            Analyze your digital exposure. This module evaluates your
            browser's privacy resilience.
          </p>
        </div>
        <button
          onClick={fetchLocation}
          disabled={loadingLocation}
          className="trace-btn"
        >
          {loadingLocation ? "SCANNING..." : "TRACE LOCATION"}
        </button>
      </div>

      {locationError && (
        <div className="trace-error">
          <div className="trace-error-content">
            <span aria-hidden="true">⚠️</span> {locationError}
          </div>
          <button onClick={handleSimulate} className="trace-simulate-btn">
            SIMULATE TRACE (DEMO)
          </button>
        </div>
      )}

      {locationData ? (
        <div className="trace-grid">
          {[
            { label: "PUBLIC_IP", value: locationData.ip, color: "var(--accent-green)" },
            { label: "CITY", value: locationData.city },
            { label: "REGION", value: locationData.region },
            { label: "COUNTRY", value: `${locationData.country_name} (${locationData.country_code})` },
            { label: "POSTAL", value: locationData.postal },
            { label: "TIMEZONE", value: locationData.timezone },
            { label: "ISP", value: locationData.org, fullWidth: true },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`trace-item ${item.fullWidth ? "full-width" : ""}`}
            >
              <div className="trace-item-label">{item.label}</div>
              <div className="trace-item-value" style={{ color: item.color || "var(--text-primary)" }}>
                {item.value || "N/A"}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="trace-idle">
          System idle. Press TRACE to begin network reconnaissance.
        </div>
      )}
    </div>
  );
};

export default NetworkTrace;
