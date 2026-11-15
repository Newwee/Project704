import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ShieldCheck, Users, Flame, AlertCircle, X, Check } from 'lucide-react';
import { AppMode } from '@/types';

interface AgeGateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AgeGateModal: React.FC<AgeGateModalProps> = ({ isOpen, onClose }) => {
  const { mode, switchMode, currentUser } = useApp();
  const [selectedMode, setSelectedMode] = useState<AppMode>(mode);
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleApply = () => {
    if (selectedMode === 'ADULT_DATING') {
      if (!ageConfirmed) {
        setErrorMsg('กรุณายืนยันว่าคุณมีอายุ 18 ปีบริบูรณ์ขึ้นไป');
        return;
      }
      if (currentUser && currentUser.age < 18) {
        setErrorMsg('ระบบตรวจสอบพบว่าคุณอายุต่ำกว่า 18 ปี ไม่สามารถเปิดโหมด Adult Dating ได้');
        return;
      }
    }
    setErrorMsg('');
    switchMode(selectedMode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-[#1A1924] rounded-3xl p-6 shadow-2xl border border-[#F2E3E6] dark:border-[#2C2B3C]">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#FFEBF0] dark:bg-[#2F1D24] text-[#FF526B]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#20202A] dark:text-[#F4F3F9]">
                Community Safety & Mode
              </h2>
              <p className="text-xs text-[#8A8994]">เลือกโหมดการใช้งานที่ตรงกับวัตถุประสงค์</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#8A8994] hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {/* Mode B: Campus Friends (Default) */}
          <div
            onClick={() => setSelectedMode('CAMPUS_FRIENDS')}
            className={`p-4 rounded-2xl border-2 cursor-pointer transition relative ${
              selectedMode === 'CAMPUS_FRIENDS'
                ? 'border-[#FF526B] bg-[#FFF8FA] dark:bg-[#281A22]'
                : 'border-gray-200 dark:border-gray-800 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[#20202A] dark:text-[#F4F3F9]">
                    Campus Friends (แนะนำ)
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                    ปลอดภัยสำหรับทุกวัย
                  </span>
                </div>
                <p className="text-xs text-[#8A8994] dark:text-[#9795A7] mt-1 leading-relaxed">
                  เชื่อมต่อเพื่อนร่วมสถาบัน NMR TUP แลกเปลี่ยนชีทเรียน ติวหนังสือ ชวนทำกิจกรรมกีฬา ดนตรี และบอร์ดเกม ปราศจากเนื้อหาหรือการจัดคู่เชิงชู้สาว
                </p>
              </div>
            </div>
          </div>

          {/* Mode A: Adult Dating */}
          <div
            onClick={() => setSelectedMode('ADULT_DATING')}
            className={`p-4 rounded-2xl border-2 cursor-pointer transition relative ${
              selectedMode === 'ADULT_DATING'
                ? 'border-[#FF526B] bg-[#FFF8FA] dark:bg-[#281A22]'
                : 'border-gray-200 dark:border-gray-800 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-[#FF526B] shrink-0">
                <Flame className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[#20202A] dark:text-[#F4F3F9]">
                    Adult Dating (18+)
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300">
                    เฉพาะผู้ใหญ่ 18 ปีขึ้นไป
                  </span>
                </div>
                <p className="text-xs text-[#8A8994] dark:text-[#9795A7] mt-1 leading-relaxed">
                  สำหรับศิษย์เก่าหรือนักศึกษาอายุ 18 ปีบริบูรณ์ขึ้นไป เพื่อการค้นหาคู่สนทนาและมิตรภาพเชิงโรแมนติก ต้องผ่านการยืนยันอายุ
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 18+ Checkbox if Adult Dating is selected */}
        {selectedMode === 'ADULT_DATING' && (
          <div className="mt-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-start gap-2.5">
            <input
              type="checkbox"
              id="confirmAge"
              checked={ageConfirmed}
              onChange={(e) => setAgeConfirmed(e.target.checked)}
              className="mt-0.5 rounded text-[#FF526B] focus:ring-[#FF526B] cursor-pointer"
            />
            <label htmlFor="confirmAge" className="text-xs text-amber-800 dark:text-amber-300 cursor-pointer">
              ข้าพเจ้ายืนยันว่ามีอายุ 18 ปีบริบูรณ์ขึ้นไป และตกลงปฏิบัติตามมาตรฐานชุมชนอย่างเคร่งครัด
            </label>
          </div>
        )}

        {errorMsg && (
          <div className="mt-3 flex items-center gap-2 text-xs text-red-500 bg-red-50 dark:bg-red-950/40 p-2.5 rounded-xl">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="mt-6 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 font-semibold text-xs text-[#8A8994] hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleApply}
            className="flex-1 py-2.5 rounded-xl bg-gradient-brand text-white font-bold text-xs shadow-brand hover:opacity-95 transition flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            บันทึกการตั้งค่า
          </button>
        </div>
      </div>
    </div>
  );
};
