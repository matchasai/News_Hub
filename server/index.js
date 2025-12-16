import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const GNEWS_API_KEY = process.env.GNEWS_API_KEY;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'NewsHub backend is running' });
});

// Proxy endpoint for news headlines
app.get('/api/news/top-headlines', async (req, res) => {
  try {
    const { category, lang = 'en', country = 'in', max = 6, page = 1, q, sortBy } = req.query;

    if (!category) {
      return res.status(400).json({ error: 'Missing required parameter: category' });
    }

    if (!GNEWS_API_KEY) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    // Build GNews API URL
    let url = `https://gnews.io/api/v4/top-headlines?category=${category}&lang=${lang}&country=${country}&max=${max}&page=${page}&apikey=${GNEWS_API_KEY}`;

    if (q) url += `&q=${encodeURIComponent(q)}`;
    if (sortBy) url += `&sortBy=${sortBy}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'NewsHub-Backend/1.0'
      }
    });

    if (response.status === 426) {
      return res.status(426).json({ error: 'API Plan Limit Reached: Upgrade Required' });
    }

    if (!response.ok) {
      return res.status(response.status).json({ 
        error: `Failed to fetch news: ${response.status} ${response.statusText}` 
      });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('News fetch error:', err);
    res.status(500).json({ error: `Server error: ${err.message}` });
  }
});

app.listen(PORT, () => {
  console.log(`NewsHub backend running on port ${PORT}`);
  console.log(`API endpoint: http://localhost:${PORT}/api/news/top-headlines`);
});
