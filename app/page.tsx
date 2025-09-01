'use client';

import dynamic from 'next/dynamic';

// Use dynamic imports with loading priority
const Layout = dynamic(() => import('../components/Layout'), { loading: () => <div className="min-h-screen"></div> });

// Components with heavy animations or interactions should be lazy-loaded
const Hero = dynamic(() => import('../components/Hero'), { 
  loading: () => <div className="min-h-screen bg-gradient-to-r from-blue-900 to-blue-700"></div>,
  ssr: false // Disable server-side rendering for the Hero component with particles
});

// Regular components
const About = dynamic(() => import('../components/About'));
const Skills = dynamic(() => import('../components/Skills'));
const Projects = dynamic(() => import('../components/Projects'));
const Contact = dynamic(() => import('../components/Contact'));
const Footer = dynamic(() => import('../components/Footer'));

// This is now a Client Component that loads other components
export default function Home() {
  return (
    <Layout>
      <main className="w-full">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
        <Footer />
      </main>
    </Layout>
  );
}
