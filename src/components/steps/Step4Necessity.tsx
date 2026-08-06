import React, { useState, useEffect } from 'react';
import type { Step4Necessity as Step4Data, LawfulBasisType, DPIAFormData } from '../../types/dpia';
import type { OnboardingPayload } from '../../types/onboarding';
import { guidanceDictionary } from '../../data/guidanceData';
import { HelpDrawer } from '../HelpDrawer';
import { PitfallWarningBanner } from '../PitfallWarningBanner';
import { AIRewordTextarea } from '../AIRewordTextarea';
import { checkStep4Pitfalls, type PitfallViolation } from '../../utils/pitfallChecker';
import { Scale, CheckSquare, Square, AlertCircle, Sparkles, Info, HelpCircle } from 'lucide-react';

interface Step4Props {
  data: Step4Data;
  onChange: (updated: Step4Data) => void;
  onNext: () => void;
  onPrev: () => void;
  formData?: DPIAFormData;
  onboardingPayload?: OnboardingPayload | null;
}

interface LawfulBasisMeta {
  type: LawfulBasisType;
  label: string;
  desc: string;
  plainEnglishWhy: string;
  whenToUse: string;
  whenToAvoid: string;
}

const LAWFUL_BASES: LawfulBasisMeta[] = [
  {
    type: 'Legal obligation',
    label: 'GDPR Art. 6(1)(c) / Statutory Legal Obligation',
    desc: 'Required by law, health regulations, or statutory mandate (e.g. HIPAA)',
    plainEnglishWhy: 'Mandated by law or statutory healthcare regulation.',
    whenToUse: 'Use when processing is required by statute, regulatory mandate, or healthcare law (e.g., HIPAA 45 CFR § 164.506, tax laws).',
    whenToAvoid: 'Do not use if processing is optional or purely for commercial marketing.',
  },
  {
    type: 'Contract',
    label: 'GDPR Art. 6(1)(b) Contract Performance',
    desc: 'Necessary to fulfill a contract or service agreement with the individual',
    plainEnglishWhy: 'Necessary to deliver the service the customer or patient requested.',
    whenToUse: 'Use when data is required to perform the service requested by the user under Terms of Service or patient intake.',
    whenToAvoid: 'Do not use for secondary features or third-party marketing not core to the contract.',
  },
  {
    type: 'Legitimate interests',
    label: 'GDPR Art. 6(1)(f) Legitimate Interests',
    desc: 'Balanced business or operational interest with minimal privacy impact',
    plainEnglishWhy: 'Necessary for business operations, security, or product improvements.',
    whenToUse: 'Use for system security, fraud prevention, service analytics, and operational improvements.',
    whenToAvoid: 'Avoid if the processing significantly impacts user privacy or if users would be surprised.',
  },
  {
    type: 'Consent',
    label: 'GDPR Art. 6(1)(a) Explicit Consent',
    desc: 'User gave clear, explicit, opt-in consent for this specific purpose',
    plainEnglishWhy: 'User explicitly opted in after clear notice.',
    whenToUse: 'Use for optional features, marketing communications, research participation, or minor data processing.',
    whenToAvoid: 'Do not use if the user has no genuine choice or if service is denied upon withholding consent.',
  },
  {
    type: 'Vital interests',
    label: 'GDPR Art. 6(1)(d) Vital Interests',
    desc: 'Necessary to protect someone\'s life or critical medical emergency',
    plainEnglishWhy: 'Critical emergency to save life or prevent severe harm.',
    whenToUse: 'Use strictly in life-or-death emergency medical situations.',
    whenToAvoid: 'Do not use for standard routine healthcare, commercial apps, or administrative tasks.',
  },
  {
    type: 'Public task',
    label: 'GDPR Art. 6(1)(e) Public Interest / Official Task',
    desc: 'Exercise of official authority or public interest mandate',
    plainEnglishWhy: 'Carried out by a public authority or government mandate.',
    whenToUse: 'Use if operating as a public authority, government agency, or public health body.',
    whenToAvoid: 'Do not use for private commercial companies.',
  },
];

