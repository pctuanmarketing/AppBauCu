import React, { useState, useEffect } from 'react';
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
  Activity,
  LayoutDashboard,
  Trophy,
  Filter,
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
  const [liveTime, setLiveTime] = useState(new Date());
  const [villageFilter, setVillageFilter] = useState<'ALL' | 'ACTIVE' | 'ZERO'>('ALL');

  useEffect(() => {
    const timer = setInterval(() => setLiveTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = liveTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateString = liveTime.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

  // Voters Demographics
  const totalVotersCount = voters.length;
  const votedCount = voters.filter(v => v.hasVoted).length;
  const remainingVoters = totalVotersCount - votedCount;

  const maleCount = voters.filter(v => v.gender === 'Nam').length;
  const femaleCount = voters.filter(v => v.gender === 'Nữ').length;
  const malePct = totalVotersCount > 0 ? ((maleCount / totalVotersCount) * 100).toFixed(1) : '0.0';
  const femalePct = totalVotersCount > 0 ? ((femaleCount / totalVotersCount) * 100).toFixed(1) : '0.0';

  const turnOutPctNum = totalVotersCount > 0 ? (votedCount / totalVotersCount) * 100 : 0;
  const remainingPctNum = totalVotersCount > 0 ? (remainingVoters / totalVotersCount) * 100 : 0;

  const turnOutPct = turnOutPctNum.toFixed(2);
  const remainingPct = remainingPctNum.toFixed(2);

  // Candidates Stats per Level & Age Calculation
  const candQH = candidates.filter(c => c.electionLevel === 'QUOC_HOI').length;
  const candTinh = candidates.filter(c => c.electionLevel === 'HDND_TINH').length;
  const candXa = candidates.filter(c => c.electionLevel === 'HDND_XA').length;

  const getCandidateAge = (dob?: string) => {
    if (!dob) return null;
    const yearMatch = dob.match(/\d{4}/);
    if (yearMatch) {
      const birthYear = parseInt(yearMatch[0]);
      const currentYear = new Date().getFullYear();
      if (birthYear > 1920 && birthYear <= currentYear) {
        return currentYear - birthYear;
      }
    }
    const num = Number(dob);
    if (!isNaN(num) && num > 10000 && num < 100000) {
      const d = new Date(Math.round((num - 25569) * 86400 * 1000));
      return new Date().getFullYear() - d.getFullYear();
    }
    return null;
  };

  const candidateAges = candidates
    .map(c => getCandidateAge(c.dob))
    .filter((a): a is number => a !== null);

  const minAge = candidateAges.length > 0 ? Math.min(...candidateAges) : 0;
  const maxAge = candidateAges.length > 0 ? Math.max(...candidateAges) : 0;
  const avgAge = candidateAges.length > 0 ? (candidateAges.reduce((s, a) => s + a, 0) / candidateAges.length).toFixed(1) : '0.0';

  // 1. Phân rã cử tri theo số cấp được bầu (3 cấp & 2 cấp)
  const voters3Levels = voters.filter(
    v => (v.eligibleQuocHoi !== false) && (v.eligibleHdndTinh !== false) && (v.eligibleHdndXa !== false)
  ).length;

  const voters2Levels = voters.filter(v => {
    const count = [v.eligibleQuocHoi !== false, v.eligibleHdndTinh !== false, v.eligibleHdndXa !== false].filter(Boolean).length;
    return count === 2;
  }).length;

  // 2. Thống kê cử tri đi bầu tương ứng cho từng cấp bầu cử
  const totalQuocHoi = voters.filter(v => v.eligibleQuocHoi !== false).length;
  const votedQuocHoi = voters.filter(v => v.hasVoted && (v.eligibleQuocHoi !== false)).length;
  const pctQuocHoi = totalQuocHoi > 0 ? ((votedQuocHoi / totalQuocHoi) * 100).toFixed(2) : '0.00';

  const totalHdndTinh = voters.filter(v => v.eligibleHdndTinh !== false).length;
  const votedHdndTinh = voters.filter(v => v.hasVoted && (v.eligibleHdndTinh !== false)).length;
  const pctHdndTinh = totalHdndTinh > 0 ? ((votedHdndTinh / totalHdndTinh) * 100).toFixed(2) : '0.00';

  const totalHdndXa = voters.filter(v => v.eligibleHdndXa !== false).length;
  const votedHdndXa = voters.filter(v => v.hasVoted && (v.eligibleHdndXa !== false)).length;
  const pctHdndXa = totalHdndXa > 0 ? ((votedHdndXa / totalHdndXa) * 100).toFixed(2) : '0.00';

  // Clean and Group voters by Village / Address
  const formatVillageName = (addr: string) => {
    return addr.replace(/,+/g, ',').replace(/\s+/g, ' ').trim();
  };

  const villageStatsMap = voters.reduce((acc, v) => {
    const rawAddr = v.address || 'Khu vực khác';
    const cleanAddr = formatVillageName(rawAddr);
    if (!acc[cleanAddr]) {
      acc[cleanAddr] = { total: 0, voted: 0 };
    }
    acc[cleanAddr].total += 1;
    if (v.hasVoted) acc[cleanAddr].voted += 1;
    return acc;
  }, {} as Record<string, { total: number; voted: number }>);

  const villageList = Object.entries(villageStatsMap).map(([name, stat]) => ({
    name,
    total: stat.total,
    voted: stat.voted,
    pctNum: stat.total > 0 ? (stat.voted / stat.total) * 100 : 0,
    pctStr: stat.total > 0 ? ((stat.voted / stat.total) * 100).toFixed(1) : '0.0',
  })).sort((a, b) => b.total - a.total);

  const filteredVillageList = villageList.filter(v => {
    if (villageFilter === 'ACTIVE') return v.voted > 0;
    if (villageFilter === 'ZERO') return v.voted === 0;
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Top Welcome Banner Card */}
      <div className="bg-gradient-to-r from-sky-900 via-slate-900 to-sky-950 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden border border-sky-800/40">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold border border-sky-400/30 backdrop-blur-md">
              <LayoutDashboard className="w-3.5 h-3.5 text-sky-400" />
              <span>DASHBOARD TỔNG QUAN BẦU CỬ {unit.term}</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white uppercase">
              DASHBOARD - {unit.wardName.toUpperCase()}
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Khu vực bỏ phiếu số <strong className="text-sky-300">{unit.votingAreaNo}</strong> ({unit.hdndXaVillages}) | Theo dõi tiến độ cử tri đi bầu và chỉ số kiểm phiếu 3 cấp thời gian thực.
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
              <span>Vào KIỂM PHIẾU BẦU CỬ ➔</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI METRIC CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Tổng số cử tri (Có Nam / Nữ) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Tổng cử tri</span>
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-black text-slate-900">{totalVotersCount.toLocaleString('vi-VN')} <span className="text-xs text-slate-400 font-normal">cử tri</span></div>
            <div className="flex items-center gap-3 text-[11px] font-bold text-slate-600 pt-2 border-t border-slate-100">
              <span className="text-sky-700">Nam: <strong>{maleCount}</strong> ({malePct}%)</span>
              <span className="text-rose-600">Nữ: <strong>{femaleCount}</strong> ({femalePct}%)</span>
            </div>
          </div>
        </div>

        {/* Card 2: Cử tri đã bỏ phiếu */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-200/80 shadow-sm hover:shadow-md transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider">Đã bỏ phiếu</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-black text-emerald-700">{votedCount.toLocaleString('vi-VN')} <span className="text-xs text-emerald-600 font-normal">cử tri</span></div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 pt-2 border-t border-emerald-100">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Đạt <strong>{turnOutPct}%</strong> tổng cử tri</span>
            </div>
          </div>
        </div>

        {/* Card 3: Cử tri chưa đi bầu */}
        <div className="bg-white p-5 rounded-2xl border border-rose-200/80 shadow-sm hover:shadow-md transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-rose-700 uppercase tracking-wider">Chưa đi bầu</span>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-black text-rose-700">{remainingVoters.toLocaleString('vi-VN')} <span className="text-xs text-rose-600 font-normal">cử tri</span></div>
            <div className="text-[11px] text-rose-600 font-bold pt-2 border-t border-rose-100">
              Còn <strong>{remainingPct}%</strong> cử tri chưa đi bầu
            </div>
          </div>
        </div>

        {/* Card 4: Tổng số ứng cử viên (Phân cấp & Độ tuổi) */}
        <div className="bg-white p-5 rounded-2xl border border-amber-200/80 shadow-sm hover:shadow-md transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-amber-800 uppercase tracking-wider">Tổng ứng cử viên</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-black text-amber-800">{candidates.length} <span className="text-xs text-amber-700 font-normal">người</span></div>
            <div className="text-[11px] font-semibold text-slate-600 pt-2 border-t border-slate-100 space-y-1">
              <div className="flex justify-between text-[11px]">
                <span>Quốc hội: <strong className="text-slate-900">{candQH}</strong></span>
                <span>Tỉnh: <strong className="text-slate-900">{candTinh}</strong></span>
                <span>Xã: <strong className="text-slate-900">{candXa}</strong></span>
              </div>
              <div className="text-[10px] text-amber-900 font-mono font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block">
                Độ tuổi: {minAge} - {maxAge} tuổi (TB: {avgAge}t)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* THANH THỐNG KÊ CỬ TRI THEO THỜI GIAN THỰC (REAL-TIME PROGRESS WIDGET) */}
      <div className="bg-white p-5 rounded-2xl border-2 border-sky-300 shadow-md space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-3 gap-2">
          <div className="space-y-0.5">
            <h2 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <Activity className="w-4 h-4 text-sky-600 animate-pulse" />
              <span>BÁO CÁO THỐNG KÊ CỬ TRI THEO THỜI GIAN THỰC (REAL-TIME PROGRESS)</span>
            </h2>
            <div className="text-[11px] text-slate-500 font-medium flex items-center gap-2">
              <span className="flex items-center gap-1 font-mono text-sky-800 font-bold">
                <Clock className="w-3.5 h-3.5 text-sky-600" />
                Cập nhật thời gian thực: {timeString} - {dateString}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-emerald-800 bg-emerald-50 border border-emerald-300 px-3.5 py-1.5 rounded-xl shadow-2xs flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>ĐÃ ĐI BẦU ĐẾN THỜI ĐIỂM HIỆN TẠI: {votedCount.toLocaleString('vi-VN')} / {totalVotersCount.toLocaleString('vi-VN')} CỬ TRI ({turnOutPct}%)</span>
            </span>
          </div>
        </div>

        <div className="space-y-2.5 text-xs font-bold font-sans">
          {/* ROW 1: TỔNG SỐ CỬ TRI */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="w-full sm:w-64 text-slate-800 font-extrabold text-right uppercase tracking-wider pr-2">
              TỔNG SỐ CỬ TRI
            </div>
            <div className="flex-1 bg-sky-100/60 h-9 rounded-lg border border-sky-300 relative overflow-hidden flex items-center shadow-inner">
              <div className="h-full bg-gradient-to-r from-sky-500 via-sky-600 to-blue-600 transition-all duration-500 rounded-l" style={{ width: '100%' }} />
              <span className="absolute inset-0 flex items-center justify-center font-extrabold text-slate-900 text-sm tracking-widest drop-shadow-xs">
                {totalVotersCount.toLocaleString('vi-VN')}
              </span>
            </div>
            <div className="w-full sm:w-28 bg-emerald-600 text-white font-mono font-extrabold text-center py-2 rounded-lg border border-emerald-700 shadow-xs text-xs">
              100.00%
            </div>
          </div>

          {/* ROW 2: TỔNG SỐ CỬ TRI ĐÃ BỎ PHIẾU */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="w-full sm:w-64 text-emerald-700 font-extrabold text-right uppercase tracking-wider pr-2">
              TỔNG SỐ CỬ TRI ĐÃ BỎ PHIẾU
            </div>
            <div className="flex-1 bg-emerald-50 h-9 rounded-lg border border-emerald-300 relative overflow-hidden flex items-center shadow-inner">
              <div className="h-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 transition-all duration-500 rounded-l" style={{ width: `${Math.min(100, turnOutPctNum)}%` }} />
              <span className="absolute inset-0 flex items-center justify-center font-extrabold text-emerald-950 text-sm tracking-widest drop-shadow-xs">
                {votedCount.toLocaleString('vi-VN')}
              </span>
            </div>
            <div className="w-full sm:w-28 bg-emerald-600 text-white font-mono font-extrabold text-center py-2 rounded-lg border border-emerald-700 shadow-xs text-xs">
              {turnOutPct}%
            </div>
          </div>

          {/* ROW 3: TỔNG SỐ CỬ TRI CHƯA BỎ PHIẾU */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="w-full sm:w-64 text-rose-700 font-extrabold text-right uppercase tracking-wider pr-2">
              TỔNG SỐ CỬ TRI CHƯA BỎ PHIẾU
            </div>
            <div className="flex-1 bg-rose-50 h-9 rounded-lg border border-rose-300 relative overflow-hidden flex items-center shadow-inner">
              <div className="h-full bg-gradient-to-r from-sky-400 via-rose-500 to-rose-600 transition-all duration-500 rounded-l" style={{ width: `${Math.min(100, remainingPctNum)}%` }} />
              <span className="absolute inset-0 flex items-center justify-center font-extrabold text-rose-950 text-sm tracking-widest drop-shadow-xs">
                {remainingVoters.toLocaleString('vi-VN')}
              </span>
            </div>
            <div className="w-full sm:w-28 bg-emerald-600 text-white font-mono font-extrabold text-center py-2 rounded-lg border border-emerald-700 shadow-xs text-xs">
              {remainingPct}%
            </div>
          </div>
        </div>

        {/* KHU VỰC THỐNG KÊ CHI TIẾT: CỬ TRI BẦU 3 CẤP & 2 CẤP & SỐ CỬ TRI ĐÃ ĐI BẦU THEO TỪNG CẤP */}
        <div className="pt-3 border-t border-slate-200 space-y-3">
          {/* THỐNG KÊ CỬ TRI 3 CẤP VÀ 2 CẤP */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3.5 bg-gradient-to-r from-sky-50 to-blue-50 rounded-xl border border-sky-200 flex items-center justify-between shadow-2xs">
              <div className="space-y-0.5">
                <div className="font-extrabold text-sky-950 text-xs uppercase flex items-center gap-1.5">
                  <span>🗳️ CỬ TRI BẦU 3 CẤP</span>
                  <span className="text-[10px] text-sky-700 font-medium">(Quốc hội + HĐND Tỉnh + HĐND Xã)</span>
                </div>
                <p className="text-[11px] text-slate-600">Tổng số cử tri được cấp 3 phiếu bầu</p>
              </div>
              <div className="text-right">
                <div className="text-base font-black text-sky-900 font-mono">{voters3Levels.toLocaleString('vi-VN')}</div>
                <div className="text-[10px] font-bold text-sky-700 bg-white px-2 py-0.5 rounded border border-sky-300 inline-block">
                  {totalVotersCount > 0 ? ((voters3Levels / totalVotersCount) * 100).toFixed(1) : '0'}% tổng cử tri
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200 flex items-center justify-between shadow-2xs">
              <div className="space-y-0.5">
                <div className="font-extrabold text-purple-950 text-xs uppercase flex items-center gap-1.5">
                  <span>🗳️ CỬ TRI BẦU 2 CẤP</span>
                  <span className="text-[10px] text-purple-700 font-medium">(Cử tri biến động / Tạm trú)</span>
                </div>
                <p className="text-[11px] text-slate-600">Tổng số cử tri được cấp 2 phiếu bầu</p>
              </div>
              <div className="text-right">
                <div className="text-base font-black text-purple-900 font-mono">{voters2Levels.toLocaleString('vi-VN')}</div>
                <div className="text-[10px] font-bold text-purple-700 bg-white px-2 py-0.5 rounded border border-purple-300 inline-block">
                  {totalVotersCount > 0 ? ((voters2Levels / totalVotersCount) * 100).toFixed(1) : '0'}% tổng cử tri
                </div>
              </div>
            </div>
          </div>

          {/* THỐNG KÊ SỐ CỬ TRI ĐÃ ĐI BẦU TƯƠNG ỨNG CHO TỪNG CẤP BẦU CỬ */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/90 space-y-2.5">
            <div className="font-extrabold text-slate-900 text-xs uppercase tracking-wide flex items-center gap-2 border-b border-slate-200 pb-2">
              <Vote className="w-4 h-4 text-sky-600" />
              SỐ CỬ TRI ĐÃ ĐI BẦU TƯƠNG ỨNG CHO TỪNG CẤP BẦU CỬ ĐẾN THỜI ĐIỂM HIỆN TẠI ({timeString}):
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              {/* 1. ĐẠI BIỂU QUỐC HỘI */}
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                <div className="flex items-center justify-between font-bold text-xs text-slate-800">
                  <span className="text-sky-900 font-extrabold">🇻🇳 ĐẠI BIỂU QUỐC HỘI</span>
                  <span className="font-mono text-sky-700 font-extrabold">{pctQuocHoi}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                  <div className="bg-sky-600 h-full transition-all duration-500 rounded-full" style={{ width: `${Math.min(100, Number(pctQuocHoi))}%` }} />
                </div>
                <div className="flex justify-between text-[11px] text-slate-600 font-medium">
                  <span>Đã đi bầu: <strong className="text-slate-900 font-bold">{votedQuocHoi.toLocaleString('vi-VN')}</strong></span>
                  <span>Tổng cử tri: <strong className="text-slate-700">{totalQuocHoi.toLocaleString('vi-VN')}</strong></span>
                </div>
              </div>

              {/* 2. ĐẠI BIỂU HĐND TỈNH */}
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                <div className="flex items-center justify-between font-bold text-xs text-slate-800">
                  <span className="text-emerald-900 font-extrabold">🏛️ HĐND TỈNH/THÀNH PHỐ</span>
                  <span className="font-mono text-emerald-700 font-extrabold">{pctHdndTinh}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                  <div className="bg-emerald-600 h-full transition-all duration-500 rounded-full" style={{ width: `${Math.min(100, Number(pctHdndTinh))}%` }} />
                </div>
                <div className="flex justify-between text-[11px] text-slate-600 font-medium">
                  <span>Đã đi bầu: <strong className="text-slate-900 font-bold">{votedHdndTinh.toLocaleString('vi-VN')}</strong></span>
                  <span>Tổng cử tri: <strong className="text-slate-700">{totalHdndTinh.toLocaleString('vi-VN')}</strong></span>
                </div>
              </div>

              {/* 3. ĐẠI BIỂU HĐND XÃ */}
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                <div className="flex items-center justify-between font-bold text-xs text-slate-800">
                  <span className="text-indigo-900 font-extrabold">🏡 HĐND XÃ/PHƯỜNG</span>
                  <span className="font-mono text-indigo-700 font-extrabold">{pctHdndXa}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                  <div className="bg-indigo-600 h-full transition-all duration-500 rounded-full" style={{ width: `${Math.min(100, Number(pctHdndXa))}%` }} />
                </div>
                <div className="flex justify-between text-[11px] text-slate-600 font-medium">
                  <span>Đã đi bầu: <strong className="text-slate-900 font-bold">{votedHdndXa.toLocaleString('vi-VN')}</strong></span>
                  <span>Tổng cử tri: <strong className="text-slate-700">{totalHdndXa.toLocaleString('vi-VN')}</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* VILLAGE PROGRESS BARS & QUICK MODULE NAVIGATION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Village Voting Progress List (Cols 8) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3.5 gap-3">
            <div>
              <h2 className="text-sm font-black text-slate-900 flex items-center gap-2 uppercase tracking-wide">
                <Building2 className="w-4.5 h-4.5 text-sky-600" />
                TIẾN ĐỘ BỎ PHIẾU THEO THÔN / TỔ DÂN PHỐ
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Thống kê số lượng cử tri đã đi bầu chi tiết theo từng Tổ dân phố / Thôn
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('voters')}
                className="text-xs font-bold text-sky-600 hover:text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all"
              >
                <span>Xem QUẢN LÝ CỬ TRI</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 font-bold flex items-center gap-1 text-[11px] uppercase">
              <Filter className="w-3.5 h-3.5 text-slate-400" /> Lọc:
            </span>
            <button
              onClick={() => setVillageFilter('ALL')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                villageFilter === 'ALL'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Tất cả ({villageList.length})
            </button>
            <button
              onClick={() => setVillageFilter('ACTIVE')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                villageFilter === 'ACTIVE'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Đang bỏ phiếu ({villageList.filter(v => v.voted > 0).length})
            </button>
            <button
              onClick={() => setVillageFilter('ZERO')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                villageFilter === 'ZERO'
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Chưa có cử tri ({villageList.filter(v => v.voted === 0).length})
            </button>
          </div>

          <div className="space-y-3.5 max-h-[520px] overflow-y-auto pr-1">
            {filteredVillageList.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">Không có khu vực nào phù hợp với bộ lọc.</p>
            ) : (
              filteredVillageList.map(v => (
                <div key={v.name} className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-sky-50/40 transition-all space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold gap-2">
                    <span className="text-slate-900 font-extrabold">{v.name}</span>
                    <span className="text-sky-900 font-mono text-xs shrink-0 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                      <strong className="text-emerald-700">{v.voted}</strong> / {v.total} cử tri ({v.pctStr}%)
                    </span>
                  </div>

                  <div className="w-full bg-slate-200/80 h-2.5 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className="h-full bg-gradient-to-r from-sky-500 via-emerald-500 to-teal-500 transition-all duration-500 rounded-full"
                      style={{ width: `${v.pctNum}%` }}
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
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">TRUY CẬP NHANH PHẦN MỀM</h2>
            <p className="text-xs text-slate-500">Chuyển đổi phân hệ làm việc nhanh</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setActiveTab('ballot_counting')}
              className="w-full p-4 rounded-xl bg-slate-50 hover:bg-sky-50 text-slate-800 hover:text-sky-900 border border-slate-200 hover:border-sky-300 font-bold text-xs flex items-center justify-between transition-all group shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-base shadow-2xs">
                  🗳️
                </div>
                <span className="uppercase font-black">KIỂM PHIẾU BẦU CỬ</span>
              </div>
              <span className="group-hover:translate-x-1 transition-transform text-sky-600 font-bold">➔</span>
            </button>

            <button
              onClick={() => setActiveTab('voters')}
              className="w-full p-4 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 border border-slate-200 hover:border-emerald-300 font-bold text-xs flex items-center justify-between transition-all group shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-base shadow-2xs">
                  👥
                </div>
                <span className="uppercase font-black">QUẢN LÝ CỬ TRI</span>
              </div>
              <span className="group-hover:translate-x-1 transition-transform text-emerald-600 font-bold">➔</span>
            </button>

            <button
              onClick={() => setActiveTab('election_results')}
              className="w-full p-4 rounded-xl bg-slate-50 hover:bg-amber-50 text-slate-800 hover:text-amber-900 border border-slate-200 hover:border-amber-300 font-bold text-xs flex items-center justify-between transition-all group shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-base shadow-2xs">
                  🏆
                </div>
                <span className="uppercase font-black">KẾT QUẢ</span>
              </div>
              <span className="group-hover:translate-x-1 transition-transform text-amber-600 font-bold">➔</span>
            </button>

            <button
              onClick={() => setActiveTab('results_report')}
              className="w-full p-4 rounded-xl bg-slate-50 hover:bg-purple-50 text-slate-800 hover:text-purple-900 border border-slate-200 hover:border-purple-300 font-bold text-xs flex items-center justify-between transition-all group shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-base shadow-2xs">
                  📄
                </div>
                <span className="uppercase font-black">BÁO CÁO</span>
              </div>
              <span className="group-hover:translate-x-1 transition-transform text-purple-600 font-bold">➔</span>
            </button>
          </div>

          <div className="p-3 bg-sky-50 rounded-xl border border-sky-200/80 text-[11px] text-sky-900 font-medium text-center shadow-2xs">
            🔒 Hệ thống đang hoạt động an toàn | Khóa {unit.term}
          </div>
        </div>
      </div>
    </div>
  );
};
