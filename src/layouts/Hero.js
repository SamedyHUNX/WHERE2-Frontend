import React from 'react';
import { Link } from 'react-router-dom';
import TypewriterEffect from './../styles/TypeWriterEffect';

const HeroSkeleton = () => {
  return (
    <div className="animate-pulse w-full lg:h-[90vh] sm:h-[500px] relative">
      <div className="w-full h-full bg-white text-center flex justify-center">
        <div className="absolute w-full z-10 mx-auto top-[7%] max-w-[660px] px-4">
          {/* Title skeleton */}
        <div className="h-14 bg-gray-200 rounded-lg mx-auto w-3/4 mb-4" />
        
        {/* Subtitle skeleton */}
        <div className="h-8 bg-gray-200 rounded-lg mx-auto w-2/3 mb-8" />
        {/* Subtitle skeleton */}
        <div className="h-8 bg-gray-200 rounded-lg mx-auto w-2/3 mb-8" />
        
        {/* Button skeleton */}
        <div className="h-10 bg-gray-200 rounded-full mx-auto w-32" />
        </div>
          {/* Button skeleton */}
        <div className="h-10 bg-gray-200 rounded-full mx-auto w-32" />
        </div>
        
        {/* Image skeleton */}
        <div className="mt-image-container-top-margin flex justify-center w-full h-full">
          <div className="w-2/3 h-2/3 bg-gray-200 rounded-lg object-contain" />
        </div>
      </div>
  );
};

const Hero = ({ props, children, isLoading }) => {
  const {
    button,
    title,
    subtitle,
    backgroundGradient,
    titleColor,
    subtitleColor,
    mainImageSrc,
    mainImageAlt,
  } = { ...props };

  const styles = {
    section: "relative w-full lg:h-[90vh] sm:h-[500px] z-[0] gap-10 mb-[16px]",
    container: "w-full h-full bg-white text-center flex justify-center text-tighter",
    gradientOverlay: "inset-0 bg-gradient-to-b opacity-50",
    gradientClipPath: { clipPath: "polygon(0 0, 100% 0, 100% 70%, 0 100%)" },
    title: "text-h1 tracking-tight font-black lg:text-[56px] sm:text-[38px]",
    subtitle: "text-h2 tracking-tight mb-8 text-[28px]",
    contentWrapper: "absolute w-full z-10 mx-auto top-[7%] mt-section-top-margin max-w-[660px] px-4",
    imageContainer: `mt-image-container-top-margin flex justify-center w-full h-full hover:scale-110`,
    image: "object-contain",
    button: "border rounded-[100px] bg-[#A9EBFF] w-fit px-[18px] py-[5px] text-[#375761] drop-shadow-lg ",
    form: "relative mx-[20px]",
    input: "w-full py-3 px-4 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white bg-opacity-80",
    input: "w-full py-3 px-4 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white bg-opacity-80",
    searchButton: "absolute right-3 top-1/2 transform -translate-y-1/2",
    searchIcon: "h-5 w-5 text-gray-400 z-[0]",
  };

  if (isLoading) {
    return <HeroSkeleton />;
  }

  return (
    <section className={`${styles.section} ${backgroundGradient}`}>
      <div className={styles.container}>
        <div
          className={`${styles.gradientOverlay} `}
          style={styles.gradientClipPath}
        />
        <div className={styles.contentWrapper}>
          <h1 className={`${styles.title} ${titleColor}`}>
            <TypewriterEffect text={title}/>
          </h1>
          <p className={`${styles.subtitle} ${subtitleColor}`}>{subtitle}</p>

          {button && (
            <Link to="/list/job">
              <button className={`${styles.button}`}>{button}</button>
            </Link>
          )}
          {children}
        </div>
        <div className={styles.imageContainer}>
          <img
            src={mainImageSrc}
            alt={mainImageAlt}
            className={styles.image}
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;