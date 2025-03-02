require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    credentials:true,
    origin:'http://localhost:5173'
})) // Allow frontend to make requests
app.use(express.json());

// Fetch Full Article Content
app.get("/api/full-article", async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "Article URL is required" });
  }

  try {
    // Use a web scraping API (example: Diffbot API)
    const API_KEY = process.env.DIFFBOT_API_KEY; // Store API key in .env
    const response = await axios.get(
      `https://api.diffbot.com/v3/article?token=${API_KEY}&url=${encodeURIComponent(url)}`
    );

    const article = response.data;
    res.json({ content: article.text || "Full article not available." });
  } catch (error) {
    console.error("Error fetching full article:", error);
    res.status(500).json({ error: "Failed to fetch article" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
