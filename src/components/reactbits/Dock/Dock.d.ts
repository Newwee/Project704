import React from 'react';

export interface DockMenuItem {
  label?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  checked?: boolean;
  disabled?: boolean;
  shortcut?: string;
  separator?: boolean;
  items?: DockMenuItem[];
}

export interface DockItemData {
  icon: React.ReactNode;
  label?: string;
  onClick?: () => void;
  active?: boolean;
  badge?: number | string | boolean;
  className?: string;
  menu?: DockMenuItem[];
  separator?: boolean;
}

export interface DockProps {
  items?: DockItemData[];
  position?: 'bottom' | 'top' | 'left' | 'right';
  theme?: 'dark' | 'light';
  baseItemSize?: number;
  magnification?: number;
  distance?: number;
  panelHeight?: number;
  gap?: number;
  roundness?: number;
  spring?: { mass?: number; stiffness?: number; damping?: number };
  bounce?: boolean;
  autoHide?: boolean;
  tiles?: boolean;
  showLabels?: boolean;
  showIndicators?: boolean;
  showBadges?: boolean;
  badgeColor?: string;
  accentColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

declare const Dock: React.FC<DockProps>;
export default Dock;
