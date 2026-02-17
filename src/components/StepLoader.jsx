import { STEPS } from "../constants";

export default function StepLoader({ step }) {
  return (
    <div>
      {STEPS.map((label, i) => {
        const done   = i < step;
        const active = i === step;
        return (
          <div
            key={i}
            style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}
          >
            <div style={{
              width: 22, height: 22, borderRadius: "50%",
              flexShrink: 0, fontSize: 11,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: done
                ? "rgba(34,197,94,0.15)"
                : active
                ? "rgba(59,130,246,0.15)"
                : "rgba(255,255,255,0.03)",
              border: `1px solid ${
                done   ? "#22c55e55"
                : active ? "#3b82f680"
                : "rgba(255,255,255,0.07)"
              }`,
              color: done ? "#22c55e" : active ? "#60a5fa" : "rgba(255,255,255,0.18)",
            }}>
              {done ? "✓" : i + 1}
            </div>
            <span style={{
              fontSize: 11, letterSpacing: 1,
              color: done
                ? "rgba(255,255,255,0.35)"
                : active
                ? "#93c5fd"
                : "rgba(255,255,255,0.18)",
            }}>
              {label}
              {active && (
                <span style={{ marginLeft: 6, animation: "blink 1s infinite" }}>▋</span>
              )}
            </span>
          </div>
        );
      })}
    </div>
  );
}
