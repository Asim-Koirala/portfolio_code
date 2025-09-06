'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Use dynamic imports with loading priority
const Layout = dynamic(() => import('../../components/Layout'), { loading: () => <div className="min-h-screen"></div> });

export default function UtilitiesHome() {
  const router = useRouter();
  
  const utilities = [
    {
      id: 'license-exam',
      title: 'Nepal License Trial Exam',
      description: 'Prepare for your Nepali license trial written test with practice questions and mock exams',
      icon: 'fa-id-card',
      path: '/utilities/license-exam'
    },
    {
      id: 'adbs',
      title: 'AD to BS Converter',
      description: 'Convert Gregorian dates (AD) to Nepali calendar dates (BS)',
      icon: 'fa-calendar-alt',
      path: '/utilities/adbs-converter'
    },
    {
      id: 'unicode',
      title: 'Nepali Unicode ↔ Preeti Converter',
      description: 'Convert between Nepali Unicode and Preeti font text',
      icon: 'fa-language',
      path: '/utilities/unicode-converter',
      comingSoon: true
    },
    {
      id: 'romanized',
      title: 'Romanized Nepali to Unicode',
      description: 'Type in Roman and get Nepali Unicode text (e.g., "mero naam" → "मेरो नाम")',
      icon: 'fa-keyboard',
      path: '/utilities/romanized-converter',
      comingSoon: true
    }
  ];

  return (
    <Layout>
      <div className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-700 mb-2">Nepali Utilities</h1>
        <p className="text-gray-600 mb-8">Useful tools for Nepali language and date conversion</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {utilities.map((utility) => (
            <div 
              key={utility.id}
              className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden ${utility.comingSoon ? 'opacity-70' : 'cursor-pointer'}`}
              onClick={() => !utility.comingSoon && router.push(utility.path)}
            >
              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <i className={`fas ${utility.icon} text-blue-700 text-xl`}></i>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {utility.title}
                  {utility.comingSoon && (
                    <span className="ml-2 text-xs font-medium bg-yellow-100 text-yellow-800 py-1 px-2 rounded">Coming Soon</span>
                  )}
                </h2>
                <p className="text-gray-600">{utility.description}</p>
                
                {!utility.comingSoon && (
                  <Link href={utility.path} className="inline-block mt-4 text-blue-700 hover:text-blue-800 font-medium">
                    Use Tool <i className="fas fa-arrow-right ml-1"></i>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link href="/" className="text-blue-700 hover:text-blue-800 font-medium">
            <i className="fas fa-arrow-left mr-2"></i> Back to Portfolio
          </Link>
        </div>
      </div>
    </Layout>
  );
}