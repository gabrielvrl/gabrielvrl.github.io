import React from "react";

interface TitleProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
}

export const Title = ({ id, children, className = "" }: TitleProps) => {
  return (
    <h1
      id={id}
      className={`text-4xl leading-tight dark:text-white ${className}`}
    >
      {children}
    </h1>
  );
};
