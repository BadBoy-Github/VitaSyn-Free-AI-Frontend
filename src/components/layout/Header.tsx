import React from 'react';
import { Menu, Sparkles, Eye, History, Sun, Moon, Globe, ExternalLink, User } from 'lucide-react';
import { useThemeLanguage } from '../../context/ThemeLanguageContext';
import { useAuth } from '../../context/AuthContext';
import { BrandLogo } from '../common/BrandLogo';

interface HeaderProps {
  currentTab: 'welcome' | 'hair' | 'eye' | 'history';
  onOpenMobileSidebar: () => void;
  onResetToWelcome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onOpenMobileSidebar,
  onResetToWelcome,
}) => {
  const { theme, toggleTheme, language, toggleLanguage, t } = useThemeLanguage();
  const { user } = useAuth();

  const getTabBadge = () => {
    switch (currentTab) {
      case 'hair':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-600 dark:text-amber-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.navHair}</span>
          </div>
        );
      case 'eye':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-lime-500/15 border border-lime-500/30 text-lime-600 dark:text-lime-300 text-xs font-semibold">
            <Eye className="w-3.5 h-3.5" />
            <span>{t.navEye}</span>
          </div>
        );
      case 'history':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-semibold">
            <History className="w-3.5 h-3.5" />
            <span>{t.navHistory}</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <header className="sticky top-0 z-30 h-14 sm:h-16 px-3 sm:px-4 md:px-6 bg-white/80 dark:bg-[#0b0f0b]/80 backdrop-blur-md border-b border-zinc-200 dark:border-[#1e2a1e] flex items-center justify-between gap-2">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* Mobile menu trigger */}
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 min-h-[40px] min-w-[40px] flex items-center justify-center touch-manipulation cursor-pointer"
          aria-label="Open sidebar navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Mobile logo */}
        <div className="lg:hidden shrink-0">
          <BrandLogo size="sm" showCompanyLink={false} />
        </div>

        {/* Desktop breadcrumb */}
        <div className="hidden lg:flex items-center gap-2">
          <button
            onClick={onResetToWelcome}
            className="text-xs text-zinc-700 dark:text-zinc-300 hover:text-amber-600 dark:hover:text-amber-400 font-medium cursor-pointer"
          >
            {t.dashboard}
          </button>
          {currentTab !== 'welcome' && (
            <>
              <span className="text-zinc-400 dark:text-zinc-600 text-xs">/</span>
              {getTabBadge()}
            </>
          )}
        </div>
      </div>

      {/* Right Quick Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* User indicator */}
        {user && (
          <>
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 text-xs text-zinc-700 dark:text-zinc-300">
              <User className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="font-medium truncate max-w-[100px]">{user.name}</span>
            </div>
            <div
              className="flex md:hidden p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 text-amber-500"
              title={user.name}
            >
              <User className="w-3.5 h-3.5" />
            </div>
          </>
        )}

        {/* Language switch */}
        <button
          onClick={toggleLanguage}
          className="min-h-[38px] flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100/70 dark:bg-zinc-900/60 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:border-amber-400/50 transition-colors touch-manipulation cursor-pointer"
          title="Switch Language"
        >
          <Globe className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>{language === 'en' ? 'தமிழ்' : 'EN'}</span>
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="min-h-[38px] min-w-[38px] flex items-center justify-center p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100/70 dark:bg-zinc-900/60 text-zinc-700 dark:text-zinc-300 hover:border-lime-500/50 transition-colors touch-manipulation cursor-pointer"
          title={theme === 'dark' ? t.lightMode : t.darkMode}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-lime-600" />
          )}
        </button>

        {/* Company link */}
        <a
          href="https://vitasyn.in/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/10 to-lime-500/10 hover:from-amber-500/20 hover:to-lime-500/20 text-xs font-semibold text-amber-700 dark:text-amber-300 border border-amber-400/30 transition-all"
        >
          <span>vitasyn.in</span>
          <ExternalLink className="w-3 h-3 opacity-70" />
        </a>
      </div>
    </header>
  );
};
