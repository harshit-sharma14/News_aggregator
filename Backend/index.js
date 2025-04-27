require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const { JSDOM } = require("jsdom");
const { Readability } = require("@mozilla/readability");
const genAI = require("@google/generative-ai"); // NEW

const app = express();
const PORT = process.env.PORT || 5000;
const FLASK_API_URL = process.env.FLASK_API_URL || "http://localhost:5001/summarize";
const GEMINI_API_KEY = process.env.API_KEY; // from Google AI Studio

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// --- SCRAPE FULL ARTICLE ---
app.get("/api/full-article", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "Article URL is required" });

  try {
    const { data: html } = await axios.get(url, { timeout: 10000 });
    const dom = new JSDOM(html, { url });
    const art = new Readability(dom.window.document).parse();

    if (!art || !art.textContent)
      return res.status(422).json({ error: "Cannot extract article." });

    res.json({
      title: art.title,
      byline: art.byline,
      excerpt: art.excerpt,
      contentHTML: art.content,
      textContent: art.textContent,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch/parse article." });
  }
});

// --- SUMMARIZATION ---
app.post("/api/summarize", async (req, res) => {
  const { text, numSentences = 3 } = req.body;
  if (!text || typeof text !== "string")
    return res.status(400).json({ error: "Invalid text input" });

  try {
    const flaskRes = await axios.post(
      FLASK_API_URL,
      { text, num_sentences: numSentences },
      { timeout: 15000 }
    );
    res.json(flaskRes.data);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Summarization failed", details: err.message });
  }
});

// --- TRANSLATION USING GEMINI (Free LLM) ---
app.post("/api/translate", async (req, res) => {
  const { text, targetLanguage } = req.body;
  if (!text || !targetLanguage)
    return res.status(400).json({ error: "Text and targetLanguage are required" });
  if (!GEMINI_API_KEY)
    return res.status(500).json({ error: "Missing API_KEY for Gemini in .env" });

  try {
    const genai = new genAI.GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genai.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Translate the following into ${targetLanguage}:\n"${text}"`;

    const result = await model.generateContent(prompt);
    const translation = result.response.text().trim();

    res.json({ translation });
  } catch (err) {
    console.error("Gemini translation error:", err.message || err);
    res.status(500).json({ error: "Translation failed", details: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
