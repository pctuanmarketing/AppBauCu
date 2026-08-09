import React, { useState } from 'react';
import { VotingUnit, ElectionPersonnelMember, WitnessVoter } from '../../types';
import { Check, X, Save, Trash2, ChevronLeft, ChevronRight, SkipBack, SkipForward, Plus } from 'lucide-react';

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

  // Form State Tab 2: Personnel Members (Khớp 100% hình chụp Access)
  const [personnelList, setPersonnelList] = useState<ElectionPersonnelMember[]>([
    { stt: 1, fullName: 'Nguyễn Đính', position: 'Tổ trưởng', idCard: '', phone: '0905628031' },
    { stt: 2, fullName: 'Đặng Thức', position: 'Thư ký', idCard: '', phone: '0905628660' },
    { stt: 3, fullName: 'Đặng Thử', position: 'Ủy viên', idCard: '', phone: '' },
    { stt: 4, fullName: 'Nguyễn Quang Thơ', position: 'Ủy viên', idCard: '', phone: '' },
    { stt: 5, fullName: 'Đặng Văn Quang', position: 'Ủy viên', idCard: '', phone: '' },
    { stt: 6, fullName: 'Phạm Công Tuân', position: 'Ủy viên', idCard: '', phone: '' },
    { stt: 7, fullName: 'Lê Thị Kim Nhung', position: 'Ủy viên', idCard: '', phone: '' },
    { stt: 8, fullName: 'Nguyễn Hiếu Nghĩa', position: 'Ủy viên', idCard: '', phone: '' },
    { stt: 9, fullName: 'Đặng Ngọc Duy', position: 'Ủy viên', idCard: '', phone: '' },
    { stt: 10, fullName: 'Nguyễn Thị Hương Triều', position: 'Ủy viên', idCard: '', phone: '' },
    { stt: 11, fullName: 'Đặng Nhất Sinh', position: 'Ủy viên', idCard: '', phone: '' },
    { stt: 12, fullName: 'Lê Thị Mỹ Nga', position: 'Ủy viên', idCard: '', phone: '' },
    { stt: 13, fullName: 'Đinh Tuân', position: 'Ủy viên', idCard: '', phone: '' },
    { stt: 14, fullName: 'Huỳnh Thị Nga', position: 'Ủy viên', idCard: '', phone: '' },
  ]);

  const [selectedPersonnelIdx, setSelectedPersonnelIdx] = useState<number>(0);

  // Form State Tab 3: Witness Voters
  const [witnesses, setWitnesses] = useState<WitnessVoter[]>([
    { stt: 1, fullName: 'Nguyễn Bảng', address: 'Thôn An Trạch, Xã Hòa Tiến', idCard: '048085001234', phone: '0912345678' },
    { stt: 2, fullName: 'Trần Thị Mỹ', address: 'Thôn Lệ Sơn 2, Xã Hòa Tiến', idCard: '048190005678', phone: '0987654321' }
  ]);

  const [savingMsg, setSavingMsg] = useState('');

  const handleSave = async () => {
    await onSaveUnit(formData);
    setSavingMsg('Đã lưu dữ liệu thành công!');
    setTimeout(() => setSavingMsg(''), 3000);
  };

  const handleUpdatePersonnel = (idx: number, field: keyof ElectionPersonnelMember, val: any) => {
    const updated = [...personnelList];
    updated[idx] = { ...updated[idx], [field]: val };
    setPersonnelList(updated);
  };

  const handleAddPersonnel = () => {
    const newMember: ElectionPersonnelMember = {
      stt: personnelList.length + 1,
      fullName: '',
      position: 'Ủy viên',
      idCard: '',
      phone: ''
    };
    setPersonnelList([...personnelList, newMember]);
    setSelectedPersonnelIdx(personnelList.length);
  };

  const handleDeletePersonnel = (idx: number) => {
    const updated = personnelList.filter((_, i) => i !== idx).map((m, i) => ({ ...m, stt: i + 1 }));
    setPersonnelList(updated);
    if (selectedPersonnelIdx >= updated.length) {
      setSelectedPersonnelIdx(Math.max(0, updated.length - 1));
    }
  };

  return (
    <div className="bg-slate-100 border-2 border-red-500/60 rounded-sm shadow-2xl p-2 font-sans text-xs max-w-5xl mx-auto my-4 text-slate-900 select-none">
      
      {/* Top Banner Title "THÔNG TIN ĐƠN VỊ BẦU CỬ" (Giống 100% hình chụp Access) */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 text-white px-4 py-2 flex items-center justify-between shadow-md">
        <span className="font-extrabold text-sm tracking-wider uppercase">
          THÔNG TIN ĐƠN VỊ BẦU CỬ
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

      {/* 3 Main Tabs */}
      <div className="flex border-b border-sky-400 mt-2 bg-slate-200">
        <button
          onClick={() => setActiveSubTab('don_vi')}
          className={`px-5 py-2 font-bold transition border-t-2 ${
            activeSubTab === 'don_vi'
              ? 'bg-slate-100 border-sky-700 text-sky-900 shadow-xs'
              : 'border-transparent text-slate-700 hover:bg-slate-300'
          }`}
        >
          .:: Đơn vị bầu cử
        </button>
        <button
          onClick={() => setActiveSubTab('nhan_su')}
          className={`px-5 py-2 font-bold transition border-t-2 ${
            activeSubTab === 'nhan_su'
              ? 'bg-slate-100 border-sky-700 text-red-700 font-black shadow-xs'
              : 'border-transparent text-slate-700 hover:bg-slate-300'
          }`}
        >
          .:: Nhân sự tổ bầu cử
        </button>
        <button
          onClick={() => setActiveSubTab('cu_tri')}
          className={`px-5 py-2 font-bold transition border-t-2 ${
            activeSubTab === 'cu_tri'
              ? 'bg-slate-100 border-sky-700 text-sky-900 shadow-xs'
              : 'border-transparent text-slate-700 hover:bg-slate-300'
          }`}
        >
          .:: Cử tri chứng kiến
        </button>
      </div>

      {/* TAB 1: ĐƠN VỊ BẦU CỬ */}
      {activeSubTab === 'don_vi' && (
        <div className="p-4 bg-slate-50 border-x border-b border-sky-300 space-y-4 font-sans text-xs">
          
          <div className="flex flex-wrap items-center gap-3 bg-slate-100 p-2.5 rounded border border-slate-300">
            <span className="font-extrabold text-red-700 text-sm">*** TỈNH/THÀNH PHỐ:</span>
            <input
              type="text"
              value={formData.province}
              onChange={e => setFormData({ ...formData, province: e.target.value })}
              className="bg-white border border-slate-400 rounded px-2.5 py-1 font-bold text-slate-900 w-60"
            />

            <span className="font-extrabold text-slate-900 text-sm ml-4">KHÓA:</span>
            <input
              type="text"
              value={formData.term}
              onChange={e => setFormData({ ...formData, term: e.target.value })}
              className="bg-white border border-slate-400 rounded px-2.5 py-1 font-extrabold text-sky-900 text-center w-20"
            />

            <button
              onClick={handleSave}
              className="ml-auto px-5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-400 rounded font-bold transition flex items-center space-x-1 shadow-xs"
            >
              <Check className="w-4 h-4 text-emerald-700" />
              <span>Lưu</span>
            </button>
          </div>

          <div className="space-y-2 pt-1">
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-slate-900 text-xs">1. Đơn vị bầu cử Đại biểu Quốc Hội:</span>
              <span className="text-[11px] text-purple-700 italic font-semibold">(Ghi đầy đủ Cấp + Tên. Ví dụ: Phường Tân Định, Xã Thạnh An...)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center pl-4">
              <div className="md:col-span-3 flex items-center space-x-1">
                <span className="text-red-700 font-bold text-xs">▶ Số:</span>
                <input
                  type="text"
                  value={formData.quocHoiUnitNo}
                  onChange={e => setFormData({ ...formData, quocHoiUnitNo: e.target.value })}
                  className="bg-white border border-slate-400 rounded px-2 py-1 font-bold text-center w-16"
                />
              </div>

              <div className="md:col-span-9 flex items-center space-x-1">
                <span className="text-red-700 font-bold text-xs whitespace-nowrap">▶ Gồm Xã/Phường/Đặc khu:</span>
                <input
                  type="text"
                  value={formData.quocHoiAreas}
                  onChange={e => setFormData({ ...formData, quocHoiAreas: e.target.value })}
                  className="bg-white border border-slate-400 rounded px-2.5 py-1 font-medium w-full"
                />
              </div>
            </div>
          </div>

          <div className="border-b-2 border-dashed border-slate-300 my-2"></div>

          <div className="space-y-2">
            <span className="font-extrabold text-slate-900 text-xs">2. Đơn vị bầu cử Đại biểu HĐND Tỉnh:</span>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center pl-4">
              <div className="md:col-span-3 flex items-center space-x-1">
                <span className="text-red-700 font-bold text-xs">▶ Số:</span>
                <input
                  type="text"
                  value={formData.hdndTinhUnitNo}
                  onChange={e => setFormData({ ...formData, hdndTinhUnitNo: e.target.value })}
                  className="bg-white border border-slate-400 rounded px-2 py-1 font-bold text-center w-16"
                />
              </div>

              <div className="md:col-span-9 flex items-center space-x-1">
                <span className="text-red-700 font-bold text-xs whitespace-nowrap">▶ Gồm Xã/Phường/Đặc khu:</span>
                <input
                  type="text"
                  value={formData.hdndTinhAreas}
                  onChange={e => setFormData({ ...formData, hdndTinhAreas: e.target.value })}
                  className="bg-white border border-slate-400 rounded px-2.5 py-1 font-medium w-full"
                />
              </div>
            </div>
          </div>

          <div className="border-b-2 border-dashed border-slate-300 my-2"></div>

          <div className="space-y-2">
            <span className="font-extrabold text-slate-900 text-xs">3. Đơn vị bầu cử Đại biểu HĐND Xã:</span>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center pl-4">
              <div className="md:col-span-3 flex items-center space-x-1">
                <span className="text-red-700 font-bold text-xs">▶ Số:</span>
                <input
                  type="text"
                  value={formData.hdndXaUnitNo}
                  onChange={e => setFormData({ ...formData, hdndXaUnitNo: e.target.value })}
                  className="bg-white border border-slate-400 rounded px-2 py-1 font-bold text-center w-16"
                />
              </div>

              <div className="md:col-span-9 flex items-center space-x-1">
                <span className="text-red-700 font-bold text-xs whitespace-nowrap">▶ Gồm Thôn/Tổ dân phố:</span>
                <input
                  type="text"
                  value={formData.hdndXaAreas}
                  onChange={e => setFormData({ ...formData, hdndXaAreas: e.target.value })}
                  className="bg-white border border-slate-400 rounded px-2.5 py-1 font-medium w-full"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-200/80 border border-slate-300 rounded p-3 space-y-2 mt-4">
            <span className="font-extrabold text-slate-900 text-xs uppercase block border-b border-slate-300 pb-1">Tổ bầu cử:</span>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
              <div className="md:col-span-4 flex items-center space-x-1">
                <span className="text-red-700 font-bold text-xs whitespace-nowrap">▶ Khu vực bỏ phiếu số:</span>
                <input
                  type="text"
                  value={formData.unitName.replace(/\D/g, '') || '21'}
                  onChange={e => setFormData({ ...formData, unitName: `Khu vực bỏ phiếu số ${e.target.value}` })}
                  className="bg-white border border-slate-400 rounded px-2 py-1 font-bold text-center w-20"
                />
              </div>

              <div className="md:col-span-8 flex items-center space-x-1">
                <span className="text-red-700 font-bold text-xs whitespace-nowrap">▶ Xã/Phường/Đặc khu:</span>
                <input
                  type="text"
                  value={formData.commune}
                  onChange={e => setFormData({ ...formData, commune: e.target.value })}
                  className="bg-white border border-slate-400 rounded px-2.5 py-1 font-medium w-full"
                />
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: NHÂN SỰ TỔ BẦU CỬ (Giống 100% hình chụp Access) */}
      {activeSubTab === 'nhan_su' && (
        <div className="p-3 bg-slate-50 border-x border-b border-sky-300 space-y-3 font-sans text-xs">
          
          <div className="flex justify-between items-center bg-slate-100 p-2 border border-slate-300 rounded">
            <span className="font-extrabold text-slate-900 uppercase">DANH SÁCH THÀNH VIÊN TỔ KIỂM PHIẾU ({personnelList.length} nhân sự)</span>
            <button
              onClick={handleAddPersonnel}
              className="px-3 py-1 bg-sky-700 hover:bg-sky-800 text-white rounded font-bold transition flex items-center space-x-1 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm dòng mới</span>
            </button>
          </div>

          {/* Access Table Design */}
          <div className="border-2 border-slate-400 rounded overflow-x-auto bg-white max-h-[50vh] overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gradient-to-b from-slate-200 to-slate-300 text-slate-900 font-bold border-b-2 border-slate-400 text-[11px]">
                  <th className="p-1.5 w-8 text-center border-r border-slate-300"></th>
                  <th className="p-1.5 w-12 text-center border-r border-slate-300">Stt</th>
                  <th className="p-1.5 border-r border-slate-300">Họ và tên</th>
                  <th className="p-1.5 w-44 border-r border-slate-300">Chức vụ</th>
                  <th className="p-1.5 w-40 border-r border-slate-300">Số CCCD</th>
                  <th className="p-1.5 w-40 border-r border-slate-300">Số điện thoại</th>
                  <th className="p-1.5 w-20 text-center">---</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300 text-xs">
                {personnelList.map((m, idx) => {
                  const isSelected = idx === selectedPersonnelIdx;
                  return (
                    <tr
                      key={idx}
                      onClick={() => setSelectedPersonnelIdx(idx)}
                      className={`transition ${isSelected ? 'bg-amber-100/90 font-bold' : 'hover:bg-slate-100'}`}
                    >
                      {/* Record Selector Arrow */}
                      <td className="p-1 text-center border-r border-slate-300 font-bold text-slate-800 w-8">
                        {isSelected ? '▶' : ''}
                      </td>

                      {/* STT */}
                      <td className="p-1 text-center font-extrabold border-r border-slate-300 w-12 text-slate-900">
                        {m.stt}
                      </td>

                      {/* Họ và tên */}
                      <td className="p-1 border-r border-slate-300">
                        <input
                          type="text"
                          value={m.fullName}
                          onChange={e => handleUpdatePersonnel(idx, 'fullName', e.target.value)}
                          className="w-full bg-transparent px-1.5 py-0.5 font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500 rounded"
                        />
                      </td>

                      {/* Chức vụ */}
                      <td className="p-1 border-r border-slate-300">
                        <select
                          value={m.position}
                          onChange={e => handleUpdatePersonnel(idx, 'position', e.target.value)}
                          className="w-full bg-transparent px-1 py-0.5 font-semibold text-slate-800 focus:bg-white focus:outline-none rounded"
                        >
                          <option value="Tổ trưởng">Tổ trưởng</option>
                          <option value="Thư ký">Thư ký</option>
                          <option value="Ủy viên">Ủy viên</option>
                        </select>
                      </td>

                      {/* Số CCCD */}
                      <td className="p-1 border-r border-slate-300">
                        <input
                          type="text"
                          value={m.idCard || ''}
                          onChange={e => handleUpdatePersonnel(idx, 'idCard', e.target.value)}
                          placeholder="Số CCCD..."
                          className="w-full bg-transparent px-1 py-0.5 font-mono text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500 rounded"
                        />
                      </td>

                      {/* Số điện thoại */}
                      <td className="p-1 border-r border-slate-300">
                        <input
                          type="text"
                          value={m.phone || ''}
                          onChange={e => handleUpdatePersonnel(idx, 'phone', e.target.value)}
                          placeholder="Ví dụ: 0905628031..."
                          className="w-full bg-transparent px-1 py-0.5 font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500 rounded"
                        />
                      </td>

                      {/* Actions: x and floppy disk */}
                      <td className="p-1 text-center space-x-1 w-20">
                        <button
                          onClick={() => handleDeletePersonnel(idx)}
                          className="px-1.5 py-0.5 bg-white border border-red-400 hover:bg-red-100 text-red-700 rounded font-extrabold text-[11px]"
                          title="Xóa dòng"
                        >
                          X
                        </button>
                        <button
                          onClick={handleSave}
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
                onClick={() => setSelectedPersonnelIdx(0)}
                className="p-1 hover:bg-slate-300 rounded font-bold"
                title="Đầu tiên"
              >
                |◄
              </button>
              <button
                onClick={() => setSelectedPersonnelIdx(Math.max(0, selectedPersonnelIdx - 1))}
                className="p-1 hover:bg-slate-300 rounded font-bold"
                title="Trước đó"
              >
                ◄
              </button>

              <span className="px-2 py-0.5 bg-white border border-slate-400 rounded font-bold text-center">
                {personnelList.length > 0 ? selectedPersonnelIdx + 1 : 0} of {personnelList.length}
              </span>

              <button
                onClick={() => setSelectedPersonnelIdx(Math.min(personnelList.length - 1, selectedPersonnelIdx + 1))}
                className="p-1 hover:bg-slate-300 rounded font-bold"
                title="Tiếp theo"
              >
                ►
              </button>
              <button
                onClick={() => setSelectedPersonnelIdx(Math.max(0, personnelList.length - 1))}
                className="p-1 hover:bg-slate-300 rounded font-bold"
                title="Cuối cùng"
              >
                ►|
              </button>
              <button
                onClick={handleAddPersonnel}
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
      )}

      {/* TAB 3: CỬ TRI CHỨNG KIẾN */}
      {activeSubTab === 'cu_tri' && (
        <div className="p-3 bg-slate-50 border-x border-b border-sky-300 space-y-3 font-sans text-xs">
          
          <div className="flex justify-between items-center bg-slate-100 p-2 border border-slate-300 rounded">
            <span className="font-extrabold text-slate-900 uppercase">DANH SÁCH CỬ TRI CHỨNG KIẾN MỞ THÙNG PHIẾU ({witnesses.length} cử tri)</span>
            <button
              onClick={() => {
                const newW: WitnessVoter = {
                  stt: witnesses.length + 1,
                  fullName: '',
                  address: '',
                  idCard: '',
                  phone: ''
                };
                setWitnesses([...witnesses, newW]);
              }}
              className="px-3 py-1 bg-sky-700 hover:bg-sky-800 text-white rounded font-bold transition flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm cử tri mới</span>
            </button>
          </div>

          <div className="border-2 border-slate-400 rounded overflow-x-auto bg-white">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gradient-to-b from-slate-200 to-slate-300 text-slate-900 font-bold border-b-2 border-slate-400 text-[11px]">
                  <th className="p-1.5 w-12 text-center border-r border-slate-300">Stt</th>
                  <th className="p-1.5 border-r border-slate-300">Họ và tên cử tri</th>
                  <th className="p-1.5 border-r border-slate-300">Địa chỉ cư trú</th>
                  <th className="p-1.5 w-40 border-r border-slate-300">Số CCCD</th>
                  <th className="p-1.5 w-40 border-r border-slate-300">Số điện thoại</th>
                  <th className="p-1.5 w-16 text-center">Xóa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300 text-xs">
                {witnesses.map((w, idx) => (
                  <tr key={idx} className="hover:bg-slate-100">
                    <td className="p-1.5 text-center font-bold border-r border-slate-300">{w.stt}</td>
                    <td className="p-1 border-r border-slate-300">
                      <input
                        type="text"
                        value={w.fullName}
                        onChange={e => {
                          const updated = [...witnesses];
                          updated[idx].fullName = e.target.value;
                          setWitnesses(updated);
                        }}
                        className="w-full bg-transparent px-1.5 py-0.5 font-bold text-slate-900 focus:bg-white focus:outline-none rounded"
                      />
                    </td>
                    <td className="p-1 border-r border-slate-300">
                      <input
                        type="text"
                        value={w.address}
                        onChange={e => {
                          const updated = [...witnesses];
                          updated[idx].address = e.target.value;
                          setWitnesses(updated);
                        }}
                        className="w-full bg-transparent px-1.5 py-0.5 text-slate-800 focus:bg-white focus:outline-none rounded"
                      />
                    </td>
                    <td className="p-1 border-r border-slate-300">
                      <input
                        type="text"
                        value={w.idCard}
                        onChange={e => {
                          const updated = [...witnesses];
                          updated[idx].idCard = e.target.value;
                          setWitnesses(updated);
                        }}
                        className="w-full bg-transparent px-1.5 py-0.5 font-mono text-slate-800 focus:bg-white focus:outline-none rounded"
                      />
                    </td>
                    <td className="p-1 border-r border-slate-300">
                      <input
                        type="text"
                        value={w.phone || ''}
                        onChange={e => {
                          const updated = [...witnesses];
                          updated[idx].phone = e.target.value;
                          setWitnesses(updated);
                        }}
                        className="w-full bg-transparent px-1.5 py-0.5 font-mono text-slate-800 focus:bg-white focus:outline-none rounded"
                      />
                    </td>
                    <td className="p-1 text-center">
                      <button
                        onClick={() => {
                          const updated = witnesses.filter((_, i) => i !== idx).map((item, i) => ({ ...item, stt: i + 1 }));
                          setWitnesses(updated);
                        }}
                        className="px-2 py-0.5 bg-white border border-red-400 text-red-700 hover:bg-red-100 rounded font-bold"
                      >
                        X
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end pt-2">
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
