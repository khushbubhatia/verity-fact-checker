import { useState, useRef } from "react";
import "./index.css";

import { callAI, parseJSON }                from "./api";
import { SYSTEM_PROMPT, USER_PROMPT }      from "./prompts";
import { fetchNewsArticles, buildContext } from "./newsapi";
import {
  scoreStyle,
  ASSESSMENT_STYLE,
  SOURCE_COLORS,
  SUGGESTION_CHIPS,
} from "./constants";

import Ring        from "./components/Ring";
import ConfBar     from "./components/ConfBar";
import StepLoader  from "./components/StepLoader";
import SearchHistory, { saveSearchToHistory } from "./components/SearchHistory";

export default function App() {
  const [input,      setInput]      = useState("");
  const [step,       setStep]       = useState(0);   // 0=idle 1=searching 2=processing 3=verifying
  const [articles,   setArticles]   = useState([]);
  const [result,     setResult]     = useState(null);
  const [error,      setError]      = useState(null);
  const [tab,        setTab]        = useState("claims");
  const [title,      setTitle]      = useState("");
  const [searchDate, setSearchDate] = useState("");
  const inputRef = useRef(null);

  const loading   = step > 0;
  const canSubmit = input.trim().length >= 5 && !loading;

  async function run() {
    if (!canSubmit) return;
    setError(null);
    setResult(null);
    setArticles([]);
    setTitle("");
    setSearchDate("");

    try {
      // ── Step 1: Fetch live articles from NewsAPI (free, no Claude credits) ───
      setStep(1);
      const arts = await fetchNewsArticles(input.trim());
      setArticles(arts);
      setTitle(input.trim());
      setSearchDate(new Date().toISOString().slice(0, 10));

      // Save to search history
      saveSearchToHistory(input.trim());

      // ── Step 2: Build context string ─────────────────────────────────────────
      setStep(2);
      const context = buildContext(arts);
      await new Promise((r) => setTimeout(r, 300));

      // ── Step 3: Groq analyzes articles (free, 1 API call only) ──────────────
      setStep(3);
      const analysisText = await callAI(
        SYSTEM_PROMPT,
        USER_PROMPT(input.trim(), context, arts)
      );

      const parsed = parseJSON(analysisText);
      setResult(parsed);
      setTab("claims");
    } catch (e) {
      setError("Analysis failed: " + e.message);
      console.error(e);
    } finally {
      setStep(0);
    }
  }

  function reset() {
    setResult(null);
    setArticles([]);
    setInput("");
    setSearchDate("");
    setTitle("");
    setError(null);
  }

  const sco = result ? scoreStyle(result.credibilityScore) : null;

  return (
    <div style={{ minHeight: "100vh", background: "#070b12", overflowX: "hidden" }}>

      {/* Scanline animation */}
      {loading && (
        <div style={{
          position: "fixed", left: 0, right: 0, height: 1, zIndex: 999,
          background: "linear-gradient(90deg, transparent, #3b82f6 45%, #818cf8, transparent)",
          animation: "scanline 2s linear infinite",
        }} />
      )}

      {/* Background glow orbs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{
          position: "absolute", left: "8%", top: "-8%", width: 600, height: 600,
          background: "radial-gradient(circle, rgba(29,78,216,0.16), transparent 65%)",
          filter: "blur(30px)",
        }} />
        <div style={{
          position: "absolute", right: "3%", bottom: "15%", width: 400, height: 400,
          background: "radial-gradient(circle, rgba(109,40,217,0.1), transparent 65%)",
          filter: "blur(30px)",
        }} />
      </div>

      {/* ── Main content ── */}
      <div style={{ maxWidth: 880, margin: "0 auto", padding: "0 20px 80px", position: "relative", zIndex: 1 }}>

        {/* HEADER */}
        <div style={{ paddingTop: 52, paddingBottom: 36, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{
              width: 7, height: 7, borderRadius: "50%",
              background: "#22c55e", boxShadow: "0 0 8px #22c55e",
              animation: "blink 2.5s ease infinite",
            }} />
            <span style={{ fontSize: 9, letterSpacing: 4, color: "rgba(255,255,255,0.2)", textTransform: "uppercase" }}>
              VERITY · REAL-TIME WEB SEARCH · v4.0
            </span>
          </div>
          <h1 style={{
            fontSize: "clamp(26px, 5vw, 42px)", fontFamily: "'Space Mono', monospace",
            fontWeight: 700, letterSpacing: -1, color: "#f8fafc", lineHeight: 1.1,
          }}>
            FACT<span style={{ color: "#3b82f6" }}>_</span>CHECK
            <span style={{ color: "rgba(255,255,255,0.12)", fontSize: "0.52em" }}> // LIVE TODAY</span>
          </h1>
          <p style={{ marginTop: 8, color: "rgba(255,255,255,0.26)", fontSize: 11, letterSpacing: 1 }}>
            Searches the web in real-time · today's news · no knowledge cutoff
          </p>
        </div>

        {/* INPUT SECTION */}
        <div style={{ paddingTop: 32 }}>
          <label style={{
            display: "block", fontSize: 9, letterSpacing: 3,
            color: "rgba(255,255,255,0.2)", textTransform: "uppercase", marginBottom: 10,
          }}>
            Enter a news topic, claim, or headline
          </label>

          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); run(); }}}
            placeholder={"e.g. \"Trump signed tariffs today\"\nor \"Gaza ceasefire latest update\"\nor \"Is there a new OpenAI model?\""}
            rows={4}
            disabled={loading}
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.025)",
              border: `1px solid ${loading ? "rgba(59,130,246,0.5)" : "rgba(255,255,255,0.08)"}`,
              borderRadius: 6, color: "#cbd5e1",
              fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, lineHeight: 1.75,
              padding: "16px 18px", transition: "border-color 0.3s",
            }}
          />

          {/* Suggestion chips */}
          {!result && !loading && (
            <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 7, alignItems: "center" }}>
              <span style={{ fontSize: 9, color: "rgba(255,255,255,0.15)", letterSpacing: 2, marginRight: 4 }}>TRY:</span>
              {SUGGESTION_CHIPS.map((s) => (
                <button key={s} className="chip" onClick={() => setInput(s)}>{s}</button>
              ))}
            </div>
          )}

          {/* Search History */}
          {!result && !loading && (
            <SearchHistory onSelect={(query) => {
              reset();  // Reset to initial page
              setInput(query);  // Fill input with selected query
            }} />
          )}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
            {result && !loading && (
              <button className="ghost-btn" onClick={reset}>← NEW SEARCH</button>
            )}
            <div style={{ marginLeft: "auto" }}>
              <button className="submit-btn" onClick={run} disabled={!canSubmit}>
                {loading ? (
                  <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{
                      width: 11, height: 11,
                      border: "2px solid rgba(255,255,255,0.2)", borderTopColor: "#fff",
                      borderRadius: "50%", display: "inline-block",
                      animation: "spin 0.75s linear infinite",
                    }} />
                    {step === 1 ? "SEARCHING WEB..." : step === 2 ? "READING RESULTS..." : "VERIFYING..."}
                  </span>
                ) : "▶ VERIFY NOW"}
              </button>
            </div>
          </div>

          {loading && (
            <div className="card fade-up" style={{ padding: "18px 22px", marginTop: 20 }}>
              <StepLoader step={step - 1} />
            </div>
          )}
        </div>

        {/* ERROR */}
        {error && (
          <div style={{
            marginTop: 20, padding: "13px 18px",
            background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: 6, color: "#f87171", fontSize: 12,
          }}>
            ⚠ {error}
          </div>
        )}

        {/* ── RESULTS ── */}
        {result && (
          <div className="fade-up" style={{ marginTop: 36 }}>

            {/* Score card */}
            <div className="card" style={{
              padding: "24px 28px", marginBottom: 16,
              display: "flex", gap: 28, alignItems: "center", flexWrap: "wrap",
              borderColor: sco.border,
            }}>
              <Ring score={result.credibilityScore} />
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 9, letterSpacing: 3, color: "rgba(255,255,255,0.2)" }}>VERDICT</span>
                  {searchDate && (
                    <span className="pill" style={{
                      background: "rgba(59,130,246,0.1)", color: "#60a5fa",
                      border: "1px solid rgba(59,130,246,0.2)",
                    }}>
                      🔴 LIVE · {searchDate}
                    </span>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
                  <span style={{
                    fontSize: 20, fontFamily: "'Space Mono', monospace",
                    fontWeight: 700, color: sco.color,
                  }}>
                    {result.verdict}
                  </span>
                  <span className="pill" style={{ background: sco.bg, color: sco.color, border: `1px solid ${sco.border}` }}>
                    {result.credibilityScore}/100
                  </span>
                </div>
                <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 3, height: 5, maxWidth: 360, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: 3,
                    width: `${result.credibilityScore}%`,
                    background: `linear-gradient(90deg, ${result.credibilityScore < 40 ? "#ef4444" : result.credibilityScore < 65 ? "#f59e0b" : "#22c55e"}, ${sco.color})`,
                    transition: "width 1.4s cubic-bezier(.4,0,.2,1)",
                  }} />
                </div>
                <p style={{ marginTop: 12, fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.75, maxWidth: 460 }}>
                  {result.analysisNotes}
                </p>
              </div>
            </div>

            {/* Summary card */}
            <div className="card" style={{ padding: "20px 24px", marginBottom: 16 }}>
              <div style={{ fontSize: 9, letterSpacing: 3, color: "rgba(255,255,255,0.2)", marginBottom: 6 }}>TOPIC</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0", marginBottom: 14 }}>{title}</div>
              <div style={{ fontSize: 9, letterSpacing: 3, color: "rgba(255,255,255,0.2)", marginBottom: 8 }}>SUMMARY</div>
              <p style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.8, marginBottom: result.realNewsConfirms ? 14 : 0 }}>
                {result.summary}
              </p>
              {result.realNewsConfirms && <>
                <div style={{ fontSize: 9, letterSpacing: 3, color: "rgba(255,255,255,0.2)", marginBottom: 8 }}>
                  WHAT LIVE SEARCH FOUND TODAY
                </div>
                <p style={{ fontSize: 12, color: "#7dd3fc", lineHeight: 1.8, fontStyle: "italic" }}>
                  {result.realNewsConfirms}
                </p>
              </>}
            </div>

            {/* Articles found */}
            {articles.length > 0 && (
              <div className="card" style={{ padding: "20px 24px", marginBottom: 16 }}>
                <div style={{ fontSize: 9, letterSpacing: 3, color: "rgba(255,255,255,0.2)", marginBottom: 14 }}>
                  ARTICLES FOUND IN LIVE SEARCH ({articles.length})
                </div>
                {articles.map((a, i) => (
                  <div key={i} style={{
                    display: "flex", gap: 14, paddingBottom: 12,
                    marginBottom: i < articles.length - 1 ? 12 : 0,
                    borderBottom: i < articles.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  }}>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.15)", width: 18, flexShrink: 0, paddingTop: 2 }}>
                      {i + 1}.
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "flex-start", marginBottom: 5 }}>
                        {a.url ? (
                          <a 
                            href={a.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ 
                              fontSize: 12, 
                              color: "#60a5fa", 
                              lineHeight: 1.55, 
                              flex: 1,
                              textDecoration: "none",
                              cursor: "pointer"
                            }}
                            onMouseOver={(e) => e.target.style.textDecoration = "underline"}
                            onMouseOut={(e) => e.target.style.textDecoration = "none"}
                          >
                            {a.headline} →
                          </a>
                        ) : (
                          <span style={{ fontSize: 12, color: "#e2e8f0", lineHeight: 1.55, flex: 1 }}>{a.headline}</span>
                        )}
                        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                          <span className="pill" style={{ background: "rgba(96,165,250,0.1)", color: "#60a5fa", border: "1px solid rgba(96,165,250,0.2)" }}>
                            {a.source}
                          </span>
                          <span className="pill" style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.07)" }}>
                            {a.date}
                          </span>
                        </div>
                      </div>
                      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.32)", lineHeight: 1.6 }}>{a.snippet}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tabs */}
            <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: 16, display: "flex" }}>
              {[
                { id: "claims",  label: `Claims (${result.flaggedClaims?.length || 0})` },
                { id: "sources", label: `Sources (${result.suggestedSources?.length || 0})` },
              ].map((t) => (
                <button
                  key={t.id}
                  className={`tab${tab === t.id ? " active" : ""}`}
                  onClick={() => setTab(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Claims tab */}
            {tab === "claims" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {result.flaggedClaims?.map((c, i) => {
                  const s = ASSESSMENT_STYLE[c.assessment] || ASSESSMENT_STYLE.Unverified;
                  return (
                    <div key={i} className="card" style={{ padding: "18px 20px", borderColor: s.border }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 14, alignItems: "flex-start" }}>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: 13, color: "#e2e8f0", lineHeight: 1.6, marginBottom: 7 }}>
                            <span style={{ color: "rgba(255,255,255,0.15)", marginRight: 8, fontSize: 11 }}>
                              #{String(i + 1).padStart(2, "0")}
                            </span>
                            {c.claim}
                          </p>
                          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.38)", lineHeight: 1.65 }}>{c.explanation}</p>
                          {c.confidence !== undefined && <ConfBar value={c.confidence} color={s.color} />}
                        </div>
                        <span className="pill" style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, flexShrink: 0 }}>
                          <span style={{ fontWeight: 700 }}>{s.icon}</span>{c.assessment}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Sources tab */}
            {tab === "sources" && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 10 }}>
                {result.suggestedSources?.map((s, i) => {
                  const tc = SOURCE_COLORS[s.type] || "#94a3b8";
                  return (
                    <div key={i} className="card" style={{ padding: "18px 20px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{s.name}</span>
                        <span className="pill" style={{ background: `${tc}15`, color: tc, border: `1px solid ${tc}25` }}>
                          {s.type}
                        </span>
                      </div>
                      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", lineHeight: 1.65 }}>{s.description}</p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Footer */}
            <div style={{
              marginTop: 24, padding: "12px 0",
              borderTop: "1px solid rgba(255,255,255,0.04)",
              display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10,
            }}>
              <span style={{ fontSize: 9, color: "rgba(255,255,255,0.13)", letterSpacing: 1 }}>
                AI-powered · always verify with primary sources
              </span>
              <span style={{ fontSize: 9, color: "rgba(255,255,255,0.13)", letterSpacing: 1 }}>
                VERITY v4.0 · REAL-TIME SEARCH
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}