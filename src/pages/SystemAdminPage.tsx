import React, { useState } from 'react';
import {
  Settings,
  Lock,
  Unlock,
  KeyRound,
  Database,
  Download,
  Upload,
  HelpCircle,
  Mail,
  Phone,
  UserCheck,
  ShieldAlert,
} from 'lucide-react';
import { SystemSettings, UserRole } from '../types';

interface SystemAdminPageProps {
  settings: SystemSettings;
  setSettings: React.Dispatch<React.SetStateAction<SystemSettings>>;
}

export const SystemAdminPage: React.FC<SystemAdminPageProps> = ({
  settings,
  setSettings,
}) => {
  const [passwordForm, setPasswordForm] = useState({ oldPass: '', newPass: '', confirmPass: '' });

  const handleToggleLock = () => {
    setSettings(prev => ({ ...prev, isLocked: !prev.isLocked }));
  };

  const handleBackupData = () => {
    const data = { ...localStorage };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SaoLuu_AppBauCu_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRestoreData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      try {
        const obj = JSON.parse(evt.target?.result as string);
        Object.keys(obj).forEach(key => {
          localStorage.setItem(key, obj[key]);
        });
        alert('✅ Phục hồi dữ liệu hệ thống thành công! Trang web sẽ tự tải lại.');
        window.location.reload();
      } catch (err) {
        alert('❌ Tệp sao lưu không hợp lệ.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Settings className="w-5 h-5 text-sky-600" />
            HỆ THỐNG & SAO LƯU DỮ LIỆU
          </h1>
          <p className="text-xs text-slate-500">Quản lý phân quyền, đổi mật khẩu, sao lưu & phục hồi dữ liệu bầu cử</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleLock}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow transition-all ${
              settings.isLocked
                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                : 'bg-rose-600 hover:bg-rose-700 text-white'
            }`}
          >
            {settings.isLocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            <span>{settings.isLocked ? 'MỞ KHÓA HỆ THỐNG' : 'KHÓA HỆ THỐNG BẦU CỬ'}</span>
          </button>
        </div>
      </div>

      {/* Grid Settings Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Phân quyền & Vai trò */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-xs font-bold text-slate-800 uppercase flex items-center gap-2 border-b pb-2">
            <UserCheck className="w-4 h-4 text-sky-600" />
            1. VAI TRÒ SỬ DỤNG HỆ THỐNG (3 QUYỀN SPECS)
          </h2>
          <div className="space-y-3 text-xs">
            <p className="text-slate-600">
              Hệ thống hỗ trợ 3 cấp bản quyền sử dụng: <strong>Admin</strong> (Quyền cao nhất),{' '}
              <strong>Editor</strong> (Nhập liệu/Kiểm phiếu), <strong>View</strong> (Chỉ xem).
            </p>
            <div className="space-y-2 pt-1">
              {(['ADMIN', 'EDITOR', 'VIEW'] as UserRole[]).map(role => (
                <div
                  key={role}
                  onClick={() => setSettings({ ...settings, currentRole: role })}
                  className={`p-3 rounded-lg border cursor-pointer flex items-center justify-between transition-all ${
                    settings.currentRole === role
                      ? 'bg-sky-50 border-sky-400 text-sky-900 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-xs font-bold">QUYỀN {role}</span>
                  {settings.currentRole === role && (
                    <span className="bg-sky-600 text-white text-[10px] px-2 py-0.5 rounded font-bold">
                      Đang kích hoạt
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Backup & Restore */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-xs font-bold text-slate-800 uppercase flex items-center gap-2 border-b pb-2">
            <Database className="w-4 h-4 text-emerald-600" />
            2. SAO LƯU & PHỤC HỒI DỮ LIỆU
          </h2>
          <div className="space-y-3 text-xs text-slate-600">
            <p>Xuất dữ liệu lưu trữ dự phòng ra file JSON hoặc nạp dữ liệu cũ vào phần mềm khi cần thiết.</p>
            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={handleBackupData}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg flex items-center justify-center gap-2 shadow"
              >
                <Download className="w-4 h-4" />
                Tải tệp Sao lưu Dữ liệu (.json)
              </button>
              <label className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg border border-slate-300 flex items-center justify-center gap-2 cursor-pointer transition-colors">
                <Upload className="w-4 h-4 text-slate-600" />
                <span>Phục hồi Dữ liệu từ Tệp (.json)</span>
                <input type="file" accept=".json" onChange={handleRestoreData} className="hidden" />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Author & System Information (Specs Page 7) */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-xs font-bold text-slate-800 uppercase flex items-center gap-2 border-b pb-2">
          <HelpCircle className="w-4 h-4 text-amber-500" />
          THÔNG TIN TÁC GIẢ & HỖ TRỢ KỸ THUẬT
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-slate-500 font-semibold">TÁC GIẢ THIẾT KẾ:</span>
            <div className="text-sm font-bold text-slate-800">Phạm Công Tuân</div>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-slate-500 font-semibold">EMAIL HỖ TRỢ:</span>
            <div className="text-sm font-bold text-sky-700 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" />
              pctuanit@gmail.com
            </div>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-slate-500 font-semibold">SỐ ĐIỆN THOẠI / ZALO:</span>
            <div className="text-sm font-bold text-emerald-700 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" />
              0916199945
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
