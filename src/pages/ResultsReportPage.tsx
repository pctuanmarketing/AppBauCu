import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Printer,
  CheckCircle2,
  AlertTriangle,
  Award,
  Table,
  Check,
  RotateCcw,
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
  const [selectedLevel, setSelectedLevel] = useState<ElectionLevel>('HDND_XA');

  const config = configs[selectedLevel];
  const levelCandidates = candidates
    .filter(c => c.electionLevel === selectedLevel)
    .sort((a, b) => a.stt - b.stt);
  const levelBallots = ballots.filter(b => b.electionLevel === selectedLevel);

  const validLevelBallots = levelBallots.filter(b => b.isValid);
  const invalidLevelBallots = levelBallots.filter(b => !b.isValid);

  const validBallotsCount = validLevelBallots.length;
  const invalidBallotsCount = invalidLevelBallots.length;
  const totalReturnedBallots = levelBallots.length;

  // Breakdown by ballot type (bầu 3, bầu 2, bầu 1 đại biểu)
  const countType3 = validLevelBallots.filter(b => b.numElectedCount === 3).length;
  const countType2 = validLevelBallots.filter(b => b.numElectedCount === 2).length;
  const countType1 = validLevelBallots.filter(b => b.numElectedCount === 1).length;

  const totalBallotTypesSum = countType3 + countType2 + countType1;
  const totalVotesSum = (3 * countType3) + (2 * countType2) + (1 * countType1);

  // Percentages
  const voterParticipatedPct = config.totalVoters > 0
    ? ((config.ballotsReturned / config.totalVoters) * 100).toFixed(2)
    : '0.00';

  const validPct = totalReturnedBallots > 0
    ? ((validBallotsCount / totalReturnedBallots) * 100).toFixed(2)
    : '0.00';

  const invalidPct = totalReturnedBallots > 0
    ? ((invalidBallotsCount / totalReturnedBallots) * 100).toFixed(2)
    : '0.00';

  // Verification checks (Cảnh báo kiểm tra đối soát)
  const isVoterMatch = config.ballotsReturned <= config.totalVoters;
  const isReturnedMatch = validBallotsCount + invalidBallotsCount === totalReturnedBallots;
  const isBallotTypesMatch = totalBallotTypesSum === validBallotsCount;

  // Check candidate breakdown totals
  const sumCandType3 = levelCandidates.reduce((s, c) => s + (c.votesType3 || 0), 0);
  const sumCandType2 = levelCandidates.reduce((s, c) => s + (c.votesType2 || 0), 0);
  const sumCandType1 = levelCandidates.reduce((s, c) => s + (c.votesType1 || 0), 0);

  const isMatrixMatch =
    sumCandType3 === countType3 * 3 &&
    sumCandType2 === countType2 * 2 &&
    sumCandType1 === countType1 * 1;

  const isAllExact = isVoterMatch && isReturnedMatch && isBallotTypesMatch && isMatrixMatch;

  const handleExportExcel = () => {
    exportElectionResultsToExcel(config, levelCandidates, voters, validBallotsCount, invalidBallotsCount);
  };

  const handlePrintWord = () => {
    generatePrintProtocol(unit, config, levelCandidates, committee, validBallotsCount, invalidBallotsCount);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header & Export Buttons */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-800">KẾT QUẢ KIỂM PHIẾU & BIÊN BẢN TỔNG HỢP (MẪU CHÍNH THỨC)</h1>
          <p className="text-xs text-slate-500">
            Tự động tổng hợp bảng phân rã phiếu bầu theo loại (bầu 3, bầu 2, bầu 1) và đối soát dữ liệu 3 cấp
          </p>
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

      {/* OFFICIAL GOVERNMENT PROTOCOL TABLE TEMPLATE (MẪU BẢNG TỔNG HỢP HĐND XÃ HÒA TIẾN) */}
      <div className="bg-white rounded-xl border-2 border-slate-400 p-6 shadow-md space-y-4">
        <div className="text-center space-y-1 border-b pb-3">
          <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wide">
            TỔNG HỢP KẾT QUẢ KIỂM PHIẾU BẦU CỬ {config.levelName.toUpperCase()} {unit.wardName.toUpperCase()} KHÓA {unit.term}
          </h2>
          <p className="text-xs font-bold text-slate-700">
            TẠI KHU VỰC BỎ PHIẾU SỐ {unit.votingAreaNo} - ĐƠN VỊ BẦU CỬ SỐ {unit.hdndXaUnitNo} ({unit.hdndXaVillages})
          </p>
          <p className="text-xs text-rose-600 italic font-semibold">
            (Lưu ý: Các ô màu vàng đại diện cho dữ liệu kiểm phiếu thực tế từ phần mềm)
          </p>
        </div>

        {/* 2D Grid Layout matching official Excel template */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Main Protocol Table (Cols 8) */}
          <div className="lg:col-span-8 overflow-x-auto border-2 border-slate-700">
            <table className="w-full text-left text-xs border-collapse font-sans">
              <thead className="bg-emerald-700 text-white font-extrabold uppercase text-center border-b-2 border-slate-700">
                <tr>
                  <th className="p-2 border-r border-slate-600">NỘI DUNG</th>
                  <th className="p-2 w-32 border-r border-slate-600">DỮ LIỆU</th>
                  <th className="p-2 w-48">GHI CHÚ / ĐỐI SOÁT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300 font-medium">
                {/* Row 1 */}
                <tr className="hover:bg-slate-50">
                  <td className="p-2 font-bold text-rose-800 border-r border-slate-300">Tổng số cử tri khu vực bỏ phiếu</td>
                  <td className="p-2 text-center font-extrabold bg-amber-100 text-slate-900 border-r border-slate-300 text-sm">
                    {config.totalVoters.toLocaleString('vi-VN')}
                  </td>
                  <td rowSpan={9} className="p-4 text-center bg-emerald-50/50 align-middle border-slate-300">
                    <div className="space-y-2">
                      <div className="font-extrabold text-sm text-rose-900 uppercase">
                        BẦU CỬ {config.levelName.toUpperCase()}
                      </div>
                      <div className="font-bold text-xs text-sky-900">
                        ĐƠN VỊ BẦU CỬ SỐ {unit.hdndXaUnitNo}
                      </div>
                      <div className="text-[11px] text-slate-600 italic">
                        ({unit.hdndXaVillages})
                      </div>
                    </div>
                  </td>
                </tr>

                {/* Row 2 */}
                <tr className="hover:bg-slate-50">
                  <td className="p-2 font-bold text-rose-800 border-r border-slate-300">Cử tri đã tham gia bỏ phiếu</td>
                  <td className="p-2 text-center font-extrabold bg-amber-100 text-slate-900 border-r border-slate-300 text-sm">
                    {config.ballotsReturned.toLocaleString('vi-VN')}
                  </td>
                </tr>

                {/* Row 3 */}
                <tr className="hover:bg-slate-50">
                  <td className="p-2 text-rose-800 border-r border-slate-300">Tỷ lệ cử tri tham gia bỏ phiếu (%)</td>
                  <td className="p-2 text-center font-bold font-mono border-r border-slate-300">
                    {voterParticipatedPct}%
                  </td>
                </tr>

                {/* Row 4 */}
                <tr className="hover:bg-slate-50">
                  <td className="p-2 font-bold text-emerald-800 border-r border-slate-300">Số phiếu phát ra</td>
                  <td className="p-2 text-center font-extrabold bg-amber-100 text-slate-900 border-r border-slate-300 text-sm">
                    {config.ballotsIssued.toLocaleString('vi-VN')}
                  </td>
                </tr>

                {/* Row 5 */}
                <tr className="hover:bg-slate-50">
                  <td className="p-2 font-bold text-emerald-800 border-r border-slate-300">Số phiếu thu vào</td>
                  <td className="p-2 text-center font-extrabold bg-amber-100 text-slate-900 border-r border-slate-300 text-sm">
                    {totalReturnedBallots.toLocaleString('vi-VN')}
                  </td>
                </tr>

                {/* Row 6 */}
                <tr className="hover:bg-slate-50">
                  <td className="p-2 font-bold text-emerald-800 border-r border-slate-300">Số phiếu hợp lệ</td>
                  <td className="p-2 text-center font-extrabold bg-amber-100 text-emerald-800 border-r border-slate-300 text-sm">
                    {validBallotsCount.toLocaleString('vi-VN')}
                  </td>
                </tr>

                {/* Row 7 */}
                <tr className="hover:bg-slate-50">
                  <td className="p-2 text-slate-700 border-r border-slate-300">Tỷ lệ so với tổng số phiếu thu vào (%)</td>
                  <td className="p-2 text-center font-bold font-mono border-r border-slate-300">
                    {validPct}%
                  </td>
                </tr>

                {/* Row 8 */}
                <tr className="hover:bg-slate-50">
                  <td className="p-2 text-slate-700 border-r border-slate-300">Số phiếu không hợp lệ</td>
                  <td className="p-2 text-center font-extrabold bg-amber-100 text-rose-700 border-r border-slate-300 text-sm">
                    {invalidBallotsCount.toLocaleString('vi-VN')}
                  </td>
                </tr>

                {/* Row 9 */}
                <tr className="hover:bg-slate-50">
                  <td className="p-2 text-slate-700 border-r border-slate-300">Tỷ lệ so với tổng số phiếu thu vào (%)</td>
                  <td className="p-2 text-center font-bold font-mono border-r border-slate-300">
                    {invalidPct}%
                  </td>
                </tr>

                {/* Breakdown Rows */}
                <tr className="bg-sky-50/60 font-medium">
                  <td className="p-2 text-sky-900 border-r border-slate-300">Số phiếu bầu cho 3 đại biểu</td>
                  <td className="p-2 text-center font-bold bg-amber-100 text-slate-900 border-r border-slate-300">
                    {countType3}
                  </td>
                  <td rowSpan={5} className="p-4 text-center bg-sky-600 text-white font-extrabold text-base align-middle">
                    {isBallotTypesMatch ? 'ĐÃ KHỚP SỐ PHIẾU' : 'KIỂM TRA LẠI'}
                  </td>
                </tr>
                <tr className="bg-sky-50/60 font-medium">
                  <td className="p-2 text-sky-900 border-r border-slate-300">Số phiếu bầu cho 2 đại biểu</td>
                  <td className="p-2 text-center font-bold bg-amber-100 text-slate-900 border-r border-slate-300">
                    {countType2}
                  </td>
                </tr>
                <tr className="bg-sky-50/60 font-medium">
                  <td className="p-2 text-sky-900 border-r border-slate-300">Số phiếu bầu cho 1 đại biểu</td>
                  <td className="p-2 text-center font-bold bg-amber-100 text-slate-900 border-r border-slate-300">
                    {countType1}
                  </td>
                </tr>

                <tr className="bg-orange-100 font-extrabold text-rose-900">
                  <td className="p-2 border-r border-slate-300">Tổng số phiếu bầu các loại</td>
                  <td className="p-2 text-center text-sm border-r border-slate-300">
                    {totalBallotTypesSum}
                  </td>
                </tr>

                <tr className="bg-emerald-100 font-extrabold text-emerald-950">
                  <td className="p-2 border-r border-slate-300">Tổng số lượt bầu trên phiếu bầu</td>
                  <td className="p-2 text-center text-sm border-r border-slate-300">
                    {totalVotesSum}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Verification Alert Cards Panel (Cols 4) */}
          <div className="lg:col-span-4 space-y-3 flex flex-col justify-between">
            {/* Status Card 1 */}
            <div className="p-4 rounded-xl border-2 border-amber-400 bg-amber-50 text-center space-y-1 shadow-sm">
              <span className="text-xs font-bold text-amber-900">TRẠNG THÁI TIẾN ĐỘ</span>
              <div className="text-lg font-black text-amber-800 uppercase">TIẾP TỤC KIỂM PHIẾU</div>
            </div>

            {/* Status Card 2 */}
            <div className={`p-4 rounded-xl border-2 text-center space-y-1 shadow-sm ${
              isReturnedMatch ? 'border-emerald-500 bg-emerald-50' : 'border-rose-500 bg-rose-50'
            }`}>
              <span className="text-xs font-bold text-slate-700">ĐỐI SOÁT PHIẾU THU VÀO</span>
              <div className={`text-base font-black ${isReturnedMatch ? 'text-emerald-700' : 'text-rose-700'}`}>
                {isReturnedMatch ? '✓ ĐÃ KHỚP PHIẾU THU VÀO' : '⚠ KIỂM TRA LẠI PHIẾU'}
              </div>
            </div>

            {/* Status Card 3 (Big Final Verification Badge) */}
            <div className={`p-6 rounded-xl border-4 text-center space-y-2 shadow-lg ${
              isAllExact
                ? 'border-emerald-600 bg-emerald-600 text-white'
                : 'border-rose-600 bg-rose-600 text-white animate-pulse'
            }`}>
              <span className="text-xs font-bold uppercase tracking-widest opacity-90">KẾT QUẢ ĐỐI SOÁT CẢNH BÁO</span>
              <div className="text-2xl font-black uppercase tracking-wider">
                {isAllExact ? 'CHÍNH XÁC' : 'SAI LỆCH! KIỂM TRA LẠI'}
              </div>
              <p className="text-[11px] opacity-90">
                {isAllExact
                  ? 'Tất cả 2 bảng kiểm đếm đều trùng khớp 100%'
                  : 'Vui lòng đối soát lại số phiếu bầu các loại và số lượt bầu'}
              </p>
            </div>
          </div>
        </div>

        {/* DETAILED CANDIDATE VOTE DECOMPOSITION MATRIX (BẢNG PHÂN RÃ THEO LOẠI PHIẾU BẦU 3, 2, 1) */}
        <div className="pt-4 space-y-2">
          <h3 className="text-xs font-extrabold text-slate-900 uppercase">
            BẢNG PHÂN BỔ SỐ PHIẾU BẦU CHO TỪNG NGƯỜI ỨNG CỬ THEO LOẠI PHIẾU BẦU (3, 2, 1 ĐẠI BIỂU)
          </h3>

          <div className="overflow-x-auto border-2 border-slate-700">
            <table className="w-full text-left text-xs border-collapse font-sans">
              <thead className="bg-slate-200 text-slate-900 font-extrabold uppercase border-b-2 border-slate-700">
                <tr>
                  <th className="p-2 border-r border-slate-400">Số phiếu bầu cho người ứng cử</th>
                  <th className="p-2 w-32 text-center border-r border-slate-400">Tổng số phiếu bầu</th>
                  <th className="p-2 w-32 text-center border-r border-slate-400 bg-amber-200">Loại phiếu bầu 3</th>
                  <th className="p-2 w-32 text-center border-r border-slate-400 bg-amber-200">Loại phiếu bầu 2</th>
                  <th className="p-2 w-32 text-center border-r border-slate-400 bg-amber-200">Loại phiếu bầu 1</th>
                  <th className="p-2 w-36 text-center bg-emerald-200">Trạng thái đối soát</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300 font-medium">
                {levelCandidates.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="p-2.5 font-extrabold text-slate-900 uppercase border-r border-slate-300">
                      {c.fullName}
                    </td>
                    <td className="p-2.5 text-center font-extrabold text-emerald-800 text-sm border-r border-slate-300">
                      {c.voteCount}
                    </td>
                    <td className="p-2.5 text-center font-bold bg-amber-100 text-slate-900 border-r border-slate-300">
                      {c.votesType3 || 0}
                    </td>
                    <td className="p-2.5 text-center font-bold bg-amber-100 text-slate-900 border-r border-slate-300">
                      {c.votesType2 || 0}
                    </td>
                    <td className="p-2.5 text-center font-bold bg-amber-100 text-slate-900 border-r border-slate-300">
                      {c.votesType1 || 0}
                    </td>
                    <td rowSpan={levelCandidates.length} className="p-4 text-center bg-emerald-50 text-emerald-800 font-black text-base align-middle hidden first:table-cell">
                      CHÍNH XÁC
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-sky-900 text-white font-extrabold text-xs">
                <tr>
                  <td className="p-2.5 uppercase border-r border-sky-700">TỔNG SỐ PHIẾU BẦU CHO NHỮNG NGƯỜI ỨNG CỬ</td>
                  <td className="p-2.5 text-center text-amber-300 text-sm border-r border-sky-700">
                    {totalVotesSum}
                  </td>
                  <td className="p-2.5 text-center border-r border-sky-700">
                    {sumCandType3}
                  </td>
                  <td className="p-2.5 text-center border-r border-sky-700">
                    {sumCandType2}
                  </td>
                  <td className="p-2.5 text-center border-r border-sky-700">
                    {sumCandType1}
                  </td>
                  <td className="p-2.5 text-center text-emerald-300">
                    {isMatrixMatch ? '✓ ĐÃ KHỚP' : 'SAI LỆCH'}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
