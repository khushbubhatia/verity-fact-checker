// ─── newsapi.js ───────────────────────────────────────────────────────────────
// GNews API with ENTITY BLOCKING:
// Works in both Vite (browser) and Node.js (tests)

import { callAI } from "./api.js";

// Get API key - works in both Vite and Node.js
const GNEWS_KEY = (typeof import.meta.env !== 'undefined' && import.meta.env.VITE_GNEWS_KEY) 
  || process.env.VITE_GNEWS_KEY;

const BASE = "https://gnews.io/api/v4";

async function trySearch(query) {
  const url = new URL(`${BASE}/search`);
  url.searchParams.set("q",        query);
  url.searchParams.set("lang",     "en");
  url.searchParams.set("sortby",   "publishedAt");
  url.searchParams.set("max",      "20");
  url.searchParams.set("apikey",   GNEWS_KEY);

  const res = await fetch(url.toString());
  
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.errors?.[0] || `${res.status}`);
  }

  const data = await res.json();
  return data.articles || [];
}

export async function fetchNewsArticles(topic) {
  if (!GNEWS_KEY) throw new Error("VITE_GNEWS_KEY missing in .env");

  // Clean input
  const cleaned = topic
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[""]/g, "")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (cleaned.length < 2) {
    throw new Error("Search query too short");
  }

  // Simple spell correction
  let corrected = cleaned;
  try {
    const fixPrompt = `Fix spelling: "${cleaned}"
Return ONLY the corrected words, same count, no additions.`;

    const response = await callAI("Fix typos only.", fixPrompt);
    
    corrected = response
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    
    const originalWords = cleaned.split(/\s+/).filter(Boolean);
    const correctedWords = corrected.split(/\s+/).filter(Boolean);
    
    if (correctedWords.length !== originalWords.length) {
      corrected = cleaned;
    }
    
    console.log("Original:", cleaned);
    console.log("Corrected:", corrected);
  } catch (err) {
    corrected = cleaned;
  }

  // Extract keywords
  const words = corrected
    .split(/\s+/)
    .filter(w => w.length > 2)
    .filter(w => !["the","and","are","was","were","put","get","has","had","will","can","may","for","with","from","about","this","that","what","how","why","when","today","latest"].includes(w));

  // Search strategies
  const strategies = [
    corrected,
    words.join(" "),
    words.slice(0, 3).join(" "),
  ].filter(s => s && s.length >= 3);

  console.log("Search strategies:", strategies);

  let allArticles = [];
  let usedQuery = "";

  for (const query of strategies) {
    console.log(`Trying: "${query}"`);
    
    try {
      const articles = await trySearch(query);
      
      if (articles.length > 0) {
        console.log(`✓ Found ${articles.length} articles`);
        allArticles = articles;
        usedQuery = query;
        break;
      }
    } catch (err) {
      console.warn(`Failed: ${err.message}`);
    }
  }

  if (allArticles.length === 0) {
    throw new Error(`No articles found for "${topic}".`);
  }

  // Normalize
  const normalized = allArticles
    .filter(a => a.title && a.description)
    .slice(0, 15)
    .map(a => ({
      headline: a.title,
      source:   a.source?.name || "Unknown",
      date: a.publishedAt
        ? new Date(a.publishedAt).toLocaleDateString("en-US", {
            month: "short", day: "numeric", year: "numeric",
          })
        : "Recent",
      snippet: a.description || "",
      url:     a.url || null,
    }));

  // ENTITY-BASED BLOCKING
  try {
    const articleList = normalized
      .map((a, i) => `${i}. ${a.headline}\n   ${a.snippet.slice(0, 80)}...`)
      .join("\n\n");

    const filterPrompt = `User searched for: "${topic}"

Articles:
${articleList}

ENTITY BLOCKING RULES:
1. Extract ALL country names, company names, and specific entities from each article
2. Check if user mentioned those entities in their search "${topic}"
3. REJECT articles that focus on entities user did NOT mention
4. Example: User searched "US tariffs" (mentions: US)
   - Article about "India's exports to US" → REJECT (focuses on India, not mentioned)
   - Article about "US-China trade war" → REJECT (focuses on China, not mentioned)  
   - Article about "US announces new tariffs" → KEEP (general US news)
   - Article about "Trump tariff policy" → KEEP (general US news)

Return ONLY the numbers of articles to KEEP (e.g., "2,5,7").
If ALL should be kept → "ALL"
If NONE should be kept → "NONE"

Numbers to keep:`;

    const response = await callAI(
      "Block articles about entities user didn't mention.",
      filterPrompt
    );
    
    console.log("Entity filter:", response);

    const lower = response.toLowerCase();
    
    if (lower.includes("none")) {
      console.warn("All articles blocked, using fallback");
      return normalized.slice(0, 5);
    }

    if (lower.includes("all")) {
      return normalized.slice(0, 8);
    }

    const indices = response
      .match(/\d+/g)
      ?.map(n => parseInt(n))
      ?.filter(n => n >= 0 && n < normalized.length) || [];

    if (indices.length === 0) {
      console.warn("No valid indices, using fallback");
      return normalized.slice(0, 5);
    }

    const filtered = indices.map(i => normalized[i]).filter(Boolean);
    console.log(`✓ Kept ${filtered.length} articles (blocked ${normalized.length - filtered.length})`);
    
    if (filtered.length < 3) {
      console.warn("Too few articles, relaxing filter");
      return normalized.slice(0, 5);
    }

    return filtered.slice(0, 8);

  } catch (err) {
    console.error("Filter error:", err);
    return normalized.slice(0, 5);
  }
}

export function buildContext(articles) {
  return articles
    .map((a, i) =>
      `${i + 1}. [${a.source} · ${a.date}] ${a.headline}\n   ${a.snippet}`
    )
    .join("\n\n");
}