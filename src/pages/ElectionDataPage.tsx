import React, { useState } from 'react';
import {
  Building2,
  Users2,
  Eye,
  UserCheck,
  Plus,
  Edit2,
  Trash2,
  Save,
  CheckCircle,
  FileText,
} from 'lucide-react';
import { Candidate, CommitteeMember, ElectionLevel, ElectionLevelConfig, ElectionUnit, Witness } from '../types';

interface ElectionDataPageProps {
  unit: ElectionUnit;
  updateUnit: (unit: ElectionUnit) => void;
  configs: Record<ElectionLevel, ElectionLevelConfig>;
  updateLevelConfig: (level: ElectionLevel, config: Partial<ElectionLevelConfig>) => void;
  committee: CommitteeMember[];
  setCommittee: React.Dispatch<React.SetStateAction<CommitteeMember[]>>;
  witnesses: Witness[];
  setWitnesses: React.Dispatch<React.SetStateAction<Witness[]>>;
  candidates: Candidate[];
  updateCandidate: (c: Candidate) => void;
}

export const ElectionDataPage: React.FC<ElectionDataPageProps> = ({
  unit,
  updateUnit,
  configs,
  updateLevelConfig,
  committee,
  setCommittee,
  witnesses,
  setWitnesses,
  candidates,
  updateCandidate,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'unit' | 'committee' | 'witnesses' | 'candidates'>('unit');
  const [selectedLevel, setSelectedLevel] = useState<ElectionLevel>('QUOC_HOI');
  const [isEditingUnit, setIsEditingUnit] = useState(false);
  const [unitForm, setUnitForm] = useState<ElectionUnit>(unit);

  const handleSaveUnit = () => {
    updateUnit(unitForm);
    setIsEditingUnit(false);
  };

  const levelCandidates = candidates.filter(c => c.electionLevel === selectedLevel);
  const currentConfig = configs[selectedLevel];

  return (
    <div className="space-y-6">
      {/* Top Header & Sub-Tabs Navigation */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-800">DỮ LIỆU BẦU CỬ & NHÂN SỰ TỔ BẦU CỬ</h1>
          <p className="text-xs text-slate-500">Cấu hình thông tin khu vực bỏ phiếu, nhân sự tổ bầu cử và danh sách ứng cử viên 3 cấp</p>
        </div>

        {/* Sub-tabs */}
        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setActiveSubTab('unit')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all ${
              activeSubTab === 'unit' ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Đơn vị bầu cử</span>
          </button>
          <button
            onClick={() => setActiveSubTab('committee')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all ${
              activeSubTab === 'committee' ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users2 className="w-3.5 h-3.5" />
            <span>Nhân sự Tổ bầu cử</span>
          </button>
          <button
            onClick={() => setActiveSubTab('witnesses')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all ${
              activeSubTab === 'witnesses' ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Cử tri chứng kiến</span>
          </button>
          <button
            onClick={() => setActiveSubTab('candidates')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all ${
              activeSubTab === 'candidates' ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Ứng cử viên 3 Cấp</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: ĐƠN VỊ BẦU CỬ */}
      {activeSubTab === 'unit' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-sky-600" />
              THÔNG TIN ĐƠN VỊ BẦU CỬ (HÌNH MẪU THAM KHẢO SPECS)
            </h2>
            {isEditingUnit ? (
              <button
                onClick={handleSaveUnit}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow"
              >
                <Save className="w-3.5 h-3.5" />
                Lưu thay đổi
              </button>
            ) : (
              <button
                onClick={() => setIsEditingUnit(true)}
                className="bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Chỉnh sửa thông tin
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Tỉnh / Khóa */}
            <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h3 className="font-bold text-sky-900 uppercase">1. Thông tin Cấp Tỉnh / Khóa</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">TỈNH / THÀNH PHỐ:</label>
                  <input
                    type="text"
                    disabled={!isEditingUnit}
                    value={unitForm.province}
                    onChange={e => setUnitForm({ ...unitForm, province: e.target.value })}
                    className="w-full p-2 bg-white border border-slate-300 rounded-md disabled:bg-slate-100 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">KHÓA BẦU CỬ:</label>
                  <input
                    type="text"
                    disabled={!isEditingUnit}
                    value={unitForm.term}
                    onChange={e => setUnitForm({ ...unitForm, term: e.target.value })}
                    className="w-full p-2 bg-white border border-slate-300 rounded-md disabled:bg-slate-100 font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Đơn vị bầu cử ĐBQH */}
            <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h3 className="font-bold text-sky-900 uppercase">2. Đơn vị bầu cử Đại biểu Quốc hội</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">ĐƠN VỊ BẦU CỬ SỐ:</label>
                  <input
                    type="number"
                    disabled={!isEditingUnit}
                    value={unitForm.quocHoiUnitNo}
                    onChange={e => setUnitForm({ ...unitForm, quocHoiUnitNo: parseInt(e.target.value) || 0 })}
                    className="w-full p-2 bg-white border border-slate-300 rounded-md disabled:bg-slate-100 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">GỒM CÁC XÃ / PHƯỜNG / ĐẶC KHU:</label>
                  <input
                    type="text"
                    disabled={!isEditingUnit}
                    value={unitForm.quocHoiWards}
                    onChange={e => setUnitForm({ ...unitForm, quocHoiWards: e.target.value })}
                    className="w-full p-2 bg-white border border-slate-300 rounded-md disabled:bg-slate-100 font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Đơn vị bầu cử HĐND Tỉnh */}
            <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h3 className="font-bold text-sky-900 uppercase">3. Đơn vị bầu cử ĐB HĐND Tỉnh</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">ĐƠN VỊ BẦU CỬ SỐ:</label>
                  <input
                    type="number"
                    disabled={!isEditingUnit}
                    value={unitForm.hdndTinhUnitNo}
                    onChange={e => setUnitForm({ ...unitForm, hdndTinhUnitNo: parseInt(e.target.value) || 0 })}
                    className="w-full p-2 bg-white border border-slate-300 rounded-md disabled:bg-slate-100 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">GỒM CÁC XÃ / PHƯỜNG:</label>
                  <input
                    type="text"
                    disabled={!isEditingUnit}
                    value={unitForm.hdndTinhWards}
                    onChange={e => setUnitForm({ ...unitForm, hdndTinhWards: e.target.value })}
                    className="w-full p-2 bg-white border border-slate-300 rounded-md disabled:bg-slate-100 font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Đơn vị bầu cử HĐND Xã & Tổ bầu cử */}
            <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h3 className="font-bold text-sky-900 uppercase">4. Đơn vị bầu cử ĐB HĐND Xã & Khu vực bỏ phiếu</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">ĐƠN VỊ HĐND XÃ SỐ / GỒM THÔN:</label>
                  <input
                    type="text"
                    disabled={!isEditingUnit}
                    value={unitForm.hdndXaVillages}
                    onChange={e => setUnitForm({ ...unitForm, hdndXaVillages: e.target.value })}
                    className="w-full p-2 bg-white border border-slate-300 rounded-md disabled:bg-slate-100 font-medium"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">KHU VỰC BỎ PHIẾU SỐ:</label>
                    <input
                      type="number"
                      disabled={!isEditingUnit}
                      value={unitForm.votingAreaNo}
                      onChange={e => setUnitForm({ ...unitForm, votingAreaNo: parseInt(e.target.value) || 0 })}
                      className="w-full p-2 bg-white border border-slate-300 rounded-md disabled:bg-slate-100 font-bold text-sky-700"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">XÃ / PHƯỜNG / THỊ TRẤN:</label>
                    <input
                      type="text"
                      disabled={!isEditingUnit}
                      value={unitForm.wardName}
                      onChange={e => setUnitForm({ ...unitForm, wardName: e.target.value })}
                      className="w-full p-2 bg-white border border-slate-300 rounded-md disabled:bg-slate-100 font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: NHÂN SỰ TỔ BẦU CỬ */}
      {activeSubTab === 'committee' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-800">DANH SÁCH THÀNH VIÊN TỔ BẦU CỬ SỐ {unit.votingAreaNo}</h2>
              <p className="text-xs text-slate-500">Tổ trưởng, Thư ký và các Ủy viên phụ trách kiểm phiếu</p>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200">
                <tr>
                  <th className="p-3 w-12 text-center">STT</th>
                  <th className="p-3">Họ và tên</th>
                  <th className="p-3">Chức vụ trong Tổ</th>
                  <th className="p-3">Số CCCD</th>
                  <th className="p-3">Số điện thoại</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {committee.map(m => (
                  <tr key={m.id} className="hover:bg-slate-50">
                    <td className="p-3 text-center font-bold text-slate-600">{m.stt}</td>
                    <td className="p-3 font-bold text-slate-800">{m.fullName}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          m.role === 'Tổ trưởng'
                            ? 'bg-amber-100 text-amber-800'
                            : m.role === 'Thư ký'
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {m.role}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-slate-600">{m.idCard || '---'}</td>
                    <td className="p-3 font-mono text-slate-600">{m.phone || '---'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: CỬ TRI CHỨNG KIẾN */}
      {activeSubTab === 'witnesses' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-800">DANH SÁCH CỬ TRI CHỨNG KIẾN MỞ THÙNG PHIẾU</h2>
            <p className="text-xs text-slate-500">Cử tri đại diện tham gia kiểm kê niêm phong và chứng kiến kiểm phiếu</p>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200">
                <tr>
                  <th className="p-3 w-12 text-center">STT</th>
                  <th className="p-3">Họ và tên cử tri</th>
                  <th className="p-3">Địa chỉ / Thôn</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {witnesses.map(w => (
                  <tr key={w.id} className="hover:bg-slate-50">
                    <td className="p-3 text-center font-bold text-slate-600">{w.stt}</td>
                    <td className="p-3 font-bold text-slate-800">{w.fullName}</td>
                    <td className="p-3 text-slate-600">{w.address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: ỨNG CỬ VIÊN 3 CẤP */}
      {activeSubTab === 'candidates' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
          {/* Select Election Level */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              {(['QUOC_HOI', 'HDND_TINH', 'HDND_XA'] as ElectionLevel[]).map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setSelectedLevel(lvl)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    selectedLevel === lvl
                      ? 'bg-sky-600 text-white shadow-md shadow-sky-900/20'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {configs[lvl].levelName}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 bg-sky-50 p-2 rounded-lg border border-sky-200 text-xs">
              <span className="font-semibold text-sky-900">Số ĐB được bầu (K):</span>
              <input
                type="number"
                min={1}
                max={10}
                value={currentConfig.numRepresentatives}
                onChange={e =>
                  updateLevelConfig(selectedLevel, {
                    numRepresentatives: parseInt(e.target.value) || 1,
                  })
                }
                className="w-16 p-1 bg-white border border-sky-300 rounded font-bold text-center text-sky-800"
              />
              <span className="text-slate-500">| Tổng cử tri: {currentConfig.totalVoters}</span>
            </div>
          </div>

          {/* Candidate List Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
              DANH SÁCH ỨNG CỬ VIÊN {currentConfig.levelName.toUpperCase()} (THỨ TỰ PHIẾU BẦU)
            </h3>

            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200">
                  <tr>
                    <th className="p-3 w-16 text-center">STT Bầu</th>
                    <th className="p-3">Họ và tên ứng cử viên</th>
                    <th className="p-3 w-24 text-center">Giới tính</th>
                    <th className="p-3 w-32 text-center">Ngày sinh</th>
                    <th className="p-3 w-28 text-center">Số phiếu nhận</th>
                    <th className="p-3 w-24 text-center">Tỷ lệ %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {levelCandidates.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="p-3 text-center">
                        <span className="w-7 h-7 rounded-full bg-sky-100 text-sky-800 font-bold text-xs inline-flex items-center justify-center">
                          {c.stt}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-slate-800 text-sm">{c.fullName}</td>
                      <td className="p-3 text-center text-slate-600">{c.gender}</td>
                      <td className="p-3 text-center font-mono text-slate-600">{c.dob}</td>
                      <td className="p-3 text-center font-bold text-emerald-600 text-sm">{c.voteCount}</td>
                      <td className="p-3 text-center font-bold text-sky-700">{c.votePercentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
