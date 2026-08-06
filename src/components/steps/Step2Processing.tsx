import React, { useState } from 'react';
import type { Step2Processing as Step2ProcessingData, DPIAFormData } from '../../types/dpia';
import type { OnboardingPayload } from '../../types/onboarding';
import { guidanceDictionary } from '../../data/guidanceData';
import { HelpDrawer } from '../HelpDrawer';
import { PitfallWarningBanner } from '../PitfallWarningBanner';
import { AIRewordTextarea } from '../AIRewordTextarea';
import { checkStep2NaturePitfalls, checkStep2ScopePitfalls, checkStep2ContextPitfalls, checkStep2PurposePitfalls, type PitfallViolation } from '../../utils/pitfallChecker';
import { Layers, Workflow, ShieldAlert, Target, AlertCircle } from 'lucide-react';

interface Step2ProcessingProps {
  data: Step2ProcessingData;
  onChange: (updated: Step2ProcessingData) => void;
  onNext: () => void;
  onPrev: () => void;
  formData?: DPIAFormData;
  onboardingPayload?: OnboardingPayload | null;
}

const DATA_SUBJECT_PILLS = [
  { id: 'patients', label: '🏥 Patients & Healthcare Consumers', text: 'Data subjects are adult patients and healthcare consumers receiving diagnostic lab services.' },
  { id: 'customers', label: '👥 Customers & Clients', text: 'Data subjects are commercial customers and client account holders.' },
  { id: 'employees', label: '💼 Employees & Workforce Staff', text: 'Data subjects include company employees, staff, and contractors.' },
  { id: 'children', label: '👶 Children & Minors (< 18)', text: 'Data subjects include children and minors under 18 years of age (special vulnerable category).' },
  { id: 'clinicians', label: '🧑‍⚕️ Clinicians & Physicians', text: 'Data subjects include ordering physicians, healthcare providers, and clinical staff.' },
  { id: 'job_applicants', label: '🧑‍💼 Job Applicants', text: 'Data subjects include job applicants and recruitment candidates.' },
  { id: 'general_public', label: '🌐 General Public', text: 'Data subjects include general public web portal visitors.' },
];

