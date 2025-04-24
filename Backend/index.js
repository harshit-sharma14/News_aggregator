// server.js (or index.js)
require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const { JSDOM } = require("jsdom");
const { Readability } = require("@mozilla/readability");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/api/full-article", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "Article URL is required" });

  try {
    // 1. Fetch raw HTML
    const response = await axios.get(url, { timeout: 10_000 });
    const html = response.data;

    // 2. Parse it into a DOM
    const dom = new JSDOM(html, { url });           // base URL important for resolving relative links

    // 3. Run Readability
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    if (!article || !article.textContent) {
      return res.json({ content: "Could not extract article text." });
    }

    // 4. Return structured output
    res.json({
      title:       article.title,
      byline:      article.byline,
      excerpt:     article.excerpt,
      contentHTML: article.content,        // HTML string
      textContent: article.textContent,    // plain text
    });
  } catch (err) {
    console.error("Scrape/parsing error:", err.message);
    res.status(500).json({ error: "Failed to fetch or parse article." });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
