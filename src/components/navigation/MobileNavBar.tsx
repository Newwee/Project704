'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Flame, Heart, MessageCircle, User } from 'lucide-react';

interface MobileNavBarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const MobileNavBar: React.FC<MobileNavBarProps> = ({
  currentTab,
  onSelectTab,
}) => {
  const { likedByUsers, conversations } = useApp();

  const unreadMessagesCount = conversations.reduce(
    (acc, curr) => acc + (curr.unread_count || 0),
    0
  );

  const navItems = [
    {
      id: 'discover',
      label: 'Discover',
      icon: <Flame className="w-5 h-5" />,
    },
    {
      id: 'likes',
      label: 'Likes',
      icon: <Heart className="w-5 h-5" />,
      badge: likedByUsers.length > 0 ? likedByUsers.length : undefined,
    },
    {
      id: 'chat',
      label: 'Chat',
      icon: <MessageCircle className="w-5 h-5" />,
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined,
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: <User className="w-5 h-5" />,
    },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-[#161520]/95 backdrop-blur-md border-t border-[#F2E3E6] dark:border-[#2C2B3C] px-2 py-2 safe-bottom shadow-lg select-none">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`relative flex flex-col items-center justify-center p-2 rounded-2xl transition duration-150 ${
                isActive
                  ? 'text-[#FF526B]'
                  : 'text-[#8A8994] dark:text-[#9795A7] hover:text-[#20202A] dark:hover:text-white'
              }`}
            >
              <div className="relative">
                {item.icon}
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2.5 px-1.5 py-0.2 rounded-full bg-gradient-brand text-white text-[9px] font-bold border-2 border-white dark:border-[#161520]">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-1 font-semibold ${isActive ? 'font-black' : ''}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF526B] mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