export const Step2ProcessingView: React.FC<Step2ProcessingProps> = ({
  data,
  onChange,
  onNext,
  onPrev,
  formData,
  onboardingPayload,
}) => {
  const [activeTab, setActiveTab] = useState<'nature' | 'scope' | 'context' | 'purpose'>('nature');
  const [attemptedNext, setAttemptedNext] = useState(false);
  const [pitfallViolations, setPitfallViolations] = useState<PitfallViolation[]>([]);
  const [pitfallsDismissed, setPitfallsDismissed] = useState(false);

  const isNatureEmpty = !data.nature.trim();
  const isScopeEmpty = !data.scope.trim();
  const isContextEmpty = !data.context.trim();
  const isPurposeEmpty = !data.purpose.trim();

  const isStepValid = !isNatureEmpty && !isScopeEmpty && !isContextEmpty && !isPurposeEmpty;

  const handleNextClick = () => {
    setAttemptedNext(true);

    if (isNatureEmpty) { setActiveTab('nature'); return; }
    if (isScopeEmpty) { setActiveTab('scope'); return; }
    if (isContextEmpty) { setActiveTab('context'); return; }
    if (isPurposeEmpty) { setActiveTab('purpose'); return; }

    // Run pitfall checks across all four sub-sections
    if (!pitfallsDismissed) {
      const allViolations = [
        ...checkStep2NaturePitfalls(data.nature),
        ...checkStep2ScopePitfalls(data.scope),
        ...checkStep2ContextPitfalls(data.context),
        ...checkStep2PurposePitfalls(data.purpose),
      ];
      if (allViolations.length > 0) {
        setPitfallViolations(allViolations);
        // Navigate to the first offending tab
        const firstField = allViolations[0].fieldLabel;
        if (firstField.includes('Nature')) setActiveTab('nature');
        else if (firstField.includes('Scope')) setActiveTab('scope');
        else if (firstField.includes('Context') || firstField.includes('Subject')) setActiveTab('context');
        else if (firstField.includes('Purpose')) setActiveTab('purpose');
        return;
      }
    }

    setPitfallViolations([]);
    onNext();
  };

  // Clear pitfall warnings when user edits text
  React.useEffect(() => {
    if (pitfallViolations.length > 0) {
      setPitfallViolations([]);
      setPitfallsDismissed(false);
    }
  }, [data.nature, data.scope, data.context, data.purpose]);

  const getGuidance = () => {
    switch (activeTab) {
      case 'nature':
        return guidanceDictionary.step2Nature;
      case 'scope':
        return guidanceDictionary.step2Scope;
      case 'context':
        return guidanceDictionary.step2Context;
      case 'purpose':
        return guidanceDictionary.step2Purpose;
      default:
        return guidanceDictionary.step2Nature;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold font-heading text-white flex items-center gap-2">
          <Layers className="w-6 h-6 text-blue-400" />
          Step 2: Describe the Processing
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Detailed breakdown of nature, scope, context, and purpose of personal data handling.
        </p>
      </div>

      {/* Sub-tabs for Step 2 subsections */}
      <div className="flex border-b border-slate-800 space-x-2">
        <button
          onClick={() => setActiveTab('nature')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-t-xl text-xs font-bold transition border-b-2 ${
            activeTab === 'nature'
              ? 'bg-blue-600/20 text-blue-300 border-blue-500'
              : attemptedNext && isNatureEmpty
              ? 'text-red-400 bg-red-950/20 border-red-500'
              : 'text-slate-400 hover:text-slate-200 border-transparent'
          }`}
          id="tab-step2-nature"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>2.1 Nature</span>
          {attemptedNext && isNatureEmpty && <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />}
        </button>
        <button
          onClick={() => setActiveTab('scope')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-t-xl text-xs font-bold transition border-b-2 ${
            activeTab === 'scope'
              ? 'bg-blue-600/20 text-blue-300 border-blue-500'
              : attemptedNext && isScopeEmpty
              ? 'text-red-400 bg-red-950/20 border-red-500'
              : 'text-slate-400 hover:text-slate-200 border-transparent'
          }`}
          id="tab-step2-scope"
        >
          <Workflow className="w-3.5 h-3.5" />
          <span>2.2 Scope</span>
          {attemptedNext && isScopeEmpty && <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />}
        </button>
        <button
          onClick={() => setActiveTab('context')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-t-xl text-xs font-bold transition border-b-2 ${
            activeTab === 'context'
              ? 'bg-blue-600/20 text-blue-300 border-blue-500'
              : attemptedNext && isContextEmpty
              ? 'text-red-400 bg-red-950/20 border-red-500'
              : 'text-slate-400 hover:text-slate-200 border-transparent'
          }`}
          id="tab-step2-context"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>2.3 Context & Data Subjects</span>
          {attemptedNext && isContextEmpty && <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />}
        </button>
        <button
          onClick={() => setActiveTab('purpose')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-t-xl text-xs font-bold transition border-b-2 ${
            activeTab === 'purpose'
              ? 'bg-blue-600/20 text-blue-300 border-blue-500'
              : attemptedNext && isPurposeEmpty
              ? 'text-red-400 bg-red-950/20 border-red-500'
              : 'text-slate-400 hover:text-slate-200 border-transparent'
          }`}
          id="tab-step2-purpose"
        >
          <Target className="w-3.5 h-3.5" />
          <span>2.4 Purpose</span>
          {attemptedNext && isPurposeEmpty && <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Input Field */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel rounded-xl p-5 border border-slate-800 space-y-4">
            {activeTab === 'nature' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>2.1 Nature of Processing (Collection, Storage, Sharing, Deletion) *</span>
                  {attemptedNext && isNatureEmpty && (
                    <span className="text-xs font-semibold text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Required
                    </span>
                  )}
                </label>
                <AIRewordTextarea
                  rows={7}
                  value={data.nature}
                  onValueChange={(val) => onChange({ ...data, nature: val })}
                  promptContext="Nature of Processing"
                  placeholder="Describe how data will be collected, used, stored, shared with sub-processors, and deleted..."
                  className={`w-full bg-slate-950 border rounded-lg p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 leading-relaxed ${
                    attemptedNext && isNatureEmpty
                      ? 'border-red-500 bg-red-950/20 ring-2 ring-red-500/40'
                      : 'border-slate-700 focus:ring-blue-500'
                  }`}
                  id="step2-nature-textarea"
                />
              </div>
            )}

            {activeTab === 'scope' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>2.2 Scope of Processing (Data Types, Volume, Geographic Reach) *</span>
                  {attemptedNext && isScopeEmpty && (
                    <span className="text-xs font-semibold text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Required
                    </span>
                  )}
                </label>
                <AIRewordTextarea
                  rows={7}
                  value={data.scope}
                  onValueChange={(val) => onChange({ ...data, scope: val })}
                  promptContext="Scope of Processing"
                  placeholder="List exact data attributes collected, special category data involvement, number of individuals affected..."
                  className={`w-full bg-slate-950 border rounded-lg p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 leading-relaxed ${
                    attemptedNext && isScopeEmpty
                      ? 'border-red-500 bg-red-950/20 ring-2 ring-red-500/40'
                      : 'border-slate-700 focus:ring-blue-500'
                  }`}
                  id="step2-scope-textarea"
                />
              </div>
            )}

            {activeTab === 'context' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>2.3 Context & Affected Data Subjects (Relationships & Expectations) *</span>
                    {attemptedNext && isContextEmpty && (
                      <span className="text-xs font-semibold text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> Required
                      </span>
                    )}
                  </label>
                  <p className="text-xs text-slate-400 mb-2.5 leading-relaxed">
                    <strong>Who are the Data Subjects?</strong> Select the category of individuals whose personal data is being handled (NOT internal company staff operating the app):
                  </p>

                  {/* Data Subject Pills */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {DATA_SUBJECT_PILLS.map((pill) => (
                      <button
                        key={pill.id}
                        type="button"
                        onClick={() => {
                          const newText = data.context.trim()
                            ? `${data.context.trim()}\n• ${pill.text}`
                            : `• ${pill.text}`;
                          onChange({ ...data, context: newText });
                        }}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold border transition flex items-center gap-1.5 bg-slate-900 border-slate-700 text-slate-300 hover:border-blue-400 hover:text-white hover:bg-blue-950/50 shadow-sm"
                      >
                        <span>{pill.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <AIRewordTextarea
                  rows={6}
                  value={data.context}
                  onValueChange={(val) => onChange({ ...data, context: val })}
                  promptContext="Context of Processing & Data Subjects"
                  placeholder="Click a Data Subject category pill above or describe relationships, user expectations, and whether children/vulnerable groups are involved..."
                  className={`w-full bg-slate-950 border rounded-lg p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 leading-relaxed ${
                    attemptedNext && isContextEmpty
                      ? 'border-red-500 bg-red-950/20 ring-2 ring-red-500/40'
                      : 'border-slate-700 focus:ring-blue-500'
                  }`}
                  id="step2-context-textarea"
                />
              </div>
            )}

            {activeTab === 'purpose' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>2.4 Purpose of Processing (Objectives & Tangible Benefits) *</span>
                  {attemptedNext && isPurposeEmpty && (
                    <span className="text-xs font-semibold text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Required
                    </span>
                  )}
                </label>
                <AIRewordTextarea
                  rows={7}
                  value={data.purpose}
                  onValueChange={(val) => onChange({ ...data, purpose: val })}
                  promptContext="Purpose of Processing"
                  placeholder="Detail what you want to achieve and tangible benefits to both the organization and end users..."
                  className={`w-full bg-slate-950 border rounded-lg p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 leading-relaxed ${
                    attemptedNext && isPurposeEmpty
                      ? 'border-red-500 bg-red-950/20 ring-2 ring-red-500/40'
                      : 'border-slate-700 focus:ring-blue-500'
                  }`}
                  id="step2-purpose-textarea"
                />
              </div>
            )}
          </div>

          <PitfallWarningBanner violations={pitfallViolations} />

          <div className="flex justify-between pt-2">
            <button
              onClick={onPrev}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm rounded-xl transition border border-slate-700"
              id="step2-prev-btn"
            >
              ← Back to Step 1
            </button>
            <button
              onClick={handleNextClick}
              className={`px-6 py-2.5 font-semibold text-sm rounded-xl transition shadow-lg flex items-center gap-1.5 ${
                attemptedNext && !isStepValid
                  ? 'bg-amber-600 hover:bg-amber-500 text-white ring-2 ring-amber-400'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
              }`}
              id="step2-next-btn"
            >
              <span>Continue to Step 3: Consultation →</span>
            </button>
          </div>
        </div>

        {/* Right Column: Guided Helper & Examples */}
        <div className="lg:col-span-5 lg:sticky lg:top-20">
          <HelpDrawer guidance={getGuidance()} formData={formData} onboardingPayload={onboardingPayload} />
        </div>
      </div>
    </div>
  );
};
