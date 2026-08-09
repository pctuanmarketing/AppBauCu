import React from 'react';
import { User } from '../../types';
import { ShieldCheck, Award, LogOut, Database, Wifi, WifiOff, Monitor, Sparkles, Phone, Mail } from 'lucide-react';

interface StateHeaderProps {
  currentUser: User | null;
  onLogout: () => void;
  uiThemeMode: 'modern' | 'classic';
  setUiThemeMode: (mode: 'modern' | 'classic') => void;
  isConnectedSupabase: boolean;
  onOpenSupabaseModal: () => void;
  onOpenAuthorInfo: () => void;
}

export const StateHeader: React.FC<StateHeaderProps> = ({
  currentUser,
  onLogout,
  uiThemeMode,
  setUiThemeMode,
  isConnectedSupabase,
  onOpenSupabaseModal,
  onOpenAuthorInfo
}) => {
  return (
    <header className="bg-gradient-to-r from-red-950 via-slate-900 to-slate-950 border-b border-red-800/40 sticky top-0 z-40 shadow-2xl backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: National Flag & Official Title */}
          <div className="flex items-center space-x-3.5 cursor-pointer" onClick={onOpenAuthorInfo}>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-600 via-red-700 to-amber-600 flex items-center justify-center text-amber-300 font-extrabold shadow-lg shadow-red-600/40 border border-amber-400/50 animate-pulseGlow">
              <span className="text-xl">🇻🇳</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base sm:text-lg font-black text-white tracking-wide uppercase">
                  HỆ THỐNG KIỂM PHIẾU BẦU CỬ 2026
                </span>
                <span className="px-2 py-0.5 text-[10px] font-extrabold bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/40 uppercase tracking-wider">
                  CỔNG THÔNG TIN QUỐC GIA
                </span>
              </div>
              <p className="text-xs text-slate-300 flex items-center space-x-2 mt-0.5">
                <span>Tác giả: <strong className="text-amber-300">Phạm Công Tuân</strong></span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400">ĐT: 0916 199 945</span>
              </p>
            </div>
          </div>

          {/* Right: Theme Switcher & Supabase & Logout */}
          <div className="flex items-center space-x-3">
            
            {/* UI Theme Switcher (Modern / Classic) */}
            <button
              onClick={() => setUiThemeMode(uiThemeMode === 'modern' ? 'classic' : 'modern')}
              title="Chuyển đổi Chế độ Giao diện"
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800/90 hover:bg-slate-700 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold transition shadow"
            >
              {uiThemeMode === 'modern' ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Giao diện Nhà Nước</span>
                </>
              ) : (
                <>
                  <Monitor className="w-3.5 h-3.5 text-sky-400" />
                  <span className="hidden sm:inline">Giao diện Access</span>
                </>
              )}
            </button>

            {/* Supabase Status Button */}
            <button
              onClick={onOpenSupabaseModal}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                isConnectedSupabase
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900/80'
                  : 'bg-amber-950/40 text-amber-300 border-amber-500/30 hover:bg-amber-900/40'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Supabase</span>
              {isConnectedSupabase ? <Wifi className="w-3 h-3 text-emerald-400" /> : <WifiOff className="w-3 h-3 text-amber-400" />}
            </button>

            {/* User Badge & Logout */}
            {currentUser && (
              <div className="flex items-center space-x-2 border-l border-slate-800 pl-3">
                <button
                  onClick={onLogout}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-red-600/30 hover:bg-red-600/50 text-red-300 border border-red-500/40 rounded-xl text-xs font-bold transition shadow"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Thoát</span>
                </button>
              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
