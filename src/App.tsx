import React, { useState, useEffect } from 'react';
import { Council, CouncilId, Candidate, VoteRecord, VotingUnit, CandidateVote, User } from './types';
import { getCouncils, getVotingUnit, saveVotingUnit, getCandidates, saveCandidates, getVoteRecord, saveVoteRecord } from './lib/storage';
import { Sidebar } from './components/SaaS/Sidebar';
import { TopHeader } from './components/SaaS/TopHeader';
import { ERPDashboard } from './components/SaaS/ERPDashboard';
import { UnitInfoForm } from './components/Forms/UnitInfoForm';
import { CouncilInfoForm } from './components/Forms/CouncilInfoForm';
import { VoteCounting } from './components/VoteCounting';
import { ReportGenerator } from './components/ReportGenerator';
import { AuthModal } from './components/Auth/AuthModal';
import { UserManagementModal } from './components/Auth/UserManagementModal';
import { SupabaseModal } from './components/SupabaseModal';
import { HelpModal } from './components/Help/HelpModal';
import { getSupabaseConfig } from './lib/supabase';
import { Loader2 } from 'lucide-react';

export const App: React.FC = () => {
  // Auth Session State
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('current_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return null; }
    }
    return null;
  });

  // ERP Sidebar Navigation State
  const [activeModule, setActiveModule] = useState<'dashboard' | 'data' | 'counting' | 'stats' | 'system' | 'help'>('dashboard');
  const [activeSubView, setActiveSubView] = useState<string>('unit_info');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const [councils] = useState<Council[]>(getCouncils());
  const [selectedCouncilId, setSelectedCouncilId] = useState<CouncilId>('quoc_hoi');

  const [unit, setUnit] = useState<VotingUnit>({
    id: 'unit-1',
    unitName: 'Tổ bầu cử số 21',
    votingArea: 'Khu vực bỏ phiếu số 21',
    province: 'Thành phố Đà Nẵng',
    term: 'XVI',
    district: 'Huyện Hòa Vang',
    commune: 'Xã Hòa Tiến',
    totalVoters: 1250,
    quocHoiUnitNo: '2',
    quocHoiAreas: 'Đặc khu Hoàng Sa, Phường An Hải, Phường Sơn Trà, Phường Ngũ Hành Sơn, Ph...',
    hdndTinhUnitNo: '6',
    hdndTinhAreas: 'Xã Hòa Vang, Xã Hòa Tiến, Xã Bà Nà',
    hdndXaUnitNo: '8',
    hdndXaAreas: 'Nam Sơn, Lệ Sơn 2, An Trạch'
  });

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [voteRecords, setVoteRecords] = useState<Record<string, { record: VoteRecord; candidateVotes: CandidateVote[]; candidates: Candidate[] }>>({});
  const [loading, setLoading] = useState(true);

  const [supabaseConfig, setSupabaseConfig] = useState(getSupabaseConfig());
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [isUserManagementModalOpen, setIsUserManagementModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [helpMode, setHelpMode] = useState<'guide' | 'author'>('guide');

  const loadAllData = async () => {
    setLoading(true);
    try {
      const u = await getVotingUnit();
      setUnit(u);

      const cands = await getCandidates();
      setCandidates(cands);

      const recordsMap: Record<string, { record: VoteRecord; candidateVotes: CandidateVote[]; candidates: Candidate[] }> = {};
      for (const council of councils) {
        const data = await getVoteRecord(council.id);
        recordsMap[council.id] = {
          record: data.record,
          candidateVotes: data.candidateVotes,
          candidates: cands.filter(c => c.councilId === council.id)
        };
      }
      setVoteRecords(recordsMap);
    } catch (e) {
      console.error('Error loading data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, [councils]);

  const handleSaveUnit = async (newUnit: VotingUnit) => {
    if (currentUser?.role === 'viewer') {
      alert('Tài khoản Quan sát viên (Viewer) chỉ có quyền xem, không được lưu dữ liệu!');
      return;
    }
    setUnit(newUnit);
    await saveVotingUnit(newUnit);
  };

  const handleSaveCandidates = async (newCands: Candidate[]) => {
    if (currentUser?.role === 'viewer') {
      alert('Tài khoản Quan sát viên (Viewer) chỉ có quyền xem, không được sửa ứng cử viên!');
      return;
    }
    setCandidates(newCands);
    await saveCandidates(newCands);
  };

  const handleSaveVoteRecord = async (record: VoteRecord, cVotes: CandidateVote[]) => {
    if (currentUser?.role === 'viewer') {
      alert('Tài khoản Quan sát viên (Viewer) chỉ có quyền xem, không được nhập phiếu bầu!');
      return;
    }
    await saveVoteRecord(record, cVotes);
    setVoteRecords(prev => ({
      ...prev,
      [record.councilId]: {
        record,
        candidateVotes: cVotes,
        candidates: candidates.filter(c => c.councilId === record.councilId)
      }
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem('current_user');
    setCurrentUser(null);
  };

  const handleNavigateToCounting = (id: CouncilId) => {
    setSelectedCouncilId(id);
    setActiveModule('counting');
    setActiveSubView(`counting_${id}`);
  };

  const handleNavigateToReports = (id: CouncilId) => {
    setSelectedCouncilId(id);
    setActiveModule('stats');
    setActiveSubView(`reports_${id}`);
  };

  const currentCouncilData = voteRecords[selectedCouncilId] || {
    record: {
      id: `rec-${selectedCouncilId}`,
      votingUnitId: unit.id,
      councilId: selectedCouncilId,
      totalVoters: unit.totalVoters,
      votersVoted: 0,
      ballotsIssued: 0,
      ballotsCollected: 0,
      validBallots: 0,
      invalidBallots: 0,
      status: 'draft'
    },
    candidateVotes: [],
    candidates: []
  };

  const currentSelectedCouncil = councils.find(c => c.id === selectedCouncilId) || councils[0];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center space-y-4 text-white font-sans">
        <Loader2 className="w-10 h-10 text-teal-400 animate-spin" />
        <p className="text-xs font-bold tracking-wider">Đang tải AVA ERP Kiểm phiếu Bầu cử 2026...</p>
      </div>
    );
  }

  // Auth Protection
  if (!currentUser) {
    return (
      <AuthModal
        onLoginSuccess={(user) => {
          setCurrentUser(user);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex font-sans select-none overflow-x-hidden">
      
      {/* Enterprise Left Sidebar */}
      <Sidebar
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        setActiveSubView={setActiveSubView}
        setSelectedCouncilId={setSelectedCouncilId}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        currentUser={currentUser}
        onOpenUserManagement={() => setIsUserManagementModalOpen(true)}
      />

      {/* Right Main Column */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        
        {/* Enterprise Top Header Bar */}
        <TopHeader
          currentUser={currentUser}
          onLogout={handleLogout}
          onOpenHelpGuide={() => { setHelpMode('guide'); setIsHelpModalOpen(true); }}
          onOpenAuthorInfo={() => { setHelpMode('author'); setIsHelpModalOpen(true); }}
        />

        {/* Main Content Workspace Area */}
        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto space-y-6">
          
          {/* Module 1: Dashboard */}
          {activeModule === 'dashboard' && (
            <ERPDashboard
              unit={unit}
              councils={councils}
              voteRecords={voteRecords}
              currentUser={currentUser}
              onNavigateToCounting={handleNavigateToCounting}
              onNavigateToReports={handleNavigateToReports}
            />
          )}

          {/* Module 2: Data Entry */}
          {activeModule === 'data' && activeSubView === 'unit_info' && (
            <UnitInfoForm
              unit={unit}
              onSaveUnit={handleSaveUnit}
              onClose={() => handleNavigateToCounting('quoc_hoi')}
            />
          )}

          {activeModule === 'data' && activeSubView.startsWith('council_') && (
            <CouncilInfoForm
              council={currentSelectedCouncil}
              candidates={candidates}
              onSaveCandidates={handleSaveCandidates}
              unit={unit}
              onClose={() => setActiveSubView('unit_info')}
            />
          )}

          {/* Module 3: Fast Vote Counting */}
          {activeModule === 'counting' && (
            <VoteCounting
              councils={councils}
              selectedCouncilId={selectedCouncilId}
              setSelectedCouncilId={setSelectedCouncilId}
              unit={unit}
              candidates={candidates}
              voteRecord={currentCouncilData.record}
              candidateVotes={currentCouncilData.candidateVotes}
              onSaveVoteRecord={handleSaveVoteRecord}
              currentUser={currentUser}
            />
          )}

          {/* Module 4: Statistics & Reports */}
          {activeModule === 'stats' && (
            <ReportGenerator
              councils={councils}
              selectedCouncilId={selectedCouncilId}
              setSelectedCouncilId={setSelectedCouncilId}
              unit={unit}
              candidates={candidates}
              voteRecords={voteRecords}
            />
          )}

          {/* Module 5: System Configuration */}
          {activeModule === 'system' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <h2 className="text-base font-extrabold text-slate-900 border-b pb-2">
                HỆ THỐNG & CẤU HÌNH DỮ LIỆU
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentUser?.role === 'admin' && (
                  <button
                    onClick={() => setIsUserManagementModalOpen(true)}
                    className="p-4 bg-amber-50 border border-amber-300 rounded-xl hover:bg-amber-100 transition text-left space-y-1"
                  >
                    <span className="font-bold text-amber-900 text-xs block">👑 Quản lý Người dùng & Phê duyệt</span>
                    <span className="text-[11px] text-amber-700 block">Duyệt tài khoản mới & phân quyền Admin/Editor/Viewer</span>
                  </button>
                )}
                <button
                  onClick={() => setIsSupabaseModalOpen(true)}
                  className="p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-teal-500 transition text-left space-y-1"
                >
                  <span className="font-bold text-teal-800 text-xs block">☁️ Cấu hình Supabase Cloud</span>
                  <span className="text-[11px] text-slate-500 block">Đồng bộ cơ sở dữ liệu trực tuyến</span>
                </button>
                <button
                  onClick={() => {
                    const backupData = { unit, candidates, voteRecords };
                    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
                    const a = document.createElement('a');
                    a.href = URL.createObjectURL(blob);
                    a.download = `SaoLuu_DuLieu_${new Date().toISOString().slice(0, 10)}.json`;
                    a.click();
                  }}
                  className="p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-teal-500 transition text-left space-y-1"
                >
                  <span className="font-bold text-teal-800 text-xs block">📥 Sao lưu dữ liệu JSON</span>
                  <span className="text-[11px] text-slate-500 block">Tải file backup về máy tính</span>
                </button>
              </div>
            </div>
          )}

          {/* Module 6: Help */}
          {activeModule === 'help' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <h2 className="text-base font-extrabold text-slate-900 border-b pb-2">
                HƯỚNG DẪN SỬ DỤNG & THÔNG TIN BẢN QUYỀN
              </h2>
              <div className="flex space-x-3">
                <button
                  onClick={() => { setHelpMode('guide'); setIsHelpModalOpen(true); }}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg text-xs font-bold shadow"
                >
                  Mở Cửa sổ Hướng dẫn sử dụng
                </button>
                <button
                  onClick={() => { setHelpMode('author'); setIsHelpModalOpen(true); }}
                  className="px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-bold shadow"
                >
                  Xem Bản quyền Tác giả Phạm Công Tuân
                </button>
              </div>
            </div>
          )}

        </main>

        {/* Footer Bar */}
        <footer className="bg-white border-t border-slate-200 px-6 py-3 text-xs text-slate-500 flex justify-between items-center print:hidden">
          <div>
            AVA Kế toán & Kiểm phiếu Bầu cử 2026-2031 | Địa bàn: <strong>{unit.province}</strong> ({unit.commune})
          </div>
          <div>
            Tác giả: <strong className="text-teal-700">Phạm Công Tuân</strong> (0916 199 945 - pctuanit@gmail.com)
          </div>
        </footer>

      </div>

      {/* User Management Approval Modal (Admin Only) */}
      <UserManagementModal
        isOpen={isUserManagementModalOpen}
        onClose={() => setIsUserManagementModalOpen(false)}
        currentUser={currentUser}
      />

      {/* Supabase Modal */}
      <SupabaseModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        onConnected={() => setSupabaseConfig(getSupabaseConfig())}
      />

      {/* Help Modal */}
      <HelpModal
        isOpen={isHelpModalOpen}
        mode={helpMode}
        onClose={() => setIsHelpModalOpen(false)}
      />

    </div>
  );
};
