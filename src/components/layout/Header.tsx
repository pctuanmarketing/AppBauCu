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
  Check,
  CheckCheck,
  Trash2,
  Vote,
  Users,
  Sparkles,
  Settings,
} from 'lucide-react';
import { ElectionUnit, SystemNotification, UserAccount, UserRole } from '../../types';

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

  notifications?: SystemNotification[];
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onClearNotifications?: () => void;
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
  notifications = [],
  onMarkAsRead,
  onMarkAllAsRead,
  onClearNotifications,
}) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [notifFilter, setNotifFilter] = useState<'ALL' | 'UNREAD'>('ALL');

  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const currentTime = new Date().toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const filteredNotifications = notifications.filter(n => {
    if (notifFilter === 'UNREAD') return !n.isRead;
    return true;
  });

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowUserDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotificationDropdown(false);
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

  const getNotifIcon = (type: SystemNotification['type']) => {
    switch (type) {
      case 'VOTE':
        return <Vote className="w-4 h-4 text-sky-600" />;
      case 'VOTER':
        return <Users className="w-4 h-4 text-emerald-600" />;
      case 'USER':
        return <User className="w-4 h-4 text-amber-600" />;
      default:
        return <Settings className="w-4 h-4 text-purple-600" />;
    }
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

      {/* Right: Controls & Interactive Popups */}
      <div className="flex items-center gap-3">
        {/* Real-time Clock */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
          <Clock className="w-3.5 h-3.5 text-sky-600" />
          <span>{currentTime}</span>
        </div>

        {/* Notifications Bell Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
            className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            title="Thông báo biến động hệ thống"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <>
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-2xs">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              </>
            )}
          </button>

          {/* NOTIFICATION CENTER DROPDOWN PANEL */}
          {showNotificationDropdown && (
            <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200/90 p-4 z-50 animate-fade-in font-sans space-y-3">
              {/* Sleek Top Header Bar */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold shadow-2xs shrink-0">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-slate-900 uppercase tracking-tight truncate">THÔNG BÁO</span>
                      {unreadCount > 0 && (
                        <span className="bg-rose-500 text-white font-extrabold text-[10px] px-1.5 py-0.2 rounded-full shrink-0">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium truncate">Biến động thời gian thực</span>
                  </div>
                </div>

                {unreadCount > 0 && (
                  <button
                    onClick={onMarkAllAsRead}
                    className="px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 text-[11px] font-bold transition-all flex items-center gap-1 shrink-0 border border-sky-200/60 whitespace-nowrap"
                  >
                    <CheckCheck className="w-3.5 h-3.5 text-sky-600" />
                    <span>Đã xem tất cả</span>
                  </button>
                )}
              </div>

              {/* Filter Tabs */}
              <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold gap-1">
                <button
                  onClick={() => setNotifFilter('ALL')}
                  className={`flex-1 py-1 rounded-lg transition-all ${
                    notifFilter === 'ALL' ? 'bg-white text-sky-800 shadow-2xs font-extrabold' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Tất cả ({notifications.length})
                </button>
                <button
                  onClick={() => setNotifFilter('UNREAD')}
                  className={`flex-1 py-1 rounded-lg transition-all ${
                    notifFilter === 'UNREAD' ? 'bg-white text-rose-700 shadow-2xs font-extrabold' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Chưa đọc ({unreadCount})
                </button>
              </div>

              {/* Notification Items List */}
              <div className="max-h-72 overflow-y-auto space-y-1.5 pr-1">
                {filteredNotifications.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 text-xs font-medium">
                    Không có thông báo nào.
                  </div>
                ) : (
                  filteredNotifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => onMarkAsRead && onMarkAsRead(n.id)}
                      className={`p-3 rounded-2xl transition-all cursor-pointer space-y-1 border ${
                        !n.isRead
                          ? 'bg-sky-50/60 border-sky-200/80 shadow-2xs'
                          : 'bg-white border-slate-100 hover:bg-slate-50/80 opacity-75'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="p-1 rounded-lg bg-white shadow-2xs shrink-0">
                            {getNotifIcon(n.type)}
                          </div>
                          <span className="font-extrabold text-slate-900 text-xs truncate">{n.title}</span>
                          {!n.isRead && (
                            <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0" title="Chưa đọc" />
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-2">{n.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 pl-7 leading-relaxed font-medium">
                        {n.message}
                      </p>
                      {!n.isRead && (
                        <div className="pl-7 pt-1 text-right">
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              if (onMarkAsRead) onMarkAsRead(n.id);
                            }}
                            className="text-[10px] font-bold text-sky-700 hover:underline flex items-center gap-1 inline-flex"
                          >
                            <Check className="w-3 h-3 text-sky-600" />
                            <span>Đã xem</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Footer Actions */}
              {notifications.length > 0 && (
                <div className="pt-2 border-t text-center">
                  <button
                    onClick={onClearNotifications}
                    className="text-[11px] font-bold text-rose-600 hover:text-rose-800 flex items-center justify-center gap-1 mx-auto"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                    Xóa sạch lịch sử thông báo
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

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
