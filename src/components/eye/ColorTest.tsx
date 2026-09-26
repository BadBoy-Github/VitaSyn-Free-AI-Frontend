import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Timer, CheckCircle2, XCircle, SkipForward, Palette } from 'lucide-react';
import { useThemeLanguage } from '../../context/ThemeLanguageContext';
import { COLOR_STAGE_COUNT, COLOR_STAGE_SECONDS, buildColorStageConfig } from './eyeTestData';

interface ColorTestProps {
  stage: number;
  onStageComplete: (correct: boolean) => void;
  onSkipAll: () => void;
}

const TILE_COUNT = 16;

export const ColorTest: React.FC<ColorTestProps> = ({ stage, onStageComplete, onSkipAll }) => {
  const { t, language } = useThemeLanguage();
  const isTamil = language === 'ta';

  const config = buildColorStageConfig(stage);
  const [targetTileIndex, setTargetTileIndex] = useState<number>(() =>
    Math.floor(Math.random() * TILE_COUNT)
  );
  const [secondsLeft, setSecondsLeft] = useState<number>(COLOR_STAGE_SECONDS);
  const [locked, setLocked] = useState<boolean>(false);
  const [wrongTileIndex, setWrongTileIndex] = useState<number | null>(null);
  const [stageResult, setStageResult] = useState<'correct' | 'wrong' | 'timeout' | null>(null);

  const advanceGuard = useRef<boolean>(false);

  // Pick a fresh target tile and reset the timer whenever the stage changes
  useEffect(() => {
    setTargetTileIndex(Math.floor(Math.random() * TILE_COUNT));
    setSecondsLeft(COLOR_STAGE_SECONDS);
    setLocked(false);
    setWrongTileIndex(null);
    setStageResult(null);
    advanceGuard.current = false;
  }, [stage]);

  const advance = useCallback(
    (result: 'correct' | 'wrong' | 'timeout') => {
      if (advanceGuard.current) return;
      advanceGuard.current = true;
      setLocked(true);
      setStageResult(result);
      // Brief feedback pause so the user registers the result, then move on
      window.setTimeout(() => onStageComplete(result === 'correct'), result === 'timeout' ? 200 : 650);
    },
    [onStageComplete]
  );

  // Countdown from 10 -> 0, auto-advance when it hits 0
  useEffect(() => {
    if (locked) return;

    const id = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(id);
          advance('timeout');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(id);
  }, [stage, locked, advance]);

  const handleTileClick = (index: number) => {
    if (locked) return;
    if (index === targetTileIndex) {
      advance('correct');
    } else {
      setWrongTileIndex(index);
      advance('wrong');
    }
  };

  const timerPct = (secondsLeft / COLOR_STAGE_SECONDS) * 100;
  const isUrgent = secondsLeft <= 3;
  const difficulty = Math.round((stage / COLOR_STAGE_COUNT) * 100);

  return (
    <div className="bg-white dark:bg-[#121812] border border-zinc-200 dark:border-[#273526] rounded-2xl p-4 sm:p-8 shadow-sm">
      {/* Header row: stage + timer */}
      <div className="flex items-center justify-between gap-3 mb-3 sm:mb-4">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            {t.stage} {stage} {t.of} {COLOR_STAGE_COUNT}
          </span>
          <span className="hidden sm:inline text-[11px] text-zinc-600 dark:text-zinc-400 font-medium">
            ({isTamil ? 'சிரமம்' : 'Difficulty'}: {difficulty}%)
          </span>
        </div>

        <div
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border ${
            isUrgent
              ? 'bg-red-500/15 border-red-500/40 text-red-600 dark:text-red-400 timer-urgent'
              : 'bg-zinc-50 dark:bg-zinc-900/70 border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200'
          }`}
        >
          <Timer className="w-4 h-4 shrink-0" />
          <span className="text-sm font-black tabular-nums min-w-[2ch] text-center">{secondsLeft}</span>
          <span className="text-[10px] font-semibold hidden sm:inline opacity-70">
            {t.colorTimerLabel}
          </span>
        </div>
      </div>

      {/* Progress bars: stage progress + countdown */}
      <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden mb-2">
        <div
          className="bg-gradient-to-r from-amber-500 to-lime-500 h-full transition-all duration-300 rounded-full"
          style={{ width: `${(stage / COLOR_STAGE_COUNT) * 100}%` }}
        />
      </div>
      <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1 rounded-full overflow-hidden mb-4 sm:mb-6">
        <div
          className={`h-full transition-[width] duration-1000 ease-linear rounded-full ${
            isUrgent ? 'bg-red-500' : 'bg-lime-500'
          }`}
          style={{ width: `${timerPct}%` }}
        />
      </div>

      <div className="text-center mb-4 sm:mb-6">
        <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center justify-center gap-2">
          <Palette className="w-4 h-4 text-amber-500" />
          {t.phase1Title}
        </h2>
        <p className="text-xs text-zinc-700 dark:text-zinc-300 mt-1">{t.tapDifferentTile}</p>
        <p className="text-[11px] text-zinc-500 dark:text-zinc-500 mt-1">
          {isTamil ? 'நேரம் முடிந்தால் தானாக அடுத்த நிலைக்குச் செல்லும்.' : 'The stage advances automatically when the timer reaches 0.'}
        </p>
      </div>

      {/* 4x4 grid of 16 color tiles */}
      <div className="w-full max-w-[310px] sm:max-w-[360px] md:max-w-md mx-auto aspect-square p-2.5 sm:p-4 bg-zinc-100 dark:bg-zinc-900/90 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-inner grid grid-cols-4 gap-2 sm:gap-3 touch-manipulation select-none">
        {Array.from({ length: TILE_COUNT }).map((_, idx) => {
          const isTarget = idx === targetTileIndex;
          const tileL = isTarget ? Math.min(85, config.l + config.deltaL) : config.l;
          const tileBg = `hsl(${config.h}, ${config.s}%, ${tileL}%)`;
          const isWrong = wrongTileIndex === idx;
          const isHitTarget = stageResult === 'correct' && isTarget;

          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleTileClick(idx)}
              disabled={locked}
              style={{ backgroundColor: tileBg }}
              className={`w-full h-full rounded-xl transition-all duration-150 active:scale-95 shadow-xs cursor-pointer relative flex items-center justify-center touch-manipulation select-none ${
                isWrong ? 'ring-4 ring-red-500 scale-95 bg-red-500/30' : ''
              } ${isHitTarget ? 'ring-4 ring-lime-500' : ''} ${locked ? 'opacity-70' : 'hover:opacity-95'}`}
              aria-label={`Color tile ${idx + 1}`}
            >
              {isWrong && (
                <span className="text-white text-lg sm:text-2xl font-black bg-red-600/95 rounded-full w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center shadow-lg animate-bounce">
                  <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Feedback banner */}
      <div className="mt-3 min-h-[34px] flex items-center justify-center">
        {stageResult === 'correct' && (
          <div className="text-center text-xs font-bold text-lime-700 dark:text-lime-400 bg-lime-500/10 border border-lime-500/20 py-1.5 px-4 rounded-xl max-w-md mx-auto flex items-center justify-center gap-1.5 animate-pulse">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{t.correctTileSelected}</span>
          </div>
        )}
        {stageResult === 'wrong' && (
          <div className="text-center text-xs font-bold text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/20 py-1.5 px-4 rounded-xl max-w-md mx-auto flex items-center justify-center gap-1.5 animate-pulse">
            <XCircle className="w-3.5 h-3.5" />
            <span>
              {isTamil ? 'தவறான கட்டம்! அடுத்த நிலைக்குச் செல்கிறது...' : 'Incorrect tile! Moving to next stage...'}
            </span>
          </div>
        )}
        {stageResult === 'timeout' && (
          <div className="text-center text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 py-1.5 px-4 rounded-xl max-w-md mx-auto flex items-center justify-center gap-1.5 animate-pulse">
            <Timer className="w-3.5 h-3.5" />
            <span>
              {isTamil ? 'நேரம் முடிந்தது! அடுத்த நிலைக்குச் செல்கிறது...' : "Time's up! Moving to next stage..."}
            </span>
          </div>
        )}
      </div>

      {/* Score + skip */}
      <div className="mt-4 sm:mt-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-zinc-600 dark:text-zinc-400 border-t border-zinc-200 dark:border-zinc-800 pt-4">
        <div className="flex items-center gap-3">
          <span>• {isTamil ? 'மொத்தம் 16 வண்ண கட்டங்கள்' : '16 color tiles total'}</span>
          <span>• {isTamil ? '1 மாறுபட்ட கட்டம்' : '1 unique shade'}</span>
        </div>
        <button
          type="button"
          onClick={onSkipAll}
          disabled={locked}
          className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 hover:underline font-semibold cursor-pointer touch-manipulation py-1 disabled:opacity-50"
        >
          <SkipForward className="w-3.5 h-3.5" />
          <span>{t.skipToReading}</span>
        </button>
      </div>
    </div>
  );
};
