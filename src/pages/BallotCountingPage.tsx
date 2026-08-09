import React, { useState, useRef, useEffect } from 'react';
import {
  Vote,
  RotateCcw,
  Undo2,
  AlertTriangle,
  CheckCircle,
  Eye,
  ChevronRight,
  Sparkles,
  Lock,
  Edit3,
  Check,
  X,
  FileSpreadsheet,
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
  assignedLevel?: ElectionLevel | 'ALL';
}

export const BallotCountingPage: React.FC<BallotCountingPageProps> = ({
  configs,
  updateLevelConfig,
  candidates,
  ballots,
  addBallot,
  undoLastBallot,
  resetBallotsForLevel,
  assignedLevel,
}) => {
  const [activeLevel, setActiveLevel] = useState<ElectionLevel>(() => {
    if (assignedLevel && assignedLevel !== 'ALL') return assignedLevel;
    return 'QUOC_HOI';
  });

  useEffect(() => {
    if (assignedLevel && assignedLevel !== 'ALL') {
      setActiveLevel(assignedLevel);
    }
  }, [assignedLevel]);
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
    <div className="space-y-5 max-w-7xl mx-auto font-sans">
      {/* Top Banner Header & Level Switcher Tabs */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white p-4 sm:p-5 rounded-2xl shadow-xl border border-sky-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-400/30 flex items-center justify-center font-bold shadow-lg shrink-0">
            🗳️
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black tracking-tight uppercase text-white flex items-center gap-2">
              <span>KIỂM PHIẾU BẦU CỬ {config.levelName.toUpperCase()}</span>
            </h1>
            <p className="text-[11px] text-slate-300 font-medium">
              Nhập gạch tên ứng cử viên siêu tốc & tự động tổng hợp kết quả 3 cấp
            </p>
          </div>
        </div>

        {/* Level Switcher Buttons */}
        <div className="flex bg-slate-950/80 p-1.5 rounded-xl border border-slate-700/80 text-xs font-bold shrink-0 relative z-10">
          {(['QUOC_HOI', 'HDND_TINH', 'HDND_XA'] as ElectionLevel[]).map(lvl => {
            const isSelected = activeLevel === lvl;
            const isLocked = assignedLevel && assignedLevel !== 'ALL' && assignedLevel !== lvl;
            return (
              <button
                key={lvl}
                disabled={isLocked}
                onClick={() => {
                  if (isLocked) return;
                  setActiveLevel(lvl);
                  setStruckOutInput('');
                  setLastSubmittedResult(null);
                }}
                className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                  isLocked
                    ? 'bg-slate-900/40 text-slate-500 cursor-not-allowed opacity-50'
                    : isSelected
                    ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white font-black shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
                title={isLocked ? `🔒 Bạn chỉ được phân công thao tác kiểm phiếu cấp ${configs[assignedLevel!].levelName}` : ''}
              >
                {isLocked && <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                <span>{configs[lvl].levelName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* MAIN TWO-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT COLUMN: CANDIDATE TABLE + RAPID INPUT BOX (Cols 7) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-5">
          {/* Candidate Vote Table with Progress Bars */}
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="p-3 w-12 text-center border-r border-slate-200">STT</th>
                  <th className="p-3 border-r border-slate-200">Họ và tên ứng cử viên</th>
                  <th className="p-3 w-28 text-center border-r border-slate-200">Ngày sinh</th>
                  <th className="p-3 w-24 text-center border-r border-slate-200">Số phiếu</th>
                  <th className="p-3 w-32 text-center">Tỷ lệ %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {levelCandidates.map(c => {
                  const pctNum = validBallotsCount > 0 ? (c.voteCount / validBallotsCount) * 100 : 0;
                  const pctVal = pctNum.toFixed(2);
                  return (
                    <tr key={c.id} className="hover:bg-sky-50/40 transition-colors">
                      <td className="p-3 text-center font-mono font-bold text-slate-500 border-r border-slate-100">
                        {c.stt}
                      </td>
                      <td className="p-3 font-semibold text-slate-900 text-xs border-r border-slate-100">
                        {c.fullName}
                      </td>
                      <td className="p-3 text-center font-mono text-slate-500 border-r border-slate-100 whitespace-nowrap">
                        {c.dob}
                      </td>
                      <td className="p-3 text-center font-black text-slate-900 text-sm border-r border-slate-100">
                        {c.voteCount}
                      </td>
                      <td className="p-3">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sky-900 font-mono font-bold text-xs">
                            <span>{pctVal}%</span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200">
                            <div
                              className="bg-gradient-to-r from-sky-500 to-blue-600 h-full transition-all duration-300 rounded-full"
                              style={{ width: `${Math.min(100, pctNum)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* RAPID INPUT PANEL */}
          <div className="bg-gradient-to-r from-rose-50/70 via-sky-50/40 to-slate-50 p-4.5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3.5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700 uppercase">
                  Phiếu số:
                </span>
                <span className="text-base font-black font-mono text-sky-800 bg-white px-3 py-1 rounded-xl border border-sky-300 shadow-2xs">
                  #{currentBallotNo}
                </span>
              </div>

              <div className="flex-1 flex items-center gap-2 max-w-sm">
                <input
                  ref={inputRef}
                  type="text"
                  value={struckOutInput}
                  onChange={e => setStruckOutInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Gõ số bị gạch..."
                  className="w-full px-4 py-2 bg-white border-2 border-rose-300 rounded-xl text-center text-lg font-mono font-black text-rose-900 focus:bg-white focus:outline-none focus:border-rose-500 shadow-inner tracking-wider"
                />
                <button
                  onClick={handleSubmitBallot}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all shrink-0 flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Xác nhận</span>
                </button>
              </div>

              <button
                onClick={() => setShowLogModal(true)}
                className="bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs px-3.5 py-2 rounded-xl border border-slate-200 flex items-center gap-1.5 shadow-2xs transition-colors"
              >
                <Eye className="w-4 h-4 text-sky-600" />
                <span>Xem phiếu đã kiểm</span>
              </button>
            </div>

            {/* Instruction Guidance Text */}
            <div className="text-[11px] text-slate-600 space-y-0.5 font-sans leading-relaxed pt-1 bg-white/70 p-3 rounded-xl border border-slate-200/60">
              <p className="font-semibold text-slate-800">1. Nhập số <strong className="text-rose-600 font-mono">0</strong> cho những phiếu không hợp lệ.</p>
              <p className="font-semibold text-slate-800">2. Nhập liên tiếp các số thứ tự bị gạch ➔ bấm <strong className="text-sky-700 font-mono">Enter 2 lần</strong>.</p>
              <p className="text-slate-500 italic">
                (Ví dụ: gõ <strong className="text-slate-800 font-mono not-italic bg-amber-100 px-1 rounded">134</strong> là những ứng cử viên có số thứ tự 1, 3, 4 bị gạch phiếu)
              </p>
            </div>

            {/* Last Submitted Result Toast Alert */}
            {lastSubmittedResult && (
              <div
                className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 shadow-2xs ${
                  lastSubmittedResult.isValid
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    : 'bg-rose-50 border-rose-300 text-rose-950 animate-pulse'
                }`}
              >
                {lastSubmittedResult.isValid ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      ✅ <strong>Phiếu hợp lệ:</strong> Đã ghi nhận vote cho [{lastSubmittedResult.electedCandidates.map(c => c.fullName).join(', ')}]
                    </span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>❌ <strong>Phiếu không hợp lệ:</strong> {lastSubmittedResult.reason}</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: 3 STATS CARDS + RESET/UNDO BUTTONS (Cols 5) */}
        <div className="lg:col-span-5 space-y-4">
          {/* CARD 1: GENERAL ELECTION SETUP */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-xs space-y-2.5">
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
                className="w-28 p-1.5 bg-slate-100 border border-slate-200 rounded-xl font-mono font-bold text-center text-slate-600 cursor-not-allowed select-none"
                title="Tự động đồng bộ từ danh sách cử tri chính thức"
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
                className="w-28 p-1.5 bg-slate-100 border border-slate-200 rounded-xl font-mono font-bold text-center text-slate-600 cursor-not-allowed select-none"
                title="Tự động lấy từ danh sách ứng cử viên nhập vào"
              />
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-100">
              <span className="text-sky-900 font-extrabold flex items-center gap-1">
                <span>▶ Số đại biểu được bầu:</span>
                <span className="text-[10px] text-sky-600 bg-sky-100 px-1.5 py-0.5 rounded font-bold">✍️ Nhập số</span>
              </span>
              <input
                type="number"
                min={1}
                value={config.numRepresentatives}
                onChange={e => updateLevelConfig(activeLevel, { numRepresentatives: Math.max(1, parseInt(e.target.value) || 1) })}
                className="w-28 p-1.5 bg-sky-50 border-2 border-sky-400 rounded-xl font-mono font-black text-center text-sky-900 focus:ring-2 focus:ring-sky-500 outline-none"
                placeholder="Nhập..."
              />
            </div>
          </div>

          {/* CARD 2: BALLOT INVENTORY SETUP */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-700 font-bold">▶ Số phiếu nhận vào:</span>
              <input
                type="number"
                value={config.ballotsReceived}
                onChange={e => updateLevelConfig(activeLevel, { ballotsReceived: parseInt(e.target.value) || 0 })}
                className="w-28 p-1.5 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-center text-slate-900 focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-700 font-bold">▶ Số phiếu đổi hỏng:</span>
              <input
                type="number"
                value={config.ballotsDamaged}
                onChange={e => updateLevelConfig(activeLevel, { ballotsDamaged: parseInt(e.target.value) || 0 })}
                className="w-28 p-1.5 bg-rose-50 border border-rose-200 rounded-xl font-mono font-bold text-center text-rose-700 focus:ring-2 focus:ring-rose-500 outline-none"
              />
            </div>
            <div className="flex items-center justify-between border-t border-slate-100 pt-2">
              <span className="text-slate-800 font-extrabold">▶ Số phiếu còn lại:</span>
              <div className="w-28 p-1.5 bg-slate-100 border border-slate-200 rounded-xl font-mono font-bold text-center text-slate-700">
                {calculatedRemaining}
              </div>
            </div>
          </div>

          {/* CARD 3: COUNTING METRICS & PERCENTAGES */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-700 font-bold">▶ Số phiếu phát ra:</span>
              <input
                type="number"
                value={config.ballotsIssued}
                onChange={e => updateLevelConfig(activeLevel, { ballotsIssued: parseInt(e.target.value) || 0 })}
                className="w-28 p-1.5 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-center text-slate-900 focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-700 font-bold">▶ Số phiếu thu vào:</span>
              <div className="flex items-center gap-2">
                <div className="w-20 p-1.5 bg-slate-100 border border-slate-200 rounded-xl font-mono font-bold text-center text-sky-900">
                  {totalReturnedBallots}
                </div>
                <span className="w-12 text-right font-mono font-bold text-slate-600">{returnedPct}%</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-emerald-900 font-bold">▶ Số phiếu hợp lệ:</span>
              <div className="flex items-center gap-2">
                <div className="w-20 p-1.5 bg-emerald-50 border border-emerald-300 rounded-xl font-mono font-bold text-center text-emerald-800">
                  {validBallotsCount}
                </div>
                <span className="w-12 text-right font-mono font-bold text-emerald-700">{validPct}%</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-rose-900 font-bold">▶ Số phiếu không hợp lệ:</span>
              <div className="flex items-center gap-2">
                <div className="w-20 p-1.5 bg-rose-50 border border-rose-300 rounded-xl font-mono font-bold text-center text-rose-800">
                  {invalidBallotsCount}
                </div>
                <span className="w-12 text-right font-mono font-bold text-rose-700">{invalidPct}%</span>
              </div>
            </div>
          </div>

          {/* BOTTOM ACTION BUTTONS */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={() => {
                if (confirm(`Bạn có chắc chắn muốn xóa toàn bộ ${levelBallots.length} phiếu đã kiểm của cấp ${config.levelName}?`)) {
                  resetBallotsForLevel(activeLevel);
                }
              }}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-2xs transition-colors"
            >
              <RotateCcw className="w-4 h-4 text-slate-600" />
              <span>Kiểm phiếu lại</span>
            </button>
            <button
              onClick={() => undoLastBallot(activeLevel)}
              disabled={levelBallots.length === 0}
              className="flex-1 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 shadow-2xs transition-colors"
            >
              <Undo2 className="w-4 h-4 text-rose-600" />
              <span>Xóa phiếu cuối cùng</span>
            </button>
          </div>
        </div>
      </div>

      {/* Log Modal: View Ballots List */}
      {showLogModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-sans">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-sky-600" />
                NHẬT KÝ PHIẾU ĐÃ KIỂM ({config.levelName})
              </h3>
              <button onClick={() => setShowLogModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-base">
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 text-xs pr-1">
              {levelBallots.length === 0 ? (
                <p className="text-center text-slate-400 py-8">Chưa có phiếu nào được ghi nhận.</p>
              ) : (
                levelBallots.map(b => (
                  <div key={b.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between shadow-2xs">
                    <div>
                      <span className="font-bold text-sky-800 mr-2">Phiếu #{b.ballotIndex}:</span>
                      <span className="font-mono bg-white px-2.5 py-1 border rounded-lg text-slate-800">
                        Gạch: {b.struckOutNumbers || 'Không'}
                      </span>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full font-extrabold ${b.isValid ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-rose-100 text-rose-800 border border-rose-200'}`}>
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
