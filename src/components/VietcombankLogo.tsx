import React from 'react';

interface VietcombankLogoProps {
  className?: string;
  variant?: 'green' | 'white'; // green for light background, white for dark background
  showTagline?: boolean;
  height?: number;
}

export const VietcombankLogo: React.FC<VietcombankLogoProps> = ({
  className = '',
  height = 36,
}) => {
  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <img
        src="/logoVCB_xanh.png"
        alt="Vietcombank - Chung niềm tin, vững tương lai"
        style={{ height: `${height}px`, width: 'auto' }}
        className="object-contain"
        referrerPolicy="no-referrer"
      />
    </div>
  );
};

