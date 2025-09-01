'use client';

import { useState, useEffect } from 'react';

interface NavbarProps {
  toggleSidebar?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // Use the passed toggleSidebar function
  const handleToggleSidebar = () => {
    if (toggleSidebar) {
      toggleSidebar();
    }
  };

  return (
    <>
      {/* Sidebar is now handled by the separate Sidebar component */}

      {/* Removed floating hamburger icon */}

      {/* Scroll to top button */}
      <button id="scroll_top_circle" 
         className={`rounded-full p-3 text-white fixed ${isScrolled ? 'right-5 opacity-100' : '-right-20 opacity-0'} bottom-5 bg-blue-700 hover:bg-blue-800 shadow-lg z-50 transition-all ease-in-out duration-300 cursor-pointer`}
         onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
         <i className="fa-solid fa-arrow-up text-lg"></i>
      </button>

      {/* Navbar */}
      <nav className={`bg-white ${isScrolled ? 'shadow-lg' : ''} h-16 w-full flex items-center justify-between fixed z-50 px-6 transition-all duration-300`}>
        <div className="flex items-center gap-4">
          <div className="md:hidden text-3xl cursor-pointer text-blue-700 hover:text-blue-800 transition-colors" onClick={handleToggleSidebar}>
            <i className="fa-solid fa-bars"></i>
          </div>
          
          <div className="text-2xl font-bold text-blue-700 h-full flex items-center cursor-pointer">
            Asim Koirala
          </div>
        </div>
        
        <div id="expanded_navbar" className="hidden md:flex md:items-center md:justify-end">
          <ul className="flex items-center h-full space-x-1" id="navigation_items">
            <li className="text-gray-700 hover:text-blue-700 px-4 py-2 rounded-md cursor-pointer transition-colors font-medium" 
                onClick={() => scrollToSection('Home')}>Home</li>
            <li className="text-gray-700 hover:text-blue-700 px-4 py-2 rounded-md cursor-pointer transition-colors font-medium" 
                onClick={() => scrollToSection('About')}>About Me</li>
            <li className="text-gray-700 hover:text-blue-700 px-4 py-2 rounded-md cursor-pointer transition-colors font-medium" 
                onClick={() => scrollToSection('Skills')}>Skills</li>
            <li className="text-gray-700 hover:text-blue-700 px-4 py-2 rounded-md cursor-pointer transition-colors font-medium" 
                onClick={() => scrollToSection('Projects')}>Projects</li>
            <li className="text-gray-700 bg-blue-700 text-white hover:bg-blue-800 px-4 py-2 rounded-md cursor-pointer transition-colors font-medium" 
                onClick={() => scrollToSection('Contact')}>Contact</li>
          </ul>
        </div>
        <div className="" id="Home"></div>
      </nav>
    </>
  );
};

export default Navbar;