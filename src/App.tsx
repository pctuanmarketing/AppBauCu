import React, { useState, useEffect } from 'react';
import { useElectionStore } from './store/electionStore';
import { Layout } from './components/layout/Layout';
import { LandingPage } from './pages/LandingPage';
import { AuthModal } from './components/auth/AuthModal';
import { EmailNotificationModal } from './components/common/EmailNotificationModal';
import { DashboardPage } from './pages/DashboardPage';
import { ElectionDataPage } from './pages/ElectionDataPage';
import { VoterManagementPage } from './pages/VoterManagementPage';
import { BallotCountingPage } from './pages/BallotCountingPage';
import { ResultsReportPage } from './pages/ResultsReportPage';
import { SystemAdminPage } from './pages/SystemAdminPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { UserAccount, UserRole } from './types';
import { EmailPayload } from './lib/emailService';
import { HelpCircle, Vote, Users, X } from 'lucide-react';

const INITIAL_USERS: UserAccount[] = [
  {
    id: 'admin-default',
    fullName: 'Phạm Công Tuân',
    email: 'pctuanit@gmail.com',
    phone: '0916199945',
    password: '123456',
    role: 'ADMIN',
    status: 'APPROVED',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user-demo-1',
    fullName: 'NGUYỄN ĐÌNH',
    email: 'pctuanmarketing@gmail.com',
    phone: '0905772118',
    password: '123456',
    role: 'EDITOR',
    status: 'PENDING',
    createdAt: new Date().toISOString(),
  },
];

