import React, { useState, useEffect, RefObject } from 'react';
import { ArrowUp, Sparkles } from 'lucide-react';

interface ScrollToTopButtonProps {
  containerRef?: RefObject<HTMLElement | null>;
}

export const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({ containerRef }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const targetElement = containerRef?.current || window;

    const handleScroll = () => {
      if (containerRef?.current) {
        setIsVisible(containerRef.current.scrollTop > 200);
      } else {
        setIsVisible(window.scrollY > 200);
      }
    };

    if (containerRef?.current) {
      const el = containerRef.current;
      el.addEventListener('scroll', handleScroll);
      return () => el.removeEventListener('scroll', handleScroll);
    } else {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [containerRef]);

  const scrollToTop = () => {
    if (containerRef?.current) {
      containerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in group">
      <button
        onClick={scrollToTop}
        className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 via-blue-600 to-indigo-600 text-white shadow-xl shadow-sky-600/30 hover:shadow-2xl hover:shadow-sky-500/50 flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1 active:scale-95 border border-white/20 backdrop-blur-md"
        title="Trượt về đầu trang"
      >
        <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform font-bold" />
      </button>

      {/* Tooltip */}
      <span className="absolute bottom-14 right-0 px-3 py-1 rounded-lg bg-slate-900 text-white text-[11px] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-md border border-slate-700">
        Về đầu trang ⬆️
      </span>
    </div>
  );
};
