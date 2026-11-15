'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Heart, Sparkles, X, BadgeCheck, GraduationCap, Eye } from 'lucide-react';
import PulseHeart from '@/components/reactbits/PulseHeart/PulseHeart';
import { UserProfile } from '@/types';
import { ProfileDetailModal } from '../discovery/ProfileDetailModal';
import { ReportModal } from '../safety/ReportModal';

export const LikesView: React.FC = () => {
  const { likedByUsers, swipe } = useApp();
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState<{ id: string; name: string } | null>(null);

  const handleLikeBack = async (userId: string) => {
    await swipe(userId, 'like');
  };

  const handlePass = async (userId: string) => {
    await swipe(userId, 'pass');
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 sm:py-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-brand text-white shadow-sm">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#20202A] dark:text-[#F4F3F9]">
              คนที่กดถูกใจคุณ (Likes You)
            </h1>
          </div>
          <p className="text-xs text-[#8A8994] dark:text-[#9795A7] mt-1">
            คนเหล่านี้ส่งความสนใจถึงคุณ กดถูกใจกลับเพื่อเริ่มแมตช์และคุยได้ทันที!
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFEBF0] dark:bg-[#281A22] text-[#FF526B] font-bold text-xs w-fit">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{likedByUsers.length} คนสนใจคุณ</span>
        </div>
      </div>

      {likedByUsers.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-[#1A1924] rounded-3xl border border-[#F2E3E6] dark:border-[#2C2B3C] shadow-card p-8">
          <div className="w-20 h-20 rounded-full bg-[#FFEBF0] dark:bg-[#281A22] text-[#FF526B] flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-[#20202A] dark:text-[#F4F3F9]">
            ยังไม่มี Like ใหม่ในขณะนี้
          </h3>
          <p className="text-xs text-[#8A8994] dark:text-[#9795A7] mt-1 max-w-sm mx-auto">
            อัปเดตโปรไฟล์และรูปภาพให้สดใส พร้อมเปิดการค้นหา เพื่อให้เพื่อน ๆ ในสถาบันมองเห็นคุณมากขึ้น!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {likedByUsers.map((user) => (
            <div
              key={user.id}
              className="group relative rounded-3xl overflow-hidden bg-white dark:bg-[#1E1D2A] border border-[#F2E3E6] dark:border-[#2C2B3C] shadow-card hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              {/* Photo Area */}
              <div className="relative h-60 w-full overflow-hidden bg-gray-900">
                <img
                  src={user.avatar_url || user.photos[0]?.url}
                  alt={user.display_name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* New Like Indicator Badge */}
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-gradient-brand text-white font-bold text-[10px] shadow-sm flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>NEW LIKE</span>
                </div>

                {/* Inspect Button */}
                <button
                  onClick={() => {
                    setSelectedUser(user);
                    setIsDetailOpen(true);
                  }}
                  className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>

                {/* Gradient for text readability */}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />

                <div className="absolute bottom-2.5 left-3 right-3 text-white pointer-events-none">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-sm truncate">{user.display_name}</h3>
                    {user.age && <span className="text-xs opacity-90">{user.age}</span>}
                    {user.is_verified && (
                      <BadgeCheck className="w-4 h-4 text-[#20D994] fill-[#20D994] text-white shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-white/80 truncate mt-0.5">
                    <GraduationCap className="w-3 h-3 text-[#FF7A85]" />
                    <span className="truncate">{user.school_department}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-2.5 flex items-center justify-between gap-2 bg-white dark:bg-[#1E1D2A] border-t border-gray-100 dark:border-gray-800">
                <button
                  onClick={() => handlePass(user.id)}
                  title="Pass"
                  className="flex-1 py-2 rounded-xl border border-red-200 dark:border-red-950/60 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 font-bold text-xs flex items-center justify-center transition"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="flex-1 flex justify-center">
                  <PulseHeart
                    liked={false}
                    count={1}
                    showCount={false}
                    size={36}
                    likedColor="#FF526B"
                    idleColor="#8A8994"
                    pillColor="#FF526B"
                    textColor="#ffffff"
                    label="Match"
                    onChange={(nextLiked: boolean) => {
                      if (nextLiked) {
                        setTimeout(() => handleLikeBack(user.id), 300);
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Profile Detail Modal */}
      <ProfileDetailModal
        profile={selectedUser}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onLike={(uid) => {
          setIsDetailOpen(false);
          handleLikeBack(uid);
        }}
        onPass={(uid) => {
          setIsDetailOpen(false);
          handlePass(uid);
        }}
        onReport={(uid, name) => {
          setIsDetailOpen(false);
          setReportTarget({ id: uid, name });
        }}
      />

      {reportTarget && (
        <ReportModal
          isOpen={Boolean(reportTarget)}
          onClose={() => setReportTarget(null)}
          targetUserId={reportTarget.id}
          targetUserName={reportTarget.name}
        />
      )}
    </div>
  );
};
