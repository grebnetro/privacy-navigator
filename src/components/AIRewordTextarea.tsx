import React, { useState } from 'react';
import { rewordText } from '../services/aiRewriter';
import type { RewordTone } from '../services/aiRewriter';
import { Sparkles, Wand2, Check, X, ShieldCheck, FileText, Cpu } from 'lucide-react';

interface AIRewordTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string;
  onValueChange: (newValue: string) => void;
  promptContext?: string;
  containerClassName?: string;
}

export const AIRewordTextarea: React.FC<AIRewordTextareaProps> = ({
  value,
  onValueChange,
  promptContext,
  containerClassName = '',
  className = '',
  ...props
}) => {
  const [isRewording, setIsRewording] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [rewordedResult, setRewordedResult] = useState('');
  const [currentTone, setCurrentTone] = useState<RewordTone>('formal');

  const canReword = value.trim().length >= 5;

  const handleTriggerReword = async (tone: RewordTone = currentTone) => {
    if (!canReword) return;
    setIsRewording(true);
    setCurrentTone(tone);
    try {
      const polished = await rewordText(value, tone, promptContext);
      setRewordedResult(polished);
      setShowPreview(true);
    } catch (err) {
      console.error('AI Reword failed:', err);
    } finally {
      setIsRewording(false);
    }
  };

  const handleApplyReword = () => {
    if (rewordedResult) {
      onValueChange(rewordedResult);
      setShowPreview(false);
    }
  };

  return (
    <div className={`relative flex flex-col space-y-2 ${containerClassName}`}>
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          className={className}
          {...props}
        />

        {/* Floating AI Reword Action Button */}
        {canReword && !showPreview && (
          <button
            type="button"
            onClick={() => handleTriggerReword(currentTone)}
            disabled={isRewording}
            className="absolute right-3 bottom-3 px-3 py-1.5 bg-slate-900/90 hover:bg-slate-800 text-blue-300 hover:text-white border border-blue-500/40 hover:border-blue-400 rounded-xl text-xs font-semibold shadow-lg backdrop-blur-md transition-all duration-200 flex items-center gap-1.5 group z-10"
            title="Reword and polish draft with AI compliance language"
          >
            {isRewording ? (
              <>
                <Wand2 className="w-3.5 h-3.5 text-blue-400 animate-spin" />
                <span>Polishing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition" />
                <span>✨ AI Reword</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* AI Reworded Preview & Tone Selector Panel */}
      {showPreview && (
        <div className="p-4 bg-slate-900/95 border border-blue-500/50 rounded-xl shadow-2xl space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">
                AI Audit-Ready Reword Preview
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowPreview(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tone Selector Pills */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400">Tone:</span>
            {[
              { id: 'formal' as RewordTone, label: '🏛️ Formal Audit', icon: FileText },
              { id: 'technical' as RewordTone, label: '🛡️ Technical Controls', icon: ShieldCheck },
              { id: 'concise' as RewordTone, label: '📋 Concise', icon: Cpu },
            ].map((toneOpt) => {
              const isSelected = currentTone === toneOpt.id;
              return (
                <button
                  key={toneOpt.id}
                  type="button"
                  onClick={() => handleTriggerReword(toneOpt.id)}
                  disabled={isRewording}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition border flex items-center gap-1 ${
                    isSelected
                      ? 'bg-blue-600/30 border-blue-400 text-blue-200 shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <span>{toneOpt.label}</span>
                </button>
              );
            })}
          </div>

          {/* Result Text Display */}
          <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 text-xs text-slate-100 leading-relaxed font-mono space-y-2">
            <div>{rewordedResult}</div>

            {/* AI Audit Enhancement Notice */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-sans text-emerald-400">
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>AI Audit Guard: Added sub-processor (AWS DPA) & retention purge safeguards to pass pitfall checks.</span>
              </span>
            </div>
          </div>

          {/* Quick Customization Pills */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] font-semibold text-slate-400">Quick Add:</span>
            {(() => {
              const volumeMatch = value.match(/\b(\d{1,3}(?:,\d{3})+|\d+)\s*(patients|customers|users|employees|individuals|records|subjects|clients)?/i);
              const userNum = volumeMatch ? volumeMatch[0] : null;
              const formattedUserNum = userNum ? (/\b(patients|customers|users|employees|individuals|records|subjects|clients)\b/i.test(userNum) ? userNum : `${userNum} records`) : null;
              return (
                <>
                  {userNum && formattedUserNum && !rewordedResult.toLowerCase().includes(userNum.toLowerCase()) && (
                    <button
                      type="button"
                      onClick={() => setRewordedResult((prev) => `${prev} Processing covers approximately ${formattedUserNum}.`)}
                      className="px-2 py-0.5 bg-amber-950/40 border border-amber-500/50 hover:border-amber-400 rounded text-[10px] text-amber-200 font-semibold transition"
                    >
                      + 👥 Include Your {userNum}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setRewordedResult((prev) => `${prev} Hosted on AWS cloud sub-processors under signed DPAs.`)}
                    className="px-2 py-0.5 bg-slate-950 border border-slate-700 hover:border-blue-400 rounded text-[10px] text-slate-300 transition"
                  >
                    + ☁️ AWS Cloud DPA
                  </button>
                  <button
                    type="button"
                    onClick={() => setRewordedResult((prev) => `${prev} Programmatically purged after a 3-year retention schedule.`)}
                    className="px-2 py-0.5 bg-slate-950 border border-slate-700 hover:border-blue-400 rounded text-[10px] text-slate-300 transition"
                  >
                    + 🗓️ 3-Year Retention Purge
                  </button>
                </>
              );
            })()}
          </div>

          <div className="flex justify-end items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowPreview(false)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition"
            >
              Keep Original
            </button>
            <button
              type="button"
              onClick={handleApplyReword}
              className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-lg transition shadow-md shadow-blue-600/30 flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply AI Polish</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
