import React, { useState, useRef, useEffect } from 'react';
import {
  Vote,
  RotateCcw,
  Undo2,
  AlertTriangle,
  CheckCircle,
  Eye,
  ChevronRight,
} from 'lucide-react';
import { BallotRecord, Candidate, ElectionLevel, ElectionLevelConfig } from '../types';
import { BallotValidationResult } from '../lib/ballotCalculator';

interface BallotCountingPageProps {
  configs: Record<ElectionLevel, ElectionLevelConfig>;
  updateLevelConfig: (level: ElectionLevel, config: Partial<ElectionLevelConfig>) => void;
  candidates: Candidate[];
  ballots: BallotRecord[];
  addBallot: (level: ElectionLevel, inputStruckOut: string) => BallotValidationResult;
  undoLastBallot: (level: ElectionLevel) => void;
  resetBallotsForLevel: (level: ElectionLevel) => void;
}

export const BallotCountingPage: React.FC<BallotCountingPageProps> = ({
  configs,
  updateLevelConfig,
  candidates,
  ballots,
  addBallot,
  undoLastBallot,
  resetBallotsForLevel,
}) => {
  const [activeLevel, setActiveLevel] = useState<ElectionLevel>('QUOC_HOI');
  const [struckOutInput, setStruckOutInput] = useState('');
  const [enterCount, setEnterCount] = useState(0);
  const [lastSubmittedResult, setLastSubmittedResult] = useState<BallotValidationResult | null>(null);
  const [showLogModal, setShowLogModal] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const config = configs[activeLevel];
  const levelCandidates = candidates
    .filter(c => c.electionLevel === activeLevel)
    .sort((a, b) => a.stt - b.stt);

  const levelBallots = ballots.filter(b => b.electionLevel === activeLevel);
  const currentBallotNo = levelBallots.length + 1;

  const validBallotsCount = levelBallots.filter(b => b.isValid).length;
  const invalidBallotsCount = levelBallots.filter(b => !b.isValid).length;
  const totalReturnedBallots = levelBallots.length; // Số phiếu thu vào

  // Percentage calculations matching specs screenshot exactly
  const returnedPct = config.ballotsIssued > 0
    ? Math.round((totalReturnedBallots / config.ballotsIssued) * 100)
    : 0;

  const validPct = totalReturnedBallots > 0
    ? Math.round((validBallotsCount / totalReturnedBallots) * 100)
    : 0;

  const invalidPct = totalReturnedBallots > 0
    ? Math.round((invalidBallotsCount / totalReturnedBallots) * 100)
    : 0;

  // Auto-calculated Remaining Ballots = Received - Issued - Damaged
  const calculatedRemaining = Math.max(0, config.ballotsReceived - config.ballotsIssued - config.ballotsDamaged);

  // Auto focus input on level switch or submission
  useEffect(() => {
    inputRef.current?.focus();
  }, [activeLevel, currentBallotNo]);

  // Handle Form Submission
  const handleSubmitBallot = () => {
    if (!struckOutInput.trim()) return;

    const res = addBallot(activeLevel, struckOutInput.trim());
    setLastSubmittedResult(res);
    setStruckOutInput('');
    setEnterCount(0);
    inputRef.current?.focus();
  };

  // Keyboard shortcut: Press Enter twice to submit
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (enterCount >= 1 || struckOutInput.trim() === '0') {
        handleSubmitBallot();
      } else {
        setEnterCount(prev => prev + 1);
      }
    } else {
      setEnterCount(0);
    }
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Top Header & Level Switcher Tabs */}
      <div className="bg-slate-800 text-white p-3.5 rounded-t-xl shadow flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-amber-400">
        <div className="flex items-center gap-2">
          <Vote className="w-5 h-5 text-amber-400" />
          <h1 className="text-base font-extrabold uppercase tracking-wide">
            KIỂM PHIẾU BẦU CỬ {config.levelName.toUpperCase()}
          </h1>
        </div>

        {/* Level Switcher Buttons */}
        <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-700 text-xs font-bold">
          {(['QUOC_HOI', 'HDND_TINH', 'HDND_XA'] as ElectionLevel[]).map(lvl => {
            const isSelected = activeLevel === lvl;
            return (
              <button
                key={lvl}
                onClick={() => {
                  setActiveLevel(lvl);
                  setStruckOutInput('');
                  setLastSubmittedResult(null);
                }}
                className={`px-3.5 py-1.5 rounded transition-all ${
                  isSelected
                    ? 'bg-sky-600 text-white font-extrabold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {configs[lvl].levelName}
              </button>
            );
          })}
        </div>
      </div>

      {/* MAIN TWO-COLUMN LAYOUT MATCHING SPECS SCREENSHOT EXACTLY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT COLUMN: CANDIDATE TABLE + RAPID INPUT BOX (Cols 7) */}
        <div className="lg:col-span-7 bg-white rounded-b-xl border border-slate-300 p-4 shadow-sm space-y-4">
          {/* Candidate Table */}
          <div className="overflow-x-auto border border-slate-300 rounded">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 text-slate-800 font-extrabold border-b border-slate-300">
                <tr>
                  <th className="p-2.5 w-12 text-center border-r border-slate-300">STT</th>
                  <th className="p-2.5 border-r border-slate-300">Họ và tên</th>
                  <th className="p-2.5 w-28 text-center border-r border-slate-300">Ngày sinh</th>
                  <th className="p-2.5 w-24 text-center border-r border-slate-300">Số phiếu bầu</th>
                  <th className="p-2.5 w-20 text-center">Tỷ lệ %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {levelCandidates.map(c => {
                  const pctVal = validBallotsCount > 0
                    ? ((c.voteCount / validBallotsCount) * 100).toFixed(2)
                    : '0.00';
                  return (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="p-2.5 text-center font-bold text-slate-700 border-r border-slate-200">
                        {c.stt}
                      </td>
                      <td className="p-2.5 font-bold text-slate-900 text-sm border-r border-slate-200">
                        {c.fullName}
                      </td>
                      <td className="p-2.5 text-center font-mono text-slate-600 border-r border-slate-200">
                        {c.dob}
                      </td>
                      <td className="p-2.5 text-center font-extrabold text-slate-900 text-sm border-r border-slate-200">
                        {c.voteCount}
                      </td>
                      <td className="p-2.5 text-center font-bold text-sky-800 font-mono">
                        {pctVal}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* RAPID INPUT PANEL (SPECS LAYOUT) */}
          <div className="pt-2 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-bold text-slate-700">
                Phiếu số: <span className="text-sm font-extrabold text-sky-700">{currentBallotNo}</span>
              </span>

              <div className="flex-1 flex items-center gap-2 max-w-xs">
                <input
                  ref={inputRef}
                  type="text"
                  value={struckOutInput}
                  onChange={e => setStruckOutInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder=""
                  className="w-full p-2 bg-pink-50/40 border-2 border-rose-300 rounded text-center text-lg font-mono font-bold text-rose-900 focus:bg-white focus:outline-none focus:border-rose-500 shadow-inner"
                />
                <button
                  onClick={handleSubmitBallot}
                  className="bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-300 font-bold text-xs px-3 py-2 rounded shadow-xs flex items-center gap-1"
                >
                  ✓ Xác nhận
                </button>
              </div>

              <button
                onClick={() => setShowLogModal(true)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3 py-2 rounded border border-slate-300 flex items-center gap-1 ml-auto"
              >
                <Eye className="w-3.5 h-3.5" />
                Xem phiếu đã kiểm
              </button>
            </div>

            {/* Sub-label explanation text */}
            <div className="text-[11px] text-slate-600 space-y-0.5 font-sans italic pt-1">
              <p>1. Nhập số 0 cho những phiếu không hợp lệ.</p>
              <p>2. Nhập liên tiếp các số thứ tự bị gạch ➔ bấm Enter 2 lần.</p>
              <p className="not-italic text-slate-500">
                (Ví dụ: gõ <strong>134</strong> là những ứng cử viên có số thứ tự 1, 3, 4 là bị gạch)
              </p>
            </div>

            {/* Last Submitted Result Alert */}
            {lastSubmittedResult && (
              <div
                className={`p-2.5 rounded border text-xs font-semibold ${
                  lastSubmittedResult.isValid
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-rose-50 border-rose-300 text-rose-900'
                }`}
              >
                {lastSubmittedResult.isValid ? (
                  <span>
                    ✅ <strong>Phiếu hợp lệ:</strong> Đã ghi nhận vote cho [{lastSubmittedResult.electedCandidates.map(c => c.fullName).join(', ')}]
                  </span>
                ) : (
                  <span>❌ <strong>Phiếu không hợp lệ:</strong> {lastSubmittedResult.reason}</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: 3 STATS CARDS + RESET/UNDO BUTTONS (Cols 5) */}
        <div className="lg:col-span-5 space-y-3">
          {/* CARD 1: GENERAL ELECTION SETUP */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-300 shadow-sm text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-700 font-bold flex items-center gap-1">
                <span>▶ Tổng số cử tri:</span>
                <span className="text-[10px] text-slate-400 font-normal">🔒 Tự động</span>
              </span>
              <input
                type="number"
                readOnly
                disabled
                value={config.totalVoters}
                className="w-24 p-1 bg-slate-100 border border-slate-300 rounded font-bold text-center text-slate-500 cursor-not-allowed select-none"
                title="Tự động đồng bộ từ danh sách cử tri"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-700 font-bold flex items-center gap-1">
                <span>▶ Số người ứng cử:</span>
                <span className="text-[10px] text-slate-400 font-normal">🔒 Tự động</span>
              </span>
              <input
                type="number"
                readOnly
                disabled
                value={levelCandidates.length}
                className="w-24 p-1 bg-slate-100 border border-slate-300 rounded font-bold text-center text-slate-500 cursor-not-allowed select-none"
                title="Tự động lấy từ danh sách ứng cử viên nhập vào"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sky-900 font-bold flex items-center gap-1">
                <span>▶ Số đại biểu được bầu:</span>
                <span className="text-[10px] text-sky-600 bg-sky-100 px-1 rounded font-normal">✍️ Nhập số</span>
              </span>
              <input
                type="number"
                min={1}
                value={config.numRepresentatives}
                onChange={e => updateLevelConfig(activeLevel, { numRepresentatives: Math.max(1, parseInt(e.target.value) || 1) })}
                className="w-24 p-1 bg-sky-50 border-2 border-sky-400 rounded font-black text-center text-sky-900 focus:ring-2 focus:ring-sky-500 outline-none"
                placeholder="Nhập số..."
              />
            </div>
          </div>

          {/* CARD 2: BALLOT INVENTORY SETUP */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-300 shadow-sm text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-700 font-bold">▶ Số phiếu nhận vào:</span>
              <input
                type="number"
                value={config.ballotsReceived}
                onChange={e => updateLevelConfig(activeLevel, { ballotsReceived: parseInt(e.target.value) || 0 })}
                className="w-24 p-1 bg-slate-50 border border-slate-300 rounded font-bold text-center text-slate-800"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-700 font-bold">▶ Số phiếu đổi hỏng:</span>
              <input
                type="number"
                value={config.ballotsDamaged}
                onChange={e => updateLevelConfig(activeLevel, { ballotsDamaged: parseInt(e.target.value) || 0 })}
                className="w-24 p-1 bg-slate-50 border border-slate-300 rounded font-bold text-center text-rose-700"
              />
            </div>
            <div className="flex items-center justify-between border-t pt-1.5">
              <span className="text-slate-700 font-bold">▶ Số phiếu còn lại:</span>
              <div className="w-24 p-1 bg-slate-100 border border-slate-300 rounded font-bold text-center text-slate-800">
                {calculatedRemaining}
              </div>
            </div>
          </div>

          {/* CARD 3: COUNTING METRICS & PERCENTAGES */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-300 shadow-sm text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-700 font-bold">▶ Số phiếu phát ra:</span>
              <input
                type="number"
                value={config.ballotsIssued}
                onChange={e => updateLevelConfig(activeLevel, { ballotsIssued: parseInt(e.target.value) || 0 })}
                className="w-24 p-1 bg-slate-50 border border-slate-300 rounded font-bold text-center text-slate-800"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-700 font-bold">▶ Số phiếu thu vào:</span>
              <div className="flex items-center gap-3">
                <div className="w-24 p-1 bg-slate-100 border border-slate-300 rounded font-bold text-center text-sky-900">
                  {totalReturnedBallots}
                </div>
                <span className="w-12 text-right font-bold text-slate-700">{returnedPct}%</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-700 font-bold">▶ Số phiếu hợp lệ:</span>
              <div className="flex items-center gap-3">
                <div className="w-24 p-1 bg-emerald-50 border border-emerald-300 rounded font-bold text-center text-emerald-800">
                  {validBallotsCount}
                </div>
                <span className="w-12 text-right font-bold text-emerald-700">{validPct}%</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-700 font-bold">▶ Số phiếu không hợp lệ:</span>
              <div className="flex items-center gap-3">
                <div className="w-24 p-1 bg-rose-50 border border-rose-300 rounded font-bold text-center text-rose-800">
                  {invalidBallotsCount}
                </div>
                <span className="w-12 text-right font-bold text-rose-700">{invalidPct}%</span>
              </div>
            </div>
          </div>

          {/* BOTTOM ACTION BUTTONS */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => {
                if (confirm(`Bạn có chắc chắn muốn xóa toàn bộ ${levelBallots.length} phiếu đã kiểm của cấp ${config.levelName}?`)) {
                  resetBallotsForLevel(activeLevel);
                }
              }}
              className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-400 font-bold text-xs rounded flex items-center justify-center gap-1.5 shadow-xs transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
              Kiểm phiếu lại
            </button>
            <button
              onClick={() => undoLastBallot(activeLevel)}
              disabled={levelBallots.length === 0}
              className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-rose-700 border border-slate-400 font-bold text-xs rounded flex items-center justify-center gap-1.5 disabled:opacity-50 shadow-xs transition-colors"
            >
              <Undo2 className="w-3.5 h-3.5 text-rose-600" />
              Xóa phiếu cuối cùng
            </button>
          </div>
        </div>
      </div>

      {/* Log Modal: View Ballots List */}
      {showLogModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 space-y-4 shadow-xl border border-slate-200 max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-sm font-bold text-slate-800 uppercase">
                NHẬT KÝ PHIẾU ĐÃ KIỂM ({config.levelName})
              </h3>
              <button onClick={() => setShowLogModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 text-xs">
              {levelBallots.length === 0 ? (
                <p className="text-center text-slate-400 py-8">Chưa có phiếu nào được ghi nhận.</p>
              ) : (
                levelBallots.map(b => (
                  <div key={b.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-sky-800 mr-2">Phiếu #{b.ballotIndex}:</span>
                      <span className="font-mono bg-white px-2 py-0.5 border rounded">
                        Gạch: {b.struckOutNumbers || 'Không'}
                      </span>
                    </div>
                    <span className={`px-2 py-0.5 rounded font-bold ${b.isValid ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                      {b.isValid ? 'Hợp lệ' : 'Không hợp lệ'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
