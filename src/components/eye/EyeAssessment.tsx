import React, { useMemo, useState } from 'react';
import {
  Eye,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Printer,
  HelpCircle,
  Clock,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useThemeLanguage } from '../../context/ThemeLanguageContext';
import { useAuth } from '../../context/AuthContext';
import { localizeReport } from '../../utils/reportTranslator';
import { PreInstructionsModal } from './PreInstructionsModal';
import { EyePreTest } from './EyePreTest';
import { ColorTest } from './ColorTest';
import { ReadingTest } from './ReadingTest';
import { EyeModeSelect } from './EyeModeSelect';
import { EyeSymptomForm } from './EyeSymptomForm';
import {
  COLOR_STAGE_COUNT,
  EYE_MODE_ORDER,
  READING_STAGE_COUNT,
  emptyYesNoAnswers,
  type EyeMode,
  type ScreenTimeOption,
  type YesNoAnswers,
  type YesNoKey,
} from './eyeTestData';

type Phase = 'pretest' | 'color' | 'readingSelect' | 'reading' | 'questions' | 'report';

type EyeScores = Record<EyeMode, number>;

const emptyEyeScores = (): EyeScores => ({ left: 0, right: 0, both: 0 });

export const EyeAssessment: React.FC = () => {
  const { t, apiUrl, language } = useThemeLanguage();
  const { token } = useAuth();
  const isTamil = language === 'ta';

  const [phase, setPhase] = useState<Phase>('pretest');
  const [isInstructionsOpen, setIsInstructionsOpen] = useState<boolean>(false);

  // Phase 1: Colour test (10 stages, 10s each)
  const [colorStage, setColorStage] = useState<number>(1);
  const [colorScore, setColorScore] = useState<number>(0);
  const [colorStagesPassed, setColorStagesPassed] = useState<number>(0);

  // Phase 2: Reading test — left, right and both, 5 stages each
  const [activeMode, setActiveMode] = useState<EyeMode>('left');
  const [readingStage, setReadingStage] = useState<number>(0);
  const [eyeScores, setEyeScores] = useState<EyeScores>(emptyEyeScores);

  // Phase 3: Questionnaire
  const [screenTime, setScreenTime] = useState<ScreenTimeOption | null>(null);
  const [answers, setAnswers] = useState<YesNoAnswers>(emptyYesNoAnswers);

  // Report & API
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [report, setReport] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const displayReport = useMemo(() => localizeReport(report, language), [report, language]);

  const handleColorStageComplete = (correct: boolean) => {
    if (correct) {
      setColorScore((prev) => prev + 10);
      setColorStagesPassed((prev) => prev + 1);
    }

    if (colorStage < COLOR_STAGE_COUNT) {
      setColorStage((prev) => prev + 1);
    } else {
      setPhase('readingSelect');
    }
  };

  const handleReadingAnswer = (canRead: boolean) => {
    const mode = activeMode;
    if (canRead) {
      setEyeScores((prev) => ({ ...prev, [mode]: prev[mode] + 1 }));
    }

    if (readingStage < READING_STAGE_COUNT - 1) {
      setReadingStage((prev) => prev + 1);
      return;
    }

    // Finished the current eye test — advance to the next one, or the questionnaire
    const nextModeIndex = EYE_MODE_ORDER.indexOf(mode) + 1;
    if (nextModeIndex < EYE_MODE_ORDER.length) {
      setActiveMode(EYE_MODE_ORDER[nextModeIndex]);
      setReadingStage(0);
    } else {
      setPhase('questions');
    }
  };

  const startMode = (mode: EyeMode) => {
    setActiveMode(mode);
    setReadingStage(0);
    setPhase('reading');
  };

  const handleAnswerChange = (key: YesNoKey, value: boolean) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const totalAcuityScore = eyeScores.left + eyeScores.right + eyeScores.both;

  const submitEyeAssessment = async () => {
    setIsAnalyzing(true);
    setErrorMsg(null);

    try {
      const symptomCount = [
        answers.phoneAtNight,
        answers.eyeIrritation,
        answers.wateryEyes,
        answers.headache,
        answers.blurryVision,
      ].filter((v) => v === true).length;

      const payload = {
        colorStagesPassed,
        colorPoints: colorScore,
        acuityScore: totalAcuityScore,
        dryEyes: answers.eyeIrritation === true || answers.wateryEyes === true,
        havePower: false,
        powerType: 'none',
        screenTime,
        usingPhoneAtNight: answers.phoneAtNight === true,
        eyeIrritationDuringTest: answers.eyeIrritation === true,
        wateryEyesDuringTest: answers.wateryEyes === true,
        headacheAfterScreenUse: answers.headache === true,
        blurryVisionAfterProlongedUse: answers.blurryVision === true,
        symptomCount,
        leftEyeScore: eyeScores.left,
        rightEyeScore: eyeScores.right,
        bothEyesScore: eyeScores.both,
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
    setPhase('pretest');
    setIsInstructionsOpen(false);
    setColorStage(1);
    setColorScore(0);
    setColorStagesPassed(0);
    setActiveMode('left');
    setReadingStage(0);
    setEyeScores(emptyEyeScores());
    setScreenTime(null);
    setAnswers(emptyYesNoAnswers());
    setReport(null);
    setErrorMsg(null);
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

      {/* STEP 0: SAMPLE / PRE-TEST PAGE */}
      {phase === 'pretest' && <EyePreTest onStartTest={() => setIsInstructionsOpen(true)} />}

      {/* STEP 1: COLOUR TEST (10 stages x 10s) */}
      {phase === 'color' && (
        <ColorTest
          stage={colorStage}
          onStageComplete={handleColorStageComplete}
          onSkipAll={() => setPhase('readingSelect')}
        />
      )}

      {/* STEP 2A: EYE MODE SELECTION */}
      {phase === 'readingSelect' && (
        <EyeModeSelect
          scores={eyeScores}
          onSelect={startMode}
          onBack={() => setPhase('color')}
        />
      )}

      {/* STEP 2B: READING TEST FOR THE ACTIVE EYE MODE */}
      {phase === 'reading' && (
        <ReadingTest
          mode={activeMode}
          stageIndex={readingStage}
          correctCount={eyeScores[activeMode]}
          onAnswer={handleReadingAnswer}
          onQuit={() => {
            const nextModeIndex = EYE_MODE_ORDER.indexOf(activeMode) + 1;
            if (nextModeIndex < EYE_MODE_ORDER.length) {
              setActiveMode(EYE_MODE_ORDER[nextModeIndex]);
              setReadingStage(0);
            } else {
              setPhase('questions');
            }
          }}
        />
      )}

      {/* STEP 3: SYMPTOM QUESTIONNAIRE */}
      {phase === 'questions' && (
        <EyeSymptomForm
          screenTime={screenTime}
          onScreenTimeChange={setScreenTime}
          answers={answers}
          onAnswerChange={handleAnswerChange}
          colorPassed={colorStagesPassed}
          leftScore={eyeScores.left}
          rightScore={eyeScores.right}
          bothScore={eyeScores.both}
          isSubmitting={isAnalyzing}
          onSubmit={submitEyeAssessment}
          onBack={() => {
            setActiveMode('both');
            setReadingStage(0);
            setPhase('reading');
          }}
        />
      )}

      {/* STEP 4: AI REPORT */}
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
                <p className="text-xs text-zinc-700 dark:text-zinc-300 mt-1">{t.eyeReportEval}</p>
              </div>

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
                    ? isTamil
                      ? 'சிறந்தது'
                      : 'Optimal'
                    : displayReport.overallScore >= 60
                    ? isTamil
                      ? 'சீரானது'
                      : 'Standard'
                    : isTamil
                    ? 'கண் சோர்வு'
                    : 'Mild Strain'}
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
                  {displayReport.grade} ({displayReport.acuityScore}/{READING_STAGE_COUNT * EYE_MODE_ORDER.length}{' '}
                  {isTamil ? 'சொற்கள்' : 'words'})
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
                type="button"
                onClick={resetEyeTest}
                className="w-full sm:w-auto min-h-[44px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer touch-manipulation active:scale-[0.98]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t.retakeTest}</span>
              </button>

              <button
                type="button"
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

      {/* PRE-INSTRUCTIONS MODAL — opened from the pre-test page, OK opens colour test */}
      <PreInstructionsModal
        isOpen={isInstructionsOpen}
        onClose={() => setIsInstructionsOpen(false)}
        onStart={() => {
          setIsInstructionsOpen(false);
          setColorStage(1);
          setPhase('color');
        }}
      />
    </div>
  );
};
