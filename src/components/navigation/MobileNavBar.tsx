'use client';

import React, { useEffect, useState } from 'react';
import { useApp } from '@/context/AppContext';
import Dock, { DockItemData } from '@/components/reactbits/Dock/Dock';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  FireIcon,
  FavouriteIcon,
  BubbleChatIcon,
  UserIcon,
} from '@hugeicons/core-free-icons';

interface MobileNavBarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

const glyph = (icon: React.ComponentProps<typeof HugeiconsIcon>['icon']) => (
  <HugeiconsIcon icon={icon} size="1.4em" strokeWidth={1.8} />
);

export const MobileNavBar: React.FC<MobileNavBarProps> = ({
  currentTab,
  onSelectTab,
}) => {
  const { likedByUsers, conversations, logout } = useApp();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkDark();

    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  const unreadMessagesCount = conversations.reduce(
    (acc, curr) => acc + (curr.unread_count || 0),
    0
  );

  const items: DockItemData[] = [
    {
      icon: glyph(FireIcon),
      label: 'Discover',
      active: currentTab === 'discover',
      onClick: () => onSelectTab('discover'),
      menu: [
        { label: 'Explore Matches', onClick: () => onSelectTab('discover') },
      ],
    },
    {
      icon: glyph(FavouriteIcon),
      label: 'Likes',
      active: currentTab === 'likes',
      badge: likedByUsers.length > 0 ? likedByUsers.length : undefined,
      onClick: () => onSelectTab('likes'),
      menu: [
        { label: 'Who Liked You', onClick: () => onSelectTab('likes') },
      ],
    },
    {
      icon: glyph(BubbleChatIcon),
      label: 'Messages',
      active: currentTab === 'chat',
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined,
      onClick: () => onSelectTab('chat'),
      menu: [
        { label: 'All Conversations', onClick: () => onSelectTab('chat') },
      ],
    },
    {
      icon: glyph(UserIcon),
      label: 'Profile',
      active: currentTab === 'profile',
      onClick: () => onSelectTab('profile'),
      menu: [
        { label: 'Edit Profile', onClick: () => onSelectTab('profile') },
        { separator: true },
        { label: 'Log Out', onClick: () => logout() },
      ],
    },
  ];

  return (
    <div className="fixed bottom-3 inset-x-0 z-40 flex justify-center pointer-events-none select-none px-4">
      <div className="relative pointer-events-auto">
        <Dock
          items={items}
          theme={isDark ? 'dark' : 'light'}
          baseItemSize={48}
          magnification={66}
          panelHeight={66}
          roundness={0.7}
          gap={10}
          badgeColor="#FF526B"
          accentColor="#FF526B"
          className="shadow-2xl border border-white/40 dark:border-white/10"
        />
      </div>
    </div>
  );
};
