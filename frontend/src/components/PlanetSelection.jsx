import React from 'react';
import { Link } from 'react-router-dom';

const PlanetSelection = () => {
  const planets = [
    { name: 'Mercury', path: '/shop/mercury', image: '/mercury.png' },
    { name: 'Venus', path: '/shop/venus', image: '/venus.png' },
    { name: 'Earth', path: '/shop/earth', image: '/earth.png' },
    { name: 'Mars', path: '/shop/mars', image: '/mars.png' },
    { name: 'Jupiter', path: '/shop/jupiter', image: '/jupiter.png' },
    { name: 'Saturn', path: '/shop/saturn', image: '/saturn.png' },
    { name: 'Uranus', path: '/shop/uranus', image: '/uranus.png' },
    { name: 'Neptune', path: '/shop/neptune', image: '/neptune.png' },
    { name: 'Moon', path: '/shop/moon', image: '/moon.png' },
  ];

  return (
    <div className="py-16 bg-black">
      <h2 className="text-4xl font-bold text-center mb-12 text-white luxury-font">Choose Your Cosmic Collection</h2>
      <div className="container mx-auto px-4">
        <div className="flex overflow-x-auto space-x-6 pb-8 scrollbar-hide" style={{ minHeight: '200px' }}>
          {planets.slice(0, 5).map((planet) => (
            <Link to={planet.path} key={planet.name} className="flex-shrink-0 flex flex-col items-center">
              <img src={planet.image} alt={planet.name} className="w-40 h-40 object-contain rounded-full animate-float hover:brightness-125 transition duration-300" />
              <p className="mt-4 text-white luxury-font text-lg">{planet.name}</p>
            </Link>
          ))}
          {planets.length > 5 && planets.slice(5).map((planet) => (
            <Link to={planet.path} key={planet.name} className="flex-shrink-0 flex flex-col items-center">
              <img src={planet.image} alt={planet.name} className="w-40 h-40 object-contain rounded-full animate-float hover:brightness-125 transition duration-300" />
              <p className="mt-4 text-white luxury-font text-lg">{planet.name}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlanetSelection;