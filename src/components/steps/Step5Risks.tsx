import React, { useState, useEffect } from 'react';
import type { Step5RiskItem, Likelihood, Severity, RiskLevel, DPIAFormData } from '../../types/dpia';
import type { OnboardingPayload } from '../../types/onboarding';
import { guidanceDictionary } from '../../data/guidanceData';
import { HelpDrawer } from '../HelpDrawer';
import { PitfallWarningBanner } from '../PitfallWarningBanner';
import { checkStep5Pitfalls, type PitfallViolation } from '../../utils/pitfallChecker';
import { AlertTriangle, Plus, Trash2, ShieldAlert, AlertCircle, Sparkles, Check } from 'lucide-react';

interface Step5RisksProps {
  risks: Step5RiskItem[];
  onChange: (updatedRisks: Step5RiskItem[]) => void;
  onNext: () => void;
  onPrev: () => void;
  formData?: DPIAFormData;
  onboardingPayload?: OnboardingPayload | null;
}

export function computeOverallRisk(likelihood: Likelihood, severity: Severity): RiskLevel {
  if (severity === 'Severe') {
    return likelihood === 'Remote' ? 'Medium' : 'High';
  }
  if (severity === 'Significant') {
    return likelihood === 'Probable' ? 'High' : likelihood === 'Possible' ? 'Medium' : 'Low';
  }
  return likelihood === 'Probable' ? 'Medium' : 'Low';
}

interface PresetRiskOption {
  id: string;
  title: string;
  categoryIcon: string;
  description: string;
  defaultLikelihood: Likelihood;
  defaultSeverity: Severity;
  defaultOverall: RiskLevel;
  tag: string;
}

const PRESET_RISKS_CATALOG: PresetRiskOption[] = [
  {
    id: 'preset-credential-leak',
    title: 'Unauthorized Access & Credential Leak',
    categoryIcon: '🛡️',
    description: 'Unauthorized access to patient lab records or sensitive personal data via compromised employee credentials or brute-force attack.',
    defaultLikelihood: 'Possible',
    defaultSeverity: 'Severe',
    defaultOverall: 'High',
    tag: 'PHI / Security',
  },
  {
    id: 'preset-ai-vendor-training',
    title: 'Third-Party AI Model Data Retraining',
    categoryIcon: '🤖',
    description: 'Third-party AI sub-processor retains chat transcripts or customer diagnostic data to train public foundation models without explicit consent.',
    defaultLikelihood: 'Possible',
    defaultSeverity: 'Significant',
    defaultOverall: 'Medium',
    tag: 'AI / Vendor',
  },
  {
    id: 'preset-misdirected-comm',
    title: 'Inadvertent Data Transmission / Email Leak',
    categoryIcon: '📧',
    description: 'Inadvertent emailing, faxing, or portal delivery of diagnostic lab results to the wrong patient, customer, or recipient.',
    defaultLikelihood: 'Possible',
    defaultSeverity: 'Significant',
    defaultOverall: 'Medium',
    tag: 'Operational',
  },
  {
    id: 'preset-cloud-misconfig',
    title: 'Cloud Database / S3 Bucket Misconfiguration',
    categoryIcon: '☁️',
    description: 'Cloud storage bucket (AWS S3) or API endpoint misconfiguration exposing customer or patient PII to public search engine indexing.',
    defaultLikelihood: 'Remote',
    defaultSeverity: 'Severe',
    defaultOverall: 'Medium',
    tag: 'Cloud Infra',
  },
  {
    id: 'preset-excessive-retention',
    title: 'Excessive Historical Data Retention',
    categoryIcon: '⏱️',
    description: 'Failure to purge historical transaction logs or inactive patient lab records after expiration of retention schedules, increasing breach impact.',
    defaultLikelihood: 'Possible',
    defaultSeverity: 'Minimal',
    defaultOverall: 'Low',
    tag: 'Governance',
  },
  {
    id: 'preset-insider-snooping',
    title: 'Internal Workforce Snooping / Excessive Access',
    categoryIcon: '💼',
    description: 'Internal workforce staff viewing patient or customer records without legitimate medical, legal, or business justification.',
    defaultLikelihood: 'Remote',
    defaultSeverity: 'Significant',
    defaultOverall: 'Low',
    tag: 'Workforce',
  },
];

