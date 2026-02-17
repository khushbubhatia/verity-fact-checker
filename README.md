# Verity - AI-Powered Fact Checker

> Real-time misinformation verification using AI and live news search

![Verity App Screenshot]<img width="1125" height="632" alt="image" src="https://github.com/user-attachments/assets/ba4f10bf-d899-4288-8e24-9f4b4dd87a61" />


## 🎯 Overview

Verity is an intelligent fact-checking application that analyzes claims against real-time news sources using AI. It fetches live articles, performs relevance filtering, and provides credibility scores with detailed claim-by-claim analysis.

**Live Demo:** [verity-fact-checker.vercel.app](#) _(add your link after deployment)_

---

## ✨ Features

- **🔍 Real-Time News Search**: Fetches latest articles from GNews API
- **🤖 AI-Powered Analysis**: Uses Groq's Llama 3.3 70B model for intelligent claim verification
- **📊 Credibility Scoring**: Provides 0-100 credibility scores with detailed reasoning
- **🎯 Smart Filtering**: AI-based relevance filtering rejects off-topic articles
- **✍️ Typo Tolerance**: Automatically corrects spelling errors in search queries
- **🔗 Clickable Sources**: Direct links to original articles for verification
- **📜 Search History**: Saves recent searches for quick re-analysis
- **⚡ Fast & Free**: Entirely free to use with zero API costs

---

## 🛠️ Technology Stack

### Frontend

- **React 18** - UI framework
- **Vite** - Build tool & dev server
- **CSS3** - Custom styling with animations

### Backend/APIs

- **Groq API** - LLM for AI analysis (Llama 3.3 70B)
- **GNews API** - Real-time news article retrieval
- **Fetch API** - HTTP requests

### AI/ML Features

- **Prompt Engineering** - Structured prompts for accurate analysis
- **Entity Extraction** - Filters articles by mentioned entities
- **Spell Correction** - AI-powered typo fixing
- **Relevance Scoring** - Multi-stage article filtering

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Groq API key ([get one free](https://console.groq.com))
- GNews API key ([get one free](https://gnews.io))

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/verity-fact-checker.git
cd verity-fact-checker

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Add your API keys to .env
VITE_GROQ_API_KEY=your_groq_key_here
VITE_GNEWS_KEY=your_gnews_key_here

# Start development server
npm run dev
```

Open http://localhost:3000 to view the app.

### Running Tests

```bash
# Run automated API tests
node api-test.js
```

---

## 📖 How It Works

### 1. Search Processing

```
User Input → Clean & Normalize → AI Spell Check → Extract Keywords
```

### 2. Article Retrieval

```
Multi-Strategy Search → Fetch 20 Articles → Entity-Based Filtering → Return 6-8 Relevant
```

### 3. AI Analysis

```
Build Context → Send to Groq API → Parse JSON Response → Extract Claims & Score
```

### 4. Display Results

```
Credibility Score → Flagged Claims → Suggested Sources → Article Links
```

---

## 🎨 Key Features in Detail

### AI-Powered Spell Correction

Automatically corrects typos without changing meaning:

- Input: `"usa tarrifs"` → Output: `"usa tariffs"`
- Strict word count validation prevents AI from adding context

### Entity-Based Filtering

Rejects articles about entities not mentioned in search:

- Search: `"US tariffs"` → Blocks articles primarily about India/China
- Only shows articles matching user's actual intent

### Smart Credibility Scoring

- **90-100**: Highly Credible - Verified by multiple reliable sources
- **70-89**: Mostly Credible - Generally accurate with minor uncertainties
- **40-69**: Mixed - Contains both verified and questionable claims
- **20-39**: Questionable - Significant inaccuracies or lack of evidence
- **0-19**: False/Misleading - Contradicted by credible sources

---

## 📊 Project Structure

```
verity-app/
├── src/
│   ├── components/
│   │   ├── Ring.jsx           # Animated score ring
│   │   ├── ConfBar.jsx        # Confidence bar visualization
│   │   ├── StepLoader.jsx     # Loading state component
│   │   └── SearchHistory.jsx  # Search history with localStorage
│   ├── api.js                 # Groq API integration
│   ├── newsapi.js             # GNews API + filtering logic
│   ├── prompts.js             # AI system & user prompts
│   ├── constants.js           # UI constants & styles
│   ├── App.jsx                # Main application component
│   └── index.css              # Global styles
├── api-test.js                # Automated test suite
├── test-config.js             # Test environment setup
└── package.json               # Dependencies
```

---

## 🧪 Testing

The project includes comprehensive automated tests covering:

- ✅ Article fetching & normalization
- ✅ Typo correction accuracy
- ✅ Punctuation handling
- ✅ Context builder functionality
- ✅ Error handling
- ✅ Source diversity (3-8 articles)

**Test Results:** 18/18 passing (100% pass rate)

---

## 🤝 Contributing

Contributions are welcome! Areas for improvement:

- [ ] Add more news sources (NewsAPI, MediaStack)
- [ ] Implement fact-check history persistence
- [ ] Add export to PDF feature
- [ ] Multi-language support
- [ ] Browser extension version

---

## 📝 License

MIT License - feel free to use this project for learning or your own portfolio!

---

## 👤 Author

**Your Name**

- Portfolio: [yourwebsite.com](#)
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Name](https://linkedin.com/in/yourname)

---

## 🙏 Acknowledgments

- **Groq** for providing free LLM API access
- **GNews** for real-time news data
- Built as a learning project to explore AI/LLM integration

---

## 🔮 Future Enhancements

- [ ] Fact-check comparison mode (compare multiple claims)
- [ ] Email alerts for claim updates
- [ ] Chrome extension for instant fact-checking
- [ ] API endpoint for programmatic access
- [ ] Machine learning model for credibility prediction

---

**⭐ If you found this project helpful, please give it a star!**
