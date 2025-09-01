const Skills: React.FC = () => {
  const skillCategories = [
    {
      name: 'Frontend',
      icon: 'fa-solid fa-code',
      skills: ['React', 'Next.js', 'React Native (Expo)']
    },
    {
      name: 'Backend',
      icon: 'fa-solid fa-server',
      skills: ['Node.js', 'Express', 'MongoDB']
    },
    {
      name: 'Automation & Tools',
      icon: 'fa-solid fa-robot',
      skills: ['Voiceflow', 'Zapier', 'Make.com']
    },
    {
      name: 'Languages',
      icon: 'fa-solid fa-code-branch',
      skills: ['JavaScript', 'Python']
    },
    {
      name: 'Other',
      icon: 'fa-solid fa-toolbox',
      skills: ['Git', 'APIs', 'Firebase']
    }
  ];

  const professionalSkills = [
    { name: 'Communication', percentage: 85 },
    { name: 'Teamwork', percentage: 90 },
    { name: 'Creativity', percentage: 95 },
    { name: 'Problem Solving', percentage: 80 }
  ];

  return (
    <div id="Skills" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-16">
          <h2 className="text-blue-700 text-lg font-medium mb-2">MY SKILLS</h2>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">What I Know</h1>
          <div className="w-24 h-1 bg-blue-600 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 gap-16">
          {/* Technical Skills */}
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <i className="fa-solid fa-code text-blue-600"></i>
              </div>
              Technical Skills
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {skillCategories.map((category, categoryIndex) => (
                <div key={categoryIndex} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <i className={`${category.icon} text-blue-600`}></i>
                    </div>
                    <h4 className="font-bold text-gray-800">{category.name}</h4>
                  </div>
                  <div className="space-y-3">
                    {category.skills.map((skill, skillIndex) => (
                      <div key={skillIndex} className="flex items-center">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                        <span className="text-gray-700">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Professional Skills */}
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <i className="fa-solid fa-briefcase text-blue-600"></i>
              </div>
              Professional Skills
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {professionalSkills.map((skill, index) => (
                <div key={index} className="relative">
                  <div className="w-36 h-36 mx-auto">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      {/* Background circle */}
                      <circle 
                        cx="50" cy="50" r="45" 
                        fill="none" 
                        stroke="#e5e7eb" 
                        strokeWidth="8"
                      />
                      {/* Progress circle */}
                      <circle 
                        cx="50" cy="50" r="45" 
                        fill="none" 
                        stroke="#2563eb" 
                        strokeWidth="8"
                        strokeDasharray={`${2 * Math.PI * 45 * skill.percentage / 100} ${2 * Math.PI * 45 * (100 - skill.percentage) / 100}`}
                        strokeDashoffset="0"
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-3xl font-bold text-blue-700">{skill.percentage}%</span>
                    </div>
                  </div>
                  <h4 className="text-center font-medium text-gray-800 mt-4">{skill.name}</h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Skills;