import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CardFeatureSlider = ({ cardFeature }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % cardFeature.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + cardFeature.length) % cardFeature.length);
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto my-[32px]">
      <div className="overflow-hidden w-full shadow-4xl sm:py-5">
        <div ref={containerRef} className="flex transition-transform duration-300 ease-in-out">
          {cardFeature.map((card, index) => (
            <div key={index} className={`flex-shrink-0 ${isMobile ? 'w-full' : 'w-1/3'}`}>
              <DefaultCardToptitle card={card} />
            </div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-0 right-4 flex space-x-2">
        <button onClick={prevSlide} className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button onClick={nextSlide} className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors">
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default CardFeatureSlider;
