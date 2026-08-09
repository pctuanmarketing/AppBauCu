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
  AlertTriangle,
} from 'lucide-react';
import { SystemSettings, UserAccount, UserRole } from '../types';
import { sendRealEmail, EmailPayload } from '../lib/emailService';

interface SystemAdminPageProps {
  settings: SystemSettings;
  setSettings: React.Dispatch<React.SetStateAction<SystemSettings>>;
  registeredUsers?: UserAccount[];
  onApproveUser?: (userId: string, role: UserRole) => void;
  onRejectUser?: (userId: string) => void;
  onDeleteUser?: (userId: string) => void;
  onShowEmailModal?: (emailData: EmailPayload) => void;
  currentRole?: UserRole;
}

export const SystemAdminPage: React.FC<SystemAdminPageProps> = ({
  settings,
  setSettings,
  registeredUsers = [],
  onApproveUser,
  onRejectUser,
  onDeleteUser,
  onShowEmailModal,
  currentRole = 'ADMIN',
}) => {
  const [selectedRoleMap, setSelectedRoleMap] = useState<Record<string, UserRole>>({});

  // Block non-admin users from accessing system administration
  if (currentRole !== 'ADMIN') {
    return (
      <div className="max-w-3xl mx-auto my-12 p-8 bg-white rounded-3xl border-2 border-rose-200 shadow-xl text-center space-y-4 font-sans">
        <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-md">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-black text-slate-900 uppercase">
            BẠN KHÔNG CÓ QUYỀN TRUY CẬP QUẢN TRỊ HỆ THỐNG
          </h2>
          <p className="text-xs text-slate-600 font-medium max-w-md mx-auto">
            Tài khoản hiện tại của bạn có quyền <strong>{currentRole}</strong>. Phân hệ "Quản trị hệ thống & Phê duyệt cấp quyền" chỉ dành riêng cho tài khoản Quản trị viên tối cao (<strong>ADMIN</strong>).
          </p>
        </div>
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 text-left space-y-2 max-w-md mx-auto">
          <div className="font-bold text-slate-900">📌 Chi tiết phân quyền hệ thống:</div>
          <ul className="list-disc list-inside space-y-1 text-[11px]">
            <li><strong>ADMIN:</strong> Toàn quyền kiểm soát, phê duyệt tài khoản, phân quyền, khóa hệ thống.</li>
            <li><strong>EDITOR:</strong> Nhập dữ liệu cử tri, điểm danh, kiểm phiếu siêu tốc và xuất báo cáo.</li>
            <li><strong>VIEW:</strong> Chỉ xem thông tin tổng quan, danh sách cử tri và biên bản kiểm phiếu.</li>
          </ul>
        </div>
      </div>
    );
  }

  const pendingUsers = registeredUsers.filter(u => u.status === 'PENDING');
  const activeUsers = registeredUsers.filter(u => u.status === 'APPROVED');

  const handleApproveAction = async (u: UserAccount) => {
    const assignedRole = selectedRoleMap[u.id] || 'EDITOR';

    if (onApproveUser) {
      onApproveUser(u.id, assignedRole);
    }

    const emailPayload: EmailPayload = {
      to_name: u.fullName,
      to_email: u.email,
      phone: u.phone,
      subject: `[HỆ THỐNG BẦU CỬ] THÔNG BÁO TÀI KHOẢN ĐÃ ĐƯỢC KÍCH HOẠT QUYỀN ${assignedRole}`,
      type: 'ACCOUNT_ACTIVATED',
      message_html: `
        <p>Chúc mừng! Quản trị viên hệ thống đã phê duyệt và kích hoạt thành công tài khoản của bạn:</p>
        <ul>
          <li><strong>Họ và Tên:</strong> ${u.fullName}</li>
          <li><strong>Email đăng nhập:</strong> ${u.email}</li>
          <li><strong>Quyền hạn được cấp:</strong> <strong style="color: #0284c7;">${assignedRole}</strong></li>
          <li><strong>Trạng thái:</strong> <strong style="color: #16a34a;">ĐÃ KÍCH HOẠT SUỐT VỚI HỆ THỐNG</strong></li>
        </ul>
        <p>Bây giờ bạn có thể truy cập hệ thống và tiến hành đăng nhập bằng Email <strong>${u.email}</strong> để thực hiện các thao tác theo quyền hạn được phân công.</p>
      `,
    };

    await sendRealEmail(emailPayload);

    if (onShowEmailModal) {
      onShowEmailModal(emailPayload);
    }
  };

  const handleRoleChangeForUser = (userId: string, role: UserRole) => {
    setSelectedRoleMap(prev => ({ ...prev, [userId]: role }));
  };

  const handleExportBackup = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(localStorage));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `BACKUP_BAU_CU_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-slate-900">QUẢN TRỊ HỆ THỐNG & PHÊ DUYỆT CẤP QUYỀN</h1>
            <p className="text-xs text-slate-500">Phê duyệt tài khoản đăng ký, gửi mail kích hoạt, phân quyền sử dụng và quản lý khóa dữ liệu</p>
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
            Duyệt ➔ Tự động phát Mail kích hoạt
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
                  <th className="p-3">Email nhận thông báo</th>
                  <th className="p-3">Điện thoại</th>
                  <th className="p-3 w-44 text-center">Phân công Quyền hạn</th>
                  <th className="p-3 w-52 text-center">Thao tác Phê duyệt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pendingUsers.map(u => {
                  const assignedRole = selectedRoleMap[u.id] || 'EDITOR';
                  return (
                    <tr key={u.id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900 uppercase">{u.fullName}</td>
                      <td className="p-3 font-mono text-sky-800 font-bold">{u.email}</td>
                      <td className="p-3 font-mono text-slate-700">{u.phone}</td>
                      <td className="p-3 text-center">
                        <select
                          value={assignedRole}
                          onChange={e => handleRoleChangeForUser(u.id, e.target.value as UserRole)}
                          className="p-1.5 bg-sky-50 border border-sky-300 rounded-lg font-bold text-sky-900 outline-none text-xs w-full"
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
                            Duyệt & Gửi Mail kích hoạt
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
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : u.role === 'EDITOR'
                        ? 'bg-sky-100 text-sky-800 border border-sky-200'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
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
