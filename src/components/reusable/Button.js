import React from "react";

const ButtonComponent = ({
  children,
  variant = "primary",
  size = "medium",
  width = "auto",
  height = "auto",
  fullWidth = false,
  disabled = false,
  rounded = true,
  onClick,
  className,
}) => {
  const baseStyles =
    `font-semibold ${rounded ? "rounded-full" : ""} focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200`;

  const variants = {
    primary: "bg-sky-400 text-white hover:bg-sky-300 focus:ring-sky-500",
    secondary:
      "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500",
    outline:
      "bg-transparent text-gray-800 border border-gray-300 hover:bg-gray-100 focus:ring-gray-500",
    ghost: "bg-transparent text-gray-800 hover:bg-gray-100 focus:ring-gray-500",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500",
    success: "bg-green-500 text-white hover:bg-green-600 focus:ring-green-500",
  };

  const sizes = {
    small: "px-3 py-1 text-sm",
    medium: "px-4 py-2",
    large: "px-6 py-3 text-lg",
  };

  const widthStyle = fullWidth
    ? "w-full"
    : width === "auto"
    ? ""
    : `w-[${width}]`;

  const heightStyle = height === "auto" ? "" : `h-[${height}]`;
  const disabledClass = disabled ? "opacity-50 cursor-not-allowed" : "";

  const buttonClasses = `
    ${baseStyles}
    ${variants[variant]}
    ${sizes[size]}
    ${heightStyle}
    ${widthStyle}
    ${disabledClass}
    ${className}
  `.trim();

  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      style={width !== "auto" && !fullWidth ? { width } : {}}
    >
      {children}
    </button>
  );
};

export default ButtonComponent;