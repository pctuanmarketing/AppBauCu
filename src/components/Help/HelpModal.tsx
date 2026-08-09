import React from 'react';
import { X, Globe, FileText, ExternalLink, Award, Mail, Phone } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  mode: 'guide' | 'author';
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({
  isOpen,
  mode,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-slate-100 border-2 border-slate-400 rounded-lg max-w-2xl w-full p-2 shadow-2xl font-sans text-xs text-slate-900">
        
        {/* Window Title Bar */}
        <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 text-white px-3 py-1.5 flex items-center justify-between shadow">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-amber-300" />
            <span className="font-bold text-xs uppercase tracking-wide">
              {mode === 'guide' ? 'HƯỚNG DẪN SỬ DỤNG' : 'THÔNG TIN TÁC GIẢ TÁC PHẨM'}
            </span>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        {mode === 'guide' ? (
          <div className="p-4 bg-white border border-slate-300 mt-2 space-y-3 max-h-[75vh] overflow-y-auto leading-relaxed shadow-inner">
            <h2 className="text-base font-extrabold text-slate-900 border-b pb-1">
              KIỂM PHIẾU BẦU CỬ 2026
            </h2>
            <p className="text-slate-400 font-mono text-[11px]">--------------------------------------------------------------------------------</p>

            <div className="space-y-1">
              <p>- Ứng dụng hỗ trợ việc nhập liệu phiếu bầu và in văn bản kiểm phiếu theo mẫu qui định.</p>
              <p>- Ứng dụng hoàn toàn miễn phí.</p>
            </div>

            <div className="space-y-2 pt-2">
              <p className="font-bold text-slate-900">- Nhập liệu theo trình tự 1, 2, 3 trên thanh Menu.</p>

              <div className="pl-3 space-y-1">
                <p className="font-bold text-red-800">1. Dữ liệu bầu cử:</p>
                <p className="pl-3 text-slate-700">
                  Đây là những thông tin cần cho việc in văn bản báo cáo. Dữ liệu về khu vực bầu cử, cử tri, số lượng đại biểu và các ứng viên tham gia của đơn vị bầu cử.
                </p>
              </div>

              <div className="pl-3 space-y-1">
                <p className="font-bold text-red-800">2. Kiểm phiếu:</p>
                <p className="pl-3 text-slate-700">
                  nhập liệu phiếu bầu và tổng hợp ngay kết quả bầu của từng ứng cử viên.
                </p>
                <ul className="pl-6 list-disc space-y-1 text-slate-700">
                  <li>Nhập liệu bằng phím số + phím Enter giúp xử lý nhanh từng phiếu bầu.</li>
                  <li>Nhập kiểu kiểm phiếu ngược, tức là chỉ nhập số thứ tự những người bị gạch tên.</li>
                  <li>Có thể quay lại chỉnh sửa các phiếu vừa đọc nhưng không xóa được.</li>
                  <li>Phiếu được nhập sẽ tự động nhảy số thứ tự. Người đọc chỉ cần sau khi đọc xong sẽ nhóm phiếu lại theo số lượng 50, 100... phiếu. Đánh số thứ tự cho các nhóm phiếu đó để tiện cho việc kiểm tra lại (dò số phiếu bị sai) nếu có phát sinh. Ví dụ: đánh số 1 - 50 cho nhóm phiếu đầu, nhóm phiếu được đọc kế tiếp sẽ đánh số 56 - 100,...</li>
                </ul>
              </div>

              <div className="pl-3 space-y-1">
                <p className="font-bold text-red-800">3. Thống kê kết quả:</p>
                <ul className="pl-6 list-disc space-y-1 text-slate-700">
                  <li>Ứng dụng tự động tổng hợp kết quả bầu cử của từng ứng cử viên và xếp hạng theo số phiếu từ cao đến thấp.</li>
                  <li>Có tính năng xuất dữ liệu ra Excel nếu cần.</li>
                  <li>Xuất in biên bản báo cáo kết quả kiểm phiếu theo mẫu qui định.</li>
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t text-xs font-semibold text-sky-800 flex items-center space-x-1">
              <span>* Xem video hướng dẫn thao tác:</span>
              <a
                href="https://www.youtube.com/watch?v=3rVKiKTBINA"
                target="_blank"
                rel="noreferrer"
                className="underline flex items-center space-x-1 hover:text-sky-900"
              >
                <span>https://www.youtube.com/watch?v=3rVKiKTBINA</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>
        ) : (
          <div className="p-6 bg-white border border-slate-300 mt-2 space-y-4 shadow-inner text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-red-700 text-amber-300 flex items-center justify-center font-bold text-xl shadow">
              🇻🇳
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">PHẦN MỀM KIỂM PHIẾU BẦU CỬ 2026</h3>
              <p className="text-xs text-slate-500 mt-0.5">Phiên bản WebApp v2.0 (Chạy trên Vercel & Supabase Cloud)</p>
            </div>

            <div className="bg-gradient-to-r from-red-50 to-amber-50 p-4 rounded-lg text-xs space-y-2 text-slate-800 text-left border border-red-200 shadow-xs">
              <div className="flex items-center space-x-2 text-red-800 font-extrabold text-sm border-b border-red-200 pb-1">
                <Award className="w-5 h-5 text-amber-500" />
                <span>TÁC GIẢ PHẦN MỀM: PHẠM CÔNG TUÂN</span>
              </div>
              <p>• <strong>Họ và tên tác giả:</strong> <span className="font-bold text-red-800">Phạm Công Tuân</span></p>
              <p>• <strong>Bản quyền phần mềm:</strong> Thiết kế và phát triển ứng dụng Kiểm phiếu Bầu cử Đại biểu Quốc hội & HĐND các cấp 2026 - 2031.</p>
              <p className="flex items-center space-x-1">
                <Mail className="w-3.5 h-3.5 text-red-600 inline mr-1" />
                <span><strong>Email liên hệ:</strong> <a href="mailto:pctuanit@gmail.com" className="text-sky-800 font-bold underline">pctuanit@gmail.com</a></span>
              </p>
              <p className="flex items-center space-x-1">
                <Phone className="w-3.5 h-3.5 text-emerald-600 inline mr-1" />
                <span><strong>Điện thoại:</strong> <a href="tel:0916199945" className="text-sky-800 font-bold underline">0916 199 945</a></span>
              </p>
              <p>• <strong>Nền tảng công nghệ:</strong> WebApp React TypeScript + Vercel CDN + Supabase Cloud PostgreSQL.</p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-bold"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
};
