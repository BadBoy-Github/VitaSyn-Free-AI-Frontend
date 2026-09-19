import React, { useState } from 'react';
import { ThemeLanguageProvider } from './context/ThemeLanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { WelcomeView } from './components/welcome/WelcomeView';
import { HairAssessment } from './components/hair/HairAssessment';
import { EyeAssessment } from './components/eye/EyeAssessment';
import { HistoryModal } from './components/history/HistoryModal';
import { AuthPage } from './components/auth/AuthPage';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [currentTab, setCurrentTab] = useState<'welcome' | 'hair' | 'eye' | 'history'>('welcome');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  // Show auth page if not logged in
  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#fafafa] dark:bg-[#0b0f0b] text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
      {/* ChatGPT-style Collapsible Sidebar */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        onNewAssessment={() => setCurrentTab('welcome')}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header
          currentTab={currentTab}
          onOpenMobileSidebar={() => setIsSidebarOpen(true)}
          onResetToWelcome={() => setCurrentTab('welcome')}
        />

        {/* Dynamic Workspace */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {currentTab === 'welcome' && (
            <WelcomeView
              onStartHair={() => setCurrentTab('hair')}
              onStartEye={() => setCurrentTab('eye')}
            />
          )}
          {currentTab === 'hair' && <HairAssessment />}
          {currentTab === 'eye' && <EyeAssessment />}
          {currentTab === 'history' && <HistoryModal />}
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeLanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeLanguageProvider>
  );
};

export default App;
