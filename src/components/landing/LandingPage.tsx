'use client';

import React from 'react';
import { Logo } from '../common/Logo';
import GradientText from '@/components/reactbits/GradientText/GradientText';
import {
  Sparkles,
  Heart,
  ShieldCheck,
  MessageCircle,
  ArrowRight,
  UserPlus,
  LogIn,
  CheckCircle2,
} from 'lucide-react';

interface LandingPageProps {
  onStartRegister: () => void;
  onOpenAuth: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartRegister, onOpenAuth }) => {
  return (
    <div className="min-h-screen bg-[#FFF9FA] dark:bg-[#111116] text-[#20202A] dark:text-[#F4F3F9] flex flex-col justify-between selection:bg-[#FF526B]/20">
      {/* Header Navigation */}
      <header className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
        <Logo size="md" />

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenAuth}
            className="px-4 py-2 rounded-xl text-xs font-bold text-[#FF526B] hover:bg-[#FFEBF0] dark:hover:bg-[#281822] transition flex items-center gap-1.5"
          >
            <LogIn className="w-3.5 h-3.5" />
            เข้าสู่ระบบ (Login)
          </button>
          <button
            onClick={onStartRegister}
            className="px-5 py-2.5 rounded-full bg-gradient-brand text-white font-bold text-xs shadow-brand hover:opacity-95 transition flex items-center gap-1.5"
          >
            <UserPlus className="w-3.5 h-3.5" />
            สร้างบัญชีใหม่
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
            <GradientText
              colors={['#FF416C', '#FF526B', '#FF7A85', '#FFA07A', '#FF416C']}
              animationSpeed={6}
              variant="flow"
              className="inline-block drop-shadow-sm font-black"
            >
              NMR TUP
            </GradientText>
          </h1>

          <p className="text-sm sm:text-base text-[#8A8994] dark:text-[#9795A7] max-w-xl mx-auto lg:mx-0 leading-relaxed">
            พื้นที่โซเชียลเพื่อการเชื่อมต่อของชาว นวมินทราชินูทิศ เตรียมอุดมศึกษาพัฒนาการ 
            สมัครสมาชิก ใส่รูปจริงและข้อมูลส่วนตัว เพื่อเริ่มค้นหาเพื่อนร่วมสถาบัน แลกเปลี่ยนความชอบ และชวนกันทำกิจกรรม
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
            <button
              onClick={onStartRegister}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-brand text-white font-black text-sm shadow-brand hover:scale-105 active:scale-95 transition flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>สร้างบัญชีของคุณเลย (Sign Up)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenAuth}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white dark:bg-[#1A1924] border border-[#F2E3E6] dark:border-[#2C2B3C] text-xs font-bold text-[#8A8994] hover:text-[#20202A] dark:hover:text-white shadow-card flex items-center justify-center gap-1.5"
            >
              <LogIn className="w-4 h-4" />
              <span>มีบัญชีอยู่แล้ว? เข้าสู่ระบบ</span>
            </button>
          </div>

          {/* Social Proof */}
          <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-[#8A8994]">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#20D994]" />
              <span>ใส่รูปจริงเพื่อเริ่มใช้งาน</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#FF526B]" />
              <span>Campus Friends Community</span>
            </div>
          </div>
        </div>

        {/* Visual Hero Feature Graphics */}
        <div className="flex-1 relative flex items-center justify-center">
          <div className="relative w-72 sm:w-80 h-[440px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-[#282737] bg-gradient-brand p-8 text-white flex flex-col justify-between rotate-[-2deg] hover:rotate-0 transition-transform duration-300">
            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-bold backdrop-blur-md">
                Tinder NMR TUP
              </span>
              <h3 className="text-2xl font-black mt-2">
                เริ่มต้นง่าย ๆ เพียงสร้างโปรไฟล์
              </h3>
              <p className="text-xs text-white/90 leading-relaxed">
                ใส่รูปถ่ายที่สะท้อนตัวตนของคุณ เลือกสายการเรียน และระบุความสนใจ แล้วระบบจะนำคุณไปพบเพื่อน ๆ ในโรงเรียนทันที
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 space-y-2">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 fill-white" />
                <span className="font-bold text-sm">ปัดวนลูปต่อเนื่อง</span>
              </div>
              <p className="text-[11px] text-white/80">
                เมื่อมีเพื่อน ๆ ในระบบ การ์ดจะวนลูปให้คุณค้นพบได้อย่างไม่มีสะดุด
              </p>
            </div>
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
                Infinite Swipe Looping
              </h3>
              <p className="text-xs text-[#8A8994] dark:text-[#9795A7] leading-relaxed">
                ปัดการ์ดเพื่อน ๆ ครบทุกคนแล้ว ระบบจะวนลูปกลับมาเริ่มใหม่เรื่อย ๆ ไม่มีติดขัด
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-gray-50/70 dark:bg-[#1E1D2A] border border-gray-100 dark:border-gray-800 space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#20202A] dark:text-[#F4F3F9]">
                Real Profiles & Verification
              </h3>
              <p className="text-xs text-[#8A8994] dark:text-[#9795A7] leading-relaxed">
                ทุกคนต้องใส่รูปจริงและข้อมูลสายการเรียน เพื่อความโปร่งใสและปลอดภัยของชุมชน
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-gray-50/70 dark:bg-[#1E1D2A] border border-gray-100 dark:border-gray-800 space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-sky-100 dark:bg-sky-950/60 text-sky-600 flex items-center justify-center font-bold">
                <MessageCircle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#20202A] dark:text-[#F4F3F9]">
                Persistent Chat History
              </h3>
              <p className="text-xs text-[#8A8994] dark:text-[#9795A7] leading-relaxed">
                ข้อความและประวัติการสนทนาถูกจัดเก็บไว้อย่างครบถ้วน สามารถกลับมาคุยต่อได้เสมอ
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 border-t border-[#F2E3E6] dark:border-[#2C2B3C] text-center text-xs text-[#8A8994]">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <Logo size="sm" />
          <span>© 2026 Tinder NMR TUP. Created for NMR TUP Community.</span>
        </div>
      </footer>
    </div>
  );
};
