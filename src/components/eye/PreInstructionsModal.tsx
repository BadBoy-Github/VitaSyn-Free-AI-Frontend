import React, { useEffect } from 'react';
import { ClipboardList, X, Play, Lightbulb, Timer, Eye as EyeIcon, ListChecks } from 'lucide-react';
import { useThemeLanguage } from '../../context/ThemeLanguageContext';

interface PreInstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: () => void;
}

/**
 * Pre-Instructions modal card shown before the eye test begins.
 * Pressing OK acknowledges the instructions and opens the colour test.
 */
export const PreInstructionsModal: React.FC<PreInstructionsModalProps> = ({ isOpen, onClose, onStart }) => {
  const { t, language } = useThemeLanguage();

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Enter') onStart();
    };

    document.addEventListener('keydown', handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose, onStart]);

  if (!isOpen) return null;

  const highlights = [
    { icon: Timer, text: language === 'ta' ? 'வண்ண பரிசோதனை: 10 நிலைகள், ஒவ்வொன்றுக்கும் 10 வினாடி நேரம்' : 'Colour test: 10 stages, 10 seconds each' },
    { icon: EyeIcon, text: language === 'ta' ? 'வாசிப்பு பரிசோதனை: இடது கண், வலது கண், இரு கண்களும்' : 'Reading test: Left eye, Right eye, Both eyes' },
    { icon: ListChecks, text: language === 'ta' ? 'ஒவ்வொரு கண் பரிசோதனையிலும் 5 வாக்கிய அளவு நிலைகள்' : 'Each eye test has 5 word-size stages' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-zinc-900/70 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pre-instructions-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl max-h-[92dvh] overflow-y-auto rounded-2xl bg-white dark:bg-[#121812] border border-amber-400/40 dark:border-amber-400/25 shadow-2xl shadow-amber-500/10 animate-[scaleIn_0.22s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-5 sm:p-6 pb-4 rounded-t-2xl bg-gradient-to-br from-amber-500/10 to-lime-500/10 border-b border-zinc-200 dark:border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            aria-label={t.close}
            className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200/70 dark:hover:bg-zinc-800 transition-colors cursor-pointer touch-manipulation"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-3">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
              <ClipboardList className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="pr-8">
              <h2
                id="pre-instructions-title"
                className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-50"
              >
                {t.preTestTitle}
              </h2>
              <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 mt-1 leading-relaxed">
                {t.preTestSubtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Highlighted key points */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {highlights.map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-start gap-2 p-2.5 rounded-xl bg-lime-500/10 border border-lime-500/25 text-[11px] sm:text-xs font-semibold text-lime-800 dark:text-lime-200"
              >
                <Icon className="w-4 h-4 shrink-0 mt-px text-lime-600 dark:text-lime-400" />
                <span className="leading-snug">{text}</span>
              </div>
            ))}
          </div>

          {/* Full instruction list — two columns so all 8 points stay visible at once */}
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {t.preTestInstructions.map((instruction, idx) => (
              <li
                key={instruction}
                className="flex items-start gap-2.5 p-2.5 sm:p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800"
              >
                <span className="w-5 h-5 rounded-full bg-amber-500 text-zinc-950 text-[10px] font-black flex items-center justify-center shrink-0 mt-px">
                  {idx + 1}
                </span>
                <span className="text-xs sm:text-[13px] text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {instruction}
                </span>
              </li>
            ))}
          </ul>

          {/* Tip */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-400/10 border border-amber-400/25">
            <Lightbulb className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
            <p className="text-[11px] sm:text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
              {language === 'ta'
                ? 'சரியான முடிவுக்கு: உலர் கண், முழு விதிப்பு வள்ளம், மற்றும் உங்கள் சாதாரண உடல் நிலையில் இருக்கவும்.'
                : 'For an accurate result: use a dry, well-lit room and test while you are rested.'}
            </p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-5 sm:p-6 pt-0 flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="sm:w-auto min-h-[44px] flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 text-xs sm:text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer touch-manipulation active:scale-[0.98]"
          >
            {t.preTestSkipBtn}
          </button>
          <button
            type="button"
            onClick={onStart}
            autoFocus
            className="min-h-[44px] flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-lime-600 to-amber-500 hover:from-lime-500 hover:to-amber-400 text-zinc-950 font-bold text-sm shadow-md shadow-lime-500/20 transition-all cursor-pointer touch-manipulation active:scale-[0.98]"
          >
            <Play className="w-4 h-4" />
            <span>OK — {t.preTestStartBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
