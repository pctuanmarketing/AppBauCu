import React, { useState } from 'react';
import {
  LayoutDashboard,
  Building2,
  Users,
  Vote,
  Trophy,
  FileSpreadsheet,
  Settings,
  PlusCircle,
  ShieldCheck,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { UserRole } from '../../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  currentRole: UserRole;
  onOpenQuickAction: () => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  currentRole,
  onOpenQuickAction,
  mobileOpen = false,
  onCloseMobile,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const isEffectiveExpanded = !collapsed || isHovered;

  const menuSections = [
    {
      title: 'DASHBOARD',
      items: [
        { id: 'dashboard', label: 'DASHBOARD', icon: LayoutDashboard },
      ],
    },
    {
      title: 'NGHIỆP VỤ BẦU CỬ',
      items: [
        { id: 'election_data', label: 'DỮ LIỆU BẦU CỬ', icon: Building2 },
        { id: 'voters', label: 'QUẢN LÝ CỬ TRI', icon: Users },
        { id: 'ballot_counting', label: 'KIỂM PHIẾU BẦU CỬ', icon: Vote },
        { id: 'election_results', label: 'KẾT QUẢ', icon: Trophy, highlight: true },
        { id: 'results_report', label: 'BÁO CÁO', icon: FileSpreadsheet },
      ],
    },
    {
      title: 'HỆ THỐNG',
      items: [
        { id: 'system_admin', label: 'HỆ THỐNG', icon: Settings },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Drawer Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 md:hidden transition-opacity"
        />
      )}

      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`sidebar-gradient text-slate-300 flex flex-col transition-all duration-300 z-50 fixed md:relative inset-y-0 left-0 h-full select-none shadow-2xl md:shadow-xl border-r border-slate-800 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${isEffectiveExpanded ? 'w-64' : 'w-20'}`}
      >
      {/* Brand Header with Integrated Logo Toggle */}
      <div className="h-16 px-3 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/60">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-3 w-full text-left p-1 rounded-xl hover:bg-slate-800/60 transition-colors group"
          title={collapsed ? 'Bấm logo để mở rộng menu' : 'Bấm logo để thu gọn menu'}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-sky-500/20 shrink-0 group-hover:scale-105 transition-transform">
            🗳️
          </div>

          {isEffectiveExpanded && (
            <div className="flex flex-col flex-1 min-w-0">
              <span className="font-extrabold text-white text-xs tracking-tight uppercase truncate">
                KIỂM PHIẾU BẦU CỬ
              </span>
              <span className="text-[10px] text-sky-400 font-semibold truncate flex items-center gap-1">
                <span>Hệ thống điện tử</span>
                {collapsed && <span className="text-amber-400 text-[9px]">(Tự mở)</span>}
              </span>
            </div>
          )}

          {isEffectiveExpanded && (
            <div className="text-slate-400 hover:text-white p-1 rounded-lg">
              {collapsed ? <PanelLeftOpen className="w-4 h-4 text-sky-400" /> : <PanelLeftClose className="w-4 h-4" />}
            </div>
          )}
        </button>
      </div>

      {/* Quick Action Button */}
      <div className="p-3">
        <button
          onClick={onOpenQuickAction}
          className={`w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-sky-900/30 transition-all ${
            !isEffectiveExpanded ? 'px-0' : ''
          }`}
          title="Thao tác chọn nhanh"
        >
          <PlusCircle className="w-4 h-4 shrink-0" />
          {isEffectiveExpanded && <span>+ Thao tác nhanh</span>}
        </button>
      </div>

      {/* Categorized Navigation Links */}
      <nav className="flex-1 px-2 py-2 space-y-4 overflow-y-auto">
        {menuSections.map((sec, secIdx) => (
          <div key={secIdx} className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
              {isEffectiveExpanded ? sec.title : '•••'}
            </div>

            {sec.items.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    onCloseMobile?.();
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-sky-500/20 to-blue-500/10 text-sky-300 border-l-4 border-sky-400 bg-slate-800/90 shadow-md'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  } ${item.highlight && !isActive ? 'text-amber-300 font-extrabold' : ''}`}
                  title={item.label}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                  {isEffectiveExpanded && <span className="truncate">{item.label}</span>}
                  {isEffectiveExpanded && item.highlight && (
                    <span className="ml-auto text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-extrabold border border-amber-400/30">
                      HOT
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer Role Badge */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
        {isEffectiveExpanded ? (
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] font-extrabold text-slate-200 uppercase truncate">
                QUYỀN HẠN: {currentRole}
              </span>
              <span className="text-[10px] text-slate-400 truncate">Phiên làm việc an toàn</span>
            </div>
          </div>
        ) : (
          <ShieldCheck className="w-5 h-5 text-emerald-400 mx-auto" />
        )}
      </div>
    </aside>
    </>
  );
};
