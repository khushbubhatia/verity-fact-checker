// ─── constants.js ─────────────────────────────────────────────────────────────

// Score color/style by credibility number
export const scoreStyle = (s) =>
  s >= 75
    ? { color: "#22c55e", bg: "rgba(34,197,94,0.12)",   border: "rgba(34,197,94,0.28)"   }
    : s >= 50
    ? { color: "#f59e0b", bg: "rgba(245,158,11,0.12)",  border: "rgba(245,158,11,0.28)"  }
    : s >= 30
    ? { color: "#f97316", bg: "rgba(249,115,22,0.12)",  border: "rgba(249,115,22,0.28)"  }
    : { color: "#ef4444", bg: "rgba(239,68,68,0.12)",   border: "rgba(239,68,68,0.28)"   };

// Per-assessment badge styles
export const ASSESSMENT_STYLE = {
  Verified:        { color: "#22c55e", bg: "rgba(34,197,94,0.1)",   icon: "✓", border: "rgba(34,197,94,0.3)"   },
  False:           { color: "#ef4444", bg: "rgba(239,68,68,0.1)",   icon: "✗", border: "rgba(239,68,68,0.3)"   },
  Misleading:      { color: "#f97316", bg: "rgba(249,115,22,0.1)",  icon: "⚠", border: "rgba(249,115,22,0.3)"  },
  "Needs Context": { color: "#f59e0b", bg: "rgba(245,158,11,0.1)",  icon: "◉", border: "rgba(245,158,11,0.3)"  },
  Unverified:      { color: "#64748b", bg: "rgba(100,116,139,0.1)", icon: "?", border: "rgba(100,116,139,0.3)" },
};

// Source type badge colors
export const SOURCE_COLORS = {
  News:        "#60a5fa",
  "Fact-Check":"#f472b6",
  Academic:    "#818cf8",
  Government:  "#34d399",
  Official:    "#34d399",
};

// Quick-pick chip suggestions
export const SUGGESTION_CHIPS = [
  "Trump tariffs 2025",
  "Gaza ceasefire latest",
  "Ukraine war today",
  "US inflation February 2025",
  "OpenAI news",
  "Bitcoin price today",
];

// Loading step labels
export const STEPS = [
  "Fetching live articles from NewsAPI...",
  "Building analysis context...",
  "Claude verifying claims...",
];
