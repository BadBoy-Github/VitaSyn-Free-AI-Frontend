import React, { useEffect } from 'react';
import {
  Sparkles,
  Eye,
  History,
  LayoutDashboard,
  Sun,
  Moon,
  Globe,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  X,
} from 'lucide-react';
import { useThemeLanguage } from '../../context/ThemeLanguageContext';
import { useAuth } from '../../context/AuthContext';
import { BrandLogo } from '../common/BrandLogo';

interface SidebarProps {
  currentTab: 'welcome' | 'hair' | 'eye' | 'history';
  setCurrentTab: (tab: 'welcome' | 'hair' | 'eye' | 'history') => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onNewAssessment: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  isOpen,
  setIsOpen,
  onNewAssessment,
}) => {
  const { theme, toggleTheme, language, toggleLanguage, t } = useThemeLanguage();
  const { user, logout } = useAuth();

  // Close sidebar on small screens when a navigation item is clicked
  const handleNavClick = (callback: () => void) => {
    callback();
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  // Lock body scroll when mobile sidebar drawer is open
  useEffect(() => {
    if (isOpen && typeof window !== 'undefined' && window.innerWidth < 768) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile & Tablet Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setIsOpen(false)}
          aria-label="Close sidebar backdrop"
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 flex flex-col bg-zinc-50 dark:bg-[#0d120d] border-r border-zinc-200 dark:border-[#1e2a1e] transition-all duration-300 ease-in-out ${
          isOpen ? 'w-72 sm:w-80 lg:w-72 translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-16'
        }`}
      >
        {/* Top Header / Branding */}
        <div className="p-4 border-b border-zinc-200 dark:border-[#1e2a1e] flex items-center justify-between min-h-[65px]">
          {isOpen ? (
            <div className="overflow-hidden flex-1">
              <BrandLogo size="md" />
            </div>
          ) : (
            <div className="mx-auto">
              <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain rounded-lg" />
            </div>
          )}

          {/* Desktop collapse toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="hidden lg:flex p-1.5 rounded-lg text-zinc-500 hover:text-amber-500 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors ml-2 shrink-0"
            title={isOpen ? 'Collapse' : 'Expand'}
          >
            {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>

          {/* Mobile & Tablet explicit close button */}
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 rounded-lg text-zinc-500 hover:text-red-500 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors ml-2 shrink-0 touch-manipulation"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dashboard Button */}
        <div className="p-3">
          <button
            onClick={() => handleNavClick(onNewAssessment)}
            className={`w-full min-h-[44px] flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 shadow-sm active:scale-[0.98] touch-manipulation cursor-pointer ${
              isOpen
                ? 'bg-gradient-to-r from-amber-500 to-lime-600 hover:from-amber-400 hover:to-lime-500 text-zinc-950 shadow-amber-500/20'
                : 'bg-amber-500 text-zinc-950 hover:bg-amber-400 justify-center'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 shrink-0 stroke-[2.5]" />
            {isOpen && <span>{t.dashboard}</span>}
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 px-3 py-2 space-y-2 overflow-y-auto">
          {/* Hair Analysis Tab */}
          <button
            onClick={() => handleNavClick(() => setCurrentTab('hair'))}
            className={`w-full min-h-[44px] flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all touch-manipulation cursor-pointer ${
              isOpen ? '' : 'justify-center'
            } ${
              currentTab === 'hair'
                ? 'bg-amber-400/15 dark:bg-amber-400/10 text-amber-600 dark:text-amber-300 border border-amber-400/30'
                : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200/70 dark:hover:bg-zinc-800/60'
            }`}
            title={t.navHair}
          >
            <div className={`p-1.5 rounded-lg shrink-0 ${currentTab === 'hair' ? 'bg-amber-500 text-zinc-950' : 'bg-amber-400/20 text-amber-500'}`}>
              <Sparkles className="w-4 h-4" />
            </div>
            {isOpen && (
              <div className="text-left flex-1 min-w-0">
                <div className="font-semibold truncate">{t.navHair}</div>
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                  {language === 'ta' ? 'AI பார்வை சரிபார்ப்பு' : 'AI Vision Verification'}
                </div>
              </div>
            )}
          </button>

          {/* Eye Checkup AI Tab */}
          <button
            onClick={() => handleNavClick(() => setCurrentTab('eye'))}
            className={`w-full min-h-[44px] flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all touch-manipulation cursor-pointer ${
              isOpen ? '' : 'justify-center'
            } ${
              currentTab === 'eye'
                ? 'bg-lime-500/15 dark:bg-lime-500/10 text-lime-600 dark:text-lime-300 border border-lime-500/30'
                : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200/70 dark:hover:bg-zinc-800/60'
            }`}
            title={t.navEye}
          >
            <div className={`p-1.5 rounded-lg shrink-0 ${currentTab === 'eye' ? 'bg-lime-600 text-white' : 'bg-lime-500/20 text-lime-500'}`}>
              <Eye className="w-4 h-4" />
            </div>
            {isOpen && (
              <div className="text-left flex-1 min-w-0">
                <div className="font-semibold truncate">{t.navEye}</div>
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                  {language === 'ta' ? '10 நிலை வண்ண & பார்வை' : '10-Stage Color & Acuity'}
                </div>
              </div>
            )}
          </button>

          {/* Past Reports Tab */}
          <button
            onClick={() => handleNavClick(() => setCurrentTab('history'))}
            className={`w-full min-h-[44px] flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all touch-manipulation cursor-pointer ${
              isOpen ? '' : 'justify-center'
            } ${
              currentTab === 'history'
                ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700'
                : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200/70 dark:hover:bg-zinc-800/60'
            }`}
            title={t.navHistory}
          >
            <div className="p-1.5 rounded-lg bg-zinc-300 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 shrink-0">
              <History className="w-4 h-4" />
            </div>
            {isOpen && (
              <div className="text-left flex-1 min-w-0">
                <div className="font-semibold truncate">{t.navHistory}</div>
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                  {language === 'ta' ? 'சேமிக்கப்பட்ட பதிவுகள்' : 'Saved Records'}
                </div>
              </div>
            )}
          </button>
        </div>

        {/* Logged-in User Info (only when expanded) */}
        {isOpen && user && (
          <div className="mx-3 mb-2 p-3 rounded-xl bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">{user.name}</div>
                <div className="text-[10px] text-zinc-500 dark:text-zinc-500 truncate">{user.email}</div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Controls: Language, Theme, Logout */}
        <div className="p-3 border-t border-zinc-200 dark:border-[#1e2a1e] space-y-1.5">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className={`w-full min-h-[44px] flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800/80 transition-colors touch-manipulation cursor-pointer ${
              !isOpen ? 'justify-center' : ''
            }`}
            title={`Switch to ${language === 'en' ? 'தமிழ்' : 'English'}`}
          >
            <Globe className="w-4 h-4 text-amber-500 shrink-0" />
            {isOpen && (
              <div className="flex items-center justify-between w-full">
                <span>{language === 'ta' ? 'மொழி' : 'Language'}</span>
                <span className="px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-700 dark:text-amber-300 text-[11px] font-bold">
                  {language === 'en' ? 'EN' : 'தமிழ்'}
                </span>
              </div>
            )}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`w-full min-h-[44px] flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800/80 transition-colors touch-manipulation cursor-pointer ${
              !isOpen ? 'justify-center' : ''
            }`}
            title={theme === 'dark' ? t.lightMode : t.darkMode}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 shrink-0" />
            ) : (
              <Moon className="w-4 h-4 text-lime-600 shrink-0" />
            )}
            {isOpen && <span>{theme === 'dark' ? t.lightMode : t.darkMode}</span>}
          </button>

          {/* Logout */}
          <button
            onClick={() => handleNavClick(logout)}
            className={`w-full min-h-[44px] flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors touch-manipulation cursor-pointer ${
              !isOpen ? 'justify-center' : ''
            }`}
            title={t.navLogout}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {isOpen && <span>{t.navLogout}</span>}
          </button>
        </div>
      </aside>
    </>
  );
};
