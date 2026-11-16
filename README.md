# 🔥 Spark
### Premium Full-stack Social Matching Web Application

> **"Meet. Match. Connect."**  
> เว็บแอปพลิเคชันค้นหาและเชื่อมต่อมิตรภาพ ออกแบบด้วยสถาปัตยกรรมระดับ Production-Ready ประสบการณ์ใช้งานลื่นไหลเสมือน Native Mobile App รองรับทั้งสมาร์ทโฟนและเดสก์ท็อป

---

## 🌟 Brand Identity & Highlights

- **Original Branding:** โลโก้ Connection Node + Flame Heart สื่อถึงการพบเจอและมิตรภาพที่อบอุ่น
- **Color Palette:**
  - Primary: `#FF526B` (Vibrant Passion)
  - Secondary: `#FF7A85`
  - Accent: `#FF416C`
  - Background: `#FFF9FA` (Clean Light) / `#111116` (Deep Dark Mode)
  - Text Primary: `#20202A` / `#F4F3F9`
- **Native Experience:** สัมผัสเสมือน Mobile App พร้อม Spring Gesture Physics (Framer Motion), Swipe Stamps (LIKE / NOPE / SUPER LIKE), Photo Story Indicators, Toast Alerts, Haptic Visuals, Safe Area Support และ PWA Installable.
- **Dual Community Mode & Safety Gate:**
  - **Campus Friends (Default):** มุ่งเน้นการหาเพื่อนร่วมสายการเรียน แลกเปลี่ยนชีท ติวหนังสือ กิจกรรมดนตรี กีฬา บอร์ดเกม ปราศจากเนื้อหาทางเพศหรือชู้สาว ปลอดภัยสำหรับเยาวชนและนักเรียน
  - **Adult Dating (18+):** โหมดมิตรภาพสำหรับผู้ใหญ่ 18 ปีบริบูรณ์ขึ้นไป พร้อมระบบคัดกรองอายุเข้มงวด

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | **Next.js 16** (App Router, Turbopack, React 19, TypeScript) |
| **Styling & Design System** | **Tailwind CSS v4**, Custom Design Tokens, Dark Mode CSS Variables |
| **Animations & Gestures** | **Framer Motion**, Canvas Confetti |
| **Icons** | **Lucide React** |
| **Validation & Schema** | **Zod** |
| **Database & Auth** | **PostgreSQL** & **Supabase** (Row Level Security, Migration, RPC Functions) |
| **PWA** | Web App Manifest, Standalone Experience, Responsive Safe Areas |
| **Testing** | Node.js Test Runner (`node:test`, `node:assert`) |

---

## 📐 System & Database Architecture

```
auth.users
  └── public.profiles
       ├── public.profile_photos
       ├── public.user_interests (⇄ public.interests)
       └── public.user_preferences

public.swipes (unique [swiper_id, swiped_id])
  └── (Atomic Mutual Like Check)
       └── public.matches (unique [user1_id, user2_id])
            └── public.conversations
                 └── public.messages

public.notifications
public.blocks (unique [blocker_id, blocked_id])
public.reports (categories, status, review workflow)
public.verifications
public.admin_roles
public.audit_logs
```

### 🔒 Atomic Matching Logic
ระบบคำนวณการแมตช์ที่ระดับ Server/Database Atomic Transaction ผ่านฟังก์ชัน `record_swipe_and_match`:
1. ตรวจสอบสถานะการบล็อก (Block Check) ป้องกันการเชื่อมต่อของคู่กรณี
2. บันทึก Swipe ลงใน `public.swipes`
3. หากเป็น `like` หรือ `superlike` ระบบจะตรวจสอบ Swipe ย้อนกลับแบบ Reciprocal
4. หากเกิด Mutual Like:
   - สั่งสร้าง Record ใน `public.matches` (กำหนด Unique Pair ป้องกัน Duplicate Match 100%)
   - สั่งสร้างห้องแชตใน `public.conversations`
   - ส่ง Notification แบบ Real-time ถึงทั้งสองฝ่าย
   - ส่ง Signal ให้ Frontend แสดง **"It's a Match!" Celebration Modal พร้อมเอฟเฟกต์ Confetti**

---

## ⚡ Key Features Developed

1. **Landing Page:** Hero Section สไตล์พรีเมียม, Visual Mockup Card, Get Started, Quick 1-Click Evaluation Login
2. **Authentication & Quick Demo Switcher:** 
   - รองรับ Email Signup / Login
   - ปุ่มสลับบัญชีทดสอบด่วนใน Header (สลับระหว่าง **Phukao นักเรียน** และ **Kru Wittaya อาจารย์/ผู้ดูแล**)
