import React, { useState } from 'react';
import {
  Users,
  Search,
  CheckCircle2,
  XCircle,
  Plus,
  Filter,
  UserCheck,
  Upload,
  Edit2,
  Trash2,
  Trash,
  X,
  Activity,
  Sparkles,
} from 'lucide-react';
import { Voter } from '../types';
import * as XLSX from 'xlsx';

interface VoterManagementPageProps {
  voters: Voter[];
  toggleVoterStatus: (id: string) => void;
  addVoter: (voter: Omit<Voter, 'id' | 'stt'>) => void;
  updateVoter: (voter: Voter) => void;
  deleteVoter: (id: string) => void;
  clearAllVoters: () => void;
  importVotersBatch: (newVoters: Omit<Voter, 'id' | 'stt'>[]) => void;
}

export const VoterManagementPage: React.FC<VoterManagementPageProps> = ({
  voters,
  toggleVoterStatus,
  addVoter,
  updateVoter,
  deleteVoter,
  clearAllVoters,
  importVotersBatch,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVillage, setSelectedVillage] = useState<string>('ALL');
  const [filterVoted, setFilterVoted] = useState<'ALL' | 'VOTED' | 'NOT_VOTED'>('ALL');
  const [quickCardNoInput, setQuickCardNoInput] = useState('');

  // Non-blocking toast notification state (thay thế cho alert popup)
  const [toastMsg, setToastMsg] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Add / Edit Voter Modal State
  const [showVoterModal, setShowVoterModal] = useState(false);
  const [editingVoter, setEditingVoter] = useState<Voter | null>(null);
  const [voterCardNo, setVoterCardNo] = useState('');
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState('Nam');
  const [dob, setDob] = useState('01/01/1990');
  const [address, setAddress] = useState('Thôn An Trạch');

  const villages = Array.from(new Set(voters.map(v => v.address).filter(Boolean)));

  // Real-time statistics calculations
  const totalCount = voters.length;
  const votedCount = voters.filter(v => v.hasVoted).length;
  const remainingCount = totalCount - votedCount;

  const votedPctNum = totalCount > 0 ? (votedCount / totalCount) * 100 : 0;
  const remainingPctNum = totalCount > 0 ? (remainingCount / totalCount) * 100 : 0;

  const votedPct = votedPctNum.toFixed(2);
  const remainingPct = remainingPctNum.toFixed(2);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMsg({ text, type });
    setTimeout(() => {
      setToastMsg(null);
    }, 2500);
  };

  // Quick check-in by card number or STT (KHÔNG CÒN ALERT POPUP CHẶN MÀN HÌNH)
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
        showToast(`✅ Đã điểm danh thành công cử tri: ${matchedVoter.fullName} (${matchedVoter.address})`, 'success');
      } else {
        showToast(`ℹ️ Cử tri ${matchedVoter.fullName} đã bỏ phiếu trước đó (${matchedVoter.votedAt || ''})`, 'info');
      }
      setQuickCardNoInput('');
    } else {
      showToast(`⚠️ Không tìm thấy cử tri có mã thẻ/STT: "${cleanInput}"`, 'error');
    }
  };

  const handleOpenAddModal = () => {
    setEditingVoter(null);
    setVoterCardNo(`TC-21-${(voters.length + 1).toString().padStart(4, '0')}`);
    setFullName('');
    setGender('Nam');
    setDob('01/01/1990');
    setAddress('Thôn An Trạch');
    setShowVoterModal(true);
  };

  const handleOpenEditModal = (v: Voter) => {
    setEditingVoter(v);
    setVoterCardNo(v.voterCardNo);
    setFullName(v.fullName);
    setGender(v.gender || 'Nam');
    setDob(v.dob || '');
    setAddress(v.address || 'Thôn An Trạch');
    setShowVoterModal(true);
  };

  const handleSaveVoter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !voterCardNo.trim()) return;

    if (editingVoter) {
      updateVoter({
        ...editingVoter,
        voterCardNo,
        fullName,
        gender,
        dob,
        address,
      });
      showToast(`✅ Đã cập nhật thông tin cử tri: ${fullName}`, 'success');
    } else {
      addVoter({
        voterCardNo,
        fullName,
        gender,
        dob,
        address,
        hasVoted: false,
      });
      showToast(`✅ Đã thêm mới cử tri: ${fullName}`, 'success');
    }
    setShowVoterModal(false);
  };

  // EXCEL IMPORT METHOD
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = evt => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const rawRows = XLSX.utils.sheet_to_json<any[]>(ws, { header: 1, defval: '' });

        if (!rawRows || rawRows.length === 0) {
          showToast('⚠️ Tệp Excel rỗng hoặc không có dữ liệu cử tri.', 'error');
          return;
        }

        let headerRowIdx = -1;
        let nameColIdx = -1;
        let cardColIdx = -1;
        let genderColIdx = -1;
        let dobColIdx = -1;
        let addressColIdx = -1;

        for (let r = 0; r < Math.min(25, rawRows.length); r++) {
          const row = rawRows[r];
          if (!Array.isArray(row)) continue;

          for (let c = 0; c < row.length; c++) {
            const cellVal = row[c]?.toString().toLowerCase().trim() || '';
            if (cellVal.includes('họ') && cellVal.includes('tên')) {
              headerRowIdx = r;
              nameColIdx = c;
            } else if (cellVal === 'họ và tên' || cellVal === 'họ tên' || cellVal === 'cử tri' || cellVal === 'tên') {
              headerRowIdx = r;
              nameColIdx = c;
            }
          }

          if (headerRowIdx !== -1) {
            const headerRow = rawRows[headerRowIdx];
            for (let c = 0; c < headerRow.length; c++) {
              const val = headerRow[c]?.toString().toLowerCase().trim() || '';
              if (c !== nameColIdx) {
                if (val.includes('mã') || val.includes('thẻ') || val === 'stt' || val.includes('card')) {
                  cardColIdx = c;
                } else if (val.includes('giới') || val.includes('tính') || val === 'nam/nữ') {
                  genderColIdx = c;
                } else if (val.includes('sinh') || val.includes('dob')) {
                  dobColIdx = c;
                } else if (val.includes('địa chỉ') || val.includes('thôn') || val.includes('tổ') || val.includes('đơn vị') || val.includes('khu vực')) {
                  addressColIdx = c;
                }
              }
            }
            break;
          }
        }

        if (nameColIdx === -1) nameColIdx = 1;
        const startRow = headerRowIdx !== -1 ? headerRowIdx + 1 : 0;
        const newVotersBatch: Omit<Voter, 'id' | 'stt'>[] = [];

        for (let r = startRow; r < rawRows.length; r++) {
          const row = rawRows[r];
          if (!Array.isArray(row) || row.length === 0) continue;

          const rawName = row[nameColIdx]?.toString().trim() || '';
          if (!rawName || rawName.toLowerCase().includes('họ và tên') || rawName.toLowerCase().includes('danh sách') || rawName.toLowerCase().includes('tổng cộng')) {
            continue;
          }

          const rawCard = cardColIdx !== -1 && row[cardColIdx] ? row[cardColIdx].toString().trim() : '';
          const cardNo = rawCard || `TC-21-${(voters.length + newVotersBatch.length + 1).toString().padStart(4, '0')}`;
          const sex = genderColIdx !== -1 && row[genderColIdx] ? row[genderColIdx].toString().trim() : 'Nam';
          const birthday = dobColIdx !== -1 && row[dobColIdx] ? row[dobColIdx].toString().trim() : '';
          const addr = addressColIdx !== -1 && row[addressColIdx] ? row[addressColIdx].toString().trim() : 'Thôn An Trạch';

          newVotersBatch.push({
            voterCardNo: cardNo,
            fullName: rawName,
            gender: sex,
            dob: birthday,
            address: addr,
            hasVoted: false,
          });
        }

        if (newVotersBatch.length > 0) {
          importVotersBatch(newVotersBatch);
          showToast(`✅ Import thành công ${newVotersBatch.length} cử tri từ tệp Excel!`, 'success');
        } else {
          showToast('⚠️ Không nạp được dữ liệu cử tri. Vui lòng kiểm tra file Excel.', 'error');
        }
      } catch (err) {
        showToast('❌ Có lỗi xảy ra khi đọc tệp Excel.', 'error');
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = '';
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

  return (
    <div className="space-y-6">
      {/* Non-blocking Toast Banner Notification (Thay thế Popup Alert) */}
      {toastMsg && (
        <div
          className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between shadow-lg transition-all animate-bounce ${
            toastMsg.type === 'success'
              ? 'bg-emerald-600 text-white border-emerald-700'
              : toastMsg.type === 'info'
              ? 'bg-sky-600 text-white border-sky-700'
              : 'bg-rose-600 text-white border-rose-700'
          }`}
        >
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-300" />
            {toastMsg.text}
          </span>
          <button onClick={() => setToastMsg(null)} className="text-white hover:opacity-80 font-extrabold ml-4">
            ✕
          </button>
        </div>
      )}

      {/* Header & Quick Check-in Bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-3">
          <div>
            <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Users className="w-5 h-5 text-sky-600" />
              QUẢN LÝ CỬ TRI & ĐIỂM DANH BỎ PHIẾU
            </h1>
            <p className="text-xs text-slate-500">
              Quét thẻ cử tri để cập nhật tiến độ bỏ phiếu thời gian thực | Tỷ lệ đi bầu đạt {votedPct}%
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {voters.length > 0 && (
              <button
                onClick={() => {
                  if (confirm(`Bạn có chắc chắn muốn XÓA TẤT CẢ ${voters.length} cử tri hiện tại khỏi danh sách?`)) {
                    clearAllVoters();
                    showToast('✅ Đã xóa sạch toàn bộ danh sách cử tri.', 'info');
                  }
                }}
                className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors"
                title="Xóa toàn bộ danh sách cử tri"
              >
                <Trash className="w-4 h-4" />
                <span>Xóa sạch danh sách</span>
              </button>
            )}
            <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-2 rounded-lg border border-slate-300 flex items-center gap-1.5 transition-colors">
              <Upload className="w-4 h-4 text-slate-600" />
              <span>Import Excel</span>
              <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} className="hidden" />
            </label>
            <button
              onClick={handleOpenAddModal}
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

      {/* THANH THỐNG KÊ THỜI GIAN THỰC ĐÚNG THEO ẢNH MẪU */}
      <div className="bg-white p-5 rounded-xl border-2 border-sky-300 shadow-md space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h2 className="text-xs font-extrabold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-sky-600" />
            BÁO CÁO THỐNG KÊ CỬ TRI THEO THỜI GIAN THỰC (REAL-TIME PROGRESS)
          </h2>
          <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded border border-sky-200">
            Tổ Bầu Cử #21
          </span>
        </div>

        <div className="space-y-2 text-xs font-bold font-sans">
          {/* ROW 1: TỔNG SỐ CỬ TRI */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="w-full sm:w-60 text-slate-800 font-extrabold text-right uppercase tracking-wider pr-2">
              TỔNG SỐ CỬ TRI
            </div>
            <div className="flex-1 bg-sky-100/60 h-8 rounded border border-sky-300 relative overflow-hidden flex items-center shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-sky-500 via-sky-600 to-blue-600 transition-all duration-500 rounded-l"
                style={{ width: '100%' }}
              />
              <span className="absolute inset-0 flex items-center justify-center font-extrabold text-slate-900 text-sm tracking-widest drop-shadow-xs">
                {totalCount.toLocaleString('vi-VN')}
              </span>
            </div>
            <div className="w-full sm:w-24 bg-emerald-600 text-white font-mono font-extrabold text-center py-1.5 rounded border border-emerald-700 shadow-xs text-xs">
              100.00%
            </div>
          </div>

          {/* ROW 2: TỔNG SỐ CỬ TRI ĐÃ BỎ PHIẾU */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="w-full sm:w-60 text-emerald-700 font-extrabold text-right uppercase tracking-wider pr-2">
              TỔNG SỐ CỬ TRI ĐÃ BỎ PHIẾU
            </div>
            <div className="flex-1 bg-emerald-50 h-8 rounded border border-emerald-300 relative overflow-hidden flex items-center shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 transition-all duration-500 rounded-l"
                style={{ width: `${Math.min(100, votedPctNum)}%` }}
              />
              <span className="absolute inset-0 flex items-center justify-center font-extrabold text-emerald-950 text-sm tracking-widest drop-shadow-xs">
                {votedCount.toLocaleString('vi-VN')}
              </span>
            </div>
            <div className="w-full sm:w-24 bg-emerald-600 text-white font-mono font-extrabold text-center py-1.5 rounded border border-emerald-700 shadow-xs text-xs">
              {votedPct}%
            </div>
          </div>

          {/* ROW 3: TỔNG SỐ CỬ TRI CHƯA BỎ PHIẾU */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="w-full sm:w-60 text-rose-700 font-extrabold text-right uppercase tracking-wider pr-2">
              TỔNG SỐ CỬ TRI CHƯA BỎ PHIẾU
            </div>
            <div className="flex-1 bg-rose-50 h-8 rounded border border-rose-300 relative overflow-hidden flex items-center shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-sky-400 via-rose-500 to-rose-600 transition-all duration-500 rounded-l"
                style={{ width: `${Math.min(100, remainingPctNum)}%` }}
              />
              <span className="absolute inset-0 flex items-center justify-center font-extrabold text-rose-950 text-sm tracking-widest drop-shadow-xs">
                {remainingCount.toLocaleString('vi-VN')}
              </span>
            </div>
            <div className="w-full sm:w-24 bg-emerald-600 text-white font-mono font-extrabold text-center py-1.5 rounded border border-emerald-700 shadow-xs text-xs">
              {remainingPct}%
            </div>
          </div>
        </div>
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
                <th className="p-3.5 w-44 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVoters.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    Chưa có cử tri nào trong danh sách. Vui lòng bấm "+ Thêm cử tri mới" hoặc "Import Excel".
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
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => {
                            toggleVoterStatus(v.id);
                            if (!v.hasVoted) {
                              showToast(`✅ Đã điểm danh cử tri: ${v.fullName}`, 'success');
                            }
                          }}
                          className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                            v.hasVoted
                              ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
                          }`}
                        >
                          {v.hasVoted ? 'Hủy' : 'Bầu'}
                        </button>

                        <button
                          onClick={() => handleOpenEditModal(v)}
                          className="p-1 text-sky-600 hover:text-sky-800 hover:bg-sky-50 rounded"
                          title="Sửa cử tri"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`Xóa cử tri "${v.fullName}" khỏi danh sách?`)) {
                              deleteVoter(v.id);
                              showToast(`✅ Đã xóa cử tri: ${v.fullName}`, 'info');
                            }
                          }}
                          className="p-1 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded"
                          title="Xóa cử tri"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Voter Modal */}
      {showVoterModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="text-sm font-bold text-slate-800">
                {editingVoter ? 'SỬA THÔNG TIN CỬ TRI' : 'THÊM MỚI CỬ TRI'}
              </h3>
              <button onClick={() => setShowVoterModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveVoter} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Mã Thẻ Cử Tri:</label>
                <input
                  type="text"
                  required
                  value={voterCardNo}
                  onChange={e => setVoterCardNo(e.target.value)}
                  placeholder="TC-21-0008"
                  className="w-full p-2 border border-slate-300 rounded font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Họ và tên:</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="w-full p-2 border border-slate-300 rounded font-bold text-slate-800"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Giới tính:</label>
                  <select
                    value={gender}
                    onChange={e => setGender(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded font-medium"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Ngày sinh:</label>
                  <input
                    type="text"
                    value={dob}
                    onChange={e => setDob(e.target.value)}
                    placeholder="15/05/1980"
                    className="w-full p-2 border border-slate-300 rounded font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Địa chỉ / Thôn / Tổ:</label>
                <input
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Thôn An Trạch"
                  className="w-full p-2 border border-slate-300 rounded font-medium"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowVoterModal(false)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-sky-600 text-white rounded font-bold"
                >
                  {editingVoter ? 'Lưu thay đổi' : 'Thêm cử tri'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
