'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Logo } from '../common/Logo';
import { X, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { DEMO_CURRENT_USER, DEMO_ADMIN_USER } from '@/data/seedData';
import { UserProfile } from '@/types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (isNewUser?: boolean) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { loginAs } = useApp();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    if (isSignUp) {
      // Create new profile
      const newUser: UserProfile = {
        id: `user-${Date.now()}`,
        email,
        display_name: name || email.split('@')[0],
        birthdate: '2008-01-01',
        age: 17,
        gender: 'female',
        bio: 'ยินดีที่ได้รู้จักทุกคนใน NMR TUP จ้า!',
        school_department: 'NMR TUP Student',
        mode: 'CAMPUS_FRIENDS',
        is_verified: true,
        is_hidden: false,
        is_suspended: false,
        is_banned: false,
        is_admin: false,
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
        photos: [
          {
            id: `p-${Date.now()}`,
            user_id: `user-${Date.now()}`,
            url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
            order_index: 0,
            is_primary: true,
          },
        ],
        interests: [],
        preferences: {
          preferred_gender: 'all',
          min_age: 16,
          max_age: 19,
          campus_filter: 'all',
          notifications_enabled: true,
          discovery_active: true,
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      loginAs(newUser);
      onSuccess(true);
    } else {
      // Login with Demo user
      loginAs(DEMO_CURRENT_USER);
      onSuccess(false);
    }
    onClose();
  };

  const handleQuickDemoLogin = (profile: UserProfile) => {
    loginAs(profile);
    onSuccess(false);
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
            {isSignUp ? 'สร้างบัญชีผู้ใช้ใหม่' : 'เข้าสู่ระบบ Tinder NMR TUP'}
          </h2>
          <p className="text-xs text-[#8A8994] mt-0.5">
            {isSignUp
              ? 'กรอกข้อมูลเพื่อเชื่อมต่อกับเพื่อนในสถาบัน'
              : 'ยินดีต้อนรับกลับเข้าสู่ระบบ'}
          </p>
        </div>

        {/* Quick Demo Login Cards */}
        <div className="mb-5 p-3 rounded-2xl bg-gray-50 dark:bg-[#201F2C] border border-gray-100 dark:border-gray-800 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8994] block text-center">
            ⚡ Quick 1-Click Evaluation Logins
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin(DEMO_CURRENT_USER)}
              className="p-2 rounded-xl bg-white dark:bg-[#15141E] border border-[#F2E3E6] dark:border-[#2C2B3C] text-left hover:border-[#FF526B] transition shadow-xs flex items-center gap-2"
            >
              <img
                src={DEMO_CURRENT_USER.avatar_url}
                alt="Phukao"
                className="w-7 h-7 rounded-full object-cover shrink-0"
              />
              <div className="min-w-0">
                <span className="text-xs font-bold text-[#20202A] dark:text-[#F4F3F9] truncate block">
                  Phukao (นักเรียน)
                </span>
                <span className="text-[9px] text-[#8A8994] block">Swipes & Chat</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin(DEMO_ADMIN_USER)}
              className="p-2 rounded-xl bg-white dark:bg-[#15141E] border border-[#F2E3E6] dark:border-[#2C2B3C] text-left hover:border-[#FF526B] transition shadow-xs flex items-center gap-2"
            >
              <img
                src={DEMO_ADMIN_USER.avatar_url}
                alt="Admin"
                className="w-7 h-7 rounded-full object-cover shrink-0"
              />
              <div className="min-w-0">
                <span className="text-xs font-bold text-[#20202A] dark:text-[#F4F3F9] truncate block">
                  Kru Wittaya (อาจารย์)
                </span>
                <span className="text-[9px] text-emerald-600 font-semibold block">Admin Console</span>
              </div>
            </button>
          </div>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {isSignUp && (
            <div>
              <label className="block text-xs font-semibold text-[#20202A] dark:text-[#F4F3F9] mb-1">
                ชื่อที่แสดง (Display Name)
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#8A8994] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ชื่อเล่นหรือชื่อจริง"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#201F2C] text-xs text-[#20202A] dark:text-[#F4F3F9] focus:outline-none focus:border-[#FF526B]"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#20202A] dark:text-[#F4F3F9] mb-1">
              อีเมลโรงเรียนหรืออีเมลส่วนตัว (Email)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8A8994] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@nmrtup.ac.th"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#201F2C] text-xs text-[#20202A] dark:text-[#F4F3F9] focus:outline-none focus:border-[#FF526B]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#20202A] dark:text-[#F4F3F9] mb-1">
              รหัสผ่าน (Password)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8A8994] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#201F2C] text-xs text-[#20202A] dark:text-[#F4F3F9] focus:outline-none focus:border-[#FF526B]"
                required
              />
            </div>
          </div>

          {errorMsg && (
            <p className="text-xs text-red-500 font-semibold">{errorMsg}</p>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-brand text-white font-bold text-xs shadow-brand hover:opacity-95 transition flex items-center justify-center gap-1.5"
          >
            <span>{isSignUp ? 'สร้างบัญชีและไปต่อ' : 'เข้าสู่ระบบ'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setErrorMsg('');
            }}
            className="text-xs text-[#FF526B] font-semibold hover:underline"
          >
            {isSignUp
              ? 'มีบัญชีอยู่แล้ว? เข้าสู่ระบบที่นี่'
              : 'ยังไม่มีบัญชี? สมัครสมาชิกใหม่'}
          </button>
        </div>
      </div>
    </div>
  );
};
