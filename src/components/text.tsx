import React from "react";

interface TextProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
}

export const Text = ({ id, children, className = "" }: TextProps) => {
  return (
    <span
      id={id}
      className={`text-xl leading-tight dark:text-white ${className}`}
    >
      {children}
    </span>
  );
};
