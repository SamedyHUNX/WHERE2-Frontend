import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import DefaultCardToptitle from './DefaultCardTopTiltle';

const CardFeatureSlider = ({ cardFeature, header  }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const containerRef = useRef(null);
  
  const totalCards = cardFeature.length;

  // Update `isMobile` based on window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // Reset index when moving to desktop view
      if (!mobile) {
        setCurrentIndex(0); // Reset to the first index when switching to desktop
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup on unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = useCallback(() => {
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalCards);
  }, [totalCards]);

  const prevSlide = () => {
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalCards) % totalCards);
  };

  // Set up auto slide only for mobile devices
  useEffect(() => {
    if (!isMobile) return; // Exit if not on mobile

    const autoSlide = setInterval(nextSlide, 3000);

    return () => clearInterval(autoSlide); // Cleanup interval
  }, [nextSlide, isMobile]);

  return (
    <div className="relative w-full max-w-6xl mx-auto my-[32px]">
      <div className="overflow-hidden w-full shadow-4xl sm:py-5">
        <div className="text-h1p pl-2 font-black text-[#13188C]">
          {header}
          {/* {header.length > 0 ? (
            header.map((item, index) => <b key={index}>{item.suggested}</b>)
          ) : (
            <b>No header available</b>
          )} */}
        </div>
        <div
          ref={containerRef}
          className={`flex transition-transform duration-300 ease-in-out sm:px-6 ${
            !isTransitioning && 'transition-none'
          }`}
          style={{
            transform: `translateX(-${currentIndex * (isMobile ? 100 : 23.33)}%)`,
          }}
        >
          {cardFeature.length > 0 ? (
            cardFeature.map((card, index) => (
              <div
                key={index}
                className={`flex-shrink-0 p-2 sm:py-2 sm:px-3 shadow-6xl ${isMobile ? 'w-full' : 'w-1/3'}`}
              >
                <DefaultCardToptitle card={card} />
              </div>
            ))
          ) : (
            <div>No featured cards available</div>
          )}
        </div>
      </div>
      <div className="absolute bottom-0 right-4 flex space-x-2">
        <button
          onClick={prevSlide}
          className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default CardFeatureSlider;
