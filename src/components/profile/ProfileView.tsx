'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Camera,
  Trash2,
  Plus,
  Check,
  Eye,
  Sparkles,
  Save,
  Moon,
  Sun,
  LogOut,
  AlertCircle,
} from 'lucide-react';
import { MASTER_INTERESTS } from '@/data/seedData';
import { Gender, ProfilePhoto } from '@/types';
import { ProfileDetailModal } from '../discovery/ProfileDetailModal';

export const ProfileView: React.FC = () => {
  const {
    currentUser,
    updateProfile,
    isDarkMode,
    toggleDarkMode,
    logout,
  } = useApp();

  const [displayName, setDisplayName] = useState(currentUser?.display_name || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [department, setDepartment] = useState(currentUser?.school_department || 'General');
  const [gender, setGender] = useState(currentUser?.gender || 'male');
  const [selectedInterests, setSelectedInterests] = useState(currentUser?.interests || []);
  const [photos, setPhotos] = useState<ProfilePhoto[]>(currentUser?.photos || []);
  const [isHidden, setIsHidden] = useState(currentUser?.is_hidden || false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');

  if (!currentUser) return null;

  // Calculate Profile Completion Percentage
  let completionScore = 0;
  if (displayName) completionScore += 20;
  if (bio) completionScore += 20;
  if (photos.length >= 1) completionScore += 25;
  if (photos.length >= 3) completionScore += 10;
  if (selectedInterests.length >= 3) completionScore += 25;

  const handleInterestToggle = (interest: typeof MASTER_INTERESTS[0]) => {
    const exists = selectedInterests.some((i) => i.id === interest.id);
    if (exists) {
      setSelectedInterests(selectedInterests.filter((i) => i.id !== interest.id));
    } else {
      if (selectedInterests.length >= 7) return; // max 7
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  // Image Upload Handler (Real File Reading to Data URL with validation)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    if (!file.type.startsWith('image/')) {
      setUploadError('กรุณาเลือกไฟล์รูปภาพที่ถูกต้อง (JPEG, PNG, WebP)');
      return;
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('ขนาดไฟล์ต้องไม่เกิน 5MB');
      return;
    }

    setUploadError('');
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const newPhoto: ProfilePhoto = {
        id: `photo-${Date.now()}`,
        user_id: currentUser.id,
        url: result,
        order_index: photos.length,
        is_primary: photos.length === 0,
      };
      setPhotos([...photos, newPhoto]);
    };
    reader.readAsDataURL(file);
  };

  const handleDeletePhoto = (photoId: string) => {
    setPhotos(photos.filter((p) => p.id !== photoId));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      display_name: displayName,
      bio,
      school_department: department,
      gender,
      interests: selectedInterests,
      photos,
      avatar_url: photos[0]?.url || currentUser.avatar_url,
      is_hidden: isHidden,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-4 sm:py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#20202A] dark:text-[#F4F3F9]">
            โปรไฟล์ของฉัน (My Profile)
          </h1>
          <p className="text-xs text-[#8A8994] dark:text-[#9795A7] mt-0.5">
            จัดการรูปภาพ ข้อมูล และความสนใจของคุณใน Spark
          </p>
        </div>

        <button
          onClick={() => setPreviewOpen(true)}
          className="px-4 py-2 rounded-xl bg-white dark:bg-[#201F2C] border border-[#F2E3E6] dark:border-[#2C2B3C] shadow-sm text-xs font-bold text-[#FF526B] hover:bg-gray-50 flex items-center gap-1.5 transition"
        >
          <Eye className="w-4 h-4" />
          ดูตัวอย่างโปรไฟล์
        </button>
      </div>

      {/* Completion Progress Banner */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1A1924] border border-[#F2E3E6] dark:border-[#2C2B3C] shadow-card">
        <div className="flex items-center justify-between text-xs font-bold mb-2">
          <span className="text-[#20202A] dark:text-[#F4F3F9] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            ความสมบูรณ์ของโปรไฟล์ (Profile Completion)
          </span>
          <span className="text-[#FF526B]">{completionScore}%</span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
          <div
            className="h-full bg-gradient-brand transition-all duration-500 rounded-full"
            style={{ width: `${completionScore}%` }}
          />
        </div>
        <p className="text-[11px] text-[#8A8994] mt-1.5">
          โปรไฟล์ที่ระบุข้อมูลครบถ้วนมีโอกาสค้นพบเพื่อนและกิจกรรมที่ตรงใจเพิ่มขึ้น 3 เท่า
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Photos Grid Section */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#1A1924] border border-[#F2E3E6] dark:border-[#2C2B3C] shadow-card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm text-[#20202A] dark:text-[#F4F3F9] flex items-center gap-2">
              <Camera className="w-4 h-4 text-[#FF526B]" />
              รูปถ่ายโปรไฟล์ ({photos.length}/6)
            </h3>
            <span className="text-[11px] text-[#8A8994]">รูปแรกจะใช้เป็นภาพหลัก</span>
          </div>

          {uploadError && (
            <div className="mb-3 p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-500 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{uploadError}</span>
            </div>
          )}

          <div className="grid grid-cols-3 gap-3">
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                className="relative h-36 sm:h-44 rounded-2xl overflow-hidden bg-gray-900 border border-gray-100 dark:border-gray-800 group"
              >
                <img
                  src={photo.url}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {index === 0 && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-gradient-brand text-white text-[10px] font-bold shadow-sm">
                    รูปหลัก
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => handleDeletePhoto(photo.id)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600/80 text-white opacity-0 group-hover:opacity-100 transition shadow-sm"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {photos.length < 6 && (
              <label className="h-36 sm:h-44 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-[#FF526B] dark:hover:border-[#FF526B] bg-gray-50 dark:bg-[#201F2C] flex flex-col items-center justify-center gap-2 cursor-pointer transition">
                <div className="w-10 h-10 rounded-full bg-[#FFEBF0] dark:bg-[#2B1822] text-[#FF526B] flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-[#8A8994]">เพิ่มรูปถ่าย</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Basic Information */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#1A1924] border border-[#F2E3E6] dark:border-[#2C2B3C] shadow-card space-y-4">
          <h3 className="font-bold text-sm text-[#20202A] dark:text-[#F4F3F9]">
            ข้อมูลพื้นฐาน (Basic Details)
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#20202A] dark:text-[#F4F3F9] mb-1">
                ชื่อที่แสดง (Display Name)
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#201F2C] text-[#20202A] dark:text-[#F4F3F9] focus:outline-none focus:border-[#FF526B]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#20202A] dark:text-[#F4F3F9] mb-1">
                เพศ (Gender)
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as Gender)}
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#201F2C] text-[#20202A] dark:text-[#F4F3F9] focus:outline-none focus:border-[#FF526B]"
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
              แผนการเรียน / สายการเรียน / คณะ (Department / Major)
            </label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="เช่น วิทย์-คณิต, ศิลป์-ภาษา, วิทย์-คอมพิวเตอร์"
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#201F2C] text-[#20202A] dark:text-[#F4F3F9] focus:outline-none focus:border-[#FF526B]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#20202A] dark:text-[#F4F3F9] mb-1">
              เกี่ยวกับฉัน (Bio / About Me)
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="แนะนำตัวสั้น ๆ ความชอบ กิจกรรมที่ชอบทำในโรงเรียน..."
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#201F2C] text-[#20202A] dark:text-[#F4F3F9] focus:outline-none focus:border-[#FF526B]"
            />
          </div>
        </div>

        {/* Interests Selection */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#1A1924] border border-[#F2E3E6] dark:border-[#2C2B3C] shadow-card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm text-[#20202A] dark:text-[#F4F3F9]">
              ความสนใจและกิจกรรม (Interests)
            </h3>
            <span className="text-[11px] text-[#8A8994]">เลือกได้สูงสุด 7 อย่าง ({selectedInterests.length}/7)</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {MASTER_INTERESTS.map((interest) => {
              const isSelected = selectedInterests.some((i) => i.id === interest.id);
              return (
                <button
                  key={interest.id}
                  type="button"
                  onClick={() => handleInterestToggle(interest)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition flex items-center gap-1.5 ${
                    isSelected
                      ? 'border-[#FF526B] bg-[#FFF2F5] dark:bg-[#281822] text-[#FF526B] font-bold shadow-xs'
                      : 'border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#201F2C] text-[#20202A] dark:text-[#F4F3F9] hover:border-gray-300'
                  }`}
                >
                  <span>{interest.icon}</span>
                  <span>{interest.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Discovery Visibility Setting */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#1A1924] border border-[#F2E3E6] dark:border-[#2C2B3C] shadow-card flex items-center justify-between">
          <div>
            <h4 className="font-bold text-sm text-[#20202A] dark:text-[#F4F3F9]">
              ซ่อนโปรไฟล์จากการค้นหา (Hide from Discovery)
            </h4>
            <p className="text-xs text-[#8A8994] mt-0.5">
              เมื่อเปิดใช้งาน คุณจะไม่ปรากฏในหน้าปัดค้นหาของคนอื่นชั่วคราว
            </p>
          </div>
          <input
            type="checkbox"
            checked={isHidden}
            onChange={(e) => setIsHidden(e.target.checked)}
            className="w-5 h-5 rounded text-[#FF526B] focus:ring-[#FF526B] cursor-pointer"
          />
        </div>

        {/* Save Button */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="flex-1 py-3.5 rounded-2xl bg-gradient-brand text-white font-bold text-sm shadow-brand hover:opacity-95 transition flex items-center justify-center gap-2"
          >
            {saveSuccess ? (
              <>
                <Check className="w-5 h-5" />
                บันทึกเรียบร้อยแล้ว!
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                บันทึกการเปลี่ยนแปลง (Save Changes)
              </>
            )}
          </button>
        </div>
      </form>

      {/* App Appearance & Session Settings */}
      <div className="p-5 rounded-3xl bg-white dark:bg-[#1A1924] border border-[#F2E3E6] dark:border-[#2C2B3C] shadow-card space-y-3">
        <h3 className="font-bold text-sm text-[#20202A] dark:text-[#F4F3F9]">
          การตั้งค่าแอปพลิเคชัน (App Preferences)
        </h3>

        <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2.5">
            {isDarkMode ? <Moon className="w-4 h-4 text-purple-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
            <span className="text-xs font-semibold text-[#20202A] dark:text-[#F4F3F9]">
              โหมดการแสดงผล (Dark Mode)
            </span>
          </div>
          <button
            onClick={toggleDarkMode}
            className="px-3 py-1 rounded-full text-xs font-bold border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#201F2C]"
          >
            {isDarkMode ? 'เปิดอยู่ (Dark)' : 'ปิดอยู่ (Light)'}
          </button>
        </div>

        <div className="flex items-center justify-between py-2">
          <span className="text-xs font-semibold text-red-500">ออกจากระบบ (Logout)</span>
          <button
            onClick={logout}
            className="px-3 py-1 rounded-full text-xs font-bold text-red-500 border border-red-200 dark:border-red-950/60 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-1"
          >
            <LogOut className="w-3.5 h-3.5" />
            ออกจากระบบ
          </button>
        </div>
      </div>

      {/* Profile Detail Preview Modal */}
      <ProfileDetailModal
        profile={{
          ...currentUser,
          display_name: displayName,
          bio,
          school_department: department,
          gender,
          interests: selectedInterests,
          photos,
          avatar_url: photos[0]?.url || currentUser.avatar_url,
        }}
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        onLike={() => setPreviewOpen(false)}
        onPass={() => setPreviewOpen(false)}
        onReport={() => setPreviewOpen(false)}
      />
    </div>
  );
};
