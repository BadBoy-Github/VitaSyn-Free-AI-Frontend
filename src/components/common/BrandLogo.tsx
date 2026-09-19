import React from 'react';
import { ExternalLink } from 'lucide-react';

interface BrandLogoProps {
  showCompanyLink?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ showCompanyLink = true, size = 'md' }) => {
  const imgSize = size === 'sm' ? 'w-7 h-7' : size === 'lg' ? 'w-11 h-11' : 'w-9 h-9';
  const textClass = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl';

  return (
    <div className="flex items-center gap-2.5">
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-400 to-lime-600 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
        <div className="relative p-1 bg-white dark:bg-zinc-900 border border-amber-400/30 dark:border-lime-500/20 rounded-xl shadow-xs overflow-hidden flex items-center justify-center">
          <img
            src="/logo.png"
            alt="VitaSyn Logo"
            className={`${imgSize} object-contain rounded-lg transition-transform duration-300 group-hover:scale-105`}
          />
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          {/* Exact styling from attached reference image: "Vita" in primary font, "Syn" in purple */}
          <span className={`font-bold tracking-tight text-zinc-900 dark:text-zinc-50 ${textClass}`}>
            Vita<span className="text-[#9333ea] dark:text-[#a855f7]">Syn</span>
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-amber-400/20 text-amber-600 dark:text-amber-300 border border-amber-400/40">
            Free AI
          </span>
        </div>

        {showCompanyLink && (
          <a
            href="https://vitasyn.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[11px] text-zinc-700 dark:text-zinc-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors mt-0.5"
            title="VitaSyn Pvt Ltd"
          >
            <span>VitaSyn Pvt Ltd</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-60" />
          </a>
        )}
      </div>
    </div>
  );
};
