import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaNewspaper, FaSearch, FaBars, FaTimes } from 'react-icons/fa';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'Hindi' },
  { code: 'bn', label: 'Bengali' },
  { code: 'gu', label: 'Gujarati' },
  { code: 'ml', label: 'Malayalam' },
  { code: 'ta', label: 'Tamil' },
  { code: 'te', label: 'Telugu' },
  { code: 'ur', label: 'Urdu' },
  { code: 'ne', label: 'Nepali' },
  { code: 'si', label: 'Sinhala' },
];

export default function Navbar({ onSearch, initialQuery = '', initialLanguage = 'en' }) {
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [language, setLanguage] = useState(initialLanguage);
  const [isOpen, setIsOpen] = useState(false);

  // Sync local state when parent changes
  useEffect(() => {
    setSearchTerm(initialQuery);
    setLanguage(initialLanguage);
  }, [initialQuery, initialLanguage]);

  // Fire search+translate on form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm, language);
    setIsOpen(false);
  };

  // Fire immediately when language changes
  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    onSearch(searchTerm, lang);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between px-4 h-16">
        <Link to="/" className="flex items-center space-x-3">
          <FaNewspaper className="text-blue-600 text-2xl" />
          <span className="text-2xl font-extrabold text-gray-800">News Aggregator</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center space-x-4 flex-1 max-w-lg mx-4">
          <form onSubmit={handleSubmit} className="flex flex-1">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search news..."
              className="flex-1 px-4 py-2 border rounded-l-full border-gray-300 focus:outline-none"
            />
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-r-full">
              <FaSearch />
            </button>
          </form>
          {/* <select
            value={language}
            onChange={handleLanguageChange}
            className="border px-2 py-1 rounded-md"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </select> */}
        </div>

        {/* Mobile */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2">
          {isOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4">
          <form onSubmit={handleSubmit} className="flex mt-2">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search news..."
              className="w-full px-4 py-2 border border-gray-300 rounded-l-full"
            />
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-r-full">
              <FaSearch />
            </button>
          </form>
          <select
            value={language}
            onChange={handleLanguageChange}
            className="w-full mt-3 border border-gray-300 rounded px-2 py-1"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>
      )}
    </nav>
  );
}
