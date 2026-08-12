import React, { useState } from 'react';
import {
  Settings,
  Lock,
  Unlock,
  ShieldCheck,
  UserCheck,
  Download,
  CheckCircle2,
  XCircle,
  Clock,
  Mail,
  Phone,
  UserPlus,
  Trash2,
  AlertTriangle,
  Pencil,
  Plus,
  X,
  Eye,
  EyeOff,
  User,
  Shield,
  Save,
  AlertCircle,
} from 'lucide-react';
import { ElectionLevel, SystemSettings, UserAccount, UserAccountStatus, UserRole } from '../types';
import { sendRealEmail, EmailPayload } from '../lib/emailService';

interface SystemAdminPageProps {
  settings: SystemSettings;
  setSettings: React.Dispatch<React.SetStateAction<SystemSettings>>;
  registeredUsers?: UserAccount[];
  onAddUser?: (newUser: Omit<UserAccount, 'id' | 'createdAt'>) => void;
  onUpdateUser?: (updatedUser: UserAccount) => void;
  onApproveUser?: (userId: string, role: UserRole, assignedLevel?: ElectionLevel | 'ALL') => void;
  onUpdateUserLevel?: (userId: string, assignedLevel: ElectionLevel | 'ALL') => void;
  onRejectUser?: (userId: string) => void;
  onDeleteUser?: (userId: string) => void;
  onShowEmailModal?: (emailData: EmailPayload) => void;
  currentRole?: UserRole;
}

