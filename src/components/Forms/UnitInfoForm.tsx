import React, { useState } from 'react';
import { VotingUnit, ElectionPersonnel, WitnessVoter } from '../../types';
import { Check, X, Plus, Trash2 } from 'lucide-react';

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
        <div className="bg-emerald-100 border border-emerald-500 text-emerald-800 px-3 py-1.5 rounded my-2 text-xs font-bold flex items-center space-x-1">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{savingMsg}</span>
        </div>
      )}

      {/* Tabs (.:: Đơn vị bầu cử, .:: Nhân sự tổ bầu cử, .:: Cử tri chứng kiến) */}
      <div className="flex border-b border-slate-300 bg-slate-200 mt-2 font-bold text-slate-700">
        <button
          onClick={() => setActiveSubTab('don_vi')}
          className={`px-4 py-1.5 border-t border-x rounded-t transition ${
            activeSubTab === 'don_vi' ? 'bg-slate-50 text-sky-900 border-slate-400 border-b-transparent shadow-xs' : 'hover:bg-slate-300'
          }`}
        >
          .:: Đơn vị bầu cử
        </button>

        <button
          onClick={() => setActiveSubTab('nhan_su')}
          className={`px-4 py-1.5 border-t border-x rounded-t transition ${
            activeSubTab === 'nhan_su' ? 'bg-slate-50 text-sky-900 border-slate-400 border-b-transparent shadow-xs' : 'hover:bg-slate-300'
          }`}
        >
          .:: Nhân sự tổ bầu cử
        </button>

        <button
          onClick={() => setActiveSubTab('cu_tri')}
          className={`px-4 py-1.5 border-t border-x rounded-t transition ${
            activeSubTab === 'cu_tri' ? 'bg-slate-50 text-sky-900 border-slate-400 border-b-transparent shadow-xs' : 'hover:bg-slate-300'
          }`}
        >
          .:: Cử tri chứng kiến
        </button>
      </div>

      {/* Tab 1 Content: Đơn vị bầu cử */}
      {activeSubTab === 'don_vi' && (
        <div className="bg-slate-50 border border-slate-300 p-4 space-y-4 shadow-inner">
          
          {/* Header Row: Tỉnh/Thành phố, Khóa, Nút Lưu */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-dashed border-slate-400 pb-3">
            <div className="flex items-center space-x-3">
              <span className="font-extrabold text-red-700 text-sm">*** TỈNH/THÀNH PHỐ:</span>
              <select
                value={formData.province}
                onChange={e => setFormData({ ...formData, province: e.target.value })}
                className="bg-white border border-slate-400 rounded px-3 py-1 font-bold text-slate-800 focus:outline-none"
              >
                <option value="Thành phố Đà Nẵng">Thành phố Đà Nẵng</option>
                <option value="Thành phố Hà Nội">Thành phố Hà Nội</option>
                <option value="Thành phố Hồ Chí Minh">Thành phố Hồ Chí Minh</option>
                <option value="Tỉnh Quảng Nam">Tỉnh Quảng Nam</option>
              </select>

              <span className="font-bold text-slate-800 ml-4">KHÓA:</span>
              <input
                type="text"
                value={formData.term}
                onChange={e => setFormData({ ...formData, term: e.target.value })}
                className="w-20 bg-white border border-slate-400 text-center font-bold px-2 py-1"
              />
            </div>

            <button
              onClick={handleSave}
              className="flex items-center space-x-1.5 px-4 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-500 rounded font-bold shadow-xs transition"
            >
              <Check className="w-4 h-4 text-emerald-700" />
              <span>Lưu</span>
            </button>
          </div>

          {/* 1. Đơn vị bầu cử Đại biểu Quốc Hội */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">1. Đơn vị bầu cử Đại biểu Quốc Hội:</span>
              <span className="text-[11px] text-purple-700 italic">
                (Ghi đầy đủ Cấp + Tên. Ví dụ: Phường Tân Định, Xã Thạnh An...)
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-red-700 font-bold">‣ Số:</span>
              <input
                type="text"
                value={formData.quocHoiUnitNo}
                onChange={e => setFormData({ ...formData, quocHoiUnitNo: e.target.value })}
                className="w-16 bg-white border border-slate-400 text-center font-bold py-1"
              />
              <span className="text-red-700 font-bold ml-2">‣ Gồm Xã/Phường/Đặc khu:</span>
              <input
                type="text"
                value={formData.quocHoiAreas}
                onChange={e => setFormData({ ...formData, quocHoiAreas: e.target.value })}
                className="flex-1 bg-white border border-slate-400 px-3 py-1 text-slate-800"
                placeholder="Ví dụ: Đặc khu Hoàng Sa, Phường An Hải..."
              />
            </div>
          </div>

          <hr className="border-dashed border-slate-300" />

          {/* 2. Đơn vị bầu cử Đại biểu HĐND Tỉnh */}
          <div className="space-y-1">
            <span className="font-bold text-slate-900 block">2. Đơn vị bầu cử Đại biểu HĐND Tỉnh:</span>
            <div className="flex items-center space-x-2">
              <span className="text-red-700 font-bold">‣ Số:</span>
              <input
                type="text"
                value={formData.hdndTinhUnitNo}
                onChange={e => setFormData({ ...formData, hdndTinhUnitNo: e.target.value })}
                className="w-16 bg-white border border-slate-400 text-center font-bold py-1"
              />
              <span className="text-red-700 font-bold ml-2">‣ Gồm Xã/Phường/Đặc khu:</span>
              <input
                type="text"
                value={formData.hdndTinhAreas}
                onChange={e => setFormData({ ...formData, hdndTinhAreas: e.target.value })}
                className="flex-1 bg-white border border-slate-400 px-3 py-1 text-slate-800"
                placeholder="Ví dụ: Xã Hòa Vang, Xã Hòa Tiến, Xã Bà Nà"
              />
            </div>
          </div>

          <hr className="border-dashed border-slate-300" />

          {/* 3. Đơn vị bầu cử Đại biểu HĐND Xã */}
          <div className="space-y-1">
            <span className="font-bold text-slate-900 block">3. Đơn vị bầu cử Đại biểu HĐND Xã:</span>
            <div className="flex items-center space-x-2">
              <span className="text-red-700 font-bold">‣ Số:</span>
              <input
                type="text"
                value={formData.hdndXaUnitNo}
                onChange={e => setFormData({ ...formData, hdndXaUnitNo: e.target.value })}
                className="w-16 bg-white border border-slate-400 text-center font-bold py-1"
              />
              <span className="text-red-700 font-bold ml-2">‣ Gồm Thôn/Tổ dân phố:</span>
              <input
                type="text"
                value={formData.hdndXaAreas}
                onChange={e => setFormData({ ...formData, hdndXaAreas: e.target.value })}
                className="flex-1 bg-white border border-slate-400 px-3 py-1 text-slate-800"
                placeholder="Ví dụ: Nam Sơn, Lệ Sơn 2, An Trạch"
              />
            </div>
          </div>

          {/* Khung Tổ Bầu Cử */}
          <div className="bg-slate-200/60 border border-slate-400 rounded p-3 space-y-2">
            <span className="font-extrabold text-slate-900 block underline">Tổ bầu cử:</span>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-red-700 font-bold">‣ Khu vực bỏ phiếu số:</span>
                <input
                  type="text"
                  value={formData.votingArea.replace(/[^0-9]/g, '') || '21'}
                  onChange={e => setFormData({ ...formData, votingArea: `Khu vực bỏ phiếu số ${e.target.value}` })}
                  className="w-20 bg-white border border-slate-400 text-center font-bold py-1"
                />
              </div>

              <div className="flex items-center space-x-2 flex-1">
                <span className="text-red-700 font-bold">‣ Xã/Phường/Đặc khu:</span>
                <input
                  type="text"
                  value={formData.commune}
                  onChange={e => setFormData({ ...formData, commune: e.target.value })}
                  className="flex-1 bg-white border border-slate-400 px-3 py-1 text-slate-800"
                />
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Tab 2 Content: Nhân sự tổ bầu cử */}
      {activeSubTab === 'nhan_su' && (
        <div className="bg-slate-50 border border-slate-300 p-4 space-y-3 shadow-inner">
          <h3 className="font-bold text-slate-900 text-sm border-b pb-1">
            DANH SÁCH THÀNH VIÊN TỔ KIỂM PHIẾU BẦU CỬ
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-red-700 block mb-1">Tổ trưởng Tổ kiểm phiếu:</label>
              <input
                type="text"
                value={personnel.toTruong}
                onChange={e => setPersonnel({ ...personnel, toTruong: e.target.value })}
                className="w-full bg-white border border-slate-400 px-3 py-1.5 font-semibold text-slate-800"
              />
            </div>

            <div>
              <label className="font-bold text-red-700 block mb-1">Thư ký Tổ kiểm phiếu:</label>
              <input
                type="text"
                value={personnel.thuKy}
                onChange={e => setPersonnel({ ...personnel, thuKy: e.target.value })}
                className="w-full bg-white border border-slate-400 px-3 py-1.5 font-semibold text-slate-800"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Ủy viên 1:</label>
              <input
                type="text"
                value={personnel.uyVien1}
                onChange={e => setPersonnel({ ...personnel, uyVien1: e.target.value })}
                className="w-full bg-white border border-slate-400 px-3 py-1.5 text-slate-800"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Ủy viên 2:</label>
              <input
                type="text"
                value={personnel.uyVien2}
                onChange={e => setPersonnel({ ...personnel, uyVien2: e.target.value })}
                className="w-full bg-white border border-slate-400 px-3 py-1.5 text-slate-800"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 3 Content: Cử tri chứng kiến */}
      {activeSubTab === 'cu_tri' && (
        <div className="bg-slate-50 border border-slate-300 p-4 space-y-3 shadow-inner">
          <h3 className="font-bold text-slate-900 text-sm border-b pb-1">
            DANH SÁCH CỬ TRI CHỨNG KIẾN MỞ HÒM PHIẾU & KIỂM PHIẾU
          </h3>

          <table className="w-full border-collapse border border-slate-300 text-left bg-white">
            <thead>
              <tr className="bg-slate-200 font-bold text-slate-800">
                <th className="border border-slate-300 p-2 text-center w-12">STT</th>
                <th className="border border-slate-300 p-2">Họ và tên cử tri chứng kiến</th>
                <th className="border border-slate-300 p-2">Địa chỉ thường trú</th>
                <th className="border border-slate-300 p-2">Số CCCD / CMND</th>
              </tr>
            </thead>
            <tbody>
              {witnesses.map((w, idx) => (
                <tr key={idx}>
                  <td className="border border-slate-300 p-2 text-center font-bold">{idx + 1}</td>
                  <td className="border border-slate-300 p-2">
                    <input
                      type="text"
                      value={w.fullName}
                      onChange={e => {
                        const updated = [...witnesses];
                        updated[idx].fullName = e.target.value;
                        setWitnesses(updated);
                      }}
                      className="w-full border border-slate-300 px-2 py-1 font-semibold"
                    />
                  </td>
                  <td className="border border-slate-300 p-2">
                    <input
                      type="text"
                      value={w.address}
                      onChange={e => {
                        const updated = [...witnesses];
                        updated[idx].address = e.target.value;
                        setWitnesses(updated);
                      }}
                      className="w-full border border-slate-300 px-2 py-1"
                    />
                  </td>
                  <td className="border border-slate-300 p-2">
                    <input
                      type="text"
                      value={w.idCard}
                      onChange={e => {
                        const updated = [...witnesses];
                        updated[idx].idCard = e.target.value;
                        setWitnesses(updated);
                      }}
                      className="w-full border border-slate-300 px-2 py-1 text-center"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};
