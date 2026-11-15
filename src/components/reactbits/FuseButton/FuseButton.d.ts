import React from 'react';

export interface FuseButtonProps {
  label?: string;
  undoLabel?: string;
  doneLabel?: string;
  icon?: React.ReactNode;
  color?: string;
  background?: string;
  fuseColor?: string;
  size?: 'sm' | 'md' | 'lg';
  radius?: number;
  undoWindow?: number;
  fuse?: 'outline' | 'bottom' | 'top';
  fuseThickness?: number;
  crossfadeMs?: number;
  commitOn?: 'press' | 'fuseEnd';
  pauseOnHover?: boolean;
  settle?: 'reset' | 'stay';
  disabled?: boolean;
  onCommit?: (reason: 'press' | 'fuseEnd') => void;
  onUndo?: () => void;
  onFuseEnd?: () => void;
  onPhaseChange?: (phase: string) => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  style?: React.CSSProperties;
}

declare const FuseButton: React.FC<FuseButtonProps>;
export default FuseButton;
