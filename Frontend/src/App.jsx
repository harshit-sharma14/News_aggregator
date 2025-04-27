import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import NewsDetail from './components/NewsDetail';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [language, setLanguage] = useState('en');

  const handleSearch = (query, lang = 'en') => {
    setSearchQuery(query);
    setLanguage(lang);
  };

  return (
    <Layout onSearch={handleSearch} searchQuery={searchQuery} language={language}>
      <Routes>
        <Route path="/" element={<Home searchQuery={searchQuery} language={language} />} />
        <Route path="/news/:title" element={<NewsDetail />} />
      </Routes>
    </Layout>
  );
}

export default App;
