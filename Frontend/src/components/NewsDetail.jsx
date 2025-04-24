import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const NewsDetail = () => {
  const { state } = useLocation();
  const news = state?.news;
  const [article, setArticle] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!news?.url) return;
    axios
      .get(`http://localhost:5000/api/full-article?url=${encodeURIComponent(news.url)}`)
      .then((res) => setArticle(res.data))
      .catch((_) => setError("Failed to load full article."));
  }, [news]);

  if (!news) {
    return <p className="text-center">News article not found.</p>;
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6 mt-6">
      <img
        src={news.urlToImage || "https://via.placeholder.com/800x400"}
        alt={news.title}
        className="w-full h-64 object-cover rounded-md"
      />
      <h1 className="text-2xl font-bold mt-4">{news.title}</h1>
      <p className="text-sm text-gray-500 mt-2">
        {news.author && `By ${news.author} • `} 
        {new Date(news.publishedAt).toLocaleDateString()}
      </p>

      {/* Render parsed content */}
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {article ? (
        <div
          className="prose lg:prose-xl mt-6"
          dangerouslySetInnerHTML={{ __html: article.contentHTML }}
        />
      ) : (
        <p className="mt-4">Loading full article…</p>
      )}

      <a
        href={news.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        Read Original Article
      </a>
    </div>
  );
};

export default NewsDetail;
