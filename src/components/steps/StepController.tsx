import React from 'react';
import type { ControllerDetails, DPIAFormData } from '../../types/dpia';
import type { OnboardingPayload } from '../../types/onboarding';
import { guidanceDictionary } from '../../data/guidanceData';
import { HelpDrawer } from '../HelpDrawer';
import { InputWithSuggestions } from '../InputWithSuggestions';
import { getFrameworkTitles } from '../../utils/frameworkTitles';
import { Building2, UserCheck, Mail, AlertCircle } from 'lucide-react';

interface StepControllerProps {
  data: ControllerDetails;
  onChange: (updated: ControllerDetails) => void;
  onNext: () => void;
  formData?: DPIAFormData;
  onboardingPayload?: OnboardingPayload | null;
}

const CONTROLLER_SUGGESTIONS = [
  'Quest Diagnostics',
];

const DPO_TITLE_SUGGESTIONS = [
  'Executive Director, Privacy Officer',
];

const DPO_CONTACT_SUGGESTIONS = [
  'Keena Hausmann',
];

export const StepController: React.FC<StepControllerProps> = ({
  data,
  onChange,
  onNext,
  formData,
  onboardingPayload,
}) => {
  const guidance = guidanceDictionary.controllerDetails;
  const [attemptedNext, setAttemptedNext] = React.useState(false);

  const isNameEmpty = !data.controllerName.trim();

  const handleNextClick = () => {
    setAttemptedNext(true);
    if (!isNameEmpty) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold font-heading text-white flex items-center gap-2">
          <Building2 className="w-6 h-6 text-blue-400" />
          Submitting Controller Details
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Identify the legal organization responsible for this project and the appointed Data Protection Officer.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel rounded-xl p-5 space-y-4 border border-slate-800">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Name of Controller (Company / Organization) *</span>
                {attemptedNext && isNameEmpty && (
                  <span className="text-xs font-semibold text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Required Field
                  </span>
                )}
              </label>
              <InputWithSuggestions
                id="controller-name-input"
                value={data.controllerName}
                onChangeValue={(val) => onChange({ ...data, controllerName: val })}
                suggestions={CONTROLLER_SUGGESTIONS}
                placeholder="e.g. Quest Diagnostics"
                className={`w-full bg-slate-950 border rounded-lg px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 ${
                  attemptedNext && isNameEmpty
                    ? 'border-red-500 bg-red-950/20 ring-2 ring-red-500/40'
                    : 'border-slate-700 focus:ring-blue-500'
                }`}
              />
              {attemptedNext && isNameEmpty && (
                <p className="text-xs font-medium text-red-400 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  Please enter the organization name before continuing to Step 1.
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                Subject / Title of DPO (Data Protection Officer)
              </label>
              <InputWithSuggestions
                id="dpo-title-input"
                value={data.dpoTitle}
                onChangeValue={(val) => onChange({ ...data, dpoTitle: val })}
                suggestions={DPO_TITLE_SUGGESTIONS}
                placeholder="e.g. Executive Director, Privacy Officer"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                Name & Contact of Controller Contact / DPO
              </label>
              <InputWithSuggestions
                id="dpo-contact-input"
                value={data.dpoContactName}
                onChangeValue={(val) => onChange({ ...data, dpoContactName: val })}
                suggestions={DPO_CONTACT_SUGGESTIONS}
                placeholder="e.g. Keena Hausmann"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleNextClick}
              className={`px-6 py-2.5 font-semibold text-sm rounded-xl transition shadow-lg flex items-center gap-1.5 ${
                attemptedNext && isNameEmpty
                  ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30 ring-2 ring-amber-400'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
              }`}
              id="controller-next-btn"
            >
              <span>{getFrameworkTitles(onboardingPayload?.determinedAssessmentType).controllerNextButton}</span>
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
