import React, { useState } from 'react';
import { UserProfile } from '@/types';
import PulseHeart from '@/components/reactbits/PulseHeart/PulseHeart';
import {
  X,
  BadgeCheck,
  GraduationCap,
  Sparkles,
  Flag,
  ChevronLeft,
  ChevronRight,
  Shield,
} from 'lucide-react';

interface ProfileDetailModalProps {
  profile: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onLike: (userId: string) => void;
  onPass: (userId: string) => void;
  onReport: (userId: string, name: string) => void;
}

export const ProfileDetailModal: React.FC<ProfileDetailModalProps> = ({
  profile,
  isOpen,
  onClose,
  onLike,
  onPass,
  onReport,
}) => {
  const [photoIndex, setPhotoIndex] = useState(0);

  if (!isOpen || !profile) return null;

  const photos = profile.photos && profile.photos.length > 0 ? profile.photos : [{ id: '1', url: profile.avatar_url, order_index: 0, is_primary: true, user_id: profile.id }];

  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg max-h-[92vh] bg-white dark:bg-[#1A1924] rounded-3xl overflow-hidden shadow-2xl border border-[#F2E3E6] dark:border-[#2C2B3C] flex flex-col">
        {/* Top Photo Gallery with story indicators */}
        <div className="relative h-96 sm:h-[420px] bg-black select-none shrink-0">
          <img
            src={photos[photoIndex]?.url || profile.avatar_url}
            alt={profile.display_name}
            className="w-full h-full object-cover"
          />

          {/* Photo progress bars */}
          {photos.length > 1 && (
            <div className="absolute top-3 inset-x-3 flex gap-1 z-20">
              {photos.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-all ${
                    i === photoIndex ? 'bg-white shadow-md' : 'bg-white/40'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Left/Right navigation overlays */}
          {photos.length > 1 && (
            <>
              <button
                onClick={prevPhoto}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition z-10"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextPhoto}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition z-10"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition z-30"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Gradient Overlay for bottom text */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />

          <div className="absolute bottom-4 left-5 right-5 text-white pointer-events-none">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-2xl font-black">{profile.display_name}</h2>
              {profile.age && <span className="text-2xl font-normal opacity-90">{profile.age}</span>}
              {profile.is_verified && (
                <BadgeCheck className="w-6 h-6 text-[#20D994] fill-[#20D994] text-white" />
              )}
              {(profile.is_simulated || profile.display_name === 'จอน') && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-white shadow-sm">
                  🤖 คนสมมุติ: จอน (Simulated Profile)
                </span>
              )}
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500 text-white shadow-sm flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                ออน
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/80 mt-1">
              <GraduationCap className="w-4 h-4 text-[#FF7A85]" />
              <span>{profile.school_department || 'Member'}</span>
            </div>
          </div>
        </div>

        {/* Scrollable details */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Compatibility badge */}
          {profile.compatibility_score && (
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FFF5F7] dark:bg-[#281822] border border-[#FF526B]/20">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-gradient-brand text-white">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#FF526B]">
                    {profile.compatibility_score}% Campus Compatibility
                  </span>
                  <p className="text-[11px] text-[#8A8994]">
                    คำนวณจากความสนใจและข้อมูลสถาบันร่วมกัน
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white dark:bg-[#1E1D2A] text-[#20202A] dark:text-[#F4F3F9] shadow-sm">
                High Match
              </span>
            </div>
          )}

          {/* Bio */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A8994] dark:text-[#9795A7] mb-1.5">
              เกี่ยวกับฉัน (About)
            </h4>
            <p className="text-sm text-[#20202A] dark:text-[#F4F3F9] leading-relaxed whitespace-pre-line">
              {profile.bio || 'ยังไม่ได้ระบุข้อความแนะนำตัว'}
            </p>
          </div>

          {/* Interests */}
          {profile.interests && profile.interests.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A8994] dark:text-[#9795A7] mb-2">
                สิ่งที่สนใจ (Interests & Activities)
              </h4>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest) => (
                  <span
                    key={interest.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-[#282737] text-[#20202A] dark:text-[#F4F3F9] border border-gray-200 dark:border-gray-800"
                  >
                    <span>{interest.icon}</span>
                    <span>{interest.name}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Safety & Report */}
          <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-[#8A8994]">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span>Verified Member</span>
            </div>
            <button
              onClick={() => onReport(profile.id, profile.display_name)}
              className="text-xs font-semibold text-red-500 hover:underline flex items-center gap-1"
            >
              <Flag className="w-3.5 h-3.5" />
              รายงานผู้ใช้
            </button>
          </div>
        </div>

        {/* Bottom Action Footer */}
        <div className="p-4 bg-gray-50 dark:bg-[#15141E] border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={() => {
              onPass(profile.id);
              onClose();
            }}
            className="flex-1 py-3 rounded-2xl border-2 border-red-500/30 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 font-bold text-xs flex items-center justify-center gap-2 transition"
          >
            <X className="w-4 h-4" />
            PASS
          </button>
          <div className="flex-1 flex justify-center">
            <PulseHeart
              liked={false}
              count={profile.compatibility_score || 1}
              showCount={true}
              size={46}
              likedColor="#FF526B"
              idleColor="#8A8994"
              pillColor="#FF526B"
              textColor="#ffffff"
              label="Like"
              onChange={(nextLiked: boolean) => {
                if (nextLiked) {
                  setTimeout(() => {
                    onLike(profile.id);
                    onClose();
                  }, 400);
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
