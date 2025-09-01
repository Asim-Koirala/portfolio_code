import Image from 'next/image';

const About: React.FC = () => {
  return (
    <div id="About" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-blue-700 text-lg font-medium mb-2">ABOUT ME</h2>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Who I Am</h1>
          <div className="w-24 h-1 bg-blue-600 rounded-full"></div>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="w-full lg:w-5/12">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-full h-full border-2 border-blue-500 rounded-lg"></div>
              <div className="relative z-10 bg-white p-4 shadow-xl rounded-lg">
                <Image 
                  src="/assets/profile_circle.png" 
                  alt="Asim Koirala" 
                  width={500} 
                  height={500} 
                  className="w-full h-auto rounded-lg"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">2+ Years Experience</span>
              </div>
            </div>
            

          </div>
          
          <div className="w-full lg:w-7/12">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Web Developer & Designer</h3>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              I'm Asim Koirala, a developer who transforms ideas into digital experiences that drive business growth. Currently pursuing ACCA & BBS at Seed Financial Academy, I specialize in the MERN stack and React Native, delivering real solutions for real businesses.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              My journey began during the COVID lockdown with curiosity-driven experimentation that evolved into professional expertise. Today, I build impactful projects like the White Feathers Jewellery ecommerce app — live on both App Store and Play Store — and design intelligent automation workflows as an Automation Engineer at Axone (UK).
            </p>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              My academic foundation from Cambridge International A Levels at St. Xavier's College (where I earned the Fr. Marshall D. Moran S.J. Award for Academic Excellence) instilled the discipline and problem-solving mindset that drives my development approach.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              I'm always experimenting with emerging frameworks and pushing boundaries. Every project is an opportunity to learn, grow, and deliver something exceptional.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed mb-8 font-bold">
              Ready to bring your next idea to life?
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                  <i className="fa-solid fa-code text-blue-600 text-xl"></i>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Development</h4>
                  <p className="text-gray-600">MERN & React Native</p>
                </div>
              </div>
            </div>
            
            {/* Education Section */}
            <div className="mb-8">
              <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <i className="fa-solid fa-graduation-cap text-blue-600"></i>
                </div>
                Education
              </h4>
              
              <div className="space-y-6">
                <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                  <h5 className="font-bold text-gray-800 mb-1">SEED Financial Academy</h5>
                  <p className="text-gray-600 mb-2">ACCA + BBS (Ongoing)</p>
                  <div className="flex items-center text-blue-600">
                    <i className="fa-solid fa-calendar-alt mr-2"></i>
                    <span className="text-sm">Current</span>
                  </div>
                </div>
                
                <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                  <h5 className="font-bold text-gray-800 mb-1">St. Xavier's College</h5>
                  <p className="text-gray-600 mb-2">Cambridge A Levels</p>
                  <div className="flex items-center text-blue-600">
                    <i className="fa-solid fa-calendar-alt mr-2"></i>
                    <span className="text-sm">2023 - 2025</span>
                  </div>
                </div>
              </div>
            </div>
            

            
            <a 
              href="/resume.pdf" 
              target="_blank"
              className="inline-flex items-center bg-blue-700 hover:bg-blue-800 text-white font-medium py-3 px-6 rounded-md transition-colors duration-300 shadow-md"
            >
              <i className="fa-solid fa-download mr-2"></i>
              Download CV
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;