export const SystemAdminPage: React.FC<SystemAdminPageProps> = ({
  settings,
  setSettings,
  registeredUsers = [],
  onAddUser,
  onUpdateUser,
  onApproveUser,
  onUpdateUserLevel,
  onRejectUser,
  onDeleteUser,
  onShowEmailModal,
  currentRole = 'ADMIN',
}) => {
  const [selectedRoleMap, setSelectedRoleMap] = useState<Record<string, UserRole>>({});
  const [selectedLevelMap, setSelectedLevelMap] = useState<Record<string, ElectionLevel | 'ALL'>>({});

  // Add / Edit User Modal State
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);

  // Form Fields State
  const [formFullName, setFormFullName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formRole, setFormRole] = useState<UserRole>('EDITOR');
  const [formAssignedLevel, setFormAssignedLevel] = useState<ElectionLevel | 'ALL'>('ALL');
  const [formStatus, setFormStatus] = useState<UserAccountStatus>('APPROVED');
  const [showFormPassword, setShowFormPassword] = useState(false);
  const [formError, setFormError] = useState('');

  // Delete Confirm Modal State
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<UserAccount | null>(null);

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
  const rejectedUsers = registeredUsers.filter(u => u.status === 'REJECTED');

  // Open Add User Modal
  const handleOpenAddModal = () => {
    setEditingUser(null);
    setFormFullName('');
    setFormEmail('');
    setFormPhone('');
    setFormPassword('');
    setFormRole('EDITOR');
    setFormAssignedLevel('ALL');
    setFormStatus('APPROVED');
    setFormError('');
    setShowFormPassword(false);
    setShowUserModal(true);
  };

  // Open Edit User Modal
  const handleOpenEditModal = (user: UserAccount) => {
    setEditingUser(user);
    setFormFullName(user.fullName);
    setFormEmail(user.email);
    setFormPhone(user.phone);
    setFormPassword(''); // Empty means don't change password
    setFormRole(user.role);
    setFormAssignedLevel(user.assignedLevel || 'ALL');
    setFormStatus(user.status);
    setFormError('');
    setShowFormPassword(false);
    setShowUserModal(true);
  };

  // Handle Save / Submit User Form (Add or Edit)
  const handleUserFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const cleanName = formFullName.trim();
    const cleanEmail = formEmail.trim().toLowerCase();
    const cleanPhone = formPhone.trim();

    if (!cleanName || cleanName.length < 3) {
      setFormError('Họ và Tên phải có tối thiểu 3 ký tự.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      setFormError('Vui lòng nhập địa chỉ Email hợp lệ.');
      return;
    }

    const phoneRegex = /^(0|\+84)[0-9]{8,11}$/;
    if (!cleanPhone || !phoneRegex.test(cleanPhone)) {
      setFormError('Số điện thoại không hợp lệ (VD: 0916199945).');
      return;
    }

    // Duplicate Check
    const existingEmail = registeredUsers.find(
      u => u.email.toLowerCase() === cleanEmail && (!editingUser || u.id !== editingUser.id)
    );
    if (existingEmail) {
      setFormError('❌ Email này đã được đăng ký bởi người dùng khác!');
      return;
    }

    if (!editingUser) {
      // Adding new user
      if (!formPassword || formPassword.length < 6) {
        setFormError('Mật khẩu cho tài khoản mới phải có ít nhất 6 ký tự.');
        return;
      }

      if (onAddUser) {
        onAddUser({
          fullName: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          password: formPassword,
          role: formRole,
          assignedLevel: formAssignedLevel,
          status: formStatus,
        });
      }
    } else {
      // Updating existing user
      if (formPassword && formPassword.length < 6) {
        setFormError('Mật khẩu mới phải có ít nhất 6 ký tự (hoặc để trống nếu không đổi).');
        return;
      }

      if (onUpdateUser) {
        onUpdateUser({
          ...editingUser,
          fullName: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          password: formPassword ? formPassword : editingUser.password,
          role: formRole,
          assignedLevel: formAssignedLevel,
          status: formStatus,
        });
      }
    }

    setShowUserModal(false);
  };

  const handleApproveAction = async (u: UserAccount) => {
    const assignedRole = selectedRoleMap[u.id] || 'EDITOR';
    const assignedLevel = selectedLevelMap[u.id] || 'ALL';

    if (onApproveUser) {
      onApproveUser(u.id, assignedRole, assignedLevel);
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
          <li><strong>Cấp phụ trách:</strong> <strong>${assignedLevel}</strong></li>
          <li><strong>Trạng thái:</strong> <strong style="color: #16a34a;">ĐÃ KÍCH HOẠT VỚI HỆ THỐNG</strong></li>
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

  const confirmDeleteUser = () => {
    if (deleteConfirmUser && onDeleteUser) {
      onDeleteUser(deleteConfirmUser.id);
      setDeleteConfirmUser(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Top Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-slate-900">QUẢN TRỊ HỆ THỐNG & PHÂN QUYỀN NGƯỜI DÙNG</h1>
            <p className="text-xs text-slate-500">Quản lý thêm/sửa/xóa người dùng, đồng bộ Cơ sở dữ liệu Supabase và phân quyền hệ thống</p>
          </div>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>THÊM NGƯỜI DÙNG MỚI</span>
        </button>
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
                  <th className="p-3 w-40 text-center">Phân công Quyền hạn</th>
                  <th className="p-3 w-48 text-center">Cấp kiểm phiếu phụ trách</th>
                  <th className="p-3 w-52 text-center">Thao tác Phê duyệt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pendingUsers.map(u => {
                  const assignedRole = selectedRoleMap[u.id] || 'EDITOR';
                  const assignedLvl = selectedLevelMap[u.id] || 'ALL';
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
                          <option value="EDITOR">EDITOR (Kiểm phiếu)</option>
                          <option value="VIEW">VIEW (Chỉ xem)</option>
                        </select>
                      </td>
                      <td className="p-3 text-center">
                        <select
                          value={assignedLvl}
                          onChange={e => setSelectedLevelMap(prev => ({ ...prev, [u.id]: e.target.value as any }))}
                          className="p-1.5 bg-amber-50 border border-amber-300 rounded-lg font-bold text-amber-900 outline-none text-xs w-full"
                        >
                          <option value="ALL">🌐 Tất cả 3 cấp bầu cử</option>
                          <option value="QUOC_HOI">🇻🇳 Chỉ cấp QUỐC HỘI</option>
                          <option value="HDND_TINH">🏛️ Chỉ cấp HĐND TỈNH</option>
                          <option value="HDND_XA">🏡 Chỉ cấp HĐND XÃ</option>
                        </select>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleApproveAction(u)}
                            className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg shadow-xs flex items-center gap-1"
                            title="Duyệt tài khoản"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Duyệt
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(u)}
                            className="p-1.5 text-sky-600 hover:bg-sky-50 rounded-lg border border-sky-200"
                            title="Sửa thông tin"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmUser(u)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-200"
                            title="Xóa vĩnh viễn"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

          <button
            onClick={handleOpenAddModal}
            className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1"
          >
            <UserPlus className="w-3.5 h-3.5" />
            Thêm tài khoản
          </button>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200">
              <tr>
                <th className="p-3">Họ và Tên</th>
                <th className="p-3">Email</th>
                <th className="p-3">Điện thoại</th>
                <th className="p-3 w-32 text-center">Quyền hạn</th>
                <th className="p-3 w-48 text-center">Cấp phụ trách</th>
                <th className="p-3 w-28 text-center">Trạng thái</th>
                <th className="p-3 w-28 text-center">Thao tác Admin</th>
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
                    <select
                      value={u.assignedLevel || 'ALL'}
                      onChange={e => onUpdateUserLevel && onUpdateUserLevel(u.id, e.target.value as any)}
                      className="p-1 bg-amber-50 border border-amber-300 rounded font-bold text-amber-900 text-xs w-full"
                    >
                      <option value="ALL">🌐 Tất cả 3 cấp</option>
                      <option value="QUOC_HOI">🇻🇳 Cấp Quốc hội</option>
                      <option value="HDND_TINH">🏛️ Cấp HĐND Tỉnh</option>
                      <option value="HDND_XA">🏡 Cấp HĐND Xã</option>
                    </select>
                  </td>
                  <td className="p-3 text-center">
                    <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Đã kích hoạt
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleOpenEditModal(u)}
                        className="p-1.5 text-sky-600 hover:bg-sky-100 rounded-lg border border-sky-200 transition-colors"
                        title="Sửa thông tin tài khoản"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      {u.id !== 'admin-default' && (
                        <button
                          onClick={() => setDeleteConfirmUser(u)}
                          className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors"
                          title="Xóa vĩnh viễn khỏi CSDL Supabase"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
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

      {/* SECTION 4: VOTING HOURS CONFIGURATION & ON/OFF TOGGLE SWITCH */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="border-b pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 uppercase flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-600" />
              CẤU HÌNH KHUNG GIỜ MỞ / ĐÓNG HÒM PHIẾU BẦU CỬ
            </h3>
            <p className="text-xs text-slate-500 font-medium">Giới hạn thời gian cử tri được phép điểm danh bỏ phiếu chính thức</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setSettings(prev => ({ ...prev, enableVotingTimeCheck: !prev.enableVotingTimeCheck }))}
              className={`px-4 py-2 rounded-xl font-black text-xs transition-all flex items-center gap-2 shadow-2xs border ${
                settings.enableVotingTimeCheck
                  ? 'bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700 shadow-md'
                  : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
              }`}
            >
              <span className={`w-3 h-3 rounded-full ${settings.enableVotingTimeCheck ? 'bg-white animate-pulse' : 'bg-slate-400'}`} />
              <span>{settings.enableVotingTimeCheck ? '🟢 BẬT KHUNG GIỜ BỎ PHIẾU' : '⚪ TẮT KHUNG GIỜ BỎ PHIẾU'}</span>
            </button>

            <button
              type="button"
              onClick={() => setSettings(prev => ({ ...prev, lockCountingDuringVoting: !(prev.lockCountingDuringVoting !== false) }))}
              className={`px-4 py-2 rounded-xl font-black text-xs transition-all flex items-center gap-2 shadow-2xs border ${
                settings.lockCountingDuringVoting !== false
                  ? 'bg-rose-600 text-white border-rose-700 hover:bg-rose-700 shadow-md'
                  : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
              }`}
            >
              <span className={`w-3 h-3 rounded-full ${settings.lockCountingDuringVoting !== false ? 'bg-white animate-pulse' : 'bg-slate-400'}`} />
              <span>{settings.lockCountingDuringVoting !== false ? '🔒 KHÓA KIỂM PHIẾU TRONG GIỜ BỎ PHIẾU' : '🔓 MỞ KHÓA KIỂM PHIẾU MỌI LÚC (THỰC HÀNH)'}</span>
            </button>
          </div>
        </div>

        {/* Status explanation card */}
        <div className={`p-3.5 rounded-xl border text-xs font-semibold space-y-1.5 ${
          settings.enableVotingTimeCheck
            ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
            : 'bg-amber-50 border-amber-300 text-amber-950'
        }`}>
          {settings.enableVotingTimeCheck ? (
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>🟢 ĐÃ BẬT TÍNH NĂNG KHUNG GIỜ (ÁP DỤNG NGÀY BẦU CỬ CHÍNH THỨC):</strong> Hệ thống tự động kiểm tra giờ thực. Cán bộ chỉ được điểm danh trong khoảng từ <strong>{settings.votingStartTime || '07:00'}</strong> đến <strong>{settings.votingEndTime || '19:00'}</strong>.
                {settings.lockCountingDuringVoting !== false ? (
                  <p className="text-rose-900 font-bold mt-1">
                    🔒 <strong>KHÓA KIỂM PHIẾU:</strong> Chức năng Kiểm phiếu Bầu cử bị <strong>KHÓA HỌẠT ĐỘNG</strong> từ {settings.votingStartTime || '07:00'} đến {settings.votingEndTime || '19:00'} để cử tri thực hiện quyền bỏ phiếu. Kiểm phiếu chỉ được bắt đầu SAU {settings.votingEndTime || '19:00'}.
                  </p>
                ) : (
                  <p className="text-sky-900 font-bold mt-1">
                    🔓 <strong>MỞ KHÓA THỰC HÀNH:</strong> Đã cho phép kiểm phiếu ngay cả trong giờ bỏ phiếu (Dùng cho thực hành/chạy thử).
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-4.5 h-4.5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>⚪ ĐÃ TẮT KHUNG GIỜ (MẶC ĐỊNH CHO THỬ NGHIỆM / CHẠY THƯỜNG):</strong> Cho phép cán bộ điểm danh cử tri và thao tác kiểm phiếu vào <strong>bất kỳ thời điểm nào</strong> mà không bị chặn thời gian.
              </div>
            </div>
          )}
        </div>

        <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 transition-opacity ${!settings.enableVotingTimeCheck ? 'opacity-60' : ''}`}>
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 uppercase">Giờ mở hòm phiếu (Bắt đầu):</label>
            <input
              type="time"
              value={settings.votingStartTime || '07:00'}
              onChange={e => setSettings(prev => ({ ...prev, votingStartTime: e.target.value }))}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-sky-500 outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 uppercase">Giờ đóng hòm phiếu (Kết thúc):</label>
            <input
              type="time"
              value={settings.votingEndTime || '19:00'}
              onChange={e => setSettings(prev => ({ ...prev, votingEndTime: e.target.value }))}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-sky-500 outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 uppercase">Ngày tổ chức bầu cử:</label>
            <input
              type="date"
              value={settings.votingDate || new Date().toISOString().split('T')[0]}
              onChange={e => setSettings(prev => ({ ...prev, votingDate: e.target.value }))}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-sky-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* ADD / EDIT USER MODAL */}
      {showUserModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-sans animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden relative">
            <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-lg">
                  {editingUser ? '✏️' : '➕'}
                </div>
                <div>
                  <h3 className="font-extrabold text-sm uppercase tracking-tight text-white">
                    {editingUser ? 'CHỈNH SỬA TÀI KHOẢN NGƯỜI DÙNG' : 'THÊM NGƯỜI DÙNG MỚI (ADMIN)'}
                  </h3>
                  <p className="text-[11px] text-slate-300 font-medium">
                    {editingUser ? `Cập nhật thông tin và phân quyền cho ${editingUser.fullName}` : 'Tạo mới người dùng và phân quyền hệ thống'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowUserModal(false)}
                className="text-slate-400 hover:text-white bg-white/10 p-1.5 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUserFormSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase">Họ và Tên đầy đủ:</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={formFullName}
                    onChange={e => setFormFullName(e.target.value)}
                    placeholder="VD: Nguyễn Văn An..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-sky-500 outline-none text-slate-900 uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase">Email đăng nhập:</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={formEmail}
                      onChange={e => setFormEmail(e.target.value)}
                      placeholder="user@domain.com"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-sky-500 outline-none text-slate-900"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase">Số điện thoại:</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={formPhone}
                      onChange={e => setFormPhone(e.target.value)}
                      placeholder="0916199945"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-sky-500 outline-none text-slate-900"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase">
                  {editingUser ? 'Mật khẩu mới (Để trống nếu giữ nguyên):' : 'Mật khẩu khởi tạo (≥6 ký tự):'}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showFormPassword ? 'text' : 'password'}
                    value={formPassword}
                    onChange={e => setFormPassword(e.target.value)}
                    placeholder={editingUser ? 'Giữ nguyên mật khẩu cũ...' : 'Nhập mật khẩu...'}
                    className="w-full pl-9 pr-9 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-sky-500 outline-none text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowFormPassword(!showFormPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showFormPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase">Quyền hạn:</label>
                  <select
                    value={formRole}
                    onChange={e => setFormRole(e.target.value as UserRole)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="ADMIN">ADMIN (Quản trị)</option>
                    <option value="EDITOR">EDITOR (Kiểm phiếu)</option>
                    <option value="VIEW">VIEW (Chỉ xem)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase">Cấp phụ trách:</label>
                  <select
                    value={formAssignedLevel}
                    onChange={e => setFormAssignedLevel(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="ALL">🌐 Tất cả 3 cấp</option>
                    <option value="QUOC_HOI">🇻🇳 Cấp Quốc hội</option>
                    <option value="HDND_TINH">🏛️ Cấp HĐND Tỉnh</option>
                    <option value="HDND_XA">🏡 Cấp HĐND Xã</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase">Trạng thái:</label>
                  <select
                    value={formStatus}
                    onChange={e => setFormStatus(e.target.value as UserAccountStatus)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="APPROVED">🟢 ĐÃ DUYỆT</option>
                    <option value="PENDING">⏳ CHỜ DUYỆT</option>
                    <option value="REJECTED">❌ TỪ CHỐI</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingUser ? 'Lưu cập nhật' : 'Thêm người dùng'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE USER CONFIRMATION MODAL */}
      {deleteConfirmUser && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-sans animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-rose-200 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-md">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-black text-slate-900 uppercase">
                XÁC NHẬN XÓA NGƯỜI DÙNG
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                Bạn có chắc chắn muốn xóa tài khoản người dùng này?
              </p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Họ và Tên:</span>
                <strong className="text-slate-900 font-bold uppercase">{deleteConfirmUser.fullName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Email:</span>
                <strong className="text-sky-800 font-mono font-bold">{deleteConfirmUser.email}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Quyền hạn:</span>
                <strong className="text-slate-900 font-bold">{deleteConfirmUser.role}</strong>
              </div>
            </div>

            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-[11px] font-bold text-rose-900 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>Thao tác này sẽ xóa người dùng khỏi hệ thống ứng dụng và <strong>XÓA VĨNH VIỄN TRONG CƠ SỞ DỮ LIỆU SUPABASE</strong>. Không thể hoàn tác!</span>
            </div>

            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setDeleteConfirmUser(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
              >
                Hủy bỏ
              </button>
              <button
                onClick={confirmDeleteUser}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-rose-600/20 transition-all flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>XÓA VĨNH VIỄN</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
