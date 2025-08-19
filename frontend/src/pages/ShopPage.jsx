import React from 'react';
import Navbar from '../components/Navbar';
import ProductList from '../components/ProductList';
import Footer from '../components/Footer';

const ShopPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* <Navbar /> */}
      <main className="flex-grow pt-0">
        <ProductList />
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default ShopPage;