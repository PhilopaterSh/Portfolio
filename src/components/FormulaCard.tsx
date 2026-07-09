const FormulaCard = () => {
  return (
    <div className="awareness-card awareness-card--compact">
      <h4 className="awareness-card-label" style={{ color: "var(--accent-blue)" }}>
        [ FORMULA ]
      </h4>
      <div className="formula-display">
        E = log₂ (R<sup>L</sup>)
      </div>
      <p className="formula-description">
        Entropy (E) is calculated based on the character pool size (R) and the password length (L).
        Higher entropy means higher resistance to brute-force attacks.
      </p>
    </div>
  );
};

export default FormulaCard;
