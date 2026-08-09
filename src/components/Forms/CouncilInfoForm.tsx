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

  return (
    <div className="bg-slate-100 border-2 border-red-500/80 rounded-sm shadow-xl p-2 font-sans text-xs max-w-5xl mx-auto my-4 text-slate-900">
      
      {/* Top Title Banner */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 text-white px-4 py-2 flex items-center justify-between shadow-md">
        <span className="font-extrabold text-sm tracking-wider uppercase">
          {councilTitle}
        </span>
        <button
          onClick={onClose}
          className="px-3 py-1 bg-slate-900 hover:bg-red-700 text-white border border-slate-500 rounded text-xs font-bold transition shadow-sm"
        >
          Đóng
        </button>
      </div>

      {savingMsg && (
        <div className="m-2 p-2 bg-emerald-100 border border-emerald-400 text-emerald-800 font-bold rounded text-xs">
          ✓ {savingMsg}
        </div>
      )}

      {/* Main Section */}
      <div className="p-3 bg-slate-50 border border-slate-300 mt-2 space-y-4">
        
        {/* Top Meta Details Form */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-white p-3 border border-slate-300 rounded shadow-xs">
          <div>
            <label className="font-bold text-slate-800 block mb-1">Cấp bầu cử</label>
            <input
              type="text"
              readOnly
              value={council.name}
              className="w-full bg-slate-100 border border-slate-300 rounded px-2 py-1 font-bold text-red-800"
            />
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1">Số đại biểu được bầu (*)</label>
            <input
              type="number"
              value={toElect}
              onChange={e => setToElect(Number(e.target.value))}
              className="w-full bg-white border border-slate-300 rounded px-2 py-1 font-bold text-slate-900"
            />
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1">Số ứng cử viên trong danh sách</label>
            <input
              type="number"
              readOnly
              value={localCandidates.length}
              className="w-full bg-slate-100 border border-slate-300 rounded px-2 py-1 font-bold text-sky-800"
            />
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1">Tổng số cử tri đi bầu</label>
            <input
              type="number"
              value={totalVoters}
              onChange={e => setTotalVoters(Number(e.target.value))}
              className="w-full bg-white border border-slate-300 rounded px-2 py-1 font-bold text-emerald-800"
            />
          </div>
        </div>

        {/* Input Candidate Roster Form */}
        <div className="bg-white p-3 border border-slate-300 rounded shadow-xs space-y-2">
          <h4 className="font-extrabold text-slate-900 text-xs uppercase">
            {editingId ? 'Hiệu chỉnh ứng cử viên' : 'Thêm ứng cử viên mới'}
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
            <div className="md:col-span-2">
              <label className="text-[11px] text-slate-600 block">Số thứ tự</label>
              <input
                type="number"
                value={inputStt}
                onChange={e => setInputStt(Number(e.target.value))}
                className="w-full border border-slate-300 rounded px-2 py-1 font-bold text-center"
              />
            </div>

            <div className="md:col-span-5">
              <label className="text-[11px] text-slate-600 block">Họ và tên ứng cử viên (*)</label>
              <input
                type="text"
                placeholder="Nhập họ và tên"
                value={inputFullName}
                onChange={e => setInputFullName(e.target.value)}
                className="w-full border border-slate-300 rounded px-2.5 py-1 font-bold uppercase"
              />
            </div>

            <div className="md:col-span-3">
              <label className="text-[11px] text-slate-600 block">Ngày tháng năm sinh</label>
              <input
                type="text"
                placeholder="Ví dụ: 13/10/1979"
                value={inputBirthDate}
                onChange={e => setInputBirthDate(e.target.value)}
                className="w-full border border-slate-300 rounded px-2 py-1"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-[11px] text-slate-600 block">Giới tính</label>
              <select
                value={inputGender}
                onChange={e => setInputGender(e.target.value)}
                className="w-full border border-slate-300 rounded px-2 py-1 font-semibold"
              >
                <option value="Ông">Ông</option>
                <option value="Bà">Bà</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-1">
            {editingId && (
              <button
                onClick={() => {
                  setEditingId(null);
                  setInputFullName('');
                  setInputBirthDate('');
                  setInputStt(localCandidates.length + 1);
                }}
                className="px-3 py-1 bg-slate-300 hover:bg-slate-400 text-slate-800 rounded font-bold"
              >
                Hủy bỏ
              </button>
            )}

            <button
              onClick={handleAddOrUpdate}
              className="px-4 py-1 bg-sky-700 hover:bg-sky-800 text-white rounded font-bold flex items-center space-x-1 shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{editingId ? 'Cập nhật' : 'Lưu vào danh sách'}</span>
            </button>
          </div>
        </div>

        {/* Candidate List Table */}
        <div className="bg-white border border-slate-300 rounded overflow-hidden shadow-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-200 text-slate-800 font-extrabold text-xs border-b border-slate-300">
                <th className="p-2 w-14 text-center">STT</th>
                <th className="p-2">HỌ VÀ TÊN ỨNG CỬ VIÊN</th>
                <th className="p-2 w-32 text-center">GIỚI TÍNH</th>
                <th className="p-2 w-36 text-center">NĂM SINH</th>
                <th className="p-2 w-28 text-center">THAO TÁC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {localCandidates.map(cand => (
                <tr key={cand.id} className="hover:bg-slate-50">
                  <td className="p-2 text-center font-bold">{cand.stt}</td>
                  <td className="p-2 font-bold uppercase text-slate-900">{cand.fullName}</td>
                  <td className="p-2 text-center">{cand.gender || 'Ông'}</td>
                  <td className="p-2 text-center">{cand.birthDate || cand.yearOfBirth || '-'}</td>
                  <td className="p-2 text-center space-x-1">
                    <button
                      onClick={() => handleEdit(cand)}
                      className="p-1 bg-slate-100 hover:bg-sky-100 text-sky-800 rounded border border-slate-300"
                      title="Sửa"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(cand.id)}
                      className="p-1 bg-slate-100 hover:bg-red-100 text-red-700 rounded border border-slate-300"
                      title="Xóa"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
