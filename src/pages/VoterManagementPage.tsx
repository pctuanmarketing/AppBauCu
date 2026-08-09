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
  Check,
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

  // Non-blocking toast notification state
  const [toastMsg, setToastMsg] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Add / Edit Voter Modal State
  const [showVoterModal, setShowVoterModal] = useState(false);
  const [editingVoter, setEditingVoter] = useState<Voter | null>(null);
  const [voterCardNo, setVoterCardNo] = useState('');
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState('Nam');
  const [dob, setDob] = useState('01/01/1990');
  const [idCard, setIdCard] = useState('');
  const [ethnicity, setEthnicity] = useState('Kinh');
  const [address, setAddress] = useState('Tổ 1, Thôn An Trạch, Xã Hòa Tiến, TP Đà Nẵng');

  // Checkboxes for 3 election levels
  const [eligibleQuocHoi, setEligibleQuocHoi] = useState(true);
  const [eligibleHdndTinh, setEligibleHdndTinh] = useState(true);
  const [eligibleHdndXa, setEligibleHdndXa] = useState(true);

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

  // Quick check-in by card number or STT
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
        showToast(`✅ Đã điểm danh thành công cử tri: ${matchedVoter.fullName}`, 'success');
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
    setVoterCardNo((voters.length + 1).toString());
    setFullName('');
    setGender('Nam');
    setDob('01/01/1990');
    setIdCard('048085001234');
    setEthnicity('Kinh');
    setAddress('Tổ 1, Thôn An Trạch, Xã Hòa Tiến, Thành Phố Đà Nẵng');
    setEligibleQuocHoi(true);
    setEligibleHdndTinh(true);
    setEligibleHdndXa(true);
    setShowVoterModal(true);
  };

  const handleOpenEditModal = (v: Voter) => {
    setEditingVoter(v);
    setVoterCardNo(v.voterCardNo);
    setFullName(v.fullName);
    setGender(v.gender || 'Nam');
    setDob(v.dob || '');
    setIdCard(v.idCard || '');
    setEthnicity(v.ethnicity || 'Kinh');
    setAddress(v.address || 'Tổ 1, Thôn An Trạch, Xã Hòa Tiến, TP Đà Nẵng');
    setEligibleQuocHoi(v.eligibleQuocHoi !== false);
    setEligibleHdndTinh(v.eligibleHdndTinh !== false);
    setEligibleHdndXa(v.eligibleHdndXa !== false);
    setShowVoterModal(true);
  };

  const handleToggleLevelFlag = (voter: Voter, flagKey: 'eligibleQuocHoi' | 'eligibleHdndTinh' | 'eligibleHdndXa') => {
    const updated = {
      ...voter,
      [flagKey]: !(voter[flagKey] !== false),
    };
    updateVoter(updated);
    showToast(`✅ Đã cập nhật quyền bầu cử cho: ${voter.fullName}`, 'info');
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
        idCard,
        ethnicity,
        address,
        eligibleQuocHoi,
        eligibleHdndTinh,
        eligibleHdndXa,
      });
      showToast(`✅ Đã cập nhật thông tin cử tri: ${fullName}`, 'success');
    } else {
      addVoter({
        voterCardNo,
        fullName,
        gender,
        dob,
        idCard,
        ethnicity,
        address,
        eligibleQuocHoi,
        eligibleHdndTinh,
        eligibleHdndXa,
        hasVoted: false,
      });
      showToast(`✅ Đã thêm mới cử tri: ${fullName}`, 'success');
    }
    setShowVoterModal(false);
  };

  // MULTI-ROW HEADER EXCEL PARSER MATCHING REFERENCE TEMPLATE
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
        let dobColIdx = -1;
        let maleColIdx = -1;
        let femaleColIdx = -1;
        let idCardColIdx = -1;
        let ethColIdx = -1;
        let addressColIdx = -1;
        let qhColIdx = -1;
        let tinhColIdx = -1;
        let xaColIdx = -1;

        for (let r = 0; r < Math.min(25, rawRows.length); r++) {
          const row = rawRows[r];
          if (!Array.isArray(row)) continue;

          for (let c = 0; c < row.length; c++) {
            const cellVal = row[c]?.toString().toLowerCase().trim() || '';
            if (cellVal.includes('họ') && cellVal.includes('tên')) {
              headerRowIdx = r;
              nameColIdx = c;
            }
          }

          if (headerRowIdx !== -1) {
            const headerRow = rawRows[headerRowIdx];
            for (let c = 0; c < headerRow.length; c++) {
              const val = headerRow[c]?.toString().toLowerCase().trim() || '';
              if (val.includes('thẻ') || val.includes('stt')) cardColIdx = c;
              if (val.includes('ngày') || val.includes('sinh') || val.includes('năm')) dobColIdx = c;
              if (val === 'nam') maleColIdx = c;
              if (val === 'nữ') femaleColIdx = c;
              if (val.includes('căn cước') || val.includes('cccd') || val.includes('cmnd')) idCardColIdx = c;
              if (val.includes('dân tộc')) ethColIdx = c;
              if (val.includes('cư trú') || val.includes('thường trú') || val.includes('địa chỉ')) addressColIdx = c;
              if (val.includes('quốc hội')) qhColIdx = c;
              if (val.includes('thành phố') || val.includes('tỉnh') || val.includes('đà nẵng')) tinhColIdx = c;
              if (val.includes('hòa tiến') || val.includes('xã')) xaColIdx = c;
            }
            break;
          }
        }

        if (nameColIdx === -1) nameColIdx = 2; // Default to Column C
        const startRow = headerRowIdx !== -1 ? headerRowIdx + 1 : 0;
        const newVotersBatch: Omit<Voter, 'id' | 'stt'>[] = [];

        for (let r = startRow; r < rawRows.length; r++) {
          const row = rawRows[r];
          if (!Array.isArray(row) || row.length === 0) continue;

          const rawName = row[nameColIdx]?.toString().trim() || '';
          if (!rawName || rawName.toLowerCase().includes('họ và tên') || rawName.toLowerCase().includes('danh sách') || rawName.toLowerCase().includes('tổng cộng')) {
            continue;
          }

          const cardNo = cardColIdx !== -1 && row[cardColIdx] ? row[cardColIdx].toString().trim() : (voters.length + newVotersBatch.length + 1).toString();
          const dobVal = dobColIdx !== -1 && row[dobColIdx] ? row[dobColIdx].toString().trim() : '';

          let genderVal = 'Nam';
          if (femaleColIdx !== -1 && row[femaleColIdx] && row[femaleColIdx].toString().trim() !== '') {
            genderVal = 'Nữ';
          } else if (maleColIdx !== -1 && row[maleColIdx] && row[maleColIdx].toString().trim() !== '') {
            genderVal = 'Nam';
          }

          const idCardVal = idCardColIdx !== -1 && row[idCardColIdx] ? row[idCardColIdx].toString().trim() : '';
          const ethVal = ethColIdx !== -1 && row[ethColIdx] ? row[ethColIdx].toString().trim() : 'Kinh';
          const addrVal = addressColIdx !== -1 && row[addressColIdx] ? row[addressColIdx].toString().trim() : 'Tổ 1, Thôn An Trạch, Xã Hòa Tiến, TP Đà Nẵng';

          const elQH = qhColIdx !== -1 ? row[qhColIdx]?.toString().toLowerCase().trim() !== '' : true;
          const elTinh = tinhColIdx !== -1 ? row[tinhColIdx]?.toString().toLowerCase().trim() !== '' : true;
          const elXa = xaColIdx !== -1 ? row[xaColIdx]?.toString().toLowerCase().trim() !== '' : true;

          newVotersBatch.push({
            voterCardNo: cardNo,
            fullName: rawName,
            gender: genderVal,
            dob: dobVal,
            idCard: idCardVal,
            ethnicity: ethVal,
            address: addrVal,
            eligibleQuocHoi: elQH,
            eligibleHdndTinh: elTinh,
            eligibleHdndXa: elXa,
            hasVoted: false,
          });
        }

        if (newVotersBatch.length > 0) {
          importVotersBatch(newVotersBatch);
          showToast(`✅ Import thành công ${newVotersBatch.length} cử tri từ file Excel!`, 'success');
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
      v.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.idCard && v.idCard.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchVillage = selectedVillage === 'ALL' || v.address.includes(selectedVillage);

    const matchVoted =
      filterVoted === 'ALL' ||
      (filterVoted === 'VOTED' && v.hasVoted) ||
      (filterVoted === 'NOT_VOTED' && !v.hasVoted);

    return matchSearch && matchVillage && matchVoted;
  });

  return (
    <div className="space-y-6">
      {/* Non-blocking Toast Banner */}
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
              QUẢN LÝ CỬ TRI & ĐIỂM DANH BỎ PHIẾU (DANH SÁCH BẦU 2 & 3 CẤP)
            </h1>
            <p className="text-xs text-slate-500">
              Điểm danh cử tri theo mã thẻ/STT | Tích chọn quyền bỏ phiếu ĐBQH, HĐND Tỉnh, HĐND Xã
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
            placeholder="Nhập/Quét Số thẻ Cử Tri hoặc STT (VD: 1, 2, 3...)..."
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

      {/* THANH THỐNG KÊ THỜI GIAN THỰC */}
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
              <div className="h-full bg-gradient-to-r from-sky-500 via-sky-600 to-blue-600 transition-all duration-500 rounded-l" style={{ width: '100%' }} />
              <span className="absolute inset-0 flex items-center justify-center font-extrabold text-slate-900 text-sm tracking-widest">
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
              <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 transition-all duration-500 rounded-l" style={{ width: `${Math.min(100, votedPctNum)}%` }} />
              <span className="absolute inset-0 flex items-center justify-center font-extrabold text-emerald-950 text-sm tracking-widest">
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
              <div className="h-full bg-gradient-to-r from-sky-400 via-rose-500 to-rose-600 transition-all duration-500 rounded-l" style={{ width: `${Math.min(100, remainingPctNum)}%` }} />
              <span className="absolute inset-0 flex items-center justify-center font-extrabold text-rose-950 text-sm tracking-widest">
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
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên cử tri, số thẻ, số CCCD, địa chỉ..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/30"
          />
        </div>

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

      {/* OFFICIAL VOTER LIST TABLE (DANH SÁCH CỬ TRI CHUẨN MẪU) */}
      <div className="bg-white rounded-xl border-2 border-slate-700 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#1e3a8a] text-white font-extrabold text-center border-b-2 border-slate-800 uppercase tracking-tight">
              <tr>
                <th rowSpan={2} className="p-2.5 w-12 border-r border-blue-900">Số TT</th>
                <th rowSpan={2} className="p-2.5 w-16 border-r border-blue-900">Số thẻ Cử tri</th>
                <th rowSpan={2} className="p-2.5 border-r border-blue-900 text-left">Họ và Tên</th>
                <th rowSpan={2} className="p-2.5 w-24 border-r border-blue-900">Ngày tháng năm sinh</th>
                <th rowSpan={2} className="p-2.5 w-10 border-r border-blue-900">Nam</th>
                <th rowSpan={2} className="p-2.5 w-10 border-r border-blue-900">Nữ</th>
                <th rowSpan={2} className="p-2.5 w-28 border-r border-blue-900">Số Căn cước</th>
                <th rowSpan={2} className="p-2.5 w-16 border-r border-blue-900">Dân tộc</th>
                <th rowSpan={2} className="p-2.5 border-r border-blue-900 text-left">NƠI CƯ TRÚ (Thường trú)</th>
                <th rowSpan={2} className="p-2.5 w-20 border-r border-blue-900 bg-blue-950">
                  Bầu cử ĐB Quốc Hội
                </th>
                <th colSpan={2} className="p-1.5 border-b border-blue-900 bg-blue-950">
                  Bầu cử đại biểu HĐND
                </th>
                <th rowSpan={2} className="p-2.5 w-32 border-l border-blue-900">Trạng thái & Thao tác</th>
              </tr>
              <tr>
                <th className="p-1.5 w-24 border-r border-blue-900 bg-blue-950">TP Đà Nẵng</th>
                <th className="p-1.5 w-24 border-r border-blue-900 bg-blue-950">Xã Hòa Tiến</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-300 font-medium">
              {filteredVoters.length === 0 ? (
                <tr>
                  <td colSpan={13} className="p-8 text-center text-slate-400">
                    Chưa có cử tri nào trong danh sách. Vui lòng bấm "+ Thêm cử tri mới" hoặc "Import Excel".
                  </td>
                </tr>
              ) : (
                filteredVoters.map((v, idx) => {
                  const isMale = v.gender === 'Nam';
                  const isFemale = v.gender === 'Nữ';
                  const isQH = v.eligibleQuocHoi !== false;
                  const isTinh = v.eligibleHdndTinh !== false;
                  const isXa = v.eligibleHdndXa !== false;

                  return (
                    <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-2 text-center font-bold text-slate-600 border-r border-slate-200">
                        {v.stt.toString().padStart(2, '0')}
                      </td>
                      <td className="p-2 text-center font-mono font-bold text-sky-900 border-r border-slate-200">
                        {v.voterCardNo}
                      </td>
                      <td className="p-2 font-bold text-slate-900 text-xs border-r border-slate-200 uppercase">
                        {v.fullName}
                      </td>
                      <td className="p-2 text-center font-mono text-slate-600 border-r border-slate-200">
                        {v.dob}
                      </td>
                      <td className="p-2 text-center font-extrabold text-slate-800 border-r border-slate-200">
                        {isMale ? 'x' : ''}
                      </td>
                      <td className="p-2 text-center font-extrabold text-slate-800 border-r border-slate-200">
                        {isFemale ? 'x' : ''}
                      </td>
                      <td className="p-2 text-center font-mono text-slate-700 text-[11px] border-r border-slate-200">
                        {v.idCard || '048*******888'}
                      </td>
                      <td className="p-2 text-center text-slate-700 border-r border-slate-200">
                        {v.ethnicity || 'Kinh'}
                      </td>
                      <td className="p-2 text-slate-700 text-[11px] border-r border-slate-200">
                        {v.address}
                      </td>

                      {/* Interactive Level Checkboxes */}
                      <td className="p-2 text-center border-r border-slate-200 bg-sky-50/40">
                        <button
                          onClick={() => handleToggleLevelFlag(v, 'eligibleQuocHoi')}
                          className={`w-6 h-6 rounded border font-bold text-xs inline-flex items-center justify-center transition-all ${
                            isQH ? 'bg-sky-600 text-white border-sky-700 shadow-xs' : 'bg-white text-slate-300 border-slate-300'
                          }`}
                          title="Tích chọn/Bỏ chọn bầu cử ĐB Quốc hội"
                        >
                          {isQH ? 'x' : ''}
                        </button>
                      </td>

                      <td className="p-2 text-center border-r border-slate-200 bg-sky-50/40">
                        <button
                          onClick={() => handleToggleLevelFlag(v, 'eligibleHdndTinh')}
                          className={`w-6 h-6 rounded border font-bold text-xs inline-flex items-center justify-center transition-all ${
                            isTinh ? 'bg-sky-600 text-white border-sky-700 shadow-xs' : 'bg-white text-slate-300 border-slate-300'
                          }`}
                          title="Tích chọn/Bỏ chọn bầu cử ĐB HĐND TP Đà Nẵng"
                        >
                          {isTinh ? 'x' : ''}
                        </button>
                      </td>

                      <td className="p-2 text-center border-r border-slate-200 bg-sky-50/40">
                        <button
                          onClick={() => handleToggleLevelFlag(v, 'eligibleHdndXa')}
                          className={`w-6 h-6 rounded border font-bold text-xs inline-flex items-center justify-center transition-all ${
                            isXa ? 'bg-sky-600 text-white border-sky-700 shadow-xs' : 'bg-white text-slate-300 border-slate-300'
                          }`}
                          title="Tích chọn/Bỏ chọn bầu cử ĐB HĐND Xã Hòa Tiến"
                        >
                          {isXa ? 'x' : ''}
                        </button>
                      </td>

                      {/* Check-in & Actions */}
                      <td className="p-2 text-center">
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
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300'
                                : 'bg-sky-600 text-white hover:bg-sky-700 shadow-xs'
                            }`}
                          >
                            {v.hasVoted ? 'Đã bầu' : 'Điểm danh'}
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
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Voter Modal */}
      {showVoterModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="text-sm font-bold text-slate-800 uppercase">
                {editingVoter ? 'SỬA THÔNG TIN CỬ TRI' : 'THÊM MỚI CỬ TRI'}
              </h3>
              <button onClick={() => setShowVoterModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveVoter} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Số Thẻ Cử Tri:</label>
                  <input
                    type="text"
                    required
                    value={voterCardNo}
                    onChange={e => setVoterCardNo(e.target.value)}
                    placeholder="1, 2, 3..."
                    className="w-full p-2 border border-slate-300 rounded font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Họ và Tên:</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="ĐẶNG HUY TƯỜNG"
                    className="w-full p-2 border border-slate-300 rounded font-bold text-slate-800 uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
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
                  <label className="block text-slate-600 font-semibold mb-1">Ngày tháng năm sinh:</label>
                  <input
                    type="text"
                    value={dob}
                    onChange={e => setDob(e.target.value)}
                    placeholder="13/01/2005"
                    className="w-full p-2 border border-slate-300 rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Dân tộc:</label>
                  <input
                    type="text"
                    value={ethnicity}
                    onChange={e => setEthnicity(e.target.value)}
                    placeholder="Kinh"
                    className="w-full p-2 border border-slate-300 rounded font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Số Căn cước (CCCD):</label>
                <input
                  type="text"
                  value={idCard}
                  onChange={e => setIdCard(e.target.value)}
                  placeholder="048*******698"
                  className="w-full p-2 border border-slate-300 rounded font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">NƠI CƯ TRÚ (Thường trú):</label>
                <input
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Tổ 1, Thôn An Trạch, Xã Hòa Tiến, Thành Phố Đà Nẵng"
                  className="w-full p-2 border border-slate-300 rounded font-medium"
                />
              </div>

              {/* Checklist Cấp Bầu Cử Được Bầu */}
              <div className="p-3 bg-sky-50 rounded-lg border border-sky-200 space-y-2">
                <label className="block text-sky-900 font-bold">CÁC CẤP BẦU CỬ CỬ TRI THAM GIA BỎ PHIẾU:</label>
                <div className="space-y-1.5 pl-1">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={eligibleQuocHoi}
                      onChange={e => setEligibleQuocHoi(e.target.checked)}
                      className="w-4 h-4 text-sky-600 rounded"
                    />
                    <span>Bầu cử Đại biểu Quốc Hội</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={eligibleHdndTinh}
                      onChange={e => setEligibleHdndTinh(e.target.checked)}
                      className="w-4 h-4 text-sky-600 rounded"
                    />
                    <span>Bầu cử đại biểu HĐND Thành phố Đà Nẵng</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={eligibleHdndXa}
                      onChange={e => setEligibleHdndXa(e.target.checked)}
                      className="w-4 h-4 text-sky-600 rounded"
                    />
                    <span>Bầu cử đại biểu HĐND Xã Hòa Tiến</span>
                  </label>
                </div>
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
