// src/components/Home.jsx
import React, { useEffect, useState, useMemo } from 'react';
import NewsCard from './NewsCard';
import Footer from './Footer';
import axios from 'axios';

const CATEGORIES = ['technology', 'business', 'sports', 'entertainment'];
const BASE_URL = 'http://localhost:5000'; // 👈 backend server base

export default function Home({ searchQuery = '', language = 'en' }) {
  const [latestNews, setLatestNews] = useState([]);
  const [categories, setCategories] = useState({});
  const [searchResults, setSearchResults] = useState([]);
  const [translatedList, setTranslatedList] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  const API_KEY = 'dc4c52e13aed40ee88b353d77e2d68b3';

  // Fetch top headlines and categories
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`);
        const { articles } = await res.json();
        setLatestNews(articles);

        const catData = {};
        await Promise.all(
          CATEGORIES.map(async (cat) => {
            const r = await fetch(`https://newsapi.org/v2/top-headlines?country=us&category=${cat}&apiKey=${API_KEY}`);
            const j = await r.json();
            catData[cat] = j.articles || [];
          })
        );
        setCategories(catData);
      } catch (err) {
        console.error('Error fetching news:', err);
      }
    }
    fetchData();
  }, []);

  // Search news when query changes
  useEffect(() => {
    if (!searchQuery) {
      setSearchResults([]);
      return;
    }
    const all = [...latestNews, ...Object.values(categories).flat()];
    const filtered = all.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(filtered);
    setActiveCategory('');
  }, [searchQuery, latestNews, categories]);

  // Decide what list to use (latest, category, search)
  const baseList = useMemo(() => {
    if (searchQuery) return searchResults;
    if (activeCategory) return categories[activeCategory] || [];
    return latestNews;
  }, [searchQuery, searchResults, activeCategory, categories, latestNews]);

  // Translate if needed
  useEffect(() => {
    if (language === 'en' || baseList.length === 0) {
      setTranslatedList([]);
      return;
    }

    let canceled = false;
    setIsTranslating(true);

    (async () => {
      const out = [];
      for (const item of baseList) {
        const text = item.description || item.title;
        try {
          const resp = await axios.post(`${BASE_URL}/api/translate`, {
            text,
            targetLanguage: language
          });
          out.push({ ...item, description: resp.data.translation });
        } catch (e) {
          console.error('Translation failed:', e);
          out.push(item);
        }
        if (canceled) break;
      }
      if (!canceled) setTranslatedList(out);
      setIsTranslating(false);
    })();

    return () => {
      canceled = true;
    };
  }, [baseList, language]);

  const displayList = translatedList.length ? translatedList : baseList;

  return (
    <div className="bg-gray-100 min-h-screen pt-6">
      {/* Hero */}
      <header className="bg-gradient-to-r from-black to-gray-600 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-extrabold mb-4">Stay Ahead of the Curve</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Real-time headlines, curated by you. Explore, search, and dive into stories that matter.
          </p>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-6 py-10">
        {/* Category Tabs */}
        <div className="flex space-x-4 overflow-x-auto pb-4 mb-8">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-blue-100'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
          <button
            onClick={() => setActiveCategory('')}
            className="px-4 py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-blue-100 transition whitespace-nowrap"
          >
            All
          </button>
        </div>

        {/* Loading Spinner */}
        {isTranslating ? (
          <div className="text-center py-8 text-lg text-gray-600">
            Translating articles… please wait.
          </div>
        ) : (
          <section>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              {searchQuery
                ? `Search Results for "${searchQuery}"`
                : activeCategory
                ? `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} News`
                : 'Latest News'}
            </h2>

            {displayList.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayList.map((news, idx) => (
                  <NewsCard key={idx} news={news} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No articles found.</p>
            )}
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
