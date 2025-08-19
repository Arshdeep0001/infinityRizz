import React, { useEffect, useState } from 'react';

const ScrollProgressIndicator = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPosition = window.scrollY;
    const progress = (scrollPosition / totalHeight) * 100;
    setScrollProgress(progress);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      className="fixed bottom-4 right-4 w-16 h-16 rounded-full bg-black border-2 border-white flex items-center justify-center z-50 overflow-hidden"
      style={{
        boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
      }}
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(#ff8c00 ${scrollProgress}%, transparent ${scrollProgress}%)`,
        }}
      ></div>
      {/* Replace this with your actual image */}
      <img
        src="image.png"
        alt="Progress Indicator"
        className="w-14 h-14 rounded-full object-cover z-10"
      />
    </div>
  );
};

export default ScrollProgressIndicator;