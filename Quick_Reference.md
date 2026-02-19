# Verity App - Quick Reference Cheat Sheet

**Quick lookup guide for common patterns and concepts**

---

## React Patterns

### State Management

```javascript
// Create state
const [value, setValue] = useState(initialValue);

// Update state
setValue(newValue);

// Update with previous value
setValue((prev) => prev + 1);

// Multiple states
const [name, setName] = useState("");
const [age, setAge] = useState(0);
```

### useEffect Patterns

```javascript
// Run once on mount
useEffect(() => {
  // Code here
}, []);

// Run when dependency changes
useEffect(() => {
  // Code here
}, [dependency]);

// Cleanup function
useEffect(() => {
  const timer = setInterval(() => {}, 1000);
  return () => clearInterval(timer); // Cleanup
}, []);
```

### Conditional Rendering

```javascript
// Show if true
{
  condition && <Component />;
}

// Show A or B
{
  condition ? <ComponentA /> : <ComponentB />;
}

// Show if exists
{
  value && <div>{value}</div>;
}
```

### Lists

```javascript
// Map array to JSX
{
  items.map((item, index) => <div key={index}>{item}</div>);
}

// Filter then map
{
  items
    .filter((item) => item.active)
    .map((item) => <div key={item.id}>{item.name}</div>);
}
```

### Event Handlers

```javascript
// onClick
<button onClick={handleClick}>Click</button>
<button onClick={() => handleClick(id)}>Click</button>

// onChange
<input onChange={(e) => setValue(e.target.value)} />

// Prevent default
<form onSubmit={(e) => {
  e.preventDefault();
  handleSubmit();
}}>
```

---

## JavaScript Patterns

### Async/Await

```javascript
// Basic async function
async function fetchData() {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

// Error handling
async function fetchData() {
  try {
    const data = await fetch(url);
    return data;
  } catch (error) {
    console.error(error);
  } finally {
    // Always runs
  }
}
```

### Array Methods

```javascript
// map - transform each item
const doubled = [1, 2, 3].map((n) => n * 2); // [2,4,6]

// filter - keep items that match
const evens = [1, 2, 3, 4].filter((n) => n % 2 === 0); // [2,4]

// find - get first match
const item = items.find((i) => i.id === 5);

// some - check if any match
const hasAdmin = users.some((u) => u.role === "admin");

// every - check if all match
const allActive = users.every((u) => u.active);

// reduce - combine into single value
const sum = [1, 2, 3].reduce((total, n) => total + n, 0); // 6
```

### Spread Operator

```javascript
// Arrays
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5]; // [1,2,3,4,5]

// Objects
const obj1 = { a: 1, b: 2 };
const obj2 = { ...obj1, c: 3 }; // {a:1, b:2, c:3}

// Function arguments
const numbers = [1, 2, 3];
Math.max(...numbers); // 3
```

### Destructuring

```javascript
// Arrays
const [first, second] = [1, 2, 3]; // first=1, second=2

// Objects
const { name, age } = { name: "John", age: 30 };

// Function params
function greet({ name, age }) {
  console.log(`${name} is ${age}`);
}
```

---

## API Patterns

### Fetch

```javascript
// GET request
const response = await fetch(url);
const data = await response.json();

// POST request
const response = await fetch(url, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(data),
});

// With error handling
try {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
} catch (error) {
  console.error("Fetch failed:", error);
}
```

### localStorage

```javascript
// Save
localStorage.setItem("key", "value");
localStorage.setItem("user", JSON.stringify(userObject));

// Get
const value = localStorage.getItem("key");
const user = JSON.parse(localStorage.getItem("user"));

// Remove
localStorage.removeItem("key");

// Clear all
localStorage.clear();
```

---

## Common Patterns in Your App

### Updating Arrays

```javascript
// Add item
setItems([...items, newItem]);

// Remove item
setItems(items.filter((item) => item.id !== idToRemove));

// Update item
setItems(
  items.map((item) =>
    item.id === idToUpdate ? { ...item, ...updates } : item,
  ),
);

// Replace all
setItems(newItems);
```

### Form Handling

```javascript
const [formData, setFormData] = useState({
  name: "",
  email: "",
});

const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};

<input name="name" value={formData.name} onChange={handleChange} />;
```

### Loading States

```javascript
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [data, setData] = useState(null);

async function fetchData() {
  setLoading(true);
  setError(null);
  try {
    const result = await api.getData();
    setData(result);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
}
```

