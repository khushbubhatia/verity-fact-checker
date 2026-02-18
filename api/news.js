// api/news.js - Vercel serverless function to proxy GNews API
// This avoids CORS issues by making the request from the server, not the browser

export default async function handler(req, res) {
  // Enable CORS for your frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get query parameters from the request
    const { q, lang = 'en', sortby = 'publishedAt', max = '20' } = req.query;

    if (!q) {
      return res.status(400).json({ error: 'Missing query parameter "q"' });
    }

    // Get API key from environment variable
    const GNEWS_KEY = process.env.VITE_GNEWS_KEY;
    if (!GNEWS_KEY) {
      return res.status(500).json({ error: 'GNews API key not configured' });
    }

    // Build GNews API URL
    const url = new URL('https://gnews.io/api/v4/search');
    url.searchParams.set('q', q);
    url.searchParams.set('lang', lang);
    url.searchParams.set('sortby', sortby);
    url.searchParams.set('max', max);
    url.searchParams.set('apikey', GNEWS_KEY);

    // Fetch from GNews API (server-side, no CORS issue)
    const response = await fetch(url.toString());

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json(errorData);
    }

    const data = await response.json();
    
    // Return the data to the frontend
    return res.status(200).json(data);

  } catch (error) {
    console.error('News API proxy error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}