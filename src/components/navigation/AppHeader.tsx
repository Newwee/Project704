'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Logo } from '../common/Logo';
import {
  Bell,
  Moon,
  Sun,
  Flame,
  Users,
  ChevronDown,
} from 'lucide-react';
import { NotificationsPopover } from '../common/NotificationsPopover';
import { AgeGateModal } from '../safety/AgeGateModal';
import { UserPlus, LogOut } from 'lucide-react';

interface AppHeaderProps {
  onNavigateToTab: (tab: string) => void;
  onOpenRegister?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ onNavigateToTab, onOpenRegister }) => {
  const {
    currentUser,
    allProfiles,
    mode,
    isDarkMode,
    toggleDarkMode,
    unreadNotificationsCount,
    loginAs,
    logout,
  } = useApp();

  const [notifOpen, setNotifOpen] = useState(false);
  const [ageGateOpen, setAgeGateOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/85 dark:bg-[#161520]/85 backdrop-blur-md border-b border-[#F2E3E6] dark:border-[#2C2B3C] px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="cursor-pointer" onClick={() => onNavigateToTab('discover')}>
            <Logo size="sm" />
          </div>

          {/* Right Action Icons & Badges */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mode Switcher Button */}
            <button
              onClick={() => setAgeGateOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#201F2C] hover:border-[#FF526B] transition shadow-xs text-xs font-bold"
            >
              {mode === 'CAMPUS_FRIENDS' ? (
                <>
                  <Users className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="hidden sm:inline text-emerald-700 dark:text-emerald-400">
                    Campus Friends
                  </span>
                </>
              ) : (
                <>
                  <Flame className="w-3.5 h-3.5 text-[#FF526B]" />
                  <span className="hidden sm:inline text-rose-600 dark:text-rose-400">
                    Adult Dating 18+
                  </span>
                </>
              )}
              <span className="w-2 h-2 rounded-full bg-emerald-500 ml-0.5" />
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              title="Toggle Dark Mode"
              className="p-2 rounded-full text-[#8A8994] hover:bg-gray-100 dark:hover:bg-[#242332] transition"
            >
              {isDarkMode ? (
                <Moon className="w-4 h-4 text-purple-400" />
              ) : (
                <Sun className="w-4 h-4 text-amber-500" />
              )}
            </button>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 rounded-full text-[#8A8994] hover:bg-gray-100 dark:hover:bg-[#242332] transition"
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-gradient-brand border-2 border-white dark:border-[#161520]" />
                )}
              </button>

              <NotificationsPopover
                isOpen={notifOpen}
                onClose={() => setNotifOpen(false)}
                onNavigateToTab={onNavigateToTab}
              />
            </div>

            {/* Quick Role Switcher (Student vs Admin) */}
            {currentUser && (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 p-1 sm:px-2 rounded-full border border-gray-200 dark:border-gray-800 hover:border-[#FF526B] transition bg-gray-50 dark:bg-[#201F2C]"
                >
                  <img
                    src={currentUser.avatar_url || currentUser.photos[0]?.url}
                    alt={currentUser.display_name}
                    className="w-7 h-7 rounded-full object-cover shrink-0"
                  />
                  <span className="hidden sm:inline text-xs font-bold text-[#20202A] dark:text-[#F4F3F9] max-w-[80px] truncate">
                    {currentUser.display_name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#8A8994]" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 top-11 w-56 bg-white dark:bg-[#1E1D2A] rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-2 z-50 text-xs">
                    <span className="text-[10px] uppercase font-bold text-[#8A8994] px-2 py-1 block">
                      บัญชีบนอุปกรณ์นี้ ({allProfiles.length})
                    </span>

                    <div className="max-h-48 overflow-y-auto space-y-1">
                      {allProfiles.map((p) => {
                        const isCurrent = p.id === currentUser.id;
                        return (
                          <button
                            key={p.id}
                            onClick={() => {
                              loginAs(p);
                              setUserDropdownOpen(false);
                            }}
                            className={`w-full p-2 rounded-xl text-left flex items-center gap-2 transition ${
                              isCurrent
                                ? 'bg-[#FFEBF0] dark:bg-[#281822] text-[#FF526B] font-bold'
                                : 'hover:bg-gray-50 dark:hover:bg-[#282737]'
                            }`}
                          >
                            <img
                              src={p.avatar_url || p.photos[0]?.url}
                              alt={p.display_name}
                              className="w-6 h-6 rounded-full object-cover shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <span className="truncate block">{p.display_name}</span>
                              <span className="text-[10px] text-[#8A8994] truncate block">
                                {p.school_department}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <div className="pt-2 mt-1 border-t border-gray-100 dark:border-gray-800 space-y-1">
                      {onOpenRegister && (
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onOpenRegister();
                          }}
                          className="w-full p-2 rounded-xl text-left hover:bg-gray-50 dark:hover:bg-[#282737] flex items-center gap-2 font-semibold text-[#FF526B]"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>+ สร้างบัญชีอื่นในเครื่องนี้</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full p-2 rounded-xl text-left hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2 text-red-500 font-semibold"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>ออกจากระบบ</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Age & Safety Gate Modal */}
      <AgeGateModal isOpen={ageGateOpen} onClose={() => setAgeGateOpen(false)} />
    </>
  );
};
