// ─── prompts.js ───────────────────────────────────────────────────────────────
// All AI prompts live here.
//
// WHY SPLIT INTO SYSTEM + USER?
// The OpenAI/Groq message format has two distinct roles:
//
// SYSTEM prompt = permanent instructions that define the AI's behaviour.
//   Think of it like a job description you hand to a new employee.
//   "You are a fact-checker. Always reply in JSON. Never make things up."
//   The model carries these rules for the entire conversation.
//
// USER prompt = the actual request for this specific search.
//   "Here are 5 articles about Gaza. Verify these claims."
//   This changes every time the user does a new search.
//
// Keeping them separate is good practice because:
// 1. You can reuse the system prompt across many different user messages
// 2. It's clearer what's a rule vs what's a request
// 3. Some providers charge less for cached system prompts

// ─── SYSTEM prompt ────────────────────────────────────────────────────────────
// This never changes — it defines the AI's role and output format.
// We export it as a constant (not a function) because it's always the same.
export const SYSTEM_PROMPT =
  `You are a senior fact-checker and misinformation analyst.
You will be given a topic and a set of real news articles fetched today.
Your job is to verify the topic against those articles.

RULES:
- "Verified"      = at least one credible article confirms this
- "False"         = articles directly contradict this
- "Misleading"    = technically true but missing key context
- "Needs Context" = partially true, needs clarification
- "Unverified"    = genuinely zero coverage in the articles (rare)
- Score 75-95 for confirmed claims. 10-35 for false. 40-70 for mixed.
- Always name the actual source when explaining a verdict
- Break the topic into 3-5 specific sub-claims and assess each separately
- Be decisive — never default to Unverified when you have evidence

CRITICAL: Reply with ONLY a raw JSON object. No markdown. No explanation before or after.`;

// ─── USER prompt ──────────────────────────────────────────────────────────────
// This IS a function because it changes every search — it takes the user's
// topic and the articles we fetched, and builds the request string.
//
// Notice we pass the articles as formatted text, not as a JavaScript object.
// LLMs read text — they don't receive structured data directly.
// The buildContext() function in newsapi.js formats the articles into
// readable text that the model can understand.
export const USER_PROMPT = (topic, context, articles) =>
  `Today is ${new Date().toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric"
  })}.

TOPIC TO VERIFY: "${topic}"

LIVE NEWS ARTICLES (${articles.length} fetched from MediaStack right now):
${context}

Return ONLY this JSON structure:
{
  "credibilityScore": <0-100>,
  "verdict": "<Credible | Mostly Credible | Mixed | Questionable | Misleading | False>",
  "summary": "<2-3 sentence overview of what these articles actually say>",
  "realNewsConfirms": "<specific facts confirmed by the articles — name sources and dates>",
  "flaggedClaims": [
    {
      "claim": "<specific sub-claim extracted from the topic>",
      "assessment": "<Verified | False | Misleading | Needs Context | Unverified>",
      "explanation": "<cite specific source: 'According to [Source] ([date])...'>",
      "confidence": <0-100>
    }
  ],
  "suggestedSources": [
    {
      "name": "<real outlet or org>",
      "type": "<News|Fact-Check|Government|Academic>",
      "description": "<why check this for this topic>"
    }
  ],
  "analysisNotes": "<1-2 sentence overall credibility takeaway>"
}`;
