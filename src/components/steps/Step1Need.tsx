import React from 'react';
import type { Step1Need as Step1NeedData, DPIAFormData } from '../../types/dpia';
import type { OnboardingPayload } from '../../types/onboarding';
import { guidanceDictionary } from '../../data/guidanceData';
import { HelpDrawer } from '../HelpDrawer';
import { PitfallWarningBanner } from '../PitfallWarningBanner';
import { TextareaWithSuggestions } from '../InputWithSuggestions';
import { checkStep1Pitfalls, type PitfallViolation } from '../../utils/pitfallChecker';

import { getFrameworkTitles } from '../../utils/frameworkTitles';
import { generateProjectNameSuggestion } from '../../utils/exportFilename';
import { Search, CheckSquare, Square, AlertCircle, Sparkles } from 'lucide-react';

const OVERVIEW_SUGGESTIONS = [
  'Launch of an interactive AI Customer Support Assistant powered by an Enterprise LLM API to automatically handle tier-1 customer inquiries, track shipment status, and initiate return requests 24/7.',
  'Launch of a secure web-based billing portal allowing 45,000 residential utility customers to view monthly electricity statements, update payment methods, and make online payments.',
  'Implementation of a cloud-based Electronic Health Record (EHR) data analytics pipeline for patient lab results.',
];

interface Step1NeedProps {
  data: Step1NeedData;
  onChange: (updated: Step1NeedData) => void;
  onNext: () => void;
  onPrev: () => void;
  formData?: DPIAFormData;
  onboardingPayload?: OnboardingPayload | null;
}

const COMMON_TRIGGERS = [
  'Use of new technology (Generative AI, LLMs, Machine Learning)',
  'Automated decision-making with legal or significant effects',
  'Large-scale processing of personal data',
  'Processing special category data (health, biometric, financial)',
  'Systematic monitoring or tracking of public spaces/users',
  'Combining or matching data sets from multiple sources',
  'Data processing involving vulnerable individuals or children',
  'Cloud migration of legacy databases to 3rd-party vendors',
];

