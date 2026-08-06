import React, { useEffect, useState } from 'react';
import type { Step5RiskItem, Step6MitigationItem, EffectOnRisk, RiskLevel, DPIAFormData } from '../../types/dpia';
import type { OnboardingPayload } from '../../types/onboarding';
import { guidanceDictionary } from '../../data/guidanceData';
import { HelpDrawer } from '../HelpDrawer';
import { PitfallWarningBanner } from '../PitfallWarningBanner';
import { checkStep6Pitfalls, type PitfallViolation } from '../../utils/pitfallChecker';
import { ShieldCheck, CheckCircle2, XCircle, AlertCircle, Sparkles, Plus, Check } from 'lucide-react';

interface Step6MitigationsProps {
  risks: Step5RiskItem[];
  mitigations: Step6MitigationItem[];
  onChange: (updatedMitigations: Step6MitigationItem[]) => void;
  onNext: () => void;
  onPrev: () => void;
  formData?: DPIAFormData;
  onboardingPayload?: OnboardingPayload | null;
}

interface SafeguardPill {
  id: string;
  label: string;
  fullText: string;
}

// Preset mitigation options mapped to risk categories
function getSuggestedSafeguardsForRisk(riskDesc: string): SafeguardPill[] {
  const lower = riskDesc.toLowerCase();

  // AI Vendor / Sub-processor Training
  if (lower.includes('ai') || lower.includes('vendor') || lower.includes('model') || lower.includes('sub-processor')) {
    return [
      { id: 'ai-dpa', label: '📜 Signed Enterprise DPA (Zero Data Retention)', fullText: 'Execute enterprise Data Processing Agreement (DPA) guaranteeing zero vendor model training and zero persistent data retention.' },
      { id: 'ai-redact', label: '🧹 Client-Side PII Anonymizer', fullText: 'Implement client-side PII redactor to strip personal identifiers before transmission to external API endpoints.' },
      { id: 'ai-optout', label: '🚫 Opt-Out of Model Training', fullText: 'Enforce programmatic opt-out headers ensuring chat transcripts and diagnostic metrics are excluded from AI training sets.' },
    ];
  }

  // PHI / Healthcare / Credential Leak
  if (lower.includes('access') || lower.includes('credential') || lower.includes('phi') || lower.includes('patient') || lower.includes('unauthorized')) {
    return [
      { id: 'sec-mfa', label: '🔒 Mandatory MFA & TLS 1.3 / AES-256', fullText: 'Enforce mandatory Multi-Factor Authentication (MFA) for all staff, TLS 1.3 in transit, and AES-256 encryption at rest.' },
      { id: 'sec-rbac', label: '🛡️ Strict Role-Based Access (RBAC)', fullText: 'Deploy strict Role-Based Access Control (RBAC) enforcing minimum necessary access principles for clinical and support staff.' },
      { id: 'sec-audit', label: '🔍 Annual Pen Testing & SOC 2 Audits', fullText: 'Conduct annual third-party penetration testing and maintain continuous SOC 2 Type II compliance auditing.' },
    ];
  }

  // Misdirected Communications / Email Leak
  if (lower.includes('email') || lower.includes('transmission') || lower.includes('fax') || lower.includes('inadvertent') || lower.includes('portal')) {
    return [
      { id: 'comm-verify', label: '👁️ Recipient 2FA & Verification', fullText: 'Require 2-Factor Authentication and explicit identity verification prior to unlocking sensitive portal communications.' },
      { id: 'comm-dlp', label: '🛑 Automated DLP Leak Prevention', fullText: 'Deploy Data Loss Prevention (DLP) automated filters to detect and block misdirected emails containing PHI/PII.' },
      { id: 'comm-expire', label: '⏱️ Expiring Secure Access Links', fullText: 'Enforce 7-day expiring encrypted access links for external diagnostic result downloads.' },
    ];
  }

  // Cloud Misconfiguration / S3 Storage
  if (lower.includes('cloud') || lower.includes('s3') || lower.includes('bucket') || lower.includes('database') || lower.includes('misconfig')) {
    return [
      { id: 'cloud-kms', label: '☁️ AWS KMS Encryption & Private VPC', fullText: 'Provision AWS KMS envelope encryption, private VPC endpoints, and disable all public S3 bucket access.' },
      { id: 'cloud-audit', label: '🤖 Programmatic CloudTrail Auditing', fullText: 'Enable automated CloudTrail security auditing with continuous automated remediation for misconfiguration alerts.' },
    ];
  }

  // Data Retention Expiry
  if (lower.includes('retention') || lower.includes('purge') || lower.includes('expire') || lower.includes('historical')) {
    return [
      { id: 'ret-purge', label: '🗑️ Automated Retention Purge Scripts', fullText: 'Deploy automated Information Lifecycle Management (ILM) scripts purging expired records after retention schedules.' },
      { id: 'ret-overwrite', label: '📑 Programmatic Block Overwriting', fullText: 'Enforce programmatic storage block overwriting upon retention expiry under compliance schedule rules.' },
    ];
  }

  // Generic / Default Safeguards
  return [
    { id: 'gen-mfa', label: '🔒 MFA & AES-256 Encryption', fullText: 'Enforce Multi-Factor Authentication (MFA), AES-256 encryption at rest, and TLS 1.3 in transit.' },
    { id: 'gen-dpa', label: '📜 Signed Sub-Processor DPA', fullText: 'Bind all third-party sub-processors under signed Data Processing Agreements with strict security controls.' },
    { id: 'gen-purge', label: '🗑️ Automated Retention Purge', fullText: 'Implement automated retention purge schedules to permanently delete expired data.' },
  ];
}

