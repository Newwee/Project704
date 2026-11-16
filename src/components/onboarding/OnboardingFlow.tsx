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
  AlertCircle,
  Camera,
  Mail,
  User,
} from 'lucide-react';
import { MASTER_INTERESTS } from '@/data/seedData';
import { Gender, ProfilePhoto, UserProfile } from '@/types';
import { Logo } from '../common/Logo';
import { compressImage } from '@/lib/imageOptimizer';

interface OnboardingFlowProps {
  onComplete: () => void;
  onCancel?: () => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete, onCancel }) => {
  const { registerUser } = useApp();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [birthdate, setBirthdate] = useState('2008-05-15');
  const [gender, setGender] = useState<Gender>('female');
  const [department, setDepartment] = useState('วิทย์-คณิต');
  const [bio, setBio] = useState('');
  const [photos, setPhotos] = useState<ProfilePhoto[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<typeof MASTER_INTERESTS>([]);
  const [preferredGender, setPreferredGender] = useState<'all' | 'male' | 'female' | 'non-binary'>('all');
  const [errorMsg, setErrorMsg] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = 5;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('กรุณาเลือกไฟล์รูปภาพที่ถูกต้อง (JPEG, PNG, WebP)');
      return;
    }

    setErrorMsg('');
    setIsCompressing(true);

    try {
      // Compress with Canvas to max 720px and quality 0.75 (~35KB)
      const compressedDataUrl = await compressImage(file, 720, 720, 0.75);

      // Attempt server upload for clean /uploads/ URL, fallback to compressedDataUrl
      let finalUrl = compressedDataUrl;
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dataUrl: compressedDataUrl }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.url) finalUrl = data.url;
        }
      } catch (uploadErr) {
        console.warn('API upload fallback:', uploadErr);
      }

      const newPhoto: ProfilePhoto = {
        id: `photo-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        user_id: 'new-user',
        url: finalUrl,
        order_index: photos.length,
        is_primary: photos.length === 0,
      };
      setPhotos((prev) => [...prev, newPhoto]);
    } catch (err) {
      console.error('Image compression error:', err);
      setErrorMsg('เกิดข้อผิดพลาดในการประมวลผลรูปภาพ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleInterestToggle = (interest: typeof MASTER_INTERESTS[0]) => {
    if (selectedInterests.some((i) => i.id === interest.id)) {
      setSelectedInterests(selectedInterests.filter((i) => i.id !== interest.id));
    } else {
      if (selectedInterests.length >= 7) return;
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const validateCurrentStep = (): boolean => {
    setErrorMsg('');
    if (step === 1) {
      if (!displayName.trim()) {
        setErrorMsg('กรุณาระบุชื่อที่ต้องการให้แสดง');
        return false;
      }
      if (!department.trim()) {
        setErrorMsg('กรุณาระบุแผนการเรียนหรือสายการเรียน');
        return false;
      }
    } else if (step === 2) {
      if (photos.length === 0) {
        setErrorMsg('จำเป็นต้องใส่รูปถ่ายโปรไฟล์อย่างน้อย 1 รูป หากไม่ใส่จะไม่สามารถเข้าใช้งานได้');
        return false;
      }
    } else if (step === 3) {
      if (selectedInterests.length === 0) {
        setErrorMsg('กรุณาเลือกสิ่งที่สนใจอย่างน้อย 1 อย่าง');
        return false;
      }
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateCurrentStep()) {
      setStep((prev) => prev + 1);
    }
  };

  const handleFinalSubmit = async () => {
    if (photos.length === 0 || !displayName.trim()) {
      setErrorMsg('กรุณากรอกข้อมูลและอัปโหลดรูปภาพให้ครบถ้วน');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const birthYear = new Date(birthdate).getFullYear();
      const age = Math.max(15, new Date().getFullYear() - birthYear);
      const userId = `user-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

      const newUser: UserProfile = {
        id: userId,
        email: email.trim() || `${userId}@nmrtup.ac.th`,
        display_name: displayName.trim(),
        birthdate,
        age,
        gender,
        school_department: department.trim(),
        bio: bio.trim() || 'สวัสดีครับ/ค่ะ ยินดีที่ได้รู้จักทุกคนใน NMR TUP นะ!',
        mode: 'CAMPUS_FRIENDS',
        is_verified: true,
        is_hidden: false,
        is_suspended: false,
        is_banned: false,
        is_admin: false,
        avatar_url: photos[0].url,
        photos: photos.map((p, idx) => ({ ...p, user_id: userId, order_index: idx })),
        interests: selectedInterests,
        preferences: {
          preferred_gender: preferredGender,
          min_age: 16,
          max_age: 19,
          campus_filter: 'all',
          notifications_enabled: true,
          discovery_active: true,
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      await registerUser(newUser);
      onComplete();
    } catch (err) {
      console.error('Registration finish error:', err);
      setErrorMsg('เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9FA] dark:bg-[#111116] flex flex-col justify-between p-4 sm:p-8">
      {/* Header */}
      <div className="max-w-xl w-full mx-auto flex flex-col items-center">
        <Logo size="md" />

        {/* Step Dots */}
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

      {/* Main Card */}
      <div className="max-w-xl w-full mx-auto my-6 bg-white dark:bg-[#1A1924] rounded-3xl p-6 sm:p-8 border border-[#F2E3E6] dark:border-[#2C2B3C] shadow-card">
        {errorMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <h2 className="text-xl font-black text-[#20202A] dark:text-[#F4F3F9]">
                สร้างบัญชีโปรไฟล์ใหม่ 📝
              </h2>
              <p className="text-xs text-[#8A8994] mt-1">
                กรอกข้อมูลนักเรียนของคุณเพื่อเริ่มใช้งาน (จำเป็นต้องใส่ข้อมูลจริงเพื่อความปลอดภัย)
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#20202A] dark:text-[#F4F3F9] mb-1">
                ชื่อที่ต้องการให้แสดง (Display Name) *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#8A8994] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="เช่น พลอย, บอส, มินท์"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#201F2C] text-xs sm:text-sm text-[#20202A] dark:text-[#F4F3F9] focus:outline-none focus:border-[#FF526B]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#20202A] dark:text-[#F4F3F9] mb-1">
                อีเมล (Email)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8A8994] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@nmrtup.ac.th (ถ้ามี)"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#201F2C] text-xs sm:text-sm text-[#20202A] dark:text-[#F4F3F9] focus:outline-none focus:border-[#FF526B]"
                />
              </div>
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
                  className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#201F2C] text-[#20202A] dark:text-[#F4F3F9] focus:outline-none focus:border-[#FF526B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#20202A] dark:text-[#F4F3F9] mb-1">
                  เพศ (Gender) *
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as Gender)}
                  className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#201F2C] text-[#20202A] dark:text-[#F4F3F9] focus:outline-none focus:border-[#FF526B]"
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
                แผนการเรียน / สายการเรียน (Department / Major) *
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="เช่น วิทย์-คณิต, ศิลป์-คำนวณ, ศิลป์-ภาษา"
                className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#201F2C] text-[#20202A] dark:text-[#F4F3F9] focus:outline-none focus:border-[#FF526B]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#20202A] dark:text-[#F4F3F9] mb-1">
                เกี่ยวกับฉัน (Bio / About Me)
              </label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="ความชอบ สิ่งที่กำลังสนใจ หรือชวนคุยเรื่องอะไร..."
                className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#201F2C] text-[#20202A] dark:text-[#F4F3F9] focus:outline-none focus:border-[#FF526B]"
              />
            </div>
          </div>
        )}

        {/* Step 2: Photos (MANDATORY) */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <h2 className="text-xl font-black text-[#20202A] dark:text-[#F4F3F9] flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#FF526B]" />
                อัปโหลดรูปถ่ายของคุณ * (จำเป็น)
              </h2>
              <p className="text-xs text-rose-500 font-semibold mt-1">
                * ต้องใส่รูปถ่ายอย่างน้อย 1 รูปภาพ หากไม่ใส่รูปภาพจะไม่สามารถเข้าใช้งานได้
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
                <label className={`h-36 rounded-2xl border-2 border-dashed border-[#FF526B]/50 hover:border-[#FF526B] bg-[#FFF8FA] dark:bg-[#201F2C] flex flex-col items-center justify-center gap-2 transition ${isCompressing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                  <div className="w-10 h-10 rounded-full bg-[#FFEBF0] dark:bg-[#2B1822] text-[#FF526B] flex items-center justify-center shadow-xs">
                    <Plus className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-[#FF526B]">เลือกรูปภาพ</span>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={isCompressing}
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {isCompressing && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 text-xs font-semibold flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                <span>กำลังปรับขนาดรูปภาพให้เหมาะสม...</span>
              </div>
            )}

            {photos.length > 0 && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <Check className="w-4 h-4" />
                อัปโหลดรูปภาพแล้ว {photos.length} รูป
              </p>
            )}
          </div>
        )}

        {/* Step 3: Interests */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <h2 className="text-xl font-black text-[#20202A] dark:text-[#F4F3F9]">
                เลือกสิ่งที่คุณสนใจ 🎨 *
              </h2>
              <p className="text-xs text-[#8A8994] mt-1">
                เลือกความสนใจและกิจกรรมที่ชอบอย่างน้อย 1 อย่าง (เลือกได้สูงสุด 7 อย่าง)
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

            {selectedInterests.length > 0 && (
              <span className="text-xs font-bold text-[#FF526B] block">
                เลือกแล้ว {selectedInterests.length} อย่าง
              </span>
            )}
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
                โปรไฟล์ของคุณพร้อมแล้ว กดยืนยันเพื่อเริ่มใช้งาน
              </p>
            </div>

            <div className="relative rounded-3xl overflow-hidden shadow-card border border-gray-200 dark:border-gray-800 h-80 bg-gray-900">
              {photos[0]?.url && (
                <img
                  src={photos[0].url}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="text-xl font-bold">{displayName || 'ชื่อของคุณ'}</h3>
                <p className="text-xs text-white/80 flex items-center gap-1.5 mt-0.5">
                  <GraduationCap className="w-3.5 h-3.5 text-[#FF7A85]" />
                  <span>{department}</span>
                </p>
                <p className="text-xs text-white/90 line-clamp-2 mt-1">{bio || 'ยังไม่มีคำแนะนำตัว'}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedInterests.map((item) => (
                    <span key={item.id} className="px-2 py-0.5 rounded-full bg-white/20 text-[10px]">
                      {item.icon} {item.name}
                    </span>
                  ))}
                </div>
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
            onCancel ? (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 text-xs font-semibold text-[#8A8994] hover:bg-gray-50"
              >
                ยกเลิก
              </button>
            ) : <div />
          )}

          {step < totalSteps ? (
            <button
              type="button"
              disabled={isCompressing}
              onClick={handleNextStep}
              className="px-6 py-2.5 rounded-xl bg-gradient-brand text-white font-bold text-xs shadow-brand hover:opacity-95 flex items-center gap-1.5 transition disabled:opacity-50"
            >
              ถัดไป
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting || isCompressing}
              onClick={handleFinalSubmit}
              className="px-6 py-2.5 rounded-xl bg-gradient-brand text-white font-bold text-xs shadow-brand hover:opacity-95 flex items-center gap-1.5 transition disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>กำลังบันทึกข้อมูล...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>สร้างบัญชีและเริ่มใช้งาน</span>
                </>
              )}
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
