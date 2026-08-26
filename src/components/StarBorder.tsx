import React from 'react';

type StarBorderProps<T extends React.ElementType> = React.ComponentPropsWithoutRef<T> & {
  as?: T;
  className?: string;
  color?: string;
  speed?: React.CSSProperties['animationDuration'];
  children?: React.ReactNode;
};

const StarBorder = <T extends React.ElementType = 'div'>({
  as,
  className = '',
  color = 'white',
  speed = '6s',
  children,
  ...rest
}: StarBorderProps<T>) => {
  const Component = as || 'div';

  return (
    <Component
      className={`relative inline-block overflow-hidden rounded-[25px] ${className}`}
      {...(rest as any)}
    >
      <div
        className="absolute w-[300%] h-[50%] opacity-70 bottom-[-11px] right-[-250%] rounded-full animate-star-movement-bottom z-0"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed
        }}
      ></div>
      <div
        className="absolute w-[300%] h-[50%] opacity-70 top-[-10px] left-[-250%] rounded-full animate-star-movement-top z-0"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed
        }}
      ></div>
      <div className="relative z-10 bg-[#1a1512]/80 backdrop-blur-md border border-white/5 rounded-[20px] h-full w-full hover:bg-[#2a2420]/80 transition-all duration-300">
        {children}
      </div>
    </Component>
  );
};

export default StarBorder;