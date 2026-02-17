// ─── SearchHistory.jsx ────────────────────────────────────────────────────────
// Component that displays and manages search history using localStorage

import { useState, useEffect } from "react";

export default function SearchHistory({ onSelect }) {
  const [history, setHistory] = useState([]);

  // Load history from localStorage on mount
  useEffect(() => {
    loadHistory();
  }, []);

  function loadHistory() {
    try {
      const saved = localStorage.getItem("verity-search-history");
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (err) {
      console.warn("Failed to load history:", err);
    }
  }

  function clearHistory() {
    setHistory([]);
    try {
      localStorage.removeItem("verity-search-history");
    } catch (err) {
      console.warn("Failed to clear history:", err);
    }
  }

  if (history.length === 0) return null;

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
      }}>
        <span style={{
          fontSize: 9,
          letterSpacing: 2,
          color: "rgba(255,255,255,0.2)",
          textTransform: "uppercase",
        }}>
          Recent Searches
        </span>
        <button
          onClick={clearHistory}
          style={{
            background: "none",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.25)",
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 9,
            letterSpacing: 1,
            padding: "4px 10px",
            borderRadius: 3,
            transition: "all 0.2s",
          }}
          onMouseOver={(e) => {
            e.target.style.color = "rgba(255,255,255,0.5)";
            e.target.style.borderColor = "rgba(255,255,255,0.15)";
          }}
          onMouseOut={(e) => {
            e.target.style.color = "rgba(255,255,255,0.25)";
            e.target.style.borderColor = "rgba(255,255,255,0.08)";
          }}
        >
          CLEAR
        </button>
      </div>

      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 7,
      }}>
        {history.map((query, i) => (
          <button
            key={i}
            className="chip"
            onClick={() => onSelect(query)}
            style={{
              background: "rgba(59,130,246,0.08)",
              border: "1px solid rgba(59,130,246,0.2)",
              color: "rgba(147,197,253,0.7)",
            }}
          >
            {query}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Helper function to add to history (call from App.jsx) ───────────────────
export function saveSearchToHistory(query) {
  try {
    const saved = localStorage.getItem("verity-search-history");
    const history = saved ? JSON.parse(saved) : [];
    
    // Add to front, remove duplicates, keep last 10
    const newHistory = [
      query,
      ...history.filter(h => h.toLowerCase() !== query.toLowerCase())
    ].slice(0, 10);
    
    localStorage.setItem("verity-search-history", JSON.stringify(newHistory));
  } catch (err) {
    console.warn("Failed to save history:", err);
  }
}
