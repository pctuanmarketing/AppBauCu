import React, { useState, useEffect } from 'react';
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
  Eye,
  EyeOff,
  ShieldAlert,
  KeyRound,
  Send,
  ArrowLeft,
} from 'lucide-react';
import { UserAccount, UserRole } from '../../types';
import { sendRealEmail, EmailPayload } from '../../lib/emailService';

interface AuthModalProps {
  mode: 'LOGIN' | 'REGISTER';
  onClose: () => void;
  onSwitchMode: (mode: 'LOGIN' | 'REGISTER') => void;
  onLoginSuccess: (user: UserAccount) => void;
  registeredUsers: UserAccount[];
  onRegisterSubmit: (newUser: Omit<UserAccount, 'id' | 'createdAt' | 'status' | 'role'>) => void;
  onResetPassword?: (emailOrPhone: string, newPassword: string) => void;
  onShowEmailModal: (emailData: EmailPayload) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  mode,
  onClose,
  onSwitchMode,
  onLoginSuccess,
  registeredUsers,
  onRegisterSubmit,
  onResetPassword,
  onShowEmailModal,
}) => {
  // Internal View Mode State
  const [viewMode, setViewMode] = useState<'LOGIN' | 'REGISTER' | 'FORGOT_PASSWORD'>(mode);

  useEffect(() => {
    setViewMode(mode);
  }, [mode]);

  // Login Form States
  const [loginInput, setLoginInput] = useState(''); // Email or Phone number
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Security Anti-Brute-Force Lockout State
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTimer, setLockoutTimer] = useState(0);

  // Register Form States
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regError, setRegError] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regSuccessMsg, setRegSuccessMsg] = useState(false);

  // Forgot / Reset Password States
  const [resetInput, setResetInput] = useState('');
  const [resetStep, setResetStep] = useState<1 | 2>(1);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [inputOtp, setInputOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  const [targetResetUser, setTargetResetUser] = useState<UserAccount | null>(null);

  // Lockout Timer countdown effect
  useEffect(() => {
    let timerId: any;
    if (lockoutTimer > 0) {
      timerId = setTimeout(() => {
        setLockoutTimer(prev => prev - 1);
      }, 1000);
    } else if (lockoutTimer === 0 && failedAttempts >= 5) {
      setFailedAttempts(0);
    }
    return () => clearTimeout(timerId);
  }, [lockoutTimer, failedAttempts]);

  // Compute Password Strength Meter (0 - 4)
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (!pass) return score;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass) || /[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const strengthScore = getPasswordStrength(regPassword);

  // Handle Login Submit (Supports Email OR Phone Number)
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (lockoutTimer > 0) {
      setLoginError(`🔒 Hệ thống tạm khóa do nhập sai 5 lần liên tiếp. Vui lòng thử lại sau ${lockoutTimer} giây.`);
      return;
    }

    const cleanInput = loginInput.trim().toLowerCase();
    if (!cleanInput || !loginPassword) {
      setLoginError('Vui lòng nhập đầy đủ Email / Số điện thoại và Mật khẩu.');
      return;
    }

    // Default admin fallback match
    if ((cleanInput === 'pctuanit@gmail.com' || cleanInput === '0916199945') && loginPassword === '123456') {
      setFailedAttempts(0);
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

    // Find registered user by Email or Phone
    const matchedUser = registeredUsers.find(
      u => (u.email.toLowerCase() === cleanInput || u.phone.trim() === cleanInput) && u.password === loginPassword
    );

    if (!matchedUser) {
      const nextFail = failedAttempts + 1;
      setFailedAttempts(nextFail);
      if (nextFail >= 5) {
        setLockoutTimer(30);
        setLoginError('🔒 Đã thử sai 5 lần! Hệ thống tạm thời khóa đăng nhập trong 30 giây để bảo mật.');
      } else {
        setLoginError(`❌ Email/Số điện thoại hoặc Mật khẩu không đúng. (Sai ${nextFail}/5 lần)`);
      }
      return;
    }

    if (matchedUser.status === 'PENDING') {
      setLoginError('⏳ Tài khoản của bạn đang CHỜ QUẢN TRỊ VIÊN PHÊ DUYỆT. Email thông báo sẽ được gửi khi kích hoạt!');
      return;
    }

    if (matchedUser.status === 'REJECTED') {
      setLoginError('❌ Tài khoản của bạn đã bị từ chối phê duyệt. Vui lòng liên hệ Quản trị viên hệ thống!');
      return;
    }

    setFailedAttempts(0);
    onLoginSuccess(matchedUser);
    onClose();
  };

  // Handle Send Password Reset OTP via Email/Phone
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');
    setResetSuccess('');

    const cleanInput = resetInput.trim().toLowerCase();
    if (!cleanInput) {
      setResetError('Vui lòng nhập Email hoặc Số điện thoại đã đăng ký.');
      return;
    }

    let matched = registeredUsers.find(
      u => u.email.toLowerCase() === cleanInput || u.phone.trim() === cleanInput
    );

    if (!matched && (cleanInput === 'pctuanit@gmail.com' || cleanInput === '0916199945')) {
      matched = {
        id: 'admin-default',
        fullName: 'Phạm Công Tuân',
        email: 'pctuanit@gmail.com',
        phone: '0916199945',
        role: 'ADMIN',
        status: 'APPROVED',
        createdAt: new Date().toISOString(),
      };
    }

    if (!matched) {
      setResetError('❌ Không tìm thấy tài khoản nào phù hợp với Email hoặc Số điện thoại này!');
      return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    setTargetResetUser(matched);

    const emailPayload: EmailPayload = {
      to_name: matched.fullName,
      to_email: matched.email,
      phone: matched.phone,
      subject: `[HỆ THỐNG BẦU CỬ] MÃ XÁC THỰC OTP KHÔI PHỤC MẬT KHẨU: ${otp}`,
      type: 'PASSWORD_RESET_OTP',
      message_html: `
        <p>Hệ thống Kiểm phiếu Bầu cử Điện tử nhận được yêu cầu khôi phục mật khẩu cho tài khoản <strong>${matched.fullName}</strong> (${matched.email}).</p>
        <p>Mã OTP xác thực khôi phục mật khẩu của bạn là:</p>
        <div style="background-color: #f0f9ff; border: 2px solid #38bdf8; padding: 16px; border-radius: 12px; text-align: center; margin: 16px 0;">
          <strong style="color: #0284c7; font-size: 32px; letter-spacing: 6px; font-family: monospace;">${otp}</strong>
        </div>
        <p>Vui lòng nhập mã OTP gồm 6 chữ số này vào giao diện phần mềm để hoàn tất khôi phục mật khẩu mới.</p>
      `,
    };

    await sendRealEmail(emailPayload);
    onShowEmailModal(emailPayload);

    setResetStep(2);
    setResetSuccess(`✅ Mã xác thực OTP đã được gửi đến ${matched.email}!`);
  };

  // Handle Verify OTP and Save New Password
  const handleVerifyOtpAndResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');
    setResetSuccess('');

    if (inputOtp.trim() !== generatedOtp) {
      setResetError('❌ Mã OTP xác thực không chính xác. Vui lòng kiểm tra lại!');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setResetError('❌ Mật khẩu mới phải có tối thiểu 6 ký tự.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setResetError('❌ Mật khẩu xác nhận không trùng khớp.');
      return;
    }

    if (onResetPassword && targetResetUser) {
      onResetPassword(targetResetUser.email, newPassword);
    }

    setResetSuccess('🎉 Khôi phục mật khẩu thành công! Chuyển sang trang Đăng nhập...');

    setTimeout(() => {
      setLoginInput(targetResetUser?.email || '');
      setLoginPassword(newPassword);
      setViewMode('LOGIN');
      onSwitchMode('LOGIN');
      setResetStep(1);
      setResetInput('');
      setInputOtp('');
      setNewPassword('');
      setConfirmNewPassword('');
      setResetSuccess('');
    }, 2000);
  };

  // Handle Register Submit with strict security validations
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    const cleanName = regFullName.trim();
    const cleanEmail = regEmail.trim().toLowerCase();
    const cleanPhone = regPhone.trim();

    if (!cleanName || cleanName.length < 3) {
      setRegError('Họ và Tên phải có ít nhất 3 ký tự.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      setRegError('Vui lòng nhập địa chỉ Email hợp lệ (VD: user@domain.com).');
      return;
    }

    const phoneRegex = /^(0|\+84)[0-9]{8,11}$/;
    if (!cleanPhone || !phoneRegex.test(cleanPhone)) {
      setRegError('Số điện thoại không hợp lệ (VD: 0916199945).');
      return;
    }

    if (!regPassword || regPassword.length < 6) {
      setRegError('Mật khẩu phải có tối thiểu 6 ký tự.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError('Mật khẩu xác nhận không trùng khớp.');
      return;
    }

    // Check duplicate Email or Phone
    const existingEmail = registeredUsers.find(u => u.email.toLowerCase() === cleanEmail);
    if (existingEmail) {
      setRegError('❌ Địa chỉ Email này đã tồn tại trên hệ thống. Vui lòng đăng nhập hoặc dùng email khác.');
      return;
    }

    const existingPhone = registeredUsers.find(u => u.phone === cleanPhone);
    if (existingPhone) {
      setRegError('❌ Số điện thoại này đã được đăng ký. Vui lòng kiểm tra lại!');
      return;
    }

    onRegisterSubmit({
      fullName: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      password: regPassword,
    });

    const emailPayload: EmailPayload = {
      to_name: cleanName,
      to_email: cleanEmail,
      phone: cleanPhone,
      subject: '[HỆ THỐNG BẦU CỬ] XÁC NHẬN ĐÃ TIẾP NHẬN ĐĂNG KÝ TÀI KHOẢN',
      type: 'REGISTRATION_CONFIRMATION',
      message_html: `
        <p>Hệ thống Kiểm phiếu Bầu cử Điện tử đã tiếp nhận thành công yêu cầu đăng ký tài khoản của bạn:</p>
        <ul>
          <li><strong>Họ và Tên:</strong> ${cleanName}</li>
          <li><strong>Email đăng nhập:</strong> ${cleanEmail}</li>
          <li><strong>Số điện thoại:</strong> ${cleanPhone}</li>
          <li><strong>Trạng thái bảo mật:</strong> CHỜ QUẢN TRỊ VIÊN PHÊ DUYỆT CẤP QUYỀN</li>
        </ul>
        <p>Quản trị viên tối cao (Admin) sẽ kiểm tra thông tin và phân công quyền hạn truy cập (ADMIN / EDITOR / VIEW). Ngay sau khi kích hoạt, hệ thống sẽ gửi Email thông báo tự động cho bạn.</p>
      `,
    };

    onShowEmailModal(emailPayload);
    setRegSuccessMsg(true);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-sans animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden relative">
        {/* Top Gradient Header */}
        <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-400/30 flex items-center justify-center font-black text-2xl mx-auto shadow-lg mb-3">
            🗳️
          </div>

          <h2 className="text-lg font-black uppercase tracking-tight text-white">
            {mode === 'LOGIN' ? 'ĐĂNG NHẬP HỆ THỐNG' : 'ĐĂNG KÝ TÀI KHOẢN MỚI'}
          </h2>
          <p className="text-xs text-slate-300 font-medium mt-1">
            {mode === 'LOGIN'
              ? 'Hệ thống Kiểm phiếu Bầu cử Điện tử An Trạch - Hòa Tiến'
              : 'Gửi yêu cầu đăng ký tài khoản truy cập phần mềm'}
          </p>
        </div>

        {/* Tab Switcher Buttons */}
        <div className="flex border-b border-slate-100 bg-slate-50/80 p-1.5">
          <button
            onClick={() => {
              setLoginError('');
              onSwitchMode('LOGIN');
            }}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
              mode === 'LOGIN'
                ? 'bg-white text-sky-900 shadow-sm font-extrabold border border-slate-200'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LogIn className="w-4 h-4 text-sky-600" />
            <span>Đăng Nhập</span>
          </button>
          <button
            onClick={() => {
              setRegError('');
              onSwitchMode('REGISTER');
            }}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
              mode === 'REGISTER'
                ? 'bg-white text-sky-900 shadow-sm font-extrabold border border-slate-200'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserPlus className="w-4 h-4 text-sky-600" />
            <span>Đăng Ký Mới</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {mode === 'LOGIN' ? (
            /* LOGIN FORM */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {loginError && (
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-bold flex items-center gap-2 shadow-2xs">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase">
                  Email hoặc Số điện thoại:
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={loginInput}
                    onChange={e => setLoginInput(e.target.value)}
                    placeholder="VD: pctuanit@gmail.com hoặc 0916199945..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-sky-500 focus:bg-white outline-none transition-all text-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase">
                  Mật khẩu:
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    placeholder="Nhập mật khẩu..."
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-sky-500 focus:bg-white outline-none transition-all text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex justify-end pt-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginError('');
                      setResetError('');
                      setResetSuccess('');
                      setViewMode('FORGOT_PASSWORD');
                    }}
                    className="text-xs font-bold text-sky-600 hover:text-sky-800 hover:underline flex items-center gap-1"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Quên mật khẩu?</span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={lockoutTimer > 0}
                className="w-full py-3 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-sky-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <LogIn className="w-4 h-4" />
                <span>Xác nhận Đăng Nhập</span>
              </button>
            </form>
          ) : viewMode === 'FORGOT_PASSWORD' ? (
            /* FORGOT & RESET PASSWORD FORM */
            <div className="space-y-4">
              {resetError && (
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-bold flex items-center gap-2 shadow-2xs">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{resetError}</span>
                </div>
              )}

              {resetSuccess && (
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs font-bold flex items-center gap-2 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{resetSuccess}</span>
                </div>
              )}

              {resetStep === 1 ? (
                /* STEP 1: ENTER EMAIL OR PHONE TO SEND OTP */
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs text-sky-900 font-medium space-y-1">
                    <p className="font-bold flex items-center gap-1.5 text-sky-950">
                      <KeyRound className="w-4 h-4 text-sky-600" />
                      <span>Khôi phục mật khẩu bằng Email hoặc SĐT</span>
                    </p>
                    <p className="text-[11px] text-slate-600">
                      Nhập địa chỉ Email hoặc Số điện thoại đã đăng ký để nhận <strong>Mã xác thực OTP (6 chữ số)</strong> gửi về email của bạn.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 uppercase">
                      Email hoặc Số điện thoại đăng ký:
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={resetInput}
                        onChange={e => setResetInput(e.target.value)}
                        placeholder="VD: pctuanit@gmail.com hoặc 0916199945..."
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-sky-500 focus:bg-white outline-none transition-all text-slate-900"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-sky-600 via-sky-700 to-blue-700 hover:from-sky-700 hover:to-blue-800 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-sky-600/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>GỬI MÃ XÁC THỰC (OTP) KHÔI PHỤC</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setViewMode('LOGIN');
                      onSwitchMode('LOGIN');
                    }}
                    className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Quay lại trang Đăng nhập</span>
                  </button>
                </form>
              ) : (
                /* STEP 2: ENTER OTP & NEW PASSWORD */
                <form onSubmit={handleVerifyOtpAndResetPassword} className="space-y-3.5">
                  {targetResetUser && (
                    <div className="p-2.5 bg-slate-100 rounded-xl border border-slate-200 text-xs text-slate-700 flex items-center justify-between">
                      <span>Tài khoản khôi phục:</span>
                      <strong className="text-sky-900 font-bold">{targetResetUser.fullName} ({targetResetUser.email})</strong>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 uppercase">
                      Mã xác thực OTP (6 chữ số):
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={inputOtp}
                      onChange={e => setInputOtp(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="Nhập 6 chữ số OTP..."
                      className="w-full px-4 py-2.5 bg-white border-2 border-sky-400 rounded-xl text-center text-xl font-mono font-black text-sky-900 tracking-widest focus:ring-2 focus:ring-sky-500 outline-none shadow-inner"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 uppercase">
                      Mật khẩu mới:
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)..."
                        className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-sky-500 focus:bg-white outline-none transition-all text-slate-900"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 uppercase">
                      Xác nhận mật khẩu mới:
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        value={confirmNewPassword}
                        onChange={e => setConfirmNewPassword(e.target.value)}
                        placeholder="Nhập lại mật khẩu mới..."
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-sky-500 focus:bg-white outline-none transition-all text-slate-900"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>XÁC NHẬN ĐỔI MẬT KHẨU MỚI</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setResetStep(1)}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition-all"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Nhập lại Email/SĐT khác</span>
                  </button>
                </form>
              )}
            </div>
          ) : regSuccessMsg ? (
            /* REGISTER SUCCESS MODAL SCREEN */
            <div className="text-center space-y-4 py-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-black text-slate-900 uppercase">
                  ĐĂNG KÝ THÀNH CÔNG!
                </h3>
                <p className="text-xs text-slate-600 font-medium max-w-xs mx-auto">
                  Yêu cầu cấp tài khoản của bạn đã được gửi tới Quản trị viên. Bạn sẽ nhận được Email xác nhận kích hoạt ngay khi được phê duyệt.
                </p>
              </div>
              <button
                onClick={() => {
                  setRegSuccessMsg(false);
                  onSwitchMode('LOGIN');
                }}
                className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-black rounded-xl shadow transition-all"
              >
                Quay lại Đăng nhập
              </button>
            </div>
          ) : (
            /* REGISTER FORM */
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              {regError && (
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-bold flex items-center gap-2 shadow-2xs">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{regError}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase">
                  Họ và Tên đầy đủ:
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={regFullName}
                    onChange={e => setRegFullName(e.target.value)}
                    placeholder="VD: Phạm Công Tuân..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-sky-500 focus:bg-white outline-none transition-all text-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase">
                  Email chính thức:
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    placeholder="VD: tuan@domain.com..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-sky-500 focus:bg-white outline-none transition-all text-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase">
                  Số điện thoại liên hệ:
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={regPhone}
                    onChange={e => setRegPhone(e.target.value)}
                    placeholder="VD: 0916199945..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-sky-500 focus:bg-white outline-none transition-all text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase">
                    Mật khẩu (≥6 ký tự):
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      value={regPassword}
                      onChange={e => setRegPassword(e.target.value)}
                      placeholder="Mật khẩu..."
                      className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-sky-500 focus:bg-white outline-none transition-all text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase">
                    Xác nhận mật khẩu:
                  </label>
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    value={regConfirmPassword}
                    onChange={e => setRegConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-sky-500 focus:bg-white outline-none transition-all text-slate-900"
                  />
                </div>
              </div>

              {/* Password Strength Meter */}
              {regPassword && (
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                    <span>Độ mạnh mật khẩu:</span>
                    <span className={
                      strengthScore <= 1 ? 'text-rose-600' : strengthScore === 2 ? 'text-amber-600' : 'text-emerald-600'
                    }>
                      {strengthScore <= 1 ? 'Yếu' : strengthScore === 2 ? 'Trung bình' : 'Rất mạnh'}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden flex gap-0.5">
                    <div className={`h-full flex-1 transition-all ${strengthScore >= 1 ? 'bg-rose-500' : 'bg-slate-300'}`} />
                    <div className={`h-full flex-1 transition-all ${strengthScore >= 2 ? 'bg-amber-500' : 'bg-slate-300'}`} />
                    <div className={`h-full flex-1 transition-all ${strengthScore >= 3 ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                    <div className={`h-full flex-1 transition-all ${strengthScore >= 4 ? 'bg-emerald-600' : 'bg-slate-300'}`} />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-sky-600/20 transition-all flex items-center justify-center gap-2 mt-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Gửi Yêu Cầu Đăng Ký</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
