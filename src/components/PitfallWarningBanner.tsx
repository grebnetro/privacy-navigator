import React from 'react';
import { AlertTriangle, ArrowRight, ShieldAlert } from 'lucide-react';
import type { PitfallViolation } from '../utils/pitfallChecker';

interface PitfallWarningBannerProps {
  violations: PitfallViolation[];
  onDismiss?: () => void;
}

export const PitfallWarningBanner: React.FC<PitfallWarningBannerProps> = ({
  violations,
}) => {
  if (violations.length === 0) return null;

  return (
    <div className="bg-amber-950/50 border-2 border-amber-500/70 rounded-xl p-4 space-y-3 animate-in fade-in slide-in-from-top duration-300 shadow-xl shadow-amber-950/40">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-amber-500/20 rounded-lg text-amber-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-amber-300 flex items-center gap-1.5">
              <span>Action Required: Common Pitfall{violations.length > 1 ? 's' : ''} Detected</span>
            </h4>
            <p className="text-[11px] text-amber-300/80">
              Advancing is paused until the following pitfall{violations.length > 1 ? 's are' : ' is'} addressed in your answer.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2.5">
        {violations.map((v) => (
          <div
            key={v.id}
            className="bg-amber-900/40 border border-amber-600/40 rounded-lg p-3 space-y-1.5"
          >
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-amber-200">
                  {v.fieldLabel}: <span className="font-medium text-amber-300">{v.pitfallDescription}</span>
                </p>
                <div className="flex items-start gap-1.5 text-xs text-amber-200/90 bg-slate-950/40 p-2 rounded border border-amber-500/20">
                  <ArrowRight className="w-3.5 h-3.5 mt-0.5 shrink-0 text-emerald-400" />
                  <p><strong className="text-emerald-300">How to Fix:</strong> {v.suggestion}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-1 border-t border-amber-700/40">
        <p className="text-[11px] font-medium text-amber-400 italic">
          💡 Edit your response in the form above to address the suggestion{violations.length > 1 ? 's' : ''}. Once updated, click Continue to proceed.
        </p>
      </div>
    </div>
  );
};
