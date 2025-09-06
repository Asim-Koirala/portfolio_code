'use client';

import dynamic from 'next/dynamic';

// Use dynamic imports with loading priority
const UtilityLayout = dynamic(() => import('../../../components/UtilityLayout'), { loading: () => <div className="min-h-screen"></div> });

export default function RomanizedConverter() {
  return (
    <UtilityLayout 
      title="Romanized Nepali to Unicode"
      description="Type in Roman and get Nepali Unicode text (e.g., 'mero naam' → 'मेरो नाम')."
    >
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Coming Soon!</h2>
              <p className="text-gray-600 mb-4">
                This utility is currently under development and will be available soon. 
                Check back later for the Romanized Nepali to Unicode typing tool.
              </p>
              <p className="text-gray-600">
                This tool will allow you to type in Roman characters and automatically convert them to Nepali Unicode text.
                For example, typing &quot;mero naam Asim ho&quot; will produce &quot;मेरो नाम आसिम हो&quot;.
              </p>
            </div>
          </div>
        </div>
      </div>
    </UtilityLayout>
  );
}