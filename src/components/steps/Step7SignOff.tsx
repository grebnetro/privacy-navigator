import React from 'react';
import type { Step7SignOff as Step7SignOffData } from '../../types/dpia';
import { guidanceDictionary } from '../../data/guidanceData';
import { HelpDrawer } from '../HelpDrawer';
import { InputWithSuggestions } from '../InputWithSuggestions';
import { AIRewordTextarea } from '../AIRewordTextarea';
import { FileSignature, ShieldCheck, UserCheck, Calendar, AlertCircle } from 'lucide-react';

const APPROVED_BY_SUGGESTIONS = [
  'Jane Doe, Executive Director, Privacy Officer',
];

const RESIDUAL_SUGGESTIONS = [
  'Jane Doe, Executive Director, Privacy Officer',
];

const REVIEW_KEEPER_SUGGESTIONS = [
  'Jane Doe, Executive Director, Privacy Officer',
];

interface Step7SignOffProps {
  data: Step7SignOffData;
  onChange: (updated: Step7SignOffData) => void;
  onPrev: () => void;
  onOpenPreview: () => void;
}

export const Step7SignOffView: React.FC<Step7SignOffProps> = ({
  data,
  onChange,
  onPrev,
  onOpenPreview,
}) => {
  const guidance = guidanceDictionary.step7SignOff;
  const [attemptedFinish, setAttemptedFinish] = React.useState(false);

  const isMeasuresEmpty = !data.measuresApprovedBy.trim();
  const isOverruledEmpty = data.dpoAdviceAccepted === 'Overruled' && !data.dpoOverruledReason.trim();
  const isInvalid = isMeasuresEmpty || isOverruledEmpty;

  const handleFinishClick = () => {
    setAttemptedFinish(true);
    if (!isInvalid) {
      onOpenPreview();
    }
  };



  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold font-heading text-white flex items-center gap-2">
          <FileSignature className="w-6 h-6 text-indigo-400" />
          Step 7: Sign Off and Record Outcomes
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Final approval sign-offs, DPO advice summary, departure rationale, and ongoing review owner.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Input Fields */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel rounded-xl p-5 space-y-5 border border-slate-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                    Measures Approved By *
                  </span>
                  {attemptedFinish && isMeasuresEmpty && (
                    <span className="text-xs text-red-400 font-semibold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Required
                    </span>
                  )}
                </label>
                <InputWithSuggestions
                  id="measures-approved-by-input"
                  value={data.measuresApprovedBy}
                  onChangeValue={(val) => onChange({ ...data, measuresApprovedBy: val })}
                  suggestions={APPROVED_BY_SUGGESTIONS}
                  placeholder="e.g. Jane Doe, Executive Director, Privacy Officer (2026-08-15)"
                  className={`w-full bg-slate-950 border rounded-lg px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 ${
                    attemptedFinish && isMeasuresEmpty
                      ? 'border-red-500 bg-red-950/20 ring-2 ring-red-500/40'
                      : 'border-slate-700 focus:ring-indigo-500'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                  Residual Risks Approved By (Name / Position / Date)
                </label>
                <InputWithSuggestions
                  id="residual-approved-by-input"
                  value={data.residualRisksApprovedBy}
                  onChangeValue={(val) => onChange({ ...data, residualRisksApprovedBy: val })}
                  suggestions={RESIDUAL_SUGGESTIONS}
                  placeholder="e.g. Jane Doe, Executive Director, Privacy Officer"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  DPO Advice & Compliance Status
                </span>
                <label className="flex items-center gap-2 text-xs font-medium text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.dpoAdviceProvided}
                    onChange={(e) => onChange({ ...data, dpoAdviceProvided: e.target.checked })}
                    className="rounded border-slate-700 bg-slate-950 text-indigo-500 focus:ring-indigo-500"
                    id="dpo-advice-provided-chk"
                  />
                  <span>DPO Advice Has Been Provided</span>
                </label>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                  Summary of DPO Advice
                </label>
                <AIRewordTextarea
                  rows={3}
                  value={data.dpoAdviceSummary}
                  onValueChange={(val) => onChange({ ...data, dpoAdviceSummary: val })}
                  promptContext="DPO Advice Summary"
                  placeholder="Summary of DPO compliance recommendations and guidance..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  id="dpo-advice-summary"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                    DPO Advice Status
                  </label>
                  <select
                    value={data.dpoAdviceAccepted}
                    onChange={(e) => onChange({ ...data, dpoAdviceAccepted: e.target.value as 'Accepted' | 'Overruled' })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:ring-2 focus:ring-indigo-500"
                    id="dpo-status-select"
                  >
                    <option value="Accepted">Accepted in Full</option>
                    <option value="Overruled">Overruled</option>
                  </select>
                </div>

                {data.dpoAdviceAccepted === 'Overruled' && (
                  <div>
                    <label className="block text-[11px] font-semibold text-red-400 uppercase mb-1 flex items-center justify-between">
                      <span>Reason DPO Advice Was Overruled *</span>
                      {attemptedFinish && isOverruledEmpty && (
                        <span className="text-xs text-red-400 font-semibold">Required</span>
                      )}
                    </label>
                    <input
                      type="text"
                      value={data.dpoOverruledReason}
                      onChange={(e) => onChange({ ...data, dpoOverruledReason: e.target.value })}
                      placeholder="You must explain why DPO advice was departed from..."
                      className={`w-full bg-slate-950 border rounded-lg p-2 text-xs text-slate-100 focus:ring-2 ${
                        attemptedFinish && isOverruledEmpty
                          ? 'border-red-500 bg-red-950/20 ring-2 ring-red-500'
                          : 'border-red-500/50 focus:ring-red-500'
                      }`}
                      id="dpo-overruled-reason"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Consultation Responses Reviewed By
                </label>
                <input
                  type="text"
                  value={data.consultationReviewedBy}
                  onChange={(e) => onChange({ ...data, consultationReviewedBy: e.target.value })}
                  placeholder="e.g. Steering Committee / Legal Lead"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-slate-100 focus:ring-2 focus:ring-indigo-500"
                  id="consultation-reviewed-by-input"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-blue-400" />
                  Ongoing Review Schedule & Review Owner
                </label>
                <InputWithSuggestions
                  id="review-keeper-input"
                  value={data.reviewKeeper}
                  onChangeValue={(val) => onChange({ ...data, reviewKeeper: val })}
                  suggestions={REVIEW_KEEPER_SUGGESTIONS}
                  placeholder="e.g. Jane Doe, Executive Director, Privacy Officer (Annual Review)"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-slate-100 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-2">
            <button
              onClick={onPrev}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm rounded-xl transition border border-slate-700"
              id="step7-prev-btn"
            >
              ← Back to Step 6
            </button>
            <button
              onClick={handleFinishClick}
              className={`px-6 py-2.5 font-bold text-sm rounded-xl transition shadow-lg flex items-center gap-2 ${
                attemptedFinish && isInvalid
                  ? 'bg-amber-600 hover:bg-amber-500 text-white ring-2 ring-amber-400'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-emerald-600/30'
              }`}
              id="step7-finish-btn"
            >
              <span>🎉 View Final Document Preview</span>
            </button>
          </div>
        </div>

        {/* Right Column: Guided Helper & Examples */}
        <div className="lg:col-span-5 lg:sticky lg:top-20">
          <HelpDrawer guidance={guidance} />
        </div>
      </div>
    </div>
  );
};
