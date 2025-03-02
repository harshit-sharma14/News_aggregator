import React from 'react';

const NewsCard = ({ news }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* News Image */}
      <img
        src={news.urlToImage || 'https://via.placeholder.com/400x200'} // Fallback image if no image is provided
        alt={news.title}
        className="w-full h-48 object-cover"
      />

      {/* News Content */}
      <div className="p-6">
        {/* News Title */}
        <h3 className="text-xl font-semibold text-gray-800 mb-2 hover:text-blue-600 transition-colors duration-300">
          {news.title}
        </h3>

        {/* News Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{news.description}</p>

        {/* Read More Button */}
        <a
          href={news.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
        >
          Read more
        </a>
      </div>
    </div>
  );
};

export default NewsCard;