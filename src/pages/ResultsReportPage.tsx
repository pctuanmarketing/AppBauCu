import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Printer,
  CheckCircle2,
  AlertTriangle,
  Award,
  Download,
  Building,
  Table,
} from 'lucide-react';
import { BallotRecord, Candidate, CommitteeMember, ElectionLevel, ElectionLevelConfig, ElectionUnit, Voter } from '../types';
import { exportElectionResultsToExcel } from '../lib/excelExporter';
import { generatePrintProtocol } from '../lib/wordExporter';

interface ResultsReportPageProps {
  unit: ElectionUnit;
  configs: Record<ElectionLevel, ElectionLevelConfig>;
  candidates: Candidate[];
  voters: Voter[];
  ballots: BallotRecord[];
  committee: CommitteeMember[];
}

export const ResultsReportPage: React.FC<ResultsReportPageProps> = ({
  unit,
  configs,
  candidates,
  voters,
  ballots,
  committee,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<ElectionLevel>('QUOC_HOI');

  const config = configs[selectedLevel];
  const levelCandidates = candidates.filter(c => c.electionLevel === selectedLevel);
  const levelBallots = ballots.filter(b => b.electionLevel === selectedLevel);

  const validBallotsCount = levelBallots.filter(b => b.isValid).length;
  const invalidBallotsCount = levelBallots.filter(b => !b.isValid).length;

  // Rank candidates by vote count descending
  const sortedCandidates = [...levelCandidates].sort((a, b) => b.voteCount - a.voteCount);

  // Verification Check: Sum of candidate votes vs (Valid ballots * Num Representatives)
  const totalVotesSum = levelCandidates.reduce((sum, c) => sum + c.voteCount, 0);
  const totalBallotsCount = levelBallots.length;

  const isBalanced = totalVotesSum <= validBallotsCount * config.numRepresentatives;

  const handleExportExcel = () => {
    exportElectionResultsToExcel(config, levelCandidates, voters, validBallotsCount, invalidBallotsCount);
  };

  const handlePrintWord = () => {
    generatePrintProtocol(unit, config, levelCandidates, committee, validBallotsCount, invalidBallotsCount);
  };

  return (
    <div className="space-y-6">
      {/* Header & Export Actions */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-800">KẾT QUẢ KIỂM PHIẾU & BÁO CÁO BẦU CỬ</h1>
          <p className="text-xs text-slate-500">Tự động tổng hợp kết quả bầu cử, đối soát dữ liệu và xuất báo cáo/biên bản</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportExcel}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 shadow transition-all"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Xuất báo cáo Excel (.xlsx)
          </button>
          <button
            onClick={handlePrintWord}
            className="bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 shadow transition-all"
          >
            <Printer className="w-4 h-4" />
            In Biên bản kiểm phiếu (Word)
          </button>
        </div>
      </div>

      {/* Level Selector Tabs */}
      <div className="flex bg-white p-2 rounded-xl border border-slate-200 shadow-sm gap-2">
        {(['QUOC_HOI', 'HDND_TINH', 'HDND_XA'] as ElectionLevel[]).map(lvl => (
          <button
            key={lvl}
            onClick={() => setSelectedLevel(lvl)}
            className={`flex-1 py-2.5 rounded-lg font-bold text-xs transition-all ${
              selectedLevel === lvl
                ? 'bg-sky-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            BẦU CỬ {configs[lvl].levelName.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Main Results Container (Matching Specs Page 5 & 6) */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-amber-900 text-xs font-bold flex items-center justify-between">
          <span>*** PHẢI BẤM NÚT CẬP NHẬT TRÊN MENU ĐỂ TỔNG HỢP KẾT QUẢ KIỂM PHIẾU CHÍNH XÁC ***</span>
          <span className="text-[11px] font-normal text-amber-800">
            Khu vực bỏ phiếu số {unit.votingAreaNo} - {unit.wardName}
          </span>
        </div>

        {/* Results Tables Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Candidates Ranking (Cols 7) */}
          <div className="lg:col-span-7 space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" />
              KẾT QUẢ KIỂM PHIẾU & XẾP HẠNG TRÚNG CỬ
            </h3>

            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200">
                  <tr>
                    <th className="p-3 w-12 text-center">Stt</th>
                    <th className="p-3">Tên Ứng cử viên</th>
                    <th className="p-3 w-28 text-center">Số phiếu bầu</th>
                    <th className="p-3 w-24 text-center">Tỷ lệ %</th>
                    <th className="p-3 w-24 text-center">Xếp hạng</th>
                    <th className="p-3 w-28 text-center">Kết quả</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sortedCandidates.map((c, idx) => {
                    const rank = idx + 1;
                    const isElected = rank <= config.numRepresentatives && c.voteCount > 0;
                    return (
                      <tr key={c.id} className={isElected ? 'bg-emerald-50/50' : 'hover:bg-slate-50'}>
                        <td className="p-3 text-center font-bold text-slate-500">{c.stt}</td>
                        <td className="p-3 font-bold text-slate-800 text-sm">{c.fullName}</td>
                        <td className="p-3 text-center font-extrabold text-emerald-600 text-sm">{c.voteCount}</td>
                        <td className="p-3 text-center font-bold text-sky-700">{c.votePercentage}%</td>
                        <td className="p-3 text-center font-bold text-slate-700">{rank}</td>
                        <td className="p-3 text-center">
                          {isElected ? (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                              TRÚNG CỬ
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">Không trúng</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-slate-100 font-bold border-t border-slate-200">
                  <tr>
                    <td colSpan={2} className="p-3 text-right">Tổng cộng:</td>
                    <td className="p-3 text-center text-emerald-700 font-extrabold">{totalVotesSum}</td>
                    <td colSpan={3} className="p-3 text-slate-500">
                      (Tổng số lượt bầu: {totalVotesSum})
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Right: Verification Inspection Table (Cols 5) */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase flex items-center gap-1.5">
              <Table className="w-4 h-4 text-sky-600" />
              KẾT QUẢ KIỂM TRA ĐỐI SOÁT PHIẾU
            </h3>

            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200">
                  <tr>
                    <th className="p-3">Loại phiếu bầu</th>
                    <th className="p-3 text-center">Số phiếu</th>
                    <th className="p-3 text-center">Số lượt bầu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-3 font-semibold text-emerald-800">:: Phiếu hợp lệ</td>
                    <td className="p-3 text-center font-bold text-slate-800">{validBallotsCount}</td>
                    <td className="p-3 text-center font-bold text-emerald-600">{totalVotesSum}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-rose-800">:: Phiếu không hợp lệ</td>
                    <td className="p-3 text-center font-bold text-rose-600">{invalidBallotsCount}</td>
                    <td className="p-3 text-center text-slate-400">0</td>
                  </tr>
                </tbody>
                <tfoot className="bg-slate-100 font-bold border-t border-slate-200">
                  <tr>
                    <td className="p-3">Tổng cộng:</td>
                    <td className="p-3 text-center font-bold text-sky-800">{totalBallotsCount}</td>
                    <td className="p-3 text-center font-extrabold text-emerald-700">{totalVotesSum}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Red Alert Rule Specs */}
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>* Phải kiểm tra lại nếu Tổng số lượt bầu cả 2 bảng không bằng nhau.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
