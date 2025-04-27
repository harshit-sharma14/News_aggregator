import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

export default function NewsDetail() {
  const { state } = useLocation();
  const news = state?.news;

  const [article, setArticle] = useState(null);
  const [summary, setSummary] = useState("");
  const [numSentences, setNumSentences] = useState(3);
  const [sentenceOptions, setSentenceOptions] = useState([]);
  const [loadingArt, setLoadingArt] = useState(false);
  const [loadingSum, setLoadingSum] = useState(false);
  const [errorArt, setErrorArt] = useState("");
  const [errorSum, setErrorSum] = useState("");

  // Base URL for API
  const BASE_URL = "http://localhost:5000"; // Replace with your actual API base URL

  // Fetch full article
  useEffect(() => {
    if (!news?.url) return;
    (async () => {
      setLoadingArt(true);
      setErrorArt("");
      try {
        const res = await axios.get(
          `${BASE_URL}/api/full-article?url=${encodeURIComponent(news.url)}`
        );
        setArticle(res.data);
      } catch (err) {
        console.error(err);
        setErrorArt("Failed to load article.");
      } finally {
        setLoadingArt(false);
      }
    })();
  }, [news]);

  // Prepare sentence options
  useEffect(() => {
    if (!article?.textContent) return;
    const sentences = article.textContent.match(/[^\.!?]+[\.!?]+/g) || [];
    const maxOptions = Math.min(sentences.length, 10);
    setSentenceOptions(Array.from({ length: maxOptions }, (_, i) => i + 1));
    setNumSentences((prev) => Math.min(prev, maxOptions));
  }, [article]);

  // Summarize on demand
  const handleSummarize = async () => {
    if (!article?.textContent) return;
    setLoadingSum(true);
    setErrorSum("");
    setSummary("");
    try {
      const res = await axios.post(`${BASE_URL}/api/summarize`, {
        text: article.textContent,
        numSentences,
      });
      setSummary(res.data.summary || "No summary available.");
    } catch (err) {
      console.error(err);
      setErrorSum("Failed to generate summary.");
    } finally {
      setLoadingSum(false);
    }
  };

  if (!news) {
    return <p className="text-center text-gray-500 mt-8">Article data not found.</p>;
  }

  return (
    <article className="max-w-7xl mx-auto mt-8 font-serif px-4 sm:px-6 lg:px-8">
      {/* Hero Header */}
      <header className="relative h-80 sm:h-96 overflow-hidden rounded-b-2xl">
        <img
          src={news.urlToImage || "https://via.placeholder.com/1200x600"}
          alt={news.title}
          className="w-full h-full object-cover filter brightness-75"
        />
        <div className="absolute inset-0 flex items-end p-4 sm:p-8">
          <h1 className="text-2xl sm:text-4xl md:text-5xl text-white font-bold drop-shadow-lg">
            {news.title}
          </h1>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        {/* Sidebar: Summary Controls */}
        <aside className="md:col-span-1">
          <a
            href={news.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center mt-6 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition"
          >
            Read Full Article
          </a>
          <div className="bg-white p-6 mt-4 rounded-lg shadow-lg sticky md:top-20">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Summarize Article</h2>
            <div className="flex items-center space-x-3 mb-4">
              <label className="text-gray-700">Sentences:</label>
              <select
                value={numSentences}
                onChange={(e) => setNumSentences(+e.target.value)}
                disabled={loadingSum || !sentenceOptions.length}
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                {sentenceOptions.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleSummarize}
              disabled={loadingSum}
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              {loadingSum ? "Generating..." : "Generate Summary"}
            </button>
            {errorSum && <p className="text-red-500 mt-2">{errorSum}</p>}
          </div>

          {summary && (
            <div className="bg-white p-6 rounded-lg shadow-inner mt-6 sticky md:top-64">
              <h3 className="font-medium mb-2">Summary</h3>
              <p className="text-gray-800 leading-relaxed">{summary}</p>
            </div>
          )}
        </aside>

        {/* Main: Article Content */}
        <section className="md:col-span-2 space-y-8 prose lg:prose-lg">
          <div className="text-sm text-gray-500 flex flex-wrap gap-2">
            {news.author && <span>By {news.author}</span>}
            <span>{new Date(news.publishedAt).toLocaleDateString()}</span>
            {article?.byline && <span>{article.byline}</span>}
          </div>

          {loadingArt ? (
            <p className="text-gray-600">Loading article...</p>
          ) : errorArt ? (
            <p className="text-red-500">{errorArt}</p>
          ) : (
            <div
              className="bg-white p-6 rounded-lg shadow-lg"
              dangerouslySetInnerHTML={{ __html: article?.contentHTML }}
            />
          )}
        </section>
      </div>
    </article>
  );
}
