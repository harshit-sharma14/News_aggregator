import React, { useEffect, useState } from 'react';
import NewsCard from './NewsCard'; // Import the NewsCard component

const Home = () => {
  const [latestNews, setLatestNews] = useState([]);
  const [categories, setCategories] = useState({
    technology: [],
    business: [],
    sports: [],
    entertainment: [],
  });

  // Replace with your NewsAPI key
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

    // Fetch news for each category
    fetchCategoryNews('technology');
    fetchCategoryNews('business');
    fetchCategoryNews('sports');
    fetchCategoryNews('entertainment');
  }, [API_KEY]);

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      {/* Header */}
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800">News Aggregator</h1>
        <p className="text-gray-600">Your one-stop destination for the latest news</p>
      </header>

      {/* Latest News Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Latest News</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestNews.map((news, index) => (
            <NewsCard key={index} news={news} /> // Use the NewsCard component
          ))}
        </div>
      </section>

      {/* Category-wise News Columns */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Explore by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(categories).map(([category, articles]) => (
            <div key={category} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 capitalize">{category}</h3>
              <div className="space-y-4">
                {articles.slice(0, 3).map((news, index) => (
                  <div key={index} className="border-b pb-4">
                    <h4 className="text-lg font-medium text-gray-800 hover:text-blue-600 transition-colors duration-300">
                      <a href={news.url} target="_blank" rel="noopener noreferrer">
                        {news.title}
                      </a>
                    </h4>
                    <p className="text-sm text-gray-600 line-clamp-2">{news.description}</p>
                  </div>
                ))}
              </div>
              <a
                href={`#${category}`} // Add a link to view more news in this category
                className="mt-4 inline-block text-blue-500 hover:underline"
              >
                View more {category} news →
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Additional News Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">More News</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestNews.slice(3).map((news, index) => (
            <NewsCard key={index} news={news} /> // Use the NewsCard component
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;