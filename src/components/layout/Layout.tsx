import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ElectionUnit, UserRole } from '../../types';

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
}) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 text-slate-800">
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
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        <Header
          unit={unit}
          currentRole={currentRole}
          setRole={setRole}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onOpenHelp={onOpenHelp}
        />

        <main className="flex-1 overflow-y-auto p-6 min-h-0 bg-slate-50/80">
          {children}
        </main>
      </div>
    </div>
  );
};
