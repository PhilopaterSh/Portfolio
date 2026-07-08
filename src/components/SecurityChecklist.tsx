interface ChecklistItem {
  label: string;
  met: boolean;
  gain: string;
}

interface SecurityChecklistProps {
  criteria: ChecklistItem[];
  isComplete: boolean;
}

const SecurityChecklist = ({ criteria, isComplete }: SecurityChecklistProps) => {
  return (
    <div className="awareness-card">
      <h3 className="checklist-title">SECURITY_CHECKLIST</h3>
      <div className="checklist-container">
        {criteria.map((item, i) => (
          <div
            key={i}
            className={`checklist-item ${item.met ? "met" : ""}`}
          >
            <div className="checklist-item-inner">
              <div
                className="checklist-dot"
                style={{
                  backgroundColor: item.met ? "var(--accent-green)" : "var(--border-color)",
                  boxShadow: item.met ? "0 0 10px var(--accent-green)" : "none",
                }}
              ></div>
              <span
                className="checklist-label"
                style={{
                  color: item.met ? "var(--text-primary)" : "var(--text-secondary)",
                }}
              >
                {item.label}
              </span>
            </div>
            {!item.met && (
              <span className="checklist-gain">{item.gain}</span>
            )}
          </div>
        ))}
      </div>
      {isComplete && (
        <div className="checklist-optimized">
          [ SYSTEM_STATUS: FULLY_OPTIMIZED ]
        </div>
      )}
    </div>
  );
};

export default SecurityChecklist;
