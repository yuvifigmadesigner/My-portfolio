import React from 'react';

interface BackgroundProps {
  isMobile?: boolean;
}

const Background: React.FC<BackgroundProps> = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none bg-[#120F17]" />
  );
};

export default Background;