export const Step6Mitigations: React.FC<Step6MitigationsProps> = ({
  risks,
  mitigations,
  onChange,
  onNext,
  onPrev,
  formData,
  onboardingPayload,
}) => {
  const guidance = guidanceDictionary.step6Mitigations;
  const [attemptedNext, setAttemptedNext] = useState(false);
  const [pitfallViolations, setPitfallViolations] = useState<PitfallViolation[]>([]);

  const hasNoMitigations = mitigations.length === 0;
  const hasEmptyOptions = mitigations.some((m) => !m.mitigationOptions.trim());
  const isInvalid = hasNoMitigations || hasEmptyOptions;

  const handleNextClick = () => {
    setAttemptedNext(true);
    if (isInvalid) return;

    const violationTexts = mitigations.map((m) => m.mitigationOptions);
    const violations = checkStep6Pitfalls(violationTexts);
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
  }, [JSON.stringify(mitigations)]);

  // Smart Pre-population: Populate default safeguards if empty
  useEffect(() => {
    if (risks.length > 0) {
      const updated = risks.map((risk) => {
        const existing = mitigations.find((m) => m.riskId === risk.id);
        const suggestedPills = getSuggestedSafeguardsForRisk(risk.riskDescription);
        const defaultText = suggestedPills[0]?.fullText || 'Enforce MFA, AES-256 encryption at rest, TLS 1.3, and signed sub-processor DPAs.';

        if (existing) {
          return {
            ...existing,
            riskDescription: risk.riskDescription,
            mitigationOptions: existing.mitigationOptions || defaultText,
          };
        }
        return {
          id: `mit-${risk.id}`,
          riskId: risk.id,
          riskDescription: risk.riskDescription,
          mitigationOptions: defaultText,
          effectOnRisk: 'Reduced' as EffectOnRisk,
          residualRisk: 'Low' as RiskLevel,
          measureApproved: true,
        };
      });

      if (JSON.stringify(updated) !== JSON.stringify(mitigations)) {
        onChange(updated);
      }
    }
  }, [risks]);

  const updateMitigation = (id: string, fields: Partial<Step6MitigationItem>) => {
    const updated = mitigations.map((m) => (m.id === id ? { ...m, ...fields } : m));
    onChange(updated);
  };

  const toggleSafeguardPill = (mitigationId: string, currentText: string, safeguardText: string) => {
    const includesSafeguard = currentText.includes(safeguardText);
    let updatedText = '';

    if (includesSafeguard) {
      // Remove
      updatedText = currentText.replace(safeguardText, '').replace(/\s{2,}/g, ' ').trim();
    } else {
      // Append
      updatedText = currentText ? `${currentText} ${safeguardText}` : safeguardText;
    }

    updateMitigation(mitigationId, { mitigationOptions: updatedText });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold font-heading text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
          Step 6: Identify Measures to Reduce Risk
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Specify technical & organizational controls for each risk identified in Step 5, and record residual risk levels.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Input Fields */}
        <div className="lg:col-span-7 space-y-6">
          {risks.length === 0 ? (
            <div className="glass-panel rounded-xl p-8 text-center text-slate-400 border border-slate-800">
              <p className="text-sm">No risks were added in Step 5. Go back to Step 5 to add risks before configuring controls.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {mitigations.map((mit, index) => {
                const isOptionsEmpty = !mit.mitigationOptions.trim();
                const suggestedSafeguards = getSuggestedSafeguardsForRisk(mit.riskDescription);

                return (
                  <div
                    key={mit.id}
                    className={`glass-panel rounded-xl p-4 border space-y-3 ${
                      attemptedNext && isOptionsEmpty ? 'border-red-500 bg-red-950/20' : 'border-slate-800'
                    }`}
                  >
                    <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300">
                        Target Risk #{index + 1}:
                      </span>
                      <span className="text-xs italic text-amber-300 truncate max-w-lg">
                        "{mit.riskDescription || 'Unspecified risk description'}"
                      </span>
                    </div>

                    {/* Pre-Designed Applicable Safeguard Choices */}
                    <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          Suggested Controls for Risk #{index + 1} (Click to Select / Toggle):
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {suggestedSafeguards.map((pill) => {
                          const isAdded = mit.mitigationOptions.includes(pill.fullText);

                          return (
                            <button
                              key={pill.id}
                              type="button"
                              onClick={() => toggleSafeguardPill(mit.id, mit.mitigationOptions, pill.fullText)}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition border flex items-center gap-1 ${
                                isAdded
                                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-sm'
                                  : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-emerald-500/50 hover:text-white'
                              }`}
                            >
                              {isAdded ? (
                                <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                              ) : (
                                <Plus className="w-3 h-3 text-slate-400 shrink-0" />
                              )}
                              <span>{pill.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1 flex items-center justify-between">
                        <span>Options & Technical Controls to Reduce or Eliminate Risk *</span>
                        {attemptedNext && isOptionsEmpty && (
                          <span className="text-xs text-red-400 font-semibold flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 text-red-400" /> Required
                          </span>
                        )}
                      </label>
                      <textarea
                        rows={3}
                        value={mit.mitigationOptions}
                        onChange={(e) => updateMitigation(mit.id, { mitigationOptions: e.target.value })}
                        placeholder="Detail specific safeguards (e.g. end-to-end encryption, MFA, RBAC controls, annual security audits)..."
                        className={`w-full bg-slate-950 border rounded-lg p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 ${
                          attemptedNext && isOptionsEmpty
                            ? 'border-red-500 ring-2 ring-red-500/40'
                            : 'border-slate-700 focus:ring-emerald-500'
                        }`}
                        id={`mitigation-options-${index}`}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                          Effect on Risk
                        </label>
                        <select
                          value={mit.effectOnRisk}
                          onChange={(e) => updateMitigation(mit.id, { effectOnRisk: e.target.value as EffectOnRisk })}
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:ring-2 focus:ring-emerald-500"
                          id={`mitigation-effect-${index}`}
                        >
                          <option value="Eliminated">Eliminated</option>
                          <option value="Reduced">Reduced</option>
                          <option value="Accepted">Accepted As-Is</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                          Residual Risk Level
                        </label>
                        <select
                          value={mit.residualRisk}
                          onChange={(e) => updateMitigation(mit.id, { residualRisk: e.target.value as RiskLevel })}
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:ring-2 focus:ring-emerald-500"
                          id={`mitigation-residual-${index}`}
                        >
                          <option value="Low">Low Residual Risk</option>
                          <option value="Medium">Medium Residual Risk</option>
                          <option value="High">High Residual Risk</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                          Measure Approved?
                        </label>
                        <button
                          type="button"
                          onClick={() => updateMitigation(mit.id, { measureApproved: !mit.measureApproved })}
                          className={`w-full p-2 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1 border ${
                            mit.measureApproved
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : 'bg-red-500/20 text-red-300 border-red-500/40'
                          }`}
                          id={`measure-approved-btn-${index}`}
                        >
                          {mit.measureApproved ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Approved</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5 text-red-400" />
                              <span>Rejected</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <PitfallWarningBanner violations={pitfallViolations} />

          <div className="flex justify-between pt-2">
            <button
              onClick={onPrev}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm rounded-xl transition border border-slate-700"
              id="step6-prev-btn"
            >
              ← Back to Step 5
            </button>
            <button
              onClick={handleNextClick}
              className={`px-6 py-2.5 font-semibold text-sm rounded-xl transition shadow-lg flex items-center gap-1.5 ${
                attemptedNext && isInvalid
                  ? 'bg-amber-600 hover:bg-amber-500 text-white ring-2 ring-amber-400'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
              }`}
              id="step6-next-btn"
            >
              <span>Continue to Step 7: Sign Off →</span>
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
