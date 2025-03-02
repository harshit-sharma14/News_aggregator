import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const NewsDetail = () => {
  const location = useLocation();
  const news = location.state?.news;

  const [fullArticle, setFullArticle] = useState("Loading full article...");

  useEffect(() => {
    if (news?.url) {
      axios
        .get(`http://localhost:5000/api/full-article?url=${encodeURIComponent(news.url)}`)
        .then((res) => setFullArticle(res.data.content))
        .catch(() => setFullArticle("Failed to load full article."));
        console.log(fullArticle)
    }
    
  }, [news]);

  if (!news) {
    return <p className="text-center text-gray-600">News article not found.</p>;
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6 mt-6">
      {/* News Image */}
      <img
        src={news.urlToImage || "https://via.placeholder.com/800x400"}
        alt={news.title}
        className="w-full h-64 object-cover rounded-md"
      />

      {/* News Title */}
      <h1 className="text-2xl font-bold text-gray-900 mt-4">{news.title}</h1>

      {/* News Author and Date */}
      <p className="text-sm text-gray-500 mt-2">
        {news.author && `By ${news.author} • `} {new Date(news.publishedAt).toLocaleDateString()}
      </p>

      {/* Full Article Content */}
      <p className="text-gray-700 mt-4">{fullArticle}</p>

      {/* Read Original Article */}
      <a
        href={news.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
      >
        Read Full Article
      </a>
    </div>
  );
};

export default NewsDetail;
