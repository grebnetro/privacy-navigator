import React, { useState } from 'react';
import type { Step3Consultation as Step3ConsultationData, DPIAFormData } from '../../types/dpia';
import type { OnboardingPayload } from '../../types/onboarding';
import { guidanceDictionary } from '../../data/guidanceData';
import { HelpDrawer } from '../HelpDrawer';
import { PitfallWarningBanner } from '../PitfallWarningBanner';
import { AIRewordTextarea } from '../AIRewordTextarea';
import { checkStep3Pitfalls, type PitfallViolation } from '../../utils/pitfallChecker';
import { getFrameworkTitles } from '../../utils/frameworkTitles';
import { MessageSquare, Users, AlertCircle, Plus, Check, Shield, Scale, Cpu, Building, Stethoscope, Lock, FileText, Zap, Key } from 'lucide-react';

interface Step3ConsultationProps {
  data: Step3ConsultationData;
  onChange: (updated: Step3ConsultationData) => void;
  onNext: () => void;
  onPrev: () => void;
  formData?: DPIAFormData;
  onboardingPayload?: OnboardingPayload | null;
}

interface StakeholderPreset {
  id: string;
  label: string;
  icon: React.ElementType;
  text: string;
}

const STAKEHOLDER_PRESETS: StakeholderPreset[] = [
  {
    id: 'ciso',
    label: 'IT Security & CISO',
    icon: Shield,
    text: 'Consulted IT Security Officer & CISO regarding system architecture, encryption standards, and vulnerability mitigations.',
  },
  {
    id: 'legal',
    label: 'Legal Counsel & DPO',
    icon: Scale,
    text: 'Engaged Legal Counsel & Data Protection Officer to review regulatory compliance, DPAs, and data subject notices.',
  },
  {
    id: 'devops',
    label: 'DevOps & Engineering',
    icon: Cpu,
    text: 'Coordinated with Software Engineering and Infrastructure teams regarding access controls, logging, and data retention.',
  },
  {
    id: 'vendors',
    label: 'Cloud Sub-processors & Vendors',
    icon: Building,
    text: 'Reviewed vendor security assessments and executed Business Associate / Data Processing Agreements with third-party cloud sub-processors.',
  },
  {
    id: 'ops',
    label: 'Clinical & Operations Team',
    icon: Stethoscope,
    text: 'Gathered requirements and operational feedback from internal clinical leaders and departmental managers.',
  },
];

interface JustificationPreset {
  id: string;
  label: string;
  icon: React.ElementType;
  text: string;
}

const JUSTIFICATION_PRESETS: JustificationPreset[] = [
  {
    id: 'confidentiality',
    label: 'Commercial Confidentiality',
    icon: Lock,
    text: 'Public consultation was not conducted due to commercial sensitivity, proprietary trade secrets, and pre-launch confidentiality.',
  },
  {
    id: 'internal',
    label: 'Internal Enterprise System',
    icon: FileText,
    text: 'Public consultation was deemed unnecessary because the system operates strictly within internal enterprise workflows with no direct public end-user access.',
  },
  {
    id: 'effort',
    label: 'Disproportional Effort',
    icon: Zap,
    text: 'Seeking individual public views was impracticable and involved disproportional effort given the standard commercial nature of the processing.',
  },
  {
    id: 'security',
    label: 'Security & Fraud Prevention Risk',
    icon: Key,
    text: 'Public disclosure of detailed processing parameters could expose system vulnerabilities or compromise fraud prevention controls.',
  },
];

