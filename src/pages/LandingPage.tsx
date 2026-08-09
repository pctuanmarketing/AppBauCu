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
  Clock,
  KeyRound,
  FileText,
  Layers,
  AlertTriangle,
  ChevronRight,
  ShieldAlert,
  Sliders,
} from 'lucide-react';

interface LandingPageProps {
  onOpenLogin: () => void;
  onOpenRegister: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenLogin,
  onOpenRegister,
}) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-sky-500 selection:text-white flex flex-col justify-between overflow-x-hidden">
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-sky-500/25 border border-sky-400/30">
              🗳️
            </div>
            <div>
              <div className="font-black text-white text-base tracking-tight flex items-center gap-2">
                <span>KIỂM PHIẾU BẦU CỬ</span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-gradient-to-r from-sky-500/20 to-blue-500/20 text-sky-300 border border-sky-400/30">
                  v2.0 OFFICIAL
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Hệ thống Kiểm phiếu & Quản lý Cử tri Điện tử 3 Cấp
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onOpenLogin}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all flex items-center gap-1.5 border border-slate-800"
            >
              <LogIn className="w-4 h-4 text-sky-400" />
              <span>Đăng nhập</span>
            </button>

            <button
              onClick={onOpenRegister}
              className="px-4 py-2 rounded-xl text-xs font-extrabold bg-gradient-to-r from-sky-500 via-sky-600 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-lg shadow-sky-500/25 transition-all flex items-center gap-1.5 transform hover:-translate-y-0.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>Đăng ký cấp quyền</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        {/* Background Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-sky-600/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8 text-center">
          {/* Top Sparkling Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 text-sky-300 text-xs font-bold border border-sky-500/30 backdrop-blur-md shadow-xl">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>ÁP DỤNG THỰC TẾ CHO TẤT CẢ TỔ BẦU CỬ & KHU VỰC BỎ PHIẾU TOÀN QUỐC</span>
          </div>

          {/* Main Hero Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight max-w-5xl mx-auto drop-shadow-sm">
            HỆ THỐNG KIỂM PHIẾU BẦU CỬ 3 CẤP & QUẢN LÝ CỬ TRI THỜI GIAN THỰC
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-3xl mx-auto font-medium leading-relaxed">
            Giải pháp chuyển đổi số toàn diện hỗ trợ Tổ bầu cử kiểm phiếu siêu tốc, tự động phân rã phiếu bầu 3 cấp (<strong className="text-white">Đại biểu Quốc hội, HĐND Tỉnh, HĐND Xã</strong>), quét thẻ cử tri điểm danh, cảnh báo sai lệch STT và xuất biên bản kiểm phiếu Mẫu 18/23-HĐBC đúng Luật Bầu cử Quốc gia & Nghị định 30/2020/NĐ-CP.
          </p>

          {/* Key Metrics Chips */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <div className="px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-bold text-slate-300 flex items-center gap-1.5 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Chính xác tuyệt đối 100%</span>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-bold text-slate-300 flex items-center gap-1.5 shadow-2xs">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Phím tắt Enter x2 siêu tốc</span>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-bold text-slate-300 flex items-center gap-1.5 shadow-2xs">
              <Layers className="w-4 h-4 text-sky-400" />
              <span>Nạp lô hàng loạt +100 phiếu</span>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-bold text-slate-300 flex items-center gap-1.5 shadow-2xs">
              <FileText className="w-4 h-4 text-purple-400" />
              <span>Xuất Word (.docx) & Excel (.xlsx)</span>
            </div>
          </div>

          {/* CTA Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={onOpenRegister}
              className="px-7 py-4 rounded-2xl bg-gradient-to-r from-sky-500 via-sky-600 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-black text-sm shadow-xl shadow-sky-600/30 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <UserPlus className="w-5 h-5" />
              <span>Đăng ký tài khoản cấp quyền ngay</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenLogin}
              className="px-7 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 font-extrabold text-sm transition-all flex items-center gap-2 shadow-lg"
            >
              <LogIn className="w-5 h-5 text-sky-400" />
              <span>Đăng nhập hệ thống</span>
            </button>
          </div>

          {/* Core Feature Cards Showcase Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 text-left">
            {/* Card 1: Rapid Counting */}
            <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-sky-500/50 transition-all space-y-3 relative group shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-400/30 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
                ⚡
              </div>
              <h3 className="font-extrabold text-white text-base flex items-center justify-between">
                <span>Kiểm phiếu siêu tốc & Enter x2</span>
                <span className="text-[10px] bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-full border border-sky-400/30">Cấp tốc</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                Gõ chuỗi số thứ tự các ứng cử viên bị gạch tên (VD: gõ <strong className="text-rose-400 font-mono">134</strong> là gạch ứng viên STT 1, 3, 4). Gõ <strong className="text-rose-400 font-mono">0</strong> cho phiếu không hợp lệ. Phím tắt <strong>Enter 2 lần</strong> nạp phiếu tức thì không cần dùng chuột.
              </p>
            </div>

            {/* Card 2: Batch Entry */}
            <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-amber-500/50 transition-all space-y-3 relative group shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-400/30 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
                📦
              </div>
              <h3 className="font-extrabold text-white text-base flex items-center justify-between">
                <span>Nhập theo lô hàng loạt</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30">Mới</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                Hỗ trợ nạp hàng loạt xấp phiếu có cùng lựa chọn gạch tên với các chip chọn nhanh số lượng: <strong className="text-amber-400 font-mono">+5, +10, +25, +50, +100 phiếu</strong>. Tiết kiệm 80% thời gian nhập liệu.
              </p>
            </div>

            {/* Card 3: Strict STT Validation */}
            <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-rose-500/50 transition-all space-y-3 relative group shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-400/30 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
                🛡️
              </div>
              <h3 className="font-extrabold text-white text-base flex items-center justify-between">
                <span>Chặn số STT sai thời gian thực</span>
                <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full border border-rose-400/30">Bảo mật</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                Thuật toán tự động đối soát số STT bị gạch với danh sách ứng viên cùng cấp. Nếu cán bộ gõ số không có trong danh sách (VD: gõ STT 7 khi chỉ có 5 ứng viên), hệ thống sẽ <strong>chớp đỏ thời gian thực</strong> và khóa nút nạp phiếu.
              </p>
            </div>

            {/* Card 4: Voter Management */}
            <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/50 transition-all space-y-3 relative group shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
                👥
              </div>
              <h3 className="font-extrabold text-white text-base flex items-center justify-between">
                <span>Điểm danh cử tri & Phân rã 2/3 cấp</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-400/30">Chính xác</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                Quét/nhập Mã thẻ cử tri để điểm danh trực tiếp. Tự động thống kê số cử tri Nam, Nữ, cử tri đã bỏ phiếu và phân rã cử tri được bầu 2 cấp (Quốc hội & Tỉnh) hoặc 3 cấp (Quốc hội, Tỉnh, Xã).
              </p>
            </div>

            {/* Card 5: Voting Time Window */}
            <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/50 transition-all space-y-3 relative group shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-400/30 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
                ⏰
              </div>
              <h3 className="font-extrabold text-white text-base flex items-center justify-between">
                <span>Khung giờ bỏ phiếu & Auto-Lock</span>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-400/30">Tự động</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                Cấu hình giờ mở hòm phiếu (<strong className="text-indigo-300">07:00</strong>) và giờ đóng hòm phiếu (<strong className="text-indigo-300">19:00</strong>). Tự động cảnh báo và chặn điểm danh ngoài giờ quy định. Admin có công tắc Bật/Tắt chủ động.
              </p>
            </div>

            {/* Card 6: Report Exporting */}
            <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-purple-500/50 transition-all space-y-3 relative group shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-400/30 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
                📄
              </div>
              <h3 className="font-extrabold text-white text-base flex items-center justify-between">
                <span>Xuất Mẫu 18/23-HĐBC & Excel</span>
                <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-400/30">Pháp lý</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                Xuất file Word (.docx) Biên bản kiểm phiếu Mẫu 18-HĐBC và Nghị quyết Mẫu 23-HĐBC chuẩn Nghị định 30/2020/NĐ-CP kèm file Excel (.xlsx) đa tab phục vụ báo cáo cấp trên.
              </p>
            </div>
          </div>

          {/* Workflow & Security Access Card */}
          <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 border border-sky-800/60 text-left space-y-4 shadow-2xl relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-sky-800/50 pb-4">
              <h3 className="text-base font-extrabold text-white uppercase flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-sky-400" />
                <span>QUY TRÌNH ĐĂNG KÝ, CẤP QUYỀN & BẢO MẬT AN TOÀN Tuyệt đối</span>
              </h3>
              <span className="text-xs text-sky-300 font-bold bg-sky-500/20 px-3 py-1 rounded-full border border-sky-400/30">
                🔒 KHÔNG RÒ RỈ THÔNG TIN
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-slate-300 pt-2">
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 relative">
                <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 font-black flex items-center justify-center border border-sky-400/30">
                  1
                </div>
                <div className="font-extrabold text-white text-sm">Gửi Yêu Cầu Đăng Ký</div>
                <p className="text-slate-400 leading-relaxed">
                  Cán bộ nhập Họ tên, Email, Số điện thoại và Mật khẩu cá nhân để khởi tạo yêu cầu tham gia hệ thống kiểm phiếu.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 relative">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 font-black flex items-center justify-center border border-amber-400/30">
                  2
                </div>
                <div className="font-extrabold text-white text-sm">Phê Duyệt & Gán Cấp (`assignedLevel`)</div>
                <p className="text-slate-400 leading-relaxed">
                  Admin kiểm tra thông tin, gán vai trò (`ADMIN/EDITOR/VIEW`) và phân công cấp bầu cử được phép thao tác.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 relative">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 font-black flex items-center justify-center border border-emerald-400/30">
                  3
                </div>
                <div className="font-extrabold text-white text-sm">Nhận Mail Kích Hoạt & Đăng Nhập</div>
                <p className="text-slate-400 leading-relaxed">
                  Hệ thống tự động phát Email xác nhận kích hoạt tài khoản. Cán bộ đăng nhập và bắt đầu quy trình kiểm phiếu an toàn.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Technical Support Banner */}
      <section className="bg-slate-900/90 border-t border-slate-800 py-8 text-slate-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-400/30 flex items-center justify-center font-bold text-2xl shrink-0">
              📞
            </div>
            <div>
              <h4 className="font-extrabold text-white text-sm">HỖ TRỢ KỸ THUẬT & TƯ VẤN TRIỂN KHAI BẦU CỬ</h4>
              <p className="text-xs text-slate-400">Trực ban hỗ trợ Tổ bầu cử 24/7 trong suốt quá trình chuẩn bị và diễn ra cuộc bầu cử</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <a
              href="mailto:pctuanit@gmail.com"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 font-bold border border-slate-700 transition-all flex items-center gap-2"
            >
              <Mail className="w-4 h-4 text-sky-400" />
              <span>pctuanit@gmail.com</span>
            </a>
            <a
              href="tel:0916199945"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 font-bold border border-slate-700 transition-all flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>0916199945</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-bold text-slate-300">
            HỆ THỐNG QUẢN LÝ BẦU CỬ VÀ KIỂM PHIẾU ĐIỆN TỬ TỰ ĐỘNG AN TRẠCH - HÒA TIẾN
          </p>
          <p className="flex items-center justify-center gap-4 text-slate-400 font-mono text-[11px]">
            <span>Tác giả: <strong>Phạm Công Tuân</strong></span>
            <span>| Email: <strong>pctuanit@gmail.com</strong></span>
            <span>| Điện thoại: <strong>0916199945</strong></span>
          </p>
          <p className="text-[10px] text-slate-600">
            © 2026 Bản quyền thuộc về tác giả. Phát triển trên nền tảng React, TypeScript, TailwindCSS & Vercel.
          </p>
        </div>
      </footer>
    </div>
  );
};
