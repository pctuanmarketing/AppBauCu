import React, { useState, useEffect, useRef } from 'react';
import { Candidate, CandidateVote, Council, CouncilId, SingleBallotLog, VoteRecord, VotingUnit, User } from '../types';
import { Check, RotateCcw, Trash2, Eye, X, ShieldAlert, Lock } from 'lucide-react';

interface VoteCountingProps {
  councils: Council[];
  selectedCouncilId: CouncilId;
  setSelectedCouncilId: (id: CouncilId) => void;
  unit: VotingUnit;
  candidates: Candidate[];
  voteRecord: VoteRecord;
  candidateVotes: CandidateVote[];
  onSaveVoteRecord: (record: VoteRecord, candidateVotes: CandidateVote[]) => Promise<void>;
  currentUser?: User | null;
}

export const VoteCounting: React.FC<VoteCountingProps> = ({
  councils,
  selectedCouncilId,
  setSelectedCouncilId,
  unit,
  candidates,
  voteRecord,
  candidateVotes,
  onSaveVoteRecord,
  currentUser
}) => {
  const isViewer = currentUser?.role === 'viewer';

  const currentCouncil = councils.find(c => c.id === selectedCouncilId) || councils[0];
  const currentCandidates = candidates
    .filter(c => c.councilId === selectedCouncilId)
    .sort((a, b) => a.stt - b.stt);

  // Stats State
  const [record, setRecord] = useState<VoteRecord>({
    ...voteRecord,
    totalVoters: voteRecord.totalVoters || unit.totalVoters || 1369
  });

  const [cVotes, setCVotes] = useState<CandidateVote[]>(() => {
    return currentCandidates.map(c => {
      const match = candidateVotes.find(v => v.candidateId === c.id);
      return {
        id: match?.id || `cv-${c.id}`,
        voteRecordId: record.id,
        candidateId: c.id,
        votesCount: match ? match.votesCount : 1240
      };
    });
  });

  // Fast Vote Entry State
  const [pinkInput, setPinkInput] = useState('');
  const [ballotHistory, setBallotHistory] = useState<SingleBallotLog[]>([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const pinkInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setRecord({
      ...voteRecord,
      totalVoters: voteRecord.totalVoters || unit.totalVoters || 1369
    });
    setCVotes(currentCandidates.map(c => {
      const match = candidateVotes.find(v => v.candidateId === c.id);
      return {
        id: match?.id || `cv-${c.id}`,
        voteRecordId: voteRecord.id,
        candidateId: c.id,
        votesCount: match ? match.votesCount : 1240
      };
    }));
  }, [selectedCouncilId, voteRecord, candidates]);

  // Struck-out STTs from typing
  const getStruckOutSttsFromInput = (input: string): number[] => {
    const clean = input.trim();
    if (!clean) return [];
    return clean.split('').map(char => parseInt(char, 10)).filter(num => !isNaN(num) && num > 0);
  };

  const currentStruckStts = getStruckOutSttsFromInput(pinkInput);

  // Submit a single ballot (Enter key)
  const handlePinkInputSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isViewer) return;
    if (e.key === 'Enter') {
      e.preventDefault();

      const struckStts = currentStruckStts;
      const ballotNo = ballotHistory.length + 1;

      // Update vote counts
      const updatedCVotes = cVotes.map(cv => {
        const cand = currentCandidates.find(c => c.id === cv.candidateId);
        if (cand && !struckStts.includes(cand.stt)) {
          return { ...cv, votesCount: cv.votesCount + 1 };
        }
        return cv;
      });

      const updatedRecord: VoteRecord = {
        ...record,
        votersVoted: record.votersVoted + 1,
        ballotsCollected: record.ballotsCollected + 1,
        validBallots: record.validBallots + (struckStts.length < currentCandidates.length ? 1 : 0),
        invalidBallots: record.invalidBallots + (struckStts.length >= currentCandidates.length ? 1 : 0)
      };

      const newLog: SingleBallotLog = {
        id: `log-${Date.now()}`,
        ballotNo,
        struckOutStts: struckStts,
        valid: struckStts.length < currentCandidates.length,
        timestamp: new Date().toLocaleTimeString('vi-VN')
      };

      setCVotes(updatedCVotes);
      setRecord(updatedRecord);
      setBallotHistory([newLog, ...ballotHistory]);
      setPinkInput('');

      onSaveVoteRecord(updatedRecord, updatedCVotes);
    }
  };

  // Undo Last Ballot
  const handleUndoLastBallot = () => {
    if (isViewer) return;
    if (ballotHistory.length === 0) return;
    const lastLog = ballotHistory[0];
    const remainingLogs = ballotHistory.slice(1);

    const updatedCVotes = cVotes.map(cv => {
      const cand = currentCandidates.find(c => c.id === cv.candidateId);
      if (cand && !lastLog.struckOutStts.includes(cand.stt)) {
        return { ...cv, votesCount: Math.max(0, cv.votesCount - 1) };
      }
      return cv;
    });

    const updatedRecord: VoteRecord = {
      ...record,
      votersVoted: Math.max(0, record.votersVoted - 1),
      ballotsCollected: Math.max(0, record.ballotsCollected - 1),
      validBallots: Math.max(0, record.validBallots - (lastLog.valid ? 1 : 0)),
      invalidBallots: Math.max(0, record.invalidBallots - (!lastLog.valid ? 1 : 0))
    };

    setCVotes(updatedCVotes);
    setRecord(updatedRecord);
    setBallotHistory(remainingLogs);

    onSaveVoteRecord(updatedRecord, updatedCVotes);
  };

  return (
    <div className="bg-slate-100 border border-slate-300 rounded-xl p-3 sm:p-5 shadow-sm font-sans text-xs text-slate-900 space-y-4 select-none">
      
      {/* Title Header Bar */}
      <div className="bg-gradient-to-r from-red-900 via-red-800 to-red-950 text-white px-4 py-2 rounded-t-xl flex items-center justify-between shadow">
        <div className="flex items-center space-x-2">
          <span className="font-extrabold text-sm uppercase tracking-wide">
            KIỂM PHIẾU BẦU CỬ {currentCouncil.shortName.toUpperCase()}
          </span>
          <span className="px-2 py-0.5 bg-amber-400 text-red-950 font-black rounded text-[10px] uppercase">
            {unit.unitName}
          </span>
        </div>

        {/* Council Tabs */}
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

      {/* Viewer Role Alert Banner */}
      {isViewer && (
        <div className="bg-amber-50 border-2 border-amber-400 p-3 rounded-xl flex items-center space-x-3 text-amber-900 font-bold text-xs shadow-xs">
          <ShieldAlert className="w-6 h-6 text-amber-600 flex-shrink-0" />
          <div>
            <span>Tài khoản của bạn có quyền <strong>Quan sát viên (Viewer)</strong>:</span>
            <p className="text-[11px] font-normal text-amber-800">
              Bạn chỉ có quyền xem kết quả kiểm phiếu và tiến độ thời gian thực. Không được gạch tên hay sửa đổi dữ liệu.
            </p>
          </div>
        </div>
      )}

      {/* FAST VOTE COUNTING SECTION */}
      <div className="bg-white border-2 border-red-200 rounded-xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <label className="font-extrabold text-red-800 text-xs uppercase tracking-wide flex items-center space-x-1.5">
            <span>NHẬP LIỆU PHIẾU BẦU SIÊU NHANH (GÕ STT ỨNG VIÊN BỊ GẠCH)</span>
          </label>

          <div className="flex space-x-2">
            <button
              onClick={() => setShowHistoryModal(true)}
              className="flex items-center space-x-1 px-3 py-1 bg-sky-50 text-sky-800 border border-sky-300 rounded hover:bg-sky-100 font-bold transition text-xs"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Xem lịch sử đọc ({ballotHistory.length})</span>
            </button>

            {!isViewer && (
              <button
                onClick={handleUndoLastBallot}
                disabled={ballotHistory.length === 0}
                className="flex items-center space-x-1 px-3 py-1 bg-amber-50 text-amber-800 border border-amber-300 rounded hover:bg-amber-100 font-bold transition text-xs disabled:opacity-40"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Hoàn tác phiếu vừa đọc</span>
              </button>
            )}
          </div>
        </div>

        {/* Pink Fast Vote Input Box (Glowing Pink) */}
        <div className="relative">
          <input
            ref={pinkInputRef}
            type="text"
            disabled={isViewer}
            placeholder={isViewer ? "Tài khoản Viewer chỉ có quyền xem số liệu..." : "Ví dụ: gõ 135 + nhấn ENTER 2 lần để gạch tên số 1, 3, 5"}
            value={pinkInput}
            onChange={e => setPinkInput(e.target.value)}
            onKeyDown={handlePinkInputSubmit}
            className={`w-full text-sm font-bold p-3 rounded-lg border-2 transition focus:outline-none ${
              isViewer
                ? 'bg-slate-100 border-slate-300 text-slate-400 cursor-not-allowed'
                : 'bg-pink-50 border-pink-400 text-pink-900 focus:border-red-600 focus:ring-2 focus:ring-pink-300 shadow-inner'
            }`}
          />
          {isViewer && <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />}
        </div>
      </div>

      {/* CANDIDATES ROSTER TABLE WITH LIVE RED HIGHLIGHT */}
      <div className="bg-white border border-slate-300 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-200 text-slate-800 font-extrabold text-xs border-b border-slate-300">
              <th className="p-2.5 text-center w-14">STT</th>
              <th className="p-2.5">HỌ VÀ TÊN ỨNG CỬ VIÊN</th>
              <th className="p-2.5 text-center w-28">NĂM SINH</th>
              <th className="p-2.5 text-center w-24">GIỚI TÍNH</th>
              <th className="p-2.5 text-center w-36">SỐ PHIẾU ĐỒNG Ý</th>
              <th className="p-2.5 text-center w-28">TỶ LỆ %</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-xs">
            {currentCandidates.map(cand => {
              const isStruckOut = currentStruckStts.includes(cand.stt);
              const cv = cVotes.find(v => v.candidateId === cand.id);
              const voteCount = cv ? cv.votesCount : 0;
              const percent = record.validBallots > 0 ? ((voteCount / record.validBallots) * 100).toFixed(2) : '0.00';

              return (
                <tr
                  key={cand.id}
                  className={`transition ${
                    isStruckOut
                      ? 'bg-red-500 text-white font-bold'
                      : 'hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <td className="p-2.5 text-center font-bold">{cand.stt}</td>
                  <td className="p-2.5 font-bold uppercase">{cand.fullName}</td>
                  <td className="p-2.5 text-center">{cand.yearOfBirth || '-'}</td>
                  <td className="p-2.5 text-center">{cand.gender || '-'}</td>
                  <td className={`p-2.5 text-center font-black text-sm ${isStruckOut ? 'text-white' : 'text-emerald-700'}`}>
                    {voteCount.toLocaleString('vi-VN')}
                  </td>
                  <td className={`p-2.5 text-center font-bold ${isStruckOut ? 'text-white' : 'text-slate-700'}`}>
                    {percent}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
};
