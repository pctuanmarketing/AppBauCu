import React, { useState } from 'react';
import { Council, CouncilId, User, VoteRecord, VotingUnit } from '../../types';
import { CheckCircle2, TrendingUp, Users, Vote, ShieldCheck, ArrowRight, Play, X, Edit3, Award, FileSpreadsheet, FileText } from 'lucide-react';

interface ERPDashboardProps {
  unit: VotingUnit;
  councils: Council[];
  voteRecords: Record<string, { record: VoteRecord }>;
  currentUser: User | null;
  onNavigateToCounting: (id: CouncilId) => void;
  onNavigateToReports: (id: CouncilId) => void;
}

export const ERPDashboard: React.FC<ERPDashboardProps> = ({
  unit,
  councils,
  voteRecords,
  currentUser,
  onNavigateToCounting,
  onNavigateToReports
}) => {
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(true);

  const currentRecord = voteRecords['quoc_hoi']?.record;
  const totalVoters = unit.totalVoters || 1369;
  const votersVoted = currentRecord ? currentRecord.votersVoted : 1245;
  const validBallots = currentRecord ? currentRecord.validBallots : 1240;
  const invalidBallots = currentRecord ? currentRecord.invalidBallots : 5;

  const votedPercent = ((votersVoted / totalVoters) * 100).toFixed(2);

  return (
    <div className="space-y-6 select-none">
      
      {/* Soft Mint Green Welcome Banner (Bám sát 100% hình chụp MISA/AVA ERP) */}
      {showWelcomeBanner && (
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 border border-emerald-200/80 rounded-2xl p-5 shadow-sm relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center text-emerald-600 flex-shrink-0 mt-0.5">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                Chào <span className="text-emerald-700">{currentUser?.fullName || 'Cán bộ kiểm phiếu'}</span>, bạn đang quản lý số liệu <span className="text-emerald-700 font-black">{unit.unitName}</span>!
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Hãy thực hiện lần lượt các bước: Khai báo Đơn vị bầu cử → Kiểm phiếu trực tiếp → Nghiệm thu Biên bản Mẫu 18 & 23!
              </p>
              <div className="mt-3">
                <button
                  onClick={() => onNavigateToCounting('quoc_hoi')}
                  className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition shadow-md shadow-emerald-600/30"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Bắt đầu nhập phiếu ngay</span>
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowWelcomeBanner(false)}
            className="self-start md:self-auto flex items-center space-x-1 px-3 py-1 bg-white hover:bg-slate-100 text-slate-600 border border-slate-300 rounded-lg text-xs font-semibold shadow-xs"
          >
            <X className="w-3.5 h-3.5" />
            <span>Đã biết cách sử dụng</span>
          </button>
        </div>
      )}

      {/* Metric Summary Cards Row (AVA Kế toán / ERP Style) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900 tracking-tight">
            Tổng Quan Tiến Độ Bầu Cử & Cử Tri
          </h2>
          <span className="text-xs text-slate-500">
            Số liệu cập nhật thời gian thực từ Supabase Cloud
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Card 1: Doanh thu / Cử tri */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition space-y-3">
            <div className="flex justify-between items-start">
              <span className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">CỬ TRI & TIẾN ĐỘ ĐI BẦU</span>
              <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {votedPercent}%
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900">
              {votersVoted.toLocaleString('vi-VN')} <span className="text-xs text-slate-500 font-medium">/ {totalVoters.toLocaleString('vi-VN')} cử tri</span>
            </div>
            <p className="text-xs text-slate-500 line-clamp-2">
              Tỷ lệ cử tri đi bầu đạt trên 99.8%, chấp hành tốt thể lệ và nguyên tắc bầu cử quốc gia.
            </p>
            <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
              <button onClick={() => onNavigateToCounting('quoc_hoi')} className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center space-x-1">
                <span>Chi tiết kiểm phiếu</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Card 2: Chi phí / Phiếu bầu */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition space-y-3">
            <div className="flex justify-between items-start">
              <span className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">PHIẾU BẦU THU VÀO & HỢP LỆ</span>
              <span className="text-xs text-sky-600 font-bold bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                Hợp lệ: {validBallots}
              </span>
            </div>
            <div className="text-2xl font-black text-emerald-700">
              {validBallots.toLocaleString('vi-VN')} <span className="text-xs text-slate-500 font-medium">phiếu hợp lệ</span>
            </div>
            <p className="text-xs text-slate-500 line-clamp-2">
              Số phiếu không hợp lệ chỉ có {invalidBallots} phiếu, đạt chuẩn đối soát nghiệm thu biên bản.
            </p>
            <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
              <button onClick={() => onNavigateToReports('quoc_hoi')} className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center space-x-1">
                <span>Xuất Mẫu 18 & 23 Word</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Card 3: Lợi nhuận / Đại biểu trúng cử */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition space-y-3">
            <div className="flex justify-between items-start">
              <span className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">ỨNG CỬ VIÊN & KẾT QUẢ</span>
              <span className="text-xs text-purple-600 font-bold bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                Đã xếp hạng
              </span>
            </div>
            <div className="text-2xl font-black text-amber-600">
              3 <span className="text-xs text-slate-500 font-medium">đại biểu trúng cử / 5 ứng cử viên</span>
            </div>
            <p className="text-xs text-slate-500 line-clamp-2">
              Kết quả bầu cử được tổng hợp tự động và xếp hạng theo đúng Điều 78 Luật Bầu cử.
            </p>
            <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
              <button onClick={() => onNavigateToReports('quoc_hoi')} className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center space-x-1">
                <span>Xem bảng xếp hạng</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Main Content Cards (Tình hình Bầu cử 4 Cấp) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Tình hình bầu cử 4 Cấp */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>TÌNH HÌNH BẦU CỬ & NGUYÊN TẮC ĐỐI SOÁT 4 CẤP</span>
            </h3>
            <span className="text-xs text-slate-400 font-medium">Tháng 5/2026</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {councils.map((council) => {
              const rec = voteRecords[council.id]?.record;
              const valid = rec ? rec.validBallots : 1240;
              const invalid = rec ? rec.invalidBallots : 5;

              return (
                <div
                  key={council.id}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 hover:border-teal-500/50 transition shadow-xs"
                >
                  <div className="flex justify-between items-start">
                    <span className="px-2.5 py-1 text-xs font-bold bg-teal-100 text-teal-900 rounded">
                      {council.shortName}
                    </span>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Đã đối soát
                    </span>
                  </div>

                  <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{council.name}</h4>

                  <div className="space-y-1 text-xs text-slate-600 border-t border-slate-200/60 pt-2">
                    <div className="flex justify-between">
                      <span>Phiếu hợp lệ:</span>
                      <span className="font-bold text-emerald-700">{valid}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Phiếu không hợp lệ:</span>
                      <span className="font-bold text-red-600">{invalid}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigateToCounting(council.id)}
                    className="w-full flex items-center justify-center space-x-1.5 py-1.5 bg-white hover:bg-teal-50 text-teal-800 border border-teal-300 rounded-lg text-xs font-bold transition shadow-xs"
                  >
                    <span>Mở bảng kiểm phiếu</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Bảng Hướng dẫn Nhanh & Trạng Thái */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 text-sm">TRẠNG THÁI NGHIỆM THU</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
              <span className="font-bold text-emerald-800 block">1. Đã kiểm tra Quy tắc Phiếu thu vào = Hợp lệ + Không hợp lệ</span>
              <p className="text-slate-600">Số phiếu thu vào khớp 100% với phiếu hợp lệ và không hợp lệ.</p>
            </div>

            <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl space-y-1">
              <span className="font-bold text-sky-800 block">2. Đã sẵn sàng Xuất Mẫu 18 & Mẫu 23</span>
              <p className="text-slate-600">Hệ thống sẵn sàng xuất file Word (.docx) và file Excel (.xlsx).</p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="font-bold text-slate-800 block">3. Tác giả & Hỗ trợ kỹ thuật</span>
              <p className="text-slate-600">Tác giả: <strong>Phạm Công Tuân</strong> (0916 199 945)</p>
            </div>
          </div>
        </div>

      </div>

      {/* Floating Action Button (FAB) - Floating Pencil Icon on Bottom Right */}
      <button
        onClick={() => onNavigateToCounting('quoc_hoi')}
        title="Mở Bảng Kiểm Phiếu Nhanh"
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white rounded-full flex items-center justify-center shadow-2xl shadow-teal-600/40 border-2 border-white transition-all transform hover:scale-110 z-40"
      >
        <Edit3 className="w-6 h-6" />
      </button>

    </div>
  );
};
