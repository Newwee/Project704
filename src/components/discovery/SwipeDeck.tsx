'use client';

import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { UserProfile, SwipeAction } from '@/types';
import {
  X,
  Heart,
  Star,
  RotateCcw,
  Info,
  BadgeCheck,
  GraduationCap,
  Sparkles,
  Users,
} from 'lucide-react';
import { ProfileDetailModal } from './ProfileDetailModal';
import { ReportModal } from '../safety/ReportModal';

export const SwipeDeck: React.FC = () => {
  const { discoveryProfiles, swipe, refreshDiscovery } = useApp();
  const [detailProfile, setDetailProfile] = useState<UserProfile | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState<{ id: string; name: string } | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const activeProfile = discoveryProfiles[0];
  const nextProfile = discoveryProfiles[1];

  // Motion values for gesture physics
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-250, 250], [-18, 18]);
  const likeOpacity = useTransform(x, [20, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-20, -100], [0, 1]);
  const superLikeOpacity = useTransform(y, [-20, -100], [0, 1]);

  const handleSwipeAction = async (action: SwipeAction) => {
    if (!activeProfile || isSwiping) return;
    setIsSwiping(true);
    setCurrentPhotoIndex(0);
    await swipe(activeProfile.id, action);
    x.set(0);
    y.set(0);
    setIsSwiping(false);
  };

  const handleDragEnd = async (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { x: number; y: number } }
  ) => {
    const threshold = 100;
    const verticalThreshold = -90;

    if (info.offset.y < verticalThreshold && Math.abs(info.offset.x) < 80) {
      await handleSwipeAction('superlike');
    } else if (info.offset.x > threshold) {
      await handleSwipeAction('like');
    } else if (info.offset.x < -threshold) {
      await handleSwipeAction('pass');
    }
  };

  const photos = activeProfile?.photos && activeProfile.photos.length > 0
    ? activeProfile.photos
    : activeProfile
    ? [{ id: '1', url: activeProfile.avatar_url, order_index: 0, is_primary: true, user_id: activeProfile.id }]
    : [];

  const handlePhotoClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    if (clickX < rect.width / 2) {
      // Tap Left: Prev
      setCurrentPhotoIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else {
      // Tap Right: Next
      setCurrentPhotoIndex((prev) => (prev < photos.length - 1 ? prev + 1 : prev));
    }
  };

  return (
    <div className="relative w-full max-w-sm sm:max-w-md mx-auto flex flex-col items-center select-none">
      {/* Cards Deck Container */}
      <div className="relative w-full h-[540px] sm:h-[580px]">
        {/* Next Card in Stack (Underneath) */}
        {nextProfile && (
          <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-card border border-black/5 dark:border-white/5 bg-gray-900 scale-[0.95] translate-y-3 pointer-events-none opacity-85 transition-all">
            <img
              src={nextProfile.avatar_url || nextProfile.photos[0]?.url}
              alt={nextProfile.display_name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                if (!target.src.includes('default-avatar')) {
                  target.src = '/images/default-avatar.svg';
                }
              }}
            />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 text-white">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl font-bold">{nextProfile.display_name}, {nextProfile.age}</h3>
                {(nextProfile.is_simulated || nextProfile.display_name === 'จอน') && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white shadow-sm">
                    คนสมมุติ: จอน
                  </span>
                )}
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/90 text-white backdrop-blur-md flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  ออน
                </span>
              </div>
              <p className="text-xs text-white/80">{nextProfile.school_department}</p>
            </div>
          </div>
        )}

        {/* Active Top Card */}
        <AnimatePresence>
          {activeProfile ? (
            <motion.div
              key={activeProfile.id}
              style={{ x, y, rotate }}
              drag={!isSwiping}
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              dragElastic={0.9}
              onDragEnd={handleDragEnd}
              whileTap={{ cursor: 'grabbing' }}
              className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl border border-black/10 dark:border-white/10 bg-black cursor-grab touch-none"
            >
              {/* Photo Image */}
              <div
                onClick={handlePhotoClick}
                className="relative w-full h-full"
              >
                <img
                  src={photos[currentPhotoIndex]?.url || activeProfile.avatar_url}
                  alt={activeProfile.display_name}
                  className="w-full h-full object-cover pointer-events-none"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    if (!target.src.includes('default-avatar')) {
                      target.src = '/images/default-avatar.svg';
                    }
                  }}
                />

                {/* Photo Story Segment Bars */}
                {photos.length > 1 && (
                  <div className="absolute top-3 inset-x-3 flex gap-1.5 z-20 pointer-events-none">
                    {photos.map((_, idx) => (
                      <div
                        key={idx}
                        className={`h-1.5 flex-1 rounded-full transition-all ${
                          idx === currentPhotoIndex
                            ? 'bg-white shadow-md'
                            : 'bg-white/40'
                        }`}
                      />
                    ))}
                  </div>
                )}

                {/* Dynamic Swipe Stamps */}
                <motion.div
                  style={{ opacity: likeOpacity }}
                  className="absolute top-8 left-6 border-4 border-emerald-400 text-emerald-400 font-black text-2xl sm:text-3xl tracking-widest px-4 py-1 rounded-xl rotate-[-15deg] pointer-events-none z-30 uppercase backdrop-blur-xs bg-emerald-950/20"
                >
                  LIKE
                </motion.div>

                <motion.div
                  style={{ opacity: nopeOpacity }}
                  className="absolute top-8 right-6 border-4 border-rose-500 text-rose-500 font-black text-2xl sm:text-3xl tracking-widest px-4 py-1 rounded-xl rotate-[15deg] pointer-events-none z-30 uppercase backdrop-blur-xs bg-rose-950/20"
                >
                  NOPE
                </motion.div>

                <motion.div
                  style={{ opacity: superLikeOpacity }}
                  className="absolute bottom-32 inset-x-0 mx-auto w-fit border-4 border-sky-400 text-sky-400 font-black text-2xl tracking-widest px-4 py-1 rounded-xl pointer-events-none z-30 uppercase backdrop-blur-xs bg-sky-950/30"
                >
                  SUPER LIKE
                </motion.div>

                {/* Bottom Shadow Gradient */}
                <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/95 via-black/50 to-transparent pointer-events-none" />

                {/* Card Profile Info Details */}
                <div className="absolute bottom-4 left-5 right-5 text-white z-20 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-2xl sm:text-3xl font-black drop-shadow">
                          {activeProfile.display_name}
                        </h2>
                        {activeProfile.age && (
                          <span className="text-2xl sm:text-3xl font-light opacity-90 drop-shadow">
                            {activeProfile.age}
                          </span>
                        )}
                        {activeProfile.is_verified && (
                          <BadgeCheck className="w-6 h-6 text-[#20D994] fill-[#20D994] text-white shrink-0 drop-shadow" />
                        )}
                        {(activeProfile.is_simulated || activeProfile.display_name === 'จอน') && (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/90 text-white backdrop-blur-md shadow-sm border border-amber-300/40">
                            🤖 คนสมมุติ: จอน
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/90 text-white backdrop-blur-md shadow-sm flex items-center gap-1 border border-emerald-300/40">
                          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                          ออน
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-white/85 font-medium mt-0.5">
                        <GraduationCap className="w-4 h-4 text-[#FF7A85]" />
                        <span>{activeProfile.school_department || 'Member'}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDetailProfile(activeProfile);
                        setIsDetailOpen(true);
                      }}
                      className="p-2.5 rounded-full bg-white/20 hover:bg-white/35 backdrop-blur-md text-white transition shrink-0"
                    >
                      <Info className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Compatibility Pill & Short Bio */}
                  {activeProfile.compatibility_score && (
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-300 bg-emerald-950/60 backdrop-blur-md px-2.5 py-1 rounded-full w-fit border border-emerald-500/30">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>{activeProfile.compatibility_score}% Campus Match</span>
                    </div>
                  )}

                  <p className="text-xs text-white/90 line-clamp-2 leading-relaxed">
                    {activeProfile.bio}
                  </p>

                  {/* Quick Interest Chips */}
                  {activeProfile.interests && activeProfile.interests.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {activeProfile.interests.slice(0, 3).map((item) => (
                        <span
                          key={item.id}
                          className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white/20 backdrop-blur-md text-white border border-white/10"
                        >
                          {item.icon} {item.name}
                        </span>
                      ))}
                      {activeProfile.interests.length > 3 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/15 text-white/80">
                          +{activeProfile.interests.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            /* Empty State */
            <div className="absolute inset-0 rounded-3xl bg-white dark:bg-[#1A1924] border border-[#F2E3E6] dark:border-[#2C2B3C] shadow-card flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full bg-[#FFEBF0] dark:bg-[#2B1822] flex items-center justify-center text-[#FF526B] animate-pulse">
                  <Users className="w-10 h-10" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-gradient-brand text-white flex items-center justify-center shadow-md">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>

              <h3 className="text-xl font-bold text-[#20202A] dark:text-[#F4F3F9]">
                ยังไม่มีผู้ใช้งานคนอื่นในระบบ
              </h3>
              <p className="text-xs text-[#8A8994] dark:text-[#9795A7] mt-2 max-w-xs leading-relaxed">
                ขณะนี้ยังไม่มีสมาชิกคนอื่นในระบบ เมื่อมีเพื่อน ๆ สมัครเข้ามา โปรไฟล์จะปรากฏที่นี่ทันที หรือคุณสามารถชวนเพื่อน ๆ มาสร้างโปรไฟล์ได้เลย!
              </p>

              <button
                onClick={refreshDiscovery}
                className="mt-6 px-6 py-3 rounded-2xl bg-gradient-brand text-white font-bold text-xs shadow-brand hover:opacity-95 transition flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                รีเฟรชค้นหาใหม่ (Refresh Passes)
              </button>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Action Controls Bar */}
      {activeProfile && (
        <div className="flex items-center justify-center gap-4 sm:gap-6 mt-5 z-20">
          {/* Refresh / Rewind */}
          <button
            onClick={refreshDiscovery}
            title="Rewind / Refresh"
            className="w-12 h-12 rounded-full bg-white dark:bg-[#201F2C] border border-[#F2E3E6] dark:border-[#2C2B3C] shadow-md flex items-center justify-center text-amber-500 hover:scale-110 active:scale-95 transition"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          {/* Pass (NOPE) */}
          <button
            onClick={() => handleSwipeAction('pass')}
            title="Pass"
            className="w-16 h-16 rounded-full bg-white dark:bg-[#201F2C] border border-red-100 dark:border-red-950 shadow-lg flex items-center justify-center text-rose-500 hover:scale-110 active:scale-95 transition"
          >
            <X className="w-8 h-8 stroke-[3]" />
          </button>

          {/* Super Like */}
          <button
            onClick={() => handleSwipeAction('superlike')}
            title="Super Like"
            className="w-12 h-12 rounded-full bg-white dark:bg-[#201F2C] border border-sky-100 dark:border-sky-950 shadow-md flex items-center justify-center text-sky-500 hover:scale-110 active:scale-95 transition"
          >
            <Star className="w-6 h-6 fill-sky-500" />
          </button>

          {/* Like (HEART) */}
          <button
            onClick={() => handleSwipeAction('like')}
            title="Like"
            className="w-16 h-16 rounded-full bg-white dark:bg-[#201F2C] border border-emerald-100 dark:border-emerald-950 shadow-lg flex items-center justify-center text-emerald-500 hover:scale-110 active:scale-95 transition"
          >
            <Heart className="w-8 h-8 stroke-[2.5] fill-emerald-500" />
          </button>
        </div>
      )}

      {/* Modals */}
      <ProfileDetailModal
        profile={detailProfile}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onLike={() => {
          setIsDetailOpen(false);
          handleSwipeAction('like');
        }}
        onPass={() => {
          setIsDetailOpen(false);
          handleSwipeAction('pass');
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
