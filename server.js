require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Proxy route — keeps your API key off the frontend
app.post('/api/ask', async (req, res) => {
  try {
    const prompt = req.body.messages[0].content;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 1000, temperature: 0.7 }
      })
    });

    const data = await response.json();

    // Normalise to the shape app.js expects: { content: [{ text }] }
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    res.json({ content: [{ text }] });

  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: 'API request failed' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('  ✅  LET Reviewer is running!');
  console.log('');
  console.log('  Open on your laptop:');
  console.log(`     http://localhost:${PORT}`);
  console.log('');
  console.log('  Open on your phone (same WiFi):');

  // Print local network IPs
  const { networkInterfaces } = require('os');
  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        console.log(`     http://${net.address}:${PORT}`);
      }
    }
  }
  console.log('');
});
