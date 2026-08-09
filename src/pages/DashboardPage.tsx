import React from 'react';
import {
  Users,
  Vote,
  Award,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
  Building2,
  FileSpreadsheet,
  BarChart3,
} from 'lucide-react';
import { Candidate, ElectionLevel, ElectionLevelConfig, ElectionUnit, Voter } from '../types';

interface DashboardPageProps {
  unit: ElectionUnit;
  configs: Record<ElectionLevel, ElectionLevelConfig>;
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
  const totalVotersCount = voters.length;
  const votedCount = voters.filter(v => v.hasVoted).length;
  const remainingVoters = totalVotersCount - votedCount;
  const turnOutPct = totalVotersCount > 0 ? ((votedCount / totalVotersCount) * 100).toFixed(2) : '0.00';

  // Group voters by Village / Address
  const villageStatsMap = voters.reduce((acc, v) => {
    const vName = v.address || 'Khác';
    if (!acc[vName]) {
      acc[vName] = { total: 0, voted: 0 };
    }
    acc[vName].total += 1;
    if (v.hasVoted) acc[vName].voted += 1;
    return acc;
  }, {} as Record<string, { total: number; voted: number }>);

  const villageList = Object.entries(villageStatsMap).map(([name, stat]) => ({
    name,
    total: stat.total,
    voted: stat.voted,
    pct: stat.total > 0 ? ((stat.voted / stat.total) * 100).toFixed(1) : '0.0',
  }));

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Welcome Banner Card */}
      <div className="bg-gradient-to-r from-sky-900 via-slate-900 to-sky-950 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden border border-sky-800/40">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold border border-sky-400/30 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>HỆ THỐNG BẦU CỬ ĐIỆN TỬ {unit.term}</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              TỔ BẦU CỬ SỐ {unit.votingAreaNo} - {unit.wardName.toUpperCase()}
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Khu vực bỏ phiếu: <strong className="text-sky-300">{unit.hdndXaVillages}</strong> | Quản lý tiến độ cử tri đi bầu và tính toán biên bản kết quả kiểm phiếu 3 cấp thời gian thực.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenQuickAction}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <Vote className="w-4 h-4" />
              <span>+ Thao tác nhanh</span>
            </button>
            <button
              onClick={() => setActiveTab('ballot_counting')}
              className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-sky-600/30 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Vào Kiểm phiếu ➔</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI METRIC CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Tổng số cử tri */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tổng cử tri</span>
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-black text-slate-900">{totalVotersCount.toLocaleString('vi-VN')}</div>
            <p className="text-[11px] text-slate-500 font-medium">Danh sách cử tri chính thức</p>
          </div>
        </div>

        {/* Card 2: Cử tri đã bỏ phiếu */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-200/80 shadow-sm hover:shadow-md transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Đã bỏ phiếu</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-black text-emerald-700">{votedCount.toLocaleString('vi-VN')}</div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Đạt {turnOutPct}% tổng cử tri</span>
            </div>
          </div>
        </div>

        {/* Card 3: Cử tri chưa đi bầu */}
        <div className="bg-white p-5 rounded-2xl border border-rose-200/80 shadow-sm hover:shadow-md transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">Chưa đi bầu</span>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-black text-rose-700">{remainingVoters.toLocaleString('vi-VN')}</div>
            <p className="text-[11px] text-slate-500 font-medium">Cử tri cần đôn đốc đi bầu</p>
          </div>
        </div>

        {/* Card 4: Tổng số ứng cử viên */}
        <div className="bg-white p-5 rounded-2xl border border-amber-200/80 shadow-sm hover:shadow-md transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Số ứng cử viên</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-black text-amber-800">{candidates.length}</div>
            <p className="text-[11px] text-slate-500 font-medium">Ứng cử viên 3 cấp đại biểu</p>
          </div>
        </div>
      </div>

      {/* VILLAGE PROGRESS BARS & QUICK MODULE NAVIGATION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Village Voting Progress List (Cols 8) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-sky-600" />
              TIẾN ĐỘ BỎ PHIẾU THEO THÔN / TỔ DÂN PHỐ
            </h2>
            <button
              onClick={() => setActiveTab('voters')}
              className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1"
            >
              <span>Xem danh sách</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {villageList.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">Chưa có dữ liệu danh sách cử tri.</p>
            ) : (
              villageList.map(v => (
                <div key={v.name} className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-slate-800">{v.name}</span>
                    <span className="text-slate-600">
                      {v.voted} / {v.total} cử tri ({v.pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 transition-all duration-500 rounded-full"
                      style={{ width: `${v.pct}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Module Shortcuts Panel (Cols 4) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-extrabold text-slate-900">TRUY CẬP NHANH PHẦN MỀM</h2>
            <p className="text-xs text-slate-500">Chuyển đổi phân hệ làm việc nhanh</p>
          </div>

          <div className="space-y-2.5">
            <button
              onClick={() => setActiveTab('ballot_counting')}
              className="w-full p-3.5 rounded-xl bg-slate-50 hover:bg-sky-50 text-slate-800 hover:text-sky-900 border border-slate-200 hover:border-sky-300 font-bold text-xs flex items-center justify-between transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
                  🗳️
                </div>
                <span>Kiểm phiếu 3 cấp</span>
              </div>
              <span className="group-hover:translate-x-1 transition-transform">➔</span>
            </button>

            <button
              onClick={() => setActiveTab('voters')}
              className="w-full p-3.5 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 border border-slate-200 hover:border-emerald-300 font-bold text-xs flex items-center justify-between transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  👥
                </div>
                <span>Điểm danh cử tri</span>
              </div>
              <span className="group-hover:translate-x-1 transition-transform">➔</span>
            </button>

            <button
              onClick={() => setActiveTab('results_report')}
              className="w-full p-3.5 rounded-xl bg-slate-50 hover:bg-amber-50 text-slate-800 hover:text-amber-900 border border-slate-200 hover:border-amber-300 font-bold text-xs flex items-center justify-between transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                  📄
                </div>
                <span>Biên bản kết quả</span>
              </div>
              <span className="group-hover:translate-x-1 transition-transform">➔</span>
            </button>
          </div>

          <div className="p-3 bg-sky-50 rounded-xl border border-sky-200/80 text-[11px] text-sky-900 font-medium text-center">
            🔒 Hệ thống đang hoạt động an toàn | Khóa XVI 2026-2031
          </div>
        </div>
      </div>
    </div>
  );
};
