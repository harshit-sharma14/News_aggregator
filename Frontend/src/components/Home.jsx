import React, { useEffect, useState } from 'react';
import NewsCard from './NewsCard'; // Your NewsCard component
import { FaNewspaper, FaSearch } from 'react-icons/fa';
import Footer from './Footer';

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

    // Function to fetch category-wise news
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
    ['technology', 'business', 'sports', 'entertainment'].forEach((category) =>
      fetchCategoryNews(category)
    );
  }, [API_KEY]);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Navbar */}
      <nav className="bg-white shadow-lg">
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <FaNewspaper className="text-blue-500 text-2xl" />
            <span className="font-bold text-xl text-gray-800">News Aggregator</span>
          </div>
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Search news..."
              className="px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="ml-2 text-blue-500 hover:text-blue-700">
              <FaSearch />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-4">Stay Updated with the Latest News</h1>
          <p className="text-xl">Get real-time updates from trusted sources around the globe</p>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        {/* Latest News Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-800 mb-8">Latest News</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestNews.map((news, index) => (
              <NewsCard key={index} news={news} />
            ))}
          </div>
        </section>

        {/* Category-wise News */}
        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-800 mb-8">Explore by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Object.entries(categories).map(([category, articles]) => (
              <div
                key={category}
                className="bg-white rounded-lg shadow-lg p-6 transform hover:-translate-y-1 transition duration-300"
              >
                <h3 className="text-2xl font-semibold text-gray-800 mb-6 capitalize">
                  {category}
                </h3>
                <div className="space-y-4">
                  {articles.slice(0, 3).map((news, index) => (
                    <div key={index} className="border-b pb-4">
                      <h4 className="text-xl font-medium text-gray-800 hover:text-blue-600 transition-colors duration-300">
                        <a href={news.url} target="_blank" rel="noopener noreferrer">
                          {news.title}
                        </a>
                      </h4>
                      <p className="text-gray-600 text-sm line-clamp-2">{news.description}</p>
                    </div>
                  ))}
                </div>
                <a
                  href={`#${category}`}
                  className="mt-4 inline-block text-blue-500 font-medium hover:underline"
                >
                  View more {category} news →
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* More News Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-800 mb-8">More News</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestNews.slice(3).map((news, index) => (
              <NewsCard key={index} news={news} />
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
     <Footer/>
     
    </div>
  );
};

export default Home;
