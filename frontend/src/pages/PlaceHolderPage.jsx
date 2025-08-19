// src/pages/PlaceholderPage.jsx
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PlaceholderPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white luxury-font">
      {/* <Navbar /> */}
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="text-center">
          <h2 className="text-5xl font-extrabold mb-4">Under Construction!</h2>
          <p className="text-xl text-gray-400">This page is a placeholder and is currently being developed.</p>
          <p className="text-lg text-gray-500 mt-2">Please check back later.</p>
        </div>
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default PlaceholderPage;
