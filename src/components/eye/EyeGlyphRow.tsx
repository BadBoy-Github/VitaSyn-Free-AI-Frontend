import React from 'react';

interface EyeGlyphProps {
  isOpen: boolean;
  /** Visual size of the glyph in px (width) */
  size?: number;
}

const OPEN_CLASS = 'text-lime-500';
const CLOSED_CLASS = 'text-amber-500';

/**
 * Single animated eye glyph. Open eyes show a pulsing iris, closed eyes show a
 * shut lid with a soft pulse so the state reads at a glance.
 */
const EyeGlyph: React.FC<EyeGlyphProps> = ({ isOpen, size = 56 }) => {
  const height = Math.round(size * 0.66);

  return (
    <svg
      viewBox="0 0 120 80"
      width={size}
      height={height}
      role="img"
      aria-label={isOpen ? 'Open eye' : 'Closed eye'}
      className="shrink-0"
    >
      {/* Eye outline */}
      <path
        d="M6 40 C 26 8, 94 8, 114 40 C 94 72, 26 72, 6 40 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        className="text-zinc-400 dark:text-zinc-600"
      />

      {isOpen ? (
        <g className="eye-glow-pulse" style={{ transformOrigin: '60px 40px' }}>
          <circle cx="60" cy="40" r="19" className={OPEN_CLASS} fill="currentColor" />
          <circle cx="60" cy="40" r="9" className="fill-zinc-900" fillOpacity="0.85" />
          <circle cx="54" cy="34" r="3.5" fill="#ffffff" fillOpacity="0.9" />
        </g>
      ) : (
        <g>
          {/* Filled shut lid + lash line */}
          <path
            d="M10 40 C 30 62, 90 62, 110 40 Z"
            className={CLOSED_CLASS}
            fill="currentColor"
            fillOpacity="0.18"
          />
          <path
            d="M12 41 C 30 61, 90 61, 108 41"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            className={CLOSED_CLASS}
            style={{ animation: 'eyePulse 2.4s ease-in-out infinite' }}
          />
        </g>
      )}

      {/* Brow */}
      <path
        d="M26 12 C 42 2, 78 2, 94 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        className="text-zinc-400/70 dark:text-zinc-600/70"
      />
    </svg>
  );
};

interface EyeGlyphRowProps {
  leftOpen: boolean;
  rightOpen: boolean;
  size?: number;
}

/**
 * Side-by-side left/right eye glyphs used to preview a reading-test mode:
 * the eye under test is open, the covered eye is shut.
 */
export const EyeGlyphRow: React.FC<EyeGlyphRowProps> = ({ leftOpen, rightOpen, size = 56 }) => (
  <div className="flex items-center gap-3">
    <EyeGlyph isOpen={leftOpen} size={size} />
    <EyeGlyph isOpen={rightOpen} size={size} />
  </div>
);

export default EyeGlyphRow;