3. **Multi-Step Onboarding Flow (5 ขั้นตอน):**
   - Step 1: Basic Information (ชื่อ, วันเกิด, เพศ, แผนการเรียน, Bio)
   - Step 2: Photo Gallery (อัปโหลดรูปภาพจริง แปลงเป็น Data URL พร้อมการตรวจสอบขนาดและชนิดไฟล์)
   - Step 3: Categorized Interests (เทคโนโลยี, กีฬา, ดนตรี, ศิลปะ, อาหาร, ภาพยนตร์ ฯลฯ)
   - Step 4: Preferences (เลือกเพศที่ต้องการพบ และระบบความปลอดภัย)
   - Step 5: Profile Preview & Confirmation
4. **Interactive Discovery Deck (Swipe Engine):**
   - Gesture Dragging สัมพันธ์กับมุมเอียง (Rotation Physics)
   - Dynamic Stamps: "LIKE" (เขียว), "NOPE" (แดง), "SUPER LIKE" (ฟ้า)
   - Story-style Photo Carousel (แตะซ้าย/ขวาเพื่อเปลี่ยนรูป)
   - Detail Info Modal แสดงคะแนนความเข้ากันได้ (Compatibility Score) และประวัติ
   - Action Buttons: Rewind, Pass, Super Like, Like, Detail
   - Empty State สวยงามพร้อมปุ่ม Refresh Passes
5. **Likes Tab (Who Liked You):**
   - แสดงรายชื่อคนที่กด Like เรา
   - ปุ่มกดถูกใจกลับ (Like Back) เพื่อ Match ทันที
6. **Matches & Real-time Chat:**
   - 2-Column Responsive Layout บนเดสก์ท็อป และ Single-Column พร้อมปุ่มย้อนกลับบนมือถือ
   - New Matches Bubble Carousel ด้านบน
   - การส่งข้อความทันทีพร้อม Timestamp และข้อความตอบกลับจำลองอัตโนมัติ
   - เมนูความปลอดภัย: Unmatch, Block User, Report User
7. **Profile Management:**
   - แก้ไขข้อมูลส่วนตัว แผนการเรียน รูปถ่าย และความสนใจ
   - Profile Completeness Progress Meter
   - สวิตช์ Pause / Hide Profile from Discovery
8. **Safety & Moderation Dashboard (Admin Console):**
   - ป้องกันสิทธิ์ระดับ Backend Guard (เฉพาะ `is_admin: true`)
   - Dashboard สรุปตัวเลขสถิติ (Reports, Members, Suspensions)
   - ตรวจสอบรายงานความปลอดภัย (Fake Profile, Harassment, Spam ฯลฯ) พร้อมปุ่ม Dismiss หรือ Suspend Account
   - User Management ตรวจสอบรายชื่อ ระงับบัญชี หรือยืนยันตัวตน (Verified Badge)
   - Audit Logs ติดตามการทำงานของผู้ดูแลระบบ

---

## 🚀 Quick Start Guide

### 1. ติดตั้ง Dependencies
```bash
npm install
```

### 2. ตั้งค่า Environment Variables
คัดลอกไฟล์ `.env.example` เป็น `.env.local`:
```bash
cp .env.example .env.local
```

ตั้งค่าตัวแปรใน `.env.local`:
```env
NEXT_PUBLIC_APP_NAME="Tinder NMR TUP"
NEXT_PUBLIC_APP_TAGLINE="Meet. Match. Connect."
NEXT_PUBLIC_SUPABASE_URL="https://qeiboiwlmcolsftrartz.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"
NEXT_PUBLIC_DEFAULT_MODE="CAMPUS_FRIENDS"
```

> **หมายเหตุ:** ระบบมี **Full In-Memory Local Persistence Engine** ในตัว ทำให้สามารถรันและทดสอบทุกฟีเจอร์ได้ทันที 100% แม้ยังไม่ได้ใส่ API Key ของ Supabase!

### 3. รัน Development Server
```bash
npm run dev
```
เปิดบราวเซอร์ที่: [http://localhost:3000](http://localhost:3000)

### 4. รันคำสั่งตรวจสอบและทดสอบ (Testing)
```bash
# รัน Unit & Integration Tests (7 suites)
npm test

# รัน ESLint (0 errors, 0 warnings)
npm run lint

# รัน Production Build (Next.js Turbopack)
npm run build
```

---

## 🗄️ Database Migration (Supabase)

ไฟล์ SQL Migration พร้อมใช้งานอยู่ที่:
- `supabase/migrations/20261115000000_tinder_nmr_tup_schema.sql` (Schema, 15 Entities, RLS Policies, Indexes, Atomic Swipe RPC)
- `supabase/seed.sql` (Master Interests & Seed Profiles)

สามารถรันผ่าน Supabase SQL Editor หรือ Supabase CLI:
```bash
supabase db push
```

---

## 🛡️ Security & Privacy Assurance

- ป้องกันการเข้าถึง Admin Console ด้วย Authorization Check ที่เข้มงวด
- ห้ามจับคู่ผู้เยาว์เข้าสู่โหมด Adult Dating
- ป้องกันการสร้าง Match ซ้ำด้วย Database Unique Constraints
- ตรวจสอบชนิดและขนาดไฟล์รูปภาพ (<5MB)
- Row Level Security (RLS) ครอบคลุม 15 ตาราง
