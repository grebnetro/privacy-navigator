import React from 'react';
import { 
  Building2, 
  Search, 
  Workflow, 
  Users, 
  Scale, 
  AlertTriangle, 
  ShieldCheck, 
  FileSignature,
  CheckCircle2,
  Lock
} from 'lucide-react';
import type { DPIAFormData } from '../types/dpia';
import { validateStep, canNavigateToStep } from '../utils/stepValidation';

import type { OnboardingPayload } from '../types/onboarding';
import { getFrameworkTitles } from '../utils/frameworkTitles';

export interface StepDef {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ElementType;
}

interface StepNavigationProps {
  currentStep: number;
  onSelectStep: (stepId: number) => void;
  formData: DPIAFormData;
  onboardingPayload?: OnboardingPayload | null;
}

export const StepNavigation: React.FC<StepNavigationProps> = ({
  currentStep,
  onSelectStep,
  formData,
  onboardingPayload,
}) => {
  const titles = getFrameworkTitles(onboardingPayload?.determinedAssessmentType);

  const stepsList: StepDef[] = [
    { id: 0, title: 'Controller Details', subtitle: `Organization & ${titles.officerRoleName}`, icon: Building2 },
    { id: 1, title: titles.navStep1Title, subtitle: titles.navStep1Subtitle, icon: Search },
    { id: 2, title: titles.navStep2Title, subtitle: 'Nature, Scope, Context, Purpose', icon: Workflow },
    { id: 3, title: titles.navStep3Title, subtitle: 'Stakeholder & User Input', icon: Users },
    { id: 4, title: titles.navStep4Title, subtitle: 'Lawful Basis & Minimization', icon: Scale },
    { id: 5, title: titles.navStep5Title, subtitle: 'Risk Assessment Grid', icon: AlertTriangle },
    { id: 6, title: titles.navStep6Title, subtitle: 'Mitigation Safeguards', icon: ShieldCheck },
    { id: 7, title: titles.navStep7Title, subtitle: 'Approvals & Sign Off', icon: FileSignature },
  ];
  const isStepComplete = (stepId: number): boolean => {
    return validateStep(stepId, formData).isValid;
  };

  const completedCount = stepsList.filter((s) => isStepComplete(s.id)).length;
  const progressPercent = Math.round((completedCount / stepsList.length) * 100);

  return (
    <div className="w-full lg:w-72 glass-panel rounded-2xl p-4 flex flex-col gap-4 border border-slate-800 shadow-xl">
      <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Progress
          </span>
          <span className="text-xs font-bold text-blue-400">
            {completedCount}/{stepsList.length} Steps ({progressPercent}%)
          </span>
        </div>
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <nav className="flex flex-col space-y-1" id="step-navigation-menu">
        {stepsList.map((step) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const complete = isStepComplete(step.id);
          const isAccessible = canNavigateToStep(step.id, formData);

          return (
            <button
              key={step.id}
              onClick={() => isAccessible && onSelectStep(step.id)}
              disabled={!isAccessible}
              title={!isAccessible ? 'Complete preceding required steps first' : ''}
              className={`w-full text-left p-3 rounded-xl transition flex items-center justify-between group ${
                isActive
                  ? 'bg-blue-600/20 text-white border border-blue-500/40 shadow-inner'
                  : isAccessible
                  ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                  : 'text-slate-600 opacity-50 border border-transparent cursor-not-allowed'
              }`}
              id={`nav-step-${step.id}`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`p-2 rounded-lg transition ${
                    isActive
                      ? 'bg-blue-500 text-white shadow-md shadow-blue-500/30'
                      : complete
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : isAccessible
                      ? 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
                      : 'bg-slate-900 text-slate-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold tracking-tight">
                    {step.title}
                  </div>
                  <div className="text-[11px] text-slate-400 font-normal">
                    {step.subtitle}
                  </div>
                </div>
              </div>

              {complete ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : !isAccessible ? (
                <Lock className="w-3.5 h-3.5 text-slate-600 shrink-0" />
              ) : null}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
