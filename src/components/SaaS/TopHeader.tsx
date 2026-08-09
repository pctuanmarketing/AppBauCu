import React, { useState } from 'react';
import { User, CouncilId } from '../../types';
import { LogOut, ChevronDown, Award, Clock, Edit3, Vote, BarChart3, ShieldCheck, Database, HelpCircle, UserCheck } from 'lucide-react';

interface TopHeaderProps {
  currentUser: User | null;
  onLogout: () => void;
  onOpenHelpGuide: () => void;
  onOpenAuthorInfo: () => void;
  onNavigateToUnitInfo: () => void;
  onNavigateToCouncilInfo: (councilId: CouncilId) => void;
  onNavigateToCounting: (councilId: CouncilId) => void;
  onNavigateToReports: (councilId: CouncilId) => void;
  onOpenUserManagement: () => void;
  onOpenSupabaseConfig: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentUser,
  onLogout,
  onOpenHelpGuide,
  onOpenAuthorInfo,
  onNavigateToUnitInfo,
  onNavigateToCouncilInfo,
  onNavigateToCounting,
  onNavigateToReports,
  onOpenUserManagement,
  onOpenSupabaseConfig
}) => {
  const [activeRibbonTab, setActiveRibbonTab] = useState<'data' | 'counting' | 'stats' | 'system' | 'help'>('data');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="bg-slate-100 border-b border-slate-300 text-slate-800 flex flex-col shadow-xs sticky top-0 z-30 select-none font-sans text-xs">
      
      {/* Ribbon Top Tab Menu Bar (Khớp 100% hình chụp Access) */}
      <div className="bg-slate-200 border-b border-slate-300 px-3 flex items-center justify-between h-9">
        <div className="flex items-center space-x-1 font-bold text-xs">
          <button className="px-3 py-1 bg-slate-300 text-slate-700 hover:bg-slate-400 rounded-t transition">
            File
          </button>

          <button
            onClick={() => setActiveRibbonTab('data')}
            className={`px-4 py-1.5 rounded-t transition border-b-2 font-extrabold ${
              activeRibbonTab === 'data'
                ? 'bg-slate-100 border-red-700 text-red-800 shadow-xs'
                : 'text-slate-700 hover:bg-slate-300 border-transparent'
            }`}
          >
            1. Dữ liệu Bầu cử
          </button>

          <button
            onClick={() => setActiveRibbonTab('counting')}
            className={`px-4 py-1.5 rounded-t transition border-b-2 font-extrabold ${
              activeRibbonTab === 'counting'
                ? 'bg-slate-100 border-red-700 text-red-800 shadow-xs'
                : 'text-slate-700 hover:bg-slate-300 border-transparent'
            }`}
          >
            2. Kiểm phiếu
          </button>

          <button
            onClick={() => setActiveRibbonTab('stats')}
            className={`px-4 py-1.5 rounded-t transition border-b-2 font-extrabold ${
              activeRibbonTab === 'stats'
                ? 'bg-slate-100 border-red-700 text-red-800 shadow-xs'
                : 'text-slate-700 hover:bg-slate-300 border-transparent'
            }`}
          >
            3. Thống kê kết quả
          </button>

          <button
            onClick={() => setActiveRibbonTab('system')}
            className={`px-4 py-1.5 rounded-t transition border-b-2 font-extrabold ${
              activeRibbonTab === 'system'
                ? 'bg-slate-100 border-red-700 text-red-800 shadow-xs'
                : 'text-slate-700 hover:bg-slate-300 border-transparent'
            }`}
          >
            Hệ Thống
          </button>

          <button
            onClick={() => setActiveRibbonTab('help')}
            className={`px-4 py-1.5 rounded-t transition border-b-2 font-extrabold ${
              activeRibbonTab === 'help'
                ? 'bg-slate-100 border-red-700 text-red-800 shadow-xs'
                : 'text-slate-700 hover:bg-slate-300 border-transparent'
            }`}
          >
            Trợ giúp
          </button>
        </div>

        {/* User Profile dropdown */}
        <div className="relative">
          <div
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-2 cursor-pointer px-2 py-0.5 hover:bg-slate-300 rounded transition"
          >
            <span className="font-extrabold text-slate-900">{currentUser?.fullName}</span>
            <span className="px-1.5 py-0.5 bg-red-700 text-white rounded text-[10px] uppercase font-extrabold">
              {currentUser?.role}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-600" />
          </div>

          {showProfileMenu && (
            <div className="absolute right-0 mt-1 w-64 bg-white border border-slate-300 rounded-lg shadow-2xl p-3 space-y-2 text-xs z-50">
              <div className="p-2 bg-slate-50 rounded border border-slate-200">
                <span className="font-bold text-slate-900 block">{currentUser?.fullName}</span>
                <span className="text-slate-500 text-[11px] block">{currentUser?.email}</span>
              </div>
              <button
                onClick={onOpenAuthorInfo}
                className="w-full text-left px-2 py-1.5 hover:bg-slate-100 rounded text-xs font-semibold text-slate-700"
              >
                Bản quyền: <strong>Phạm Công Tuân</strong> (0916 199 945)
              </button>
              <button
                onClick={onLogout}
                className="w-full text-left px-2 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded flex items-center space-x-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Đăng xuất</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Ribbon Action Buttons Sub-bar (Bám sát 100% hình chụp Access) */}
      <div className="bg-slate-100 px-4 py-2 flex items-center space-x-6 shadow-inner border-b border-slate-300">
        
        {/* SUB-BAR FOR TAB 1: Dữ liệu Bầu cử */}
        {activeRibbonTab === 'data' && (
          <div className="flex items-center space-x-4">
            <div className="border-r border-slate-300 pr-4 flex space-x-4 items-center">
              
              <button
                onClick={onNavigateToUnitInfo}
                className="flex flex-col items-center p-1.5 hover:bg-slate-200 rounded border border-transparent hover:border-slate-400 transition"
              >
                <div className="w-8 h-8 rounded-full border-2 border-red-600 flex items-center justify-center bg-white shadow-xs text-red-600">
                  <Clock className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-slate-800 mt-1">Thông tin</span>
                <span className="text-[10px] text-slate-600">Đơn vị bầu cử</span>
              </button>

              <button
                onClick={() => onNavigateToCouncilInfo('quoc_hoi')}
                className="flex flex-col items-center p-1.5 hover:bg-slate-200 rounded border border-transparent hover:border-slate-400 transition"
              >
                <div className="w-8 h-8 rounded border border-sky-600 flex items-center justify-center bg-white shadow-xs text-sky-700">
                  <Edit3 className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-slate-800 mt-1">Thông tin bầu cử</span>
                <span className="text-[10px] text-slate-600">cử Quốc Hội</span>
              </button>

              <button
                onClick={() => onNavigateToCouncilInfo('hdnd_tinh')}
                className="flex flex-col items-center p-1.5 hover:bg-slate-200 rounded border border-transparent hover:border-slate-400 transition"
              >
                <div className="w-8 h-8 rounded border border-sky-600 flex items-center justify-center bg-white shadow-xs text-sky-700">
                  <Edit3 className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-slate-800 mt-1">Thông tin bầu cử</span>
                <span className="text-[10px] text-slate-600">cử HĐND Tỉnh</span>
              </button>

              <button
                onClick={() => onNavigateToCouncilInfo('hdnd_xa')}
                className="flex flex-col items-center p-1.5 hover:bg-slate-200 rounded border border-transparent hover:border-slate-400 transition"
              >
                <div className="w-8 h-8 rounded border border-sky-600 flex items-center justify-center bg-white shadow-xs text-sky-700">
                  <Edit3 className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-slate-800 mt-1">Thông tin bầu cử</span>
                <span className="text-[10px] text-slate-600">cử HĐND Xã</span>
              </button>

            </div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Nhập thông tin bầu cử</span>
          </div>
        )}

        {/* SUB-BAR FOR TAB 2: Kiểm phiếu */}
        {activeRibbonTab === 'counting' && (
          <div className="flex items-center space-x-4">
            <div className="border-r border-slate-300 pr-4 flex space-x-4 items-center">
              <button
                onClick={() => onNavigateToCounting('quoc_hoi')}
                className="flex items-center space-x-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded shadow-xs"
              >
                <Vote className="w-4 h-4" />
                <span>Kiểm phiếu BC Quốc Hội</span>
              </button>

              <button
                onClick={() => onNavigateToCounting('hdnd_tinh')}
                className="flex items-center space-x-2 px-3 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded shadow-xs"
              >
                <Vote className="w-4 h-4" />
                <span>Kiểm phiếu BC HĐND Tỉnh</span>
              </button>

              <button
                onClick={() => onNavigateToCounting('hdnd_xa')}
                className="flex items-center space-x-2 px-3 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded shadow-xs"
              >
                <Vote className="w-4 h-4" />
                <span>Kiểm phiếu BC HĐND Xã</span>
              </button>
            </div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tổ kiểm phiếu</span>
          </div>
        )}

        {/* SUB-BAR FOR TAB 3: Thống kê kết quả */}
        {activeRibbonTab === 'stats' && (
          <div className="flex items-center space-x-4">
            <div className="border-r border-slate-300 pr-4 flex space-x-4 items-center">
              <button
                onClick={() => onNavigateToReports('quoc_hoi')}
                className="flex items-center space-x-2 px-3 py-2 bg-red-700 hover:bg-red-800 text-white font-bold rounded shadow-xs"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Bầu cử Quốc Hội</span>
              </button>

              <button
                onClick={() => onNavigateToReports('hdnd_tinh')}
                className="flex items-center space-x-2 px-3 py-2 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded shadow-xs"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Bầu cử HĐND Tỉnh</span>
              </button>

              <button
                onClick={() => onNavigateToReports('hdnd_xa')}
                className="flex items-center space-x-2 px-3 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded shadow-xs"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Bầu cử HĐND Xã</span>
              </button>
            </div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Xuất Biên Bản Mẫu 18 & 23</span>
          </div>
        )}

        {/* SUB-BAR FOR TAB 4: Hệ Thống */}
        {activeRibbonTab === 'system' && (
          <div className="flex items-center space-x-4">
            <div className="border-r border-slate-300 pr-4 flex space-x-3 items-center">
              {currentUser?.role === 'admin' && (
                <button
                  onClick={onOpenUserManagement}
                  className="flex items-center space-x-1.5 px-3 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded shadow-xs"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Duyệt tài khoản</span>
                </button>
              )}

              <button
                onClick={onOpenSupabaseConfig}
                className="flex items-center space-x-1.5 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded shadow-xs"
              >
                <Database className="w-4 h-4 text-emerald-400" />
                <span>Kết nối Supabase</span>
              </button>
            </div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Quản trị hệ thống</span>
          </div>
        )}

        {/* SUB-BAR FOR TAB 5: Trợ giúp */}
        {activeRibbonTab === 'help' && (
          <div className="flex items-center space-x-4">
            <div className="border-r border-slate-300 pr-4 flex space-x-3 items-center">
              <button
                onClick={onOpenHelpGuide}
                className="flex items-center space-x-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded shadow-xs"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Hướng dẫn sử dụng</span>
              </button>

              <button
                onClick={onOpenAuthorInfo}
                className="flex items-center space-x-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded shadow-xs"
              >
                <Award className="w-4 h-4 text-amber-400" />
                <span>Tác giả Phạm Công Tuân</span>
              </button>
            </div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Thông tin bản quyền</span>
          </div>
        )}

      </div>

    </header>
  );
};
