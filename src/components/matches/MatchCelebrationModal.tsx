import React, { useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Sparkles, MessageCircle, Heart, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MatchCelebrationModalProps {
  onNavigateToChat: (conversationId?: string) => void;
}

export const MatchCelebrationModal: React.FC<MatchCelebrationModalProps> = ({
  onNavigateToChat,
}) => {
  const { latestMatchCelebration, dismissMatchCelebration, currentUser, conversations } = useApp();

  useEffect(() => {
    if (latestMatchCelebration) {
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#FF416C', '#FF526B', '#FF7A85', '#FFD166', '#06D6A0'],
        });
      } catch {
        // Safe fallback
      }
    }
  }, [latestMatchCelebration]);

  if (!latestMatchCelebration || !currentUser) return null;

  const matchedUser = latestMatchCelebration.other_user;
  const convo = conversations.find((c) => c.match_id === latestMatchCelebration.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-sm bg-gradient-to-b from-[#2B1724] to-[#161520] rounded-3xl p-6 text-white text-center shadow-2xl border border-[#FF526B]/30 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#FF416C]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#FF7A85]/20 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={dismissMatchCelebration}
          className="absolute top-4 right-4 p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-3">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span className="text-xs font-bold tracking-widest uppercase text-amber-200">
            It&apos;s a Match!
          </span>
        </div>

        <h2 className="text-2xl font-black text-white tracking-tight">
          คุณและ {matchedUser.display_name}
        </h2>
        <p className="text-xs text-white/70 mt-1">
          ต่างกดถูกใจกันและกันใน NMR TUP! ✨
        </p>

        {/* Dual Avatars with Heart Badge */}
        <div className="relative flex items-center justify-center my-8">
          {/* Current User Avatar */}
          <div className="w-24 h-24 rounded-full border-4 border-white shadow-xl overflow-hidden -mr-4 z-10 bg-gray-700">
            <img
              src={currentUser.avatar_url || currentUser.photos[0]?.url}
              alt={currentUser.display_name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Central Heart Icon */}
          <div className="absolute z-20 w-10 h-10 rounded-full bg-gradient-brand flex items-center justify-center shadow-lg border-2 border-white animate-bounce">
            <Heart className="w-5 h-5 text-white fill-white" />
          </div>

          {/* Matched User Avatar */}
          <div className="w-24 h-24 rounded-full border-4 border-[#FF526B] shadow-xl overflow-hidden -ml-4 z-10 bg-gray-700">
            <img
              src={matchedUser.avatar_url || matchedUser.photos[0]?.url}
              alt={matchedUser.display_name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={() => {
              dismissMatchCelebration();
              onNavigateToChat(convo?.id);
            }}
            className="w-full py-3.5 rounded-2xl bg-gradient-brand text-white font-bold text-sm shadow-brand hover:opacity-95 transition flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            ส่งข้อความทักทายเลย
          </button>
          <button
            onClick={dismissMatchCelebration}
            className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs transition"
          >
            ปัดต่อ (Keep Swiping)
          </button>
        </div>
      </div>
    </div>
  );
};
