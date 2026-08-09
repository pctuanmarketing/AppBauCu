import React, { useState } from 'react';
import { User, Role } from '../../types';
import { getUsers, registerUser, activateUserCode } from '../../lib/storage';
import { Vote, Lock, User as UserIcon } from 'lucide-react';

interface AuthModalProps {
  onLoginSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onLoginSuccess }) => {
  const [tab, setTab] = useState<'login' | 'register' | 'activate'>('login');

  // Form inputs
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [requestedRole, setRequestedRole] = useState<Role>('editor');
  const [activationCode, setActivationCode] = useState('BAUCU2026');

  // Registered user pending activation
  const [registeredUser, setRegisteredUser] = useState<User | null>(null);

  // Status Messages
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const users = getUsers();
    const found = users.find(u => u.username.toLowerCase() === username.trim().toLowerCase());

    if (!found) {
      setErrorMsg('Tài khoản hoặc tên đăng nhập không tồn tại!');
      return;
    }

    if (found.status === 'pending_approval') {
      setErrorMsg('Tài khoản của bạn đã kích hoạt Email thành công nhưng ĐANG CHỜ ADMIN PHÊ DUYỆT trước khi đăng nhập!');
      return;
    }

    if (found.status === 'rejected') {
      setErrorMsg('Tài khoản của bạn đã bị từ chối phê duyệt bởi Admin!');
      return;
    }

    localStorage.setItem('current_user', JSON.stringify(found));
    onLoginSuccess(found);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!username || !fullName || !email) {
      setErrorMsg('Vui lòng điền đầy đủ các trường thông tin bắt buộc!');
      return;
    }

    try {
      const { user, message } = registerUser({
        username,
        fullName,
        email,
        phone,
        roleRequested: requestedRole
      });
      setRegisteredUser(user);
      setSuccessMsg(message);
      setTab('activate');
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi đăng ký!');
    }
  };

  const handleActivate = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!registeredUser) {
      setErrorMsg('Vui lòng thực hiện đăng ký trước!');
      return;
    }

    const res = activateUserCode(registeredUser.id, activationCode);
    if (!res.success) {
      setErrorMsg(res.message);
    } else {
      setSuccessMsg('🎉 Kích hoạt Email thành công! Tài khoản của bạn đã chuyển tới Admin để phê duyệt cấp quyền.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-red-950 flex flex-col justify-center items-center p-4 font-sans select-none">
      
      {/* Brand Header Badge */}
      <div className="mb-6 text-center space-y-2">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-red-600 via-red-700 to-amber-500 flex items-center justify-center text-white shadow-xl shadow-red-600/40 border border-amber-400/50">
          <Vote className="w-9 h-9" />
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide uppercase">
          HỆ THỐNG KIỂM PHIẾU BẦU CỬ 2026
        </h1>
        <p className="text-xs text-amber-300 font-semibold">
          Tác giả: <strong>Phạm Công Tuân</strong> (0916 199 945 - pctuanit@gmail.com)
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 text-xs text-slate-200">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 pb-2 space-x-2 font-bold text-xs">
          <button
            onClick={() => { setTab('login'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 py-2 text-center rounded-xl transition ${
              tab === 'login' ? 'bg-red-700 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            Đăng Nhập
          </button>
          <button
            onClick={() => { setTab('register'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 py-2 text-center rounded-xl transition ${
              tab === 'register' ? 'bg-red-700 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            Đăng Ký Tài Khoản
          </button>
        </div>

        {/* Status Alerts */}
        {errorMsg && (
          <div className="p-3 bg-red-950/80 border border-red-800 rounded-xl text-red-300 font-semibold leading-relaxed">
            ⚠️ {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-950/80 border border-emerald-800 rounded-xl text-emerald-300 font-semibold leading-relaxed">
            ✓ {successMsg}
          </div>
        )}

        {/* LOGIN TAB */}
        {tab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Tên đăng nhập / Email</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="Nhập tên đăng nhập (ví dụ: admin, editor1, viewer1)"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Mật khẩu</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-red-600/30 transition"
            >
              ĐĂNG NHẬP HỆ THỐNG
            </button>

            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 text-[11px] text-slate-400 space-y-1">
              <span className="font-bold text-amber-300 block">Tài khoản mặc định thử nghiệm:</span>
              <p>• <strong>👑 Admin:</strong> `admin` (Toàn quyền quản trị & duyệt tài khoản)</p>
              <p>• <strong>✏️ Editor:</strong> `editor1` (Cán bộ nhập phiếu kiểm bầu cử)</p>
              <p>• <strong>👁️ Viewer:</strong> `viewer1` (Quan sát viên chỉ đọc số liệu)</p>
            </div>
          </form>
        )}

        {/* REGISTER TAB */}
        {tab === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Tên đăng nhập *</label>
              <input
                type="text"
                required
                placeholder="Ví dụ: tuanpham"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Họ và tên cán bộ *</label>
              <input
                type="text"
                required
                placeholder="Ví dụ: Phạm Công Tuân"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Email đăng ký *</label>
              <input
                type="email"
                required
                placeholder="Ví dụ: pctuanit@gmail.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Số điện thoại</label>
              <input
                type="text"
                placeholder="Ví dụ: 0916199945"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Quyền đề xuất đăng ký</label>
              <select
                value={requestedRole}
                onChange={e => setRequestedRole(e.target.value as Role)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
              >
                <option value="editor">✏️ Editor (Cán bộ Tổ bầu cử)</option>
                <option value="viewer">👁️ Viewer (Quan sát viên - Chỉ đọc)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-red-600 to-amber-600 text-white rounded-xl font-bold text-xs shadow-lg transition"
            >
              TIẾP TỤC ĐĂNG KÝ & KÍCH HOẠT EMAIL
            </button>
          </form>
        )}

        {/* ACTIVATION CODE TAB */}
        {tab === 'activate' && (
          <form onSubmit={handleActivate} className="space-y-4">
            <div className="p-3 bg-amber-950/40 border border-amber-500/30 rounded-xl space-y-1">
              <span className="font-bold text-amber-300 block">Bước Kích hoạt Email:</span>
              <p className="text-slate-300">
                Đã gửi mã kích hoạt Email cho cán bộ <strong className="text-white">{registeredUser?.fullName}</strong>.
              </p>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Mã kích hoạt Email</label>
              <input
                type="text"
                required
                value={activationCode}
                onChange={e => setActivationCode(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold text-center text-sm focus:outline-none focus:border-amber-500"
              />
              <span className="text-[10px] text-slate-400 block mt-1">Mã thử nghiệm mặc định: <strong>BAUCU2026</strong></span>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-lg transition"
            >
              XÁC NHẬN KÍCH HOẠT EMAIL
            </button>

            <button
              type="button"
              onClick={() => setTab('login')}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold text-xs"
            >
              Quay lại màn hình Đăng nhập
            </button>
          </form>
        )}

      </div>

    </div>
  );
};
