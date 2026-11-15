import React from 'react';

export interface PulseHeartProps {
  liked?: boolean;
  defaultLiked?: boolean;
  count?: number;
  onChange?: (nextLiked: boolean) => void;
  showCount?: boolean;
  icon?: 'heart' | 'star' | 'thumb';
  idleOutline?: boolean;
  size?: number;
  corner?: number;
  likedColor?: string;
  idleColor?: string;
  pillColor?: string;
  textColor?: string;
  duration?: number;
  dotSize?: number;
  overshoot?: number;
  beat?: number;
  rollDuration?: number;
  disabled?: boolean;
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}

declare const PulseHeart: React.FC<PulseHeartProps>;
export default PulseHeart;
