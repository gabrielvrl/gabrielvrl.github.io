import React from "react";

interface TitleProps {
  id?: string;
  children: React.ReactNode;
}

export const Title = ({ id, children }: TitleProps) => {
  return (
    <h1 id={id} className="text-4xl leading-tight dark:text-white">
      {children}
    </h1>
  );
};
