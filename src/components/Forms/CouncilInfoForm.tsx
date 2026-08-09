import React, { useState } from 'react';
import { Candidate, Council, VotingUnit } from '../../types';
import { Check, X, Edit, Save, Trash2 } from 'lucide-react';

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

  const [toElect, setToElect] = useState<number>(council.candidatesToElect || council.electCount || 3);
  const [totalVoters, setTotalVoters] = useState<number>(unit.totalVoters || 1369);

  const [inputStt, setInputStt] = useState<number | string>(localCandidates.length + 1);
  const [inputFullName, setInputFullName] = useState<string>('');
  const [inputBirthDate, setInputBirthDate] = useState<string>('');
  const [inputGender, setInputGender] = useState<string>('Ông');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
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

    setInputFullName('');
    setInputBirthDate('');
    setInputStt(updated.length + 1);
    setSavingMsg('Đã lưu danh sách ứng cử viên thành công!');
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

  return (
    <div className="bg-slate-100 border-2 border-red-500/60 rounded-sm shadow-2xl p-2 font-sans text-xs max-w-5xl mx-auto my-4 text-slate-900 select-none">
      
      {/* Top Banner Title Bar (Giống 100% hình chụp Access) */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 text-white px-4 py-2 flex items-center justify-between shadow-md">
        <span className="font-extrabold text-sm tracking-wider uppercase">
          {councilTitle}
        </span>
        <button
          onClick={onClose}
          className="px-4 py-1 bg-slate-900 hover:bg-red-700 text-white border border-slate-500 rounded text-xs font-bold transition shadow-sm"
        >
          Đóng
        </button>
      </div>

      {savingMsg && (
        <div className="m-2 p-2 bg-emerald-100 border border-emerald-400 text-emerald-800 font-bold rounded text-xs">
          ✓ {savingMsg}
        </div>
      )}

      {/* Main Two-Column Layout (Khớp 100% hình chụp Access) */}
      <div className="p-3 bg-slate-50 border border-slate-300 mt-2 grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* Left Panel: Thông tin số liệu cử tri & ứng cử (Khung xám nhạt) */}
        <div className="md:col-span-4 bg-slate-200/80 border border-slate-300 rounded p-4 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 text-xs">▶ Tổng số cử tri:</span>
            <input
              type="text"
              value={totalVoters.toLocaleString('vi-VN')}
              onChange={e => setTotalVoters(Number(e.target.value.replace(/\D/g, '')))}
              className="bg-sky-600 font-black text-white text-right px-2 py-1 rounded w-28 text-xs shadow-inner"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 text-xs">▶ Số người ứng cử:</span>
            <input
              type="number"
              readOnly
              value={localCandidates.length}
              className="bg-white border border-slate-400 font-black text-slate-900 text-center px-2 py-1 rounded w-28 text-xs"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 text-xs">▶ Số đại biểu được bầu:</span>
            <input
              type="number"
              value={toElect}
              onChange={e => setToElect(Number(e.target.value))}
              className="bg-white border border-slate-400 font-black text-slate-900 text-center px-2 py-1 rounded w-28 text-xs"
            />
          </div>
        </div>

        {/* Right Panel: Nhập danh sách ứng cử viên & Bảng dữ liệu */}
        <div className="md:col-span-8 bg-white border border-slate-300 rounded p-4 space-y-4 shadow-xs">
          
          {/* Header Form & Button Lưu */}
          <div className="flex justify-between items-center border-b border-slate-200 pb-2">
            <h4 className="font-extrabold text-slate-900 text-xs uppercase">
              NHẬP DANH SÁCH ỨNG CỬ VIÊN
            </h4>
            <button
              onClick={handleAddOrUpdate}
              className="px-5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-400 rounded font-bold transition flex items-center space-x-1 shadow-xs"
            >
              <Check className="w-4 h-4 text-emerald-700" />
              <span>{editingId ? 'Cập nhật' : 'Lưu'}</span>
            </button>
          </div>

          {/* Form Input Fields (Giống 100% hình chụp Access) */}
          <div className="space-y-2.5 font-sans text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-slate-800 w-20">Stt:</span>
              <input
                type="text"
                value={inputStt}
                onChange={e => setInputStt(e.target.value)}
                className="border border-slate-400 rounded px-2 py-1 font-bold text-center w-24 bg-white"
              />
              <span className="text-[11px] text-red-600 font-semibold italic">
                (* Phải nhập đúng số thứ tự của ứng viên như trên phiếu bầu)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800 w-20">Họ và tên:</span>
              <input
                type="text"
                placeholder="Nhập họ và tên ứng cử viên"
                value={inputFullName}
                onChange={e => setInputFullName(e.target.value)}
                className="flex-1 border border-slate-400 rounded px-2.5 py-1 font-bold text-slate-900 uppercase bg-white"
              />
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800 w-20">Ngày sinh:</span>
                <input
                  type="text"
                  placeholder="DD/MM/YYYY"
                  value={inputBirthDate}
                  onChange={e => setInputBirthDate(e.target.value)}
                  className="border border-slate-400 rounded px-2.5 py-1 text-slate-900 w-36 bg-white"
                />
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <span className="font-bold text-slate-800">Giới tính:</span>
                <select
                  value={inputGender}
                  onChange={e => setInputGender(e.target.value)}
                  className="border border-slate-400 rounded px-2 py-1 font-semibold bg-white w-24"
                >
                  <option value="Ông">Ông</option>
                  <option value="Bà">Bà</option>
                </select>
              </div>
            </div>
          </div>

          {/* Access Table Design for Candidate Roster */}
          <div className="border-2 border-slate-400 rounded overflow-x-auto bg-white mt-2">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gradient-to-b from-slate-200 to-slate-300 text-slate-900 font-bold border-b-2 border-slate-400 text-[11px]">
                  <th className="p-1.5 w-8 text-center border-r border-slate-300"></th>
                  <th className="p-1.5 w-14 text-center border-r border-slate-300 uppercase">STT</th>
                  <th className="p-1.5 border-r border-slate-300">Họ và tên ứng cử viên</th>
                  <th className="p-1.5 w-24 text-center border-r border-slate-300">Giới tính</th>
                  <th className="p-1.5 w-32 text-center border-r border-slate-300">Ngày sinh</th>
                  <th className="p-1.5 w-24 text-center">---</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300 text-xs">
                {localCandidates.map((cand, idx) => {
                  const isSelected = idx === selectedIdx;
                  return (
                    <tr
                      key={cand.id}
                      onClick={() => setSelectedIdx(idx)}
                      className={`transition ${isSelected ? 'bg-amber-100/90 font-bold' : 'hover:bg-slate-100'}`}
                    >
                      <td className="p-1 text-center border-r border-slate-300 font-bold text-slate-800 w-8">
                        {isSelected ? '▶' : ''}
                      </td>
                      <td className="p-1.5 text-center font-extrabold border-r border-slate-300 text-slate-900 w-14">
                        {cand.stt}
                      </td>
                      <td className="p-1.5 font-bold uppercase text-slate-900 border-r border-slate-300">
                        {cand.fullName}
                      </td>
                      <td className="p-1.5 text-center border-r border-slate-300">
                        {cand.gender || 'Ông'}
                      </td>
                      <td className="p-1.5 text-center border-r border-slate-300 font-mono">
                        {cand.birthDate || cand.yearOfBirth || '-'}
                      </td>
                      <td className="p-1 text-center space-x-1 w-24">
                        <button
                          onClick={() => handleDelete(cand.id)}
                          className="px-1.5 py-0.5 bg-white border border-red-400 hover:bg-red-100 text-red-700 rounded font-extrabold text-[11px]"
                          title="Xóa"
                        >
                          X
                        </button>
                        <button
                          onClick={() => handleEdit(cand)}
                          className="px-1.5 py-0.5 bg-white border border-sky-400 hover:bg-sky-100 text-sky-800 rounded font-extrabold text-[11px]"
                          title="Sửa"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={handleAddOrUpdate}
                          className="px-1.5 py-0.5 bg-white border border-purple-400 hover:bg-purple-100 text-purple-800 rounded font-extrabold text-[11px]"
                          title="Lưu"
                        >
                          💾
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Access Bottom Navigation Bar (Giống 100% hình chụp Access) */}
          <div className="bg-slate-200 border border-slate-300 p-1.5 rounded flex items-center justify-between text-[11px] font-mono text-slate-800">
            <div className="flex items-center space-x-2">
              <span className="font-sans font-bold">Record:</span>
              <button
                onClick={() => setSelectedIdx(0)}
                className="p-1 hover:bg-slate-300 rounded font-bold"
                title="Đầu tiên"
              >
                |◄
              </button>
              <button
                onClick={() => setSelectedIdx(Math.max(0, selectedIdx - 1))}
                className="p-1 hover:bg-slate-300 rounded font-bold"
                title="Trước đó"
              >
                ◄
              </button>

              <span className="px-2 py-0.5 bg-white border border-slate-400 rounded font-bold text-center">
                {localCandidates.length > 0 ? selectedIdx + 1 : 0} of {localCandidates.length}
              </span>

              <button
                onClick={() => setSelectedIdx(Math.min(localCandidates.length - 1, selectedIdx + 1))}
                className="p-1 hover:bg-slate-300 rounded font-bold"
                title="Tiếp theo"
              >
                ►
              </button>
              <button
                onClick={() => setSelectedIdx(Math.max(0, localCandidates.length - 1))}
                className="p-1 hover:bg-slate-300 rounded font-bold"
                title="Cuối cùng"
              >
                ►|
              </button>
              <button
                onClick={() => {
                  setEditingId(null);
                  setInputStt(localCandidates.length + 1);
                  setInputFullName('');
                  setInputBirthDate('');
                }}
                className="p-1 text-amber-700 font-bold hover:bg-slate-300 rounded"
                title="Thêm mới"
              >
                ✹
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <span className="px-2 py-0.5 bg-slate-300 text-slate-700 rounded font-sans text-[10px]">
                Y No Filter
              </span>
              <div className="flex items-center space-x-1 bg-white border border-slate-400 rounded px-2 py-0.5">
                <span className="font-sans text-[10px] text-slate-500">Search:</span>
                <input type="text" className="w-24 border-none text-[11px] focus:outline-none" />
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
