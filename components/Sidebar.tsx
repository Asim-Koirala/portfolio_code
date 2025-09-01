'use client';

import { useState, useEffect } from 'react';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      toggleSidebar(); // Close sidebar after clicking
    }
  };

  return (
    <div 
      className={`w-56 h-full bg-slate-100 fixed ease-in duration-200 z-30 flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-56'}`}
    >
      <div className="text-3xl pr-3 pt-3 flex justify-end">
        <i className="fa-solid fa-xmark cursor-pointer h-8" onClick={toggleSidebar}></i>
      </div>

      <div className="w-full">
        <ul>
          <li className="text-3xl text-blue-500 px-10 py-5 hover:bg-slate-200 cursor-pointer w-full" 
              onClick={() => scrollToSection('Home')}>Home</li>
          <li className="text-3xl text-blue-500 px-10 py-5 hover:bg-slate-200 cursor-pointer" 
              onClick={() => scrollToSection('AboutMe')}>About Me</li>
          <li className="text-3xl text-blue-500 px-10 py-5 hover:bg-slate-200 cursor-pointer" 
              onClick={() => scrollToSection('Skills')}>Skills</li>
          <li className="text-3xl text-blue-500 px-10 py-5 hover:bg-slate-200 cursor-pointer" 
              onClick={() => scrollToSection('Projects')}>Projects</li>
          <li className="text-3xl text-blue-500 px-10 py-5 hover:bg-slate-200 cursor-pointer" 
              onClick={() => scrollToSection('Contact')}>Contact</li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;