'use client';

import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [emailFailure, setEmailFailure] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Scroll event listener moved to Navbar component

  // Scroll to top functionality moved to Navbar component

  // These functions are passed to child components
  const handleEmailSuccess = () => {
    setEmailSuccess(true);
    setTimeout(() => setEmailSuccess(false), 3000);
  };

  const handleEmailFailure = () => {
    setEmailFailure(true);
    setTimeout(() => setEmailFailure(false), 3000);
  };

  // Set up event listeners for email events
  useEffect(() => {
    const handleEmailSuccessEvent = () => handleEmailSuccess();
    const handleEmailErrorEvent = () => handleEmailFailure();
    
    window.addEventListener('emailSuccess', handleEmailSuccessEvent);
    window.addEventListener('emailError', handleEmailErrorEvent);
    
    return () => {
      window.removeEventListener('emailSuccess', handleEmailSuccessEvent);
      window.removeEventListener('emailError', handleEmailErrorEvent);
    };
  }, []);

  return (
    <div className="font-serif w-full">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* Hamburger icon moved to Navbar component */}

      {/* Scroll to top button moved to Navbar component */}

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

      <Navbar toggleSidebar={toggleSidebar} />
      
      {children}
    </div>
  );
};

export default Layout;