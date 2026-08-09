import React, { useState } from 'react';
import { User } from '../../types';
import { Search, Sparkles, Bell, HelpCircle, LogOut, ChevronDown, Award } from 'lucide-react';

interface TopHeaderProps {
  currentUser: User | null;
  onLogout: () => void;
  onOpenHelpGuide: () => void;
  onOpenAuthorInfo: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentUser,
  onLogout,
  onOpenHelpGuide,
  onOpenAuthorInfo
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="bg-white border-b border-slate-200 text-slate-800 h-16 px-4 flex items-center justify-between shadow-xs sticky top-0 z-20 select-none">
      
      {/* Left: Project Branding & Organization */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <span className="font-black text-slate-900 text-sm tracking-wide">KẾT QUẢ BẦU CỬ QUỐC GIA 2026 - 2031</span>
          <span className="px-2 py-0.5 text-[10px] font-extrabold bg-teal-50 text-teal-700 rounded border border-teal-200">
            TỔ 21 (ĐH)
          </span>
        </div>
      </div>

      {/* Center: Smart Search Bar */}
      <div className="hidden md:flex items-center space-x-2 bg-slate-100 border border-slate-300 rounded-full px-3 py-1.5 w-96 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/20 transition">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Tìm kiếm thông minh ứng cử viên, số phiếu, biên bản..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none w-full"
        />
        <span className="px-1.5 py-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold rounded text-[9px] shadow-xs flex items-center space-x-0.5">
          <Sparkles className="w-2.5 h-2.5" />
          <span>AI</span>
        </span>
      </div>

      {/* Right: Quick Action Buttons, Notifications & User Profile */}
      <div className="flex items-center space-x-3">
        
        <button
          onClick={onOpenHelpGuide}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-xs font-bold transition shadow-sm"
        >
          <HelpCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Hướng dẫn</span>
        </button>

        <div className="relative cursor-pointer p-2 hover:bg-slate-100 rounded-full transition">
          <Bell className="w-5 h-5 text-slate-600" />
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white rounded-full text-[9px] font-extrabold flex items-center justify-center border-2 border-white">
            15
          </span>
        </div>

        <div className="relative">
          <div
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-2 cursor-pointer p-1.5 hover:bg-slate-100 rounded-xl transition"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-amber-500 text-white font-bold flex items-center justify-center text-xs shadow">
              {currentUser?.fullName ? currentUser.fullName.charAt(0) : 'P'}
            </div>
            <div className="hidden sm:block text-left">
              <span className="text-xs font-bold text-slate-900 block leading-none">
                {currentUser?.fullName || 'Cán Bộ Kiểm Phiếu'}
              </span>
              <span className="text-[10px] text-teal-700 font-semibold block mt-0.5">
                Tác giả: <strong>Phạm Công Tuân</strong>
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </div>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl p-3 space-y-2 text-xs z-50 animate-fadeIn">
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="font-bold text-slate-900 block">{currentUser?.fullName}</span>
                <span className="text-slate-500 text-[11px] block">{currentUser?.email}</span>
                <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px] uppercase">
                  {currentUser?.role === 'admin' ? 'Quản Trị Viên' : 'Tổ Kiểm Phiếu'}
                </span>
              </div>

              <div className="p-2 bg-gradient-to-r from-red-50 to-amber-50 rounded-xl border border-red-100 text-slate-800 space-y-0.5">
                <div className="flex items-center space-x-1 text-red-800 font-bold text-[11px]">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  <span>TÁC GIẢ PHẦN MỀM:</span>
                </div>
                <p className="font-bold text-red-900 text-xs">Phạm Công Tuân</p>
                <p className="text-[11px] text-slate-600">Email: pctuanit@gmail.com</p>
                <p className="text-[11px] text-slate-600">Điện thoại: 0916 199 945</p>
              </div>

              <button
                onClick={onOpenAuthorInfo}
                className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 rounded-lg font-semibold transition"
              >
                Xem chi tiết bản quyền tác giả
              </button>

              <div className="border-t border-slate-100 pt-1">
                <button
                  onClick={onLogout}
                  className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg font-bold transition flex items-center space-x-1.5"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Đăng xuất tài khoản</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

    </header>
  );
};
