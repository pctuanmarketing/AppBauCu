import React from 'react';
import { Mail, CheckCircle2, X, Send, ShieldCheck, Sparkles, ExternalLink } from 'lucide-react';
import { EmailPayload } from '../../lib/emailService';

interface EmailNotificationModalProps {
  emailData: EmailPayload;
  onClose: () => void;
}

export const EmailNotificationModal: React.FC<EmailNotificationModalProps> = ({
  emailData,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4 font-sans animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden relative space-y-0">
        {/* Header Bar representing Email App */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-md">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-xs tracking-tight flex items-center gap-1.5">
                <span>HỆ THỐNG THÔNG BÁO EMAIL TỰ ĐỘNG</span>
                <span className="bg-emerald-500/20 text-emerald-300 text-[9px] px-2 py-0.5 rounded-full font-bold border border-emerald-400/30">
                  REAL-TIME MAIL DISPATCH
                </span>
              </div>
              <p className="text-[10px] text-slate-400">Đã phát thư trực tiếp đến hộp thư người dùng</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white font-bold p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Email Envelope Container */}
        <div className="p-6 space-y-4 bg-slate-50">
          {/* Metadata Bar */}
          <div className="p-3 bg-white rounded-2xl border border-slate-200 text-xs space-y-1.5 shadow-2xs">
            <div className="flex items-center justify-between text-slate-600">
              <span><strong>Người gửi:</strong> HeThongBauCu@Danang.gov.vn</span>
              <span className="text-[10px] font-mono text-slate-400">Vừa xong</span>
            </div>
            <div className="text-slate-800">
              <strong>Gửi đến:</strong> <span className="font-mono text-sky-700 font-bold">{emailData.to_email}</span> ({emailData.to_name})
            </div>
            <div className="text-slate-900 font-bold border-t border-slate-100 pt-1.5 flex items-center gap-1.5 text-xs">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Tiêu đề: {emailData.subject}</span>
            </div>
          </div>

          {/* Email Body Content */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200 text-xs text-slate-700 leading-relaxed shadow-sm space-y-3">
            <div className="font-extrabold text-slate-900 text-sm border-b pb-2 flex items-center justify-between">
              <span>KÍNH GỬI ÔNG/BÀ: {emailData.to_name.toUpperCase()}</span>
              {emailData.type === 'ACCOUNT_ACTIVATED' ? (
                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold text-[11px] border border-emerald-200">
                  ✓ ĐÃ KÍCH HOẠT
                </span>
              ) : emailData.type === 'PASSWORD_RESET_OTP' ? (
                <span className="text-sky-700 bg-sky-50 px-2 py-0.5 rounded font-bold text-[11px] border border-sky-200">
                  🔑 MÃ OTP KHÔI PHỤC
                </span>
              ) : (
                <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-bold text-[11px] border border-amber-200">
                  ⏳ ĐANG XEM XÉT
                </span>
              )}
            </div>

            <div
              className="prose prose-xs max-w-none text-slate-700 space-y-2"
              dangerouslySetInnerHTML={{ __html: emailData.message_html }}
            />

            <div className="pt-3 border-t text-[11px] text-slate-500 flex items-center justify-between">
              <span>Trân trọng,<br /><strong>Ban Quản trị Hệ thống Kiểm phiếu Bầu cử</strong></span>
              <div className="flex items-center gap-1 text-emerald-600 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Đã phát Email</span>
              </div>
            </div>
          </div>

          {/* Action Close */}
          <button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Đóng thông báo Email</span>
          </button>
        </div>
      </div>
    </div>
  );
};
