'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';

const Hero: React.FC = () => {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);
  const [mounted, setMounted] = useState(false);

  const roles = useMemo(() => ['Developer', 'Designer', 'Student'], []);
  const period = useMemo(() => 2000, []);

  // First useEffect only runs once to set mounted state after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Second useEffect for the typing animation only runs after component is mounted
  useEffect(() => {
    if (!mounted) return;
    
    const tick = () => {
      const i = loopNum % roles.length;
      const fullText = roles[i];
  
      setText(isDeleting 
        ? fullText.substring(0, text.length - 1) 
        : fullText.substring(0, text.length + 1)
      );
  
      if (isDeleting) {
        setTypingSpeed(prevSpeed => prevSpeed / 2);
      }
  
      if (!isDeleting && text === fullText) {
        setTimeout(() => {
          setIsDeleting(true);
          setTypingSpeed(150);
        }, period);
      } else if (isDeleting && text === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        setTypingSpeed(150);
      }
    };
    
    const ticker = setInterval(() => {
      tick();
    }, typingSpeed);

    return () => { clearInterval(ticker) };
  }, [text, isDeleting, loopNum, typingSpeed, mounted, roles, period]);
  
  // No particles component anymore

  // Tick function moved inside useEffect to avoid dependency issues

  return (
    <div id="Home" className="bg-gradient-to-r from-blue-900 to-blue-700 min-h-screen w-full flex justify-center items-center overflow-hidden relative py-24">
      <div className="absolute inset-0 bg-[url('/img/grid.svg')] bg-center opacity-10"></div>
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between z-10 relative">
        <div className="w-full md:w-1/2 flex flex-col justify-center text-white mb-10 md:mb-0">
          <span className="text-blue-300 font-medium text-lg mb-2">Hello, I am</span>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
            Asim Koirala
          </h1>
          <div className="text-xl md:text-2xl flex items-center mb-6">
            <span className="mr-2">And I&apos;m a</span>
            <span className="typed_animation_span font-bold text-blue-300 border-r-4 border-blue-300 pr-1">{text}</span>
          </div>
          <p className="text-blue-100 mb-8 max-w-lg">I create beautiful, functional, and responsive websites with modern technologies.</p>
          <div className="flex space-x-4">
            <button onClick={() => document.getElementById('Projects')?.scrollIntoView({ behavior: 'smooth' })} 
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors duration-300 shadow-lg flex items-center">
              <span>View My Work</span>
              <i className="fa-solid fa-arrow-right ml-2"></i>
            </button>
            <button onClick={() => document.getElementById('Contact')?.scrollIntoView({ behavior: 'smooth' })}
                    className="bg-transparent hover:bg-blue-800 text-white font-medium py-3 px-6 rounded-md border-2 border-blue-400 hover:border-blue-600 transition-all duration-300 flex items-center">
              <span>Contact Me</span>
            </button>
          </div>
        </div>
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full bg-blue-600 bg-opacity-20 backdrop-blur-sm p-2 shadow-xl">
            <div className="w-full h-full rounded-full overflow-hidden border-4 border-blue-400 shadow-inner">
              <Image src="/assets/profile_circle.png" alt="Asim Koirala" width={320} height={320} className="w-full h-full object-cover" />
            </div>
            <div className="absolute -top-4 -right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg">
              <i className="fa-solid fa-code text-xl"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;