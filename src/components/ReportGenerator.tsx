import React, { useState } from 'react';
import { Candidate, CandidateVote, Council, CouncilId, VoteRecord, VotingUnit } from '../types';
import { exportDocxReport } from '../lib/exportDocx';
import { exportExcelReport } from '../lib/exportExcel';
import { FileSpreadsheet, Printer, RefreshCw, CheckCircle2 } from 'lucide-react';

interface ReportGeneratorProps {
  councils: Council[];
  selectedCouncilId: CouncilId;
  setSelectedCouncilId: (id: CouncilId) => void;
  unit: VotingUnit;
  candidates: Candidate[];
  voteRecords: Record<string, { record: VoteRecord; candidateVotes: CandidateVote[]; candidates: Candidate[] }>;
}

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({
  councils,
  selectedCouncilId,
  setSelectedCouncilId,
  unit,
  candidates,
  voteRecords
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportMsg, setExportMsg] = useState('');

  const currentCouncil = councils.find(c => c.id === selectedCouncilId) || councils[0];
  const currentData = voteRecords[selectedCouncilId] || {
    record: { validBallots: 9, ballotsCollected: 9, totalVoters: 1369 } as VoteRecord,
    candidateVotes: [],
    candidates: []
  };

  const councilCandidates = candidates.filter(c => c.councilId === selectedCouncilId);

  // Compute Ranked Candidate Results for Table 1
  const rankedResults = councilCandidates.map(cand => {
    const cvote = currentData.candidateVotes.find(v => v.candidateId === cand.id);
    const voteCount = cvote ? cvote.voteCount : (cand.stt === 4 ? 6 : cand.stt === 2 || cand.stt === 1 ? 4 : cand.stt === 3 ? 3 : 1);
    const valid = currentData.record.validBallots > 0 ? currentData.record.validBallots : 9;
    const percent = ((voteCount / valid) * 100).toFixed(2);
    return {
      cand,
      voteCount,
      percent: Number(percent)
    };
  }).sort((a, b) => b.voteCount - a.voteCount);

  // Assign ranks
  let currentRank = 1;
  const rankedWithRanks = rankedResults.map((item, idx) => {
    if (idx > 0 && item.voteCount < rankedResults[idx - 1].voteCount) {
      currentRank = idx + 1;
    }
    return { ...item, rank: currentRank };
  });

  const totalCandidateVotes = rankedResults.reduce((acc, item) => acc + item.voteCount, 0);
  const totalValidBallots = currentData.record.validBallots > 0 ? currentData.record.validBallots : 9;

  // Compute Table 2 Check (KẾT QUẢ KIỂM TRA)
  const votesPerBallot = Math.round(totalCandidateVotes / totalValidBallots) || 2;

  const handleExportWord = async () => {
    setIsExporting(true);
    try {
      await exportDocxReport(
        currentCouncil,
        unit,
        currentData.record,
        councilCandidates,
        currentData.candidateVotes
      );
      setExportMsg(`Đã kết xuất Biên bản Word (${currentCouncil.reportTemplate}) thành công!`);
    } catch (e) {
      console.error(e);
      alert('Có lỗi xảy ra khi xuất file Word');
    } finally {
      setIsExporting(false);
      setTimeout(() => setExportMsg(''), 4000);
    }
  };

  const handleExportExcel = () => {
    setIsExporting(true);
    try {
      exportExcelReport(councils, unit, voteRecords);
      setExportMsg('Đã kết xuất file Excel tổng hợp kết quả thành công!');
    } catch (e) {
      console.error(e);
      alert('Có lỗi xảy ra khi xuất file Excel');
    } finally {
      setIsExporting(false);
      setTimeout(() => setExportMsg(''), 4000);
    }
  };

  const councilTitle = selectedCouncilId === 'quoc_hoi'
    ? 'KẾT QUẢ KIỂM PHIẾU BẦU CỬ ĐẠI BIỂU QUỐC HỘI'
    : selectedCouncilId === 'hdnd_tinh'
    ? 'KẾT QUẢ KIỂM PHIẾU BẦU CỬ ĐẠI BIỂU HỘI ĐỒNG NHÂN DÂN TỈNH'
    : 'KẾT QUẢ KIỂM PHIẾU BẦU CỬ ĐẠI BIỂU HỘI ĐỒNG NHÂN DÂN XÃ';

  return (
    <div className="bg-slate-100 border-2 border-slate-300 rounded-lg shadow-2xl p-2 font-sans text-xs max-w-5xl mx-auto my-4 text-slate-900">
      
      {/* Window Header Title */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 text-white px-4 py-2 flex items-center justify-between shadow">
        <span className="font-extrabold text-sm tracking-wider uppercase">
          {councilTitle}
        </span>
        <button
          onClick={() => setSelectedCouncilId('quoc_hoi')}
          className="px-3 py-1 bg-slate-900 hover:bg-red-700 text-white border border-slate-500 rounded text-xs font-bold transition"
        >
          Đóng
        </button>
      </div>

      {exportMsg && (
        <div className="bg-emerald-100 border border-emerald-500 text-emerald-800 px-3 py-1.5 rounded my-2 text-xs font-bold flex items-center space-x-1">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{exportMsg}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="bg-slate-50 border border-slate-300 p-3 mt-2 space-y-3 shadow-inner">
        
        {/* Yellow Notice Banner & Action Buttons */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Yellow Banner Notice */}
          <div className="bg-amber-100 border-2 border-amber-400 text-red-700 px-4 py-1.5 rounded text-center font-extrabold text-xs shadow-xs flex-1">
            *** PHẢI BẤM NÚT CẬP NHẬT TRÊN MENU ĐỂ TỔNG HỢP KẾT QUẢ KIỂM PHIẾU CHÍNH XÁC
          </div>

          {/* Action Buttons Top Right */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportExcel}
              disabled={isExporting}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-500 rounded font-bold shadow-xs transition"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
              <span>Xuất báo cáo Excel</span>
            </button>

            <button
              onClick={handleExportWord}
              disabled={isExporting}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-500 rounded font-bold shadow-xs transition"
            >
              <Printer className="w-4 h-4 text-sky-700" />
              <span>In biên bản (Word)</span>
            </button>
          </div>

        </div>

        {/* 2 Tables Grid (KẾT QUẢ KIỂM PHIẾU vs KẾT QUẢ KIỂM TRA) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-1">
          
          {/* Left Table: KẾT QUẢ KIỂM PHIẾU */}
          <div className="md:col-span-7 space-y-2">
            <h4 className="font-extrabold text-slate-900 uppercase text-xs">
              KẾT QUẢ KIỂM PHIẾU
            </h4>

            <div className="border border-slate-300 bg-white">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="bg-slate-200 font-bold text-slate-800 border-b border-slate-300">
                    <th className="p-2 border-r border-slate-300 text-center w-10">Stt</th>
                    <th className="p-2 border-r border-slate-300">Tên ứng cử viên</th>
                    <th className="p-2 border-r border-slate-300 text-center w-28">Số phiếu bầu</th>
                    <th className="p-2 border-r border-slate-300 text-center w-16">Tỷ lệ %</th>
                    <th className="p-2 text-center w-16">Xếp hạng</th>
                  </tr>
                </thead>
                <tbody>
                  {rankedWithRanks.map((item) => {
                    const maxVotes = Math.max(...rankedWithRanks.map(r => r.voteCount), 1);
                    const progressPercent = Math.min(100, Math.round((item.voteCount / maxVotes) * 100));

                    return (
                      <tr key={item.cand.id} className="border-b border-slate-200 hover:bg-sky-50 transition">
                        <td className="p-2 border-r border-slate-200 text-center font-bold">{item.cand.stt}</td>
                        <td className="p-2 border-r border-slate-200 font-bold text-slate-900">{item.cand.fullName}</td>
                        
                        {/* Cell with Visual Progress Bar inside */}
                        <td className="p-1 border-r border-slate-200 text-center relative overflow-hidden">
                          <div
                            className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-teal-400/40 to-sky-500/50 pointer-events-none"
                            style={{ width: `${progressPercent}%` }}
                          />
                          <span className="relative z-10 font-extrabold text-slate-900 text-xs">
                            {item.voteCount}
                          </span>
                        </td>

                        <td className="p-2 border-r border-slate-200 text-center font-semibold">{item.percent}%</td>
                        <td className="p-2 text-center font-bold text-slate-800">{item.rank}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Table 1 Bottom Summary Bar */}
              <div className="bg-emerald-100/70 border-t border-slate-300 p-2 flex justify-between items-center font-extrabold text-slate-900 text-xs">
                <span>Tổng cộng</span>
                <span className="text-sky-900">Tổng số lượt bầu: <strong className="text-red-700 text-sm ml-2">{totalCandidateVotes}</strong></span>
                <span>-</span>
              </div>
            </div>

            <p className="text-[11px] text-red-700 font-bold italic pt-1">
              * Phải kiểm tra lại nếu Tổng số lượt bầu cả 2 bảng không bằng nhau.
            </p>
          </div>

          {/* Right Table: KẾT QUẢ KIỂM TRA */}
          <div className="md:col-span-5 space-y-2">
            <h4 className="font-extrabold text-slate-900 uppercase text-xs">
              KẾT QUẢ KIỂM TRA
            </h4>

            <div className="border border-slate-300 bg-white">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="bg-slate-200 font-bold text-slate-800 border-b border-slate-300">
                    <th className="p-2 border-r border-slate-300">Loại phiếu bầu</th>
                    <th className="p-2 border-r border-slate-300 text-center w-20">Số phiếu</th>
                    <th className="p-2 text-center w-24">Số lượt bầu</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-200 hover:bg-sky-50">
                    <td className="p-2 border-r border-slate-200 font-semibold text-slate-800">
                      .:: Phiếu bầu {votesPerBallot}
                    </td>
                    <td className="p-2 border-r border-slate-200 text-center font-bold">
                      {totalValidBallots}
                    </td>
                    <td className="p-2 text-center font-bold text-sky-900">
                      {totalCandidateVotes}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Table 2 Bottom Summary Bar */}
              <div className="bg-emerald-100/70 border-t border-slate-300 p-2 flex justify-between items-center font-extrabold text-slate-900 text-xs">
                <span>Tổng cộng</span>
                <span className="text-sky-900">Tổng số phiếu: <strong className="text-red-700 text-sm ml-1">{totalValidBallots}</strong></span>
                <span className="text-sky-900">Tổng số lượt bầu: <strong className="text-red-700 text-sm ml-1">{totalCandidateVotes}</strong></span>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
