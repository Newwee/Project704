'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import {
  MessageCircle,
  Send,
  ChevronLeft,
  MoreVertical,
  Shield,
  Flag,
  UserX,
  BadgeCheck,
  GraduationCap,
  Info,
} from 'lucide-react';
import { UserProfile } from '@/types';
import { ProfileDetailModal } from '../discovery/ProfileDetailModal';
import { ReportModal } from '../safety/ReportModal';
import FuseButton from '@/components/reactbits/FuseButton/FuseButton';

interface ChatViewProps {
  initialConversationId?: string;
}

export const ChatView: React.FC<ChatViewProps> = ({ initialConversationId }) => {
  const {
    matches,
    conversations,
    messages,
    sendMessage,
    fetchMessages,
    unmatch,
    blockUser,
    currentUser,
  } = useApp();

  const [selectedConvoId, setSelectedConvoId] = useState<string | null>(
    initialConversationId || null
  );
  const activeConvoId = selectedConvoId || (conversations[0]?.id ?? null);
  const [inputText, setInputText] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [detailProfile, setDetailProfile] = useState<UserProfile | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState<{ id: string; name: string } | null>(null);
  const [isUnmatching, setIsUnmatching] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeConvoId]);

  // Fast polling for active conversation to give instant real-time chat feel
  useEffect(() => {
    if (!activeConvoId) return;
    fetchMessages(activeConvoId);

    const interval = setInterval(() => {
      fetchMessages(activeConvoId);
    }, 1500);

    return () => clearInterval(interval);
  }, [activeConvoId, fetchMessages]);

  const activeConvo = conversations.find((c) => c.id === activeConvoId);
  const activeMessages = activeConvoId ? messages[activeConvoId] || [] : [];
  const otherUser = activeConvo?.other_user;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConvoId || !inputText.trim()) return;
    sendMessage(activeConvoId, inputText);
    setInputText('');
  };

  const handleSelectMatch = (matchId: string) => {
    const convo = conversations.find((c) => c.match_id === matchId);
    if (convo) {
      setSelectedConvoId(convo.id);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto h-[calc(100vh-140px)] min-h-[580px] p-2 sm:p-4">
      <div className="w-full h-full bg-white dark:bg-[#181722] rounded-3xl border border-[#F2E3E6] dark:border-[#2C2B3C] shadow-card overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Column: Matches Carousel & Conversations List */}
        <div
          className={`w-full md:w-80 lg:w-96 flex flex-col border-r border-[#F2E3E6] dark:border-[#2C2B3C] shrink-0 ${
            activeConvoId ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-xl font-black text-[#20202A] dark:text-[#F4F3F9]">
              Matches & Messages
            </h2>
          </div>

          {/* New Matches Bubble Carousel */}
          <div className="p-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8A8994] dark:text-[#9795A7]">
                New Matches ({matches.length})
              </span>
            </div>

            {matches.length === 0 ? (
              <p className="text-xs text-[#8A8994] py-2">ยังไม่มีแมตช์ใหม่ ไปที่หน้า Discover เพื่อปัดหาเพื่อนเลย!</p>
            ) : (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                {matches.map((match) => (
                  <button
                    key={match.id}
                    onClick={() => handleSelectMatch(match.id)}
                    className="flex flex-col items-center gap-1.5 shrink-0 group"
                  >
                    <div className="relative w-14 h-14 rounded-full p-0.5 bg-gradient-brand shadow-sm">
                      <img
                        src={match.other_user.avatar_url || match.other_user.photos[0]?.url}
                        alt={match.other_user.display_name}
                        className="w-full h-full rounded-full object-cover border-2 border-white dark:border-[#181722] group-hover:scale-105 transition"
                      />
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-[#181722]" />
                    </div>
                    <span className="text-[11px] font-semibold text-[#20202A] dark:text-[#F4F3F9] max-w-[60px] truncate">
                      {match.other_user.display_name.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-[#242332]">
            <div className="px-4 py-2 bg-gray-50/50 dark:bg-[#1E1D2A]/50">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8A8994] dark:text-[#9795A7]">
                Messages ({conversations.length})
              </span>
            </div>

            {conversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#8A8994]">
                ยังไม่มีบทสนทนา เลือกผู้ใช้จากรายการ Matches เพื่อเริ่มแชต
              </div>
            ) : (
              conversations.map((convo) => {
                const isSelected = convo.id === activeConvoId;
                return (
                  <div
                    key={convo.id}
                    onClick={() => setSelectedConvoId(convo.id)}
                    className={`p-3.5 flex items-center gap-3 cursor-pointer transition ${
                      isSelected
                        ? 'bg-[#FFF2F5] dark:bg-[#281822] border-l-4 border-[#FF526B]'
                        : 'hover:bg-gray-50 dark:hover:bg-[#201F2C]'
                    }`}
                  >
                    <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 bg-gray-800">
                      <img
                        src={convo.other_user.avatar_url || convo.other_user.photos[0]?.url}
                        alt={convo.other_user.display_name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs sm:text-sm text-[#20202A] dark:text-[#F4F3F9] truncate">
                          {convo.other_user.display_name}
                        </span>
                        <span className="text-[10px] text-[#8A8994]">
                          {new Date(convo.last_message_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-[#8A8994] dark:text-[#9795A7] truncate mt-0.5">
                        {convo.last_message_text}
                      </p>
                    </div>

                    {convo.unread_count > 0 && (
                      <div className="w-5 h-5 rounded-full bg-gradient-brand text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        {convo.unread_count}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Active Conversation Chat Window */}
        <div
          className={`flex-1 flex flex-col bg-[#FFF9FA]/40 dark:bg-[#15141E] ${
            !activeConvoId ? 'hidden md:flex' : 'flex'
          }`}
        >
          {activeConvo && otherUser ? (
            <>
              {/* Chat Header */}
              <div className="p-3.5 px-4 bg-white dark:bg-[#181722] border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedConvoId(null)}
                    className="p-1.5 rounded-full text-[#8A8994] hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>

                  <div
                    onClick={() => {
                      setDetailProfile(otherUser);
                      setIsDetailOpen(true);
                    }}
                    className="flex items-center gap-2.5 cursor-pointer"
                  >
                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-800">
                      <img
                        src={otherUser.avatar_url || otherUser.photos[0]?.url}
                        alt={otherUser.display_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-[#20202A] dark:text-[#F4F3F9]">
                          {otherUser.display_name}
                        </span>
                        {otherUser.is_verified && (
                          <BadgeCheck className="w-4 h-4 text-[#20D994] fill-[#20D994] text-white" />
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-[#8A8994]">
                        <GraduationCap className="w-3 h-3 text-[#FF7A85]" />
                        <span>{otherUser.school_department || 'Member'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Options Menu */}
                <div className="relative">
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="p-2 rounded-full text-[#8A8994] hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>

                  {menuOpen && (
                    <div className="absolute right-0 top-11 w-48 bg-white dark:bg-[#201F2C] rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 py-1.5 z-40">
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          setDetailProfile(otherUser);
                          setIsDetailOpen(true);
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-medium text-[#20202A] dark:text-[#F4F3F9] hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2"
                      >
                        <Info className="w-4 h-4" />
                        ดูโปรไฟล์ (View Profile)
                      </button>
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          setIsUnmatching(true);
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-medium text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30 flex items-center gap-2"
                      >
                        <UserX className="w-4 h-4" />
                        ยกเลิกแมตช์ (Unmatch)
                      </button>
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          blockUser(otherUser.id, 'Blocked from chat');
                          setSelectedConvoId(null);
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2"
                      >
                        <Shield className="w-4 h-4" />
                        บล็อกผู้ใช้ (Block)
                      </button>
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          setReportTarget({ id: otherUser.id, name: otherUser.display_name });
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2 border-t border-gray-100 dark:border-gray-800"
                      >
                        <Flag className="w-4 h-4" />
                        รายงานความปลอดภัย (Report)
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Unmatch Fuse Confirmation Banner */}
              {isUnmatching && (
                <div className="p-3 bg-red-50 dark:bg-red-950/40 border-b border-red-200 dark:border-red-900/60 flex flex-wrap items-center justify-between gap-2.5 animate-in fade-in slide-in-from-top-2">
                  <div className="text-xs text-red-600 dark:text-red-400 font-semibold flex items-center gap-1.5">
                    <UserX className="w-4 h-4 shrink-0" />
                    <span>ต้องการยกเลิกแมตช์กับ <strong>{otherUser.display_name}</strong>?</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsUnmatching(false)}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-200/50 transition"
                    >
                      ยกเลิก
                    </button>
                    <FuseButton
                      label="กดยืนยันยกเลิก"
                      undoLabel="ยกเลิกทันที (Undo)"
                      doneLabel="ยกเลิกแมตช์แล้ว"
                      background="#dc2626"
                      color="#ffffff"
                      fuseColor="#fca5a5"
                      size="sm"
                      radius={18}
                      undoWindow={4000}
                      commitOn="fuseEnd"
                      onUndo={() => {
                        setIsUnmatching(false);
                      }}
                      onFuseEnd={() => {
                        unmatch(activeConvo.match_id);
                        setSelectedConvoId(null);
                        setIsUnmatching(false);
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Messages Body */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {/* Safety Encouragement Header */}
                <div className="mx-auto max-w-sm p-3 rounded-2xl bg-white dark:bg-[#1E1D2A] border border-[#F2E3E6] dark:border-[#2C2B3C] text-center mb-4 shadow-xs">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto mb-1">
                    <Shield className="w-4 h-4" />
                  </div>
                  <p className="text-[11px] font-semibold text-[#20202A] dark:text-[#F4F3F9]">
                    Community Safe Chat
                  </p>
                  <p className="text-[10px] text-[#8A8994] mt-0.5">
                    ร่วมสร้างมิตรภาพที่สร้างสรรค์ ปราศจากการคุกคาม และเคารพซึ่งกันและกัน
                  </p>
                </div>

                {activeMessages.map((msg) => {
                  const isOwn = msg.sender_id === currentUser?.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[75%] sm:max-w-[65%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                          isOwn
                            ? 'bg-gradient-brand text-white rounded-br-xs shadow-xs'
                            : 'bg-white dark:bg-[#22212F] text-[#20202A] dark:text-[#F4F3F9] rounded-bl-xs border border-[#F2E3E6] dark:border-[#2C2B3C] shadow-xs'
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[9px] text-[#8A8994] mt-1 px-1">
                        {new Date(msg.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Bar */}
              <form
                onSubmit={handleSend}
                className="p-3 bg-white dark:bg-[#181722] border-t border-gray-100 dark:border-gray-800 flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="พิมพ์ข้อความทักทาย..."
                  className="flex-1 py-2.5 px-4 rounded-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#201F2C] text-xs sm:text-sm text-[#20202A] dark:text-[#F4F3F9] focus:outline-none focus:border-[#FF526B]"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-2.5 rounded-full bg-gradient-brand text-white shadow-brand hover:opacity-95 disabled:opacity-40 transition"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-[#FFEBF0] dark:bg-[#281822] text-[#FF526B] flex items-center justify-center mb-3">
                <MessageCircle className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-base text-[#20202A] dark:text-[#F4F3F9]">
                เลือกบทสนทนาเพื่อเริ่มแชต
              </h3>
              <p className="text-xs text-[#8A8994] mt-1 max-w-xs">
                ทักทายเพื่อนใหม่ใน Spark แลกเปลี่ยนเรื่องเรียน กิจกรรม และความชอบร่วมกัน
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Profile Detail Modal */}
      <ProfileDetailModal
        profile={detailProfile}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onLike={() => {}}
        onPass={() => {}}
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
