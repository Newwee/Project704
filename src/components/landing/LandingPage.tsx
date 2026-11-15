'use client';

import React from 'react';
import { Logo } from '../common/Logo';
import {
  Sparkles,
  Heart,
  ShieldCheck,
  MessageCircle,
  ArrowRight,
  GraduationCap,
  CheckCircle2,
} from 'lucide-react';
import { DEMO_CURRENT_USER, DEMO_ADMIN_USER } from '@/data/seedData';
import { UserProfile } from '@/types';

interface LandingPageProps {
  onStart: (demoUser?: UserProfile) => void;
  onOpenAuth: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onOpenAuth }) => {
  return (
    <div className="min-h-screen bg-[#FFF9FA] dark:bg-[#111116] text-[#20202A] dark:text-[#F4F3F9] flex flex-col justify-between selection:bg-[#FF526B]/20">
      {/* Header Navigation */}
      <header className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
        <Logo size="md" />

        <div className="flex items-center gap-3">
          <button
            onClick={() => onStart(DEMO_CURRENT_USER)}
            className="px-4 py-2 rounded-xl text-xs font-bold text-[#FF526B] hover:bg-[#FFEBF0] dark:hover:bg-[#281822] transition"
          >
            เข้าใช้งานด่วน (Quick Demo)
          </button>
          <button
            onClick={onOpenAuth}
            className="px-5 py-2.5 rounded-full bg-gradient-brand text-white font-bold text-xs shadow-brand hover:opacity-95 transition"
          >
            เข้าสู่ระบบ (Login)
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-12 sm:py-20 flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFEBF0] dark:bg-[#281822] text-[#FF526B] border border-[#FF526B]/20 text-xs font-bold w-fit mx-auto lg:mx-0 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Meet. Match. Connect. • Exclusive for NMR TUP</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15]">
            ค้นพบมิตรภาพใหม่ <br className="hidden sm:inline" />
            ที่ตรงใจใน{' '}
            <span className="text-gradient-brand drop-shadow-sm">NMR TUP</span>
          </h1>

          <p className="text-sm sm:text-base text-[#8A8994] dark:text-[#9795A7] max-w-xl mx-auto lg:mx-0 leading-relaxed">
            พื้นที่โซเชียลเพื่อการเชื่อมต่อของชาว นวมินทราชินูทิศ เตรียมอุดมศึกษาพัฒนาการ 
            ชวนติวหนังสือ แลกเปลี่ยนชีทเรียน หาเพื่อนร่วมทีมตีแบด เล่นดนตรี และค้นหาเพื่อนที่มีความสนใจตรงกันอย่างปลอดภัย
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
            <button
              onClick={() => onStart(DEMO_CURRENT_USER)}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-brand text-white font-black text-sm shadow-brand hover:scale-105 active:scale-95 transition flex items-center justify-center gap-2"
            >
              <span>เริ่มต้นใช้งาน (Get Started)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onStart(DEMO_ADMIN_USER)}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white dark:bg-[#1A1924] border border-[#F2E3E6] dark:border-[#2C2B3C] text-xs font-bold text-[#8A8994] hover:text-[#20202A] dark:hover:text-white shadow-card flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>โหมดอาจารย์/ผู้ดูแล (Admin Console)</span>
            </button>
          </div>

          {/* Social Proof */}
          <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-[#8A8994]">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#20D994]" />
              <span>ยืนยันนักเรียนจริง</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#FF526B]" />
              <span>Campus Safety Gate</span>
            </div>
          </div>
        </div>

        {/* Visual Hero Mockup Card */}
        <div className="flex-1 relative flex items-center justify-center">
          <div className="relative w-72 sm:w-80 h-[460px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-[#282737] bg-gray-950 rotate-[-3deg] hover:rotate-0 transition-transform duration-300">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
              alt="Mina Preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold">Mina, 17</span>
                <span className="px-2 py-0.5 rounded-full bg-[#20D994] text-black font-bold text-[10px]">
                  Verified
                </span>
              </div>
              <p className="text-xs text-white/80 flex items-center gap-1 mt-0.5">
                <GraduationCap className="w-3.5 h-3.5 text-[#FF7A85]" />
                <span>ศิลป์-ภาษาญี่ปุ่น NMR TUP</span>
              </p>
              <div className="flex gap-1.5 mt-2">
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px]">
                  📷 ถ่ายรูปฟิล์ม
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px]">
                  🎶 T-Pop
                </span>
              </div>
            </div>

            {/* Like Badge Overlay */}
            <div className="absolute top-6 right-4 px-3 py-1 rounded-xl bg-emerald-500/90 text-white font-black text-xs rotate-[12deg] shadow-lg backdrop-blur-xs">
              MATCHED!
            </div>
          </div>

          {/* Underlay Decorative Card */}
          <div className="absolute w-72 sm:w-80 h-[460px] rounded-3xl overflow-hidden bg-gray-900 border border-white/10 shadow-xl rotate-[5deg] -z-10 translate-x-4 opacity-40">
            <img
              src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80"
              alt="Ken Preview"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </main>

      {/* Feature Highlights Grid */}
      <section className="bg-white/80 dark:bg-[#161520]/80 backdrop-blur-md border-t border-[#F2E3E6] dark:border-[#2C2B3C] py-12">
        <div className="max-w-6xl w-full mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-gray-50/70 dark:bg-[#1E1D2A] border border-gray-100 dark:border-gray-800 space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-[#FFEBF0] dark:bg-[#2B1822] text-[#FF526B] flex items-center justify-center font-bold">
                <Heart className="w-5 h-5 fill-[#FF526B]" />
              </div>
              <h3 className="text-base font-bold text-[#20202A] dark:text-[#F4F3F9]">
                Dynamic Swipe Physics
              </h3>
              <p className="text-xs text-[#8A8994] dark:text-[#9795A7] leading-relaxed">
                สัมผัสประสบการณ์ปัดการ์ดแบบ Real Native Mobile ลื่นไหลด้วย Gesture Spring Animation
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-gray-50/70 dark:bg-[#1E1D2A] border border-gray-100 dark:border-gray-800 space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#20202A] dark:text-[#F4F3F9]">
                Dual Mode & Safety Gate
              </h3>
              <p className="text-xs text-[#8A8994] dark:text-[#9795A7] leading-relaxed">
                ระบบแยกโหมด Campus Friends และ Adult Dating 18+ ชัดเจน พร้อม Console ดูแลความปลอดภัย
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-gray-50/70 dark:bg-[#1E1D2A] border border-gray-100 dark:border-gray-800 space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-sky-100 dark:bg-sky-950/60 text-sky-600 flex items-center justify-center font-bold">
                <MessageCircle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#20202A] dark:text-[#F4F3F9]">
                Instant Real-time Chat
              </h3>
              <p className="text-xs text-[#8A8994] dark:text-[#9795A7] leading-relaxed">
                แชตแบบทันทีทันใดหลังแมตช์ ตรวจสอบสิทธิ์ระดับฐานข้อมูล ป้องกันสแปมและคุยได้อย่างมั่นใจ
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 border-t border-[#F2E3E6] dark:border-[#2C2B3C] text-center text-xs text-[#8A8994]">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <Logo size="sm" />
          <span>© 2026 Tinder NMR TUP. All rights reserved. Created for NMR TUP Community.</span>
        </div>
      </footer>
    </div>
  );
};
