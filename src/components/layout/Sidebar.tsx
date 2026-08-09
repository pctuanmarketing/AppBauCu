import React from 'react';
import {
  LayoutDashboard,
  Building2,
  Users,
  Vote,
  FileSpreadsheet,
  Settings,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  ShieldCheck,
} from 'lucide-react';
import { UserRole } from '../../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  currentRole: UserRole;
  onOpenQuickAction: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  currentRole,
  onOpenQuickAction,
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'TỔNG QUAN', icon: LayoutDashboard },
    { id: 'election_data', label: 'DỮ LIỆU BẦU CỬ', icon: Building2 },
    { id: 'voters', label: 'QUẢN LÝ CỬ TRI', icon: Users },
    { id: 'ballot_counting', label: 'KIỂM PHIẾU', icon: Vote, highlight: true },
    { id: 'results_report', label: 'KẾT QUẢ & BÁO CÁO', icon: FileSpreadsheet },
    { id: 'system_admin', label: 'HỆ THỐNG', icon: Settings },
  ];

  return (
    <aside
      className={`sidebar-gradient text-slate-300 flex flex-col transition-all duration-300 z-30 relative select-none ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-700/60 bg-slate-900/40">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-sky-500/20 font-bold text-lg">
              🗳️
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-slate-100 text-sm tracking-wide leading-tight">
                APP BẦU CỬ
              </span>
              <span className="text-[11px] text-sky-400 font-medium">Tổ BC Số 21</span>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-10 h-10 mx-auto rounded-xl bg-sky-500 flex items-center justify-center text-white font-bold text-xl">
            🗳️
          </div>
        )}
      </div>

      {/* Quick Action Button */}
      <div className="p-3">
        <button
          onClick={onOpenQuickAction}
          className={`w-full py-2.5 px-3 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-md shadow-sky-900/30 transition-all ${
            collapsed ? 'px-0' : ''
          }`}
          title="Thêm mới / Gạch phiếu nhanh"
        >
          <PlusCircle className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>+ Thêm nhanh</span>}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-2 py-2 space-y-1.5 overflow-y-auto">
        <div className="px-3 py-1 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
          {!collapsed ? 'Phân hệ chức năng' : '---'}
        </div>
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                isActive
                  ? 'bg-sky-500/15 text-sky-400 border-l-4 border-sky-400 bg-slate-800/80 shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800/50 hover:text-slate-100'
              } ${item.highlight && !isActive ? 'text-amber-300 font-bold' : ''}`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
              {!collapsed && <span className="truncate">{item.label}</span>}
              {!collapsed && item.highlight && (
                <span className="ml-auto text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-bold">
                  HOT
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Role Badge & Collapse Toggle Footer */}
      <div className="p-3 border-t border-slate-700/60 bg-slate-900/50 flex items-center justify-between">
        {!collapsed ? (
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold text-slate-200">{currentRole} MODE</span>
              <span className="text-[10px] text-slate-400">Tổ Bầu Cử #21</span>
            </div>
          </div>
        ) : (
          <ShieldCheck className="w-5 h-5 text-emerald-400 mx-auto" />
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
          title={collapsed ? 'Mở rộng menu' : 'Thu gọn menu'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
};
