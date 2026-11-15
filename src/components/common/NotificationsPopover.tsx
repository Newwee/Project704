import React from 'react';
import { useApp } from '@/context/AppContext';
import { Bell, Heart, Sparkles, MessageCircle, ShieldCheck, X } from 'lucide-react';

interface NotificationsPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab: (tab: string) => void;
}

export const NotificationsPopover: React.FC<NotificationsPopoverProps> = ({
  isOpen,
  onClose,
  onNavigateToTab,
}) => {
  const { notifications, markNotificationsRead } = useApp();

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="w-4 h-4 text-[#FF526B] fill-[#FF526B]" />;
      case 'match':
        return <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />;
      case 'message':
        return <MessageCircle className="w-4 h-4 text-blue-500" />;
      default:
        return <ShieldCheck className="w-4 h-4 text-emerald-500" />;
    }
  };

  return (
    <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white dark:bg-[#1E1D2A] rounded-2xl shadow-2xl border border-[#F2E3E6] dark:border-[#2C2B3C] p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
      <div className="flex items-center justify-between pb-3 border-b border-[#F2E3E6] dark:border-[#2C2B3C]">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#FF526B]" />
          <h3 className="font-bold text-sm text-[#20202A] dark:text-[#F4F3F9]">Notifications</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={markNotificationsRead}
            className="text-xs text-[#FF526B] hover:underline font-medium"
          >
            Mark all read
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#8A8994] hover:bg-gray-100 dark:hover:bg-[#2A2938]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto divide-y divide-gray-100 dark:divide-[#2C2B3C] py-1">
        {notifications.length === 0 ? (
          <div className="py-8 text-center text-[#8A8994] text-xs">
            No notifications yet
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                if (n.type === 'match' || n.type === 'message') {
                  onNavigateToTab('chat');
                } else if (n.type === 'like') {
                  onNavigateToTab('likes');
                }
                onClose();
              }}
              className={`p-3 flex items-start gap-3 cursor-pointer rounded-xl transition hover:bg-[#FFF5F7] dark:hover:bg-[#282737] ${
                !n.is_read ? 'bg-[#FFF9FA] dark:bg-[#242332]' : ''
              }`}
            >
              <div className="p-2 rounded-xl bg-white dark:bg-[#191822] shadow-sm shrink-0">
                {getIcon(n.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#20202A] dark:text-[#F4F3F9]">
                  {n.title}
                </p>
                <p className="text-xs text-[#8A8994] dark:text-[#9795A7] line-clamp-2 mt-0.5">
                  {n.body}
                </p>
                <span className="text-[10px] text-[#B2B0BD] dark:text-[#6B697B] mt-1 block">
                  {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