export function App() {
  const {
    unit,
    configs,
    committee,
    witnesses,
    candidates,
    voters,
    ballots,
    settings,
    setSettings,
    toggleVoterStatus,
    addBallot,
    undoLastBallot,
    resetBallotsForLevel,
    addVoter,
    updateVoter,
    deleteVoter,
    clearAllVoters,
    importVotersBatch,
    addCommitteeMember,
    updateCommitteeMember,
    deleteCommitteeMember,
    addWitness,
    updateWitness,
    deleteWitness,
    addCandidate,
    updateCandidate,
    deleteCandidate,
    updateUnit,
    updateLevelConfig,
  } = useElectionStore();

  // Navigation & Auth States
  const [registeredUsers, setRegisteredUsers] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem('app_bau_cu_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem('app_bau_cu_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [isLandingPage, setIsLandingPage] = useState<boolean>(!currentUser);
  const [authModalMode, setAuthModalMode] = useState<'LOGIN' | 'REGISTER' | null>(null);

  // Email Notification Popup Payload State
  const [activeEmailModalPayload, setActiveEmailModalPayload] = useState<EmailPayload | null>(null);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [showQuickActionModal, setShowQuickActionModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Sync users to LocalStorage
  useEffect(() => {
    localStorage.setItem('app_bau_cu_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('app_bau_cu_current_user', JSON.stringify(currentUser));
      setSettings(prev => ({ ...prev, currentRole: currentUser.role }));
    } else {
      localStorage.removeItem('app_bau_cu_current_user');
    }
  }, [currentUser]);

  // Auth Actions
  const handleRegisterSubmit = (newUser: Omit<UserAccount, 'id' | 'createdAt' | 'status' | 'role'>) => {
    const item: UserAccount = {
      ...newUser,
      id: `user-${Date.now()}`,
      role: 'EDITOR',
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
    setRegisteredUsers(prev => [...prev, item]);
  };

  const handleApproveUser = (userId: string, role: UserRole) => {
    setRegisteredUsers(prev =>
      prev.map(u => (u.id === userId ? { ...u, role, status: 'APPROVED', approvedAt: new Date().toISOString() } : u))
    );
  };

  const handleRejectUser = (userId: string) => {
    setRegisteredUsers(prev =>
      prev.map(u => (u.id === userId ? { ...u, status: 'REJECTED' } : u))
    );
  };

  const handleDeleteUser = (userId: string) => {
    setRegisteredUsers(prev => prev.filter(u => u.id !== userId));
  };

  const handleUpdateProfile = (updatedUser: UserAccount) => {
    setCurrentUser(updatedUser);
    setRegisteredUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    setIsLandingPage(false);
    setAuthModalMode(null);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLandingPage(true);
  };

  const handleRoleChange = (role: UserRole) => {
    setSettings(prev => ({ ...prev, currentRole: role }));
  };

  // If in Landing Page View mode
  if (isLandingPage && !currentUser) {
    return (
      <>
        <LandingPage
          onOpenLogin={() => setAuthModalMode('LOGIN')}
          onOpenRegister={() => setAuthModalMode('REGISTER')}
        />

        {authModalMode && (
          <AuthModal
            mode={authModalMode}
            onClose={() => setAuthModalMode(null)}
            onSwitchMode={mode => setAuthModalMode(mode)}
            onLoginSuccess={handleLoginSuccess}
            registeredUsers={registeredUsers}
            onRegisterSubmit={handleRegisterSubmit}
            onShowEmailModal={payload => setActiveEmailModalPayload(payload)}
          />
        )}

        {activeEmailModalPayload && (
          <EmailNotificationModal
            emailData={activeEmailModalPayload}
            onClose={() => setActiveEmailModalPayload(null)}
          />
        )}
      </>
    );
  }

  return (
    <Layout
      unit={unit}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      currentRole={settings.currentRole}
      setRole={handleRoleChange}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      onOpenQuickAction={() => setShowQuickActionModal(true)}
      onOpenHelp={() => setShowHelpModal(true)}
      currentUser={currentUser}
      onNavigateToProfile={() => setActiveTab('profile')}
      onNavigateToLanding={() => setIsLandingPage(true)}
      onLogout={handleLogout}
    >
      {/* Tab Pages Switch */}
      {activeTab === 'dashboard' && (
        <DashboardPage
          unit={unit}
          configs={configs}
          voters={voters}
          candidates={candidates}
          setActiveTab={setActiveTab}
          onOpenQuickAction={() => setShowQuickActionModal(true)}
        />
      )}

      {activeTab === 'election_data' && (
        <ElectionDataPage
          unit={unit}
          updateUnit={updateUnit}
          configs={configs}
          updateLevelConfig={updateLevelConfig}
          committee={committee}
          addCommitteeMember={addCommitteeMember}
          updateCommitteeMember={updateCommitteeMember}
          deleteCommitteeMember={deleteCommitteeMember}
          witnesses={witnesses}
          addWitness={addWitness}
          updateWitness={updateWitness}
          deleteWitness={deleteWitness}
          candidates={candidates}
          addCandidate={addCandidate}
          updateCandidate={updateCandidate}
          deleteCandidate={deleteCandidate}
        />
      )}

      {activeTab === 'voters' && (
        <VoterManagementPage
          voters={voters}
          toggleVoterStatus={toggleVoterStatus}
          addVoter={addVoter}
          updateVoter={updateVoter}
          deleteVoter={deleteVoter}
          clearAllVoters={clearAllVoters}
          importVotersBatch={importVotersBatch}
        />
      )}

      {activeTab === 'ballot_counting' && (
        <BallotCountingPage
          configs={configs}
          updateLevelConfig={updateLevelConfig}
          candidates={candidates}
          ballots={ballots}
          addBallot={addBallot}
          undoLastBallot={undoLastBallot}
          resetBallotsForLevel={resetBallotsForLevel}
        />
      )}

      {activeTab === 'results_report' && (
        <ResultsReportPage
          unit={unit}
          configs={configs}
          candidates={candidates}
          voters={voters}
          ballots={ballots}
          committee={committee}
        />
      )}

      {activeTab === 'system_admin' && (
        <SystemAdminPage
          settings={settings}
          setSettings={setSettings}
          registeredUsers={registeredUsers}
          onApproveUser={handleApproveUser}
          onRejectUser={handleRejectUser}
          onDeleteUser={handleDeleteUser}
          onShowEmailModal={payload => setActiveEmailModalPayload(payload)}
          currentRole={settings.currentRole}
        />
      )}

      {activeTab === 'profile' && (
        <UserProfilePage
          currentUser={currentUser}
          onUpdateProfile={handleUpdateProfile}
        />
      )}

      {/* Auth Modal */}
      {authModalMode && (
        <AuthModal
          mode={authModalMode}
          onClose={() => setAuthModalMode(null)}
          onSwitchMode={mode => setAuthModalMode(mode)}
          onLoginSuccess={handleLoginSuccess}
          registeredUsers={registeredUsers}
          onRegisterSubmit={handleRegisterSubmit}
          onShowEmailModal={payload => setActiveEmailModalPayload(payload)}
        />
      )}

      {/* Live Email Notification Box Modal */}
      {activeEmailModalPayload && (
        <EmailNotificationModal
          emailData={activeEmailModalPayload}
          onClose={() => setActiveEmailModalPayload(null)}
        />
      )}

      {/* Quick Action Modal (+ Thêm Nhanh) */}
      {showQuickActionModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-sans">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Vote className="w-5 h-5 text-sky-600" />
                THAO TÁC CHỌN NHANH
              </h3>
              <button
                onClick={() => setShowQuickActionModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => {
                  setShowQuickActionModal(false);
                  setActiveTab('ballot_counting');
                }}
                className="p-4 rounded-xl bg-gradient-to-r from-sky-600 to-sky-700 text-white font-bold text-xs flex items-center justify-between shadow hover:opacity-95 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center text-lg">
                    🗳️
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-extrabold">KIỂM PHIẾU BẦU CỬ</div>
                    <div className="text-[11px] font-normal text-sky-100">
                      Gạch phiếu & tính kết quả tự động
                    </div>
                  </div>
                </div>
                <span>➔</span>
              </button>

              <button
                onClick={() => {
                  setShowQuickActionModal(false);
                  setActiveTab('voters');
                }}
                className="p-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs flex items-center justify-between shadow hover:opacity-95 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center text-lg">
                    👥
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-extrabold">ĐIỂM DANH THẺ CỬ TRI</div>
                    <div className="text-[11px] font-normal text-emerald-100">
                      Cập nhật trạng thái cử tri đi bầu
                    </div>
                  </div>
                </div>
                <span>➔</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-sans">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-sky-600" />
                HƯỚNG DẪN SỬ DỤNG PHẦN MỀM BẦU CỬ
              </h3>
              <button
                onClick={() => setShowHelpModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 text-xs text-slate-700 leading-relaxed pr-2">
              <div className="p-3 bg-sky-50 rounded-lg border border-sky-200">
                <h4 className="font-bold text-sky-900 mb-1">1. Quy trình Kiểm phiếu Bầu cử:</h4>
                <p>
                  - Chọn cấp bầu cử (Đại biểu Quốc hội / HĐND Tỉnh / HĐND Xã).
                  <br />- Nhập số thứ tự ứng cử viên bị gạch tên (VD: Gõ <strong>134</strong> là ứng cử viên số 1, 3, 4 bị gạch phiếu).
                  <br />- Gõ <strong>0</strong> cho phiếu không hợp lệ do hình thức/gạch ngoài danh sách.
                  <br />- Nhấn <strong>Enter 2 lần</strong> để xác nhận ghi nhận phiếu.
                </p>
              </div>

              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                <h4 className="font-bold text-emerald-900 mb-1">2. Điểm danh cử tri đi bỏ phiếu:</h4>
                <p>
                  - Sử dụng ô điểm danh nhanh bằng cách nhập <strong>Mã thẻ cử tri</strong> hoặc STT.
                  <br />- Tích chọn quyền bỏ phiếu cho từng cấp đại biểu (Quốc hội, HĐND Tỉnh, HĐND Xã).
                </p>
              </div>

              <div className="p-3 bg-slate-100 rounded-lg border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-1">3. Xuất Báo cáo & Biên bản:</h4>
                <p>
                  - Vào phân hệ <strong>"KẾT QUẢ"</strong>.
                  <br />- Bấm nút <strong>"Xuất báo cáo Excel (.xlsx)"</strong> để tải file dữ liệu chi tiết.
                  <br />- Bấm nút <strong>"In Biên bản kiểm phiếu (Word)"</strong> để mở trang in biên bản đúng mẫu quốc gia.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t text-right">
              <button
                onClick={() => setShowHelpModal(false)}
                className="px-4 py-2 bg-sky-600 text-white rounded-lg text-xs font-bold"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
