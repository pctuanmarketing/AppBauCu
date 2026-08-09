import React, { useState } from 'react';
import {
  X,
  LogIn,
  UserPlus,
  Mail,
  Lock,
  Phone,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { UserAccount, UserRole } from '../../types';

interface AuthModalProps {
  mode: 'LOGIN' | 'REGISTER';
  onClose: () => void;
  onSwitchMode: (mode: 'LOGIN' | 'REGISTER') => void;
  onLoginSuccess: (user: UserAccount) => void;
  registeredUsers: UserAccount[];
  onRegisterSubmit: (newUser: Omit<UserAccount, 'id' | 'createdAt' | 'status' | 'role'>) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  mode,
  onClose,
  onSwitchMode,
  onLoginSuccess,
  registeredUsers,
  onRegisterSubmit,
}) => {
  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register Form States
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regError, setRegError] = useState('');

  // Email Confirmation Preview Screen
  const [emailConfirmationData, setEmailConfirmationData] = useState<{
    fullName: string;
    email: string;
    phone: string;
  } | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const cleanEmail = loginEmail.trim().toLowerCase();
    const matchedUser = registeredUsers.find(
      u => u.email.toLowerCase() === cleanEmail && u.password === loginPassword
    );

    if (!matchedUser) {
      // Default super-admin shortcut for testing if list is fresh
      if (cleanEmail === 'pctuanit@gmail.com' && loginPassword === '123456') {
        onLoginSuccess({
          id: 'admin-default',
          fullName: 'Phạm Công Tuân (Admin)',
          email: 'pctuanit@gmail.com',
          phone: '0916199945',
          role: 'ADMIN',
          status: 'APPROVED',
          createdAt: new Date().toISOString(),
        });
        onClose();
        return;
      }
      setLoginError('❌ Email hoặc Mật khẩu không đúng. Vui lòng kiểm tra lại!');
      return;
    }

    if (matchedUser.status === 'PENDING') {
      setLoginError('⏳ Tài khoản của bạn đang CHỜ QUẢN TRỊ VIÊN DUYỆT CẤP QUYỀN. Email thông báo sẽ gửi khi tài khoản được kích hoạt!');
      return;
    }

    if (matchedUser.status === 'REJECTED') {
      setLoginError('❌ Yêu cầu đăng ký tài khoản của bạn đã bị từ chối. Vui lòng liên hệ Quản trị viên!');
      return;
    }

    onLoginSuccess(matchedUser);
    onClose();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!regFullName.trim()) {
      setRegError('Vui lòng nhập Họ và Tên.');
      return;
    }

    if (!regEmail.trim() || !regEmail.includes('@')) {
      setRegError('Vui lòng nhập định dạng Email hợp lệ.');
      return;
    }

    if (!regPhone.trim()) {
      setRegError('Vui lòng nhập Số điện thoại.');
      return;
    }

    if (!regPassword || regPassword.length < 6) {
      setRegError('Mật khẩu phải có tối thiểu 6 ký tự.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError('Xác nhận mật khẩu không trùng khớp.');
      return;
    }

    const existing = registeredUsers.find(
      u => u.email.toLowerCase() === regEmail.trim().toLowerCase()
    );
    if (existing) {
      setRegError('Email này đã được đăng ký trên hệ thống. Vui lòng đăng nhập hoặc dùng email khác.');
      return;
    }

    onRegisterSubmit({
      fullName: regFullName.trim(),
      email: regEmail.trim(),
      phone: regPhone.trim(),
      password: regPassword,
    });

    setEmailConfirmationData({
      fullName: regFullName.trim(),
      email: regEmail.trim(),
      phone: regPhone.trim(),
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in font-sans">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden relative">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-sky-900 to-blue-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-300 flex items-center justify-center font-bold">
              🗳️
            </div>
            <div>
              <h2 className="text-sm font-extrabold tracking-tight">
                {mode === 'LOGIN' ? 'ĐĂNG NHẬP PHẦN MỀM BẦU CỬ' : 'ĐĂNG KÝ TÀI KHOẢN CẤP QUYỀN'}
              </h2>
              <p className="text-[11px] text-sky-200/80">Hệ thống Kiểm phiếu Bầu cử Điện tử</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-white/70 hover:text-white font-bold p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Email Confirmation Dialog (Sau khi Đăng ký thành công) */}
        {emailConfirmationData ? (
          <div className="p-6 space-y-4 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <Mail className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-black text-slate-900">ĐÃ GỬI XÁC NHẬN ĐĂNG KÝ TÀI KHOẢN!</h3>
              <p className="text-xs text-slate-600 font-medium">
                Email xác nhận đã được gửi tự động đến: <strong className="text-sky-700">{emailConfirmationData.email}</strong>
              </p>
            </div>

            <div className="p-4 bg-sky-50 rounded-2xl border border-sky-200 text-left text-xs text-slate-700 space-y-2">
              <div className="font-bold text-sky-950 flex items-center gap-1.5 border-b border-sky-200 pb-1.5">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>Trạng thái: CHỜ QUẢN TRỊ VIÊN DUYỆT CẤP QUYỀN</span>
              </div>
              <p>
                - <strong>Họ tên:</strong> {emailConfirmationData.fullName}
                <br />- <strong>Số điện thoại:</strong> {emailConfirmationData.phone}
                <br />- <strong>Quyền hạn:</strong> Sẽ được Quản trị phân công (ADMIN / EDITOR / VIEW)
              </p>
              <p className="text-[11px] text-slate-500 italic pt-1">
                📌 Ngay sau khi Quản trị viên phê duyệt, hệ thống sẽ tự động gửi email thông báo kích hoạt tài khoản để bạn đăng nhập!
              </p>
            </div>

            <button
              onClick={() => {
                setEmailConfirmationData(null);
                onSwitchMode('LOGIN');
              }}
              className="w-full py-3 bg-gradient-to-r from-sky-600 to-blue-600 text-white font-extrabold text-xs rounded-xl shadow-lg hover:opacity-95 transition-all"
            >
              Chuyển đến màn hình Đăng nhập ➔
            </button>
          </div>
        ) : mode === 'LOGIN' ? (
          /* LOGIN FORM */
          <form onSubmit={handleLoginSubmit} className="p-6 space-y-4 text-xs">
            {loginError && (
              <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-rose-800 font-bold flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="block font-bold text-slate-700">Email đăng nhập:</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  placeholder="pctuanit@gmail.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-slate-700">Mật khẩu:</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-sky-600/30 transition-all flex items-center justify-center gap-2 transform active:scale-95"
            >
              <LogIn className="w-4 h-4" />
              <span>ĐĂNG NHẬP VÀO ỨNG DỤNG</span>
            </button>

            <div className="pt-3 border-t text-center text-slate-600 font-medium">
              Chưa có tài khoản?{' '}
              <button
                type="button"
                onClick={() => onSwitchMode('REGISTER')}
                className="font-extrabold text-sky-700 hover:underline"
              >
                Đăng ký cấp quyền ngay ➔
              </button>
            </div>

            <div className="p-2.5 bg-slate-100 rounded-xl text-[11px] text-slate-500 text-center font-mono">
              🔑 Mẹo thử nghiệm Admin: Email: <strong>pctuanit@gmail.com</strong> | Pass: <strong>123456</strong>
            </div>
          </form>
        ) : (
          /* REGISTER FORM */
          <form onSubmit={handleRegisterSubmit} className="p-6 space-y-3.5 text-xs max-h-[80vh] overflow-y-auto">
            {regError && (
              <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-rose-800 font-bold flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{regError}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="block font-bold text-slate-700">Họ và Tên cử tri / Nhân sự:</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={regFullName}
                  onChange={e => setRegFullName(e.target.value)}
                  placeholder="Phạm Công Tuân"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 uppercase outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="block font-bold text-slate-700">Email nhận thông báo:</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    placeholder="tuan.pham@email.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-700">Điện thoại liên hệ:</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={regPhone}
                    onChange={e => setRegPhone(e.target.value)}
                    placeholder="0916199945"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-slate-900 outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="block font-bold text-slate-700">Mật khẩu:</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={e => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-700">Xác nhận mật khẩu:</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={regConfirmPassword}
                    onChange={e => setRegConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 transform active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              <span>GỬI YÊU CẦU ĐĂNG KÝ THỦ TỤC CẤP QUYỀN</span>
            </button>

            <div className="pt-2 border-t text-center text-slate-600 font-medium">
              Đã có tài khoản?{' '}
              <button
                type="button"
                onClick={() => onSwitchMode('LOGIN')}
                className="font-extrabold text-sky-700 hover:underline"
              >
                Đăng nhập ngay ➔
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
