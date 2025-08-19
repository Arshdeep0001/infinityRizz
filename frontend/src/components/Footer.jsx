import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa'; // Import icons

const Footer = () => {
  return (
    <footer className="bg-black text-white py-8 border-t border-red-gray-900">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4">
        {/* Left Section - Logo */}
        <div className="mb-4 md:mb-0">
          <img 
            src="logoo.png" 
            alt="Company Logo" 
            className="h-5" // Adjust logo size as needed
          />
        </div>

        {/* Right Section - Social Media, Links, etc. */}
        <div className="text-center md:text-right">
          <div className="flex justify-center md:justify-end space-x-4 mb-4">
            <a href="https://facebook.com" aria-label="Facebook" className="text-white hover:text-gray-400">
              <FaFacebook size={24} />
            </a>
            <a href="https://twitter.com" aria-label="Twitter" className="text-white hover:text-gray-400">
              <FaTwitter size={24} />
            </a>
            <a href="https://instagram.com" aria-label="Instagram" className="text-white hover:text-gray-400">
              <FaInstagram size={24} />
            </a>
          </div>
          
          <div className="flex flex-col md:flex-row justify-center md:justify-end space-y-2 md:space-y-0 md:space-x-4 text-sm">
            <a href="/terms" className="hover:text-gray-400">Terms & Conditions</a>
            <a href="/privacy" className="hover:text-gray-400">Privacy Policy</a>
            <p className="mt-2 md:mt-0">&copy; 2025 InfinityRizz. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;