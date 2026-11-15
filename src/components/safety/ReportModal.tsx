import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Flag, X, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { ReportCategory } from '@/types';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUserId: string;
  targetUserName: string;
}

const REPORT_CATEGORIES: ReportCategory[] = [
  'Fake Profile',
  'Harassment',
  'Spam',
  'Inappropriate Content',
  'Impersonation',
  'Other',
];

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  targetUserId,
  targetUserName,
}) => {
  const { reportUser } = useApp();
  const [category, setCategory] = useState<ReportCategory>('Harassment');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reportUser(targetUserId, category, details);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-[#1A1924] rounded-3xl p-6 shadow-2xl border border-[#F2E3E6] dark:border-[#2C2B3C]">
        {submitted ? (
          <div className="py-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-[#20202A] dark:text-[#F4F3F9]">
              ส่งรายงานความปลอดภัยแล้ว
            </h3>
            <p className="text-xs text-[#8A8994] mt-1 max-w-xs">
              ทีมงานผู้ดูแลความปลอดภัยของ NMR TUP จะตรวจสอบรายงานและดำเนินการอย่างรวดเร็ว ขอบคุณที่ช่วยสร้างชุมชนที่ปลอดภัยครับ
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#20202A] dark:text-[#F4F3F9]">
                    รายงานผู้ใช้งาน: {targetUserName}
                  </h3>
                  <p className="text-[11px] text-[#8A8994]">รายงานข้อมูลที่ไม่เหมาะสมหรือละเมิดกฎ</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-full text-[#8A8994] hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#20202A] dark:text-[#F4F3F9] mb-1.5">
                  เลือกหมวดหมู่ที่ต้องการรายงาน
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {REPORT_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`py-2 px-3 rounded-xl text-xs font-medium border text-left transition ${
                        category === cat
                          ? 'border-[#FF526B] bg-[#FFF5F7] dark:bg-[#2B1B24] text-[#FF526B] font-bold'
                          : 'border-gray-200 dark:border-gray-800 text-[#8A8994] hover:border-gray-300'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#20202A] dark:text-[#F4F3F9] mb-1.5">
                  รายละเอียดเพิ่มเติม
                </label>
                <textarea
                  rows={3}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="ระบุข้อเท็จจริงหรือพฤติกรรมที่ไม่เหมาะสม..."
                  className="w-full text-xs p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#222130] text-[#20202A] dark:text-[#F4F3F9] focus:outline-none focus:border-[#FF526B]"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 text-xs font-semibold text-[#8A8994]"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md transition flex items-center justify-center gap-1.5"
                >
                  <Flag className="w-4 h-4" />
                  ส่งรายงาน
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
