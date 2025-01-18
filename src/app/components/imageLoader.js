import { useEffect, useState } from 'react';
import Image from 'next/image';

const ImageLoader = () => {
  const [loading, setLoading] = useState(true);
  const [dots, setDots] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    const dotsInterval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);

    return () => {
      clearTimeout(timer);
      clearInterval(dotsInterval);
    };
  }, []);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 animate-fade-out">
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-white/20 rounded-full blur-xl animate-pulse-slow scale-150" />
        
        {/* Logo container */}
        <div className="relative w-40 h-40 mb-8 animate-combined">
          <Image
            src="/logo.svg"
            alt="Planet Vanguard Logo"
            fill
            className="object-contain drop-shadow-2xl"
            priority
          />
        </div>
      </div>

      <div className="space-y-4 text-center">
        <h2 className="text-3xl font-bold text-white tracking-wider animate-fade-in-up">
          Coming Soon{dots}
        </h2>
        <p className="text-emerald-100 animate-fade-in-up opacity-0" style={{ animationDelay: '0.5s' }}>
          Building a Sustainable Future
        </p>
      </div>
    </div>
  );
};

export default ImageLoader;