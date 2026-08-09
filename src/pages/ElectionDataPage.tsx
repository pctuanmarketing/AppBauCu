import React, { useState } from 'react';
import {
  Database,
  Building,
  UserCheck,
  Eye,
  UserPlus,
  Plus,
  Edit2,
  Trash2,
  X,
  Vote,
  Users,
  ShieldCheck,
  Check,
  Sparkles,
} from 'lucide-react';
import { Candidate, CommitteeMember, ElectionLevel, ElectionLevelConfig, ElectionUnit, Witness } from '../types';

interface ElectionDataPageProps {
  unit: ElectionUnit;
  updateUnit: (unit: ElectionUnit) => void;
  configs: Record<ElectionLevel, ElectionLevelConfig>;
  updateLevelConfig: (level: ElectionLevel, config: Partial<ElectionLevelConfig>) => void;
  committee: CommitteeMember[];
  addCommitteeMember: (member: Omit<CommitteeMember, 'id' | 'stt'>) => void;
  updateCommitteeMember: (member: CommitteeMember) => void;
  deleteCommitteeMember: (id: string) => void;
  witnesses: Witness[];
  addWitness: (witness: Omit<Witness, 'id' | 'stt'>) => void;
  updateWitness: (witness: Witness) => void;
  deleteWitness: (id: string) => void;
  candidates: Candidate[];
  addCandidate: (candidate: Omit<Candidate, 'id' | 'stt' | 'voteCount' | 'votePercentage'>) => void;
  updateCandidate: (candidate: Candidate) => void;
  deleteCandidate: (id: string) => void;
}

