import React, { useState } from 'react';
import {
  Settings,
  Lock,
  Unlock,
  ShieldCheck,
  UserCheck,
  Download,
  Upload,
  CheckCircle2,
  XCircle,
  Clock,
  Mail,
  Phone,
  UserPlus,
  Trash2,
  Sparkles,
} from 'lucide-react';
import { SystemSettings, UserAccount, UserRole } from '../types';

interface SystemAdminPageProps {
  settings: SystemSettings;
  setSettings: React.Dispatch<React.SetStateAction<SystemSettings>>;
  registeredUsers?: UserAccount[];
  onApproveUser?: (userId: string, role: UserRole) => void;
  onRejectUser?: (userId: string) => void;
  onDeleteUser?: (userId: string) => void;
}

export const SystemAdminPage: React.FC<SystemAdminPageProps> = ({
  settings,
  setSettings,
  registeredUsers = [],
  onApproveUser,
  onRejectUser,
  onDeleteUser,
}) => {
  const [selectedRoleMap, setSelectedRoleMap] = useState<Record<string, UserRole>>({});
  const [activatedNoticeUser, setActivatedNoticeUser] = useState<UserAccount | null>(null);

  const pendingUsers = registeredUsers.filter(u => u.status === 'PENDING');
  const activeUsers = registeredUsers.filter(u => u.status === 'APPROVED');
  const rejectedUsers = registeredUsers.filter(u => u.status === 'REJECTED');

  const handleApproveAction = (u: UserAccount) => {
    const assignedRole = selectedRoleMap[u.id] || 'EDITOR';
    if (onApproveUser) {
      onApproveUser(u.id, assignedRole);
      setActivatedNoticeUser({ ...u, role: assignedRole, status: 'APPROVED' });
    }
  };

  const handleRoleChangeForUser = (userId: string, role: UserRole) => {
    setSelectedRoleMap(prev => ({ ...prev, [userId]: role }));
  };

  const handleExportBackup = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(localStorage));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `BACKUP_BAU_CU_TO_21_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Activated Email Notification Alert Dialog */}
      {activatedNoticeUser && (
        <div className="p-4 bg-emerald-600 text-white rounded-2xl shadow-xl flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-3 text-xs">
            <Mail className="w-5 h-5 text-amber-300 animate-bounce" />
            <div>
              <div className="font-extrabold uppercase">ĐÃ GỬI MAIL THÔNG BÁO KÍCH HOẠT TÀI KHOẢN THÀNH CÔNG!</div>
              <p className="text-[11px] opacity-90">
                Đã kích hoạt tài khoản cho <strong>{activatedNoticeUser.fullName}</strong> ({activatedNoticeUser.email}) với quyền <strong>{activatedNoticeUser.role}</strong>.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActivatedNoticeUser(null)}
            className="text-white hover:opacity-80 font-extrabold text-sm ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-slate-900">QUẢN TRỊ HỆ THỐNG & PHÊ DUYỆT CẤP QUYỀN</h1>
            <p className="text-xs text-slate-500">Phê duyệt tài khoản đăng ký, phân quyền sử dụng và quản lý khóa dữ liệu</p>
          </div>
        </div>
      </div>

      {/* SECTION 1: DUYỆT TÀI KHOẢN ĐĂNG KÝ MỚI (PENDING APPROVALS) */}
      <div className="bg-white rounded-2xl border-2 border-sky-300 shadow-md p-6 space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="text-sm font-extrabold text-slate-900 uppercase flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500" />
            DANH SÁCH YÊU CẦU ĐĂNG KÝ TÀI KHOẢN CHỜ DUYỆT ({pendingUsers.length})
          </h2>
          <span className="text-xs font-bold text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
            Cần Quản trị viên duyệt để đăng nhập
          </span>
        </div>

        {pendingUsers.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs font-semibold">
            Không có yêu cầu đăng ký tài khoản nào đang chờ duyệt.
          </div>
        ) : (
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200">
                <tr>
                  <th className="p-3">Họ và Tên</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Điện thoại</th>
                  <th className="p-3 w-40 text-center">Phân công Quyền hạn</th>
                  <th className="p-3 w-48 text-center">Thao tác Phê duyệt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pendingUsers.map(u => {
                  const assignedRole = selectedRoleMap[u.id] || 'EDITOR';
                  return (
                    <tr key={u.id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900 uppercase">{u.fullName}</td>
                      <td className="p-3 font-mono text-sky-800">{u.email}</td>
                      <td className="p-3 font-mono text-slate-700">{u.phone}</td>
                      <td className="p-3 text-center">
                        <select
                          value={assignedRole}
                          onChange={e => handleRoleChangeForUser(u.id, e.target.value as UserRole)}
                          className="p-1.5 bg-sky-50 border border-sky-300 rounded-lg font-bold text-sky-900 outline-none text-xs"
                        >
                          <option value="ADMIN">ADMIN (Toàn quyền)</option>
                          <option value="EDITOR">EDITOR (Kiểm phiếu & Nhập liệu)</option>
                          <option value="VIEW">VIEW (Chỉ xem)</option>
                        </select>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleApproveAction(u)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-xs flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Duyệt & Kích hoạt
                          </button>
                          <button
                            onClick={() => onRejectUser && onRejectUser(u.id)}
                            className="px-2.5 py-1.5 bg-rose-100 text-rose-700 hover:bg-rose-200 font-bold text-xs rounded-lg flex items-center gap-1"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Từ chối
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* SECTION 2: DANH SÁCH TÀI KHOẢN ĐÃ KÍCH HOẠT (ACTIVE USERS) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="text-sm font-extrabold text-slate-900 uppercase flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-600" />
            DANH SÁCH TÀI KHOẢN ĐÃ KÍCH HOẠT TRÊN HỆ THỐNG ({activeUsers.length})
          </h2>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200">
              <tr>
                <th className="p-3">Họ và Tên</th>
                <th className="p-3">Email</th>
                <th className="p-3">Điện thoại</th>
                <th className="p-3 w-32 text-center">Quyền hạn</th>
                <th className="p-3 w-32 text-center">Trạng thái</th>
                <th className="p-3 w-24 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activeUsers.map(u => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-slate-900 uppercase">{u.fullName}</td>
                  <td className="p-3 font-mono text-slate-700">{u.email}</td>
                  <td className="p-3 font-mono text-slate-700">{u.phone}</td>
                  <td className="p-3 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full font-extrabold text-[11px] ${
                      u.role === 'ADMIN'
                        ? 'bg-rose-100 text-rose-800'
                        : u.role === 'EDITOR'
                        ? 'bg-sky-100 text-sky-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Đã kích hoạt
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    {u.id !== 'admin-default' && (
                      <button
                        onClick={() => onDeleteUser && onDeleteUser(u.id)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                        title="Xóa tài khoản"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 3: SYSTEM LOCK & BACKUP DATA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* System Lock */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-600" />
              KHÓA HỆ THỐNG BẦU CỬ
            </h3>
            <span className={`px-2.5 py-1 rounded-full font-bold text-xs ${
              settings.isLocked ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
            }`}>
              {settings.isLocked ? 'ĐÃ KHÓA' : 'HOẠT ĐỘNG'}
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Khi bật tính năng <strong>Khóa hệ thống</strong>, tất cả dữ liệu cử tri, phiếu bầu và cấu hình sẽ ngưng chỉnh sửa để phục vụ chốt biên bản bầu cử.
          </p>

          <button
            onClick={() => setSettings(prev => ({ ...prev, isLocked: !prev.isLocked }))}
            className={`w-full py-2.5 rounded-xl font-extrabold text-xs shadow flex items-center justify-center gap-2 transition-all ${
              settings.isLocked
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-rose-600 hover:bg-rose-700 text-white'
            }`}
          >
            {settings.isLocked ? (
              <>
                <Unlock className="w-4 h-4" />
                <span>MỞ KHÓA CHỈNH SỬA HỆ THỐNG</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>KÍCH HOẠT KHÓA CHỐT DỮ LIỆU</span>
              </>
            )}
          </button>
        </div>

        {/* Data Backup */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="border-b pb-3">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase flex items-center gap-2">
              <Download className="w-4 h-4 text-sky-600" />
              SAO LƯU DỮ LIỆU (BACKUP & RESTORE)
            </h3>
            <p className="text-xs text-slate-500">Tải xuống tệp sao lưu định dạng JSON</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleExportBackup}
              className="flex-1 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs rounded-xl shadow flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Tải sao lưu (.json)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
