import React from 'react';
import { 
  HelpCircle, 
  Lightbulb, 
  AlertCircle, 
  Sparkles, 
  ChevronDown, 
  ChevronUp
} from 'lucide-react';
import type { GuidanceItem, DPIAFormData } from '../types/dpia';
import type { OnboardingPayload } from '../types/onboarding';
import { getDynamicGuidance } from '../utils/dynamicGuidance';

interface HelpDrawerProps {
  guidance: GuidanceItem;
  formData?: DPIAFormData;
  onboardingPayload?: OnboardingPayload | null;
}

export const HelpDrawer: React.FC<HelpDrawerProps> = ({
  guidance,
  formData,
  onboardingPayload,
}) => {
  const [isOpen, setIsOpen] = React.useState(true);

  // Compute dynamic context-aware guidance if formData/payload provided
  const dynamic = getDynamicGuidance(guidance.questionKey, formData, onboardingPayload);

  const whyThisExists = dynamic.whyThisExists || guidance.whyThisExists;
  const plainEnglish = dynamic.plainEnglishExplanation || guidance.plainEnglishExplanation;
  const realWorldExample = dynamic.realWorldExample || guidance.realWorldExample;
  const pitfalls = dynamic.commonPitfalls.length ? dynamic.commonPitfalls : guidance.commonPitfalls;

  return (
    <div className="bg-slate-800/80 border border-blue-500/20 rounded-xl p-4 shadow-lg backdrop-blur-sm">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left focus:outline-none"
        id={`help-toggle-${guidance.questionKey}`}
      >
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-blue-300 uppercase tracking-wider">
              Guided Helper & Dynamic Examples
            </h4>
            <p className="text-[11px] text-slate-400">
              Contextual guidance tailored to your project
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-blue-400">
          <span>{isOpen ? 'Hide Guidance' : 'Help Me Answer This'}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="mt-3.5 pt-3 border-t border-slate-700/60 space-y-3.5 text-xs text-slate-300 animate-in fade-in duration-200">
          <div className="bg-blue-950/40 p-3 rounded-lg border border-blue-500/20">
            <div className="flex items-center space-x-1.5 font-bold text-blue-300 mb-1">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>Why does this step exist?</span>
            </div>
            <p className="leading-relaxed text-slate-300">{whyThisExists}</p>
          </div>

          <div>
            <span className="font-semibold text-slate-200 block mb-1">
              Plain-English Explanation:
            </span>
            <p className="text-slate-300 leading-relaxed">
              {plainEnglish}
            </p>
          </div>

          <div className="bg-emerald-950/30 p-3 rounded-lg border border-emerald-500/20">
            <div className="flex items-center space-x-1.5 font-bold text-emerald-300 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Project-Tailored Real-World Example:</span>
            </div>
            <p className="italic text-emerald-200 leading-relaxed">
              {realWorldExample}
            </p>
          </div>

          {pitfalls.length > 0 && (
            <div className="bg-amber-950/20 p-3 rounded-lg border border-amber-500/20">
              <div className="flex items-center space-x-1.5 font-bold text-amber-300 mb-1">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>Common Pitfalls to Avoid:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                {pitfalls.map((pitfall, idx) => (
                  <li key={idx}>{pitfall}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