export const Step3ConsultationView: React.FC<Step3ConsultationProps> = ({
  data,
  onChange,
  onNext,
  onPrev,
  formData,
  onboardingPayload,
}) => {
  const guidance = guidanceDictionary.step3Consultation;
  const titles = getFrameworkTitles(onboardingPayload?.determinedAssessmentType);
  const [attemptedNext, setAttemptedNext] = useState(false);
  const [pitfallViolations, setPitfallViolations] = useState<PitfallViolation[]>([]);

  // Custom stakeholder input state
  const [customStakeholderText, setCustomStakeholderText] = useState('');
  const [showAddCustomStakeholder, setShowAddCustomStakeholder] = useState(false);
  const [customStakeholderList, setCustomStakeholderList] = useState<string[]>([]);

  // Custom justification input state
  const [customJustificationText, setCustomJustificationText] = useState('');
  const [showAddCustomJustification, setShowAddCustomJustification] = useState(false);
  const [customJustificationList, setCustomJustificationList] = useState<string[]>([]);

  const isConsultationEmpty = !data.stakeholderConsultation.trim();

  const handleNextClick = () => {
    setAttemptedNext(true);
    if (isConsultationEmpty) return;

    const violations = checkStep3Pitfalls(data.stakeholderConsultation);
    if (violations.length > 0) {
      setPitfallViolations(violations);
      return;
    }

    setPitfallViolations([]);
    onNext();
  };

  React.useEffect(() => {
    if (pitfallViolations.length > 0) {
      setPitfallViolations([]);
    }
  }, [data.stakeholderConsultation]);

  // Toggle stakeholder preset pill into text area
  const handleToggleStakeholderPreset = (preset: StakeholderPreset) => {
    const currentText = data.stakeholderConsultation;
    const isIncluded = currentText.includes(preset.text);

    let updatedText = '';
    if (isIncluded) {
      updatedText = currentText.replace(preset.text, '').replace(/\n\n+/g, '\n\n').trim();
    } else {
      updatedText = currentText ? `${currentText}\n\n${preset.text}` : preset.text;
    }

    onChange({ ...data, stakeholderConsultation: updatedText });
  };

  // Add custom stakeholder pill
  const handleAddCustomStakeholder = () => {
    const trimmed = customStakeholderText.trim();
    if (!trimmed) return;

    const fullText = `Consulted ${trimmed} regarding project scope and privacy safeguards.`;
    const updatedText = data.stakeholderConsultation
      ? `${data.stakeholderConsultation}\n\n${fullText}`
      : fullText;

    onChange({ ...data, stakeholderConsultation: updatedText });
    setCustomStakeholderList([...customStakeholderList, trimmed]);
    setCustomStakeholderText('');
    setShowAddCustomStakeholder(false);
  };

  // Toggle justification preset pill into text area
  const handleToggleJustificationPreset = (preset: JustificationPreset) => {
    const currentText = data.justificationIfNotConsulted;
    const isIncluded = currentText.includes(preset.text);

    let updatedText = '';
    if (isIncluded) {
      updatedText = currentText.replace(preset.text, '').replace(/\n\n+/g, '\n\n').trim();
    } else {
      updatedText = currentText ? `${currentText}\n\n${preset.text}` : preset.text;
    }

    onChange({ ...data, justificationIfNotConsulted: updatedText });
  };

  // Add custom justification pill
  const handleAddCustomJustification = () => {
    const trimmed = customJustificationText.trim();
    if (!trimmed) return;

    const fullText = `Public consultation was omitted because: ${trimmed}.`;
    const updatedText = data.justificationIfNotConsulted
      ? `${data.justificationIfNotConsulted}\n\n${fullText}`
      : fullText;

    onChange({ ...data, justificationIfNotConsulted: updatedText });
    setCustomJustificationList([...customJustificationList, trimmed]);
    setCustomJustificationText('');
    setShowAddCustomJustification(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold font-heading text-white flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-blue-400" />
          {titles.step3Header}
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Record internal and external stakeholder consultation outcomes or document reasons if public views were not sought.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel rounded-xl p-5 space-y-6 border border-slate-800">
            {/* 3.1 Stakeholders Consulted */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-blue-400" />
                  3.1 Internal & External Stakeholders Consulted *
                </span>
                {attemptedNext && isConsultationEmpty && (
                  <span className="text-xs font-semibold text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Required Field
                  </span>
                )}
              </label>

              {/* Pre-Designed Selectable Pills */}
              <div className="space-y-2">
                <span className="text-[11px] text-slate-400 font-medium block">
                  Select common stakeholders consulted (Click to toggle into response):
                </span>
                <div className="flex flex-wrap gap-2">
                  {STAKEHOLDER_PRESETS.map((preset) => {
                    const Icon = preset.icon;
                    const isSelected = data.stakeholderConsultation.includes(preset.text);

                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleToggleStakeholderPreset(preset)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-blue-600/30 border-blue-400 text-blue-200 shadow-md ring-1 ring-blue-400/50'
                            : 'bg-slate-900/80 border-slate-700/80 text-slate-300 hover:border-blue-500/50 hover:text-white'
                        }`}
                      >
                        <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-300' : 'text-slate-400'}`} />
                        <span>{preset.label}</span>
                        {isSelected && <Check className="w-3 h-3 text-blue-400 shrink-0" />}
                      </button>
                    );
                  })}

                  {/* Render Custom User Pills */}
                  {customStakeholderList.map((customName, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold border bg-emerald-600/20 border-emerald-500/50 text-emerald-300 flex items-center gap-1.5"
                    >
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>{customName}</span>
                    </span>
                  ))}

                  {/* Add Other Custom Stakeholder Pill */}
                  {!showAddCustomStakeholder ? (
                    <button
                      type="button"
                      onClick={() => setShowAddCustomStakeholder(true)}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-dashed border-slate-600 hover:border-blue-400 bg-slate-900/40 text-slate-400 hover:text-blue-300 transition flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5 text-blue-400" />
                      <span>+ Add Other Stakeholder</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={customStakeholderText}
                        onChange={(e) => setCustomStakeholderText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomStakeholder())}
                        placeholder="e.g. Clinical Advisory Board"
                        autoFocus
                        className="bg-slate-950 border border-blue-500/80 rounded-lg px-2.5 py-1 text-xs text-white placeholder-slate-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomStakeholder}
                        className="p-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
                        title="Add Stakeholder"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddCustomStakeholder(false)}
                        className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-md text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <AIRewordTextarea
                rows={4}
                value={data.stakeholderConsultation}
                onValueChange={(val) => onChange({ ...data, stakeholderConsultation: val })}
                promptContext="Stakeholder Consultation"
                placeholder="Describe who was consulted within your organization (e.g. IT Security, Legal, DPO, Vendors, focus groups)..."
                className={`w-full bg-slate-950 border rounded-lg p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 leading-relaxed ${
                  attemptedNext && isConsultationEmpty
                    ? 'border-red-500 bg-red-950/20 ring-2 ring-red-500/40'
                    : 'border-slate-700 focus:ring-blue-500'
                }`}
                id="step3-stakeholders-textarea"
              />
              {attemptedNext && isConsultationEmpty && (
                <p className="text-xs font-medium text-red-400 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  Please detail the stakeholders consulted before continuing.
                </p>
              )}
            </div>

            {/* 3.2 Justification if Public Consultation Not Appropriate */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                3.2 Justification if Public Consultation with Users Was Not Appropriate
              </label>

              {/* Pre-Designed Selectable Justification Pills */}
              <div className="space-y-2">
                <span className="text-[11px] text-slate-400 font-medium block">
                  Select applicable justification reasons (Click to toggle into response):
                </span>
                <div className="flex flex-wrap gap-2">
                  {JUSTIFICATION_PRESETS.map((preset) => {
                    const Icon = preset.icon;
                    const isSelected = data.justificationIfNotConsulted.includes(preset.text);

                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleToggleJustificationPreset(preset)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-purple-600/30 border-purple-400 text-purple-200 shadow-md ring-1 ring-purple-400/50'
                            : 'bg-slate-900/80 border-slate-700/80 text-slate-300 hover:border-purple-500/50 hover:text-white'
                        }`}
                      >
                        <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-purple-300' : 'text-slate-400'}`} />
                        <span>{preset.label}</span>
                        {isSelected && <Check className="w-3 h-3 text-purple-400 shrink-0" />}
                      </button>
                    );
                  })}

                  {/* Render Custom User Justifications */}
                  {customJustificationList.map((customReason, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold border bg-emerald-600/20 border-emerald-500/50 text-emerald-300 flex items-center gap-1.5"
                    >
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>{customReason}</span>
                    </span>
                  ))}

                  {/* Add Other Custom Justification Pill */}
                  {!showAddCustomJustification ? (
                    <button
                      type="button"
                      onClick={() => setShowAddCustomJustification(true)}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-dashed border-slate-600 hover:border-purple-400 bg-slate-900/40 text-slate-400 hover:text-purple-300 transition flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5 text-purple-400" />
                      <span>+ Add Other Justification</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={customJustificationText}
                        onChange={(e) => setCustomJustificationText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomJustification())}
                        placeholder="e.g. Statutory regulatory mandate"
                        autoFocus
                        className="bg-slate-950 border border-purple-500/80 rounded-lg px-2.5 py-1 text-xs text-white placeholder-slate-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomJustification}
                        className="p-1 bg-purple-600 hover:bg-purple-500 text-white rounded-md text-xs font-semibold"
                        title="Add Justification"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddCustomJustification(false)}
                        className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-md text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <AIRewordTextarea
                rows={3}
                value={data.justificationIfNotConsulted}
                onValueChange={(val) => onChange({ ...data, justificationIfNotConsulted: val })}
                promptContext="Public Consultation Justification"
                placeholder="If you did not seek individual user views, explain why (e.g., standard commercial processing, security confidentiality)..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
                id="step3-justification-textarea"
              />
            </div>
          </div>

          <PitfallWarningBanner violations={pitfallViolations} />

          <div className="flex justify-between pt-2">
            <button
              onClick={onPrev}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm rounded-xl transition border border-slate-700"
              id="step3-prev-btn"
            >
              ← Back to Step 2
            </button>
            <button
              onClick={handleNextClick}
              className={`px-6 py-2.5 font-semibold text-sm rounded-xl transition shadow-lg flex items-center gap-1.5 ${
                attemptedNext && isConsultationEmpty
                  ? 'bg-amber-600 hover:bg-amber-500 text-white ring-2 ring-amber-400'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
              }`}
              id="step3-next-btn"
            >
              <span>Continue to Step 4: Lawful Basis →</span>
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
