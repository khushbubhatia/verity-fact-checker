import { useState, useEffect } from "react";

export default function ConfBar({ value, color }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setWidth(value), 400);
    return () => clearTimeout(t);
  }, [value]);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 7 }}>
      <div style={{
        flex: 1, height: 3,
        background: "rgba(255,255,255,0.05)",
        borderRadius: 2, overflow: "hidden",
      }}>
        <div style={{
          height: "100%",
          width: `${width}%`,
          background: color,
          borderRadius: 2,
          transition: "width 1s ease",
        }} />
      </div>
      <span style={{
        fontSize: 9, color: "rgba(255,255,255,0.28)",
        width: 28, textAlign: "right",
      }}>
        {value}%
      </span>
    </div>
  );
}
