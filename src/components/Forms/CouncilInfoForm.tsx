import React, { useState } from 'react';
import { Candidate, Council, VotingUnit } from '../../types';
import { Check, X, Edit, Save, Trash2, ChevronLeft, ChevronRight, SkipBack, SkipForward } from 'lucide-react';

interface CouncilInfoFormProps {
  council: Council;
  candidates: Candidate[];
  onSaveCandidates: (candidates: Candidate[]) => Promise<void>;
  unit: VotingUnit;
  onClose: () => void;
}

export const CouncilInfoForm: React.FC<CouncilInfoFormProps> = ({
  council,
  candidates,
  onSaveCandidates,
  unit,
  onClose
}) => {
  const [localCandidates, setLocalCandidates] = useState<Candidate[]>(() => {
    const list = candidates.filter(c => c.councilId === council.id).sort((a, b) => a.stt - b.stt);
    if (list.length === 0) {
      // Default candidates like in screenshot
      return [
        { id: 'cand-1', councilId: council.id, votingUnitId: unit.id, stt: 1, fullName: 'Nguyễn Đại Đồng', gender: 'Ông', birthDate: '13/10/1979' },
        { id: 'cand-2', councilId: council.id, votingUnitId: unit.id, stt: 2, fullName: 'Nguyễn Duy Minh', gender: 'Ông', birthDate: '26/07/1982' },
        { id: 'cand-3', councilId: council.id, votingUnitId: unit.id, stt: 3, fullName: 'Lê Ngọc Quang', gender: 'Ông', birthDate: '21/01/1978' },
        { id: 'cand-4', councilId: council.id, votingUnitId: unit.id, stt: 4, fullName: 'Đặng Thị Thanh Trà', gender: 'Bà', birthDate: '20/08/1978' },
        { id: 'cand-5', councilId: council.id, votingUnitId: unit.id, stt: 5, fullName: 'Phạm Trần Minh Tuyên', gender: 'Bà', birthDate: '11/04/1989' }
      ];
    }
    return list;
  });

  const [toElect, setToElect] = useState<number>(council.candidatesToElect || 3);
  const [totalVoters, setTotalVoters] = useState<number>(unit.totalVoters || 1369);

  // New Candidate Input Form
  const [inputStt, setInputStt] = useState<number>(localCandidates.length + 1);
  const [inputFullName, setInputFullName] = useState<string>('');
  const [inputBirthDate, setInputBirthDate] = useState<string>('');
  const [inputGender, setInputGender] = useState<string>('Ông');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [savingMsg, setSavingMsg] = useState('');

  const councilTitle = council.id === 'quoc_hoi'
    ? 'DỮ LIỆU BẦU CỬ ĐẠI BIỂU QUỐC HỘI'
    : council.id === 'hdnd_tinh'
    ? 'DỮ LIỆU BẦU CỬ ĐẠI BIỂU HỘI ĐỒNG NHÂN DÂN TỈNH'
    : 'DỮ LIỆU BẦU CỬ ĐẠI BIỂU HỘI ĐỒNG NHÂN DÂN XÃ';

  const handleAddOrUpdate = async () => {
    if (!inputFullName.trim()) return;

    let updated: Candidate[];
    if (editingId) {
      updated = localCandidates.map(c => c.id === editingId ? {
        ...c,
        stt: Number(inputStt) || c.stt,
        fullName: inputFullName.trim(),
        birthDate: inputBirthDate.trim(),
        gender: inputGender
      } : c);
      setEditingId(null);
    } else {
      const newCand: Candidate = {
        id: `cand_${Date.now()}`,
        councilId: council.id,
        votingUnitId: unit.id,
        stt: Number(inputStt) || (localCandidates.length + 1),
        fullName: inputFullName.trim(),
        birthDate: inputBirthDate.trim() || '01/01/1985',
        gender: inputGender
      };
      updated = [...localCandidates, newCand];
    }

    setLocalCandidates(updated);
    await onSaveCandidates(updated);

    // Reset inputs
    setInputFullName('');
    setInputBirthDate('');
    setInputStt(updated.length + 1);
    setSavingMsg('Đã lưu ứng cử viên thành công!');
    setTimeout(() => setSavingMsg(''), 3000);
  };

  const handleEdit = (cand: Candidate) => {
    setEditingId(cand.id);
    setInputStt(cand.stt);
    setInputFullName(cand.fullName);
    setInputBirthDate(cand.birthDate || '');
    setInputGender(cand.gender || 'Ông');
  };

  const handleDelete = async (id: string) => {
    const updated = localCandidates.filter(c => c.id !== id);
    setLocalCandidates(updated);
    await onSaveCandidates(updated);
  };

  const handleSaveAll = async () => {
    await onSaveCandidates(localCandidates);
    setSavingMsg('Đã lưu dữ liệu thành công!');
    setTimeout(() => setSavingMsg(''), 3000);
  };

  return (
    <div className="bg-slate-100 border-2 border-slate-300 rounded-lg shadow-2xl p-2 font-sans text-xs max-w-5xl mx-auto my-4 text-slate-900">
      
      {/* Window Header Title */}
      <div className="bg-gradient-to-r from-slate-700 via-slate-800 to-slate-700 text-white px-4 py-2 flex items-center justify-between shadow">
        <span className="font-extrabold text-sm tracking-wider uppercase">
          {councilTitle}
        </span>
        <button
          onClick={onClose}
          className="px-3 py-1 bg-slate-900 hover:bg-red-700 text-white border border-slate-500 rounded text-xs font-bold transition"
        >
          Đóng
        </button>
      </div>

      {savingMsg && (
        <div className="bg-emerald-100 border border-emerald-500 text-emerald-800 px-3 py-1.5 rounded my-2 text-xs font-bold flex items-center space-x-1">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{savingMsg}</span>
        </div>
      )}

      {/* Main Grid: Left Column (Overview) + Right Column (Candidate Entry & Table) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-3 bg-slate-50 border border-slate-300 mt-2 shadow-inner">
        
        {/* Left Column (Khái quát số liệu) */}
        <div className="md:col-span-4 bg-slate-100/70 border border-slate-300 p-4 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-red-700">‣ Tổng số cử tri:</span>
            <input
              type="text"
              value={totalVoters.toLocaleString('vi-VN')}
              onChange={e => setTotalVoters(Number(e.target.value.replace(/[^0-9]/g, '')) || 0)}
              className="w-24 bg-white border border-slate-400 text-right font-bold text-sky-900 px-2 py-1"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="font-bold text-red-700">‣ Số người ứng cử:</span>
            <input
              type="number"
              value={localCandidates.length}
              readOnly
              className="w-24 bg-slate-50 border border-slate-400 text-center font-bold text-sky-900 px-2 py-1"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="font-bold text-red-700">‣ Số đại biểu được bầu:</span>
            <input
              type="number"
              value={toElect}
              onChange={e => setToElect(Number(e.target.value) || 3)}
              className="w-24 bg-white border border-slate-400 text-center font-bold text-sky-900 px-2 py-1"
            />
          </div>
        </div>

        {/* Right Section (Nhập danh sách ứng cử viên) */}
        <div className="md:col-span-8 space-y-3">
          
          {/* Header Row */}
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="font-extrabold text-slate-900 text-sm">
              Nhập danh sách ứng cử viên
            </h3>
            <button
              onClick={handleSaveAll}
              className="flex items-center space-x-1.5 px-4 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-500 rounded font-bold shadow-xs transition"
            >
              <Check className="w-4 h-4 text-emerald-700" />
              <span>Lưu</span>
            </button>
          </div>

          {/* Form Input New Candidate */}
          <div className="space-y-2 bg-slate-100 p-3 border border-slate-300 rounded shadow-xs">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-800 w-16">Stt:</span>
              <input
                type="number"
                value={inputStt}
                onChange={e => setInputStt(Number(e.target.value))}
                className="w-16 bg-white border border-slate-400 text-center font-bold px-2 py-1"
              />
              <span className="text-red-600 text-[11px] italic font-semibold">
                (* Phải nhập đúng số thứ tự của ứng viên như trên phiếu bầu)
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-800 w-16">Họ và tên:</span>
              <input
                type="text"
                value={inputFullName}
                onChange={e => setInputFullName(e.target.value)}
                placeholder="Nhập họ và tên ứng cử viên..."
                className="flex-1 bg-white border border-slate-400 px-3 py-1 font-bold text-slate-900"
              />
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-800 w-16">Ngày sinh:</span>
                <input
                  type="text"
                  placeholder="dd/mm/yyyy"
                  value={inputBirthDate}
                  onChange={e => setInputBirthDate(e.target.value)}
                  className="w-32 bg-white border border-slate-400 px-2 py-1 text-center font-semibold"
                />
              </div>

              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-800">Giới tính:</span>
                <select
                  value={inputGender}
                  onChange={e => setInputGender(e.target.value)}
                  className="bg-white border border-slate-400 px-3 py-1 font-semibold"
                >
                  <option value="Ông">Ông</option>
                  <option value="Bà">Bà</option>
                </select>
              </div>

              <button
                onClick={handleAddOrUpdate}
                className="px-3 py-1 bg-sky-100 hover:bg-sky-200 text-sky-900 border border-sky-500 rounded font-bold shadow-xs transition"
              >
                {editingId ? 'Cập nhật' : 'Thêm vào danh sách'}
              </button>
            </div>
          </div>

          {/* Table List of Candidates */}
          <div className="border border-slate-300 bg-white">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="bg-slate-200 font-bold text-slate-800 border-b border-slate-300">
                  <th className="p-2 border-r border-slate-300 text-center w-12">STT</th>
                  <th className="p-2 border-r border-slate-300">Họ và tên ứng cử viên</th>
                  <th className="p-2 border-r border-slate-300 text-center w-24">Giới tính</th>
                  <th className="p-2 border-r border-slate-300 text-center w-28">Ngày sinh</th>
                  <th className="p-2 text-center w-24">---</th>
                </tr>
              </thead>
              <tbody>
                {localCandidates.map((cand, idx) => (
                  <tr key={cand.id} className="border-b border-slate-200 hover:bg-sky-50 transition">
                    <td className="p-2 border-r border-slate-200 text-center font-bold">{cand.stt || (idx + 1)}</td>
                    <td className="p-2 border-r border-slate-200 font-bold text-slate-900">{cand.fullName}</td>
                    <td className="p-2 border-r border-slate-200 text-center">{cand.gender || 'Ông'}</td>
                    <td className="p-2 border-r border-slate-200 text-center">{cand.birthDate || '—'}</td>
                    <td className="p-2 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={() => handleDelete(cand.id)}
                          className="px-1.5 py-0.5 border border-red-400 bg-red-50 text-red-700 hover:bg-red-200 rounded font-bold text-[11px]"
                          title="Xóa"
                        >
                          x
                        </button>
                        <button
                          onClick={() => handleEdit(cand)}
                          className="px-1.5 py-0.5 border border-amber-400 bg-amber-50 text-amber-800 hover:bg-amber-200 rounded font-bold text-[11px]"
                          title="Sửa"
                        >
                          /
                        </button>
                        <button
                          onClick={handleSaveAll}
                          className="px-1.5 py-0.5 border border-blue-400 bg-blue-50 text-blue-800 hover:bg-blue-200 rounded font-bold text-[11px]"
                          title="Lưu"
                        >
                          💾
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Access Bottom Record Navigation Bar */}
            <div className="bg-slate-200 border-t border-slate-300 px-3 py-1 flex items-center justify-between text-[11px] text-slate-700 font-mono">
              <div className="flex items-center space-x-2">
                <span>Record:</span>
                <button className="p-0.5 hover:bg-slate-300 rounded"><SkipBack className="w-3 h-3" /></button>
                <button className="p-0.5 hover:bg-slate-300 rounded"><ChevronLeft className="w-3 h-3" /></button>
                <span className="font-bold border border-slate-400 px-2 py-0.5 bg-white">1 of {localCandidates.length}</span>
                <button className="p-0.5 hover:bg-slate-300 rounded"><ChevronRight className="w-3 h-3" /></button>
                <button className="p-0.5 hover:bg-slate-300 rounded"><SkipForward className="w-3 h-3" /></button>
              </div>
              <div className="flex items-center space-x-4">
                <span>No Filter</span>
                <span>Search</span>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
