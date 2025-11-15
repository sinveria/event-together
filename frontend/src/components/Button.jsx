import React from 'react';

const Button = ({ children, variant = "primary", onClick, type = "button" }) => {
  const baseClasses = "px-4 py-2 rounded font-medium transition";
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white",
    outline: "border border-blue-600 text-blue-600 hover:bg-blue-50"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]}`}
    >
      {children}
    </button>
  );
};

export default Button;