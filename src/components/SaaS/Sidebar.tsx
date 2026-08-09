import React from 'react';
import { CouncilId, User } from '../../types';
import { LayoutDashboard, FileText, Vote, BarChart3, Settings, HelpCircle, Plus, ChevronLeft, ChevronRight, Bookmark, ShieldCheck } from 'lucide-react';

interface SidebarProps {
  activeModule: 'dashboard' | 'data' | 'counting' | 'stats' | 'system' | 'help';
  setActiveModule: (mod: 'dashboard' | 'data' | 'counting' | 'stats' | 'system' | 'help') => void;
  setActiveSubView: (sub: string) => void;
  setSelectedCouncilId: (id: CouncilId) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  currentUser: User | null;
  onOpenUserManagement: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeModule,
  setActiveModule,
  setActiveSubView,
  setSelectedCouncilId,
  isCollapsed,
  setIsCollapsed,
  currentUser,
  onOpenUserManagement
}) => {
  return (
    <aside className={`bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col justify-between transition-all duration-300 select-none z-30 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      
      <div>
        {/* Top Header Logo in Sidebar */}
        <div className="h-16 flex items-center px-4 border-b border-slate-800 space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white font-extrabold shadow-md flex-shrink-0">
            <Vote className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <div>
              <span className="font-extrabold text-white text-sm tracking-wide block">AVA KIỂM PHIẾU</span>
              <span className="text-[10px] text-teal-400 font-semibold uppercase">ERP Bầu Cử 2026</span>
            </div>
          )}
        </div>

        {/* Quick Action Button "+ Thêm nhanh" */}
        <div className="p-3">
          <button
            onClick={() => {
              setActiveModule('counting');
              setActiveSubView('counting_quoc_hoi');
              setSelectedCouncilId('quoc_hoi');
            }}
            className="w-full flex items-center justify-center space-x-2 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold transition shadow-md shadow-teal-600/30"
          >
            <Plus className="w-4 h-4" />
            {!isCollapsed && <span>Thêm nhanh phiếu</span>}
          </button>
        </div>

        {/* Admin Approval Shortcut Button */}
        {currentUser?.role === 'admin' && (
          <div className="px-3 pb-2">
            <button
              onClick={onOpenUserManagement}
              className="w-full flex items-center justify-center space-x-2 py-2 bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-bold transition shadow-sm"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              {!isCollapsed && <span>Duyệt Tài Khoản</span>}
            </button>
          </div>
        )}

        {/* Group HAY DÙNG (Pinned Quick Features) */}
        {!isCollapsed && (
          <div className="px-3 py-2 space-y-1">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase px-2">
              <span>HAY DÙNG</span>
              <Bookmark className="w-3 h-3 text-slate-500" />
            </div>
            <div className="bg-slate-800/80 rounded-lg p-2 space-y-1 border border-slate-700/60">
              <button
                onClick={() => {
                  setActiveModule('counting');
                  setActiveSubView('counting_quoc_hoi');
                  setSelectedCouncilId('quoc_hoi');
                }}
                className="w-full text-left px-2 py-1.5 text-xs text-slate-300 hover:text-teal-300 hover:bg-slate-700/50 rounded flex items-center justify-between"
              >
                <span>Nhập phiếu ĐBQH</span>
                <span className="text-[10px] bg-teal-500/20 text-teal-300 px-1.5 py-0.5 rounded font-mono">135</span>
              </button>
              <button
                onClick={() => {
                  setActiveModule('stats');
                  setActiveSubView('reports_quoc_hoi');
                }}
                className="w-full text-left px-2 py-1.5 text-xs text-slate-300 hover:text-teal-300 hover:bg-slate-700/50 rounded flex items-center justify-between"
              >
                <span>Xuất Mẫu 18 / 23</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono">Word</span>
              </button>
            </div>
          </div>
        )}

        {/* Group PHÂN HỆ Navigation Items */}
        <div className="px-3 py-2 space-y-1">
          {!isCollapsed && (
            <div className="text-[11px] font-bold text-slate-500 uppercase px-2 mb-1">
              PHÂN HỆ BẦU CỬ
            </div>
          )}

          {/* Item 1: TỔNG QUAN */}
          <button
            onClick={() => setActiveModule('dashboard')}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all relative ${
              activeModule === 'dashboard'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {activeModule === 'dashboard' && (
              <span className="absolute left-0 top-2 bottom-2 w-1 bg-teal-400 rounded-r-full" />
            )}
            <LayoutDashboard className="w-4 h-4 text-teal-400 flex-shrink-0" />
            {!isCollapsed && <span>TỔNG QUAN</span>}
          </button>

          {/* Item 2: DỮ LIỆU BẦU CỬ */}
          <button
            onClick={() => {
              setActiveModule('data');
              setActiveSubView('unit_info');
            }}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all relative ${
              activeModule === 'data'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {activeModule === 'data' && (
              <span className="absolute left-0 top-2 bottom-2 w-1 bg-teal-400 rounded-r-full" />
            )}
            <FileText className="w-4 h-4 text-sky-400 flex-shrink-0" />
            {!isCollapsed && <span>DỮ LIỆU BẦU CỬ</span>}
          </button>

          {/* Item 3: KIỂM PHIẾU BẦU CỬ */}
          <button
            onClick={() => {
              setActiveModule('counting');
              setActiveSubView('counting_quoc_hoi');
              setSelectedCouncilId('quoc_hoi');
            }}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all relative ${
              activeModule === 'counting'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {activeModule === 'counting' && (
              <span className="absolute left-0 top-2 bottom-2 w-1 bg-teal-400 rounded-r-full" />
            )}
            <Vote className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            {!isCollapsed && <span>KIỂM PHIẾU BẦU CỬ</span>}
          </button>

          {/* Item 4: THỐNG KÊ KẾT QUẢ */}
          <button
            onClick={() => {
              setActiveModule('stats');
              setActiveSubView('reports_quoc_hoi');
              setSelectedCouncilId('quoc_hoi');
            }}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all relative ${
              activeModule === 'stats'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {activeModule === 'stats' && (
              <span className="absolute left-0 top-2 bottom-2 w-1 bg-teal-400 rounded-r-full" />
            )}
            <BarChart3 className="w-4 h-4 text-amber-400 flex-shrink-0" />
            {!isCollapsed && <span>THỐNG KÊ KẾT QUẢ</span>}
          </button>

          {/* Item 5: HỆ THỐNG */}
          <button
            onClick={() => setActiveModule('system')}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all relative ${
              activeModule === 'system'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {activeModule === 'system' && (
              <span className="absolute left-0 top-2 bottom-2 w-1 bg-teal-400 rounded-r-full" />
            )}
            <Settings className="w-4 h-4 text-purple-400 flex-shrink-0" />
            {!isCollapsed && <span>HỆ THỐNG & CẤU HÌNH</span>}
          </button>

          {/* Item 6: TRỢ GIÚP */}
          <button
            onClick={() => setActiveModule('help')}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all relative ${
              activeModule === 'help'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {activeModule === 'help' && (
              <span className="absolute left-0 top-2 bottom-2 w-1 bg-teal-400 rounded-r-full" />
            )}
            <HelpCircle className="w-4 h-4 text-blue-400 flex-shrink-0" />
            {!isCollapsed && <span>TRỢ GIÚP & TÁC GIẢ</span>}
          </button>
        </div>
      </div>

      {/* Collapse / Expand Button at Bottom */}
      <div className="p-3 border-t border-slate-800">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center space-x-2 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg text-xs font-semibold transition"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          {!isCollapsed && <span>Thu gọn</span>}
        </button>
      </div>

    </aside>
  );
};
