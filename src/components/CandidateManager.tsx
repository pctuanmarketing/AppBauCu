import React, { useState } from 'react';
import { Candidate, Council, CouncilId, VotingUnit } from '../types';
import { UserPlus, Trash2, Edit, Save, Users, Building, Plus, Check, RefreshCw } from 'lucide-react';

interface CandidateManagerProps {
  councils: Council[];
  selectedCouncilId: CouncilId;
  setSelectedCouncilId: (id: CouncilId) => void;
  candidates: Candidate[];
  onSaveCandidates: (candidates: Candidate[]) => Promise<void>;
  unit: VotingUnit;
  onSaveUnit: (unit: VotingUnit) => Promise<void>;
}

export const CandidateManager: React.FC<CandidateManagerProps> = ({
  councils,
  selectedCouncilId,
  setSelectedCouncilId,
  candidates,
  onSaveCandidates,
  unit,
  onSaveUnit
}) => {
  const [editingUnit, setEditingUnit] = useState<VotingUnit>({ ...unit });
  const [isEditingUnitInfo, setIsEditingUnitInfo] = useState(false);

  const [localCandidates, setLocalCandidates] = useState<Candidate[]>([...candidates]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCand, setNewCand] = useState<Partial<Candidate>>({
    fullName: '',
    birthYear: 1985,
    gender: 'Nam',
    currentPosition: '',
    ethnic: 'Kinh'
  });

  const [savingMsg, setSavingMsg] = useState('');

  const currentCandidates = localCandidates
    .filter(c => c.councilId === selectedCouncilId)
    .sort((a, b) => a.stt - b.stt);

  const handleSaveUnitInfo = async () => {
    await onSaveUnit(editingUnit);
    setIsEditingUnitInfo(false);
    setSavingMsg('Đã lưu thông tin Tổ bầu cử thành công!');
    setTimeout(() => setSavingMsg(''), 3000);
  };

  const handleAddCandidate = async () => {
    if (!newCand.fullName?.trim()) return;

    const nextStt = currentCandidates.length + 1;
    const added: Candidate = {
      id: `c_${Date.now()}`,
      councilId: selectedCouncilId,
      votingUnitId: unit.id,
      stt: nextStt,
      fullName: newCand.fullName.trim(),
      birthYear: Number(newCand.birthYear) || 1980,
      gender: newCand.gender || 'Nam',
      currentPosition: newCand.currentPosition?.trim() || '',
      ethnic: newCand.ethnic || 'Kinh'
    };

    const updated = [...localCandidates, added];
    setLocalCandidates(updated);
    await onSaveCandidates(updated);

    setShowAddModal(false);
    setNewCand({ fullName: '', birthYear: 1985, gender: 'Nam', currentPosition: '', ethnic: 'Kinh' });
    setSavingMsg('Đã thêm ứng cử viên thành công!');
    setTimeout(() => setSavingMsg(''), 3000);
  };

  const handleDeleteCandidate = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa ứng cử viên này khỏi danh sách?')) return;

    const updated = localCandidates.filter(c => c.id !== id);
    setLocalCandidates(updated);
    await onSaveCandidates(updated);
  };

  return (
    <div className="space-y-6">
      
      {savingMsg && (
        <div className="bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 px-4 py-3 rounded-xl text-sm font-medium flex items-center space-x-2 animate-fadeIn shadow-lg">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{savingMsg}</span>
        </div>
      )}

      {/* Thông tin Tổ bầu cử */}
      <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Building className="w-5 h-5 text-amber-400" />
            <span>Khai Báo Thông Tin Đơn Vị Bầu Cử / Tổ Bầu Cử</span>
          </h2>
          {!isEditingUnitInfo ? (
            <button
              onClick={() => setIsEditingUnitInfo(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-xs font-semibold transition"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Chỉnh sửa</span>
            </button>
          ) : (
            <button
              onClick={handleSaveUnitInfo}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg text-xs font-bold transition shadow"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Lưu thay đổi</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <label className="text-xs text-slate-400 font-medium block mb-1">Tên Tổ bầu cử / Đơn vị:</label>
            {isEditingUnitInfo ? (
              <input
                type="text"
                value={editingUnit.unitName}
                onChange={e => setEditingUnit({ ...editingUnit, unitName: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm"
              />
            ) : (
              <p className="font-bold text-amber-300">{unit.unitName}</p>
            )}
          </div>

          <div>
            <label className="text-xs text-slate-400 font-medium block mb-1">Khu vực bỏ phiếu:</label>
            {isEditingUnitInfo ? (
              <input
                type="text"
                value={editingUnit.votingArea}
                onChange={e => setEditingUnit({ ...editingUnit, votingArea: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm"
              />
            ) : (
              <p className="font-semibold text-slate-200">{unit.votingArea}</p>
            )}
          </div>

          <div>
            <label className="text-xs text-slate-400 font-medium block mb-1">Tổng số cử tri khu vực:</label>
            {isEditingUnitInfo ? (
              <input
                type="number"
                value={editingUnit.totalVoters}
                onChange={e => setEditingUnit({ ...editingUnit, totalVoters: Number(e.target.value) || 0 })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm"
              />
            ) : (
              <p className="font-bold text-emerald-400">{unit.totalVoters.toLocaleString('vi-VN')} cử tri</p>
            )}
          </div>
        </div>
      </div>

      {/* Quản lý danh sách ứng cử viên */}
      <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 shadow-xl space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-700">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Users className="w-5 h-5 text-sky-400" />
              <span>Danh Sách Ứng Cử Viên Chính Thức</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Chọn cấp bầu cử để xem hoặc thêm bớt danh sách ứng cử viên</p>
          </div>

          <div className="flex items-center space-x-3">
            {/* Choose Council Tab */}
            <select
              value={selectedCouncilId}
              onChange={e => setSelectedCouncilId(e.target.value as CouncilId)}
              className="bg-slate-900 border border-slate-700 text-amber-300 text-xs font-bold rounded-lg px-3 py-2 focus:outline-none"
            >
              {councils.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold transition shadow"
            >
              <UserPlus className="w-4 h-4" />
              <span>Thêm ứng cử viên</span>
            </button>
          </div>
        </div>

        {/* Table Candidates */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 uppercase text-slate-400 font-semibold border-b border-slate-700">
              <tr>
                <th className="p-3 text-center">STT</th>
                <th className="p-3">Họ và tên ứng cử viên</th>
                <th className="p-3 text-center">Năm sinh</th>
                <th className="p-3 text-center">Giới tính</th>
                <th className="p-3">Chức vụ / Đơn vị công tác</th>
                <th className="p-3 text-center">Dân tộc</th>
                <th className="p-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60">
              {currentCandidates.map((cand, idx) => (
                <tr key={cand.id} className="hover:bg-slate-700/30 transition">
                  <td className="p-3 text-center font-bold text-amber-300">{idx + 1}</td>
                  <td className="p-3 font-bold text-white">{cand.fullName}</td>
                  <td className="p-3 text-center">{cand.birthYear || '—'}</td>
                  <td className="p-3 text-center">{cand.gender}</td>
                  <td className="p-3 text-slate-300">{cand.currentPosition || '—'}</td>
                  <td className="p-3 text-center">{cand.ethnic || 'Kinh'}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleDeleteCandidate(cand.id)}
                      className="p-1.5 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded transition"
                      title="Xóa ứng cử viên"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}

              {currentCandidates.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-slate-500 italic">
                    Chưa có ứng cử viên nào trong danh sách cấp này. Nhấn nút "Thêm ứng cử viên" ở trên.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Modal Add Candidate */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white border-b border-slate-700 pb-2">
              Thêm Ứng Cử Viên Mới
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-medium block mb-1">Họ và tên *</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={newCand.fullName}
                  onChange={e => setNewCand({ ...newCand, fullName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Năm sinh</label>
                  <input
                    type="number"
                    value={newCand.birthYear}
                    onChange={e => setNewCand({ ...newCand, birthYear: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Giới tính</label>
                  <select
                    value={newCand.gender}
                    onChange={e => setNewCand({ ...newCand, gender: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Chức vụ / Đơn vị công tác</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Chủ tịch UBND Xã"
                  value={newCand.currentPosition}
                  onChange={e => setNewCand({ ...newCand, currentPosition: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-3 border-t border-slate-700">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-xs font-semibold"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleAddCandidate}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold"
              >
                Lưu ứng cử viên
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