---

## LLM / AI Patterns

### Basic API Call

```javascript
const response = await callAI(systemPrompt, userMessage);
```

### Prompts

```javascript
// System prompt - sets behavior
const systemPrompt = "You are a helpful assistant.";

// User message - the actual question
const userMessage = "What is 2+2?";

// Structured output
const systemPrompt = `Return ONLY a JSON object with this structure:
{
  "answer": "the answer here",
  "confidence": 0-100
}`;
```

### Temperature Settings

```javascript
temperature: 0.0; // Deterministic, same every time
temperature: 0.1; // Mostly factual (good for fact-checking)
temperature: 0.7; // Balanced
temperature: 1.0; // Creative, varied responses
```

---

## Regex Patterns

### Common Patterns

```javascript
// Remove special chars
text.replace(/[^\w\s]/g, "");

// Remove quotes
text.replace(/["']/g, "");

// Remove extra spaces
text.replace(/\s+/g, " ");

// Extract numbers
const numbers = text.match(/\d+/g);

// Check format
const isEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
```

---

## Common Mistakes & Fixes

### ❌ Wrong

```javascript
// Modifying state directly
items.push(newItem);
setState(items);

// Missing key in lists
{items.map(item => <div>{item}</div>)}

// Calling function immediately
<button onClick={handleClick()}>

// Forgetting async
function getData() {
  const data = await fetch(url); // Error!
}
```

### ✅ Correct

```javascript
// Create new array
setState([...items, newItem]);

// Add key
{items.map(item => <div key={item.id}>{item}</div>)}

// Pass function reference
<button onClick={handleClick}>

// Mark as async
async function getData() {
  const data = await fetch(url);
}
```

---

## Your App's Flow

```
1. User types search query
   ↓
2. setInput(query) - updates state
   ↓
3. User clicks "VERIFY NOW"
   ↓
4. run() function executes
   ↓
5. fetchNewsArticles(query)
   ├─ Clean input (regex)
   ├─ AI spell correction
   ├─ Multi-strategy search
   ├─ Entity filtering
   └─ Returns 6-8 articles
   ↓
6. buildContext(articles)
   └─ Converts to text string
   ↓
7. callAI(systemPrompt, userPrompt)
   └─ Groq analyzes articles
   ↓
8. parseJSON(response)
   └─ Extract score, claims, verdict
   ↓
9. setResult(parsed)
   └─ React updates UI
   ↓
10. User sees results!
```

---

## File Structure

```
verity-app/
├── api/
│   └── news.js              # Backend proxy (CORS fix)
├── src/
│   ├── components/
│   │   ├── Ring.jsx         # Animated score ring
│   │   ├── ConfBar.jsx      # Confidence bar
│   │   ├── StepLoader.jsx   # Loading steps
│   │   └── SearchHistory.jsx # Search history
│   ├── api.js               # Groq AI integration
│   ├── newsapi.js           # News fetching & filtering
│   ├── prompts.js           # AI prompts
│   ├── constants.js         # UI constants
│   ├── App.jsx              # Main component
│   └── index.css            # Styles
├── .env                     # API keys (gitignored)
├── .gitignore               # Files to ignore
├── package.json             # Dependencies
└── vite.config.js           # Vite config
```

---

## Quick Debugging

### Check Console

```javascript
console.log("Variable:", variable);
console.error("Error:", error);
console.table(arrayOfObjects);
```

### React DevTools

- Install React DevTools extension
- Inspect component state
- See props and hooks

### Network Tab

- F12 → Network
- See all API calls
- Check request/response

### Common Errors

**"Cannot read property of undefined"**
→ Variable doesn't exist yet, use optional chaining: `obj?.prop`

**"Invalid hook call"**
→ useState/useEffect called outside component

**"Maximum update depth exceeded"**
→ setState called in render (infinite loop)

**"CORS error"**
→ Need backend proxy (already fixed!)

---

## Tips

✅ **Do:**

- Use descriptive variable names
- Add comments for complex logic
- Handle errors with try/catch
- Test edge cases
- Break code into small functions

❌ **Don't:**

- Modify state directly
- Forget dependencies in useEffect
- Call hooks conditionally
- Ignore errors
- Repeat yourself (DRY principle)

---

_Quick reference for Verity app development_
_Keep this handy while coding!_
