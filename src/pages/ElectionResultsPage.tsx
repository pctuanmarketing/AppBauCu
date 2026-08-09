import React, { useState } from 'react';
import {
  Trophy,
  Award,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Printer,
  Sparkles,
  BarChart3,
  Vote,
  Clock,
  Building2,
} from 'lucide-react';
import { Candidate, ElectionLevel, ElectionLevelConfig, ElectionUnit, BallotRecord } from '../types';
import { exportElectionResultsToExcel } from '../lib/excelExporter';
import { generatePrintProtocol } from '../lib/wordExporter';

interface ElectionResultsPageProps {
  unit: ElectionUnit;
  configs: Record<ElectionLevel, ElectionLevelConfig>;
  candidates: Candidate[];
  ballots: BallotRecord[];
  committee: any[];
}

export const ElectionResultsPage: React.FC<ElectionResultsPageProps> = ({
  unit,
  configs,
  candidates,
  ballots,
  committee,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<ElectionLevel>('QUOC_HOI');

  const config = configs[selectedLevel];
  const levelCandidates = candidates
    .filter(c => c.electionLevel === selectedLevel);
  const levelBallots = ballots.filter(b => b.electionLevel === selectedLevel);

  const validBallots = levelBallots.filter(b => b.isValid);
  const invalidBallotsCount = levelBallots.filter(b => !b.isValid).length;

  // 1. Phân rã loại phiếu bầu (Phiếu 1, Phiếu 2, Phiếu 3) cho Bảng 2 (KẾT QUẢ KIỂM TRA)
  const type1Count = validBallots.filter(b => b.numElectedCount === 1).length;
  const type2Count = validBallots.filter(b => b.numElectedCount === 2).length;
  const type3Count = validBallots.filter(b => b.numElectedCount === 3).length;

  const type1Votes = type1Count * 1;
  const type2Votes = type2Count * 2;
  const type3Votes = type3Count * 3;

  const totalTable2Ballots = type1Count + type2Count + type3Count;
  const totalTable2Votes = type1Votes + type2Votes + type3Votes;

  // 2. Tính số phiếu từng ứng cử viên cho Bảng 1 (KẾT QUẢ KIỂM PHIẾU)
  const candidateStats = levelCandidates.map(c => {
    // Count how many valid ballots elected this candidate
    const votes = validBallots.filter(b => b.electedCandidateIds.includes(c.id)).length;
    const pctNum = validBallots.length > 0 ? (votes / validBallots.length) * 100 : 0;
    return {
      ...c,
      voteCount: votes,
      pctNum,
      pctStr: pctNum.toFixed(2) + '%',
    };
  });

  // Sort candidates by voteCount descending for ranking
  const sortedCandidates = [...candidateStats].sort((a, b) => b.voteCount - a.voteCount);

  // Assign ranks
  let currentRank = 1;
  const rankedCandidates = sortedCandidates.map((c, index, arr) => {
    if (index > 0 && c.voteCount < arr[index - 1].voteCount) {
      currentRank = index + 1;
    }
    return {
      ...c,
      rank: currentRank,
    };
  });

  const totalTable1Votes = candidateStats.reduce((sum, c) => sum + c.voteCount, 0);

  // Cross-check verification
  const isMatch = totalTable1Votes === totalTable2Votes;
  const maxVotes = Math.max(...candidateStats.map(c => c.voteCount), 1);

  const handleExportExcel = () => {
    exportElectionResultsToExcel(config, levelCandidates, [], validBallots.length, invalidBallotsCount);
  };

  const handlePrintWord = () => {
    generatePrintProtocol(unit, config, levelCandidates, committee, validBallots.length, invalidBallotsCount);
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto font-sans">
      {/* Top Banner Header & Export Buttons */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white p-5 rounded-2xl shadow-xl border border-sky-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold border border-sky-400/30">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>KẾT QUẢ BẦU CỬ ĐẠI BIỂU KHÓA {unit.term}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase">
            KẾT QUẢ KIỂM PHIẾU BẦU CỬ {config.levelName.toUpperCase()}
          </h1>
          <p className="text-xs text-slate-300">
            Bảng tổng hợp xếp hạng thứ tự ứng cử viên & Phân rã đối soát kiểm tra loại phiếu
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportExcel}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Xuất báo cáo Excel</span>
          </button>
          <button
            onClick={handlePrintWord}
            className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>In biên bản (Word)</span>
          </button>
        </div>
      </div>

      {/* Level Selector Tabs */}
      <div className="flex bg-white p-2 rounded-2xl border border-slate-200 shadow-sm gap-2">
        {(['QUOC_HOI', 'HDND_TINH', 'HDND_XA'] as ElectionLevel[]).map(lvl => (
          <button
            key={lvl}
            onClick={() => setSelectedLevel(lvl)}
            className={`flex-1 py-3 rounded-xl font-black text-xs transition-all ${
              selectedLevel === lvl
                ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            {configs[lvl].levelName.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Notice Yellow Box matching exact screenshot */}
      <div className="p-3.5 bg-amber-50 rounded-2xl border-2 border-amber-300 text-amber-950 font-bold text-xs flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>*** PHẢI BẤM NÚT CẬP NHẬT TRÊN MENU ĐỂ TỔNG HỢP KẾT QUẢ KIỂM PHIẾU CHÍNH XÁC ***</span>
        </div>
        <span className="text-[11px] font-mono bg-white px-2.5 py-0.5 rounded border border-amber-300 text-amber-800">
          Chỉ số trúng cử: Top {config.numRepresentatives} ứng viên
        </span>
      </div>

      {/* MAIN TWO TABLES MATCHING SCREENSHOT EXACTLY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* TABLE 1: KẾT QUẢ KIỂM PHIẾU (Cols 7) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border-2 border-slate-300 shadow-md p-5 space-y-3">
          <div className="flex items-center justify-between border-b pb-2.5">
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>KẾT QUẢ KIỂM PHIẾU (XẾP HẠNG BẦU CỬ)</span>
            </h2>
            <span className="text-[11px] text-slate-500 font-medium">Sắp xếp theo số phiếu bầu giảm dần</span>
          </div>

          <div className="overflow-x-auto border border-slate-300 rounded-xl">
            <table className="w-full text-left text-xs border-collapse font-sans">
              <thead className="bg-slate-100 text-slate-800 font-extrabold border-b border-slate-300 text-center">
                <tr>
                  <th className="p-2.5 w-12 border-r border-slate-300">Stt</th>
                  <th className="p-2.5 border-r border-slate-300 text-left">Tên Ứng cử viên</th>
                  <th className="p-2.5 w-28 text-center border-r border-slate-300">Số phiếu bầu</th>
                  <th className="p-2.5 w-24 text-center border-r border-slate-300">Tỷ lệ %</th>
                  <th className="p-2.5 w-20 text-center">Xếp hạng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium">
                {rankedCandidates.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-400">
                      Chưa có ứng cử viên nào.
                    </td>
                  </tr>
                ) : (
                  rankedCandidates.map((c, idx) => {
                    const isElected = c.rank <= config.numRepresentatives && c.voteCount > 0;
                    const barPct = (c.voteCount / maxVotes) * 100;
                    return (
                      <tr key={c.id} className={`hover:bg-slate-50 ${isElected ? 'bg-emerald-50/30' : ''}`}>
                        <td className="p-2.5 text-center font-bold text-slate-600 border-r border-slate-200">
                          {c.stt}
                        </td>
                        <td className="p-2.5 font-bold text-slate-900 border-r border-slate-200 flex items-center justify-between">
                          <span className="uppercase">{c.fullName}</span>
                          {isElected && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                              Trúng cử
                            </span>
                          )}
                        </td>
                        {/* Votes cell with Teal Gradient Bar matching screenshot exactly */}
                        <td className="p-2.5 text-center border-r border-slate-200 relative overflow-hidden">
                          <div
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-teal-500/20 via-sky-400/20 to-teal-600/30 transition-all duration-500"
                            style={{ width: `${barPct}%` }}
                          />
                          <span className="relative z-10 font-black text-slate-900 text-sm font-mono">
                            {c.voteCount}
                          </span>
                        </td>
                        <td className="p-2.5 text-center font-mono font-bold text-sky-900 border-r border-slate-200">
                          {c.pctStr}
                        </td>
                        <td className="p-2.5 text-center font-black text-slate-800 font-mono">
                          {c.rank}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
              {/* Summary Row matching screenshot exactly */}
              <tfoot className="bg-slate-100 font-extrabold border-t-2 border-slate-300">
                <tr>
                  <td colSpan={2} className="p-3 text-center uppercase border-r border-slate-300 text-slate-800">
                    Tổng cộng
                  </td>
                  <td className="p-2.5 text-center border-r border-slate-300 bg-amber-100 text-rose-900 text-base font-black font-mono">
                    {totalTable1Votes}
                  </td>
                  <td colSpan={2} className="p-2.5 text-center text-slate-500 bg-amber-50">
                    Tổng số lượt bầu
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <p className="text-[11px] text-rose-700 italic font-medium">
            * Phải kiểm tra lại nếu Tổng số lượt bầu cả 2 bảng không bằng nhau.
          </p>
        </div>

        {/* TABLE 2: KẾT QUẢ KIỂM TRA (Cols 5) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border-2 border-slate-300 shadow-md p-5 space-y-3">
          <div className="flex items-center justify-between border-b pb-2.5">
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-600" />
              <span>KẾT QUẢ KIỂM TRA (PHÂN RÃ LOẠI PHIẾU)</span>
            </h2>
            <span className="text-[11px] text-slate-500 font-medium">Đối soát lượt bầu</span>
          </div>

          <div className="overflow-x-auto border border-slate-300 rounded-xl">
            <table className="w-full text-left text-xs border-collapse font-sans">
              <thead className="bg-slate-100 text-slate-800 font-extrabold border-b border-slate-300 text-center">
                <tr>
                  <th className="p-2.5 border-r border-slate-300 text-left">Loại phiếu bầu</th>
                  <th className="p-2.5 w-24 text-center border-r border-slate-300">Số phiếu</th>
                  <th className="p-2.5 w-28 text-center">Số lượt bầu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium">
                <tr className="hover:bg-slate-50">
                  <td className="p-2.5 border-r border-slate-200 text-slate-800 font-semibold">
                    .: Phiếu bầu 1 (Bầu 1 người)
                  </td>
                  <td className="p-2.5 text-center font-mono font-bold text-slate-900 border-r border-slate-200">
                    {type1Count}
                  </td>
                  <td className="p-2.5 text-center font-mono font-black text-sky-900">
                    {type1Votes}
                  </td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-2.5 border-r border-slate-200 text-slate-800 font-semibold">
                    .: Phiếu bầu 2 (Bầu 2 người)
                  </td>
                  <td className="p-2.5 text-center font-mono font-bold text-slate-900 border-r border-slate-200">
                    {type2Count}
                  </td>
                  <td className="p-2.5 text-center font-mono font-black text-sky-900">
                    {type2Votes}
                  </td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-2.5 border-r border-slate-200 text-slate-800 font-semibold">
                    .: Phiếu bầu 3 (Bầu 3 người)
                  </td>
                  <td className="p-2.5 text-center font-mono font-bold text-slate-900 border-r border-slate-200">
                    {type3Count}
                  </td>
                  <td className="p-2.5 text-center font-mono font-black text-sky-900">
                    {type3Votes}
                  </td>
                </tr>
              </tbody>
              {/* Summary Row matching screenshot exactly */}
              <tfoot className="bg-slate-100 font-extrabold border-t-2 border-slate-300">
                <tr>
                  <td className="p-3 text-center uppercase border-r border-slate-300 text-slate-800">
                    Tổng cộng
                  </td>
                  <td className="p-2.5 text-center border-r border-slate-300 font-mono font-black text-slate-900 text-sm">
                    {totalTable2Ballots}
                  </td>
                  <td className="p-2.5 text-center bg-amber-100 text-rose-900 text-base font-black font-mono">
                    {totalTable2Votes}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Verification Status Card */}
          <div className={`p-3 rounded-xl text-xs font-bold flex items-center justify-between border ${
            isMatch ? 'bg-emerald-50 text-emerald-950 border-emerald-300' : 'bg-rose-50 text-rose-950 border-rose-300 animate-pulse'
          }`}>
            <div className="flex items-center gap-2">
              {isMatch ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />}
              <span>
                {isMatch
                  ? '✅ DỮ LIỆU ĐỐI SOÁT CHÍNH XÁC: Tổng lượt bầu của 2 bảng trùng khớp 100%.'
                  : '⚠️ CẢNH BÁO: Tổng số lượt bầu cả 2 bảng KHÔNG BẰNG NHAU. Vui lòng kiểm tra lại phiếu!'}
              </span>
            </div>
            <span className="font-mono text-[11px] font-black underline">
              {totalTable1Votes} = {totalTable2Votes}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
