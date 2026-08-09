import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Shield,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Save,
  Lock,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import { UserAccount, UserRole } from '../types';

interface UserProfilePageProps {
  currentUser: UserAccount | null;
  onUpdateProfile: (updatedUser: UserAccount) => void;
}

export const UserProfilePage: React.FC<UserProfilePageProps> = ({
  currentUser,
  onUpdateProfile,
}) => {
  if (!currentUser) return null;

  // Profile Form States
  const [fullName, setFullName] = useState(currentUser.fullName);
  const [phone, setPhone] = useState(currentUser.phone);
  const [profileMsg, setProfileMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Password Form States
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg(null);

    if (!fullName.trim()) {
      setProfileMsg({ text: 'Vui lòng nhập Họ và Tên.', type: 'error' });
      return;
    }

    if (!phone.trim()) {
      setProfileMsg({ text: 'Vui lòng nhập Số điện thoại.', type: 'error' });
      return;
    }

    const updated: UserAccount = {
      ...currentUser,
      fullName: fullName.trim(),
      phone: phone.trim(),
    };

    onUpdateProfile(updated);
    setProfileMsg({ text: '✅ Đã lưu cập nhật thông tin cá nhân thành công!', type: 'success' });
    setTimeout(() => setProfileMsg(null), 3000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (currentUser.password && oldPassword !== currentUser.password) {
      setPasswordMsg({ text: 'Mật khẩu cũ không chính xác.', type: 'error' });
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setPasswordMsg({ text: 'Mật khẩu mới phải có ít nhất 6 ký tự.', type: 'error' });
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordMsg({ text: 'Xác nhận mật khẩu mới không trùng khớp.', type: 'error' });
      return;
    }

    const updated: UserAccount = {
      ...currentUser,
      password: newPassword,
    };

    onUpdateProfile(updated);
    setOldPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setPasswordMsg({ text: '✅ Đã đổi mật khẩu thành công! Vui lòng dùng mật khẩu mới cho lần đăng nhập tiếp theo.', type: 'success' });
    setTimeout(() => setPasswordMsg(null), 4000);
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white rounded-3xl p-6 shadow-xl border border-sky-800/40 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-teal-400 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-sky-500/30 shrink-0">
              {getInitials(currentUser.fullName)}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tight text-white uppercase">
                  {currentUser.fullName}
                </h1>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase ${
                  currentUser.role === 'ADMIN'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-400/30'
                    : currentUser.role === 'EDITOR'
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-400/30'
                    : 'bg-slate-500/20 text-slate-300 border border-slate-400/30'
                }`}>
                  {currentUser.role}
                </span>
              </div>
              <p className="text-xs text-slate-300 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-sky-400" />
                <span>{currentUser.email}</span>
                <span>•</span>
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>{currentUser.phone}</span>
              </p>
            </div>
          </div>

          <div className="px-4 py-2 bg-slate-800/80 rounded-2xl border border-slate-700 text-xs space-y-0.5">
            <div className="text-slate-400 font-medium">Trạng thái tài khoản:</div>
            <div className="font-extrabold text-emerald-400 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>Đã kích hoạt cấp quyền</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form 1: Cập nhật thông tin cá nhân */}
        <form onSubmit={handleSaveProfile} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="border-b pb-3 flex items-center justify-between">
            <h2 className="text-xs font-extrabold text-slate-900 uppercase flex items-center gap-2">
              <User className="w-4 h-4 text-sky-600" />
              THÔNG TIN CÁ NHÂN
            </h2>
            <span className="text-[11px] text-slate-400">Cập nhật họ tên & SĐT</span>
          </div>

          {profileMsg && (
            <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
              profileMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}>
              {profileMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
              <span>{profileMsg.text}</span>
            </div>
          )}

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Họ và Tên cử tri / Cán bộ:</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold uppercase text-slate-900 outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Email nhận thông báo (Không đổi):</label>
              <input
                type="email"
                disabled
                value={currentUser.email}
                className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-xl font-mono text-slate-500 font-bold cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Số điện thoại liên hệ:</label>
              <input
                type="text"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-slate-900 outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            LƯU THÔNG TIN CÁ NHÂN
          </button>
        </form>

        {/* Form 2: Đổi mật khẩu */}
        <form onSubmit={handleChangePassword} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="border-b pb-3 flex items-center justify-between">
            <h2 className="text-xs font-extrabold text-slate-900 uppercase flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-sky-600" />
              ĐỔI MẬT KHẨU TÀI KHOẢN
            </h2>
            <span className="text-[11px] text-slate-400">Bảo mật thông tin</span>
          </div>

          {passwordMsg && (
            <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
              passwordMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}>
              {passwordMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
              <span>{passwordMsg.text}</span>
            </div>
          )}

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Mật khẩu hiện tại:</label>
              <input
                type="password"
                required
                value={oldPassword}
                onChange={e => setOldPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Mật khẩu mới (Tối thiểu 6 ký tự):</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Xác nhận mật khẩu mới:</label>
              <input
                type="password"
                required
                value={confirmNewPassword}
                onChange={e => setConfirmNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <Lock className="w-4 h-4" />
            CẬP NHẬT MẬT KHẨU MỚI
          </button>
        </form>
      </div>

      {/* Role Matrix Explanation Card */}
      <div className="p-5 bg-sky-50 rounded-3xl border border-sky-200 text-xs text-slate-800 space-y-2">
        <div className="font-extrabold text-sky-950 flex items-center gap-2 uppercase">
          <Shield className="w-4 h-4 text-sky-600" />
          <span>PHẠM VI QUYỀN HẠN: {currentUser.role}</span>
        </div>
        <p className="text-slate-600 leading-relaxed">
          {currentUser.role === 'ADMIN'
            ? 'Bạn đang sở hữu quyền Quản trị viên tối cao (ADMIN). Bạn có toàn quyền quản lý dữ liệu cử tri, ứng cử viên, điểm danh, kiểm phiếu siêu tốc, phê duyệt/kích hoạt tài khoản đăng ký mới và cài đặt hệ thống.'
            : currentUser.role === 'EDITOR'
            ? 'Bạn đang sở hữu quyền Cán bộ Kiểm phiếu & Nhập liệu (EDITOR). Bạn có quyền điểm danh cử tri, kiểm phiếu, nhập gạch phiếu siêu tốc và xuất báo cáo kết quả.'
            : 'Bạn đang sở hữu quyền Giám sát viên / Chỉ xem (VIEW). Tất cả các thao tác chỉnh sửa dữ liệu đã được khóa an toàn.'}
        </p>
      </div>
    </div>
  );
};
