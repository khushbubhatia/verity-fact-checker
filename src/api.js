// ─── api.js ───────────────────────────────────────────────────────────────────
// This file handles all AI API calls.
// We switched from Claude (paid) to Groq (free forever).
//
// WHAT IS GROQ?
// Groq is a company that runs open-source AI models (like Meta's Llama)
// on their own super-fast hardware. The models are free to use via their API.
// The quality is slightly below Claude but more than good enough for fact-checking.
//
// IMPORTANT THING TO LEARN:
// Groq uses the exact same message format as OpenAI's API.
// This format — called the "OpenAI Chat format" — has become the industry standard.
// Almost every AI provider (Groq, OpenAI, Mistral, Together AI etc) uses it.
// Once you understand this format, you can talk to ANY of them.

// ─── Config ───────────────────────────────────────────────────────────────────

// Groq's API endpoint — this is the URL we send our requests to
const API_URL = "https://api.groq.com/openai/v1/chat/completions";

// The model we want to use. Groq hosts several free models:
// - "llama-3.3-70b-versatile"  → best quality, good for analysis (we use this)
// - "llama-3.1-8b-instant"     → faster but less accurate
// - "mixtral-8x7b-32768"       → good at following instructions
const MODEL = "llama-3.3-70b-versatile";

// ─── getHeaders ───────────────────────────────────────────────────────────────
// Every request to the API needs headers — think of them as metadata attached
// to the request that tells the server:
// 1. "Content-Type: application/json" → the body I'm sending is JSON
// 2. "Authorization: Bearer <key>"    → here's my API key to prove who I am
//
// "Bearer" is just a standard word used in auth headers — it means
// "the person bearing (carrying) this token is allowed in"
function getHeaders() {
  const key = (typeof import.meta.env !== "undefined" && import.meta.env.VITE_GROQ_API_KEY) || process.env.VITE_GROQ_API_KEY;
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${key}`,
  };
}

// ─── callAI ───────────────────────────────────────────────────────────────────
// This is the core function that talks to the AI.
//
// HOW LLMs WORK IN ONE PARAGRAPH:
// An LLM (Large Language Model) is a neural network trained on billions of
// pieces of text. It learned patterns in language so well that given any
// sequence of text (the "prompt"), it can predict what text should come next.
// That's literally all it does — predicts the next token (word/piece) over
// and over. But because it trained on SO much text, those predictions end up
// being incredibly useful: answering questions, reasoning, writing code, etc.
//
// HOW WE TALK TO ONE:
// We send it a "messages" array — a conversation history with roles:
//   { role: "system", content: "You are a fact-checker..." }  ← sets behaviour
//   { role: "user",   content: "Verify this claim: ..." }     ← our question
// The model reads all of it and generates the next message (role: "assistant")
//
// The "system" message is special — it's instructions that shape how the model
// behaves for the ENTIRE conversation. It's how we turn a general LLM into
// a specific tool (fact-checker, code helper, translator, etc).
export async function callAI(systemPrompt, userMessage) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: getHeaders(),

    // JSON.stringify() converts our JavaScript object into a JSON string
    // because HTTP requests send text, not JavaScript objects
    body: JSON.stringify({
      model: MODEL,

      // max_tokens = the maximum length of the AI's reply
      // 1 token ≈ 0.75 words. 2000 tokens ≈ 1500 words.
      // We need enough room for the full JSON response with all claims/sources
      max_tokens: 2000,

      // temperature controls how "creative" vs "focused" the model is
      // 0.0 = very deterministic, same answer every time (good for JSON/facts)
      // 1.0 = more creative and varied (good for writing/brainstorming)
      // We use 0.1 because we want consistent, factual JSON output
      temperature: 0.1,

      // The messages array — this is the conversation we send to the model
      // "system" sets the AI's role and rules for the whole conversation
      // "user" is our actual request/question
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user",   content: userMessage  },
      ],
    }),
  });

  // If the server returned an error code, read it and throw so the UI shows it
  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Groq API error: ${err.error?.message || res.status}`);
  }

  const data = await res.json();

  // Groq (OpenAI format) returns the reply here:
  // data.choices[0].message.content
  // "choices" is an array because you can ask for multiple completions at once
  // We only asked for one, so we always take index [0]
  return data.choices[0].message.content;
}

// ─── parseJSON ────────────────────────────────────────────────────────────────
// LLMs return plain text. But we asked the model to reply in JSON format.
// The problem: models sometimes wrap JSON in ```json ... ``` markdown blocks,
// or add a sentence before/after it.
//
// This function strips all that and extracts just the raw JSON object,
// then parses it into a real JavaScript object we can use in the UI.
export function parseJSON(text) {
  // Remove markdown code fences if present (```json ... ```)
  const clean = text.replace(/```json\n?|```/g, "").trim();

  // Find where the JSON object starts and ends
  // indexOf("{") finds the first { character
  // lastIndexOf("}") finds the LAST } character
  const start = clean.indexOf("{");
  const end   = clean.lastIndexOf("}");

  if (start === -1 || end === -1) throw new Error("No JSON found in response");

  // slice() cuts out just that portion of the string, then JSON.parse() converts
  // the JSON string into a real JavaScript object
  return JSON.parse(clean.slice(start, end + 1));
}