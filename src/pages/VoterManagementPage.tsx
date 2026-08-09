import React, { useState } from 'react';
import {
  Users,
  Search,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
  Plus,
  Filter,
  UserCheck,
  Building,
  Upload,
} from 'lucide-react';
import { Voter } from '../types';
import * as XLSX from 'xlsx';

interface VoterManagementPageProps {
  voters: Voter[];
  toggleVoterStatus: (id: string) => void;
  addVoter: (voter: Omit<Voter, 'id' | 'stt'>) => void;
}

export const VoterManagementPage: React.FC<VoterManagementPageProps> = ({
  voters,
  toggleVoterStatus,
  addVoter,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVillage, setSelectedVillage] = useState<string>('ALL');
  const [filterVoted, setFilterVoted] = useState<'ALL' | 'VOTED' | 'NOT_VOTED'>('ALL');
  const [quickCardNoInput, setQuickCardNoInput] = useState('');

  // Add voter modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newVoterCardNo, setNewVoterCardNo] = useState('');
  const [newFullName, setNewFullName] = useState('');
  const [newGender, setNewGender] = useState('Nam');
  const [newDob, setNewDob] = useState('01/01/1990');
  const [newAddress, setNewAddress] = useState('Thôn An Trạch');

  const villages = Array.from(new Set(voters.map(v => v.address)));

  // Quick check-in by card number
  const handleQuickCheckinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = quickCardNoInput.trim().toUpperCase();
    if (!cleanInput) return;

    const matchedVoter = voters.find(
      v => v.voterCardNo.toUpperCase() === cleanInput || v.stt.toString() === cleanInput
    );

    if (matchedVoter) {
      if (!matchedVoter.hasVoted) {
        toggleVoterStatus(matchedVoter.id);
        alert(`✅ Đã điểm danh thành công cử tri: ${matchedVoter.fullName} (${matchedVoter.address})`);
      } else {
        alert(`ℹ️ Cử tri ${matchedVoter.fullName} đã bỏ phiếu trước đó vào lúc ${matchedVoter.votedAt || ''}`);
      }
      setQuickCardNoInput('');
    } else {
      alert(`⚠️ Không tìm thấy cử tri có mã thẻ hoặc STT: "${cleanInput}"`);
    }
  };

  const handleCreateVoter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName || !newVoterCardNo) return;
    addVoter({
      voterCardNo: newVoterCardNo,
      fullName: newFullName,
      gender: newGender,
      dob: newDob,
      address: newAddress,
      hasVoted: false,
    });
    setShowAddModal(false);
    setNewFullName('');
    setNewVoterCardNo('');
  };

  // Import Excel Voters
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json<any>(ws);

        data.forEach((row, idx) => {
          const cardNo = row['Mã thẻ'] || row['STT'] || `TC-21-${(voters.length + idx + 1).toString().padStart(4, '0')}`;
          const name = row['Họ tên'] || row['Họ và tên'] || row['Name'];
          if (name) {
            addVoter({
              voterCardNo: cardNo.toString(),
              fullName: name.toString(),
              gender: row['Giới tính'] || 'Nam',
              dob: row['Ngày sinh'] || '01/01/1985',
              address: row['Địa chỉ'] || row['Thôn'] || 'Thôn An Trạch',
              hasVoted: false,
            });
          }
        });
        alert(`✅ Import thành công ${data.length} cử tri từ file Excel!`);
      } catch (err) {
        alert('❌ Có lỗi xảy ra khi đọc file Excel cử tri.');
      }
    };
    reader.readAsBinaryString(file);
  };

  // Filtered Voters List
  const filteredVoters = voters.filter(v => {
    const matchSearch =
      v.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.voterCardNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.address.toLowerCase().includes(searchTerm.toLowerCase());

    const matchVillage = selectedVillage === 'ALL' || v.address === selectedVillage;

    const matchVoted =
      filterVoted === 'ALL' ||
      (filterVoted === 'VOTED' && v.hasVoted) ||
      (filterVoted === 'NOT_VOTED' && !v.hasVoted);

    return matchSearch && matchVillage && matchVoted;
  });

  const totalCount = voters.length;
  const votedCount = voters.filter(v => v.hasVoted).length;

  return (
    <div className="space-y-6">
      {/* Header & Quick Check-in Bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-3">
          <div>
            <h1 className="text-lg font-bold text-slate-800">QUẢN LÝ CỬ TRI & ĐIỂM DANH BỎ PHIẾU</h1>
            <p className="text-xs text-slate-500">
              Quét thẻ cử tri để cập nhật tiến độ bỏ phiếu thời gian thực | Đã đi bầu {votedCount} / {totalCount} cử tri (
              {totalCount > 0 ? ((votedCount / totalCount) * 100).toFixed(1) : 0}%)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-2 rounded-lg border border-slate-300 flex items-center gap-1.5 transition-colors">
              <Upload className="w-4 h-4 text-slate-600" />
              <span>Import Excel</span>
              <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} className="hidden" />
            </label>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" />
              Thêm cử tri mới
            </button>
          </div>
        </div>

        {/* Quick Card Check-in Form */}
        <form onSubmit={handleQuickCheckinSubmit} className="bg-sky-50/80 p-3 rounded-lg border border-sky-200 flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center gap-2 text-sky-900 font-bold text-xs">
            <UserCheck className="w-4 h-4 text-sky-600" />
            <span>ĐIỂM DANH THẺ CỬ TRI KHU VỰC:</span>
          </div>
          <input
            type="text"
            value={quickCardNoInput}
            onChange={e => setQuickCardNoInput(e.target.value)}
            placeholder="Nhập/Quét Mã Thẻ Cử Tri (VD: TC-21-0001)..."
            className="flex-1 px-3 py-1.5 bg-white border border-sky-300 rounded-md text-xs focus:ring-2 focus:ring-sky-500 outline-none font-mono"
          />
          <button
            type="submit"
            className="w-full sm:w-auto px-4 py-1.5 bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold rounded-md shadow"
          >
            XÁC NHẬN BỎ PHIẾU
          </button>
        </form>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên cử tri, mã thẻ, địa chỉ..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/30"
          />
        </div>

        {/* Village & Status dropdown filters */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-semibold text-slate-600">Thôn/Tổ:</span>
            <select
              value={selectedVillage}
              onChange={e => setSelectedVillage(e.target.value)}
              className="p-1.5 bg-slate-50 border border-slate-200 rounded-md font-medium text-slate-700"
            >
              <option value="ALL">Tất cả thôn/tổ ({voters.length})</option>
              {villages.map(v => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-600">Trạng thái:</span>
            <select
              value={filterVoted}
              onChange={e => setFilterVoted(e.target.value as any)}
              className="p-1.5 bg-slate-50 border border-slate-200 rounded-md font-medium text-slate-700"
            >
              <option value="ALL">Tất cả cử tri</option>
              <option value="VOTED">Đã bỏ phiếu ({votedCount})</option>
              <option value="NOT_VOTED">Chưa bỏ phiếu ({totalCount - votedCount})</option>
            </select>
          </div>
        </div>
      </div>

      {/* Voter Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200">
              <tr>
                <th className="p-3.5 w-12 text-center">STT</th>
                <th className="p-3.5">Mã Thẻ Cử Tri</th>
                <th className="p-3.5">Họ và tên</th>
                <th className="p-3.5 w-20 text-center">Giới tính</th>
                <th className="p-3.5 w-28 text-center">Ngày sinh</th>
                <th className="p-3.5">Địa chỉ / Thôn</th>
                <th className="p-3.5 w-36 text-center">Trạng thái đi bầu</th>
                <th className="p-3.5 w-28 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVoters.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    Không tìm thấy cử tri nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                filteredVoters.map(v => (
                  <tr key={v.id} className="hover:bg-slate-50">
                    <td className="p-3.5 text-center font-bold text-slate-500">{v.stt}</td>
                    <td className="p-3.5 font-mono font-bold text-sky-800">{v.voterCardNo}</td>
                    <td className="p-3.5 font-bold text-slate-800 text-sm">{v.fullName}</td>
                    <td className="p-3.5 text-center text-slate-600">{v.gender}</td>
                    <td className="p-3.5 text-center font-mono text-slate-600">{v.dob}</td>
                    <td className="p-3.5 text-slate-700 font-medium">{v.address}</td>
                    <td className="p-3.5 text-center">
                      {v.hasVoted ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-1 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Đã bầu ({v.votedAt || '---'})
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-[11px] font-bold px-2.5 py-1 rounded-full">
                          <XCircle className="w-3.5 h-3.5 text-amber-600" />
                          Chưa đi bầu
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => toggleVoterStatus(v.id)}
                        className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                          v.hasVoted
                            ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
                        }`}
                      >
                        {v.hasVoted ? 'Hủy đánh dấu' : 'Điểm danh ngay'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Voter Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-800 border-b pb-2">THÊM MỚI CỬ TRI</h3>
            <form onSubmit={handleCreateVoter} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Mã Thẻ Cử Tri:</label>
                <input
                  type="text"
                  required
                  value={newVoterCardNo}
                  onChange={e => setNewVoterCardNo(e.target.value)}
                  placeholder="TC-21-0008"
                  className="w-full p-2 border border-slate-300 rounded font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Họ và tên:</label>
                <input
                  type="text"
                  required
                  value={newFullName}
                  onChange={e => setNewFullName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="w-full p-2 border border-slate-300 rounded"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Giới tính:</label>
                  <select
                    value={newGender}
                    onChange={e => setNewGender(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Ngày sinh:</label>
                  <input
                    type="text"
                    value={newDob}
                    onChange={e => setNewDob(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Địa chỉ / Thôn:</label>
                <input
                  type="text"
                  value={newAddress}
                  onChange={e => setNewAddress(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-sky-600 text-white rounded font-bold"
                >
                  Thêm mới
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
