import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  HelpCircle,
  Building,
  Clock,
  User,
  LogOut,
  Globe,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';
import { ElectionUnit, UserAccount, UserRole } from '../../types';

interface HeaderProps {
  unit: ElectionUnit;
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onOpenHelp: () => void;
  currentUser: UserAccount | null;
  onNavigateToProfile: () => void;
  onNavigateToLanding: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  unit,
  currentRole,
  setRole,
  searchTerm,
  setSearchTerm,
  onOpenHelp,
  currentUser,
  onNavigateToProfile,
  onNavigateToLanding,
  onLogout,
}) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentTime = new Date().toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name?: string) => {
    if (!name) return 'PT';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20 shadow-sm font-sans">
      {/* Left: Election Area Location Badge */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-sky-50 text-sky-700 px-3 py-1.5 rounded-lg border border-sky-200 text-xs font-semibold">
          <Building className="w-4 h-4 text-sky-600" />
          <span>
            Khu vực bỏ phiếu số {unit.votingAreaNo} - {unit.wardName}, {unit.province}
          </span>
          <span className="bg-sky-200 text-sky-900 px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider font-mono font-bold">
            Khóa {unit.term}
          </span>
        </div>
      </div>

      {/* Middle: Smart Search Input */}
      <div className="relative w-72 hidden md:block">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Tìm cử tri, ứng cử viên (Mã thẻ / Tên)..."
          className="w-full pl-9 pr-8 py-1.5 text-xs bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-700 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/30 transition-all"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
          >
            ✕
          </button>
        )}
      </div>

      {/* Right: Controls & Interactive User Avatar Logo */}
      <div className="flex items-center gap-3">
        {/* Real-time Clock */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
          <Clock className="w-3.5 h-3.5 text-sky-600" />
          <span>{currentTime}</span>
        </div>

        {/* Notifications */}
        <button
          className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          title="Thông báo hệ thống"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full animate-ping" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full" />
        </button>

        {/* Help button */}
        <button
          onClick={onOpenHelp}
          className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1 text-xs font-medium"
          title="Hướng dẫn sử dụng"
        >
          <HelpCircle className="w-4 h-4 text-sky-600" />
          <span className="hidden sm:inline">Trợ giúp</span>
        </button>

        {/* User Profile Logo Button & Integrated Dropdown Menu */}
        <div className="relative pl-2 border-l border-slate-200" ref={dropdownRef}>
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 transition-all text-left group"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-sky-600 to-teal-500 text-white font-black text-xs flex items-center justify-center shadow-md border border-sky-400/40 group-hover:scale-105 transition-transform">
              {getInitials(currentUser?.fullName)}
            </div>

            <div className="hidden xl:flex flex-col text-left">
              <span className="text-xs font-extrabold text-slate-900 leading-tight flex items-center gap-1">
                {currentUser?.fullName || 'Phạm Công Tuân'}
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </span>
              <span className="text-[10px] font-bold text-sky-700">
                {currentUser?.role || 'ADMIN'} MODE
              </span>
            </div>
          </button>

          {/* User Profile Dropdown Menu */}
          {showUserDropdown && (
            <div className="absolute right-0 top-12 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 animate-fade-in font-sans space-y-1">
              {/* User Identity Info */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
                <div className="font-extrabold text-xs text-slate-900 uppercase truncate">
                  {currentUser?.fullName}
                </div>
                <div className="text-[11px] font-mono text-slate-500 truncate">
                  {currentUser?.email}
                </div>
                <div className="pt-1 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-sky-100 text-sky-800 border border-sky-200">
                    {currentUser?.role}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-0.5">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    Đã xác thực
                  </span>
                </div>
              </div>

              {/* Menu Options */}
              <button
                onClick={() => {
                  setShowUserDropdown(false);
                  onNavigateToProfile();
                }}
                className="w-full px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-sky-50 hover:text-sky-800 flex items-center gap-2.5 transition-colors"
              >
                <User className="w-4 h-4 text-sky-600" />
                <span>Hồ sơ cá nhân</span>
              </button>

              <button
                onClick={() => {
                  setShowUserDropdown(false);
                  onNavigateToLanding();
                }}
                className="w-full px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-2.5 transition-colors"
              >
                <Globe className="w-4 h-4 text-slate-500" />
                <span>Trang giới thiệu</span>
              </button>

              <div className="border-t border-slate-100 pt-1">
                <button
                  onClick={() => {
                    setShowUserDropdown(false);
                    onLogout();
                  }}
                  className="w-full px-3 py-2.5 rounded-xl text-xs font-extrabold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors"
                >
                  <LogOut className="w-4 h-4 text-rose-600" />
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
