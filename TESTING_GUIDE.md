# Testing Guide - Step by Step

How to test your app like a professional developer.

---

## Before You Start

**What you need:**
- App running (`npm run dev`)
- Browser open at http://localhost:3000
- DevTools open (press F12)
- `TEST_CASES.md` file open in Notepad/VS Code
- A pen or text editor to mark results

---

## Step 1: Setup Verification (5 minutes)

**1.1 Check .env file**
```
- Open `verity-app/.env` in Notepad
- Verify you see: VITE_GROQ_KEY=gsk_...
- Verify you see: VITE_GNEWS_KEY=...
- Both keys should have values after the =
```

**1.2 Start the server**
```powershell
cd verity-app
npm run dev
```

**Expected output:**
```
VITE v5.x  ready in 300ms
➜  Local:   http://localhost:3000/
```

**1.3 Open the app**
- Go to http://localhost:3000 in Chrome/Edge/Firefox
- You should see the dark blue interface with "FACT_CHECK"

**1.4 Open DevTools**
- Press **F12** (or right-click → Inspect)
- Click the **Console** tab
- Should show NO red errors (yellow warnings are okay)

✅ **Checkpoint:** If all 4 steps work, mark "Setup Verification" as complete in TEST_CASES.md

---

## Step 2: Run Each Test Case (30 minutes)

For EACH test in TEST_CASES.md, follow this process:

### The Testing Loop:

**2.1 Read the test**
- Open TEST_CASES.md
- Read what TC-001 says to test

**2.2 Execute the test**
- Go to your app in the browser
- Type the exact **Input** shown in the test
- Click **▶ VERIFY NOW**

**2.3 Observe the results**
- Watch the loading animation
- Wait for results to appear
- Check if everything listed under **Expected** is true

**2.4 Check the console**
- Look at the F12 Console tab
- Look for key log messages:
  - "Original: ..."
  - "Corrected: ..."
  - "✓ Found X articles with: ..."
  - "Relevance filter response: ..."

**2.5 Mark the result**
- If ALL expected items are true → mark **PASS**
- If ANY expected item failed → mark **FAIL** and write what failed in Notes

**2.6 Reset for next test**
- Click **← NEW SEARCH** button
- Clear any console messages (optional: right-click console → Clear)
- Move to next test case

---

## Step 3: Document Results (10 minutes)

After all 8 tests:

**3.1 Count results**
```
- How many PASS?
- How many FAIL?
- Pass rate = (PASS / 8) × 100
```

**3.2 Identify issues**
- For each FAIL, write down:
  - What test failed
  - What specifically went wrong
  - What error message appeared (if any)

**3.3 Decide if ready**
- If 7-8 PASS → Ready for learning session
- If 5-6 PASS → Minor fixes needed
- If < 5 PASS → Need to debug issues first

---

## Step 4: Share Results With Me

**Copy this template and send it:**

```
TEST RESULTS
============

Setup: ✅ / ❌
TC-001 (Simple Search): ✅ / ❌
TC-002 (Typo): ✅ / ❌
TC-003 (Punctuation): ✅ / ❌
TC-004 (Vague Query): ✅ / ❌
TC-005 (False Claim): ✅ / ❌
TC-006 (Clickable): ✅ / ❌
TC-007 (Loading): ✅ / ❌
TC-008 (Error): ✅ / ❌

Pass Rate: X/8 (X%)

Issues Found:
1. [describe issue]
2. [describe issue]

Ready for learning session: YES / NO
```

---

## Common Issues & How to Check Them

### Issue: "No articles found"
**Check:**
- Console shows search strategies tried
- Did relevance filter reject them?
- Try a simpler term like just "Bitcoin"

### Issue: Unrelated articles
**Check:**
- Console: "Relevance filter response"
- Did it say "NONE" or "ALL"?
- Were numbers returned?

### Issue: Score seems wrong
**Check:**
- Read the "analysisNotes" text
- Check what claims were flagged
- Is the topic actually credible or not?

### Issue: App blank/frozen
**Check:**
- Any red errors in console?
- Did you restart server after changing .env?
- Try hard refresh: Ctrl+Shift+R

### Issue: Button disabled
**Check:**
- Did you type at least 5 characters?
- Is something still loading from previous search?

---

## Tips for Effective Testing

✅ **DO:**
- Test one thing at a time
- Write down unexpected behavior immediately
- Check console logs for every test
- Take screenshots of failures
- Try each test twice if results seem weird

❌ **DON'T:**
- Rush through tests
- Skip checking console
- Assume everything works without testing
- Test with bad internet connection
- Have multiple searches running at once

---

## After Testing

Once you complete all tests and share results, we'll:

1. **Fix any failures** together
2. **Re-test** failed cases
3. **Start the learning session** — going file by file explaining how everything works

---

**Questions while testing?**
Just share:
- Which test case (TC-001, TC-002, etc)
- What you typed
- What happened
- Screenshot of console if helpful

Good luck! 🚀
