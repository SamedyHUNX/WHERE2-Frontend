import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import DefaultCard from './DefaultCard';

const CardSlider = ({ cards = [], header , ads }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const containerRef = useRef(null);

  const isMobile = window.innerWidth < 768;
  const initialIndex = 3;

  const clonedCards = cards.length > 0 ? [
    ...cards.slice(-3),
    ...cards,
    ...cards.slice(0, 3),
  ] : [];

  const totalCards = clonedCards.length;
  

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  const nextSlide = () => {
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  const prevSlide = () => {
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => prevIndex - 1);
  };

  useEffect(() => {
    const autoSlide = setInterval(() => {
      nextSlide();
    }, 3000);
    return () => clearInterval(autoSlide);
  }, []);

  useEffect(() => {
    if (currentIndex === totalCards - 3) {
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(initialIndex);
      }, 300);
    } else if (currentIndex === 0) {
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(totalCards - 6);
      }, 300);
    }
  }, [currentIndex, totalCards, initialIndex]);

  return (
    <div className="relative lg:h-fit sm:h-fit w-full mx-auto my-[16px] max-w-[1440px]">
      <div className="text-[#367588] text-2xl md:text-base">
        <h1>{header}</h1>
      </div>
      <div className="overflow-hidden w-full h-fit my-[32px]">
        <div
          ref={containerRef}
          className={`flex transition-transform duration-300 ease-in-out ${
            !isTransitioning && 'transition-none'
          }`}
          style={{
            transform: `translateX(-${currentIndex * (isMobile ? 100 : 33.33)}%)`,
          }}
        >
          {clonedCards.length > 0 ? (
            clonedCards.map((card, index) => (
              <div
                key={index}
                className={`flex-shrink-0 p-2 ${isMobile ? 'w-full' : 'w-1/3'}`}
              >
                <DefaultCard card={card} />
              </div>
            ))
          ) : (
            <div>No cards available</div>
          )}
        </div>
      </div>
      {ads ? (null) : (
      <div className="absolute bottom-[-10px] right-4 flex space-x-2">
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
      )}
    </div>
  );
};

export default CardSlider;
