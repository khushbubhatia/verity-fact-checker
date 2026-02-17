// ─── api-test.js ──────────────────────────────────────────────────────────────
// Automated test script - loads .env and tests newsapi.js functions
// Run with: node api-test.js

// STEP 1: Load environment variables from .env
import './test-config.js';

// STEP 2: Import functions to test
import { fetchNewsArticles, buildContext } from "./src/newsapi.js";

let passed = 0;
let failed = 0;

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';

function log(color, message) {
  console.log(`${color}${message}${RESET}`);
}

function assert(condition, testName) {
  if (condition) {
    passed++;
    log(GREEN, `✓ PASS: ${testName}`);
  } else {
    failed++;
    log(RED, `✗ FAIL: ${testName}`);
  }
}

async function test(name, fn) {
  log(YELLOW, `\n━━━ ${name} ━━━`);
  try {
    await fn();
  } catch (err) {
    failed++;
    log(RED, `✗ FAIL: ${name} - ${err.message}`);
  }
}

async function runTests() {
  console.log("\n╔════════════════════════════════════════╗");
  console.log("║   VERITY APP - AUTOMATED API TESTS    ║");
  console.log("╚════════════════════════════════════════╝\n");

  // Test 1: Simple search
  await test("TC-API-001: Simple search returns articles", async () => {
    const articles = await fetchNewsArticles("Bitcoin");
    assert(Array.isArray(articles), "Returns array");
    assert(articles.length > 0, "Array has articles");
    assert(articles.length <= 8, "Returns max 8 articles");
    assert(articles[0].headline, "Article has headline");
    assert(articles[0].source, "Article has source");
    assert(articles[0].date, "Article has date");
    assert(articles[0].snippet, "Article has snippet");
    assert(articles[0].url !== undefined, "Article has url field");
  });

  // Test 2: Typo correction
  await test("TC-API-002: Typo correction", async () => {
    const articles = await fetchNewsArticles("bitcon");
    assert(articles.length > 0, "Found articles despite typo");
    const hasRelevant = articles.some(a => 
      a.headline.toLowerCase().includes("bitcoin") || 
      a.snippet.toLowerCase().includes("bitcoin") ||
      a.headline.toLowerCase().includes("crypto")
    );
    assert(hasRelevant, "Articles are relevant");
  });

  // Test 3: Punctuation handling
  await test("TC-API-003: Handles punctuation", async () => {
    const articles = await fetchNewsArticles('"U.S. economy"');
    assert(articles.length > 0, "Found articles despite quotes and dots");
  });

  // Test 4: Context builder
  await test("TC-API-004: buildContext creates text", async () => {
    const mockArticles = [
      { headline: "Test 1", source: "BBC", date: "Feb 16, 2026", snippet: "Text 1", url: null },
      { headline: "Test 2", source: "CNN", date: "Feb 16, 2026", snippet: "Text 2", url: null },
    ];
    const context = buildContext(mockArticles);
    assert(typeof context === "string", "Returns string");
    assert(context.includes("Test 1"), "Contains first headline");
    assert(context.includes("BBC"), "Contains source");
    assert(context.includes("Text 1"), "Contains snippet");
  });

  // Test 5: Empty search error
  await test("TC-API-005: Empty search throws error", async () => {
    try {
      await fetchNewsArticles("");
      assert(false, "Should have thrown error");
    } catch (err) {
      assert(true, "Correctly threw error for empty search");
      assert(err.message.includes("too short") || err.message.includes("short"), "Error message mentions length");
    }
  });

  // Test 6: Multiple sources
  await test("TC-API-006: Returns multiple sources", async () => {
    const articles = await fetchNewsArticles("Tesla");
    assert(articles.length >= 3, "Returns at least 3 articles");
    assert(articles.length <= 8, "Returns at most 8 articles");
    log(GREEN, `     Found ${articles.length} articles`);
  });

  // Results
  console.log("\n╔════════════════════════════════════════╗");
  console.log("║            TEST RESULTS                ║");
  console.log("╚════════════════════════════════════════╝");
  
  const total = passed + failed;
  const passRate = total > 0 ? ((passed / total) * 100).toFixed(1) : 0;
  
  log(GREEN, `\n✓ Passed: ${passed}`);
  log(RED, `✗ Failed: ${failed}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`Pass Rate: ${passRate}%`);
  
  if (failed === 0) {
    log(GREEN, "\n🎉 ALL TESTS PASSED! API functions working correctly.\n");
    log(GREEN, "✅ Ready for manual testing\n");
  } else {
    log(RED, `\n⚠ ${failed} test(s) failed. Check output above.\n`);
  }
  
  process.exit(failed === 0 ? 0 : 1);
}

runTests().catch(err => {
  log(RED, `\n✗ FATAL ERROR: ${err.message}`);
  console.error(err);
  process.exit(1);
});