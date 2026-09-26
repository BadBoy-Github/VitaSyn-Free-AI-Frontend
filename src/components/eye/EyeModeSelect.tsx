import React from 'react';
import { ArrowLeft, BookOpen, Users } from 'lucide-react';
import { useThemeLanguage } from '../../context/ThemeLanguageContext';
import { READING_STAGE_COUNT, type EyeMode } from './eyeTestData';

interface EyeModeSelectProps {
  scores: Record<EyeMode, number>;
  onSelect: (mode: EyeMode) => void;
  onBack: () => void;
}

const modeIcon = (mode: EyeMode) => {
  if (mode === 'both') return Users;
  return BookOpen;
};

export const EyeModeSelect: React.FC<EyeModeSelectProps> = ({ scores, onSelect, onBack }) => {
  const { t, language } = useThemeLanguage();
  const isTamil = language === 'ta';

  const cards: { mode: EyeMode; label: string; desc: string; accent: string }[] = [
    {
      mode: 'left',
      label: t.leftEyeBtn,
      desc: isTamil ? 'வலது கண்ணை மூடி, இடது கண்ணால் வாசிக்கவும்' : 'Cover your right eye and read with the left eye',
      accent: 'border-lime-500/40 hover:border-lime-500',
    },
    {
      mode: 'right',
      label: t.rightEyeBtn,
      desc: isTamil ? 'இடது கண்ணை மூடி, வலது கண்ணால் வாசிக்கவும்' : 'Cover your left eye and read with the right eye',
      accent: 'border-amber-500/40 hover:border-amber-500',
    },
    {
      mode: 'both',
      label: t.bothEyesBtn,
      desc: isTamil ? 'இரு கண்களையும் திறந்து வைத்து வாசிக்கவும்' : 'Keep both eyes open and read normally',
      accent: 'border-purple-500/40 hover:border-purple-500',
    },
  ];

  return (
    <div className="bg-white dark:bg-[#121812] border border-zinc-200 dark:border-[#273526] rounded-2xl p-5 sm:p-8 shadow-sm">
      <div className="text-center mb-5 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-50">
          {t.readingEyeSelectionTitle}
        </h2>
        <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 mt-1.5 max-w-lg mx-auto leading-relaxed">
          {t.readingEyeSelectionDesc}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {cards.map(({ mode, label, desc, accent }) => {
          const Icon = modeIcon(mode);
          const done = scores[mode] !== null && scores[mode] !== undefined;
          return (
            <button
              key={mode}
              type="button"
              onClick={() => onSelect(mode)}
              className={`group relative p-4 sm:p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border-2 ${accent} flex flex-col items-center text-center gap-2 transition-all cursor-pointer touch-manipulation active:scale-[0.98] hover:shadow-lg`}
            >
              <div className="w-11 h-11 rounded-xl bg-lime-500/15 text-lime-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">{label}</h3>
              <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-snug">{desc}</p>
              <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                {READING_STAGE_COUNT} {isTamil ? 'நிலைகள்' : 'stages'}
                {done && <span className="ml-1.5 text-lime-600 dark:text-lime-400">✓</span>}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-center">
        <button
          type="button"
          onClick={onBack}
          className="min-h-[40px] px-4 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer touch-manipulation flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{isTamil ? 'வண்ண சோதனைக்கு திரும்பவும்' : 'Back to colour test'}</span>
        </button>
      </div>
    </div>
  );
};

export default EyeModeSelect;
