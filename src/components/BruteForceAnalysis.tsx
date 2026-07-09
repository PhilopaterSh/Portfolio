interface BruteForceAnalysisProps {
  entropy: number;
  color: string;
}

const BruteForceAnalysis = ({ entropy, color }: BruteForceAnalysisProps) => {
  return (
    <div className="awareness-card awareness-card--compact">
      <h4 className="awareness-card-label" style={{ color: "#ff4d4d" }}>
        [ BRUTE_FORCE_ANALYSIS ]
      </h4>
      <div className="attack-card" style={{ borderLeftColor: color }}>
        <p className="attack-description">
          <strong>Attack Method:</strong> Every possible combination is tested sequentially until
          the correct one is found.
        </p>
        <div className="attack-estimate">
          <div className="attack-estimate-label">CURRENT_ESTIMATE:</div>
          <div className="attack-estimate-value" style={{ color }}>
            {entropy > 0 ? `2^${Math.floor(entropy)} Attempts` : "IMMEDIATE_BREACH"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BruteForceAnalysis;
