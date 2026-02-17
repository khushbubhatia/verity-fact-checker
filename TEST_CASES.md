# Verity App - Test Cases

Version: 1.0
Last Updated: Feb 16, 2025

Run through all tests systematically. Mark PASS/FAIL for each.

---

## Setup Verification ✓

- [ ] `.env` file has `VITE_GROQ_KEY` and `VITE_GNEWS_KEY`
- [ ] `npm run dev` starts without errors
- [ ] http://localhost:3000 loads
- [ ] F12 console shows no red errors

---

## TC-001: Simple Search
**Input:** `Bitcoin`
**Expected:** Articles, score, claims, sources all display
**Result:** ☐ PASS ☐ FAIL
**Notes:**

---

## TC-002: Typo Correction
**Input:** `usa tarrifs`
**Expected:** Corrects to "tariffs", no extra words added
**Result:** ☐ PASS ☐ FAIL  
**Notes:**

---

## TC-003: Punctuation Handling
**Input:** `"U.S. tariff's on China"`
**Expected:** Removes quotes/apostrophes, finds articles
**Result:** ☐ PASS ☐ FAIL
**Notes:**

---

## TC-004: Vague Query
**Input:** `tariffs USA put India`
**Expected:** Tries multiple strategies, finds relevant articles
**Result:** ☐ PASS ☐ FAIL
**Notes:**

---

## TC-005: False Claim
**Input:** `Earth is flat`
**Expected:** Low score (0-30), verdict "False", rejects unrelated articles
**Result:** ☐ PASS ☐ FAIL
**Notes:**

---

## TC-006: Clickable Headlines
**Expected:** Headlines blue, clickable, open in new tab
**Result:** ☐ PASS ☐ FAIL
**Notes:**

---

## TC-007: Loading Animation
**Expected:** 3 steps show, checkmarks appear, ring animates
**Result:** ☐ PASS ☐ FAIL
**Notes:**

---

## TC-008: Error Handling
**Input:** `asdfghjkl`
**Expected:** Clear error, no crash, NEW SEARCH works
**Result:** ☐ PASS ☐ FAIL
**Notes:**

---

## Summary
**Passed:** ___ / 8
**Failed:** ___ / 8
**Ready:** ☐ YES ☐ NO
