import React, { useState } from 'react';
import { VotingUnit, ElectionPersonnel, WitnessVoter } from '../../types';
import { Check, X } from 'lucide-react';

interface UnitInfoFormProps {
  unit: VotingUnit;
  onSaveUnit: (unit: VotingUnit) => Promise<void>;
  onClose: () => void;
}

export const UnitInfoForm: React.FC<UnitInfoFormProps> = ({
  unit,
  onSaveUnit,
  onClose
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'don_vi' | 'nhan_su' | 'cu_tri'>('don_vi');

  // Form State Tab 1
  const [formData, setFormData] = useState<VotingUnit>({ ...unit });

  // Form State Tab 2: Personnel
  const [personnel, setPersonnel] = useState<ElectionPersonnel>({
    toTruong: 'Nguyễn Văn Phước',
    thuKy: 'Trần Thị Thu Hà',
    uyVien1: 'Phạm Minh Tuấn',
    uyVien2: 'Lê Thị Mai Hương',
    uyVien3: 'Hoàng Văn Nam'
  });

  // Form State Tab 3: Witness Voters
  const [witnesses, setWitnesses] = useState<WitnessVoter[]>([
    { stt: 1, fullName: 'Nguyễn Bảng', address: 'Thôn An Trạch, Xã Hòa Tiến', idCard: '048085001234' },
    { stt: 2, fullName: 'Trần Thị Mỹ', address: 'Thôn Lệ Sơn 2, Xã Hòa Tiến', idCard: '048190005678' }
  ]);

  const [savingMsg, setSavingMsg] = useState('');

  const handleSave = async () => {
    await onSaveUnit(formData);
    setSavingMsg('Đã lưu thông tin Đơn vị bầu cử thành công!');
    setTimeout(() => setSavingMsg(''), 3000);
  };

  return (
    <div className="bg-slate-100 border-2 border-red-500/80 rounded-sm shadow-xl p-2 font-sans text-xs max-w-5xl mx-auto my-4 text-slate-900">
      
      {/* Top Banner Title "THÔNG TIN ĐƠN VỊ BẦU CỬ" */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 text-white px-4 py-2 flex items-center justify-between shadow-md">
        <span className="font-extrabold text-sm tracking-wider uppercase">
          THÔNG TIN ĐƠN VỊ BẦU CỬ
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

      {/* 3 Main Tabs */}
      <div className="flex border-b border-slate-300 mt-2 bg-slate-200">
        <button
          onClick={() => setActiveSubTab('don_vi')}
          className={`px-4 py-2 font-bold transition border-t-2 ${
            activeSubTab === 'don_vi'
              ? 'bg-slate-100 border-red-700 text-red-700 shadow-xs'
              : 'border-transparent text-slate-700 hover:bg-slate-300'
          }`}
        >
          .:: Đơn vị bầu cử
        </button>
        <button
          onClick={() => setActiveSubTab('nhan_su')}
          className={`px-4 py-2 font-bold transition border-t-2 ${
            activeSubTab === 'nhan_su'
              ? 'bg-slate-100 border-red-700 text-red-700 shadow-xs'
              : 'border-transparent text-slate-700 hover:bg-slate-300'
          }`}
        >
          .:: Nhân sự tổ bầu cử
        </button>
        <button
          onClick={() => setActiveSubTab('cu_tri')}
          className={`px-4 py-2 font-bold transition border-t-2 ${
            activeSubTab === 'cu_tri'
              ? 'bg-slate-100 border-red-700 text-red-700 shadow-xs'
              : 'border-transparent text-slate-700 hover:bg-slate-300'
          }`}
        >
          .:: Cử tri chứng kiến
        </button>
      </div>

      {/* Tab 1 Content: Đơn vị bầu cử */}
      {activeSubTab === 'don_vi' && (
        <div className="p-4 bg-slate-50 border-x border-b border-slate-300 space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-800 block mb-1">Tên Tổ bầu cử (*)</label>
              <input
                type="text"
                value={formData.unitName}
                onChange={e => setFormData({ ...formData, unitName: e.target.value })}
                className="w-full bg-white border border-slate-400 rounded px-2.5 py-1.5 font-semibold focus:outline-none focus:border-red-600"
              />
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">Khu vực bỏ phiếu (*)</label>
              <input
                type="text"
                value={formData.votingArea}
                onChange={e => setFormData({ ...formData, votingArea: e.target.value })}
                className="w-full bg-white border border-slate-400 rounded px-2.5 py-1.5 font-semibold focus:outline-none focus:border-red-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label className="font-bold text-slate-800 block mb-1">Tỉnh / Thành phố</label>
              <input
                type="text"
                value={formData.province}
                onChange={e => setFormData({ ...formData, province: e.target.value })}
                className="w-full bg-white border border-slate-400 rounded px-2 py-1 font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">Huyện / Quận</label>
              <input
                type="text"
                value={formData.district}
                onChange={e => setFormData({ ...formData, district: e.target.value })}
                className="w-full bg-white border border-slate-400 rounded px-2 py-1 font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">Xã / Phường</label>
              <input
                type="text"
                value={formData.commune}
                onChange={e => setFormData({ ...formData, commune: e.target.value })}
                className="w-full bg-white border border-slate-400 rounded px-2 py-1 font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">Tổng số cử tri (*)</label>
              <input
                type="number"
                value={formData.totalVoters}
                onChange={e => setFormData({ ...formData, totalVoters: Number(e.target.value) })}
                className="w-full bg-white border border-slate-400 rounded px-2 py-1 font-black text-red-800"
              />
            </div>
          </div>

          <div className="border-t border-slate-300 pt-3 space-y-3">
            <h4 className="font-extrabold text-red-800 uppercase">Khai báo đơn vị bầu cử các Cấp</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-white p-3 border border-slate-300 rounded space-y-2">
                <span className="font-extrabold text-slate-900 block text-[11px] uppercase">1. Bầu cử ĐBQH</span>
                <div>
                  <label className="text-[11px] text-slate-600 block">Đơn vị số:</label>
                  <input
                    type="text"
                    value={formData.quocHoiUnitNo}
                    onChange={e => setFormData({ ...formData, quocHoiUnitNo: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2 py-0.5 font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-600 block">Địa bàn bầu cử:</label>
                  <textarea
                    rows={2}
                    value={formData.quocHoiAreas}
                    onChange={e => setFormData({ ...formData, quocHoiAreas: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2 py-1 text-[11px]"
                  />
                </div>
              </div>

              <div className="bg-white p-3 border border-slate-300 rounded space-y-2">
                <span className="font-extrabold text-slate-900 block text-[11px] uppercase">2. Bầu cử HĐND Tỉnh</span>
                <div>
                  <label className="text-[11px] text-slate-600 block">Đơn vị số:</label>
                  <input
                    type="text"
                    value={formData.hdndTinhUnitNo}
                    onChange={e => setFormData({ ...formData, hdndTinhUnitNo: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2 py-0.5 font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-600 block">Địa bàn bầu cử:</label>
                  <textarea
                    rows={2}
                    value={formData.hdndTinhAreas}
                    onChange={e => setFormData({ ...formData, hdndTinhAreas: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2 py-1 text-[11px]"
                  />
                </div>
              </div>

              <div className="bg-white p-3 border border-slate-300 rounded space-y-2">
                <span className="font-extrabold text-slate-900 block text-[11px] uppercase">3. Bầu cử HĐND Xã</span>
                <div>
                  <label className="text-[11px] text-slate-600 block">Đơn vị số:</label>
                  <input
                    type="text"
                    value={formData.hdndXaUnitNo}
                    onChange={e => setFormData({ ...formData, hdndXaUnitNo: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2 py-0.5 font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-600 block">Địa bàn bầu cử:</label>
                  <textarea
                    rows={2}
                    value={formData.hdndXaAreas}
                    onChange={e => setFormData({ ...formData, hdndXaAreas: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2 py-1 text-[11px]"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2 border-t border-slate-300">
            <button
              onClick={handleSave}
              className="px-5 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded font-bold transition flex items-center space-x-1 shadow-sm"
            >
              <Check className="w-4 h-4" />
              <span>Lưu thông tin</span>
            </button>
          </div>

        </div>
      )}

      {/* Tab 2 Content: Nhân sự tổ bầu cử */}
      {activeSubTab === 'nhan_su' && (
        <div className="p-4 bg-slate-50 border-x border-b border-slate-300 space-y-3">
          <h4 className="font-extrabold text-red-800 uppercase">Danh sách thành viên Tổ kiểm phiếu</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-800 block">Tổ trưởng (*)</label>
              <input
                type="text"
                value={personnel.toTruong}
                onChange={e => setPersonnel({ ...personnel, toTruong: e.target.value })}
                className="w-full bg-white border border-slate-400 rounded px-2.5 py-1 font-semibold"
              />
            </div>
            <div>
              <label className="font-bold text-slate-800 block">Thư ký (*)</label>
              <input
                type="text"
                value={personnel.thuKy}
                onChange={e => setPersonnel({ ...personnel, thuKy: e.target.value })}
                className="w-full bg-white border border-slate-400 rounded px-2.5 py-1 font-semibold"
              />
            </div>
            <div>
              <label className="font-bold text-slate-800 block">Ủy viên 1</label>
              <input
                type="text"
                value={personnel.uyVien1}
                onChange={e => setPersonnel({ ...personnel, uyVien1: e.target.value })}
                className="w-full bg-white border border-slate-400 rounded px-2.5 py-1"
              />
            </div>
            <div>
              <label className="font-bold text-slate-800 block">Ủy viên 2</label>
              <input
                type="text"
                value={personnel.uyVien2}
                onChange={e => setPersonnel({ ...personnel, uyVien2: e.target.value })}
                className="w-full bg-white border border-slate-400 rounded px-2.5 py-1"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-slate-300">
            <button
              onClick={handleSave}
              className="px-5 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded font-bold transition flex items-center space-x-1"
            >
              <Check className="w-4 h-4" />
              <span>Lưu danh sách nhân sự</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 3 Content: Cử tri chứng kiến */}
      {activeSubTab === 'cu_tri' && (
        <div className="p-4 bg-slate-50 border-x border-b border-slate-300 space-y-3">
          <h4 className="font-extrabold text-red-800 uppercase">Danh sách cử tri chứng kiến mở thùng phiếu</h4>
          <div className="border border-slate-300 rounded overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-200 text-slate-800 font-extrabold border-b border-slate-300">
                  <th className="p-2 w-12 text-center">STT</th>
                  <th className="p-2">Họ và tên cử tri</th>
                  <th className="p-2">Địa chỉ cư trú</th>
                  <th className="p-2 w-36">Số CCCD / CMND</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {witnesses.map(w => (
                  <tr key={w.stt} className="bg-white">
                    <td className="p-2 text-center font-bold">{w.stt}</td>
                    <td className="p-2 font-semibold">{w.fullName}</td>
                    <td className="p-2">{w.address}</td>
                    <td className="p-2 font-mono">{w.idCard}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end pt-2 border-t border-slate-300">
            <button
              onClick={handleSave}
              className="px-5 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded font-bold transition flex items-center space-x-1"
            >
              <Check className="w-4 h-4" />
              <span>Lưu danh sách cử tri</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
