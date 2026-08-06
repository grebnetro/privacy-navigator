import React, { useState } from 'react';
import type { OnboardingState, OnboardingPayload, Jurisdiction, DataType } from '../../types/onboarding';
import { determineAssessmentFramework, generatePayload } from '../../utils/decisionEngine';
import { 
  REAL_WORLD_DATA_ITEMS, 
  deriveCategoriesFromItems, 
  getTriggersForCategory 
} from '../../utils/dataClassificationMapping';
import { InputWithSuggestions } from '../InputWithSuggestions';
import { 
  Compass, 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles,
  HelpCircle,
  FileCheck,
  Stethoscope,
  Building2,
  Square
} from 'lucide-react';

import type { OrganizationProfile } from '../../types/organization';
import { ALL_JURISDICTION_OPTIONS } from '../../types/organization';

interface OnboardingWizardProps {
  onComplete: (payload: OnboardingPayload) => void;
  initialState?: Partial<OnboardingState>;
  orgProfile?: OrganizationProfile;
}

const TITLE_SUGGESTIONS = [
  'Quest Diagnostics Cloud EHR Analytics',
  'Patient Lab Inquiry Web Portal',
  'AI Customer Support Assistant',
];

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  onComplete,
  initialState,
  orgProfile,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [attemptedNext, setAttemptedNext] = useState(false);

  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [selectedRegionIds, setSelectedRegionIds] = useState<string[]>(
    initialState?.jurisdictionRegionIds || []
  );

  const [formData, setFormData] = useState<OnboardingState>({
    projectTitle: initialState?.projectTitle || '',
    jurisdiction: initialState?.jurisdiction || ('' as Jurisdiction),
    jurisdictions: initialState?.jurisdictions || [],
    jurisdictionRegionIds: initialState?.jurisdictionRegionIds || [],
    dataTypes: initialState?.dataTypes || [],
    isHighRisk: initialState?.isHighRisk ?? false,
    hasStateConsumerPii: initialState?.hasStateConsumerPii ?? false,
    regionalFramework: initialState?.regionalFramework || '',
  });

  const isTitleValid = !!formData.projectTitle.trim();
  const isJurisdictionValid = selectedRegionIds.length > 0;
  const isStep1Valid = isTitleValid && isJurisdictionValid;
  const isStep2Valid = formData.dataTypes.length > 0;

  const handleNextStep1 = () => {
    setAttemptedNext(true);
    if (isStep1Valid) {
      setAttemptedNext(false);
      setStep(2);
    }
  };

  const handleNextStep2 = () => {
    setAttemptedNext(true);
    if (isStep2Valid) {
      setAttemptedNext(false);
      setStep(3);
    }
  };

  const handleNextStep3 = () => {
    setStep(4);
  };

  const handleToggleRealWorldItem = (itemId: string) => {
    const exists = selectedItemIds.includes(itemId);
    const updatedIds = exists
      ? selectedItemIds.filter((id) => id !== itemId)
      : [...selectedItemIds, itemId];
    setSelectedItemIds(updatedIds);

    const derivedCategories = deriveCategoriesFromItems(updatedIds);
    setFormData((prev) => ({
      ...prev,
      dataTypes: derivedCategories,
    }));
  };

  const handleToggleDataType = (type: DataType) => {
    const exists = formData.dataTypes.includes(type);
    const updated = exists
      ? formData.dataTypes.filter((t) => t !== type)
      : [...formData.dataTypes, type];
    setFormData({ ...formData, dataTypes: updated });
  };

  const handleToggleRegion = (optId: string) => {
    const exists = selectedRegionIds.includes(optId);
    const updatedIds = exists
      ? selectedRegionIds.filter((id) => id !== optId)
      : [...selectedRegionIds, optId];

    setSelectedRegionIds(updatedIds);

    const matchedOpts = ALL_JURISDICTION_OPTIONS.filter((o) => updatedIds.includes(o.id));
    const uniqueCodes = Array.from(new Set(matchedOpts.map((o) => o.code)));

    setFormData((prev) => ({
      ...prev,
      jurisdiction: uniqueCodes[0] || ('' as Jurisdiction),
      jurisdictions: uniqueCodes,
      jurisdictionRegionIds: updatedIds,
    }));
  };

  const handleApplyPreset = () => {
    const presetItemIds = ['lab_results', 'medical_records', 'full_names', 'email_addresses'];
    const presetRegionIds = ['US', 'EU_EEA', 'CANADA'];
    setSelectedItemIds(presetItemIds);
    setSelectedRegionIds(presetRegionIds);
    const derived = deriveCategoriesFromItems(presetItemIds);

    setFormData({
      projectTitle: 'Quest Diagnostics Cloud EHR Analytics',
      jurisdiction: 'EU_EEA',
      jurisdictions: ['EU_EEA', 'US', 'GLOBAL'],
      jurisdictionRegionIds: presetRegionIds,
      dataTypes: derived,
      isHighRisk: true,
      hasStateConsumerPii: true,
      regionalFramework: 'Canada PIPEDA',
    });
  };

  const result = determineAssessmentFramework(formData);

  const handleFinish = () => {
    const payload = generatePayload(formData);
    onComplete(payload);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Onboarding Header Banner */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-blue-950/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-md shrink-0 hidden sm:flex items-center justify-center">
              <img src="/DGX.svg" alt="Quest Diagnostics Logo" className="h-9 w-auto object-contain" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-2">
                <Compass className="w-3.5 h-3.5 text-blue-400" />
                Initial Assessment Framework Gate
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold font-heading text-white tracking-tight">
                Privacy Framework Selector & Onboarding
              </h1>
              <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
                We'll guide you through 4 quick plain-English questions to determine the exact legal privacy assessment framework required for your project.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleApplyPreset}
            className="self-start md:self-center px-4 py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-blue-500/50 rounded-xl text-xs font-semibold transition flex items-center gap-2 shrink-0 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Pre-fill Quest Diagnostics Example</span>
          </button>
        </div>

        {/* Step Progress Tracker */}
        <div className="grid grid-cols-4 gap-2 md:gap-4 mt-6 pt-4 border-t border-slate-800/80">
          {[
            { num: 1, label: 'Scope & Context' },
            { num: 2, label: 'Data Classification' },
            { num: 3, label: 'Risk Criteria' },
            { num: 4, label: 'Result & Handoff' },
          ].map((item) => {
            const isActive = step === item.num;
            const isCompleted = step > item.num;
            return (
              <div key={item.num} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-bold uppercase tracking-wider ${
                    isActive ? 'text-blue-400' : isCompleted ? 'text-emerald-400' : 'text-slate-500'
                  }`}>
                    Step {item.num}
                  </span>
                  {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                </div>
                <div className={`h-1.5 rounded-full transition-all duration-300 ${
                  isActive ? 'bg-blue-500 shadow-sm shadow-blue-500/50' : isCompleted ? 'bg-emerald-500' : 'bg-slate-800'
                }`} />
                <span className="text-xs font-medium text-slate-300 hidden md:block truncate">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2-Column Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Wizard Steps */}
        <div className="lg:col-span-7 space-y-6">
          {/* STEP 1: SCOPE & CONTEXT */}
          {step === 1 && (
            <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-6 shadow-xl animate-in fade-in duration-200">
              <div className="border-b border-slate-800 pb-3">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-400" />
                  Step 1: Project Scope & Primary Jurisdiction
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Name your initiative and specify the primary geographic region where your data subjects reside.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>Project Title / Name *</span>
                    {attemptedNext && !isTitleValid && (
                      <span className="text-xs text-red-400 font-semibold flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> Required Field
                      </span>
                    )}
                  </label>
                  <InputWithSuggestions
                    id="onboarding-title-input"
                    value={formData.projectTitle}
                    onChangeValue={(val) => setFormData({ ...formData, projectTitle: val })}
                    suggestions={TITLE_SUGGESTIONS}
                    placeholder="e.g. Quest Diagnostics Cloud EHR Analytics"
                    className={`w-full bg-slate-950 border rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 ${
                      attemptedNext && !isTitleValid
                        ? 'border-red-500 bg-red-950/20 ring-2 ring-red-500/40'
                        : 'border-slate-700 focus:ring-blue-500'
                    }`}
                  />
                  {attemptedNext && !isTitleValid && (
                    <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      Please enter a project title to proceed.
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between w-full">
                      <span>Primary Region / Jurisdiction * (Multi-Select)</span>
                      {attemptedNext && !isJurisdictionValid ? (
                        <span className="text-xs text-red-400 font-semibold flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> Selection Required
                        </span>
                      ) : (
                        <span className="text-[11px] text-blue-300 font-medium">
                          {selectedRegionIds.length} region(s) selected
                        </span>
                      )}
                    </label>
                  </div>
                  <p className="text-[11px] text-slate-400 mb-3">
                    Select all primary operating regions applicable to this project (configured in your <strong>Company Profile</strong>):
                  </p>

                  <div className={`grid grid-cols-1 gap-3 p-1.5 rounded-2xl transition ${
                    attemptedNext && !isJurisdictionValid ? 'border-2 border-red-500 bg-red-950/20' : ''
                  }`}>
                    {(
                      !orgProfile?.activeOperatingJurisdictions?.length
                        ? ALL_JURISDICTION_OPTIONS
                        : ALL_JURISDICTION_OPTIONS.filter((opt) =>
                            orgProfile.activeOperatingJurisdictions.includes(opt.id)
                          )
                    ).map((opt) => {
                      const isSelected = selectedRegionIds.includes(opt.id);
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleToggleRegion(opt.id)}
                          className={`text-left p-4 rounded-xl border transition flex items-start space-x-3 ${
                            isSelected
                              ? 'bg-blue-600/20 border-blue-500 text-white shadow-md ring-1 ring-blue-500'
                              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                          }`}
                        >
                          <span className="text-2xl shrink-0 mt-0.5">{opt.flag}</span>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-100 flex items-center gap-2">
                                <span>{opt.title}</span>
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-blue-300 font-mono">
                                  {opt.frameworkName}
                                </span>
                                {isSelected ? (
                                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                                ) : (
                                  <Square className="w-4 h-4 text-slate-700 shrink-0" />
                                )}
                              </div>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                              {opt.desc}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {attemptedNext && !isJurisdictionValid && (
                    <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      Please select at least one Primary Region / Jurisdiction to proceed.
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleNextStep1}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl transition shadow-lg shadow-blue-600/30 flex items-center gap-2"
                >
                  <span>Continue to Step 2: Data Classification</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: DATA CLASSIFICATION & TYPE */}
          {step === 2 && (
            <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-6 shadow-xl animate-in fade-in duration-200">
              <div className="border-b border-slate-800 pb-3">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-blue-400" />
                  Step 2: Data Classification & Information Handled
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Select the real-world information your application handles. The engine will automatically determine legal classification categories for you.
                </p>
              </div>

              {attemptedNext && !isStep2Valid && (
                <div className="p-3 bg-red-950/40 border border-red-500/60 rounded-xl text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>Please select at least one type of information handled before continuing.</span>
                </div>
              )}

              {/* Part 1: Real-World Data Information Selector */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <h3 className="text-xs font-bold text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    1. Select Specific Information Handled by Your System
                  </h3>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {selectedItemIds.length} item(s) selected
                  </span>
                </div>

                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {['Health & Medical', 'Biometric & Sensitive', 'Identity & Contact', 'Financial & Billing', 'Minors & Education'].map((groupName) => {
                    const itemsInGroup = REAL_WORLD_DATA_ITEMS.filter((i) => i.group === groupName);
                    return (
                      <div key={groupName} className="space-y-2">
                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                          {groupName}
                        </span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {itemsInGroup.map((item) => {
                            const isSelected = selectedItemIds.includes(item.id);
                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => handleToggleRealWorldItem(item.id)}
                                className={`text-left px-3 py-2.5 rounded-xl border text-xs transition flex items-center justify-between ${
                                  isSelected
                                    ? 'bg-blue-600/25 border-blue-500 text-blue-100 font-medium shadow-inner'
                                    : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                                }`}
                              >
                                <span className="flex items-center gap-2 truncate">
                                  <span className="text-sm shrink-0">{item.icon}</span>
                                  <span className="truncate">{item.label}</span>
                                </span>
                                {isSelected ? (
                                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 ml-1" />
                                ) : (
                                  <Square className="w-3.5 h-3.5 text-slate-700 shrink-0 ml-1" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Part 2: Auto-Determined Legal Classification Categories */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    2. Auto-Determined Legal Classification Categories
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    (Auto-selected from your choices above)
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {[
                    {
                      id: 'PHI' as DataType,
                      icon: '🏥',
                      label: 'Protected Health Information (PHI)',
                      desc: 'Patient health records, clinical lab test results, medical diagnoses, treatment history, health insurance IDs.',
                    },
                    {
                      id: 'SENSITIVE_PII' as DataType,
                      icon: '🔐',
                      label: 'Sensitive PII / Special Category (GDPR Art. 9)',
                      desc: 'Biometric identifiers, genetic data, ethnic origin, political opinions, religious beliefs, trade union membership.',
                    },
                    {
                      id: 'STANDARD_PII' as DataType,
                      icon: '👤',
                      label: 'Standard PII / Contact Data',
                      desc: 'Full names, business email addresses, physical mailing addresses, IP addresses, user login accounts.',
                    },
                    {
                      id: 'FINANCIAL' as DataType,
                      icon: '💳',
                      label: 'Financial & Payment Data',
                      desc: 'Credit card numbers, bank account details, billing transactions, tax identifiers, credit ratings.',
                    },
                    {
                      id: 'CHILDREN' as DataType,
                      icon: '👶',
                      label: 'Child / Minor Data (Under 16/18)',
                      desc: 'Any personal information belonging to children or minors requiring parental consent (COPPA / GDPR Art. 8).',
                    },
                  ].map((item) => {
                    const isChecked = formData.dataTypes.includes(item.id);
                    const triggers = getTriggersForCategory(item.id, selectedItemIds);

                    return (
                      <div
                        key={item.id}
                        onClick={() => handleToggleDataType(item.id)}
                        className={`text-left p-3.5 rounded-xl border transition cursor-pointer ${
                          isChecked
                            ? 'bg-blue-600/20 border-blue-500 text-white shadow-md'
                            : 'bg-slate-900/60 border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-400'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <span className="text-xl shrink-0 mt-0.5">{item.icon}</span>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className={`text-xs font-bold ${isChecked ? 'text-slate-100' : 'text-slate-400'}`}>
                                {item.label}
                              </span>
                              {isChecked && (
                                <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-semibold border border-blue-400/40 flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3 text-blue-400" /> Auto-Active
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                              {item.desc}
                            </p>

                            {isChecked && triggers.length > 0 && (
                              <div className="mt-2 text-[11px] text-emerald-300 font-medium flex items-center gap-1.5 bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                                <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                                <span>Auto-selected based on: <strong>{triggers.join(', ')}</strong></span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-between pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm rounded-xl transition border border-slate-700 flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Step 1</span>
                </button>
                <button
                  type="button"
                  onClick={handleNextStep2}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl transition shadow-lg shadow-blue-600/30 flex items-center gap-2"
                >
                  <span>Continue to Step 3: Risk Criteria</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: RISK CRITERIA (CONDITIONAL) */}
          {step === 3 && (
            <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-6 shadow-xl animate-in fade-in duration-200">
              <div className="border-b border-slate-800 pb-3">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-400" />
                  Step 3: Risk Criteria & Regulatory Triggers
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Answer a few specific questions tailored to your selected jurisdiction ({formData.jurisdiction}).
                </p>
              </div>

              <div className="space-y-5">
                {(() => {
                  const hasEUSelection = formData.jurisdictions.includes('EU_EEA') || selectedRegionIds.some((id) => ['EU_EEA', 'UK', 'GERMANY', 'FRANCE'].includes(id));
                  const hasUSSelection = formData.jurisdictions.includes('US') || selectedRegionIds.includes('US');

                  return (
                    <>
                      {hasEUSelection && (
                        <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-3">
                          <span className="text-xs font-bold text-blue-300 uppercase tracking-wider block">
                            🇪🇺 GDPR Article 35 High-Risk Assessment Trigger
                          </span>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            Does your project involve processing likely to result in a high risk to individuals' rights and freedoms? (e.g. PHI/health records, automated profiling, systematic monitoring of public spaces, or large-scale AI processing)
                          </p>
                          <label className="flex items-center space-x-3 p-3 rounded-lg bg-slate-950 border border-slate-700 cursor-pointer hover:border-blue-500/50 transition">
                            <input
                              type="checkbox"
                              checked={formData.isHighRisk}
                              onChange={(e) => setFormData({ ...formData, isHighRisk: e.target.checked })}
                              className="rounded border-slate-700 bg-slate-900 text-blue-500 focus:ring-blue-500 w-4 h-4"
                            />
                            <span className="text-xs font-semibold text-slate-200">
                              Yes, this project involves high-risk processing (Health Records / Profiling / AI / Large Scale).
                            </span>
                          </label>
                        </div>
                      )}

                      {hasUSSelection && (
                        <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-3">
                          <span className="text-xs font-bold text-purple-300 uppercase tracking-wider block">
                            🇺🇸 US State Privacy Acts (CCPA / CPRA / VCDPA) Trigger
                          </span>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            Does your project handle consumer personal information subject to state privacy laws (e.g. California CPRA or Virginia VCDPA)?
                          </p>
                          <label className="flex items-center space-x-3 p-3 rounded-lg bg-slate-950 border border-slate-700 cursor-pointer hover:border-purple-500/50 transition">
                            <input
                              type="checkbox"
                              checked={formData.hasStateConsumerPii}
                              onChange={(e) => setFormData({ ...formData, hasStateConsumerPii: e.target.checked })}
                              className="rounded border-slate-700 bg-slate-900 text-purple-500 focus:ring-purple-500 w-4 h-4"
                            />
                            <span className="text-xs font-semibold text-slate-200">
                              Yes, handles US Consumer PII covered by CCPA/CPRA state privacy legislation.
                            </span>
                          </label>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>

              <div className="flex justify-between pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm rounded-xl transition border border-slate-700 flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Step 2</span>
                </button>
                <button
                  type="button"
                  onClick={handleNextStep3}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl transition shadow-lg shadow-blue-600/30 flex items-center gap-2"
                >
                  <span>Evaluate Framework Result →</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: RESULT & HANDOFF */}
          {step === 4 && (
            <div className="glass-panel rounded-2xl p-6 border border-blue-500/40 space-y-6 shadow-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-blue-950/30 animate-in fade-in duration-300">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                    <FileCheck className="w-6 h-6 text-emerald-400" />
                    Step 4: Determined Privacy Framework
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Based on your inputs, the decision engine has selected the optimal assessment module.
                  </p>
                </div>
                <div className={`px-3 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r ${result.badgeColor} shadow-md`}>
                  {result.badgeLabel}
                </div>
              </div>

              <div className="space-y-4">
                {result.isUnderDevelopment && (
                  <div className="p-4 bg-amber-950/60 border-2 border-amber-500/60 rounded-xl space-y-1.5 text-amber-200 shadow-lg">
                    <div className="flex items-center gap-2 font-bold text-xs text-amber-300 uppercase tracking-wider">
                      <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{result.title} Questions Under Development</span>
                    </div>
                    <p className="text-xs text-amber-300/90 leading-relaxed">
                      The specialized standalone questionnaire module for <strong>{result.title}</strong> is currently under active development. Proceeding will guide you through the primary 7-Step DPIA assessment engine configured for your project's regional and data handling parameters.
                    </p>
                  </div>
                )}

                <div className="bg-slate-950 p-4 rounded-xl border border-blue-500/30 space-y-2">
                  <h3 className="text-sm font-bold text-blue-300 flex items-center gap-2">
                    <span>{result.title}</span>
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {result.explanation}
                  </p>
                </div>

                <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Recommended Assessment Focus:
                  </span>
                  <ul className="space-y-1.5">
                    {result.recommendedSteps.map((rec, idx) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm rounded-xl transition border border-slate-700 flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Modify Answers</span>
                </button>
                <button
                  type="button"
                  onClick={handleFinish}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 hover:from-blue-500 hover:to-emerald-400 text-white font-extrabold text-sm rounded-xl transition shadow-xl shadow-blue-600/30 flex items-center gap-2 scale-105"
                  id="start-assessment-btn"
                >
                  <span>Start Assessment Engine →</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Plain English Guided Helper */}
        <div className="lg:col-span-5 lg:sticky lg:top-20">
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-300 uppercase tracking-wider border-b border-slate-800 pb-2.5">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span>Guided Plain-English Helper</span>
            </div>

            {step === 1 && (
              <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                <p className="font-semibold text-slate-200">
                  💡 Why does Jurisdiction matter?
                </p>
                <p className="text-slate-400">
                  Different countries enforce distinct privacy laws. For example, processing European patient data falls under strict GDPR rules, while US health data requires HIPAA compliance.
                </p>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[11px] text-slate-400">
                  <strong className="text-slate-200 block mb-1">Example Scenario:</strong>
                  If Quest Diagnostics launches an analytics pipeline for European lab results, select <strong>EU/EEA</strong> to trigger GDPR guidelines.
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                <p className="font-semibold text-slate-200">
                  💡 How do Data Types change the rules?
                </p>
                <p className="text-slate-400">
                  Collecting medical records (PHI) or biometrics triggers mandatory regulatory risk assessments under law, whereas standard contact emails require lighter baseline safeguards.
                </p>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[11px] text-slate-400">
                  <strong className="text-slate-200 block mb-1">Key Tip:</strong>
                  You can check multiple categories if your system processes both patient health info and standard billing emails!
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                <p className="font-semibold text-slate-200">
                  💡 What is a "High-Risk Activity"?
                </p>
                <p className="text-slate-400">
                  Under GDPR Article 35, high-risk activities include using Generative AI/LLMs to analyze user data, automated scoring, or tracking user locations at scale.
                </p>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                <p className="font-semibold text-slate-200">
                  💡 Ready to launch your assessment?
                </p>
                <p className="text-slate-400">
                  Clicking <strong>Start Assessment Engine</strong> initializes the primary 7-step assessment wizard with pre-populated project title and custom regulatory guidance!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