export const Step4NecessityView: React.FC<Step4Props> = ({
  data,
  onChange,
  onNext,
  onPrev,
  formData,
  onboardingPayload,
}) => {
  const guidance = guidanceDictionary.step4Necessity;
  const [attemptedNext, setAttemptedNext] = useState(false);
  const [pitfallViolations, setPitfallViolations] = useState<PitfallViolation[]>([]);
  const [expandedInfo, setExpandedInfo] = useState<string | null>(null);

  const orgName = formData?.controllerDetails.controllerName || 'your organization';
  const projectTitle = onboardingPayload?.projectTitle || 'this project';

  const hasPHI = onboardingPayload?.dataTypes.includes('PHI') ?? false;
  const hasChildren = onboardingPayload?.dataTypes.includes('CHILDREN') ?? false;

  // Determine recommended bases based on project data
  const recommendedBases: LawfulBasisType[] = hasPHI
    ? ['Legal obligation', 'Contract']
    : hasChildren
    ? ['Consent', 'Contract']
    : ['Contract', 'Legitimate interests'];

  // Smart Pre-selection on initial load if empty
  useEffect(() => {
    const currentBases = data.lawfulBasis || [];
    if (currentBases.length === 0) {
      const defaultDetails = hasPHI
        ? `Processing for '${projectTitle}' relies on Legal Obligation under HIPAA Health Care Operations (45 CFR § 164.506) and Contract Performance for diagnostic service delivery.`
        : `Processing for '${projectTitle}' relies on Contract Performance under user service agreements and Legitimate Interests for operational delivery and security.`;

      const defaultMinimization = `Data minimization controls restrict collection strictly to required attributes for '${projectTitle}'. Non-essential fields are disabled.`;

      onChange({
        ...data,
        lawfulBasis: recommendedBases,
        lawfulBasisDetails: data.lawfulBasisDetails || defaultDetails,
        dataMinimizationAndQuality: data.dataMinimizationAndQuality || defaultMinimization,
      });
    }
  }, []);

  const isBasesEmpty = (data.lawfulBasis || []).length === 0;

  const handleNextClick = () => {
    setAttemptedNext(true);
    if (isBasesEmpty) return;

    const violations = checkStep4Pitfalls(
      data.lawfulBasisDetails || '',
      data.dataMinimizationAndQuality || '',
      data.lawfulBasis || []
    );
    if (violations.length > 0) {
      setPitfallViolations(violations);
      return;
    }

    setPitfallViolations([]);
    onNext();
  };

  useEffect(() => {
    if (pitfallViolations.length > 0) {
      setPitfallViolations([]);
    }
  }, [data.lawfulBasisDetails, data.dataMinimizationAndQuality, data.lawfulBasis]);

  const toggleLawfulBasis = (type: LawfulBasisType) => {
    const active = data.lawfulBasis || [];
    const exists = active.includes(type);
    const updated = exists ? active.filter((b) => b !== type) : [...active, type];
    onChange({ ...data, lawfulBasis: updated });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold font-heading text-white flex items-center gap-2">
          <Scale className="w-6 h-6 text-blue-400" />
          Step 4: Necessity & Proportionality
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Demonstrate compliance with legal bases, data minimization, purpose limitation, and data subject rights.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel rounded-xl p-5 space-y-5 border border-slate-800">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  4.1 Lawful Basis for Processing (Select at least one) *
                </label>
                {attemptedNext && isBasesEmpty && (
                  <span className="text-xs font-semibold text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Required Selection
                  </span>
                )}
              </div>

              {/* AI Pre-selection Guidance Callout */}
              <div className="mb-3.5 p-3 bg-blue-950/40 border border-blue-500/30 rounded-xl space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-300">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>AI Pre-selected Guidance for {orgName}:</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Based on your project handling{' '}
                  <strong className="text-blue-200">
                    {hasPHI ? 'PHI & Clinical Diagnostic Data' : hasChildren ? 'Minor Data' : 'Personal Data'}
                  </strong>
                  , the system has pre-selected{' '}
                  <strong className="text-emerald-300">{recommendedBases.join(' & ')}</strong>. You can adjust these selections below.
                </p>
              </div>

              {/* Lawful Basis Cards */}
              <div
                className={`grid grid-cols-1 md:grid-cols-2 gap-2.5 p-1 rounded-xl transition ${
                  attemptedNext && isBasesEmpty ? 'border-2 border-red-500 bg-red-950/20' : ''
                }`}
              >
                {LAWFUL_BASES.map((item) => {
                  const isChecked = (data.lawfulBasis || []).includes(item.type);
                  const isRecommended = recommendedBases.includes(item.type);
                  const isInfoExpanded = expandedInfo === item.type;

                  return (
                    <div
                      key={item.type}
                      className={`relative flex flex-col justify-between p-3.5 rounded-xl border transition ${
                        isChecked
                          ? 'bg-blue-600/20 border-blue-500 text-blue-200 shadow-md ring-1 ring-blue-500/50'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        {/* Recommendation Badge */}
                        {isRecommended && (
                          <div className="mb-2 inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-950/60 border border-emerald-500/40 rounded-full text-[10px] font-bold text-emerald-300">
                            <Sparkles className="w-3 h-3 text-emerald-400" />
                            <span>⭐ Recommended for Your Project</span>
                          </div>
                        )}

                        <div className="flex items-start justify-between">
                          <button
                            type="button"
                            onClick={() => toggleLawfulBasis(item.type)}
                            className="flex items-start space-x-2 text-left font-bold text-xs flex-1"
                          >
                            {isChecked ? (
                              <CheckSquare className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                            )}
                            <span className={isChecked ? 'text-blue-300' : 'text-slate-200'}>
                              {item.label}
                            </span>
                          </button>

                          {/* Info Toggle Button */}
                          <button
                            type="button"
                            onClick={() => setExpandedInfo(isInfoExpanded ? null : item.type)}
                            className="text-slate-400 hover:text-blue-300 p-1 rounded transition"
                            title="Why choose or avoid this basis?"
                          >
                            <HelpCircle className="w-3.5 h-3.5 text-blue-400/80 hover:text-blue-300" />
                          </button>
                        </div>

                        <p className="text-[11px] text-slate-400 mt-1 pl-6 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>

                      {/* Expandable Plain-English Guide */}
                      {isInfoExpanded && (
                        <div className="mt-3 pt-2.5 border-t border-slate-800 text-[11px] text-slate-300 space-y-1.5 bg-slate-950/80 p-2.5 rounded-lg border border-blue-500/20 animate-in fade-in duration-200">
                          <div className="font-bold text-blue-300 flex items-center gap-1">
                            <Info className="w-3 h-3 text-blue-400" />
                            <span>When to Choose:</span>
                          </div>
                          <p className="text-slate-300 leading-relaxed">{item.whenToUse}</p>
                          <div className="font-bold text-amber-300 flex items-center gap-1 pt-1">
                            <AlertCircle className="w-3 h-3 text-amber-400" />
                            <span>When to Avoid:</span>
                          </div>
                          <p className="text-slate-400 leading-relaxed">{item.whenToAvoid}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  4.2 Details on Lawful Basis & Statutory Justification
                </label>
                <AIRewordTextarea
                  rows={3}
                  value={data.lawfulBasisDetails}
                  onValueChange={(val) => onChange({ ...data, lawfulBasisDetails: val })}
                  promptContext="Lawful Basis & Legitimate Interests"
                  placeholder="Explain why chosen lawful bases apply to your specific processing..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="lawful-basis-details-textarea"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  4.3 Data Minimization & Quality Controls
                </label>
                <AIRewordTextarea
                  rows={3}
                  value={data.dataMinimizationAndQuality}
                  onValueChange={(val) => onChange({ ...data, dataMinimizationAndQuality: val })}
                  promptContext="Data Minimization"
                  placeholder="How do you ensure you only collect the minimum personal data necessary?"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="data-minimization-textarea"
                />
              </div>
            </div>
          </div>

          <PitfallWarningBanner violations={pitfallViolations} />

          <div className="flex justify-between pt-2">
            <button
              onClick={onPrev}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm rounded-xl transition border border-slate-700"
              id="step4-prev-btn"
            >
              ← Back to Step 3
            </button>
            <button
              onClick={handleNextClick}
              className={`px-6 py-2.5 font-semibold text-sm rounded-xl transition shadow-lg flex items-center gap-1.5 ${
                attemptedNext && isBasesEmpty
                  ? 'bg-amber-600 hover:bg-amber-500 text-white ring-2 ring-amber-400'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
              }`}
              id="step4-next-btn"
            >
              <span>Continue to Step 5: Risk Assessment →</span>
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
