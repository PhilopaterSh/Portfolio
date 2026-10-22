interface BruteForceAnalysisProps {
  entropy: number;
  color: string;
}

/** Awareness card estimating brute-force attempts from entropy bits.
 *
 * @param entropy - Current password entropy in bits.
 * @param color - CSS color token for the strength-tinted value and border.
 */
const BruteForceAnalysis = ({ entropy, color }: BruteForceAnalysisProps) => {
  return (
    <div className="awareness-card awareness-card--compact">
      <h4 className="awareness-card-label" style={{ color: "var(--entropy-very-weak)" }}>
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
