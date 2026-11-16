import React from 'react';
import GradientText from '@/components/reactbits/GradientText/GradientText';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
}) => {
  const sizeMap = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const textSizeMap = {
    sm: 'text-base font-bold',
    md: 'text-xl font-extrabold tracking-tight',
    lg: 'text-2xl font-black tracking-tight',
    xl: 'text-3xl font-black tracking-tight',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Brand Icon SVG */}
      <div className={`${sizeMap[size]} relative flex items-center justify-center shrink-0`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm" fill="none">
          <defs>
            <linearGradient id="brand-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF416C" />
              <stop offset="60%" stopColor="#FF526B" />
              <stop offset="100%" stopColor="#FF7A85" />
            </linearGradient>
            <linearGradient id="sheen" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>
          </defs>
          <rect width="100" height="100" rx="26" fill="url(#brand-grad)" />
          <rect width="100" height="100" rx="26" fill="url(#sheen)" />
          
          {/* Intersecting Romantic Flame & Heart Emblem */}
          <path
            d="M50 78 C26 60 15 46 15 30 C15 17 25 7 38 7 C45 7 51 10.5 55 16.5 C59 10.5 65 7 72 7 C85 7 95 17 95 30 C95 46 84 60 60 78 L50 85 Z"
            transform="scale(0.7) translate(21, 15)"
            fill="#FFFFFF"
          />
          <circle cx="50" cy="46" r="6" fill="#FF526B" />
          <circle cx="50" cy="46" r="3" fill="#FFFFFF" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <GradientText
            colors={['#FF416C', '#FF526B', '#FF7A85', '#FFA07A', '#FF416C']}
            animationSpeed={6}
            variant="flow"
            className={`${textSizeMap[size]} font-black`}
          >
            Spark
          </GradientText>
          <span className="text-[10px] font-semibold text-[#8A8994] dark:text-[#9795A7] tracking-wider mt-0.5 uppercase">
            Meet. Match. Connect.
          </span>
        </div>
      )}
    </div>
  );
};
