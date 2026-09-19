import React, { useState, useEffect } from 'react';
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
  // Auto-collapse sidebar on mobile and tablet screens (< 1024px)
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return false;
  });

  // Handle responsive resize (e.g. tablet orientation change)
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (window.innerWidth < 1024) {
          setIsSidebarOpen(false);
        }
      }, 150);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  // Show auth page if not logged in
  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <div className="flex h-[100dvh] w-screen overflow-hidden bg-[#fafafa] dark:bg-[#0b0f0b] text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
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
        <main className="flex-1 overflow-y-auto p-3 sm:p-5 md:p-6">
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
