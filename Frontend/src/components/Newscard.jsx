// NewsCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function NewsCard({ news }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
      {/* Image Overlay */}
      <div className="relative h-48">
        <img
          src={news.urlToImage || 'https://via.placeholder.com/400x200'}
          alt={news.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-60"></div>
        <span className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs uppercase font-bold px-3 py-1 rounded-lg">
          {news.source?.name || 'Unknown'}
        </span>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col justify-between h-48">
        <Link to={`/news/${encodeURIComponent(news.title)}`} state={{ news }}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors duration-300">
            {news.title}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {news.description || 'No description available.'}
        </p>
        <div className="mt-auto flex justify-between items-center">
          <Link
            to={`/news/${encodeURIComponent(news.title)}`}
            state={{ news }}
            className="text-blue-600 font-medium hover:underline"
          >
            Read More →
          </Link>
          <span className="text-gray-500 text-xs">{new Date(news.publishedAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}