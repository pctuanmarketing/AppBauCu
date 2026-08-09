import React, { useState } from 'react';
import {
  X,
  HelpCircle,
  Vote,
  Users,
  BarChart3,
  FileSpreadsheet,
  ShieldCheck,
  Building2,
  Clock,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  Layers,
  FileText,
  Sparkles,
  ChevronRight,
  Search,
} from 'lucide-react';

interface HelpModalProps {
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  const [activeTopic, setActiveTopic] = useState<'OVERVIEW' | 'COUNTING' | 'VOTERS' | 'RESULTS' | 'REPORTS' | 'ADMIN'>('COUNTING');
  const [searchFilter, setSearchFilter] = useState('');

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center z-50 p-3 sm:p-6 font-sans animate-fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 p-5 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-400/30 flex items-center justify-center font-bold shadow-md">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black uppercase tracking-tight text-white flex items-center gap-2">
                <span>HƯỚNG DẪN SỬ DỤNG PHẦN MỀM BẦU CỬ</span>
                <span className="bg-sky-500/30 text-sky-300 text-[10px] px-2 py-0.5 rounded-full font-bold border border-sky-400/30">
                  v1.0 OFFICIAL
                </span>
              </h2>
              <p className="text-xs text-slate-300 font-medium">
                Cẩm nang toàn diện sử dụng Hệ thống Kiểm phiếu Bầu cử Điện tử 3 Cấp
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Layout: Sidebar + Main Topic Body */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Navigation Topics */}
          <div className="w-full md:w-64 bg-slate-50 border-r border-slate-200 p-3 space-y-1 overflow-y-auto shrink-0">
            <button
              onClick={() => setActiveTopic('COUNTING')}
              className={`w-full p-2.5 rounded-xl font-bold text-xs flex items-center gap-2.5 transition-all ${
                activeTopic === 'COUNTING'
                  ? 'bg-sky-600 text-white shadow-md font-black'
                  : 'text-slate-700 hover:bg-slate-200/70'
              }`}
            >
              <Vote className="w-4 h-4 shrink-0" />
              <span className="truncate">1. Kiểm Phiếu & Nhập Lô</span>
            </button>

            <button
              onClick={() => setActiveTopic('VOTERS')}
              className={`w-full p-2.5 rounded-xl font-bold text-xs flex items-center gap-2.5 transition-all ${
                activeTopic === 'VOTERS'
                  ? 'bg-sky-600 text-white shadow-md font-black'
                  : 'text-slate-700 hover:bg-slate-200/70'
              }`}
            >
              <Users className="w-4 h-4 shrink-0" />
              <span className="truncate">2. Quản Lý & Điểm Danh Cử Tri</span>
            </button>

            <button
              onClick={() => setActiveTopic('RESULTS')}
              className={`w-full p-2.5 rounded-xl font-bold text-xs flex items-center gap-2.5 transition-all ${
                activeTopic === 'RESULTS'
                  ? 'bg-sky-600 text-white shadow-md font-black'
                  : 'text-slate-700 hover:bg-slate-200/70'
              }`}
            >
              <BarChart3 className="w-4 h-4 shrink-0" />
              <span className="truncate">3. Kết Quả & Ma Trận Phiếu</span>
            </button>

            <button
              onClick={() => setActiveTopic('REPORTS')}
              className={`w-full p-2.5 rounded-xl font-bold text-xs flex items-center gap-2.5 transition-all ${
                activeTopic === 'REPORTS'
                  ? 'bg-sky-600 text-white shadow-md font-black'
                  : 'text-slate-700 hover:bg-slate-200/70'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4 shrink-0" />
              <span className="truncate">4. Báo Cáo & Mẫu 18/23-HĐBC</span>
            </button>

            <button
              onClick={() => setActiveTopic('ADMIN')}
              className={`w-full p-2.5 rounded-xl font-bold text-xs flex items-center gap-2.5 transition-all ${
                activeTopic === 'ADMIN'
                  ? 'bg-sky-600 text-white shadow-md font-black'
                  : 'text-slate-700 hover:bg-slate-200/70'
              }`}
            >
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span className="truncate">5. Bảo Mật & Phân Quyền</span>
            </button>

            <button
              onClick={() => setActiveTopic('OVERVIEW')}
              className={`w-full p-2.5 rounded-xl font-bold text-xs flex items-center gap-2.5 transition-all ${
                activeTopic === 'OVERVIEW'
                  ? 'bg-sky-600 text-white shadow-md font-black'
                  : 'text-slate-700 hover:bg-slate-200/70'
              }`}
            >
              <Building2 className="w-4 h-4 shrink-0" />
              <span className="truncate">6. Tổ Bầu Cử & Cấu Hình</span>
            </button>
          </div>

          {/* Right Topic Detail Body */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 text-slate-700 text-xs leading-relaxed">
            {activeTopic === 'COUNTING' && (
              <div className="space-y-4">
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl space-y-1">
                  <h3 className="font-extrabold text-rose-950 text-sm flex items-center gap-2">
                    <Vote className="w-4 h-4 text-rose-600" />
                    <span>PHÂN HỆ KIỂM PHIẾU BẦU CỬ SIÊU TỐC</span>
                  </h3>
                  <p className="text-slate-700">
                    Quy trình nhập phiếu bầu áp dụng Luật Bầu cử Việt Nam: Nhập số thứ tự (`STT`) ứng cử viên bị cử tri gạch tên. Ứng viên không bị gạch tên được bầu.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 uppercase text-xs border-b pb-1 flex items-center gap-1.5">
                    <ChevronRight className="w-4 h-4 text-sky-600" />
                    <span>Chế độ 1: Nhập Từng Phiếu (Single Rapid Entry)</span>
                  </h4>
                  <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
                    <li>
                      <strong>Cách nhập:</strong> Gõ số thứ tự các ứng cử viên bị gạch tên dính liền nhau (VD: Gõ <strong className="font-mono text-rose-700 bg-rose-100 px-1 rounded">134</strong> là ứng viên STT 1, 3, 4 bị gạch).
                    </li>
                    <li>
                      <strong>Phiếu không hợp lệ:</strong> Gõ số <strong className="font-mono text-rose-700 bg-rose-100 px-1 rounded">0</strong> cho phiếu bị gạch hết tất cả ứng cử viên, gạch sai hình thức hoặc bị loại bởi Tổ bầu cử.
                    </li>
                    <li>
                      <strong>Phím tắt siêu tốc:</strong> Sau khi gõ chuỗi số ➔ Nhấn <strong className="text-sky-900 bg-sky-100 px-1.5 py-0.5 rounded font-mono">Enter 2 lần</strong> liên tiếp để ghi nhận phiếu lập tức mà không cần dùng chuột.
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 uppercase text-xs border-b pb-1 flex items-center gap-1.5">
                    <ChevronRight className="w-4 h-4 text-sky-600" />
                    <span>Chế độ 2: Nhập Theo Lô Hàng Loạt (Batch Entry Mode)</span>
                  </h4>
                  <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
                    <li>
                      <strong>Ứng dụng:</strong> Dùng khi có xấp phiếu có cùng lựa chọn gạch tên (VD: Nạp 50 phiếu cùng gạch STT `2 4`).
                    </li>
                    <li>
                      <strong>Thao tác:</strong> Chuyển công tắc sang <strong>📦 Nhập Theo Lô Hàng Loạt</strong> ➔ Chọn số lượng phiếu bằng chip chọn nhanh (<span className="font-mono font-bold text-amber-800">+5, +10, +25, +50, +100</span>) ➔ Gõ STT bị gạch ➔ Bấm <strong>Xác nhận Nạp Lô</strong>.
                    </li>
                  </ul>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-300 rounded-2xl space-y-1">
                  <h5 className="font-bold text-amber-950 flex items-center gap-1.5 text-xs">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Thuật toán Kiểm tra STT Hợp lệ (Strict STT Validation):</span>
                  </h5>
                  <p className="text-[11px] text-amber-900">
                    Phần mềm tự động kiểm tra số thứ tự gạch tên phải thuộc danh sách ứng viên cùng cấp. Nếu cán bộ nhập số không tồn tại (VD: Gõ số 7 khi chỉ có 5 ứng viên), hệ thống sẽ <strong>chớp đỏ thời gian thực</strong>, hiển thị dòng cảnh báo màu đỏ và <strong>khóa nút nạp phiếu</strong>.
                  </p>
                </div>
              </div>
            )}

            {activeTopic === 'VOTERS' && (
              <div className="space-y-4">
                <div className="p-3.5 bg-sky-50 border border-sky-200 rounded-2xl space-y-1">
                  <h3 className="font-extrabold text-sky-950 text-sm flex items-center gap-2">
                    <Users className="w-4 h-4 text-sky-600" />
                    <span>PHÂN HỆ QUẢN LÝ & ĐIỂM DANH CỬ TRI</span>
                  </h3>
                  <p className="text-slate-700">
                    Quản lý danh sách cử tri toàn khu vực, hỗ trợ điểm danh cử tri đi bỏ phiếu theo thời gian thực và phân định quyền bầu cử 2 cấp / 3 cấp.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 uppercase text-xs border-b pb-1 flex items-center gap-1.5">
                    <ChevronRight className="w-4 h-4 text-sky-600" />
                    <span>1. Thẻ Cử Tri & Điểm Danh Trực Tiếp</span>
                  </h4>
                  <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
                    <li>
                      <strong>Điểm danh nhanh:</strong> Nhập mã thẻ cử tri hoặc STT vào ô quét ➔ Bấm nút <strong className="text-emerald-700">✓ Điểm danh</strong>.
                    </li>
                    <li>
                      <strong>Thống kê Nam / Nữ:</strong> Tự động phân loại tỷ lệ cử tri Nam / Nữ, số cử tri đã nhận phiếu và chưa nhận phiếu.
                    </li>
                    <li>
                      <strong>Lọc theo Thôn / Tổ dân phố:</strong> Dễ dàng tìm kiếm cử tri theo từng khu vực dân cư.
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 uppercase text-xs border-b pb-1 flex items-center gap-1.5">
                    <ChevronRight className="w-4 h-4 text-sky-600" />
                    <span>2. Cấu Hình Khung Giờ Bỏ Phiếu & Tự Động Khóa (Auto-Lock System)</span>
                  </h4>
                  <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
                    <li>
                      <strong>Khung giờ chuẩn:</strong> Giờ mở hòm phiếu (<span className="font-bold text-sky-800">07:00</span>) và Giờ đóng hòm phiếu (<span className="font-bold text-sky-800">19:00</span>).
                    </li>
                    <li>
                      <strong>Bật / Tắt theo yêu cầu:</strong> Admin có thể chủ động Bật / Tắt tính năng kiểm tra thời gian thực tại phân hệ Hệ Thống (Mặc định TẮT khi chạy thử nghiệm, BẬT khi diễn ra bầu cử chính thức).
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {activeTopic === 'RESULTS' && (
              <div className="space-y-4">
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1">
                  <h3 className="font-extrabold text-emerald-950 text-sm flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-emerald-600" />
                    <span>PHÂN HỆ KẾT QUẢ & PHÂN RÃ MA TRẬN PHIẾU</span>
                  </h3>
                  <p className="text-slate-700">
                    Tổng hợp tự động kết quả bầu cử 3 cấp đại biểu theo thuật toán kiểm phiếu chính xác tuyệt đối.
                  </p>
                </div>

                <div className="space-y-3">
                  <ul className="list-disc pl-5 space-y-2 text-slate-700">
                    <li>
                      <strong>Chỉ số tổng quan:</strong> Thống kê tổng số phiếu thu vào, số phiếu phát ra, tỷ lệ % cử tri đi bầu, tổng số phiếu hợp lệ và phiếu không hợp lệ.
                    </li>
                    <li>
                      <strong>Bảng xếp hạng Trúng cử:</strong> Sắp xếp danh sách ứng cử viên theo thứ tự từ số phiếu bầu cao nhất xuống thấp nhất, tự động đánh dấu nhãn <strong className="text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">🏆 TRÚNG CỬ</strong> dựa theo số lượng đại biểu được bầu.
                    </li>
                    <li>
                      <strong>Ma trận phân rã phiếu bầu:</strong> Hiển thị chi tiết số phiếu hợp lệ, số phiếu bị gạch tên của từng ứng viên đối với từng phiếu bầu.
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {activeTopic === 'REPORTS' && (
              <div className="space-y-4">
                <div className="p-3.5 bg-purple-50 border border-purple-200 rounded-2xl space-y-1">
                  <h3 className="font-extrabold text-purple-950 text-sm flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-purple-600" />
                    <span>PHÂN HỆ XUẤT BÁO CÁO & BIÊN BẢN MẪU SỐ 18 / 23-HĐBC</span>
                  </h3>
                  <p className="text-slate-700">
                    Hỗ trợ xuất các văn bản hành chính theo đúng thể thức Nghị định 30/2020/NĐ-CP và Luật Bầu cử Quốc gia.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 uppercase text-xs border-b pb-1 flex items-center gap-1.5">
                    <ChevronRight className="w-4 h-4 text-purple-600" />
                    <span>1. Biên bản Kết quả Kiểm phiếu Mẫu 18-HĐBC (File Word .docx)</span>
                  </h4>
                  <p className="text-slate-700">
                    Biên bản chính thức của Tổ bầu cử về kết quả kiểm phiếu bầu cử Đại biểu Quốc hội & HĐND các cấp, tự động điền thông tin khu vực, đơn vị, chữ ký Tổ trưởng & Thư ký.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 uppercase text-xs border-b pb-1 flex items-center gap-1.5">
                    <ChevronRight className="w-4 h-4 text-purple-600" />
                    <span>2. Nghị quyết Tổng kết Mẫu 23-HĐBC (File Word .docx)</span>
                  </h4>
                  <p className="text-slate-700">
                    Nghị quyết công bố danh sách những người trúng cử Đại biểu HĐND, sẵn sàng in ấn và đóng dấu gửi cơ quan cấp trên.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 uppercase text-xs border-b pb-1 flex items-center gap-1.5">
                    <ChevronRight className="w-4 h-4 text-purple-600" />
                    <span>3. Báo cáo Dữ liệu Tổng hợp (File Excel .xlsx)</span>
                  </h4>
                  <p className="text-slate-700">
                    Xuất file Excel gồm nhiều tab: Thống kê cử tri, Danh sách ứng viên, Ma trận kiểm phiếu, Bảng xếp hạng phiếu bầu.
                  </p>
                </div>
              </div>
            )}

            {activeTopic === 'ADMIN' && (
              <div className="space-y-4">
                <div className="p-3.5 bg-slate-100 border border-slate-300 rounded-2xl space-y-1">
                  <h3 className="font-extrabold text-slate-950 text-sm flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-slate-700" />
                    <span>BẢO MẬT, PHÂN QUYỀN & KHÔI PHỤC MẬT KHẨU</span>
                  </h3>
                  <p className="text-slate-700">
                    Hệ thống phân quyền bảo mật 3 cấp kết hợp phân công nhiệm vụ theo cấp bầu cử.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 uppercase text-xs border-b pb-1 flex items-center gap-1.5">
                    <ChevronRight className="w-4 h-4 text-slate-600" />
                    <span>1. Phân quyền Vai Trò (Roles)</span>
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-slate-700">
                    <li><strong className="text-rose-700">ADMIN:</strong> Quản trị tối cao, phê duyệt tài khoản, cấu hình hệ thống.</li>
                    <li><strong className="text-sky-700">EDITOR:</strong> Cán bộ kiểm phiếu, được phép điểm danh và nhập phiếu bầu.</li>
                    <li><strong className="text-slate-700">VIEW:</strong> Quan sát viên, chỉ xem báo cáo kết quả (không được nhập phiếu).</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 uppercase text-xs border-b pb-1 flex items-center gap-1.5">
                    <ChevronRight className="w-4 h-4 text-slate-600" />
                    <span>2. Phân công Kiểm phiếu theo Cấp (`assignedLevel`)</span>
                  </h4>
                  <p className="text-slate-700">
                    Admin có thể phân công từng cán bộ phụ trách kiểm phiếu riêng biệt cho từng cấp (<span className="font-bold">Quốc hội / HĐND Tỉnh / HĐND Xã</span>). Cán bộ được phân công cấp nào chỉ thao tác được đúng cấp đó.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 uppercase text-xs border-b pb-1 flex items-center gap-1.5">
                    <ChevronRight className="w-4 h-4 text-slate-600" />
                    <span>3. Khôi Phục Mật Khẩu qua Email / SĐT (OTP Reset)</span>
                  </h4>
                  <p className="text-slate-700">
                    Khi quên mật khẩu, bấm <strong className="text-sky-700">🔑 Quên mật khẩu?</strong> tại trang Đăng nhập ➔ Nhập Email/SĐT để nhận mã xác thực OTP 6 chữ số ➔ Đặt mật khẩu mới an toàn.
                  </p>
                </div>
              </div>
            )}

            {activeTopic === 'OVERVIEW' && (
              <div className="space-y-4">
                <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl space-y-1">
                  <h3 className="font-extrabold text-blue-950 text-sm flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <span>THÔNG TIN TỔ BẦU CỬ & ĐƠN VỊ</span>
                  </h3>
                  <p className="text-slate-700">
                    Thiết lập danh nghĩa đơn vị hành chính và thành viên Tổ bầu cử phục vụ kết xuất các văn bản pháp lý.
                  </p>
                </div>

                <div className="space-y-3">
                  <ul className="list-disc pl-5 space-y-2 text-slate-700">
                    <li>
                      <strong>Thông tin Đơn vị:</strong> Cấu hình Khu vực bỏ phiếu, Tên Đơn vị bầu cử, Xã/Phường, Huyện/Quận, Tỉnh/Thành phố.
                    </li>
                    <li>
                      <strong>Thành viên Tổ bầu cử:</strong> Khai báo họ tên Tổ trưởng, Thư ký và các Ủy viên để tự động điền vào khung chữ ký biên bản Word (.docx) và báo cáo Excel.
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Bar */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500 font-medium hidden sm:block">
            🗳️ Hệ thống Kiểm phiếu Bầu cử Điện tử An Trạch - Hòa Tiến
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-sky-600 hover:bg-sky-700 text-white font-black text-xs rounded-xl shadow-md transition-all ml-auto"
          >
            Đã Hiểu Hướng Dẫn
          </button>
        </div>
      </div>
    </div>
  );
};