export const Step5Risks: React.FC<Step5RisksProps> = ({
  risks,
  onChange,
  onNext,
  onPrev,
  formData,
  onboardingPayload,
}) => {
  const guidance = guidanceDictionary.step5Risks;
  const [attemptedNext, setAttemptedNext] = useState(false);
  const [pitfallViolations, setPitfallViolations] = useState<PitfallViolation[]>([]);

  const orgName = formData?.controllerDetails.controllerName || 'your organization';
  const hasPHI = onboardingPayload?.dataTypes.includes('PHI') ?? false;

  // Smart Pre-population on initial load if risks array is empty
  useEffect(() => {
    if (risks.length === 0) {
      const initialPresets = hasPHI
        ? [PRESET_RISKS_CATALOG[0], PRESET_RISKS_CATALOG[1], PRESET_RISKS_CATALOG[2]]
        : [PRESET_RISKS_CATALOG[0], PRESET_RISKS_CATALOG[3]];

      const preloaded: Step5RiskItem[] = initialPresets.map((p, idx) => ({
        id: `risk-preset-${idx}-${Date.now()}`,
        riskDescription: p.description,
        likelihood: p.defaultLikelihood,
        severity: p.defaultSeverity,
        overallRisk: p.defaultOverall,
      }));

      onChange(preloaded);
    }
  }, []);

  const hasNoRisks = risks.length === 0;
  const hasEmptyRiskDesc = risks.some((r) => !r.riskDescription.trim());
  const isInvalid = hasNoRisks || hasEmptyRiskDesc;

  const handleNextClick = () => {
    setAttemptedNext(true);
    if (isInvalid) return;

    const violations = checkStep5Pitfalls(risks);
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
  }, [JSON.stringify(risks)]);

  const addCustomRisk = () => {
    const newRisk: Step5RiskItem = {
      id: `risk-${Date.now()}`,
      riskDescription: '',
      likelihood: 'Possible',
      severity: 'Significant',
      overallRisk: 'Medium',
    };
    onChange([...risks, newRisk]);
  };

  const addPresetRisk = (preset: PresetRiskOption) => {
    // Check if already added
    const alreadyExists = risks.some((r) => r.riskDescription === preset.description);
    if (alreadyExists) return;

    const newRisk: Step5RiskItem = {
      id: `risk-preset-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      riskDescription: preset.description,
      likelihood: preset.defaultLikelihood,
      severity: preset.defaultSeverity,
      overallRisk: preset.defaultOverall,
    };
    onChange([...risks, newRisk]);
  };

  const updateRisk = (id: string, fields: Partial<Step5RiskItem>) => {
    const updated = risks.map((r) => {
      if (r.id !== id) return r;
      const merged = { ...r, ...fields };
      merged.overallRisk = computeOverallRisk(merged.likelihood, merged.severity);
      return merged;
    });
    onChange(updated);
  };

  const removeRisk = (id: string) => {
    onChange(risks.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold font-heading text-white flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-amber-400" />
          Step 5: Identify and Assess Privacy Risks
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Describe potential threats to individuals, scoring Likelihood (Remote/Possible/Probable) and Severity (Minimal/Significant/Severe).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-7 space-y-6">
          {attemptedNext && hasNoRisks && (
            <div className="p-4 bg-red-950/40 border border-red-500/60 rounded-xl text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>You must add at least one privacy risk before continuing to Step 6.</span>
            </div>
          )}

          {/* Pre-Designed Common Privacy Risks Picker */}
          <div className="glass-panel rounded-xl p-4 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Pre-Designed Common Privacy Risks for {orgName}</span>
              </div>
              <span className="text-[11px] text-slate-400 italic">Click to add to your assessment</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {PRESET_RISKS_CATALOG.map((preset) => {
                const isAdded = risks.some((r) => r.riskDescription === preset.description);

                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => addPresetRisk(preset)}
                    disabled={isAdded}
                    className={`text-left p-3 rounded-xl border transition flex flex-col justify-between space-y-2 ${
                      isAdded
                        ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300 opacity-75 cursor-default'
                        : 'bg-slate-950/80 border-slate-800 hover:border-amber-500/60 text-slate-300 hover:bg-slate-900/90'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold flex items-center gap-1.5">
                          <span>{preset.categoryIcon}</span>
                          <span className={isAdded ? 'text-emerald-300' : 'text-slate-200'}>
                            {preset.title}
                          </span>
                        </span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                            preset.defaultOverall === 'High'
                              ? 'bg-red-950/80 text-red-300 border-red-500/40'
                              : preset.defaultOverall === 'Medium'
                              ? 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                              : 'bg-blue-950/80 text-blue-300 border-blue-500/40'
                          }`}
                        >
                          {preset.defaultOverall} Risk
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {preset.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px]">
                      <span className="text-slate-500 font-medium">{preset.tag}</span>
                      {isAdded ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <Check className="w-3 h-3" /> Added to Assessment
                        </span>
                      ) : (
                        <span className="text-amber-400 font-semibold hover:underline flex items-center gap-1">
                          <Plus className="w-3 h-3" /> Add This Risk
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Assessed Risks List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>Assessed Privacy Risks ({risks.length})</span>
              </h3>
            </div>

            {risks.map((risk, index) => {
              const isDescEmpty = !risk.riskDescription.trim();
              return (
                <div
                  key={risk.id}
                  className={`glass-panel rounded-xl p-4 border space-y-3 relative group ${
                    attemptedNext && isDescEmpty ? 'border-red-500 bg-red-950/20' : 'border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-amber-400" />
                      Risk #{index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeRisk(risk.id)}
                      className="text-slate-500 hover:text-red-400 p-1 rounded-lg hover:bg-red-500/10 transition"
                      title="Delete this risk"
                      id={`delete-risk-${index}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1 flex items-center justify-between">
                      <span>Risk Source & Potential Impact on Individuals *</span>
                      {attemptedNext && isDescEmpty && (
                        <span className="text-xs text-red-400 font-semibold flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> Required
                        </span>
                      )}
                    </label>
                    <textarea
                      rows={2.5}
                      value={risk.riskDescription}
                      onChange={(e) => updateRisk(risk.id, { riskDescription: e.target.value })}
                      placeholder="Describe what could go wrong, potential harm to individuals, and threat vector..."
                      className={`w-full bg-slate-950 border rounded-lg p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 ${
                        attemptedNext && isDescEmpty
                          ? 'border-red-500 ring-2 ring-red-500/40'
                          : 'border-slate-700 focus:ring-amber-500'
                      }`}
                      id={`risk-desc-${index}`}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                        Likelihood of Harm
                      </label>
                      <select
                        value={risk.likelihood}
                        onChange={(e) => updateRisk(risk.id, { likelihood: e.target.value as Likelihood })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:ring-2 focus:ring-amber-500"
                        id={`risk-likelihood-${index}`}
                      >
                        <option value="Remote">Remote</option>
                        <option value="Possible">Possible</option>
                        <option value="Probable">Probable</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                        Severity of Harm
                      </label>
                      <select
                        value={risk.severity}
                        onChange={(e) => updateRisk(risk.id, { severity: e.target.value as Severity })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:ring-2 focus:ring-amber-500"
                        id={`risk-severity-${index}`}
                      >
                        <option value="Minimal">Minimal</option>
                        <option value="Significant">Significant</option>
                        <option value="Severe">Severe</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                        Automated Overall Risk
                      </label>
                      <div
                        className={`p-2 rounded-lg text-xs font-bold text-center border ${
                          risk.overallRisk === 'High'
                            ? 'bg-red-950/80 text-red-300 border-red-500/50'
                            : risk.overallRisk === 'Medium'
                            ? 'bg-amber-950/80 text-amber-300 border-amber-500/50'
                            : 'bg-blue-950/80 text-blue-300 border-blue-500/50'
                        }`}
                      >
                        {risk.overallRisk} Risk
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add Custom Blank Privacy Risk Button */}
          <button
            type="button"
            onClick={addCustomRisk}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-amber-400 font-semibold text-xs rounded-xl border border-dashed border-amber-500/40 hover:border-amber-400 transition flex items-center justify-center gap-2 shadow-lg"
            id="add-custom-risk-btn"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Another Custom Privacy Risk</span>
          </button>

          <PitfallWarningBanner violations={pitfallViolations} />

          <div className="flex justify-between pt-2">
            <button
              onClick={onPrev}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm rounded-xl transition border border-slate-700"
              id="step5-prev-btn"
            >
              ← Back to Step 4
            </button>
            <button
              onClick={handleNextClick}
              className={`px-6 py-2.5 font-semibold text-sm rounded-xl transition shadow-lg flex items-center gap-1.5 ${
                attemptedNext && isInvalid
                  ? 'bg-amber-600 hover:bg-amber-500 text-white ring-2 ring-amber-400'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
              }`}
              id="step5-next-btn"
            >
              <span>Continue to Step 6: Risk Mitigation →</span>
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
