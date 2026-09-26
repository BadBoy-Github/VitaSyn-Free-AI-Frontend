export type EyeMode = 'left' | 'right' | 'both';

export const EYE_MODE_ORDER: EyeMode[] = ['left', 'right', 'both'];

export interface ReadingStage {
  /** Tailwind text-size class for this acuity tier */
  sizeClass: string;
  /** Approximate equivalent Snellen notation */
  snellen: string;
}

export const READING_STAGES: ReadingStage[] = [
  { sizeClass: 'text-4xl sm:text-5xl', snellen: '6/60' },
  { sizeClass: 'text-3xl sm:text-4xl', snellen: '6/30' },
  { sizeClass: 'text-2xl sm:text-3xl', snellen: '6/15' },
  { sizeClass: 'text-xl sm:text-2xl', snellen: '6/9' },
  { sizeClass: 'text-base sm:text-lg', snellen: '6/6' },
];

export const READING_STAGE_COUNT = READING_STAGES.length;

export const COLOR_STAGE_COUNT = 10;
export const COLOR_STAGE_SECONDS = 10;

export interface ColorStageConfig {
  h: number;
  s: number;
  l: number;
  deltaL: number;
}

const COLOR_HUES = [45, 140, 200, 280, 15, 85, 320, 175, 60, 230];
const COLOR_DELTAS = [26, 20, 15, 11, 8.5, 6.5, 4.8, 3.6, 2.7, 2.0];

export const buildColorStageConfig = (stageNum: number): ColorStageConfig => {
  const index = Math.min(Math.max(stageNum, 1), COLOR_STAGE_COUNT) - 1;
  return {
    h: COLOR_HUES[index % COLOR_HUES.length],
    s: 70,
    l: 48,
    deltaL: COLOR_DELTAS[index] ?? 2.0,
  };
};

export const SCREEN_TIME_OPTIONS = ['below1', '1to3', 'above3'] as const;
export type ScreenTimeOption = (typeof SCREEN_TIME_OPTIONS)[number];

export const YES_NO_QUESTION_KEYS = [
  'phoneAtNight',
  'eyeIrritation',
  'wateryEyes',
  'headache',
  'blurryVision',
] as const;
export type YesNoKey = (typeof YES_NO_QUESTION_KEYS)[number];

export type YesNoAnswers = Record<YesNoKey, boolean | null>;

export const emptyYesNoAnswers = (): YesNoAnswers => ({
  phoneAtNight: null,
  eyeIrritation: null,
  wateryEyes: null,
  headache: null,
  blurryVision: null,
});
