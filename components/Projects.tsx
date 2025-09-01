import Image from 'next/image';

interface Project {
  title: string;
  description: string;
  image: string;
  link: string;
  liveUrl?: string;
  type?: string;
  playStoreUrl?: string;
  appStoreUrl?: string;
  isClosedSource?: boolean;
}

const Projects: React.FC = () => {
  const projects: Project[] = [
    {
      title: 'White Feathers Jewellery',
      description: 'E-commerce App for White Feathers Jewellery built with React Native. Available on both Play Store and App Store.',
      image: '/assets/wflogo.png',
      link: 'https://whitefeathersjewellery.com/',
      liveUrl: 'https://whitefeathersjewellery.com/',
      type: 'Mobile App',
      playStoreUrl: 'https://play.google.com/store/apps/details?id=com.whitefeathersjewellery',
      appStoreUrl: 'https://apps.apple.com/app/white-feathers-jewellery/id123456789',
      isClosedSource: true
    },
    {
      title: 'Gsauce Dictionary',
      description: 'Online dictionary. Type a word, hit search, get meaning.',
      image: '/assets/gsauce_preview-BpqvQe_-.png',
      link: 'https://github.com/asim-koirala/Gsauce_Dictionary',
      liveUrl: 'https://gsauce-dictionary.vercel.app',
      type: 'Web App'
    },
    {
      title: 'KBC Quiz App',
      description: 'Fact blast! Test your knowledge in all areas.',
      image: '/assets/KBC_preview-kkYI33cF.png',
      link: 'https://github.com/asim-koirala/asimKBC.github.io',
      liveUrl: 'https://asim-koirala.github.io/asimKBC.github.io/',
      type: 'Web App'
    },
    {
      title: 'Education Website',
      description: 'Learn. Grow. Explore. Start your journey here',
      image: '/assets/education_preview-zU3OzwOE.png',
      link: 'https://github.com/asim-koirala/Education',
      liveUrl: 'https://education-website-demo.vercel.app',
      type: 'Web App'
    }
  ];

  return (
    <div id="Projects" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-16">
          <h2 className="text-blue-700 text-lg font-medium mb-2">MY PROJECTS</h2>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">What I Built</h1>
          <div className="w-24 h-1 bg-blue-600 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-100 flex flex-col h-full"
            >
              <div className="relative overflow-hidden group">
                <Image 
                  src={project.image} 
                  alt={`${project.title} preview`} 
                  width={500} 
                  height={300}
                  className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900 to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-300 flex items-end">
                  <div className="p-4 w-full">
                    <span className="text-white text-sm font-medium bg-blue-600 py-1 px-2 rounded-full">{project.type || 'Web App'}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{project.title}</h3>
                <p className="text-gray-600 mb-4 flex-grow">{project.description}</p>
                
                <div className="flex justify-between items-center">
                  {!project.isClosedSource ? (
                    <a 
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-medium flex items-center transition-colors"
                    >
                      <span>View Code</span>
                      <i className="fa-solid fa-arrow-right ml-1"></i>
                    </a>
                  ) : (
                    <a 
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-medium flex items-center transition-colors"
                    >
                      <span>Visit Website</span>
                      <i className="fa-solid fa-arrow-right ml-1"></i>
                    </a>
                  )}
                  
                  <div className="flex space-x-2">
                    {!project.isClosedSource && (
                      <a 
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center hover:bg-blue-200 hover:scale-110 transition-all duration-300 relative group"
                        aria-label="View GitHub Repository"
                      >
                        <i className="fa-brands fa-github text-blue-600"></i>
                        <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">GitHub Repo</span>
                      </a>
                    )}
                    
                    {project.type === 'Mobile App' ? (
                      <>
                        {project.playStoreUrl && (
                          <a 
                            href={project.playStoreUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center hover:bg-blue-200 hover:scale-110 transition-all duration-300 relative group"
                            aria-label="Download from Play Store"
                          >
                            <i className="fa-brands fa-google-play text-blue-600"></i>
                            <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">Play Store</span>
                          </a>
                        )}
                        
                        {project.appStoreUrl && (
                          <a 
                            href={project.appStoreUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center hover:bg-blue-200 hover:scale-110 transition-all duration-300 relative group"
                            aria-label="Download from App Store"
                          >
                            <i className="fa-brands fa-apple text-blue-600"></i>
                            <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">App Store</span>
                          </a>
                        )}
                      </>
                    ) : null}
                    
                    <a 
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center hover:bg-blue-200 hover:scale-110 transition-all duration-300 relative group"
                      aria-label="View Live Website"
                    >
                      <i className="fa-solid fa-globe text-blue-600"></i>
                      <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">{project.type === 'Mobile App' ? 'Website' : 'Live Demo'}</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;