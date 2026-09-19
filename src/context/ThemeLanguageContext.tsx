import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Language, Translations } from '../i18n/translations';
import { translations } from '../i18n/translations';

interface ThemeLanguageContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: Translations;
  apiUrl: string;
}

const ThemeLanguageContext = createContext<ThemeLanguageContextType | undefined>(undefined);

export const ThemeLanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state — read from localStorage ONLY, default to dark
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('vitasyn_theme');
    if (saved === 'light') return 'light';
    return 'dark'; // always default dark, ignore system preference
  });

  // Language state
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('vitasyn_lang');
    return saved === 'ta' ? 'ta' : 'en';
  });

  // Apply theme class to document root & body — runs on every theme change
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      body.classList.add('dark');
      body.classList.remove('light');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      body.classList.remove('dark');
      body.classList.add('light');
      root.style.colorScheme = 'light';
    }
    localStorage.setItem('vitasyn_theme', theme);
  }, [theme]);

  // On mount, ensure the class is applied even before first toggle
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const saved = localStorage.getItem('vitasyn_theme');
    if (saved === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
      body.classList.remove('dark');
      body.classList.add('light');
      root.style.colorScheme = 'light';
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
      body.classList.add('dark');
      body.classList.remove('light');
      root.style.colorScheme = 'dark';
    }
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      return next;
    });
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('vitasyn_lang', lang);
  };

  const toggleLanguage = () => {
    const nextLang = language === 'en' ? 'ta' : 'en';
    setLanguage(nextLang);
  };

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  return (
    <ThemeLanguageContext.Provider
      value={{
        theme,
        toggleTheme,
        language,
        setLanguage,
        toggleLanguage,
        t: translations[language],
        apiUrl,
      }}
    >
      {children}
    </ThemeLanguageContext.Provider>
  );
};

export const useThemeLanguage = (): ThemeLanguageContextType => {
  const context = useContext(ThemeLanguageContext);
  if (!context) {
    throw new Error('useThemeLanguage must be used within ThemeLanguageProvider');
  }
  return context;
};