export const ElectionDataPage: React.FC<ElectionDataPageProps> = ({
  unit,
  updateUnit,
  configs,
  updateLevelConfig,
  committee,
  addCommitteeMember,
  updateCommitteeMember,
  deleteCommitteeMember,
  witnesses,
  addWitness,
  updateWitness,
  deleteWitness,
  candidates,
  addCandidate,
  updateCandidate,
  deleteCandidate,
}) => {
  // Sắp xếp thứ tự sub-tabs theo đúng yêu cầu:
  // 1. Ứng viên 3 cấp | 2. Đơn vị bầu cử | 3. Tổ bầu cử | 4. Cử tri chứng kiến
  const [activeSubTab, setActiveSubTab] = useState<'candidates' | 'unit' | 'committee' | 'witnesses'>('candidates');
  const [selectedLevel, setSelectedLevel] = useState<ElectionLevel>('QUOC_HOI');

  // Form state for Unit Setup
  const [formUnit, setFormUnit] = useState<ElectionUnit>(unit);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  // Committee Modal State
  const [showCommitteeModal, setShowCommitteeModal] = useState(false);
  const [editingMember, setEditingMember] = useState<CommitteeMember | null>(null);
  const [cmName, setCmName] = useState('');
  const [cmRole, setCmRole] = useState('Ủy viên');
  const [cmIdCard, setCmIdCard] = useState('');
  const [cmPhone, setCmPhone] = useState('');

  // Witness Modal State
  const [showWitnessModal, setShowWitnessModal] = useState(false);
  const [editingWitness, setEditingWitness] = useState<Witness | null>(null);
  const [wName, setWName] = useState('');
  const [wAddress, setWAddress] = useState('Thôn An Trạch');
  const [wIdCard, setWIdCard] = useState('');
  const [wPhone, setWPhone] = useState('');

  // Candidate Modal State
  const [showCandidateModal, setShowCandidateModal] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [candName, setCandName] = useState('');
  const [candGender, setCandGender] = useState('Ông');
  const [candDob, setCandDob] = useState('01/01/1980');

  const currentConfig = configs[selectedLevel];
  const levelCandidates = candidates
    .filter(c => c.electionLevel === selectedLevel)
    .sort((a, b) => a.stt - b.stt);

  const handleSaveUnitForm = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateUnit(formUnit);
    setSaveSuccessMsg(true);
    setTimeout(() => {
      setSaveSuccessMsg(false);
    }, 2500);
  };

  // Committee Handlers
  const handleOpenAddCommittee = () => {
    setEditingMember(null);
    setCmName('');
    setCmRole('Ủy viên');
    setCmIdCard('048085001234');
    setCmPhone('0905123456');
    setShowCommitteeModal(true);
  };

  const handleOpenEditCommittee = (m: CommitteeMember) => {
    setEditingMember(m);
    setCmName(m.fullName);
    setCmRole(m.role);
    setCmIdCard(m.idCard);
    setCmPhone(m.phone);
    setShowCommitteeModal(true);
  };

  const handleSaveCommittee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cmName.trim()) return;

    if (editingMember) {
      updateCommitteeMember({
        ...editingMember,
        fullName: cmName,
        role: cmRole,
        idCard: cmIdCard,
        phone: cmPhone,
      });
    } else {
      addCommitteeMember({
        fullName: cmName,
        role: cmRole,
        idCard: cmIdCard,
        phone: cmPhone,
      });
    }
    setShowCommitteeModal(false);
  };

  // Witness Handlers
  const handleOpenAddWitness = () => {
    setEditingWitness(null);
    setWName('');
    setWAddress('Thôn An Trạch');
    setWIdCard('048085006666');
    setWPhone('0905111333');
    setShowWitnessModal(true);
  };

  const handleOpenEditWitness = (w: Witness) => {
    setEditingWitness(w);
    setWName(w.fullName);
    setWAddress(w.address);
    setWIdCard(w.idCard || '');
    setWPhone(w.phone || '');
    setShowWitnessModal(true);
  };

  const handleSaveWitness = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wName.trim()) return;

    if (editingWitness) {
      updateWitness({
        ...editingWitness,
        fullName: wName,
        address: wAddress,
        idCard: wIdCard,
        phone: wPhone,
      });
    } else {
      addWitness({
        fullName: wName,
        address: wAddress,
        idCard: wIdCard,
        phone: wPhone,
      });
    }
    setShowWitnessModal(false);
  };

  // Candidate Handlers
  const handleOpenAddCandidate = () => {
    setEditingCandidate(null);
    setCandName('');
    setCandGender('Ông');
    setCandDob('15/05/1980');
    setShowCandidateModal(true);
  };

  const handleOpenEditCandidate = (c: Candidate) => {
    setEditingCandidate(c);
    setCandName(c.fullName);
    setCandGender(c.gender);
    setCandDob(c.dob);
    setShowCandidateModal(true);
  };

  const handleSaveCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candName.trim()) return;

    if (editingCandidate) {
      updateCandidate({
        ...editingCandidate,
        fullName: candName,
        gender: candGender,
        dob: candDob,
      });
    } else {
      addCandidate({
        fullName: candName,
        gender: candGender,
        dob: candDob,
        electionLevel: selectedLevel,
      });
    }
    setShowCandidateModal(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-slate-900">THIẾT LẬP DỮ LIỆU BẦU CỬ & NHÂN SỰ</h1>
            <p className="text-xs text-slate-500">Cấu hình Danh sách Ứng cử viên 3 cấp, Đơn vị bầu cử, Tổ bầu cử và Cử tri chứng kiến</p>
          </div>
        </div>

        {/* Sub-tab Switcher: Thứ tự chuẩn: 1. Ứng viên 3 cấp -> 2. Đơn vị bầu cử -> 3. Tổ bầu cử -> 4. Cử tri chứng kiến */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setActiveSubTab('candidates')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeSubTab === 'candidates' ? 'bg-sky-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            1. Ứng viên 3 cấp
          </button>
          <button
            onClick={() => setActiveSubTab('unit')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeSubTab === 'unit' ? 'bg-sky-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            2. Đơn vị bầu cử
          </button>
          <button
            onClick={() => setActiveSubTab('committee')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeSubTab === 'committee' ? 'bg-sky-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            3. Tổ bầu cử ({committee.length})
          </button>
          <button
            onClick={() => setActiveSubTab('witnesses')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeSubTab === 'witnesses' ? 'bg-sky-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            4. Cử tri chứng kiến ({witnesses.length})
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: CANDIDATES SETUP (ỨNG VIÊN 3 CẤP) */}
      {activeSubTab === 'candidates' && (
        <div className="space-y-5">
          <div className="flex bg-white p-2 rounded-2xl border border-slate-200 shadow-sm gap-2">
            {(['QUOC_HOI', 'HDND_TINH', 'HDND_XA'] as ElectionLevel[]).map(lvl => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`flex-1 py-3 rounded-xl font-extrabold text-xs transition-all ${
                  selectedLevel === lvl ? 'bg-sky-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {configs[lvl].levelName.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="bg-white p-5 rounded-2xl border-2 border-sky-200 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-extrabold text-slate-700 uppercase">Tổng số cử tri ({currentConfig.levelName}):</label>
              <input
                type="number"
                value={currentConfig.totalVoters}
                onChange={e => updateLevelConfig(selectedLevel, { totalVoters: parseInt(e.target.value) || 0 })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-extrabold text-slate-700 uppercase">Số người ứng cử:</label>
              <div className="p-2.5 bg-slate-100 border border-slate-300 rounded-xl font-extrabold text-slate-900">
                {levelCandidates.length} người
              </div>
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-extrabold text-slate-700 uppercase">Số đại biểu được bầu:</label>
              <input
                type="number"
                value={currentConfig.numRepresentatives}
                onChange={e => updateLevelConfig(selectedLevel, { numRepresentatives: parseInt(e.target.value) || 1 })}
                className="w-full p-2.5 bg-sky-50 border border-sky-300 rounded-xl font-extrabold text-sky-900 focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-3">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-slate-800 uppercase flex items-center gap-2">
                <Vote className="w-4 h-4 text-sky-600" />
                DANH SÁCH ỨNG CỬ VIÊN ({currentConfig.levelName})
              </h3>
              <button
                onClick={handleOpenAddCandidate}
                className="bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow"
              >
                <Plus className="w-4 h-4" />
                Thêm ứng cử viên
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200">
                  <tr>
                    <th className="p-3.5 w-16 text-center">STT</th>
                    <th className="p-3.5">Họ và tên ứng cử viên</th>
                    <th className="p-3.5 w-24 text-center">Giới tính</th>
                    <th className="p-3.5 w-32 text-center">Ngày sinh</th>
                    <th className="p-3.5 w-32 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {levelCandidates.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400">
                        Chưa có ứng cử viên nào. Vui lòng bấm "+ Thêm ứng cử viên".
                      </td>
                    </tr>
                  ) : (
                    levelCandidates.map(c => (
                      <tr key={c.id} className="hover:bg-slate-50">
                        <td className="p-3.5 text-center font-bold text-slate-600">{c.stt}</td>
                        <td className="p-3.5 font-bold text-slate-900 text-sm uppercase">{c.fullName}</td>
                        <td className="p-3.5 text-center text-slate-700 font-medium">{c.gender}</td>
                        <td className="p-3.5 text-center font-mono text-slate-600">{c.dob}</td>
                        <td className="p-3.5 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleOpenEditCandidate(c)}
                              className="p-1.5 text-sky-600 hover:bg-sky-50 rounded-lg"
                              title="Sửa ứng cử viên"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Xóa ứng cử viên "${c.fullName}" khỏi danh sách?`)) {
                                  deleteCandidate(c.id);
                                }
                              }}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                              title="Xóa ứng cử viên"
                            >
                              <Trash2 className="w-4 h-4" />
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
        </div>
      )}

      {/* SUB-TAB 2: ELECTION UNIT SETUP (ĐƠN VỊ BẦU CỬ) */}
      {activeSubTab === 'unit' && (
        <div className="bg-slate-50/70 p-6 rounded-2xl border-2 border-slate-300 shadow-md space-y-6">
          {saveSuccessMsg && (
            <div className="p-3 bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow animate-fade-in">
              <Check className="w-4 h-4" />
              <span>✅ Đã lưu cấu hình Đơn vị bầu cử thành công!</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-slate-200 pb-4">
            <div className="flex flex-wrap items-center gap-4 text-sm font-extrabold text-slate-900">
              <div className="flex items-center gap-2">
                <span className="text-rose-600">***</span>
                <span>TỈNH/THÀNH PHỐ:</span>
                <select
                  value={formUnit.province}
                  onChange={e => setFormUnit({ ...formUnit, province: e.target.value })}
                  className="px-3 py-1.5 bg-white border-2 border-sky-300 rounded-lg text-slate-900 font-bold outline-none focus:border-sky-500 shadow-2xs"
                >
                  <option value="Thành phố Đà Nẵng">Thành phố Đà Nẵng</option>
                  <option value="Thành phố Hà Nội">Thành phố Hà Nội</option>
                  <option value="Thành phố Hồ Chí Minh">Thành phố Hồ Chí Minh</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span>KHÓA:</span>
                <input
                  type="text"
                  value={formUnit.term}
                  onChange={e => setFormUnit({ ...formUnit, term: e.target.value })}
                  className="w-24 px-3 py-1.5 bg-white border-2 border-sky-300 rounded-lg text-center font-extrabold text-sky-900 outline-none focus:border-sky-500 shadow-2xs"
                />
              </div>
            </div>

            <button
              onClick={() => handleSaveUnitForm()}
              className="bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-300 font-bold text-xs px-5 py-2 rounded-lg shadow-xs flex items-center justify-center gap-1.5 transition-all"
            >
              ✓ Lưu
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
              <h2 className="text-xs font-extrabold text-slate-900 uppercase">
                1. Đơn vị bầu cử Đại biểu Quốc Hội:
              </h2>
              <span className="text-[11px] text-purple-800 italic font-sans font-medium">
                (Ghi đầy đủ Cấp + Tên. Ví dụ: Phường Tân Định, Xã Thạnh An...)
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 text-xs font-bold text-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-rose-600 font-serif">▶</span>
                <span>Số:</span>
                <input
                  type="number"
                  value={formUnit.quocHoiUnitNo}
                  onChange={e => setFormUnit({ ...formUnit, quocHoiUnitNo: parseInt(e.target.value) || 1 })}
                  className="w-20 p-2 bg-white border border-slate-300 rounded text-center font-bold font-mono outline-none focus:border-sky-500 shadow-2xs"
                />
              </div>

              <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <span className="text-rose-600 font-serif">▶</span>
                <span className="shrink-0">Gồm Xã/Phường/Đặc khu:</span>
                <input
                  type="text"
                  value={formUnit.quocHoiWards}
                  onChange={e => setFormUnit({ ...formUnit, quocHoiWards: e.target.value })}
                  className="flex-1 p-2 bg-white border border-slate-300 rounded font-medium outline-none focus:border-sky-500 shadow-2xs text-slate-900"
                />
              </div>
            </div>
          </div>

          <div className="border-b border-dashed border-slate-400 my-2" />

          <div className="space-y-3">
            <h2 className="text-xs font-extrabold text-slate-900 uppercase">
              2. Đơn vị bầu cử Đại biểu HĐND Tỉnh:
            </h2>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 text-xs font-bold text-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-rose-600 font-serif">▶</span>
                <span>Số:</span>
                <input
                  type="number"
                  value={formUnit.hdndTinhUnitNo}
                  onChange={e => setFormUnit({ ...formUnit, hdndTinhUnitNo: parseInt(e.target.value) || 1 })}
                  className="w-20 p-2 bg-white border border-slate-300 rounded text-center font-bold font-mono outline-none focus:border-sky-500 shadow-2xs"
                />
              </div>

              <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <span className="text-rose-600 font-serif">▶</span>
                <span className="shrink-0">Gồm Xã/Phường/Đặc khu:</span>
                <input
                  type="text"
                  value={formUnit.hdndTinhWards}
                  onChange={e => setFormUnit({ ...formUnit, hdndTinhWards: e.target.value })}
                  className="flex-1 p-2 bg-white border border-slate-300 rounded font-medium outline-none focus:border-sky-500 shadow-2xs text-slate-900"
                />
              </div>
            </div>
          </div>

          <div className="border-b border-dashed border-slate-400 my-2" />

          <div className="space-y-3">
            <h2 className="text-xs font-extrabold text-slate-900 uppercase">
              3. Đơn vị bầu cử Đại biểu HĐND Xã:
            </h2>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 text-xs font-bold text-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-rose-600 font-serif">▶</span>
                <span>Số:</span>
                <input
                  type="number"
                  value={formUnit.hdndXaUnitNo}
                  onChange={e => setFormUnit({ ...formUnit, hdndXaUnitNo: parseInt(e.target.value) || 1 })}
                  className="w-20 p-2 bg-white border border-slate-300 rounded text-center font-bold font-mono outline-none focus:border-sky-500 shadow-2xs"
                />
              </div>

              <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <span className="text-rose-600 font-serif">▶</span>
                <span className="shrink-0">Gồm Thôn/Tổ dân phố:</span>
                <input
                  type="text"
                  value={formUnit.hdndXaVillages}
                  onChange={e => setFormUnit({ ...formUnit, hdndXaVillages: e.target.value })}
                  className="flex-1 p-2 bg-white border border-slate-300 rounded font-medium outline-none focus:border-sky-500 shadow-2xs text-slate-900"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 bg-slate-200/80 p-4 rounded-xl border border-slate-400/80 space-y-3 shadow-inner">
            <div className="inline-block bg-slate-300 border border-slate-400 px-3 py-1 rounded text-xs font-extrabold text-slate-900">
              Tổ bầu cử:
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6 text-xs font-bold text-slate-800 pl-2">
              <div className="flex items-center gap-2">
                <span className="text-rose-600 font-serif">▶</span>
                <span className="shrink-0">Khu vực bỏ phiếu số:</span>
                <input
                  type="number"
                  value={formUnit.votingAreaNo}
                  onChange={e => setFormUnit({ ...formUnit, votingAreaNo: parseInt(e.target.value) || 21 })}
                  className="w-24 p-2 bg-white border border-slate-300 rounded text-center font-bold font-mono text-sky-900 outline-none focus:border-sky-500 shadow-2xs"
                />
              </div>

              <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <span className="text-rose-600 font-serif">▶</span>
                <span className="shrink-0">Xã/Phường/Đặc khu:</span>
                <input
                  type="text"
                  value={formUnit.wardName}
                  onChange={e => setFormUnit({ ...formUnit, wardName: e.target.value })}
                  className="flex-1 p-2 bg-white border border-slate-300 rounded font-medium outline-none focus:border-sky-500 shadow-2xs text-slate-900"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: COMMITTEE MEMBERS SETUP (TỔ BẦU CỬ) */}
      {activeSubTab === 'committee' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-5">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="text-xs font-extrabold text-slate-800 uppercase flex items-center gap-2">
              <Users className="w-4 h-4 text-sky-600" />
              DANH SÁCH TỔ BẦU CỬ SỐ 21 (THÔN AN TRẠCH)
            </h3>
            <button
              onClick={handleOpenAddCommittee}
              className="bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" />
              Thêm nhân sự Tổ bầu cử
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200">
                <tr>
                  <th className="p-3.5 w-16 text-center">STT</th>
                  <th className="p-3.5">Họ và tên</th>
                  <th className="p-3.5 w-32">Chức danh Tổ bầu cử</th>
                  <th className="p-3.5 w-36 text-center">Số CCCD</th>
                  <th className="p-3.5 w-32 text-center">Số điện thoại</th>
                  <th className="p-3.5 w-28 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {committee.map(m => (
                  <tr key={m.id} className="hover:bg-slate-50">
                    <td className="p-3.5 text-center font-bold text-slate-600">{m.stt}</td>
                    <td className="p-3.5 font-bold text-slate-900 text-sm uppercase">{m.fullName}</td>
                    <td className="p-3.5 font-bold text-sky-800">{m.role}</td>
                    <td className="p-3.5 text-center font-mono text-slate-700">{m.idCard}</td>
                    <td className="p-3.5 text-center font-mono text-slate-700">{m.phone}</td>
                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenEditCommittee(m)}
                          className="p-1.5 text-sky-600 hover:bg-sky-50 rounded-lg"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Xóa thành viên "${m.fullName}" khỏi Tổ bầu cử?`)) {
                              deleteCommitteeMember(m.id);
                            }
                          }}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: WITNESSES SETUP (CỬ TRI CHỨNG KIẾN) */}
      {activeSubTab === 'witnesses' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-5">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="text-xs font-extrabold text-slate-800 uppercase flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-600" />
              DANH SÁCH CỬ TRI CHỨNG KIẾN MỞ HÒM PHIẾU
            </h3>
            <button
              onClick={handleOpenAddWitness}
              className="bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" />
              Thêm cử tri chứng kiến
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200">
                <tr>
                  <th className="p-3.5 w-16 text-center">STT</th>
                  <th className="p-3.5">Họ và tên cử tri chứng kiến</th>
                  <th className="p-3.5">Địa chỉ / Thôn</th>
                  <th className="p-3.5 w-36 text-center">Số CCCD</th>
                  <th className="p-3.5 w-32 text-center">Số điện thoại</th>
                  <th className="p-3.5 w-28 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {witnesses.map(w => (
                  <tr key={w.id} className="hover:bg-slate-50">
                    <td className="p-3.5 text-center font-bold text-slate-600">{w.stt}</td>
                    <td className="p-3.5 font-bold text-slate-900 text-sm uppercase">{w.fullName}</td>
                    <td className="p-3.5 font-medium text-slate-700">{w.address}</td>
                    <td className="p-3.5 text-center font-mono text-slate-700">{w.idCard || '---'}</td>
                    <td className="p-3.5 text-center font-mono text-slate-700">{w.phone || '---'}</td>
                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenEditWitness(w)}
                          className="p-1.5 text-sky-600 hover:bg-sky-50 rounded-lg"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Xóa cử tri chứng kiến "${w.fullName}"?`)) {
                              deleteWitness(w.id);
                            }
                          }}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Candidate Modal */}
      {showCandidateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="text-sm font-bold text-slate-800 uppercase">
                {editingCandidate ? 'SỬA ỨNG CỬ VIÊN' : 'THÊM ỨNG CỬ VIÊN MỚI'}
              </h3>
              <button onClick={() => setShowCandidateModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveCandidate} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Họ và tên ứng cử viên:</label>
                <input
                  type="text"
                  required
                  value={candName}
                  onChange={e => setCandName(e.target.value)}
                  placeholder="NGUYỄN VĂN A"
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-bold uppercase text-slate-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Giới tính:</label>
                  <select
                    value={candGender}
                    onChange={e => setCandGender(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl font-semibold"
                  >
                    <option value="Ông">Ông</option>
                    <option value="Bà">Bà</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ngày sinh:</label>
                  <input
                    type="text"
                    value={candDob}
                    onChange={e => setCandDob(e.target.value)}
                    placeholder="15/05/1980"
                    className="w-full p-2.5 border border-slate-300 rounded-xl font-mono"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowCandidateModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold"
                >
                  Hủy
                </button>
                <button type="submit" className="px-5 py-2 bg-sky-600 text-white rounded-xl font-bold shadow">
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Committee Modal */}
      {showCommitteeModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="text-sm font-bold text-slate-800 uppercase">
                {editingMember ? 'SỬA THÀNH VIÊN TỔ BẦU CỬ' : 'THÊM THÀNH VIÊN TỔ BẦU CỬ'}
              </h3>
              <button onClick={() => setShowCommitteeModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveCommittee} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Họ và tên:</label>
                <input
                  type="text"
                  required
                  value={cmName}
                  onChange={e => setCmName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-bold uppercase"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Chức danh Tổ bầu cử:</label>
                <select
                  value={cmRole}
                  onChange={e => setCmRole(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-semibold text-sky-900"
                >
                  <option value="Tổ trưởng">Tổ trưởng</option>
                  <option value="Thư ký">Thư ký</option>
                  <option value="Ủy viên">Ủy viên</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Số CCCD:</label>
                  <input
                    type="text"
                    value={cmIdCard}
                    onChange={e => setCmIdCard(e.target.value)}
                    placeholder="048085001234"
                    className="w-full p-2.5 border border-slate-300 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Số điện thoại:</label>
                  <input
                    type="text"
                    value={cmPhone}
                    onChange={e => setCmPhone(e.target.value)}
                    placeholder="0905123456"
                    className="w-full p-2.5 border border-slate-300 rounded-xl font-mono"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowCommitteeModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold"
                >
                  Hủy
                </button>
                <button type="submit" className="px-5 py-2 bg-sky-600 text-white rounded-xl font-bold shadow">
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Witness Modal */}
      {showWitnessModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="text-sm font-bold text-slate-800 uppercase">
                {editingWitness ? 'SỬA CỬ TRI CHỨNG KIẾN' : 'THÊM CỬ TRI CHỨNG KIẾN'}
              </h3>
              <button onClick={() => setShowWitnessModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveWitness} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Họ và tên cử tri chứng kiến:</label>
                <input
                  type="text"
                  required
                  value={wName}
                  onChange={e => setWName(e.target.value)}
                  placeholder="Trần Văn Cảnh"
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-bold uppercase"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Địa chỉ / Thôn:</label>
                <input
                  type="text"
                  value={wAddress}
                  onChange={e => setWAddress(e.target.value)}
                  placeholder="Thôn An Trạch"
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-medium"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Số CCCD:</label>
                  <input
                    type="text"
                    value={wIdCard}
                    onChange={e => setWIdCard(e.target.value)}
                    placeholder="048085006666"
                    className="w-full p-2.5 border border-slate-300 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Số điện thoại:</label>
                  <input
                    type="text"
                    value={wPhone}
                    onChange={e => setWPhone(e.target.value)}
                    placeholder="0905111333"
                    className="w-full p-2.5 border border-slate-300 rounded-xl font-mono"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowWitnessModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold"
                >
                  Hủy
                </button>
                <button type="submit" className="px-5 py-2 bg-sky-600 text-white rounded-xl font-bold shadow">
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
