'use client';

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
      className={`w-72 h-full bg-white bg-opacity-95 shadow-2xl fixed ease-in-out duration-300 z-30 flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-72'} backdrop-blur-sm`}
    >
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <div className="text-2xl font-bold text-blue-700 cursor-pointer" onClick={() => {
          window.scrollTo({top: 0, behavior: 'smooth'});
          toggleSidebar(); // Close sidebar after clicking
        }}>Asim Koirala</div>
        <div className="flex items-center gap-2">
          <button 
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-blue-100 hover:text-blue-700 text-gray-600 transition-all duration-300 hover:rotate-90" 
            onClick={toggleSidebar}
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>
      </div>

      <div className="w-full mt-6 flex-1">
        <ul className="flex flex-col">
          <li className="text-lg font-medium px-6 py-4 hover:bg-blue-50 hover:text-blue-700 transition-all duration-300 cursor-pointer border-l-4 border-transparent hover:border-blue-700 group text-gray-700" 
              onClick={() => {
                window.scrollTo({top: 0, behavior: 'smooth'});
                toggleSidebar(); // Close sidebar after clicking
              }}>
              <i className="fa-solid fa-house mr-3 group-hover:scale-110 transition-transform duration-300"></i>
              <span className="group-hover:translate-x-1 inline-block transition-transform duration-300">Home</span>
          </li>
          <li className="text-lg font-medium px-6 py-4 hover:bg-blue-50 hover:text-blue-700 transition-all duration-300 cursor-pointer border-l-4 border-transparent hover:border-blue-700 group text-gray-700" 
              onClick={() => scrollToSection('About')}>
              <i className="fa-solid fa-user mr-3 group-hover:scale-110 transition-transform duration-300"></i>
              <span className="group-hover:translate-x-1 inline-block transition-transform duration-300">About Me</span>
          </li>
          <li className="text-lg font-medium px-6 py-4 hover:bg-blue-50 hover:text-blue-700 transition-all duration-300 cursor-pointer border-l-4 border-transparent hover:border-blue-700 group text-gray-700" 
              onClick={() => scrollToSection('Skills')}>
              <i className="fa-solid fa-code mr-3 group-hover:scale-110 transition-transform duration-300"></i>
              <span className="group-hover:translate-x-1 inline-block transition-transform duration-300">Skills</span>
          </li>
          <li className="text-lg font-medium px-6 py-4 hover:bg-blue-50 hover:text-blue-700 transition-all duration-300 cursor-pointer border-l-4 border-transparent hover:border-blue-700 group text-gray-700" 
              onClick={() => scrollToSection('Projects')}>
              <i className="fa-solid fa-briefcase mr-3 group-hover:scale-110 transition-transform duration-300"></i>
              <span className="group-hover:translate-x-1 inline-block transition-transform duration-300">Projects</span>
          </li>
          <li className="text-lg font-medium px-6 py-4 hover:bg-blue-50 hover:text-blue-700 transition-all duration-300 cursor-pointer border-l-4 border-transparent hover:border-blue-700 group text-gray-700" 
              onClick={() => {
                window.location.href = '/utilities';
                toggleSidebar(); // Close sidebar after clicking
              }}>
              <i className="fa-solid fa-tools mr-3 group-hover:scale-110 transition-transform duration-300"></i>
              <span className="group-hover:translate-x-1 inline-block transition-transform duration-300">Utilities</span>
          </li>
          <li className="text-lg font-medium px-6 py-4 hover:bg-blue-50 hover:text-blue-700 transition-all duration-300 cursor-pointer border-l-4 border-transparent hover:border-blue-700 group text-gray-700" 
              onClick={() => scrollToSection('Contact')}>
              <i className="fa-solid fa-envelope mr-3 group-hover:scale-110 transition-transform duration-300"></i>
              <span className="group-hover:translate-x-1 inline-block transition-transform duration-300">Contact</span>
          </li>
        </ul>
      </div>
      
      {/* Social Links */}
      <div className="mt-auto border-t border-gray-200 p-6">
        <div className="flex justify-center space-x-4">
          <a href="https://github.com/asim-koirala" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-blue-100 transition-colors duration-300">
             <i className="fab fa-github text-blue-700"></i>
           </a>
           <a href="https://www.linkedin.com/in/asim-koirala-0659212a6/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-blue-100 transition-colors duration-300">
             <i className="fab fa-linkedin-in text-blue-700"></i>
           </a>
           <a href="mailto:asimkoirala01@gmail.com" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-blue-100 transition-colors duration-300">
             <i className="fa fa-envelope text-blue-700"></i>
           </a>
        </div>
        <p className="text-center text-gray-500 text-sm mt-4">© 2025 Asim Koirala</p>
      </div>
    </div>
  );
};

export default Sidebar;