'use client';

import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// Use dynamic imports with loading priority
const Layout = dynamic(() => import('./Layout'), { loading: () => <div className="min-h-screen"></div> });

interface UtilityLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  backLink?: string;
  backText?: string;
  onBack?: () => void;
}

const UtilityLayout: React.FC<UtilityLayoutProps> = ({
  children,
  title,
  description,
  backLink = '/utilities',
  onBack
}) => {
  const router = useRouter();
  return (
    <Layout>
      <div className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex items-center mb-8">
          <button 
            onClick={onBack ? onBack : () => router.push(backLink)} 
            className="text-blue-700 hover:text-blue-800 mr-4 flex items-center bg-transparent border-none cursor-pointer p-0 text-xl transition-all duration-300 hover:scale-110"
            aria-label="Back to utilities"
          >
            <span>←</span>
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-blue-700">{title}</h1>
        </div>
        
        {description && (
          <p className="text-gray-600 mb-8">{description}</p>
        )}
        
        {children}
        
        <div className="mt-12 text-center">
          <button 
            onClick={onBack ? onBack : () => router.push(backLink)} 
            className="text-blue-700 hover:text-blue-800 font-medium flex items-center justify-center mx-auto bg-transparent border-none cursor-pointer p-0 text-xl transition-all duration-300 hover:scale-110"
            aria-label="Back to utilities"
          >
            <span>←</span>
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default UtilityLayout;