# Testing Documentation

This folder contains everything you need to test the Verity app like a professional developer.

---

## Testing Files

| File | Purpose | How to Use |
|------|---------|------------|
| `TEST_CASES.md` | What to test (8 manual test cases) | Read and check off each test |
| `TESTING_GUIDE.md` | How to test step-by-step | Follow instructions to run tests properly |
| `api-test.js` | Automated API tests (6 tests) | Run with: `node api-test.js` |

---

## Quick Start

### Option 1: Manual Testing (Recommended for Learning)

**Time:** ~20 minutes

```bash
# 1. Start your app
npm run dev

# 2. Open in browser
# Go to: http://localhost:3000

# 3. Open TESTING_GUIDE.md in VS Code/Notepad
# Follow the step-by-step instructions

# 4. Open TEST_CASES.md
# Check off each test as you complete it

# 5. Share your results with me
```

**Best for:** Understanding how the app actually works, finding UI bugs

---

### Option 2: Automated Testing (Quick Check)

**Time:** ~2 minutes

```bash
# Run automated tests
node api-test.js
```

**What it tests:**
- ✅ API functions work
- ✅ Articles are fetched
- ✅ Typo correction works
- ✅ Punctuation handling
- ✅ Context builder
- ✅ Error handling

**Best for:** Quick sanity check that backend logic works

---

## Full Testing Process (Do Both)

**Step 1: Automated tests first** (2 min)
```bash
node api-test.js
```
- Should say "ALL TESTS PASSED"
- If any fail, fix those first before manual testing

**Step 2: Manual tests** (20 min)
- Open `TESTING_GUIDE.md`
- Follow step-by-step
- Complete all 8 test cases in `TEST_CASES.md`

**Step 3: Report results**
- Count PASS/FAIL
- Note any issues
- Share results with me

---

## What Each Test Checks

### Manual Tests (TEST_CASES.md)

1. **TC-001**: Basic search works
2. **TC-002**: Typos get corrected
3. **TC-003**: Punctuation removed
4. **TC-004**: Vague queries handled
5. **TC-005**: False claims scored low
6. **TC-006**: Headlines clickable
7. **TC-007**: Loading animations work
8. **TC-008**: Errors handled gracefully

### Automated Tests (api-test.js)

1. **TC-API-001**: fetchNewsArticles returns array
2. **TC-API-002**: Typos corrected ("bitcon" → Bitcoin articles)
3. **TC-API-003**: Punctuation handled
4. **TC-API-004**: buildContext creates proper string
5. **TC-API-005**: Empty search throws error
6. **TC-API-006**: Gibberish handled

---

## Interpreting Results

### Manual Tests

**8/8 PASS** = Perfect! Ready for learning session ✅
**6-7/8 PASS** = Good, minor tweaks needed
**<6/8 PASS** = Issues to fix first

### Automated Tests

**6/6 PASS** = API layer working perfectly ✅
**4-5/6 PASS** = Minor API issues
**<4/6 PASS** = Core functions broken, need debugging

---

## Common Issues & Fixes

### Issue: api-test.js won't run

**Error:** `Cannot find module`
**Fix:**
```bash
npm install
```

**Error:** `VITE_GNEWS_KEY missing`
**Fix:** Check your `.env` file has both keys

---

### Issue: All tests failing

**Check:**
1. Is server running? (`npm run dev`)
2. Are API keys correct in `.env`?
3. Is internet connected?
4. Did you hit 100 requests/day limit?

---

### Issue: Some articles unrelated

**This is what TC-005 tests!**
- Check console for "Relevance filter response"
- Should filter out unrelated articles
- If not, the relevance filter needs adjustment

---

## After Testing

Once all tests pass (or you've documented failures):

### Next Steps:
1. ✅ Share test results with me
2. 🔧 We fix any failures together
3. 📚 Start the **Learning Session**:
   - File by file explanation
   - How LLMs work
   - How the code works
   - Line by line walkthrough

---

## Tips for Good Testing

✅ **Do:**
- Test systematically (don't skip tests)
- Record ALL failures, even small ones
- Check console logs for each test
- Take screenshots of bugs
- Test twice if results seem odd

❌ **Don't:**
- Rush through without checking
- Skip tests because "it probably works"
- Test during poor internet
- Forget to restart server after .env changes

---

## Questions?

While testing, if something unclear:
- Check TESTING_GUIDE.md for detailed steps
- Look at console (F12) for clues
- Share specific test number + what happened
- I'll help debug!

---

**Ready to test?** Start with: `node api-test.js` ⚡
