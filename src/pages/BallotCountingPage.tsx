import React, { useState, useRef, useEffect } from 'react';
import {
  Vote,
  RotateCcw,
  Undo2,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Hash,
  Eye,
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

  const totalReturnedBallots = levelBallots.length;
  const returnedPct = config.ballotsIssued > 0
    ? ((totalReturnedBallots / config.ballotsIssued) * 100).toFixed(1)
    : '0';

  const validPct = totalReturnedBallots > 0
    ? ((validBallotsCount / totalReturnedBallots) * 100).toFixed(1)
    : '0';

  // Calculate sum of votes for verification
  const totalVotesSum = levelCandidates.reduce((sum, c) => sum + c.voteCount, 0);
  const expectedMaxVotes = validBallotsCount * config.numRepresentatives;
  const isVerificationBalanced = totalVotesSum <= expectedMaxVotes;

  // Auto focus input on level switch or render
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
    <div className="space-y-6">
      {/* Top Header & Level Selector */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Vote className="w-5 h-5 text-sky-600" />
            PHÂN HỆ KIỂM PHIẾU BẦU CỬ SIÊU TỐC
          </h1>
          <p className="text-xs text-slate-500">
            Hỗ trợ nhập số thứ tự ứng cử viên bị gạch và tự động tính toán phiếu hợp lệ / không hợp lệ
          </p>
        </div>

        {/* Level Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-bold">
          {(['QUOC_HOI', 'HDND_TINH', 'HDND_XA'] as ElectionLevel[]).map(lvl => {
            const isSelected = activeLevel === lvl;
            const lvlName = configs[lvl].levelName;
            return (
              <button
                key={lvl}
                onClick={() => {
                  setActiveLevel(lvl);
                  setStruckOutInput('');
                  setLastSubmittedResult(null);
                }}
                className={`px-4 py-2 rounded-md transition-all ${
                  isSelected
                    ? 'bg-sky-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lvlName}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Left Candidate Vote Ranking + Right Ballot Input Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Candidate Votes Leaderboard (Cols 7) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-800 uppercase">
              BẢNG KẾT QUẢ KIỂM PHIẾU {config.levelName.toUpperCase()}
            </h2>
            <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded border border-sky-200">
              Đã kiểm: {levelBallots.length} phiếu
            </span>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200">
                <tr>
                  <th className="p-3 w-14 text-center">STT</th>
                  <th className="p-3">Họ và tên</th>
                  <th className="p-3 w-24 text-center">Ngày sinh</th>
                  <th className="p-3 w-28 text-center">Số phiếu bầu</th>
                  <th className="p-3 w-24 text-center">Tỷ lệ %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {levelCandidates.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 text-center">
                      <span className="w-7 h-7 rounded-full bg-slate-100 font-bold text-slate-800 text-xs inline-flex items-center justify-center border">
                        {c.stt}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-slate-800 text-sm">{c.fullName}</td>
                    <td className="p-3 text-center font-mono text-slate-500">{c.dob}</td>
                    <td className="p-3 text-center font-extrabold text-emerald-600 text-base">{c.voteCount}</td>
                    <td className="p-3 text-center font-bold text-sky-700">{c.votePercentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Verification Alert Footer */}
          <div
            className={`p-3 rounded-lg border text-xs flex items-center justify-between font-semibold ${
              isVerificationBalanced
                ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                : 'bg-rose-50 text-rose-900 border-rose-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {isVerificationBalanced ? (
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-600" />
              )}
              <span>
                Tổng số lượt bầu các ứng cử viên: <strong>{totalVotesSum}</strong> lượt.
              </span>
            </div>
            <span className="text-[11px] font-mono">
              (Tối đa cho phép: {expectedMaxVotes} lượt)
            </span>
          </div>
        </div>

        {/* Right Column: Ballot Entry & Stats (Cols 5) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Level Stats Summary Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm text-xs space-y-2">
            <div className="flex justify-between text-slate-600">
              <span>Tổng số cử tri: <strong>{config.totalVoters}</strong></span>
              <span>Số ứng cử viên: <strong>{config.numCandidates}</strong></span>
            </div>
            <div className="flex justify-between text-slate-600 border-t pt-2">
              <span>Số đại biểu được bầu: <strong className="text-sky-700 font-bold">{config.numRepresentatives}</strong></span>
              <span>Số phiếu nhận vào: <strong>{config.ballotsReceived}</strong></span>
            </div>
            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 mt-2">
              <div>
                <span className="text-slate-500">Số phiếu phát ra:</span>
                <div className="font-bold text-slate-800 text-sm">{config.ballotsIssued}</div>
              </div>
              <div>
                <span className="text-slate-500">Số phiếu thu vào:</span>
                <div className="font-bold text-sky-800 text-sm">
                  {totalReturnedBallots} ({returnedPct}%)
                </div>
              </div>
              <div>
                <span className="text-slate-500">Số phiếu hợp lệ:</span>
                <div className="font-bold text-emerald-600 text-sm">
                  {validBallotsCount} ({validPct}%)
                </div>
              </div>
              <div>
                <span className="text-slate-500">Số phiếu không hợp lệ:</span>
                <div className="font-bold text-rose-600 text-sm">{invalidBallotsCount}</div>
              </div>
            </div>
          </div>

          {/* RAPID BALLOT INPUT BOX (GIAO DIỆN CHÍNH THỨC SPECS PAGE 4-5) */}
          <div className="bg-white rounded-xl border-2 border-sky-400 p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-sky-100 pb-2">
              <span className="text-xs font-bold text-sky-900 uppercase">
                PHIẾU SỐ: <span className="text-base font-extrabold text-sky-600">{currentBallotNo}</span>
              </span>
              <button
                onClick={() => setShowLogModal(true)}
                className="text-[11px] text-sky-700 hover:text-sky-800 font-bold bg-sky-50 px-2 py-1 rounded border border-sky-200 flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" />
                Xem phiếu đã kiểm
              </button>
            </div>

            {/* Input Field */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                NHẬP SỐ THỨ TỰ BỊ GẠCH:
              </label>
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={struckOutInput}
                  onChange={e => setStruckOutInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Gõ '134' hoặc '0'..."
                  className="flex-1 p-2.5 bg-slate-50 border-2 border-sky-300 rounded-lg text-lg font-mono font-bold text-sky-900 focus:bg-white focus:outline-none focus:border-sky-600 tracking-widest shadow-inner"
                />
                <button
                  onClick={handleSubmitBallot}
                  className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs px-4 rounded-lg shadow flex items-center justify-center gap-1"
                >
                  ✓ Xác nhận
                </button>
              </div>

              {/* Instructions Specs */}
              <div className="bg-slate-50 p-2.5 rounded-md border text-[11px] text-slate-600 space-y-1">
                <p>1. Nhập <strong>0</strong> cho những phiếu không hợp lệ.</p>
                <p>
                  2. Nhập liên tiếp các số thứ tự bị gạch $\rightarrow$ bấm <strong>Enter 2 lần</strong> (Ví dụ: gõ <strong>134</strong> là ứng cử viên số 1, 3, 4 bị gạch).
                </p>
              </div>
            </div>

            {/* Last Submitted Result Feedback */}
            {lastSubmittedResult && (
              <div
                className={`p-3 rounded-lg border text-xs space-y-1 ${
                  lastSubmittedResult.isValid
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}
              >
                <div className="font-bold flex items-center gap-1.5">
                  {lastSubmittedResult.isValid ? '✅ Phiếu Hợp lệ' : '❌ Phiếu Không hợp lệ'}
                </div>
                <p>{lastSubmittedResult.reason}</p>
                {lastSubmittedResult.isValid && (
                  <p className="text-[11px]">
                    Đã cộng vote cho: {lastSubmittedResult.electedCandidates.map(c => c.fullName).join(', ')}
                  </p>
                )}
              </div>
            )}

            {/* Action Buttons: Reset & Undo */}
            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  if (confirm(`Bạn có chắc chắn muốn xóa toàn bộ ${levelBallots.length} phiếu đã kiểm của ${config.levelName}?`)) {
                    resetBallotsForLevel(activeLevel);
                  }
                }}
                className="flex-1 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs rounded-lg flex items-center justify-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Kiểm phiếu lại
              </button>
              <button
                onClick={() => undoLastBallot(activeLevel)}
                disabled={levelBallots.length === 0}
                className="flex-1 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold text-xs rounded-lg flex items-center justify-center gap-1 disabled:opacity-50 transition-colors"
              >
                <Undo2 className="w-3.5 h-3.5" />
                Xóa phiếu cuối cùng
              </button>
            </div>
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
