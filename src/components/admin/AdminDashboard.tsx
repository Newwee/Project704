'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  ShieldAlert,
  Users,
  Flag,
  UserX,
  CheckCircle,
  FileText,
  BadgeCheck,
  Search,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    currentUser,
    allProfiles,
    reports,
    adminModerateUser,
    adminResolveReport,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'users' | 'reports' | 'logs'>('reports');
  const [searchTerm, setSearchTerm] = useState('');

  // Check admin rights
  if (!currentUser?.is_admin) {
    return (
      <div className="w-full max-w-md mx-auto p-8 my-16 text-center bg-white dark:bg-[#1A1924] rounded-3xl border border-red-200 dark:border-red-950/60 shadow-card">
        <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center mx-auto mb-3">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-red-600">สิทธิ์การเข้าถึงถูกปฏิเสธ (Access Denied)</h2>
        <p className="text-xs text-[#8A8994] mt-1">
          หน้านี้สงวนไว้สำหรับอาจารย์หรือผู้ดูแลระบบความปลอดภัยของ NMR TUP เท่านั้น
        </p>
      </div>
    );
  }

  // Filtered users
  const filteredUsers = allProfiles.filter(
    (p) =>
      p.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.school_department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingReports = reports.filter((r) => r.status === 'pending');

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-4 sm:py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-red-600 text-white shadow-md">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#20202A] dark:text-[#F4F3F9]">
              NMR TUP Safety & Moderation Console
            </h1>
            <p className="text-xs text-[#8A8994] dark:text-[#9795A7]">
              ศูนย์กลางการตรวจสอบความปลอดภัย จัดการผู้ใช้ และตรวจสอบการรายงาน
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Protection Active
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#1A1924] border border-[#F2E3E6] dark:border-[#2C2B3C] shadow-card">
          <span className="text-[11px] font-semibold text-[#8A8994]">รายงานที่รอดำเนินการ</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-2xl font-black text-rose-500">{pendingReports.length}</span>
            <Flag className="w-5 h-5 text-rose-400" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#1A1924] border border-[#F2E3E6] dark:border-[#2C2B3C] shadow-card">
          <span className="text-[11px] font-semibold text-[#8A8994]">สมาชิกทั้งหมด</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-2xl font-black text-[#20202A] dark:text-[#F4F3F9]">
              {allProfiles.length}
            </span>
            <Users className="w-5 h-5 text-blue-400" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#1A1924] border border-[#F2E3E6] dark:border-[#2C2B3C] shadow-card">
          <span className="text-[11px] font-semibold text-[#8A8994]">บัญชีที่ถูกระงับ/แบน</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-2xl font-black text-amber-500">
              {allProfiles.filter((p) => p.is_suspended || p.is_banned).length}
            </span>
            <UserX className="w-5 h-5 text-amber-400" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#1A1924] border border-[#F2E3E6] dark:border-[#2C2B3C] shadow-card">
          <span className="text-[11px] font-semibold text-[#8A8994]">ยืนยันตัวตนแล้ว</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-2xl font-black text-emerald-500">
              {allProfiles.filter((p) => p.is_verified).length}
            </span>
            <BadgeCheck className="w-5 h-5 text-emerald-500" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={() => setActiveTab('reports')}
          className={`py-3 px-5 text-xs sm:text-sm font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'reports'
              ? 'border-rose-500 text-rose-500'
              : 'border-transparent text-[#8A8994] hover:text-[#20202A] dark:hover:text-[#F4F3F9]'
          }`}
        >
          <Flag className="w-4 h-4" />
          รายการรายงานความปลอดภัย ({reports.length})
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`py-3 px-5 text-xs sm:text-sm font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'users'
              ? 'border-rose-500 text-rose-500'
              : 'border-transparent text-[#8A8994] hover:text-[#20202A] dark:hover:text-[#F4F3F9]'
          }`}
        >
          <Users className="w-4 h-4" />
          จัดการบัญชีผู้ใช้ ({allProfiles.length})
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`py-3 px-5 text-xs sm:text-sm font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'logs'
              ? 'border-rose-500 text-rose-500'
              : 'border-transparent text-[#8A8994] hover:text-[#20202A] dark:hover:text-[#F4F3F9]'
          }`}
        >
          <FileText className="w-4 h-4" />
          Audit Logs
        </button>
      </div>

      {/* Tab: Reports */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          {reports.length === 0 ? (
            <div className="py-12 text-center bg-white dark:bg-[#1A1924] rounded-3xl border border-[#F2E3E6] dark:border-[#2C2B3C] p-6">
              <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <h3 className="font-bold text-sm text-[#20202A] dark:text-[#F4F3F9]">
                ไม่มีรายงานที่ต้องตรวจสอบ
              </h3>
              <p className="text-xs text-[#8A8994] mt-1">ชุมชน NMR TUP ปลอดภัยและเรียบร้อยดี!</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="p-4 rounded-2xl bg-white dark:bg-[#1A1924] border border-[#F2E3E6] dark:border-[#2C2B3C] shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 font-bold text-[11px]">
                        {report.category}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          report.status === 'pending'
                            ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                            : report.status === 'action_taken'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {report.status}
                      </span>
                      <span className="text-[10px] text-[#8A8994]">
                        {new Date(report.created_at).toLocaleString()}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-[#20202A] dark:text-[#F4F3F9]">
                      ผู้ถูกรายงาน: <span className="text-[#FF526B]">{report.reported_name}</span> (โดย {report.reporter_name})
                    </p>
                    <p className="text-xs text-[#8A8994] dark:text-[#9795A7]">
                      &quot;{report.details}&quot;
                    </p>
                  </div>

                  {report.status === 'pending' && (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => adminResolveReport(report.id, 'dismissed')}
                        className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-800 text-xs font-semibold text-[#8A8994] hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        ยกเลิกข้อกล่าวหา (Dismiss)
                      </button>
                      <button
                        onClick={() => {
                          adminModerateUser(report.reported_id, 'suspend');
                          adminResolveReport(report.id, 'action_taken');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-red-600 text-white font-bold text-xs shadow-sm hover:bg-red-700 flex items-center gap-1"
                      >
                        <UserX className="w-3.5 h-3.5" />
                        ระงับบัญชี (Suspend)
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Users Management */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A8994]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหาชื่อผู้ใช้, แผนการเรียน, หรืออีเมล..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1A1924] text-xs sm:text-sm text-[#20202A] dark:text-[#F4F3F9] focus:outline-none focus:border-[#FF526B]"
            />
          </div>

          <div className="bg-white dark:bg-[#1A1924] rounded-3xl border border-[#F2E3E6] dark:border-[#2C2B3C] shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 dark:bg-[#201F2C] border-b border-gray-100 dark:border-gray-800 text-[#8A8994] uppercase font-bold text-[10px]">
                  <tr>
                    <th className="p-3.5">ผู้ใช้ (User)</th>
                    <th className="p-3.5">แผนการเรียน</th>
                    <th className="p-3.5">โหมด / อายุ</th>
                    <th className="p-3.5">สถานะ</th>
                    <th className="p-3.5 text-right">การจัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-[#20202A] dark:text-[#F4F3F9]">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50/50 dark:hover:bg-[#222130]">
                      <td className="p-3.5 flex items-center gap-3">
                        <img
                          src={user.avatar_url || user.photos[0]?.url}
                          alt={user.display_name}
                          className="w-9 h-9 rounded-full object-cover shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-1 font-bold">
                            <span>{user.display_name}</span>
                            {user.is_verified && (
                              <BadgeCheck className="w-3.5 h-3.5 text-emerald-500" />
                            )}
                          </div>
                          <span className="text-[10px] text-[#8A8994]">{user.email}</span>
                        </div>
                      </td>

                      <td className="p-3.5 text-[#8A8994]">{user.school_department}</td>

                      <td className="p-3.5">
                        <span className="font-semibold">{user.mode}</span>
                        <span className="text-[10px] text-[#8A8994] block">อายุ {user.age} ปี</span>
                      </td>

                      <td className="p-3.5">
                        {user.is_banned ? (
                          <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-bold text-[10px]">
                            Banned
                          </span>
                        ) : user.is_suspended ? (
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-bold text-[10px]">
                            Suspended
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px]">
                            Active
                          </span>
                        )}
                      </td>

                      <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                        {!user.is_verified && (
                          <button
                            onClick={() => adminModerateUser(user.id, 'verify')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-700 font-semibold text-[10px] hover:bg-emerald-200"
                          >
                            ยืนยันตัวตน
                          </button>
                        )}
                        {user.is_suspended || user.is_banned ? (
                          <button
                            onClick={() => adminModerateUser(user.id, 'activate')}
                            className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-700 font-semibold text-[10px] hover:bg-blue-200"
                          >
                            ปลดระงับ
                          </button>
                        ) : (
                          <button
                            onClick={() => adminModerateUser(user.id, 'suspend')}
                            className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-700 font-semibold text-[10px] hover:bg-amber-200"
                          >
                            ระงับบัญชี
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Logs */}
      {activeTab === 'logs' && (
        <div className="p-5 bg-white dark:bg-[#1A1924] rounded-3xl border border-[#F2E3E6] dark:border-[#2C2B3C] shadow-card space-y-3">
          <h3 className="font-bold text-sm text-[#20202A] dark:text-[#F4F3F9]">
            System & Security Audit Trail
          </h3>
          <div className="space-y-2 text-xs font-mono text-[#8A8994] dark:text-[#9795A7]">
            <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-[#201F2C]">
              [2026-11-15 23:45:10] SYSTEM_BOOT: Tinder NMR TUP initialized. Safety Mode: CAMPUS_FRIENDS.
            </div>
            <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-[#201F2C]">
              [2026-11-15 23:46:02] ADMIN_ACCESS: Moderator Kru Wittaya authenticated with role: admin.
            </div>
            <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-[#201F2C]">
              [2026-11-15 23:48:22] RLS_VERIFICATION: 16 security policies evaluated and active on PostgreSQL.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
