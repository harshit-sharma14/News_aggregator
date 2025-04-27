import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children, onSearch, searchQuery, language }) {
  return (
    <>
      <Navbar
        onSearch={onSearch}
        initialQuery={searchQuery}
        initialLanguage={language}
      />
      <div className="pt-6">{children}</div>
      <Footer />
    </>
  );
}
