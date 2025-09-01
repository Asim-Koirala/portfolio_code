'use client';

import { useState, useEffect } from 'react';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    // Close sidebar if open
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      {/* Sidebar */}
      <div className={`w-64 h-full bg-white shadow-2xl fixed ease-in-out duration-300 z-30 flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-64'}`}
        id="sidebar">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <div className="text-2xl font-bold text-blue-700">Asim Koirala</div>
          <button className="text-2xl text-gray-600 hover:text-blue-700 transition-colors" onClick={toggleSidebar}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div id="navigations" className="w-full mt-6">
          <ul className="flex flex-col" id="sidebar_navigation">
            <li className="text-lg font-medium px-6 py-4 hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-pointer border-l-4 border-transparent hover:border-blue-700" 
                onClick={() => scrollToSection('Home')}>
                <i className="fa-solid fa-house mr-3"></i>Home
            </li>
            <li className="text-lg font-medium px-6 py-4 hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-pointer border-l-4 border-transparent hover:border-blue-700" 
                onClick={() => scrollToSection('About')}>
                <i className="fa-solid fa-user mr-3"></i>About Me
            </li>
            <li className="text-lg font-medium px-6 py-4 hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-pointer border-l-4 border-transparent hover:border-blue-700" 
                onClick={() => scrollToSection('Skills')}>
                <i className="fa-solid fa-code mr-3"></i>Skills
            </li>
            <li className="text-lg font-medium px-6 py-4 hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-pointer border-l-4 border-transparent hover:border-blue-700" 
                onClick={() => scrollToSection('Projects')}>
                <i className="fa-solid fa-briefcase mr-3"></i>Projects
            </li>
            <li className="text-lg font-medium px-6 py-4 hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-pointer border-l-4 border-transparent hover:border-blue-700" 
                onClick={() => scrollToSection('Contact')}>
                <i className="fa-solid fa-envelope mr-3"></i>Contact
            </li>
          </ul>
        </div>
      </div>

      {/* Hamburger Icon */}
      <div id="hamburger_icon" className="md:hidden text-2xl p-4 cursor-pointer fixed z-20 text-white bg-blue-700 rounded-full shadow-lg m-4"
           onClick={toggleSidebar}>
        <i className="fa-solid fa-bars"></i>
      </div>

      {/* Scroll to top button */}
      <button id="scroll_top_circle" 
         className={`rounded-full p-3 text-white fixed ${isScrolled ? 'right-5 opacity-100' : '-right-20 opacity-0'} bottom-5 bg-blue-700 hover:bg-blue-800 shadow-lg z-50 transition-all ease-in-out duration-300 cursor-pointer`}
         onClick={() => scrollToSection('Home')}>
         <i className="fa-solid fa-arrow-up text-lg"></i>
      </button>

      {/* Navbar */}
      <nav className={`bg-white ${isScrolled ? 'shadow-lg' : ''} h-16 w-full flex items-center justify-between fixed z-10 px-6 transition-all duration-300`}>
        <div className="text-2xl font-bold text-blue-700 h-full flex items-center cursor-pointer">
          Asim Koirala
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