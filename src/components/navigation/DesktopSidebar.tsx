'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import {
  Flame,
  Heart,
  MessageCircle,
  User,
  ShieldAlert,
  LogOut,
} from 'lucide-react';

interface DesktopSidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  currentTab,
  onSelectTab,
}) => {
  const { currentUser, likedByUsers, conversations, logout } = useApp();

  const unreadMessagesCount = conversations.reduce(
    (acc, curr) => acc + (curr.unread_count || 0),
    0
  );

  const navItems = [
    {
      id: 'discover',
      label: 'ค้นหา (Discover)',
      icon: <Flame className="w-5 h-5" />,
    },
    {
      id: 'likes',
      label: 'คนที่ชอบคุณ (Likes)',
      icon: <Heart className="w-5 h-5" />,
      badge: likedByUsers.length > 0 ? likedByUsers.length : undefined,
    },
    {
      id: 'chat',
      label: 'ข้อความ (Messages)',
      icon: <MessageCircle className="w-5 h-5" />,
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined,
    },
    {
      id: 'profile',
      label: 'โปรไฟล์ของฉัน (Profile)',
      icon: <User className="w-5 h-5" />,
    },
  ];

  if (currentUser?.is_admin) {
    navItems.push({
      id: 'admin',
      label: 'แผงผู้ดูแล (Admin Console)',
      icon: <ShieldAlert className="w-5 h-5 text-rose-500" />,
      badge: undefined,
    });
  }

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-[#F2E3E6] dark:border-[#2C2B3C] bg-white dark:bg-[#161520] p-4 shrink-0 justify-between select-none">
      <div className="space-y-6">
        {/* Navigation Items */}
        <nav className="space-y-1.5 pt-2">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition ${
                  isActive
                    ? 'bg-gradient-brand text-white shadow-brand'
                    : 'text-[#8A8994] dark:text-[#9795A7] hover:bg-gray-50 dark:hover:bg-[#201F2C] hover:text-[#20202A] dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      isActive
                        ? 'bg-white text-[#FF526B]'
                        : 'bg-gradient-brand text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Mini Card at Bottom */}
      {currentUser && (
        <div className="p-3 rounded-2xl bg-gray-50 dark:bg-[#1E1D2A] border border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div
            onClick={() => onSelectTab('profile')}
            className="flex items-center gap-2.5 cursor-pointer min-w-0"
          >
            <img
              src={currentUser.avatar_url || currentUser.photos[0]?.url}
              alt={currentUser.display_name}
              className="w-9 h-9 rounded-full object-cover shrink-0"
            />
            <div className="min-w-0">
              <span className="text-xs font-bold text-[#20202A] dark:text-[#F4F3F9] truncate block">
                {currentUser.display_name}
              </span>
              <span className="text-[10px] text-[#8A8994] truncate block">
                {currentUser.school_department}
              </span>
            </div>
          </div>

          <button
            onClick={logout}
            title="ออกจากระบบ"
            className="p-1.5 rounded-xl text-[#8A8994] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      )}
    </aside>
  );
};
