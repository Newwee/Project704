'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Logo } from '../common/Logo';
import { X, Mail, UserPlus, ArrowRight, UserCheck } from 'lucide-react';
import { UserProfile } from '@/types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartRegister: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onStartRegister,
}) => {
  const { allProfiles, loginUser, loginAs } = useApp();
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleLoginByEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg('กรุณากรอกอีเมล');
      return;
    }

    const success = loginUser(email);
    if (success) {
      setErrorMsg('');
      onClose();
    } else {
      setErrorMsg('ไม่พบบัญชีนี้ในระบบ กรุณาตรวจสอบอีเมลหรือสร้างบัญชีใหม่');
    }
  };

  const handleSelectAccount = (user: UserProfile) => {
    loginAs(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-[#1A1924] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#F2E3E6] dark:border-[#2C2B3C] relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#8A8994] hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center mb-6">
          <Logo size="md" />
          <h2 className="text-xl font-black text-[#20202A] dark:text-[#F4F3F9] mt-3">
            เข้าสู่ระบบ Tinder NMR TUP
          </h2>
          <p className="text-xs text-[#8A8994] mt-0.5">
            เข้าสู่ระบบด้วยบัญชีของคุณ หรือสร้างบัญชีใหม่เพื่อเริ่มเล่น
          </p>
        </div>

        {/* Action: Create New Account (Prominent Button) */}
        <button
          onClick={() => {
            onClose();
            onStartRegister();
          }}
          className="w-full py-3.5 px-4 rounded-2xl bg-gradient-brand text-white font-bold text-xs shadow-brand hover:opacity-95 transition flex items-center justify-center gap-2 mb-4"
        >
          <UserPlus className="w-4 h-4" />
          สร้างบัญชีใหม่ (ใส่รูปและข้อมูล)
        </button>

        {/* Existing Accounts on this Device (if any) */}
        {allProfiles.length > 0 && (
          <div className="mb-4 p-3 rounded-2xl bg-gray-50 dark:bg-[#201F2C] border border-gray-100 dark:border-gray-800 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8994] block">
              เลือกบัญชีที่สร้างไว้ในเครื่องนี้ ({allProfiles.length} บัญชี)
            </span>
            <div className="max-h-40 overflow-y-auto space-y-1.5">
              {allProfiles.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleSelectAccount(user)}
                  className="w-full p-2 rounded-xl bg-white dark:bg-[#15141E] border border-gray-200 dark:border-gray-800 hover:border-[#FF526B] transition text-left flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={user.avatar_url || user.photos[0]?.url}
                      alt={user.display_name}
                      className="w-8 h-8 rounded-full object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-[#20202A] dark:text-[#F4F3F9] truncate block">
                        {user.display_name}
                      </span>
                      <span className="text-[10px] text-[#8A8994] truncate block">
                        {user.school_department}
                      </span>
                    </div>
                  </div>
                  <UserCheck className="w-4 h-4 text-[#FF526B] shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sign in with Email */}
        <form onSubmit={handleLoginByEmail} className="space-y-3 pt-2 border-t border-gray-100 dark:border-gray-800">
          <div>
            <label className="block text-xs font-semibold text-[#20202A] dark:text-[#F4F3F9] mb-1">
              หรือเข้าสู่ระบบด้วยอีเมล
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8A8994] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="อีเมลที่ใช้สมัคร"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#201F2C] text-xs text-[#20202A] dark:text-[#F4F3F9] focus:outline-none focus:border-[#FF526B]"
              />
            </div>
          </div>

          {errorMsg && (
            <p className="text-xs text-red-500 font-semibold">{errorMsg}</p>
          )}

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-[#FF526B] font-bold text-xs text-[#20202A] dark:text-[#F4F3F9] transition flex items-center justify-center gap-1.5"
          >
            <span>เข้าสู่ระบบด้วยอีเมล</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
