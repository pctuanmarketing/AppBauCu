import React, { useState, useEffect } from 'react';
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
  Building2,
  ShieldCheck,
  Vote,
  Clock,
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

  const [liveTime, setLiveTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setLiveTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = liveTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateString = liveTime.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

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

  // 1. Tính toán số cử tri bầu 3 cấp và cử tri bầu 2 cấp
  const voters3Levels = voters.filter(
    v => (v.eligibleQuocHoi !== false) && (v.eligibleHdndTinh !== false) && (v.eligibleHdndXa !== false)
  ).length;

  const voters2Levels = voters.filter(v => {
    const count = [v.eligibleQuocHoi !== false, v.eligibleHdndTinh !== false, v.eligibleHdndXa !== false].filter(Boolean).length;
    return count === 2;
  }).length;

  // 2. Thống kê cử tri đi bầu tương ứng cho từng cấp bầu cử
  const totalQuocHoi = voters.filter(v => v.eligibleQuocHoi !== false).length;
  const votedQuocHoi = voters.filter(v => v.hasVoted && (v.eligibleQuocHoi !== false)).length;
  const pctQuocHoi = totalQuocHoi > 0 ? ((votedQuocHoi / totalQuocHoi) * 100).toFixed(2) : '0.00';

  const totalHdndTinh = voters.filter(v => v.eligibleHdndTinh !== false).length;
  const votedHdndTinh = voters.filter(v => v.hasVoted && (v.eligibleHdndTinh !== false)).length;
  const pctHdndTinh = totalHdndTinh > 0 ? ((votedHdndTinh / totalHdndTinh) * 100).toFixed(2) : '0.00';

  const totalHdndXa = voters.filter(v => v.eligibleHdndXa !== false).length;
  const votedHdndXa = voters.filter(v => v.hasVoted && (v.eligibleHdndXa !== false)).length;
  const pctHdndXa = totalHdndXa > 0 ? ((votedHdndXa / totalHdndXa) * 100).toFixed(2) : '0.00';

  // Validation Alert Box State
  const [checkinAlert, setCheckinAlert] = useState<{ title: string; message: string; type: 'success' | 'warning' | 'error' | 'duplicate' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMsg({ text, type });
    setTimeout(() => {
      setToastMsg(null);
    }, 2500);
  };

  // Strict quick check-in validation algorithm with clean short alerts
  const handleQuickCheckinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = quickCardNoInput.trim().toUpperCase();
    if (!cleanInput) {
      setCheckinAlert({
        title: '⚠️ Chưa nhập mã',
        message: 'Vui lòng nhập Số thẻ hoặc STT cử tri để điểm danh.',
        type: 'warning',
      });
      return;
    }

    // Search matching voter by voterCardNo or STT
    const matchedVoter = voters.find(
      v => v.voterCardNo.toUpperCase() === cleanInput || v.stt.toString() === cleanInput
    );

    // Rule 1: CHỈ ĐIỂM DANH KHIN SỐ THẺ CÓ TRONG DANH SÁCH
    if (!matchedVoter) {
      setCheckinAlert({
        title: '⛔ Không tìm thấy cử tri',
        message: `Mã thẻ/STT "${cleanInput}" không có trong danh sách chính thức!`,
        type: 'error',
      });
      showToast(`⛔ Mã "${cleanInput}" không có trong danh sách!`, 'error');
      return;
    }

    // Rule 2: KHÔNG ĐƯỢC ĐIỂM DANH TRÙNG LẶP
    if (matchedVoter.hasVoted) {
      setCheckinAlert({
        title: '⛔ Cảnh báo: Đã đi bầu trước đó!',
        message: `Cử tri ${matchedVoter.fullName} (Thẻ: ${matchedVoter.voterCardNo}) đã điểm danh rồi.`,
        type: 'duplicate',
      });
      showToast(`⛔ Cử tri ${matchedVoter.fullName} đã bỏ phiếu rồi!`, 'error');
      return;
    }

    // Rule 3: ĐIỂM DANH THÀNH CÔNG
    toggleVoterStatus(matchedVoter.id);
    const nowTime = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    setCheckinAlert({
      title: '✅ Ghi nhận điểm danh thành công!',
      message: `Cử tri: ${matchedVoter.fullName} • Mã thẻ: ${matchedVoter.voterCardNo} • Thời gian: ${nowTime}`,
      type: 'success',
    });
    showToast(`✅ Đã điểm danh: ${matchedVoter.fullName}`, 'success');
    setQuickCardNoInput('');
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

  // MULTI-ROW HEADER EXCEL PARSER
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

        if (nameColIdx === -1) nameColIdx = 2;
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
          showToast(`✅ Import thành công ${newVotersBatch.length} cử tri từ tệp Excel!`, 'success');
        } else {
          showToast('⚠️ Không nạp được dữ liệu cử tri. Vui lòng kiểm tra tệp Excel.', 'error');
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
      {/* Toast Banner Notification */}
      {toastMsg && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-bold flex items-center justify-between shadow-xl transition-all duration-300 transform animate-slide-down ${
            toastMsg.type === 'success'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white border-emerald-500'
              : toastMsg.type === 'info'
              ? 'bg-gradient-to-r from-sky-600 to-blue-700 text-white border-sky-500'
              : 'bg-gradient-to-r from-rose-600 to-red-700 text-white border-rose-500'
          }`}
        >
          <span className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
            {toastMsg.text}
          </span>
          <button onClick={() => setToastMsg(null)} className="text-white/80 hover:text-white font-extrabold text-sm ml-4">
            ✕
          </button>
        </div>
      )}

      {/* Modern Header & Quick Check-in Module */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-md">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-extrabold text-slate-900 tracking-tight">
                  QUẢN LÝ CỬ TRI & ĐIỂM DANH BỎ PHIẾU
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  Danh sách cử tri chính thức bầu 2 & 3 cấp | Tỷ lệ cử tri đi bầu toàn khu vực: <strong className="text-sky-700 font-bold">{votedPct}%</strong>
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {voters.length > 0 && (
              <button
                onClick={() => {
                  if (confirm(`Bạn có chắc chắn muốn XÓA TẤT CẢ ${voters.length} cử tri hiện tại khỏi danh sách?`)) {
                    clearAllVoters();
                    showToast('✅ Đã xóa sạch toàn bộ danh sách cử tri.', 'info');
                  }
                }}
                className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/80 text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-2xs hover:shadow-xs"
                title="Xóa toàn bộ danh sách cử tri"
              >
                <Trash className="w-4 h-4" />
                <span>Xóa sạch danh sách</span>
              </button>
            )}
            <label className="cursor-pointer bg-slate-100/80 hover:bg-slate-200/80 text-slate-700 text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-300/80 flex items-center gap-1.5 transition-all shadow-2xs">
              <Upload className="w-4 h-4 text-slate-600" />
              <span>Import Excel</span>
              <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} className="hidden" />
            </label>
            <button
              onClick={handleOpenAddModal}
              className="bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white text-xs font-extrabold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-sky-600/20 transition-all transform hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              Thêm cử tri mới
            </button>
          </div>
        </div>

        {/* Rapid Check-in Scanner Bar */}
        <form onSubmit={handleQuickCheckinSubmit} className="bg-gradient-to-r from-sky-50 via-indigo-50/40 to-sky-50 p-4 rounded-xl border border-sky-200/80 flex flex-col sm:flex-row items-center gap-3 shadow-inner">
          <div className="flex items-center gap-2.5 text-sky-950 font-extrabold text-xs shrink-0">
            <div className="w-7 h-7 rounded-lg bg-sky-600 text-white flex items-center justify-center shadow-xs">
              <UserCheck className="w-4 h-4" />
            </div>
            <span>ĐIỂM DANH THẺ CỬ TRI BẰNG MÃ/STT:</span>
          </div>
          <input
            type="text"
            value={quickCardNoInput}
            onChange={e => setQuickCardNoInput(e.target.value)}
            placeholder="Nhập/Quét Số thẻ Cử Tri hoặc STT (VD: 1, 2, 3...)..."
            className="flex-1 px-4 py-2 bg-white border border-sky-300/80 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none font-mono font-bold text-slate-900 shadow-2xs transition-all"
          />
          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-2 bg-sky-700 hover:bg-sky-800 text-white text-xs font-extrabold rounded-xl shadow-md transition-all active:scale-95 shrink-0"
          >
            XÁC NHẬN BỎ PHIẾU
          </button>
        </form>

        {/* Live Validation Alert Feedback Box */}
        {checkinAlert && (
          <div className={`p-3 rounded-xl text-xs flex items-center justify-between shadow-sm transition-all border ${
            checkinAlert.type === 'success'
              ? 'bg-emerald-50 text-emerald-950 border-emerald-300'
              : checkinAlert.type === 'duplicate'
              ? 'bg-rose-50 text-rose-950 border-rose-300 animate-pulse'
              : checkinAlert.type === 'error'
              ? 'bg-amber-50 text-amber-950 border-amber-300'
              : 'bg-sky-50 text-sky-950 border-sky-300'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`p-1.5 rounded-lg shrink-0 ${
                checkinAlert.type === 'success' ? 'bg-emerald-200/60 text-emerald-800' :
                checkinAlert.type === 'duplicate' ? 'bg-rose-200/60 text-rose-800' :
                checkinAlert.type === 'error' ? 'bg-amber-200/60 text-amber-800' : 'bg-sky-200/60 text-sky-800'
              }`}>
                {checkinAlert.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> :
                 checkinAlert.type === 'duplicate' ? <XCircle className="w-4 h-4" /> :
                 checkinAlert.type === 'error' ? <XCircle className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
              </div>
              <div className="space-y-0.5">
                <div className="font-extrabold text-xs tracking-tight">{checkinAlert.title}</div>
                <div className="text-[11px] font-medium opacity-90">{checkinAlert.message}</div>
              </div>
            </div>
            <button
              onClick={() => setCheckinAlert(null)}
              className="text-slate-400 hover:text-slate-700 text-xs font-black p-1 hover:bg-black/5 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* THANH THỐNG KÊ THỜI GIAN THỰC (EXCEL SPEC BAR DESIGN) */}
      <div className="bg-white p-5 rounded-2xl border-2 border-sky-300 shadow-md space-y-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-3 gap-2">
          <div className="space-y-0.5">
            <h2 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <Activity className="w-4 h-4 text-sky-600 animate-pulse" />
              <span>BÁO CÁO THỐNG KÊ CỬ TRI THEO THỜI GIAN THỰC (REAL-TIME PROGRESS)</span>
            </h2>
            <div className="text-[11px] text-slate-500 font-medium flex items-center gap-2">
              <span className="flex items-center gap-1 font-mono text-sky-800 font-bold">
                <Clock className="w-3.5 h-3.5 text-sky-600" />
                Cập nhật thời gian thực: {timeString} - {dateString}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-emerald-800 bg-emerald-50 border border-emerald-300 px-3.5 py-1.5 rounded-xl shadow-2xs flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>ĐÃ ĐI BẦU ĐẾN THỜI ĐIỂM HIỆN TẠI: {votedCount.toLocaleString('vi-VN')} / {totalCount.toLocaleString('vi-VN')} CỬ TRI ({votedPct}%)</span>
            </span>
          </div>
        </div>

        <div className="space-y-2.5 text-xs font-bold font-sans">
          {/* ROW 1: TỔNG SỐ CỬ TRI */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="w-full sm:w-64 text-slate-800 font-extrabold text-right uppercase tracking-wider pr-2">
              TỔNG SỐ CỬ TRI
            </div>
            <div className="flex-1 bg-sky-100/60 h-9 rounded-lg border border-sky-300 relative overflow-hidden flex items-center shadow-inner">
              <div className="h-full bg-gradient-to-r from-sky-500 via-sky-600 to-blue-600 transition-all duration-500 rounded-l" style={{ width: '100%' }} />
              <span className="absolute inset-0 flex items-center justify-center font-extrabold text-slate-900 text-sm tracking-widest drop-shadow-xs">
                {totalCount.toLocaleString('vi-VN')}
              </span>
            </div>
            <div className="w-full sm:w-28 bg-emerald-600 text-white font-mono font-extrabold text-center py-2 rounded-lg border border-emerald-700 shadow-xs text-xs">
              100.00%
            </div>
          </div>

          {/* ROW 2: TỔNG SỐ CỬ TRI ĐÃ BỎ PHIẾU */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="w-full sm:w-64 text-emerald-700 font-extrabold text-right uppercase tracking-wider pr-2">
              TỔNG SỐ CỬ TRI ĐÃ BỎ PHIẾU
            </div>
            <div className="flex-1 bg-emerald-50 h-9 rounded-lg border border-emerald-300 relative overflow-hidden flex items-center shadow-inner">
              <div className="h-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 transition-all duration-500 rounded-l" style={{ width: `${Math.min(100, votedPctNum)}%` }} />
              <span className="absolute inset-0 flex items-center justify-center font-extrabold text-emerald-950 text-sm tracking-widest drop-shadow-xs">
                {votedCount.toLocaleString('vi-VN')}
              </span>
            </div>
            <div className="w-full sm:w-28 bg-emerald-600 text-white font-mono font-extrabold text-center py-2 rounded-lg border border-emerald-700 shadow-xs text-xs">
              {votedPct}%
            </div>
          </div>

          {/* ROW 3: TỔNG SỐ CỬ TRI CHƯA BỎ PHIẾU */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="w-full sm:w-64 text-rose-700 font-extrabold text-right uppercase tracking-wider pr-2">
              TỔNG SỐ CỬ TRI CHƯA BỎ PHIẾU
            </div>
            <div className="flex-1 bg-rose-50 h-9 rounded-lg border border-rose-300 relative overflow-hidden flex items-center shadow-inner">
              <div className="h-full bg-gradient-to-r from-sky-400 via-rose-500 to-rose-600 transition-all duration-500 rounded-l" style={{ width: `${Math.min(100, remainingPctNum)}%` }} />
              <span className="absolute inset-0 flex items-center justify-center font-extrabold text-rose-950 text-sm tracking-widest drop-shadow-xs">
                {remainingCount.toLocaleString('vi-VN')}
              </span>
            </div>
            <div className="w-full sm:w-28 bg-emerald-600 text-white font-mono font-extrabold text-center py-2 rounded-lg border border-emerald-700 shadow-xs text-xs">
              {remainingPct}%
            </div>
          </div>

          {/* KHU VỰC THỐNG KÊ CHI TIẾT: CỬ TRI BẦU 3 CẤP & 2 CẤP & SỐ CỬ TRI ĐÃ ĐI BẦU THEO TỪNG CẤP */}
          <div className="pt-3 border-t border-slate-200 space-y-3">
            {/* THỐNG KÊ CỬ TRI 3 CẤP VÀ 2 CẤP */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3.5 bg-gradient-to-r from-sky-50 to-blue-50 rounded-xl border border-sky-200 flex items-center justify-between shadow-2xs">
                <div className="space-y-0.5">
                  <div className="font-extrabold text-sky-950 text-xs uppercase flex items-center gap-1.5">
                    <span>🗳️ CỬ TRI BẦU 3 CẤP</span>
                    <span className="text-[10px] text-sky-700 font-medium">(Quốc hội + HĐND Tỉnh + HĐND Xã)</span>
                  </div>
                  <p className="text-[11px] text-slate-600">Tổng số cử tri được cấp 3 phiếu bầu</p>
                </div>
                <div className="text-right">
                  <div className="text-base font-black text-sky-900 font-mono">{voters3Levels.toLocaleString('vi-VN')}</div>
                  <div className="text-[10px] font-bold text-sky-700 bg-white px-2 py-0.5 rounded border border-sky-300 inline-block">
                    {totalCount > 0 ? ((voters3Levels / totalCount) * 100).toFixed(1) : '0'}% tổng cử tri
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200 flex items-center justify-between shadow-2xs">
                <div className="space-y-0.5">
                  <div className="font-extrabold text-purple-950 text-xs uppercase flex items-center gap-1.5">
                    <span>🗳️ CỬ TRI BẦU 2 CẤP</span>
                    <span className="text-[10px] text-purple-700 font-medium">(Cử tri biến động / Tạm trú)</span>
                  </div>
                  <p className="text-[11px] text-slate-600">Tổng số cử tri được cấp 2 phiếu bầu</p>
                </div>
                <div className="text-right">
                  <div className="text-base font-black text-purple-900 font-mono">{voters2Levels.toLocaleString('vi-VN')}</div>
                  <div className="text-[10px] font-bold text-purple-700 bg-white px-2 py-0.5 rounded border border-purple-300 inline-block">
                    {totalCount > 0 ? ((voters2Levels / totalCount) * 100).toFixed(1) : '0'}% tổng cử tri
                  </div>
                </div>
              </div>
            </div>

            {/* THỐNG KÊ SỐ CỬ TRI ĐÃ ĐI BẦU TƯƠNG ỨNG CHO TỪNG CẤP BẦU CỬ */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/90 space-y-2.5">
              <div className="font-extrabold text-slate-900 text-xs uppercase tracking-wide flex items-center gap-2 border-b border-slate-200 pb-2">
                <Vote className="w-4 h-4 text-sky-600" />
                SỐ CỬ TRI ĐÃ ĐI BẦU TƯƠNG ỨNG CHO TỪNG CẤP BẦU CỬ:
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                {/* 1. ĐẠI BIỂU QUỐC HỘI */}
                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                  <div className="flex items-center justify-between font-bold text-xs text-slate-800">
                    <span className="text-sky-900 font-extrabold">🇻🇳 ĐẠI BIỂU QUỐC HỘI</span>
                    <span className="font-mono text-sky-700 font-extrabold">{pctQuocHoi}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                    <div className="bg-sky-600 h-full transition-all duration-500 rounded-full" style={{ width: `${Math.min(100, Number(pctQuocHoi))}%` }} />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-600 font-medium">
                    <span>Đã đi bầu: <strong className="text-slate-900 font-bold">{votedQuocHoi.toLocaleString('vi-VN')}</strong></span>
                    <span>Tổng cử tri: <strong className="text-slate-700">{totalQuocHoi.toLocaleString('vi-VN')}</strong></span>
                  </div>
                </div>

                {/* 2. ĐẠI BIỂU HĐND TỈNH */}
                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                  <div className="flex items-center justify-between font-bold text-xs text-slate-800">
                    <span className="text-emerald-900 font-extrabold">🏛️ HĐND TỈNH/THÀNH PHỐ</span>
                    <span className="font-mono text-emerald-700 font-extrabold">{pctHdndTinh}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                    <div className="bg-emerald-600 h-full transition-all duration-500 rounded-full" style={{ width: `${Math.min(100, Number(pctHdndTinh))}%` }} />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-600 font-medium">
                    <span>Đã đi bầu: <strong className="text-slate-900 font-bold">{votedHdndTinh.toLocaleString('vi-VN')}</strong></span>
                    <span>Tổng cử tri: <strong className="text-slate-700">{totalHdndTinh.toLocaleString('vi-VN')}</strong></span>
                  </div>
                </div>

                {/* 3. ĐẠI BIỂU HĐND XÃ */}
                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                  <div className="flex items-center justify-between font-bold text-xs text-slate-800">
                    <span className="text-indigo-900 font-extrabold">🏡 HĐND XÃ/PHƯỜNG</span>
                    <span className="font-mono text-indigo-700 font-extrabold">{pctHdndXa}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                    <div className="bg-indigo-600 h-full transition-all duration-500 rounded-full" style={{ width: `${Math.min(100, Number(pctHdndXa))}%` }} />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-600 font-medium">
                    <span>Đã đi bầu: <strong className="text-slate-900 font-bold">{votedHdndXa.toLocaleString('vi-VN')}</strong></span>
                    <span>Tổng cử tri: <strong className="text-slate-700">{totalHdndXa.toLocaleString('vi-VN')}</strong></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search Control Panel */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên cử tri, số thẻ, số CCCD, địa chỉ..."
            className="w-full pl-10 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 font-medium"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
            <Filter className="w-3.5 h-3.5 text-slate-500 ml-1" />
            <span className="font-semibold text-slate-600">Thôn/Tổ:</span>
            <select
              value={selectedVillage}
              onChange={e => setSelectedVillage(e.target.value)}
              className="p-1 bg-white border border-slate-200 rounded-lg font-medium text-slate-700 outline-none"
            >
              <option value="ALL">Tất cả thôn/tổ ({voters.length})</option>
              {villages.map(v => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
            <span className="font-semibold text-slate-600 ml-1">Trạng thái:</span>
            <select
              value={filterVoted}
              onChange={e => setFilterVoted(e.target.value as any)}
              className="p-1 bg-white border border-slate-200 rounded-lg font-medium text-slate-700 outline-none"
            >
              <option value="ALL">Tất cả cử tri</option>
              <option value="VOTED">Đã bỏ phiếu ({votedCount})</option>
              <option value="NOT_VOTED">Chưa bỏ phiếu ({totalCount - votedCount})</option>
            </select>
          </div>
        </div>
      </div>

      {/* OFFICIAL VOTER LIST TABLE DESIGN (CHUẨN NGUYÊN MẪU) */}
      <div className="bg-white rounded-2xl border-2 border-slate-800 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#1e3a8a] text-white font-extrabold text-center border-b-2 border-slate-900 uppercase tracking-tight">
              <tr>
                <th rowSpan={2} className="p-3 w-12 border-r border-blue-900/60">Số TT</th>
                <th rowSpan={2} className="p-3 w-16 border-r border-blue-900/60">Số thẻ Cử tri</th>
                <th rowSpan={2} className="p-3 border-r border-blue-900/60 text-left">Họ và Tên</th>
                <th rowSpan={2} className="p-3 w-28 border-r border-blue-900/60">Ngày tháng năm sinh</th>
                <th rowSpan={2} className="p-3 w-10 border-r border-blue-900/60">Nam</th>
                <th rowSpan={2} className="p-3 w-10 border-r border-blue-900/60">Nữ</th>
                <th rowSpan={2} className="p-3 w-32 border-r border-blue-900/60">Số Căn cước</th>
                <th rowSpan={2} className="p-3 w-16 border-r border-blue-900/60">Dân tộc</th>
                <th rowSpan={2} className="p-3 border-r border-blue-900/60 text-left">NƠI CƯ TRÚ (Thường trú)</th>
                <th rowSpan={2} className="p-3 w-20 border-r border-blue-900/60 bg-blue-950/80">
                  Bầu cử ĐB Quốc Hội
                </th>
                <th colSpan={2} className="p-2 border-b border-blue-900/60 bg-blue-950/80">
                  Bầu cử đại biểu HĐND
                </th>
                <th rowSpan={2} className="p-3 w-36 border-r border-blue-900/60 bg-blue-950/90">TRẠNG THÁI BỎ PHIẾU</th>
                <th rowSpan={2} className="p-3 w-40 border-l border-blue-900/60 bg-blue-950/90">THAO TÁC</th>
              </tr>
              <tr>
                <th className="p-2 w-24 border-r border-blue-900/60 bg-blue-950/80">TP Đà Nẵng</th>
                <th className="p-2 w-24 border-r border-blue-900/60 bg-blue-950/80">Xã Hòa Tiến</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-300 font-medium">
              {filteredVoters.length === 0 ? (
                <tr>
                  <td colSpan={14} className="p-12 text-center text-slate-400 font-semibold">
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
                    <tr key={v.id} className="hover:bg-sky-50/40 transition-colors">
                      <td className="p-2.5 text-center font-bold text-slate-600 border-r border-slate-200">
                        {v.stt.toString().padStart(2, '0')}
                      </td>
                      <td className="p-2.5 text-center font-mono font-bold text-sky-900 border-r border-slate-200">
                        {v.voterCardNo}
                      </td>
                      <td className="p-2.5 font-bold text-slate-900 text-xs border-r border-slate-200 uppercase">
                        {v.fullName}
                      </td>
                      <td className="p-2.5 text-center font-mono text-slate-600 border-r border-slate-200">
                        {v.dob}
                      </td>
                      <td className="p-2.5 text-center font-extrabold text-slate-800 border-r border-slate-200">
                        {isMale ? 'x' : ''}
                      </td>
                      <td className="p-2.5 text-center font-extrabold text-slate-800 border-r border-slate-200">
                        {isFemale ? 'x' : ''}
                      </td>
                      <td className="p-2.5 text-center font-mono text-slate-700 text-[11px] border-r border-slate-200">
                        {v.idCard || '048*******888'}
                      </td>
                      <td className="p-2.5 text-center text-slate-700 border-r border-slate-200">
                        {v.ethnicity || 'Kinh'}
                      </td>
                      <td className="p-2.5 text-slate-700 text-[11px] border-r border-slate-200">
                        {v.address}
                      </td>

                      {/* Interactive Level Checkboxes */}
                      <td className="p-2.5 text-center border-r border-slate-200 bg-sky-50/30">
                        <button
                          onClick={() => handleToggleLevelFlag(v, 'eligibleQuocHoi')}
                          className={`w-6 h-6 rounded border font-bold text-xs inline-flex items-center justify-center transition-all ${
                            isQH ? 'bg-sky-600 text-white border-sky-700 shadow-2xs' : 'bg-white text-slate-300 border-slate-300'
                          }`}
                          title="Tích chọn/Bỏ chọn bầu cử ĐB Quốc hội"
                        >
                          {isQH ? 'x' : ''}
                        </button>
                      </td>

                      <td className="p-2.5 text-center border-r border-slate-200 bg-sky-50/30">
                        <button
                          onClick={() => handleToggleLevelFlag(v, 'eligibleHdndTinh')}
                          className={`w-6 h-6 rounded border font-bold text-xs inline-flex items-center justify-center transition-all ${
                            isTinh ? 'bg-sky-600 text-white border-sky-700 shadow-2xs' : 'bg-white text-slate-300 border-slate-300'
                          }`}
                          title="Tích chọn/Bỏ chọn bầu cử ĐB HĐND TP Đà Nẵng"
                        >
                          {isTinh ? 'x' : ''}
                        </button>
                      </td>

                      <td className="p-2.5 text-center border-r border-slate-200 bg-sky-50/30">
                        <button
                          onClick={() => handleToggleLevelFlag(v, 'eligibleHdndXa')}
                          className={`w-6 h-6 rounded border font-bold text-xs inline-flex items-center justify-center transition-all ${
                            isXa ? 'bg-sky-600 text-white border-sky-700 shadow-2xs' : 'bg-white text-slate-300 border-slate-300'
                          }`}
                          title="Tích chọn/Bỏ chọn bầu cử ĐB HĐND Xã Hòa Tiến"
                        >
                          {isXa ? 'x' : ''}
                        </button>
                      </td>

                      {/* COL 1: TRẠNG THÁI BỎ PHIẾU (CÓ HIỂN THỊ THỜI GIAN ĐI BẦU) */}
                      <td className="p-2.5 text-center border-r border-slate-200">
                        {v.hasVoted ? (
                          <div className="flex flex-col items-center gap-1">
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 inline-flex items-center gap-1 shadow-2xs">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              Đã bỏ phiếu
                            </span>
                            <span className="text-[10px] text-slate-600 font-mono font-bold flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded border border-slate-200" title="Thời gian ghi nhận cử tri đi bầu">
                              <Clock className="w-3 h-3 text-sky-600" />
                              {v.votedAt || '20:15'}
                            </span>
                          </div>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-500 border border-slate-200 inline-block">
                            Chưa bỏ phiếu
                          </span>
                        )}
                      </td>

                      {/* COL 2: THAO TÁC / ĐIỂM DANH */}
                      <td className="p-2.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => {
                              toggleVoterStatus(v.id);
                              if (!v.hasVoted) {
                                showToast(`✅ Đã điểm danh cử tri: ${v.fullName}`, 'success');
                              } else {
                                showToast(`ℹ️ Đã hủy điểm danh cử tri: ${v.fullName}`, 'info');
                              }
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all shadow-2xs flex items-center gap-1 ${
                              v.hasVoted
                                ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                                : 'bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white shadow-xs'
                            }`}
                            title={v.hasVoted ? 'Bấm để HỦY điểm danh cử tri này' : 'Bấm để XÁC NHẬN điểm danh cử tri này'}
                          >
                            {v.hasVoted ? '✕ Hủy' : '✓ Điểm danh'}
                          </button>

                          <button
                            onClick={() => handleOpenEditModal(v)}
                            className="p-1.5 text-sky-600 hover:text-sky-800 hover:bg-sky-50 rounded-lg transition-colors border border-transparent hover:border-sky-200"
                            title="Chỉnh sửa cử tri"
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
                            className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200"
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
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <Users className="w-4 h-4 text-sky-600" />
                {editingVoter ? 'SỬA THÔNG TIN CỬ TRI' : 'THÊM MỚI CỬ TRI'}
              </h3>
              <button onClick={() => setShowVoterModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveVoter} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Số Thẻ Cử Tri:</label>
                  <input
                    type="text"
                    required
                    value={voterCardNo}
                    onChange={e => setVoterCardNo(e.target.value)}
                    placeholder="1, 2, 3..."
                    className="w-full p-2.5 border border-slate-300 rounded-xl font-mono font-bold focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Họ và Tên:</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="ĐẶNG HUY TƯỜNG"
                    className="w-full p-2.5 border border-slate-300 rounded-xl font-bold text-slate-900 uppercase focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Giới tính:</label>
                  <select
                    value={gender}
                    onChange={e => setGender(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl font-semibold outline-none"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Ngày sinh:</label>
                  <input
                    type="text"
                    value={dob}
                    onChange={e => setDob(e.target.value)}
                    placeholder="13/01/2005"
                    className="w-full p-2.5 border border-slate-300 rounded-xl font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Dân tộc:</label>
                  <input
                    type="text"
                    value={ethnicity}
                    onChange={e => setEthnicity(e.target.value)}
                    placeholder="Kinh"
                    className="w-full p-2.5 border border-slate-300 rounded-xl font-semibold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Số Căn cước (CCCD):</label>
                <input
                  type="text"
                  value={idCard}
                  onChange={e => setIdCard(e.target.value)}
                  placeholder="048*******698"
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-mono outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">NƠI CƯ TRÚ (Thường trú):</label>
                <input
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Tổ 1, Thôn An Trạch, Xã Hòa Tiến, Thành Phố Đà Nẵng"
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-semibold outline-none"
                />
              </div>

              {/* Checklist Cấp Bầu Cử Được Bầu */}
              <div className="p-3.5 bg-sky-50/80 rounded-xl border border-sky-200/80 space-y-2.5">
                <label className="block text-sky-950 font-extrabold text-xs">CÁC CẤP BẦU CỬ CỬ TRI THAM GIA BỎ PHIẾU:</label>
                <div className="space-y-2 pl-1">
                  <label className="flex items-center gap-2.5 cursor-pointer font-bold text-slate-700 hover:text-sky-900">
                    <input
                      type="checkbox"
                      checked={eligibleQuocHoi}
                      onChange={e => setEligibleQuocHoi(e.target.checked)}
                      className="w-4 h-4 text-sky-600 rounded border-slate-300"
                    />
                    <span>Bầu cử Đại biểu Quốc Hội</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer font-bold text-slate-700 hover:text-sky-900">
                    <input
                      type="checkbox"
                      checked={eligibleHdndTinh}
                      onChange={e => setEligibleHdndTinh(e.target.checked)}
                      className="w-4 h-4 text-sky-600 rounded border-slate-300"
                    />
                    <span>Bầu cử đại biểu HĐND Thành phố Đà Nẵng</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer font-bold text-slate-700 hover:text-sky-900">
                    <input
                      type="checkbox"
                      checked={eligibleHdndXa}
                      onChange={e => setEligibleHdndXa(e.target.checked)}
                      className="w-4 h-4 text-sky-600 rounded border-slate-300"
                    />
                    <span>Bầu cử đại biểu HĐND Xã Hòa Tiến</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowVoterModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-xl font-extrabold shadow-md hover:opacity-95"
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
