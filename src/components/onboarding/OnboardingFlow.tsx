'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Check,
  ChevronRight,
  ChevronLeft,
  GraduationCap,
  Plus,
  Trash2,
} from 'lucide-react';
import { MASTER_INTERESTS } from '@/data/seedData';
import { Gender, ProfilePhoto } from '@/types';
import { Logo } from '../common/Logo';

interface OnboardingFlowProps {
  onComplete: () => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const { currentUser, updateProfile } = useApp();

  const [step, setStep] = useState(1);
  const [displayName, setDisplayName] = useState(currentUser?.display_name || '');
  const [birthdate, setBirthdate] = useState(currentUser?.birthdate || '2008-05-15');
  const [gender, setGender] = useState<Gender>(currentUser?.gender || 'male');
  const [department, setDepartment] = useState(currentUser?.school_department || 'วิทย์-คอมพิวเตอร์');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [photos, setPhotos] = useState<ProfilePhoto[]>(currentUser?.photos || []);
  const [selectedInterests, setSelectedInterests] = useState(currentUser?.interests || []);
  const [preferredGender, setPreferredGender] = useState<'all' | 'male' | 'female' | 'non-binary'>('all');

  const totalSteps = 5;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const newPhoto: ProfilePhoto = {
        id: `photo-${Date.now()}`,
        user_id: currentUser?.id || 'new-user',
        url: result,
        order_index: photos.length,
        is_primary: photos.length === 0,
      };
      setPhotos([...photos, newPhoto]);
    };
    reader.readAsDataURL(file);
  };

  const handleInterestToggle = (interest: typeof MASTER_INTERESTS[0]) => {
    if (selectedInterests.some((i) => i.id === interest.id)) {
      setSelectedInterests(selectedInterests.filter((i) => i.id !== interest.id));
    } else {
      if (selectedInterests.length >= 7) return;
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleFinalSubmit = () => {
    // Calculate age from birthdate
    const birthYear = new Date(birthdate).getFullYear();
    const age = new Date().getFullYear() - birthYear;

    updateProfile({
      display_name: displayName,
      birthdate,
      age: Math.max(15, age),
      gender,
      school_department: department,
      bio,
      photos,
      avatar_url: photos[0]?.url || currentUser?.avatar_url || '',
      interests: selectedInterests,
      preferences: {
        preferred_gender: preferredGender,
        min_age: 16,
        max_age: 19,
        campus_filter: 'all',
        notifications_enabled: true,
        discovery_active: true,
      },
    });

    onComplete();
  };

  return (
    <div className="min-h-screen bg-[#FFF9FA] dark:bg-[#111116] flex flex-col justify-between p-4 sm:p-8">
      {/* Header with Logo & Step Indicators */}
      <div className="max-w-xl w-full mx-auto flex flex-col items-center">
        <Logo size="md" />

        {/* Progress Dots */}
        <div className="flex items-center gap-2 mt-6">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i + 1 === step
                  ? 'w-8 bg-gradient-brand'
                  : i + 1 < step
                  ? 'w-4 bg-emerald-500'
                  : 'w-2 bg-gray-200 dark:bg-gray-800'
              }`}
            />
          ))}
        </div>
        <span className="text-[11px] font-semibold text-[#8A8994] mt-2">
          ขั้นตอนที่ {step} จาก {totalSteps}
        </span>
      </div>

      {/* Main Step Container */}
      <div className="max-w-xl w-full mx-auto my-8 bg-white dark:bg-[#1A1924] rounded-3xl p-6 sm:p-8 border border-[#F2E3E6] dark:border-[#2C2B3C] shadow-card">
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <h2 className="text-xl font-black text-[#20202A] dark:text-[#F4F3F9]">
                ยินดีต้อนรับสู่ Tinder NMR TUP! 🎉
              </h2>
              <p className="text-xs text-[#8A8994] mt-1">
                กรอกข้อมูลส่วนตัวเบื้องต้นเพื่อเริ่มต้นทำความรู้จักเพื่อน ๆ ในสถาบัน
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#20202A] dark:text-[#F4F3F9] mb-1">
                ชื่อที่ต้องการให้แสดง (Display Name) *
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="เช่น ภูเขา, มินา, เคน"
                className="w-full text-sm p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#201F2C] text-[#20202A] dark:text-[#F4F3F9] focus:outline-none focus:border-[#FF526B]"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#20202A] dark:text-[#F4F3F9] mb-1">
                  วันเกิด (Date of Birth) *
                </label>
                <input
                  type="date"
                  value={birthdate}
                  onChange={(e) => setBirthdate(e.target.value)}
                  className="w-full text-sm p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#201F2C] text-[#20202A] dark:text-[#F4F3F9] focus:outline-none focus:border-[#FF526B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#20202A] dark:text-[#F4F3F9] mb-1">
                  เพศ (Gender) *
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as Gender)}
                  className="w-full text-sm p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#201F2C] text-[#20202A] dark:text-[#F4F3F9] focus:outline-none focus:border-[#FF526B]"
                >
                  <option value="male">ชาย (Male)</option>
                  <option value="female">หญิง (Female)</option>
                  <option value="non-binary">Non-binary</option>
                  <option value="other">อื่น ๆ (Other)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#20202A] dark:text-[#F4F3F9] mb-1">
                แผนการเรียน / สายการเรียน (School / Department) *
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="เช่น วิทย์-คณิต, ศิลป์-ภาษา, วิทย์-คอมพิวเตอร์"
                className="w-full text-sm p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#201F2C] text-[#20202A] dark:text-[#F4F3F9] focus:outline-none focus:border-[#FF526B]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#20202A] dark:text-[#F4F3F9] mb-1">
                เกี่ยวกับฉัน (Bio)
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="บอกเล่าเรื่องราวความชอบ หรือสิ่งที่อยากชวนเพื่อน ๆ ทำร่วมกัน..."
                className="w-full text-sm p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#201F2C] text-[#20202A] dark:text-[#F4F3F9] focus:outline-none focus:border-[#FF526B]"
              />
            </div>
          </div>
        )}

        {/* Step 2: Photos */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <h2 className="text-xl font-black text-[#20202A] dark:text-[#F4F3F9]">
                อัปโหลดรูปถ่ายโปรไฟล์ 📸
              </h2>
              <p className="text-xs text-[#8A8994] mt-1">
                รูปถ่ายที่ดูสดใส ชัดเจน และสะท้อนตัวตนของคุณ
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {photos.map((p, idx) => (
                <div
                  key={p.id}
                  className="relative h-36 rounded-2xl overflow-hidden bg-gray-900 border border-gray-200 dark:border-gray-800 group"
                >
                  <img src={p.url} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
                  {idx === 0 && (
                    <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-gradient-brand text-white text-[9px] font-bold">
                      รูปหลัก
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => setPhotos(photos.filter((item) => item.id !== p.id))}
                    className="absolute top-1.5 right-1.5 p-1 rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {photos.length < 6 && (
                <label className="h-36 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-[#FF526B] bg-gray-50 dark:bg-[#201F2C] flex flex-col items-center justify-center gap-2 cursor-pointer transition">
                  <div className="w-10 h-10 rounded-full bg-[#FFEBF0] dark:bg-[#2B1822] text-[#FF526B] flex items-center justify-center">
                    <Plus className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-semibold text-[#8A8994]">เพิ่มรูป</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Interests */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <h2 className="text-xl font-black text-[#20202A] dark:text-[#F4F3F9]">
                เลือกสิ่งที่คุณสนใจ 🎨
              </h2>
              <p className="text-xs text-[#8A8994] mt-1">
                เลือกความสนใจและกิจกรรมที่ชอบ เพื่อให้อัลกอริทึมจับคู่คนที่สนใจเหมือนกัน (เลือกได้ 3-7 อย่าง)
              </p>
            </div>

            <div className="flex flex-wrap gap-2 max-h-72 overflow-y-auto p-1">
              {MASTER_INTERESTS.map((interest) => {
                const isSelected = selectedInterests.some((i) => i.id === interest.id);
                return (
                  <button
                    key={interest.id}
                    type="button"
                    onClick={() => handleInterestToggle(interest)}
                    className={`px-3 py-2 rounded-2xl text-xs font-semibold border transition flex items-center gap-1.5 ${
                      isSelected
                        ? 'border-[#FF526B] bg-[#FFF2F5] dark:bg-[#281822] text-[#FF526B]'
                        : 'border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#201F2C] text-[#20202A] dark:text-[#F4F3F9]'
                    }`}
                  >
                    <span>{interest.icon}</span>
                    <span>{interest.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4: Preferences */}
        {step === 4 && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <h2 className="text-xl font-black text-[#20202A] dark:text-[#F4F3F9]">
                การตั้งค่าการเชื่อมต่อ (Preferences) 🎯
              </h2>
              <p className="text-xs text-[#8A8994] mt-1">
                กำหนดกลุ่มเพื่อนที่คุณต้องการพบในระบบค้นหา
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#20202A] dark:text-[#F4F3F9] mb-2">
                ต้องการค้นหาเพื่อนเพศใด?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'all', label: 'ทุกคน (All Genders)' },
                  { id: 'female', label: 'เฉพาะผู้หญิง (Women)' },
                  { id: 'male', label: 'เฉพาะผู้ชาย (Men)' },
                  { id: 'non-binary', label: 'Non-binary' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setPreferredGender(opt.id as 'all' | 'male' | 'female' | 'non-binary')}
                    className={`p-3 rounded-xl text-xs font-semibold border text-left transition ${
                      preferredGender === opt.id
                        ? 'border-[#FF526B] bg-[#FFF2F5] dark:bg-[#281822] text-[#FF526B]'
                        : 'border-gray-200 dark:border-gray-800 text-[#8A8994]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-800 dark:text-emerald-300">
              <span className="font-bold">✨ ระบบ Campus Friends:</span> มุ่งเน้นการเชื่อมต่อเพื่อนเพื่อกิจกรรมและการเรียนรู้ร่วมกันในสถาบันอย่างปลอดภัย
            </div>
          </div>
        )}

        {/* Step 5: Profile Preview */}
        {step === 5 && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <h2 className="text-xl font-black text-[#20202A] dark:text-[#F4F3F9]">
                ตรวจสอบหน้าตาโปรไฟล์ของคุณ ✨
              </h2>
              <p className="text-xs text-[#8A8994] mt-1">
                นี่คือหน้าตาโปรไฟล์ที่เพื่อน ๆ ใน NMR TUP จะมองเห็น
              </p>
            </div>

            <div className="relative rounded-3xl overflow-hidden shadow-card border border-gray-200 dark:border-gray-800 h-80 bg-gray-900">
              <img
                src={photos[0]?.url || currentUser?.avatar_url}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="text-xl font-bold">{displayName || 'ชื่อของคุณ'}</h3>
                <p className="text-xs text-white/80 flex items-center gap-1.5 mt-0.5">
                  <GraduationCap className="w-3.5 h-3.5 text-[#FF7A85]" />
                  <span>{department}</span>
                </p>
                <p className="text-xs text-white/90 line-clamp-2 mt-1">{bio || 'ยังไม่มีคำแนะนำตัว'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Step Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-800 mt-6">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 text-xs font-semibold text-[#8A8994] hover:bg-gray-50 flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              ย้อนกลับ
            </button>
          ) : (
            <div />
          )}

          {step < totalSteps ? (
            <button
              type="button"
              disabled={step === 1 && !displayName.trim()}
              onClick={() => setStep(step + 1)}
              className="px-6 py-2.5 rounded-xl bg-gradient-brand text-white font-bold text-xs shadow-brand hover:opacity-95 disabled:opacity-40 flex items-center gap-1.5 transition"
            >
              ถัดไป
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinalSubmit}
              className="px-6 py-2.5 rounded-xl bg-gradient-brand text-white font-bold text-xs shadow-brand hover:opacity-95 flex items-center gap-1.5 transition"
            >
              <Check className="w-4 h-4" />
              ยืนยันและเริ่มใช้งานเลย
            </button>
          )}
        </div>
      </div>

      <div className="text-center text-[11px] text-[#8A8994]">
        Tinder NMR TUP • Safe Campus Social Platform
      </div>
    </div>
  );
};
