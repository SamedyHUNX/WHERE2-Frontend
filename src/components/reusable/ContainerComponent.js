import React from 'react';
import WrapperComponent from './WrapperComponent';

const ContainerComponent = ({ children, title, className = "" }) => {
  return (
    <div className="flex justify-center items-center font-poppins mt-[192px] mb-[64px] relative sm:px-1">
      <div className={`flex flex-col justify-evenly w-[50%] sm:w-[95%] min-h-[63vh] sm:h-auto mx-auto p-6 bg-white rounded-3xl border-2 shadow-xl ${className}`}>
        {title && (
          <div className="w-full mb-6">
            <h2 className="text-2xl font-bold text-center text-gray-800">{title}</h2>
            <div className="w-1/4 h-0.5 bg-slate-500 mx-auto mt-4"></div>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default ContainerComponent;