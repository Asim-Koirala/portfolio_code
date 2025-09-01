'use client';

import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [emailFailure, setEmailFailure] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const showEmailSuccess = () => {
    setEmailSuccess(true);
    setTimeout(() => setEmailSuccess(false), 3000);
  };

  const showEmailFailure = () => {
    setEmailFailure(true);
    setTimeout(() => setEmailFailure(false), 3000);
  };

  return (
    <div className="font-serif w-full">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div 
        id="hamburger_icon" 
        className="navExpand:hidden text-3xl p-4 cursor-pointer fixed hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-500 h-16 z-20 text-white"
        onClick={toggleSidebar}
      >
        <i className="fa-solid fa-bars"></i>
      </div>

      <i 
        id="scroll_top_circle" 
        className={`fa-solid fa-arrow-up rounded-full px-4 p-3 text-white fixed ${showScrollTop ? 'right-5' : '-right-52'} bottom-5 bg-purple-300 z-50 transition-all ease-in-out cursor-pointer`}
        onClick={scrollToTop}
      ></i>

      <div 
        id="email_success" 
        className={`bg-slate-200 w-64 h-14 fixed ${emailSuccess ? 'right-5' : '-right-96'} top-5 rounded-lg z-50 flex items-center justify-center text-lg drop-shadow-xl transition-all ease-in-out`}
      >
        <p className="drop-shadow-2xl text-lg text-cyan-600 text-justify">Your Message has been sent!</p>
      </div>

      <div 
        id="email_failure" 
        className={`bg-slate-200 w-64 h-24 fixed ${emailFailure ? 'right-5' : '-right-96'} top-5 rounded-lg z-50 flex items-center justify-center text-sm drop-shadow-xl transition-all ease-in-out`}
      >
        <p className="drop-shadow-2xl text-lg text-cyan-600 text-justify">There was a problem sending the message. Please try again later.</p>
      </div>

      <Navbar />
      
      {children}
    </div>
  );
};

export default Layout;