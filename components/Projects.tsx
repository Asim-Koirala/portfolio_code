import Image from 'next/image';

interface Project {
  title: string;
  description: string;
  image: string;
  link: string;
}

const Projects: React.FC = () => {
  const projects: Project[] = [
    {
      title: 'Gsauce Dictionary',
      description: 'Online dictionary. Type a word, hit search, get meaning.',
      image: '/assets/gsauce_preview-BpqvQe_-.png',
      link: 'https://github.com/Asim-Koirala/Gsauce_Dictionary'
    },
    {
      title: 'KBC Quiz App',
      description: 'Fact blast! Test your knowledge in all areas.',
      image: '/assets/KBC_preview-kkYI33cF.png',
      link: 'https://github.com/Asim-Koirala/asimKBC.github.io'
    },
    {
      title: 'Education Website',
      description: 'Learn. Grow. Explore. Start your journey here',
      image: '/assets/education_preview-zU3OzwOE.png',
      link: 'https://github.com/Asim-Koirala/Education'
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
                    <span className="text-white text-sm font-medium bg-blue-600 py-1 px-2 rounded-full">Web App</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{project.title}</h3>
                <p className="text-gray-600 mb-4 flex-grow">{project.description}</p>
                
                <div className="flex justify-between items-center">
                  <a 
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-medium flex items-center transition-colors"
                  >
                    <span>View Code</span>
                    <i className="fa-solid fa-arrow-right ml-1"></i>
                  </a>
                  
                  <div className="flex space-x-2">
                    <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <i className="fa-brands fa-github text-blue-600"></i>
                    </span>
                    <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <i className="fa-solid fa-globe text-blue-600"></i>
                    </span>
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