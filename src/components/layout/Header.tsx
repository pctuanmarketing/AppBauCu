import React from 'react';
import {
  Search,
  Bell,
  HelpCircle,
  Building,
  Clock,
} from 'lucide-react';
import { ElectionUnit, UserRole } from '../../types';

interface HeaderProps {
  unit: ElectionUnit;
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onOpenHelp: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  unit,
  currentRole,
  setRole,
  searchTerm,
  setSearchTerm,
  onOpenHelp,
}) => {
  const currentTime = new Date().toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  });

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

      {/* Right: Controls */}
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

        {/* User Profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-sky-600 to-teal-500 text-white font-bold text-xs flex items-center justify-center shadow">
            PT
          </div>
          <div className="hidden xl:flex flex-col text-left">
            <span className="text-xs font-bold text-slate-800 leading-tight">Phạm Công Tuân</span>
            <span className="text-[10px] text-slate-500">{unit.wardName}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
