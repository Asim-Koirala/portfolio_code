'use client';

import { useCallback, useEffect, useState } from 'react';
import Particles from '@tsparticles/react';
import type { Engine } from '@tsparticles/engine';
import { loadSlim } from '@tsparticles/slim';

const ParticlesComponent: React.FC = () => {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Make sure particles are visible by setting z-index properly
    const particlesContainer = document.getElementById('particles-js');
    if (particlesContainer) {
      particlesContainer.style.zIndex = '1';
    }
    
    // Cleanup function to properly dispose of particles when component unmounts
    return () => {
      const container = document.getElementById('particles-js');
      if (container) {
        container.remove();
      }
    };
  }, []);

  // Only render particles on the client side after mounting
  if (!mounted) return null;
  
  return (
    <Particles
      id="particles-js"
      className="w-full h-screen absolute"
      options={{
        fps_limit: 30, // Limit framerate to reduce CPU usage
        particles: {
          number: {
            value: 10, // Reduced from 20
            density: {
              enable: false,
              value_area: 800
            }
          },
          color: {
            value: "#ffffff"
          },
          shape: {
            type: "edge",
            stroke: {
              width: 0,
              color: "#000000"
            },
            polygon: {
              nb_sides: 5
            }
          },
          opacity: {
            value: 0.5,
            random: false,
            anim: {
              enable: false,
              speed: 1,
              opacity_min: 0.1,
              sync: false
            }
          },
          size: {
            value: 8, // Reduced from 10
            random: true,
            anim: {
              enable: false,
              speed: 40, // Reduced from 80
              size_min: 0.1,
              sync: false
            }
          },
          line_linked: {
            enable: true,
            distance: 200, // Reduced from 300
            color: "#ffffff",
            opacity: 0.4,
            width: 1 // Reduced from 2
          },
          move: {
            enable: true,
            speed: 6, // Reduced from 12
            direction: "none",
            random: false,
            straight: false,
            out_mode: "out",
            bounce: false,
            attract: {
              enable: false,
              rotateX: 600,
              rotateY: 1200
            }
          }
        },
        interactivity: {
          detect_on: "canvas",
          events: {
            onhover: {
              enable: true,
              mode: "repulse"
            },
            onclick: {
              enable: true,
              mode: "remove"
            },
            resize: true
          },
          modes: {
            repulse: {
              distance: 100, // Reduced from 150
              duration: 0.4
            },
            remove: {
              particles_nb: 1 // Reduced from 2
            }
          }
        },
        retina_detect: false, // Disabled to improve performance
      }}
      init={particlesInit}
    />
  );
};

export default ParticlesComponent;