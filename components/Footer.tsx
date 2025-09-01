'use client';

import { useState, useEffect } from 'react';

const Footer: React.FC = () => {
  const [currentYear, setCurrentYear] = useState(2024);
  
  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);
  
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl font-bold text-blue-400">Asim<span className="text-white">Koirala</span></h2>
            <p className="text-gray-400 mt-2">Web Developer & Designer</p>
          </div>
          
          <div className="flex space-x-4 mb-4 md:mb-0">
            <a href="https://github.com/asim-koirala" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors duration-300">
              <i className="fab fa-github"></i>
            </a>
            <a href="https://www.linkedin.com/in/asim-koirala-0659212a6/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors duration-300">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a href="mailto:asimkoirala01@gmail.com" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors duration-300">
              <i className="fa fa-envelope"></i>
            </a>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {currentYear} Asim Koirala. All Rights Reserved.
          </p>
          <p className="text-gray-400 text-sm mt-2 md:mt-0">
            Designed with <i className="fas fa-heart text-red-500 mx-1"></i> in Nepal
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;