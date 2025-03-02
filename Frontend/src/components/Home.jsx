import React, { useEffect, useState } from 'react';
import NewsCard from './NewsCard';

const Home = () => {
  const [latestNews, setLatestNews] = useState([]);
  const [categories, setCategories] = useState({
    technology: [],
    business: [],
    sports: [],
    entertainment: [],
  });

  const API_KEY = 'dc4c52e13aed40ee88b353d77e2d68b3';

  useEffect(() => {
    // Fetch latest news
    fetch(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`)
      .then((response) => response.json())
      .then((data) => setLatestNews(data.articles))
      .catch((error) => console.error('Error fetching latest news:', error));

    // Fetch category-wise news
    const fetchCategoryNews = async (category) => {
      try {
        const response = await fetch(
          `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${API_KEY}`
        );
        const data = await response.json();
        setCategories((prev) => ({ ...prev, [category]: data.articles }));
      } catch (error) {
        console.error(`Error fetching ${category} news:`, error);
      }
    };

    fetchCategoryNews('technology');
    fetchCategoryNews('business');
    fetchCategoryNews('sports');
    fetchCategoryNews('entertainment');
  }, [API_KEY]);

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800">News Aggregator</h1>
        <p className="text-gray-600">Your one-stop destination for the latest news</p>
      </header>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Latest News</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestNews.map((news, index) => (
            <NewsCard key={index} news={news} />
          ))}
        </div>
      </section>

      {Object.entries(categories).map(([category, articles]) => (
        <section key={category} className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 capitalize">{category} News</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((news, index) => (
              <NewsCard key={index} news={news} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default Home;