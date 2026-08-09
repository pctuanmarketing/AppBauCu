import React from 'react';
import {
  Vote,
  Users,
  ShieldCheck,
  FileSpreadsheet,
  Award,
  CheckCircle2,
  Lock,
  Sparkles,
  ArrowRight,
  UserCheck,
  Zap,
  BarChart3,
  LogIn,
  UserPlus,
  Mail,
  Phone,
  Building2,
} from 'lucide-react';

interface LandingPageProps {
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onEnterDemoApp: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenLogin,
  onOpenRegister,
  onEnterDemoApp,
}) => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-sky-500 selection:text-white flex flex-col justify-between">
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-sky-500/20">
              🗳️
            </div>
            <div>
              <div className="font-black text-white text-base tracking-tight flex items-center gap-2">
                APP BẦU CỬ
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30">
                  v2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Hệ thống Kiểm phiếu & Quản lý Cử tri Điện tử</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenLogin}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-all flex items-center gap-1.5"
            >
              <LogIn className="w-4 h-4 text-sky-400" />
              <span>Đăng nhập</span>
            </button>
            <button
              onClick={onOpenRegister}
              className="px-4 py-2 rounded-xl text-xs font-extrabold bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white shadow-lg shadow-sky-600/30 transition-all flex items-center gap-1.5 transform hover:-translate-y-0.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>Đăng ký cấp quyền</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 text-sky-300 text-xs font-bold border border-sky-400/30 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>ÁP DỤNG THỰC TẾ CHO TỔ BẦU CỬ SỐ 21 - THÔN AN TRẠCH, XÃ HÒA TIẾN</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto">
            GIẢI PHÁP KIỂM PHIẾU BẦU CỬ TỰ ĐỘNG & QUẢN LÝ CỬ TRI THỜI GIAN THỰC
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
            Phần mềm hỗ trợ Tổ bầu cử kiểm phiếu siêu tốc, tự động phân rã phiếu bầu 3 cấp (Quốc hội, HĐND Tỉnh, HĐND Xã), cảnh báo đối soát sai lệch và xuất biên bản kiểm phiếu chính thức theo đúng Luật Bầu cử Việt Nam.
          </p>

          {/* CTA Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={onOpenRegister}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 via-sky-600 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-extrabold text-sm shadow-xl shadow-sky-600/30 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <UserPlus className="w-5 h-5" />
              <span>Đăng ký tài khoản ngay</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenLogin}
              className="px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-extrabold text-sm transition-all flex items-center gap-2 shadow-md"
            >
              <LogIn className="w-5 h-5 text-sky-400" />
              <span>Đăng nhập hệ thống</span>
            </button>

            <button
              onClick={onEnterDemoApp}
              className="px-6 py-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 text-sky-300 border border-sky-500/30 font-bold text-sm transition-all flex items-center gap-2"
            >
              <Eye className="w-5 h-5 text-amber-400" />
              <span>Xem ứng dụng Demo (Read-only)</span>
            </button>
          </div>

          {/* Application Features Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-12 text-left">
            <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 hover:border-sky-500/50 transition-all space-y-2">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
                ⚡
              </div>
              <h3 className="font-extrabold text-white text-sm">Kiểm phiếu siêu tốc</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Nhập chuỗi số bị gạch (VD: gõ 134), gõ 0 cho phiếu không hợp lệ. Phím tắt Enter 2 lần ghi nhận phiếu tức thì.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 hover:border-emerald-500/50 transition-all space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                👥
              </div>
              <h3 className="font-extrabold text-white text-sm">Điểm danh cử tri 2 & 3 cấp</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Quét mã thẻ cử tri, hiển thị thông tin Nam/Nữ, CCCD, Thường trú và tích chọn các cấp bầu cử Quốc hội & HĐND.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 hover:border-amber-500/50 transition-all space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                📊
              </div>
              <h3 className="font-extrabold text-white text-sm">Phân rã loại phiếu 3, 2, 1</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tự động thống kê số phiếu hợp lệ bầu 3 đại biểu, bầu 2 đại biểu, bầu 1 đại biểu và ma trận phiếu theo từng ứng cử viên.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 hover:border-purple-500/50 transition-all space-y-2">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                📄
              </div>
              <h3 className="font-extrabold text-white text-sm">Xuất biên bản chuẩn mẫu</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Xuất file báo cáo Excel (.xlsx) chi tiết và file Word (.docx) biên bản kiểm phiếu mở hòm phiếu chuẩn quốc gia.
              </p>
            </div>
          </div>

          {/* Security & Access Workflow Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-sky-950 via-slate-900 to-indigo-950 border border-sky-800/50 text-left space-y-3">
            <h3 className="text-sm font-extrabold text-white uppercase flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-sky-400" />
              QUY TRÌNH ĐĂNG KÝ VÀ CẤP QUYỀN TRUY CẬP AN TOÀN
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300 pt-1">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="font-extrabold text-sky-400">1. Đăng ký thông tin</div>
                <p>Nhập Họ tên, Email, Số điện thoại và Mật khẩu tài khoản.</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="font-extrabold text-amber-400">2. Xác nhận Mail & Duyệt quyền</div>
                <p>Hệ thống tự động gửi mail xác nhận và gửi yêu cầu đến Quản trị viên.</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="font-extrabold text-emerald-400">3. Đăng nhập & Sử dụng</div>
                <p>Quản trị duyệt cấp quyền ➔ Nhận mail kích hoạt ➔ Đăng nhập phần mềm.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-8 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-bold text-slate-300">
            HỆ THỐNG QUẢN LÝ BẦU CỬ VÀ KIỂM PHIẾU ĐIỆN TỬ - TỔ BẦU CỬ SỐ 21 (XÃ HÒA TIẾN, TP ĐÀ NẴNG)
          </p>
          <p className="flex items-center justify-center gap-4 text-slate-400 font-mono text-[11px]">
            <span>Tác giả: <strong>Phạm Công Tuân</strong></span>
            <span>| Email: <strong>pctuanit@gmail.com</strong></span>
            <span>| Điện thoại: <strong>0916199945</strong></span>
          </p>
          <p className="text-[10px] text-slate-500">© 2026 Bản quyền thuộc về tác giả. Phát triển trên nền tảng Vercel & Supabase.</p>
        </div>
      </footer>
    </div>
  );
};
