import React, { useState, useEffect, useMemo } from 'react';
import {
  Eye,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Printer,
  HelpCircle,
  Clock,
  Loader2,
  Volume2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useThemeLanguage } from '../../context/ThemeLanguageContext';
import { useAuth } from '../../context/AuthContext';
import { localizeReport } from '../../utils/reportTranslator';

export const EyeAssessment: React.FC = () => {
  const { t, apiUrl, language } = useThemeLanguage();
  const { token } = useAuth();

  // Workflow phases: 'color' | 'acuity' | 'questions' | 'analyzing' | 'report'
  const [phase, setPhase] = useState<'color' | 'acuity' | 'questions' | 'analyzing' | 'report'>('color');

  // Phase 1: Color Game States (10 stages)
  const [colorStage, setColorStage] = useState<number>(1);
  const [targetTileIndex, setTargetTileIndex] = useState<number>(0);
  const [baseColor, setBaseColor] = useState<{ h: number; s: number; l: number }>({ h: 45, s: 80, l: 50 });
  const [deltaL, setDeltaL] = useState<number>(24);
  const [colorScore, setColorScore] = useState<number>(0);
  const [colorStagesPassed, setColorStagesPassed] = useState<number>(0);
  const [wrongClickIndex, setWrongClickIndex] = useState<number | null>(null);
  const [isTransitioningStage, setIsTransitioningStage] = useState<boolean>(false);

  // Phase 2: Acuity Game States (5 sizes: very big to very small)
  const [acuityIndex, setAcuityIndex] = useState<number>(0);
  const [acuityScore, setAcuityScore] = useState<number>(0);

  // Phase 3: Questionnaire
  const [dryEyes, setDryEyes] = useState<boolean>(false);
  const [havePower, setHavePower] = useState<boolean>(false);
  const [powerType, setPowerType] = useState<'positive' | 'negative'>('negative');

  // Report & API
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [report, setReport] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Localized report ensures instant, accurate Tamil translation even on language toggles
  const displayReport = useMemo(() => localizeReport(report, language), [report, language]);

  // Generate color stage configuration
  const setupColorStage = (stageNum: number) => {
    const hues = [45, 140, 200, 280, 15, 85, 320, 175, 60, 230];
    const h = hues[(stageNum - 1) % hues.length];
    const s = 70;
    const l = 48;

    const deltas = [26, 20, 15, 11, 8.5, 6.5, 4.8, 3.6, 2.7, 2.0];
    const delta = deltas[stageNum - 1] || 2.0;

    const randomIndex = Math.floor(Math.random() * 16);

    setBaseColor({ h, s, l });
    setDeltaL(delta);
    setTargetTileIndex(randomIndex);
    setWrongClickIndex(null);
    setIsTransitioningStage(false);
  };

  useEffect(() => {
    if (phase === 'color') {
      setupColorStage(colorStage);
    }
  }, [colorStage, phase]);

  const handleTileClick = (index: number) => {
    if (isTransitioningStage) return;

    if (index === targetTileIndex) {
      const earned = 10;
      setColorScore((prev) => prev + earned);
      setColorStagesPassed((prev) => prev + 1);

      if (colorStage < 10) {
        setColorStage((prev) => prev + 1);
      } else {
        setPhase('acuity');
      }
    } else {
      // Wrong tile clicked: mark as incorrect and auto-advance to next stage
      setWrongClickIndex(index);
      setIsTransitioningStage(true);

      setTimeout(() => {
        setWrongClickIndex(null);
        setIsTransitioningStage(false);

        if (colorStage < 10) {
          setColorStage((prev) => prev + 1);
        } else {
          setPhase('acuity');
        }
      }, 700);
    }
  };

  // Sentences array for Acuity Test
  const acuitySentences = [
    { text: t.sentVeryBig, sizeClass: 'text-2xl sm:text-3xl md:text-4xl font-bold', label: language === 'ta' ? 'மிகப் பெரியது' : 'Very Big' },
    { text: t.sentBig, sizeClass: 'text-lg sm:text-xl md:text-2xl font-semibold', label: language === 'ta' ? 'பெரியது' : 'Big' },
    { text: t.sentMedium, sizeClass: 'text-sm sm:text-base md:text-lg font-medium', label: language === 'ta' ? 'நடுத்தரம்' : 'Medium' },
    { text: t.sentSmall, sizeClass: 'text-xs sm:text-sm font-normal', label: language === 'ta' ? 'சிறியது' : 'Small' },
    { text: t.sentVerySmall, sizeClass: 'text-[10px] sm:text-[11px] font-normal leading-tight tracking-tight', label: language === 'ta' ? 'மிகச் சிறியது' : 'Very Small' },
  ];

  const handleAcuityAnswer = (canRead: boolean) => {
    if (canRead) {
      setAcuityScore((prev) => prev + 1);
    }

    if (acuityIndex < 4) {
      setAcuityIndex((prev) => prev + 1);
    } else {
      setPhase('questions');
    }
  };

  // Submit complete Eye Assessment
  const submitEyeAssessment = async () => {
    setIsAnalyzing(true);
    setErrorMsg(null);

    try {
      const payload = {
        colorStagesPassed,
        colorPoints: colorScore,
        acuityScore,
        dryEyes,
        havePower,
        powerType: havePower ? powerType : 'none',
        language,
      };

      const res = await fetch(`${apiUrl}/api/eye/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success && data.report) {
        setReport(data.report);
        setPhase('report');

        // Save result to user profile in MongoDB
        if (token) {
          fetch(`${apiUrl}/api/auth/add-result`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              type: 'eye',
              assessmentId: data.assessmentId || data.report.uniqueResultCode,
              score: data.report.overallScore,
              condition: data.report.colorStatus,
              uniqueResultCode: data.report.uniqueResultCode,
              reportTitle: data.report.title,
            }),
          }).catch((saveErr) => console.warn('Could not save eye result to profile:', saveErr));
        }

        try {
          confetti({
            particleCount: 90,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#65a30d', '#f59e0b', '#3b82f6'],
          });
        } catch {
          // ignore
        }
      } else {
        throw new Error(data.message || 'Eye analysis failed');
      }
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg(error.message || 'Failed to generate eye report. Please check server.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetEyeTest = () => {
    setColorStage(1);
    setColorScore(0);
    setColorStagesPassed(0);
    setWrongClickIndex(null);
    setIsTransitioningStage(false);
    setAcuityIndex(0);
    setAcuityScore(0);
    setDryEyes(false);
    setHavePower(false);
    setPowerType('negative');
    setReport(null);
    setErrorMsg(null);
    setPhase('color');
  };

  return (
    <div className="max-w-4xl mx-auto py-4 px-2 sm:px-4">
      {/* Header Banner */}
      <div className="mb-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-500/15 border border-lime-500/30 text-lime-600 dark:text-lime-300 text-xs font-semibold mb-2">
          <Eye className="w-3.5 h-3.5" />
          <span>{t.eyeBanner}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          {t.eyeTitle}
        </h1>
        <p className="text-sm text-zinc-700 dark:text-zinc-300 mt-1 max-w-xl mx-auto">
          {t.eyeSubtitle}
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* PHASE 1: 10-STAGE COLOR DIFFERENTIATION TEST */}
      {phase === 'color' && (
        <div className="bg-white dark:bg-[#121812] border border-zinc-200 dark:border-[#273526] rounded-2xl p-4 sm:p-8 shadow-sm">
          {/* Stage Progress Bar */}
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                {t.stage} {colorStage} {t.of} 10
              </span>
              <span className="text-[11px] sm:text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                ({language === 'ta' ? 'சிரமம்' : 'Difficulty'}: {Math.round((colorStage / 10) * 100)}%)
              </span>
            </div>
            <div className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
              {t.colorScoreLabel}: <span className="text-lime-600 dark:text-lime-400 font-extrabold">{colorScore}</span> {language === 'ta' ? 'புள்ளிகள்' : 'pts'}
            </div>
          </div>

          <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden mb-4 sm:mb-6">
            <div
              className="bg-gradient-to-r from-amber-500 to-lime-500 h-full transition-all duration-300 rounded-full"
              style={{ width: `${(colorStage / 10) * 100}%` }}
            />
          </div>

          <div className="text-center mb-4 sm:mb-6">
            <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100">{t.phase1Title}</h2>
            <p className="text-xs text-zinc-700 dark:text-zinc-300 mt-1">{t.tapDifferentTile}</p>
          </div>

          {/* 4x4 Grid of 16 Color Tiles - Constrained to prevent horizontal overflow on small phones */}
          <div className="w-full max-w-[310px] sm:max-w-[360px] md:max-w-md mx-auto aspect-square p-2.5 sm:p-4 bg-zinc-100 dark:bg-zinc-900/90 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-inner grid grid-cols-4 gap-2 sm:gap-3 touch-manipulation select-none">
            {Array.from({ length: 16 }).map((_, idx) => {
              const isTarget = idx === targetTileIndex;
              const tileL = isTarget ? Math.min(85, baseColor.l + deltaL) : baseColor.l;
              const tileBg = `hsl(${baseColor.h}, ${baseColor.s}%, ${tileL}%)`;
              const isWrong = wrongClickIndex === idx;

              return (
                <button
                  key={idx}
                  onClick={() => handleTileClick(idx)}
                  disabled={isTransitioningStage}
                  style={{ backgroundColor: tileBg }}
                  className={`w-full h-full rounded-xl transition-all duration-150 active:scale-95 shadow-xs hover:opacity-95 cursor-pointer relative flex items-center justify-center touch-manipulation select-none ${
                    isWrong ? 'ring-4 ring-red-500 scale-95 duration-150 bg-red-500/30' : ''
                  }`}
                  aria-label={`Color tile ${idx + 1}`}
                >
                  {isWrong && (
                    <span className="text-white text-lg sm:text-2xl font-black bg-red-600/95 rounded-full w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center shadow-lg animate-bounce">
                      ✕
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback banner on wrong click */}
          {wrongClickIndex !== null && (
            <div className="mt-3 text-center text-xs font-bold text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/20 py-1.5 px-4 rounded-xl max-w-md mx-auto animate-pulse flex items-center justify-center gap-1.5">
              <span>✕</span>
              <span>{language === 'ta' ? 'தவறான தேர்வு! அடுத்த நிலைக்குச் செல்கிறது...' : 'Incorrect tile! Skipping to next stage...'}</span>
            </div>
          )}

          {/* Helper info footer */}
          <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-zinc-600 dark:text-zinc-400 border-t border-zinc-200 dark:border-zinc-800 pt-4">
            <div className="flex items-center gap-3">
              <span>• {language === 'ta' ? 'மொத்தம் 16 வண்ண கட்டங்கள்' : '16 color tiles total'}</span>
              <span>• {language === 'ta' ? '1 மாறுபட்ட கட்டம்' : '1 unique shade'}</span>
            </div>
            <button
              onClick={() => setPhase('acuity')}
              className="text-amber-600 dark:text-amber-400 hover:underline font-semibold cursor-pointer touch-manipulation py-1"
            >
              {t.skipToReading}
            </button>
          </div>
        </div>
      )}

      {/* PHASE 2: VISUAL ACUITY READING TEST */}
      {phase === 'acuity' && (
        <div className="bg-white dark:bg-[#121812] border border-zinc-200 dark:border-[#273526] rounded-2xl p-4 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-lime-600 dark:text-lime-400 truncate max-w-[200px] sm:max-w-none">
              {t.sentenceLevel} {acuityIndex + 1} {t.of} 5: {acuitySentences[acuityIndex].label}
            </span>
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 shrink-0">
              {t.readingAcuityLabel}: {acuityScore} / 5
            </span>
          </div>

          <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden mb-4 sm:mb-6">
            <div
              className="bg-gradient-to-r from-lime-500 to-amber-500 h-full transition-all duration-300 rounded-full"
              style={{ width: `${((acuityIndex + 1) / 5) * 100}%` }}
            />
          </div>

          <div className="text-center mb-4 sm:mb-6">
            <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100">{t.phase2Title}</h2>
            <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-lg bg-amber-400/10 border border-amber-400/20 text-xs text-amber-700 dark:text-amber-300 font-medium">
              <Volume2 className="w-3.5 h-3.5 shrink-0" />
              <span>{t.distanceTip}</span>
            </div>
          </div>

          {/* Reading Display Box */}
          <div className="min-h-[140px] sm:min-h-[160px] p-4 sm:p-8 bg-zinc-50 dark:bg-zinc-900/70 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-center my-4 sm:my-6 overflow-hidden">
            <p
              className={`${acuitySentences[acuityIndex].sizeClass} text-zinc-900 dark:text-zinc-100 transition-all duration-300 max-w-xl break-words`}
            >
              {acuitySentences[acuityIndex].text}
            </p>
          </div>

          {/* Prompt */}
          <p className="text-xs sm:text-sm font-semibold text-zinc-800 dark:text-zinc-200 text-center mb-4">
            {t.canYouReadPrompt}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 max-w-lg mx-auto">
            <button
              onClick={() => handleAcuityAnswer(true)}
              className="min-h-[44px] py-3 px-4 rounded-xl bg-lime-500 hover:bg-lime-400 text-zinc-950 font-bold text-xs sm:text-sm transition-all shadow-sm active:scale-[0.98] cursor-pointer touch-manipulation flex items-center justify-center"
            >
              {t.canReadBtn}
            </button>
            <button
              onClick={() => handleAcuityAnswer(false)}
              className="min-h-[44px] py-3 px-4 rounded-xl bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-semibold text-xs sm:text-sm transition-all active:scale-[0.98] cursor-pointer touch-manipulation flex items-center justify-center"
            >
              {t.cannotReadBtn}
            </button>
          </div>
        </div>
      )}

      {/* PHASE 3: QUESTIONNAIRE */}
      {phase === 'questions' && (
        <div className="bg-white dark:bg-[#121812] border border-zinc-200 dark:border-[#273526] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{t.phase3Title}</h2>
            <p className="text-xs text-zinc-700 dark:text-zinc-300">
              {t.eyePhase3Desc}
            </p>
          </div>

          {/* Test Performance Recap Pill */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-zinc-50 dark:bg-zinc-900/60 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs">
            <div>
              <span className="text-zinc-600 dark:text-zinc-400">{t.colorDiscriminationLabel}:</span>{' '}
              <span className="font-bold text-amber-600 dark:text-amber-400">{colorScore} {language === 'ta' ? 'புள்ளிகள்' : 'pts'} (10/10)</span>
            </div>
            <div>
              <span className="text-zinc-600 dark:text-zinc-400">{t.readingAcuityLabel}:</span>{' '}
              <span className="font-bold text-lime-600 dark:text-lime-400">{acuityScore} / 5</span>
            </div>
          </div>

          {/* Question 1: Dry Eyes */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-zinc-800 dark:text-zinc-200">
              {t.dryEyesPrompt}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDryEyes(true)}
                className={`py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  dryEyes
                    ? 'bg-amber-500/20 border-amber-500 text-amber-700 dark:text-amber-300'
                    : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300'
                }`}
              >
                {t.yes}
              </button>
              <button
                type="button"
                onClick={() => setDryEyes(false)}
                className={`py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  !dryEyes
                    ? 'bg-lime-500/20 border-lime-500 text-lime-700 dark:text-lime-300'
                    : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300'
                }`}
              >
                {t.no}
              </button>
            </div>
          </div>

          {/* Question 2: Have Power */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-zinc-800 dark:text-zinc-200">
              {t.havePowerPrompt}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setHavePower(true)}
                className={`py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  havePower
                    ? 'bg-amber-500/20 border-amber-500 text-amber-700 dark:text-amber-300'
                    : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300'
                }`}
              >
                {t.yes}
              </button>
              <button
                type="button"
                onClick={() => setHavePower(false)}
                className={`py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  !havePower
                    ? 'bg-lime-500/20 border-lime-500 text-lime-700 dark:text-lime-300'
                    : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300'
                }`}
              >
                {t.no}
              </button>
            </div>
          </div>

          {/* Conditional Question: Positive or Negative */}
          {havePower && (
            <div className="space-y-2 p-3 sm:p-4 rounded-xl bg-amber-400/5 border border-amber-400/20">
              <label className="block text-xs sm:text-sm font-semibold text-amber-700 dark:text-amber-300">
                {t.powerTypePrompt}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setPowerType('positive')}
                  className={`min-h-[44px] py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer touch-manipulation active:scale-[0.98] flex items-center justify-center ${
                    powerType === 'positive'
                      ? 'bg-amber-500 border-amber-500 text-zinc-950 font-bold'
                      : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  {t.powerPositive}
                </button>
                <button
                  type="button"
                  onClick={() => setPowerType('negative')}
                  className={`min-h-[44px] py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer touch-manipulation active:scale-[0.98] flex items-center justify-center ${
                    powerType === 'negative'
                      ? 'bg-lime-500 border-lime-500 text-zinc-950 font-bold'
                      : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  {t.powerNegative}
                </button>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-4 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 border-t border-zinc-200 dark:border-zinc-800">
            <button
              onClick={() => setPhase('acuity')}
              className="w-full sm:w-auto min-h-[40px] text-xs text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center justify-center gap-1 cursor-pointer touch-manipulation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.backToReadingTest}</span>
            </button>

            <button
              onClick={submitEyeAssessment}
              disabled={isAnalyzing}
              className="w-full sm:w-auto min-h-[44px] flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-lime-600 to-amber-500 hover:from-lime-500 hover:to-amber-400 text-zinc-950 font-bold text-sm shadow-md shadow-lime-500/20 active:scale-[0.98] transition-all cursor-pointer touch-manipulation"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t.aiConsulting}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{t.submitEyeAnalysis}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* PHASE 4: AI REPORT */}
      {phase === 'report' && displayReport && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#121812] border border-lime-500/40 dark:border-amber-400/30 rounded-2xl p-4 sm:p-8 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-lime-500/10 to-amber-400/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-lime-600 dark:text-lime-400">
                  {displayReport.uniqueResultCode}
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-50 mt-0.5">
                  {displayReport.title}
                </h2>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 mt-1">
                  {t.eyeReportEval}
                </p>
              </div>

              {/* Overall Score */}
              <div className="flex items-center justify-between sm:justify-end gap-3 bg-zinc-50 dark:bg-zinc-900/80 p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 w-full sm:w-auto shrink-0">
                <div className="text-left sm:text-right">
                  <div className="text-[10px] uppercase font-bold text-zinc-600 dark:text-zinc-400">
                    {t.overallScore}
                  </div>
                  <div className="text-2xl font-black text-lime-600 dark:text-lime-400">
                    {displayReport.overallScore}
                    <span className="text-xs text-zinc-600 dark:text-zinc-400 font-normal">/100</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-lime-500/40 border-t-amber-400 flex items-center justify-center font-bold text-xs text-zinc-800 dark:text-zinc-200">
                  {displayReport.overallScore >= 80
                    ? language === 'ta' ? 'சிறந்தது' : 'Optimal'
                    : displayReport.overallScore >= 60
                    ? language === 'ta' ? 'சீரானது' : 'Standard'
                    : language === 'ta' ? 'கண் சோர்வு' : 'Mild Strain'}
                </div>
              </div>
            </div>

            {/* Breakdown Score Cards */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-amber-400/10 border border-amber-400/25">
                <div className="text-[11px] uppercase font-bold text-amber-700 dark:text-amber-300">
                  {t.eyeColorRating}
                </div>
                <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
                  {displayReport.colorStatus} ({displayReport.colorStagesPassed}/10 {t.stage})
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-lime-500/10 border border-lime-500/25">
                <div className="text-[11px] uppercase font-bold text-lime-700 dark:text-lime-300">
                  {t.eyeAcuityTier}
                </div>
                <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
                  {displayReport.grade} ({displayReport.acuityScore}/5 {language === 'ta' ? 'வாக்கியங்கள்' : 'sizes'})
                </div>
              </div>
            </div>

            {/* Clinical Consultation */}
            <div className="mt-5 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
              <div className="flex items-center gap-2 font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                <Sparkles className="w-4 h-4 text-lime-500" />
                <span>{t.eyeClinicalConsult}</span>
              </div>
              <p className="whitespace-pre-line">{displayReport.overview}</p>
            </div>

            {/* Findings & Highlights */}
            {displayReport.clinicalFindings && displayReport.clinicalFindings.length > 0 && (
              <div className="mt-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-2">
                  {t.keyFindings}
                </h3>
                <ul className="space-y-1.5">
                  {displayReport.clinicalFindings.map((f: string, idx: number) => (
                    <li
                      key={idx}
                      className="text-xs text-zinc-700 dark:text-zinc-300 flex items-start gap-2 bg-zinc-50 dark:bg-zinc-900/40 p-2 rounded-lg border border-zinc-200/60 dark:border-zinc-800/60"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-lime-500 mt-1.5 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Do's and Don'ts */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-lime-500/5 border border-lime-500/20">
                <div className="flex items-center gap-2 text-xs font-bold text-lime-700 dark:text-lime-400 mb-2 uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t.recommendedDos}</span>
                </div>
                <ul className="space-y-2">
                  {displayReport.dos?.map((item: string, idx: number) => (
                    <li key={idx} className="text-xs text-zinc-700 dark:text-zinc-300 flex items-start gap-2">
                      <span className="text-lime-500 font-bold">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400 mb-2 uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{t.thingsToAvoid}</span>
                </div>
                <ul className="space-y-2">
                  {displayReport.donts?.map((item: string, idx: number) => (
                    <li key={idx} className="text-xs text-zinc-700 dark:text-zinc-300 flex items-start gap-2">
                      <span className="text-amber-500 font-bold">✕</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recommendations */}
            {displayReport.recommendations && displayReport.recommendations.length > 0 && (
              <div className="mt-5 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800">
                <div className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-2 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-lime-500" />
                  <span>{t.expertRecommendations}</span>
                </div>
                <ul className="space-y-1.5">
                  {displayReport.recommendations.map((rec: string, idx: number) => (
                    <li key={idx} className="text-xs text-zinc-700 dark:text-zinc-300 flex items-start gap-2">
                      <span className="text-lime-500 font-bold">→</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Lifestyle */}
            <div className="mt-5 p-3.5 rounded-xl bg-lime-500/10 border border-lime-500/20 text-xs text-zinc-700 dark:text-zinc-300 flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-lime-600 dark:text-lime-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">{t.lifestyleTip}: </span>
                <span>{displayReport.lifestyleGuidance}</span>
              </div>
            </div>

            {/* Disclaimer */}
            <p className="mt-5 text-[11px] text-zinc-600 dark:text-zinc-400 italic text-center border-t border-zinc-200 dark:border-zinc-800 pt-3">
              {displayReport.disclaimer || t.medicalDisclaimer}
            </p>

            {/* Actions */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <button
                onClick={resetEyeTest}
                className="w-full sm:w-auto min-h-[44px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer touch-manipulation active:scale-[0.98]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t.retakeTest}</span>
              </button>

              <button
                onClick={() => window.print()}
                className="w-full sm:w-auto min-h-[44px] flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-lime-600 to-amber-500 hover:from-lime-500 hover:to-amber-400 text-zinc-950 font-bold text-xs shadow-md shadow-lime-500/20 transition-all cursor-pointer touch-manipulation active:scale-[0.98]"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{t.printReport}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
