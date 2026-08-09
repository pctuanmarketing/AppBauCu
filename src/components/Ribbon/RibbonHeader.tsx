import React from 'react';
import { User, CouncilId } from '../../types';
import { Clock, FileEdit, Database, LogOut, FileText, FileSpreadsheet, RefreshCw, Vote, HelpCircle, Lock, KeyRound, Save, Download, Upload, X, Globe, BookOpen, Phone, Mail } from 'lucide-react';

interface RibbonHeaderProps {
  activeTopMenu: 'file' | 'data' | 'counting' | 'stats' | 'system' | 'help';
  setActiveTopMenu: (menu: 'file' | 'data' | 'counting' | 'stats' | 'system' | 'help') => void;
  activeSubView: string;
  setActiveSubView: (sub: string) => void;
  setSelectedCouncilId: (id: CouncilId) => void;
  currentUser: User | null;
  onLogout: () => void;
  onOpenSupabaseModal: () => void;
  onBackupData: () => void;
  onRestoreData: () => void;
  onChangePassword: () => void;
  onToggleLockSystem: () => void;
  isSystemLocked: boolean;
  onOpenHelpGuide: () => void;
  onOpenAuthorInfo: () => void;
}

export const RibbonHeader: React.FC<RibbonHeaderProps> = ({
  activeTopMenu,
  setActiveTopMenu,
  activeSubView,
  setActiveSubView,
  setSelectedCouncilId,
  currentUser,
  onLogout,
  onOpenSupabaseModal,
  onBackupData,
  onRestoreData,
  onChangePassword,
  onToggleLockSystem,
  isSystemLocked,
  onOpenHelpGuide,
  onOpenAuthorInfo
}) => {
  return (
    <header className="bg-slate-200 text-slate-900 border-b border-slate-400 select-none font-sans text-xs">
      
      {/* Topmost Title Bar */}
      <div className="bg-slate-300 px-3 py-1 flex items-center justify-between border-b border-slate-400">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 bg-red-700 rounded text-amber-300 flex items-center justify-center font-bold text-xs shadow-sm">
            A
          </div>
          <span className="font-bold text-slate-800 tracking-wide text-xs">
            KIỂM PHIẾU BẦU CỬ CÁC CẤP 2026 - 2031 | TÁC GIẢ: PHẠM CÔNG TUÂN (0916 199 945)
          </span>
        </div>

        {currentUser && (
          <div className="flex items-center space-x-3 text-[11px] text-slate-700">
            <span className="font-semibold">
              Cán bộ: <strong className="text-red-800">{currentUser.fullName}</strong>
            </span>
            <button
              onClick={onLogout}
              className="flex items-center space-x-1 px-2 py-0.5 bg-slate-400 hover:bg-red-700 hover:text-white rounded transition text-[11px]"
            >
              <LogOut className="w-3 h-3" />
              <span>Thoát</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Ribbon Navigation Bar */}
      <div className="bg-slate-200 border-b border-slate-300 px-2 flex space-x-1 font-semibold text-xs text-slate-800">
        <button
          onClick={() => setActiveTopMenu('file')}
          className={`px-3 py-1.5 transition ${activeTopMenu === 'file' ? 'bg-slate-100 text-red-700 border-b-2 border-red-700' : 'hover:bg-slate-300'}`}
        >
          File
        </button>

        <button
          onClick={() => { setActiveTopMenu('data'); setActiveSubView('unit_info'); }}
          className={`px-3 py-1.5 transition ${activeTopMenu === 'data' ? 'bg-slate-100 text-red-700 border-b-2 border-red-700 font-bold' : 'hover:bg-slate-300'}`}
        >
          1. Dữ liệu Bầu cử
        </button>

        <button
          onClick={() => { setActiveTopMenu('counting'); setActiveSubView('counting_quoc_hoi'); setSelectedCouncilId('quoc_hoi'); }}
          className={`px-3 py-1.5 transition ${activeTopMenu === 'counting' ? 'bg-slate-100 text-red-700 border-b-2 border-red-700 font-bold' : 'hover:bg-slate-300'}`}
        >
          2. Kiểm phiếu
        </button>

        <button
          onClick={() => { setActiveTopMenu('stats'); setActiveSubView('reports_quoc_hoi'); setSelectedCouncilId('quoc_hoi'); }}
          className={`px-3 py-1.5 transition ${activeTopMenu === 'stats' ? 'bg-slate-100 text-red-700 border-b-2 border-red-700 font-bold' : 'hover:bg-slate-300'}`}
        >
          3. Thống kê kết quả
        </button>

        <button
          onClick={() => setActiveTopMenu('system')}
          className={`px-3 py-1.5 transition ${activeTopMenu === 'system' ? 'bg-slate-100 text-red-700 border-b-2 border-red-700 font-bold' : 'hover:bg-slate-300'}`}
        >
          Hệ Thống
        </button>

        <button
          onClick={() => setActiveTopMenu('help')}
          className={`px-3 py-1.5 transition ${activeTopMenu === 'help' ? 'bg-slate-100 text-red-700 border-b-2 border-red-700 font-bold' : 'hover:bg-slate-300'}`}
        >
          Trợ giúp
        </button>
      </div>

      {/* Sub-Ribbon Action Toolbar */}
      <div className="bg-slate-100 px-4 py-2 flex items-center border-b border-slate-300 shadow-inner min-h-[76px]">
        
        {/* Sub-Ribbon cho "1. Dữ liệu Bầu cử" */}
        {activeTopMenu === 'data' && (
          <div className="flex items-center space-x-2 border-r border-slate-300 pr-4">
            <button
              onClick={() => setActiveSubView('unit_info')}
              className={`flex flex-col items-center p-1.5 rounded-md border transition w-24 ${
                activeSubView === 'unit_info'
                  ? 'bg-slate-200 border-red-500/60 shadow-inner text-red-800 font-bold'
                  : 'border-transparent hover:bg-slate-200 text-slate-800'
              }`}
            >
              <div className="w-8 h-8 rounded border border-red-500/40 bg-white flex items-center justify-center shadow-xs">
                <Clock className="w-5 h-5 text-red-600" />
              </div>
              <span className="text-[11px] text-center leading-tight mt-1">Thông tin<br />Đơn vị bầu cử</span>
            </button>

            <button
              onClick={() => { setActiveSubView('council_quoc_hoi'); setSelectedCouncilId('quoc_hoi'); }}
              className={`flex flex-col items-center p-1.5 rounded-md border transition w-24 ${
                activeSubView === 'council_quoc_hoi'
                  ? 'bg-slate-200 border-red-500/60 shadow-inner text-red-800 font-bold'
                  : 'border-transparent hover:bg-slate-200 text-slate-800'
              }`}
            >
              <div className="w-8 h-8 rounded border border-sky-500/40 bg-white flex items-center justify-center shadow-xs">
                <FileEdit className="w-5 h-5 text-sky-600" />
              </div>
              <span className="text-[11px] text-center leading-tight mt-1">Thông tin bầu<br />cử Quốc Hội</span>
            </button>

            <button
              onClick={() => { setActiveSubView('council_hdnd_tinh'); setSelectedCouncilId('hdnd_tinh'); }}
              className={`flex flex-col items-center p-1.5 rounded-md border transition w-24 ${
                activeSubView === 'council_hdnd_tinh'
                  ? 'bg-slate-200 border-red-500/60 shadow-inner text-red-800 font-bold'
                  : 'border-transparent hover:bg-slate-200 text-slate-800'
              }`}
            >
              <div className="w-8 h-8 rounded border border-sky-500/40 bg-white flex items-center justify-center shadow-xs">
                <FileEdit className="w-5 h-5 text-sky-600" />
              </div>
              <span className="text-[11px] text-center leading-tight mt-1">Thông tin bầu<br />cử HĐND Tỉnh</span>
            </button>

            <button
              onClick={() => { setActiveSubView('council_hdnd_xa'); setSelectedCouncilId('hdnd_xa'); }}
              className={`flex flex-col items-center p-1.5 rounded-md border transition w-24 ${
                activeSubView === 'council_hdnd_xa'
                  ? 'bg-slate-200 border-red-500/60 shadow-inner text-red-800 font-bold'
                  : 'border-transparent hover:bg-slate-200 text-slate-800'
              }`}
            >
              <div className="w-8 h-8 rounded border border-sky-500/40 bg-white flex items-center justify-center shadow-xs">
                <FileEdit className="w-5 h-5 text-sky-600" />
              </div>
              <span className="text-[11px] text-center leading-tight mt-1">Thông tin bầu<br />cử HĐND Xã</span>
            </button>

            <div className="text-[10px] text-slate-500 self-end pl-2">
              Nhập thông tin bầu cử
            </div>
          </div>
        )}

        {/* Sub-Ribbon cho "2. Kiểm phiếu" */}
        {activeTopMenu === 'counting' && (
          <div className="flex items-center space-x-2 border-r border-slate-300 pr-4">
            <button
              onClick={() => { setActiveSubView('counting_quoc_hoi'); setSelectedCouncilId('quoc_hoi'); }}
              className={`flex flex-col items-center p-1.5 rounded-md border transition w-24 ${
                activeSubView === 'counting_quoc_hoi' ? 'bg-slate-200 border-red-500/60 shadow-inner font-bold text-red-800' : 'border-transparent hover:bg-slate-200'
              }`}
            >
              <div className="w-8 h-8 rounded border border-emerald-500/40 bg-white flex items-center justify-center">
                <Vote className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-[11px] text-center mt-1">Kiểm phiếu<br />BC Quốc hội</span>
            </button>

            <button
              onClick={() => { setActiveSubView('counting_hdnd_tinh'); setSelectedCouncilId('hdnd_tinh'); }}
              className={`flex flex-col items-center p-1.5 rounded-md border transition w-24 ${
                activeSubView === 'counting_hdnd_tinh' ? 'bg-slate-200 border-red-500/60 shadow-inner font-bold text-red-800' : 'border-transparent hover:bg-slate-200'
              }`}
            >
              <div className="w-8 h-8 rounded border border-emerald-500/40 bg-white flex items-center justify-center">
                <Vote className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-[11px] text-center mt-1">Kiểm phiếu BC<br />HĐND Tỉnh</span>
            </button>

            <button
              onClick={() => { setActiveSubView('counting_hdnd_xa'); setSelectedCouncilId('hdnd_xa'); }}
              className={`flex flex-col items-center p-1.5 rounded-md border transition w-24 ${
                activeSubView === 'counting_hdnd_xa' ? 'bg-slate-200 border-red-500/60 shadow-inner font-bold text-red-800' : 'border-transparent hover:bg-slate-200'
              }`}
            >
              <div className="w-8 h-8 rounded border border-emerald-500/40 bg-white flex items-center justify-center">
                <Vote className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-[11px] text-center mt-1">Kiểm phiếu<br />BC HĐND Xã</span>
            </button>

            <div className="text-[10px] text-slate-500 self-end pl-2">
              Kiểm phiếu các Cấp
            </div>
          </div>
        )}

        {/* Sub-Ribbon cho "3. Thống kê kết quả" */}
        {activeTopMenu === 'stats' && (
          <div className="flex items-center space-x-3 border-r border-slate-300 pr-4">
            <button
              onClick={() => window.location.reload()}
              className="flex flex-col items-center p-1.5 rounded-md border border-sky-400 bg-sky-50 hover:bg-sky-100 w-24 text-sky-900 font-bold shadow-xs"
            >
              <div className="w-8 h-8 rounded border border-sky-500/40 bg-white flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-sky-600 animate-spin-slow" />
              </div>
              <span className="text-[11px] text-center mt-1">Cập nhật</span>
            </button>

            <button
              onClick={() => { setActiveSubView('reports_quoc_hoi'); setSelectedCouncilId('quoc_hoi'); }}
              className={`flex flex-col items-center p-1.5 rounded-md border transition w-24 ${
                activeSubView === 'reports_quoc_hoi' ? 'bg-slate-200 border-red-500/60 shadow-inner font-bold text-red-800' : 'border-transparent hover:bg-slate-200'
              }`}
            >
              <div className="w-8 h-8 rounded border border-amber-500/40 bg-white flex items-center justify-center">
                <FileText className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-[11px] text-center mt-1">Bầu cử<br />Quốc hội</span>
            </button>

            <button
              onClick={() => { setActiveSubView('reports_hdnd_tinh'); setSelectedCouncilId('hdnd_tinh'); }}
              className={`flex flex-col items-center p-1.5 rounded-md border transition w-24 ${
                activeSubView === 'reports_hdnd_tinh' ? 'bg-slate-200 border-red-500/60 shadow-inner font-bold text-red-800' : 'border-transparent hover:bg-slate-200'
              }`}
            >
              <div className="w-8 h-8 rounded border border-amber-500/40 bg-white flex items-center justify-center">
                <FileText className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-[11px] text-center mt-1">Bầu cử<br />HĐND Tỉnh</span>
            </button>

            <button
              onClick={() => { setActiveSubView('reports_hdnd_xa'); setSelectedCouncilId('hdnd_xa'); }}
              className={`flex flex-col items-center p-1.5 rounded-md border transition w-24 ${
                activeSubView === 'reports_hdnd_xa' ? 'bg-slate-200 border-red-500/60 shadow-inner font-bold text-red-800' : 'border-transparent hover:bg-slate-200'
              }`}
            >
              <div className="w-8 h-8 rounded border border-amber-500/40 bg-white flex items-center justify-center">
                <FileText className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-[11px] text-center mt-1">Bầu cử<br />HĐND Xã</span>
            </button>

            <div className="text-[10px] text-slate-500 self-end pl-2">
              Kết quả kiểm phiếu
            </div>
          </div>
        )}

        {/* Sub-Ribbon cho "Hệ Thống" */}
        {activeTopMenu === 'system' && (
          <div className="flex items-center space-x-4">
            
            <div className="flex items-center space-x-2 border-r border-slate-300 pr-4">
              <button
                onClick={onChangePassword}
                className="flex flex-col items-center p-1.5 rounded-md border border-transparent hover:bg-slate-200 w-20 text-slate-800"
              >
                <div className="w-8 h-8 rounded border border-slate-400 bg-white flex items-center justify-center shadow-xs">
                  <KeyRound className="w-5 h-5 text-slate-700" />
                </div>
                <span className="text-[11px] text-center leading-tight mt-1">Đổi Mật<br />Khẩu</span>
              </button>

              <button
                onClick={onToggleLockSystem}
                className="flex flex-col items-center p-1.5 rounded-md border border-transparent hover:bg-slate-200 w-22 text-slate-800"
              >
                <div className="w-8 h-8 rounded border border-slate-400 bg-white flex items-center justify-center shadow-xs">
                  <Lock className={`w-5 h-5 ${isSystemLocked ? 'text-red-600' : 'text-slate-700'}`} />
                </div>
                <span className="text-[11px] text-center leading-tight mt-1">Khóa/Mở<br />Hệ thống</span>
              </button>

              <div className="text-[10px] text-slate-500 self-end pl-1">
                Hệ thống
              </div>
            </div>

            <div className="flex items-center space-x-2 border-r border-slate-300 pr-4">
              <button
                onClick={onBackupData}
                className="flex flex-col items-center p-1.5 rounded-md border border-transparent hover:bg-slate-200 w-22 text-slate-800"
              >
                <div className="w-8 h-8 rounded border border-purple-400 bg-white flex items-center justify-center shadow-xs">
                  <Download className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-[11px] text-center leading-tight mt-1">Sao lưu<br />dữ liệu</span>
              </button>

              <button
                onClick={onRestoreData}
                className="flex flex-col items-center p-1.5 rounded-md border border-transparent hover:bg-slate-200 w-22 text-slate-800"
              >
                <div className="w-8 h-8 rounded border border-purple-400 bg-white flex items-center justify-center shadow-xs">
                  <Upload className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-[11px] text-center leading-tight mt-1">Phục hồi<br />dữ liệu</span>
              </button>

              <div className="text-[10px] text-slate-500 self-end pl-1">
                Sao lưu dữ liệu
              </div>
            </div>

            <div className="flex items-center space-x-2 border-r border-slate-300 pr-4">
              <button
                onClick={onOpenSupabaseModal}
                className="flex flex-col items-center p-1.5 rounded-md border border-transparent hover:bg-slate-200 w-24 text-slate-800"
              >
                <div className="w-8 h-8 rounded border border-blue-400 bg-white flex items-center justify-center shadow-xs">
                  <Database className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-[11px] text-center leading-tight mt-1">Cấu hình<br />Supabase</span>
              </button>
            </div>

            <div className="flex items-center">
              <button
                onClick={onLogout}
                className="flex flex-col items-center p-1.5 rounded-md border border-transparent hover:bg-red-100 w-20 text-red-700 font-bold"
              >
                <div className="w-8 h-8 rounded border border-red-500 bg-white flex items-center justify-center shadow-xs">
                  <X className="w-6 h-6 text-red-600" />
                </div>
                <span className="text-[11px] text-center leading-tight mt-1">Thoát</span>
              </button>
            </div>

          </div>
        )}

        {/* Sub-Ribbon cho "Trợ giúp" */}
        {activeTopMenu === 'help' && (
          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenHelpGuide}
              className="flex flex-col items-center p-1.5 rounded-md border border-transparent hover:bg-slate-200 w-24 text-slate-800"
            >
              <div className="w-8 h-8 rounded border border-sky-400 bg-white flex items-center justify-center shadow-xs">
                <BookOpen className="w-5 h-5 text-sky-600" />
              </div>
              <span className="text-[11px] text-center leading-tight mt-1">Hướng dẫn<br />sử dụng</span>
            </button>

            <button
              onClick={onOpenAuthorInfo}
              className="flex flex-col items-center p-1.5 rounded-md border border-transparent hover:bg-slate-200 w-20 text-slate-800 font-bold"
            >
              <div className="w-8 h-8 rounded border border-sky-400 bg-white flex items-center justify-center shadow-xs">
                <Globe className="w-5 h-5 text-sky-600" />
              </div>
              <span className="text-[11px] text-center leading-tight mt-1">Tác<br />giả</span>
            </button>

            <div className="text-[10px] text-slate-600 self-end pl-2 font-medium">
              Tác giả: <strong className="text-red-800">Phạm Công Tuân</strong> | Email: <strong className="text-sky-800">pctuanit@gmail.com</strong> | ĐT: <strong className="text-emerald-800">0916 199 945</strong>
            </div>

          </div>
        )}

      </div>

    </header>
  );
};
