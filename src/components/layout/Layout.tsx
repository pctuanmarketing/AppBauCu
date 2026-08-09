import React, { useState, useRef } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ScrollToTopButton } from '../common/ScrollToTopButton';
import { ElectionUnit, SystemNotification, UserAccount, UserRole } from '../../types';

interface LayoutProps {
  children: React.ReactNode;
  unit: ElectionUnit;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onOpenQuickAction: () => void;
  onOpenHelp: () => void;
  currentUser: UserAccount | null;
  onNavigateToProfile: () => void;
  onNavigateToLanding: () => void;
  onLogout: () => void;

  notifications?: SystemNotification[];
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onClearNotifications?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  unit,
  activeTab,
  setActiveTab,
  currentRole,
  setRole,
  searchTerm,
  setSearchTerm,
  onOpenQuickAction,
  onOpenHelp,
  currentUser,
  onNavigateToProfile,
  onNavigateToLanding,
  onLogout,
  notifications = [],
  onMarkAsRead,
  onMarkAllAsRead,
  onClearNotifications,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 text-slate-800 font-sans">
      {/* Dark Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        currentRole={currentRole}
        onOpenQuickAction={onOpenQuickAction}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative">
        <Header
          unit={unit}
          currentRole={currentRole}
          setRole={setRole}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onOpenHelp={onOpenHelp}
          currentUser={currentUser}
          onNavigateToProfile={onNavigateToProfile}
          onNavigateToLanding={onNavigateToLanding}
          onLogout={onLogout}
          notifications={notifications}
          onMarkAsRead={onMarkAsRead}
          onMarkAllAsRead={onMarkAllAsRead}
          onClearNotifications={onClearNotifications}
        />

        <main ref={mainRef} className="flex-1 overflow-y-auto p-6 min-h-0 bg-slate-50/80 scroll-smooth">
          {children}
        </main>

        {/* Floating Scroll To Top Button */}
        <ScrollToTopButton containerRef={mainRef} />
      </div>
    </div>
  );
};
