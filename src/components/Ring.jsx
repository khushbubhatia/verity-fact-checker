import { useState, useEffect } from "react";
import { scoreStyle } from "../constants";

export default function Ring({ score }) {
  const [anim, setAnim] = useState(0);
  const R = 52;
  const C = 2 * Math.PI * R;
  const { color } = scoreStyle(score);

  useEffect(() => {
    setAnim(0);
    const t = setTimeout(() => setAnim(score), 80);
    return () => clearTimeout(t);
  }, [score]);

  return (
    <div style={{ position: "relative", width: 132, height: 132, flexShrink: 0 }}>
      <svg width="132" height="132" style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx="66" cy="66" r={R}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="12"
        />
        <circle
          cx="66" cy="66" r={R}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeDasharray={C}
          strokeDashoffset={C - (anim / 100) * C}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1.5s cubic-bezier(.4,0,.2,1)" }}
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
      }}>
        <span style={{
          fontSize: 30, fontWeight: 800, color,
          fontFamily: "'Space Mono', monospace", lineHeight: 1,
        }}>
          {score}
        </span>
        <span style={{
          fontSize: 9, color: "rgba(255,255,255,0.28)",
          letterSpacing: 2, marginTop: 2,
        }}>
          / 100
        </span>
      </div>
    </div>
  );
}
