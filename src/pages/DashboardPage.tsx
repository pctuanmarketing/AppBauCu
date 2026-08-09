import React from 'react';
import {
  Users,
  CheckCircle2,
  Clock,
  TrendingUp,
  Vote,
  FileSpreadsheet,
  Building2,
  ChevronRight,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { Candidate, ElectionLevelConfig, ElectionUnit, Voter } from '../types';

interface DashboardPageProps {
  unit: ElectionUnit;
  configs: Record<string, ElectionLevelConfig>;
  voters: Voter[];
  candidates: Candidate[];
  setActiveTab: (tab: string) => void;
  onOpenQuickAction: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  unit,
  configs,
  voters,
  candidates,
  setActiveTab,
  onOpenQuickAction,
}) => {
  // Statistics
  const totalVoters = voters.length > 0 ? voters.length : 1369;
  const votedCount = voters.filter(v => v.hasVoted).length;
  const remainingVoters = totalVoters - votedCount;
  const votedPercentage = totalVoters > 0 ? ((votedCount / totalVoters) * 100).toFixed(1) : '0.0';

  // Group voters by address/village
  const villages = Array.from(new Set(voters.map(v => v.address)));
  const villageStats = villages.map(village => {
    const villageVoters = voters.filter(v => v.address === village);
    const villageVoted = villageVoters.filter(v => v.hasVoted).length;
    const pct = villageVoters.length > 0 ? ((villageVoted / villageVoters.length) * 100).toFixed(1) : '0';
    return {
      name: village,
      total: villageVoters.length,
      voted: villageVoted,
      pct,
    };
  });

  return (
    <div className="space-y-6">
      {/* Banner Chào mừng (Style MISA AMIS UI) */}
      <div className="bg-gradient-to-r from-sky-700 via-sky-600 to-teal-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full opacity-15 pointer-events-none flex items-center justify-center">
          <Vote className="w-80 h-80 text-white transform rotate-12" />
        </div>
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Hệ thống Kiểm phiếu & Quản lý Bầu cử Real-time</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Tổ Bầu cử Số {unit.votingAreaNo} - {unit.wardName}, {unit.province}
          </h1>
          <p className="text-sky-100 text-xs sm:text-sm">
            Theo dõi tiến độ cử tri đi bầu theo thời gian thực, nhập gạch phiếu siêu tốc và tự động tổng hợp biên bản báo cáo bầu cử các cấp.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('ballot_counting')}
              className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-2 shadow transition-all transform hover:-translate-y-0.5"
            >
              <Vote className="w-4 h-4" />
               VÀO KIỂM PHIẾU NGAY
            </button>
            <button
              onClick={() => setActiveTab('voters')}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2 rounded-lg text-xs flex items-center gap-2 border border-white/30 backdrop-blur-md transition-all"
            >
              <Users className="w-4 h-4" />
              Điểm danh cử tri đi bầu
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Voters */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-500">TỔNG SỐ CỬ TRI</span>
            <div className="text-2xl font-extrabold text-slate-800">{totalVoters.toLocaleString('vi-VN')}</div>
            <span className="text-[11px] text-slate-400">Danh sách niêm phong</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Voted Count */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-500">CỬ TRI ĐÃ ĐI BẦU</span>
            <div className="text-2xl font-extrabold text-emerald-600">{votedCount.toLocaleString('vi-VN')}</div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Đang cập nhật liên tục</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Remaining Voters */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-500">CỬ TRI CHƯA BẦU</span>
            <div className="text-2xl font-extrabold text-amber-600">{remainingVoters.toLocaleString('vi-VN')}</div>
            <span className="text-[11px] text-amber-600 font-medium">Cần đôn đốc khu vực</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Progress Percentage */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-500">TỶ LỆ BẦU CỬ</span>
            <div className="text-2xl font-extrabold text-sky-700">{votedPercentage}%</div>
            <div className="w-28 bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
              <div
                className="bg-gradient-to-r from-sky-500 to-teal-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, parseFloat(votedPercentage))}%` }}
              />
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Grid: Realtime Voting Progress by Village + Election Level Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Progress by Village/Address */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-800">Tiến độ cử tri đi bỏ phiếu theo Thôn / Khu vực</h2>
              <p className="text-xs text-slate-500">Cập nhật khi tổ bầu cử quét thẻ hoặc điểm danh cử tri</p>
            </div>
            <button
              onClick={() => setActiveTab('voters')}
              className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1"
            >
              <span>Xem chi tiết cử tri</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {villageStats.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-lg bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-sky-500" />
                    {item.name}
                  </span>
                  <span>
                    {item.voted} / {item.total} cử tri ({item.pct}%)
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-sky-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Quick Stats by Election Level */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-800">Cấu hình Đơn vị Bầu cử 3 Cấp</h2>
            <p className="text-xs text-slate-500">Khóa {unit.term} - Tổ Bầu Cử #{unit.votingAreaNo}</p>
          </div>

          <div className="space-y-3">
            {Object.values(configs).map((cfg, idx) => {
              const levelCandidates = candidates.filter(c => c.electionLevel === cfg.levelCode);
              return (
                <div key={idx} className="p-3.5 rounded-lg border border-slate-200 hover:border-sky-300 transition-colors bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-sky-800 uppercase tracking-wide">
                      {cfg.levelName}
                    </span>
                    <span className="text-[10px] font-bold bg-sky-100 text-sky-800 px-2 py-0.5 rounded">
                      Bầu {cfg.numRepresentatives} / {cfg.numCandidates} người
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Phiếu phát ra: <strong>{cfg.ballotsIssued}</strong></span>
                      <span>Phiếu nhận vào: <strong>{cfg.ballotsReceived}</strong></span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Số ứng cử viên đăng ký: {levelCandidates.length} người
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => setActiveTab('election_data')}
              className="w-full py-2 text-center text-xs font-bold text-sky-600 hover:text-sky-700 bg-sky-50 rounded-lg border border-sky-100 transition-all flex items-center justify-center gap-1"
            >
              <span>Cấu hình & Danh sách ứng cử viên</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
