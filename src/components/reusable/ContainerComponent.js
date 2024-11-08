import React from "react";

const ContainerComponent = ({
  children,
  auth = false,
  title,
  width = "",
  className = "",
}) => {
  return (
    <div
      className={`flex justify-center items-center font-poppins ${
        auth ? "pt-[64px]" : "pt-[100px]"
      } pb-[64px] relative sm:px-1 ${width}`}
      style={
        auth
          ? {
              background:
                "linear-gradient(to right, rgba(224, 245, 255, 0.5), rgba(156, 222, 255, 0.5))",
            }
          : {}
      }
    >
      <div
        className={`flex flex-col justify-evenly ${
          width ? "w-full mx-0" : "w-[50%] mx-auto"
        } sm:w-[95%] min-h-[63vh] sm:h-auto p-6 bg-white rounded-3xl border-2 shadow-xl ${className}`}
      >
        {title && (
          <div className="w-full mb-6">
            <h2 className="text-3xl font-bold text-center text-gray-800 tracking-tight">
              {title}
            </h2>
            <div className="w-1/4 h-0.5 bg-slate-500 mx-auto mt-4"></div>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default ContainerComponent;
