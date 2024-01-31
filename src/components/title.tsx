import React from 'react';

interface TitleProps {
  id?: string;
  children: React.ReactNode;
}

export const Title = ({ id, children}: TitleProps) => {
  return (
    <h1 id={id} className="text-5xl leading-tight mb-4 dark:text-white">{children}</h1>
  );
}