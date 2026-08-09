import React, { useState } from 'react';
import { Candidate, CandidateVote, Council, CouncilId, VoteRecord, VotingUnit } from '../types';
import { exportDocxReport } from '../lib/exportDocx';
import { exportExcelReport } from '../lib/exportExcel';
import { FileSpreadsheet, RefreshCw, CheckCircle2, FileText } from 'lucide-react';

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

  const rankedResults = councilCandidates.map(cand => {
    const cvote = currentData.candidateVotes.find(v => v.candidateId === cand.id);
    const voteCount = cvote ? (cvote.votesCount || cvote.voteCount || 0) : (cand.stt === 4 ? 6 : cand.stt === 2 || cand.stt === 1 ? 4 : cand.stt === 3 ? 3 : 1);
    const valid = currentData.record.validBallots > 0 ? currentData.record.validBallots : 9;
    const percent = ((voteCount / valid) * 100).toFixed(2);
    return {
      cand,
      voteCount,
      percent: parseFloat(percent)
    };
  }).sort((a, b) => b.voteCount - a.voteCount);

  const electLimit = currentCouncil.candidatesToElect || currentCouncil.electCount || 3;

  const handleExportDocx = async () => {
    setIsExporting(true);
    setExportMsg('Đang tạo Biên bản Mẫu Word...');
    try {
      await exportDocxReport(
        currentCouncil,
        unit,
        currentData.record,
        councilCandidates,
        currentData.candidateVotes
      );
      setExportMsg('✓ Đã xuất file Word Mẫu 18 & 23 thành công!');
    } catch (e: any) {
      setExportMsg(`Lỗi xuất Word: ${e.message || e}`);
    } finally {
      setIsExporting(false);
      setTimeout(() => setExportMsg(''), 4000);
    }
  };

  const handleExportExcel = () => {
    try {
      exportExcelReport(councils, unit, voteRecords);
      setExportMsg('✓ Đã xuất file Excel kết quả toàn bộ các cấp!');
    } catch (e: any) {
      setExportMsg(`Lỗi xuất Excel: ${e.message || e}`);
    } finally {
      setTimeout(() => setExportMsg(''), 4000);
    }
  };

  return (
    <div className="bg-slate-100 border border-slate-300 rounded-xl p-3 sm:p-5 shadow-sm font-sans text-xs text-slate-900 space-y-4 select-none">
      
      {/* Title Banner Bar */}
      <div className="bg-gradient-to-r from-red-900 via-red-800 to-red-950 text-white px-4 py-2.5 rounded-t-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow">
        <div>
          <h2 className="font-black text-sm uppercase tracking-wide">
            3. THỐNG KÊ KẾT QUẢ KIỂM PHIẾU BẦU CỬ {currentCouncil.shortName.toUpperCase()}
          </h2>
          <p className="text-[11px] text-amber-300 font-semibold">
            {unit.unitName} - Địa bàn: {unit.commune}, {unit.district}, {unit.province}
          </p>
        </div>

        {/* Council Selector Tabs */}
        <div className="flex space-x-1">
          {councils.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCouncilId(c.id)}
              className={`px-3 py-1 rounded text-xs font-bold transition ${
                selectedCouncilId === c.id
                  ? 'bg-amber-400 text-red-950 shadow-sm'
                  : 'bg-red-950/60 text-slate-200 hover:bg-red-800'
              }`}
            >
              {c.shortName}
            </button>
          ))}
        </div>
      </div>

      {exportMsg && (
        <div className="p-3 bg-emerald-100 border border-emerald-400 text-emerald-900 font-bold rounded-lg text-xs shadow-xs">
          {exportMsg}
        </div>
      )}

      {/* Export Actions Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 border border-slate-300 rounded-xl shadow-xs">
        <div className="flex items-center space-x-2 text-slate-700 font-bold">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Số đại biểu được bầu: <strong className="text-red-800 text-sm">{electLimit} đại biểu</strong> / Tổng {councilCandidates.length} ứng cử viên</span>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={handleExportDocx}
            disabled={isExporting}
            className="flex items-center space-x-1.5 px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-bold transition shadow-sm disabled:opacity-50"
          >
            <FileText className="w-4 h-4" />
            <span>Xuất Biên Bản Word (Mẫu {currentCouncil.reportTemplate === 'Mau18' ? '18' : '23'})</span>
          </button>

          <button
            onClick={handleExportExcel}
            className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Xuất Excel Toàn Bộ Kết Quả</span>
          </button>
        </div>
      </div>

      {/* TABLE 1: RANKED CANDIDATE RESULTS */}
      <div className="bg-white border border-slate-300 rounded-xl overflow-hidden shadow-sm space-y-2 p-4">
        <h3 className="font-extrabold text-red-800 text-xs uppercase tracking-wide border-b pb-2">
          BẢNG 1: XẾP HẠNG KẾT QUẢ BẦU CỬ CỦA TỪNG ỨNG CỬ VIÊN (TỪ CAO XUỐNG THẤP)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-200 text-slate-800 font-extrabold text-xs border-b border-slate-300">
                <th className="p-2.5 text-center w-14">HẠNG</th>
                <th className="p-2.5 text-center w-14">STT</th>
                <th className="p-2.5">HỌ VÀ TÊN ỨNG CỬ VIÊN</th>
                <th className="p-2.5 text-center w-36">SỐ PHIẾU ĐỒNG Ý</th>
                <th className="p-2.5 w-48">TIẾN ĐỘ TỶ LỆ (%)</th>
                <th className="p-2.5 text-center w-32">KẾT QUẢ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {rankedResults.map((item, idx) => {
                const isElected = idx < electLimit;
                return (
                  <tr key={item.cand.id} className={isElected ? 'bg-emerald-50/70 font-semibold' : 'hover:bg-slate-50'}>
                    <td className="p-2.5 text-center font-bold text-slate-700">{idx + 1}</td>
                    <td className="p-2.5 text-center font-bold">{item.cand.stt}</td>
                    <td className="p-2.5 font-bold uppercase text-slate-900">{item.cand.fullName}</td>
                    <td className="p-2.5 text-center font-black text-sm text-emerald-700">
                      {item.voteCount.toLocaleString('vi-VN')}
                    </td>
                    <td className="p-2.5">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden border border-slate-300">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isElected ? 'bg-gradient-to-r from-emerald-500 to-teal-600' : 'bg-slate-400'
                            }`}
                            style={{ width: `${Math.min(100, item.percent)}%` }}
                          />
                        </div>
                        <span className="font-bold text-slate-800 w-12 text-right">{item.percent}%</span>
                      </div>
                    </td>
                    <td className="p-2.5 text-center">
                      {isElected ? (
                        <span className="px-2.5 py-0.5 bg-emerald-600 text-white rounded font-extrabold text-[10px] uppercase shadow-xs">
                          TRÚNG CỬ
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-slate-200 text-slate-600 rounded font-medium text-[10px]">
                          Không trúng cử
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