export const Step1NeedView: React.FC<Step1NeedProps> = ({
  data,
  onChange,
  onNext,
  onPrev,
  formData,
  onboardingPayload,
}) => {
  const guidance = guidanceDictionary.step1Need;
  const [attemptedNext, setAttemptedNext] = React.useState(false);
  const [pitfallViolations, setPitfallViolations] = React.useState<PitfallViolation[]>([]);
  const [pitfallsDismissed, setPitfallsDismissed] = React.useState(false);

  React.useEffect(() => {
    if (!data.projectName && onboardingPayload?.projectTitle && onboardingPayload.projectTitle.trim()) {
      onChange({ ...data, projectName: onboardingPayload.projectTitle.trim() });
    }
  }, [onboardingPayload?.projectTitle]);

  const handleSuggestProjectName = () => {
    const suggested = generateProjectNameSuggestion(data.projectOverview, onboardingPayload?.projectTitle);
    onChange({ ...data, projectName: suggested });
  };

  const isOverviewEmpty = !data.projectOverview.trim();

  const handleNextClick = () => {
    setAttemptedNext(true);
    if (isOverviewEmpty) return;

    // Run pitfall check
    if (!pitfallsDismissed) {
      const violations = checkStep1Pitfalls(data.projectOverview, data.triggerReasons);
      if (violations.length > 0) {
        setPitfallViolations(violations);
        return;
      }
    }

    // Auto-fill project name if still empty before proceeding
    let updatedData = { ...data };
    if (!data.projectName || !data.projectName.trim()) {
      const autoName = generateProjectNameSuggestion(data.projectOverview, onboardingPayload?.projectTitle);
      updatedData = { ...data, projectName: autoName };
      onChange(updatedData);
    }

    setPitfallViolations([]);
    onNext();
  };

  // Clear pitfall warnings when user edits their text
  React.useEffect(() => {
    if (pitfallViolations.length > 0) {
      setPitfallViolations([]);
      setPitfallsDismissed(false);
    }
  }, [data.projectOverview, data.triggerReasons.length]);

  const toggleTrigger = (trigger: string) => {
    const exists = data.triggerReasons.includes(trigger);
    const updated = exists
      ? data.triggerReasons.filter((t) => t !== trigger)
      : [...data.triggerReasons, trigger];
    onChange({ ...data, triggerReasons: updated });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold font-heading text-white flex items-center gap-2">
          <Search className="w-6 h-6 text-blue-400" />
          {getFrameworkTitles(onboardingPayload?.determinedAssessmentType).step1Header}
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Explain broadly what the project aims to achieve and why a formal privacy risk assessment is being conducted.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel rounded-xl p-5 space-y-5 border border-slate-800">
            {/* 1.1 Project / System Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>1.1 Project / System Name *</span>
                <button
                  type="button"
                  onClick={handleSuggestProjectName}
                  className="text-[11px] font-semibold text-blue-300 hover:text-white bg-blue-950/60 hover:bg-blue-900/80 px-2 py-0.5 rounded border border-blue-500/40 transition flex items-center gap-1"
                  title="Use AI to extract or suggest a concise project title from overview text"
                >
                  <Sparkles className="w-3 h-3 text-blue-400" />
                  <span>✨ Auto-Suggest Name</span>
                </button>
              </label>
              <input
                type="text"
                id="step1-project-name-input"
                value={data.projectName || ''}
                onChange={(e) => onChange({ ...data, projectName: e.target.value })}
                placeholder="e.g. Patient Lab Inquiry Web Portal"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                This project name displays in the top header bar and formats official export filenames (e.g. <span className="font-mono text-slate-300">{new Date().toISOString().slice(0, 10).replace(/-/g, '')} - {onboardingPayload?.determinedAssessmentType || 'DPIA'} - {data.projectName || 'Patient Lab Inquiry Web Portal'}.pdf</span>).
              </p>
            </div>

            {/* 1.2 Project Overview */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>1.2 Project Overview & Business Aims *</span>
                {attemptedNext && isOverviewEmpty && (
                  <span className="text-xs font-semibold text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Required Field
                  </span>
                )}
              </label>
              <TextareaWithSuggestions
                id="step1-overview-textarea"
                rows={5}
                value={data.projectOverview}
                onChangeValue={(val) => onChange({ ...data, projectOverview: val })}
                suggestions={OVERVIEW_SUGGESTIONS}
                placeholder="Explain what project aims to achieve, what problem it solves, and what system is being introduced..."
                className={`w-full bg-slate-950 border rounded-lg p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 leading-relaxed ${
                  attemptedNext && isOverviewEmpty
                    ? 'border-red-500 bg-red-950/20 ring-2 ring-red-500/40'
                    : 'border-slate-700 focus:ring-blue-500'
                }`}
              />
              {attemptedNext && isOverviewEmpty && (
                <p className="text-xs font-medium text-red-400 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  Please fill out the Project Overview section before continuing.
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
                {getFrameworkTitles(onboardingPayload?.determinedAssessmentType).step1TriggerLabel}
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {COMMON_TRIGGERS.map((trigger, idx) => {
                  const isChecked = data.triggerReasons.includes(trigger);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleTrigger(trigger)}
                      className={`text-left p-3 rounded-lg border text-xs font-medium flex items-start space-x-2.5 transition ${
                        isChecked
                          ? 'bg-blue-600/20 border-blue-500 text-blue-200'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                      }`}
                      id={`trigger-btn-${idx}`}
                    >
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                      )}
                      <span>{trigger}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <PitfallWarningBanner violations={pitfallViolations} />

          <div className="flex justify-between pt-2">
            <button
              onClick={onPrev}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm rounded-xl transition border border-slate-700"
              id="step1-prev-btn"
            >
              ← Back to Controller Details
            </button>
            <button
              onClick={handleNextClick}
              className={`px-6 py-2.5 font-semibold text-sm rounded-xl transition shadow-lg flex items-center gap-1.5 ${
                attemptedNext && isOverviewEmpty
                  ? 'bg-amber-600 hover:bg-amber-500 text-white ring-2 ring-amber-400'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
              }`}
              id="step1-next-btn"
            >
              <span>Continue to Step 2: Describe Processing →</span>
            </button>
          </div>
        </div>

        {/* Right Column: Guided Helper & Examples */}
        <div className="lg:col-span-5 lg:sticky lg:top-20">
          <HelpDrawer guidance={guidance} formData={formData} onboardingPayload={onboardingPayload} />
        </div>
      </div>
    </div>
  );
};
