interface TimeScaleRow {
  min: number;
  max: number;
  bits: string;
  time: string;
  color: string;
  desc: string;
}

interface TimeToCrackProps {
  timeScale: TimeScaleRow[];
  entropy: number;
  password: string;
}

const TimeToCrack = ({ timeScale, entropy, password }: TimeToCrackProps) => {
  return (
    <div className="awareness-card awareness-card--compact">
      <h4 className="awareness-card-label" style={{ color: "#ffa500" }}>
        [ TIME_TO_CRACK ]
      </h4>
      <div className="time-scale-list">
        {timeScale.map((row, i) => {
          const isActive = entropy >= row.min && entropy <= row.max;
          return (
            <div
              key={i}
              className={`time-scale-row ${isActive ? "time-scale-row--active" : ""}`}
              style={{
                borderColor: isActive ? row.color : "transparent",
                opacity: password.length > 0 && !isActive ? 0.3 : 1,
              }}
            >
              <div className="time-scale-row-header">
                <span className="time-scale-bits" style={{ color: isActive ? row.color : "var(--text-secondary)" }}>
                  {row.bits} BIT
                </span>
                <span className="time-scale-time" style={{ color: isActive ? "var(--text-primary)" : "var(--text-secondary)" }}>
                  {row.time}
                </span>
              </div>
              {isActive && (
                <div className="time-scale-desc">{row.desc}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TimeToCrack;
