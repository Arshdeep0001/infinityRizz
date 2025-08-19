import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <div className="relative h-screen overflow-hidden bg-black">
      <video
        autoPlay
        muted
        loop
        className="absolute z-0 w-full h-full object-cover opacity-100"
      >
        <source src="/Background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center bg-black bg-opacity-30">
        <h1 className="text-4xl md:text-6xl mb-4 font-bold text-white luxury-font mt-80">Welcome to InfintyRizz</h1>
        {/* <p className="text-lg md:text-xl mb-6 text-gray-300 luxury-font">Explore clothing inspired by the mysteries of space!</p> */}
        <Link to="/shop" className="bg-transpaernt text-white border px-6 py-3 hover:bg-white hover:text-black  transition duration-300">Shop Now</Link>
      </div>
    </div>
  );
};

export default HeroSection;