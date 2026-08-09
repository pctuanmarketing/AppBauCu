import React from 'react';
import { Vote, LayoutDashboard, Users, FileCheck2, FileText, Database, ShieldCheck, Wifi, WifiOff } from 'lucide-react';
import { Council, CouncilId } from '../types';

interface NavbarProps {
  activeTab: 'dashboard' | 'candidates' | 'counting' | 'reports';
  setActiveTab: (tab: 'dashboard' | 'candidates' | 'counting' | 'reports') => void;
  councils: Council[];
  selectedCouncilId: CouncilId;
  setSelectedCouncilId: (id: CouncilId) => void;
  isConnectedSupabase: boolean;
  onOpenSupabaseModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  councils,
  selectedCouncilId,
  setSelectedCouncilId,
  isConnectedSupabase,
  onOpenSupabaseModal
}) => {
  return (
    <header className="bg-gradient-to-r from-red-950 via-slate-900 to-slate-900 border-b border-red-800/40 sticky top-0 z-40 shadow-xl backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-lg bg-red-600 flex items-center justify-center text-amber-300 font-extrabold shadow-md shadow-red-600/30 border border-amber-400/40">
              <Vote className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-white tracking-wide">KIỂM PHIẾU BẦU CỬ 2026</span>
                <span className="px-2 py-0.5 text-xs font-semibold bg-amber-500/20 text-amber-300 rounded border border-amber-500/30">
                  v2.0 WebApp
                </span>
              </div>
              <p className="text-xs text-slate-400">Hệ thống tổng hợp & xuất Biên bản Mẫu 18, 23 HĐBC</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex space-x-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-red-600/30 text-amber-300 border border-red-500/40 shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Tổng Quan</span>
            </button>

            <button
              onClick={() => setActiveTab('counting')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'counting'
                  ? 'bg-red-600/30 text-amber-300 border border-red-500/40 shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <FileCheck2 className="w-4 h-4 text-emerald-400" />
              <span>Nhập Phiếu Kiểm</span>
            </button>

            <button
              onClick={() => setActiveTab('candidates')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'candidates'
                  ? 'bg-red-600/30 text-amber-300 border border-red-500/40 shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Users className="w-4 h-4 text-sky-400" />
              <span>Ứng Cử Viên</span>
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'reports'
                  ? 'bg-red-600/30 text-amber-300 border border-red-500/40 shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Biên Bản & Báo Cáo</span>
            </button>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-3">
            
            {/* Council Selector */}
            <select
              value={selectedCouncilId}
              onChange={(e) => setSelectedCouncilId(e.target.value as CouncilId)}
              className="bg-slate-800 border border-slate-700 text-amber-300 text-xs font-semibold rounded-lg px-3 py-1.5 focus:outline-none focus:border-red-500 shadow-inner"
            >
              {councils.map(c => (
                <option key={c.id} value={c.id}>
                  {c.shortName} - {c.name}
                </option>
              ))}
            </select>

            {/* Supabase Status Button */}
            <button
              onClick={onOpenSupabaseModal}
              title={isConnectedSupabase ? 'Đã kết nối Supabase Cloud' : 'Chưa kết nối Supabase (Chạy LocalStorage)'}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                isConnectedSupabase
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900/60'
                  : 'bg-amber-950/40 text-amber-300 border-amber-500/30 hover:bg-amber-900/40'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Supabase</span>
              {isConnectedSupabase ? <Wifi className="w-3 h-3 text-emerald-400" /> : <WifiOff className="w-3 h-3 text-amber-400" />}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
