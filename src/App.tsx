import React from 'react';
import type { DPIAFormData } from './types/dpia';
import { Header } from './components/Header';
import { StepNavigation } from './components/StepNavigation';
import { StepController } from './components/steps/StepController';
import { Step1NeedView } from './components/steps/Step1Need';
import { Step2ProcessingView } from './components/steps/Step2Processing';
import { Step3ConsultationView } from './components/steps/Step3Consultation';
import { Step4NecessityView } from './components/steps/Step4Necessity';
import { Step5Risks } from './components/steps/Step5Risks';
import { Step6Mitigations } from './components/steps/Step6Mitigations';
import { Step7SignOffView } from './components/steps/Step7SignOff';
import { LivePreviewModal } from './components/LivePreviewModal';
import { DPIADocumentView } from './components/DPIADocumentView';

import { OnboardingWizard } from './components/onboarding/OnboardingWizard';
import type { OnboardingPayload } from './types/onboarding';

import { OrganizationSettingsModal } from './components/OrganizationSettingsModal';
import { NewEvaluationModal } from './components/NewEvaluationModal';
import { AboutModal } from './components/AboutModal';
import { LoginPage } from './components/LoginPage';
import type { OrganizationProfile } from './types/organization';
import { getStoredOrgProfile, saveOrgProfile } from './types/organization';

const STORAGE_KEY = 'ICO_DPIA_WIZARD_STATE';
const ONBOARDING_KEY = 'ICO_ONBOARDING_PAYLOAD';

const defaultOrg = getStoredOrgProfile();

const initialFormData: DPIAFormData = {
  controllerDetails: {
    controllerName: defaultOrg.organizationName,
    dpoTitle: defaultOrg.dpoTitle,
    dpoContactName: defaultOrg.dpoContactName,
  },
  step1Need: {
    projectOverview: '',
    triggerReasons: [],
  },
  step2Processing: {
    nature: '',
    scope: '',
    context: '',
    purpose: '',
  },
  step3Consultation: {
    stakeholderConsultation: '',
    justificationIfNotConsulted: '',
  },
  step4Necessity: {
    lawfulBasis: [],
    lawfulBasisDetails: '',
    functionCreepPrevention: '',
    dataMinimizationAndQuality: '',
    individualRightsSupport: '',
    processorSafeguards: '',
    internationalTransfers: '',
  },
  step5Risks: [],
  step6Mitigations: [],
  step7SignOff: {
    measuresApprovedBy: `${defaultOrg.dpoContactName}, ${defaultOrg.dpoTitle}`,
    residualRisksApprovedBy: `${defaultOrg.dpoContactName}, ${defaultOrg.dpoTitle}`,
    dpoAdviceProvided: true,
    dpoAdviceSummary: '',
    dpoAdviceAccepted: 'Accepted',
    dpoOverruledReason: '',
    consultationReviewedBy: '',
    consultationDepartReason: '',
    reviewKeeper: `${defaultOrg.dpoContactName}, ${defaultOrg.dpoTitle}`,
  },
};

export function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(() => {
    try {
      return sessionStorage.getItem('quest_auth') === 'true';
    } catch {
      return false;
    }
  });

  const [currentStep, setCurrentStep] = React.useState<number>(0);
  const [isPreviewOpen, setIsPreviewOpen] = React.useState<boolean>(false);
  const [isOrgModalOpen, setIsOrgModalOpen] = React.useState<boolean>(false);
  const [isNewEvalModalOpen, setIsNewEvalModalOpen] = React.useState<boolean>(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = React.useState<boolean>(false);
  const [orgProfile, setOrgProfile] = React.useState<OrganizationProfile>(getStoredOrgProfile);

  const [showOnboarding, setShowOnboarding] = React.useState<boolean>(() => {
    try {
      const savedPayload = localStorage.getItem(ONBOARDING_KEY);
      return !savedPayload;
    } catch {
      return true;
    }
  });

  const [onboardingPayload, setOnboardingPayload] = React.useState<OnboardingPayload | null>(() => {
    try {
      const savedPayload = localStorage.getItem(ONBOARDING_KEY);
      return savedPayload ? JSON.parse(savedPayload) : null;
    } catch {
      return null;
    }
  });

  const [formData, setFormData] = React.useState<DPIAFormData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.controllerDetails?.controllerName === 'Apex Retail Solutions Ltd.') {
          localStorage.removeItem(STORAGE_KEY);
          return initialFormData;
        }
        return parsed;
      }
    } catch (e) {
      console.error('Failed to load form data from localStorage:', e);
    }
    return initialFormData;
  });

  const [lastSavedAt, setLastSavedAt] = React.useState<string>(() => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  });

  const updateFormData = (updated: DPIAFormData) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const toSave = { ...updated, lastSavedAt: timeStr };
    setFormData(toSave);
    setLastSavedAt(timeStr);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
      console.error('Failed to auto-save to localStorage:', e);
    }
  };

  const handleManualSave = () => {
    updateFormData(formData);
  };

  const handleSaveOrgProfile = (updated: OrganizationProfile) => {
    saveOrgProfile(updated);
    setOrgProfile(updated);

    // Auto-update controller details & sign-off fields if default
    updateFormData({
      ...formData,
      controllerDetails: {
        ...formData.controllerDetails,
        controllerName: updated.organizationName,
        dpoTitle: updated.dpoTitle,
        dpoContactName: updated.dpoContactName,
      },
      step7SignOff: {
        ...formData.step7SignOff,
        measuresApprovedBy: formData.step7SignOff.measuresApprovedBy || `${updated.dpoContactName}, ${updated.dpoTitle}`,
        residualRisksApprovedBy: formData.step7SignOff.residualRisksApprovedBy || `${updated.dpoContactName}, ${updated.dpoTitle}`,
        reviewKeeper: formData.step7SignOff.reviewKeeper || `${updated.dpoContactName}, ${updated.dpoTitle}`,
      },
    });
  };

  const handleOnboardingComplete = (payload: OnboardingPayload) => {
    console.log('Framework Determination Payload:', payload);
    setOnboardingPayload(payload);
    try {
      localStorage.setItem(ONBOARDING_KEY, JSON.stringify(payload));
    } catch (e) {
      console.error('Failed to save onboarding payload:', e);
    }

    // Auto pre-fill project overview if currently blank
    if (!formData.step1Need.projectOverview.trim()) {
      const overviewText = payload.projectTitle
        ? `${payload.projectTitle}\nJurisdiction: ${payload.jurisdiction}\nAssessment Mode: ${payload.assessmentTitle}\nRationale: ${payload.rationale}`
        : `Jurisdiction: ${payload.jurisdiction}\nAssessment Mode: ${payload.assessmentTitle}\nRationale: ${payload.rationale}`;
      updateFormData({
        ...formData,
        step1Need: {
          ...formData.step1Need,
          projectOverview: overviewText,
          projectName: payload.projectTitle || formData.step1Need.projectName || '',
        },
      });
    }

    setShowOnboarding(false);
  };

  const handleStartNewWizard = () => {
    updateFormData(initialFormData);
    setOnboardingPayload(null);
    try {
      localStorage.removeItem(ONBOARDING_KEY);
    } catch (e) {
      console.error('Failed to remove onboarding payload:', e);
    }
    setCurrentStep(0);
    setShowOnboarding(true);
  };

  const handleStartBlank = () => {
    updateFormData(initialFormData);
    setCurrentStep(0);
    setShowOnboarding(false);
  };

  const handleLoadBackup = (backup: { formData: DPIAFormData; onboardingPayload: OnboardingPayload | null }) => {
    if (backup.onboardingPayload) {
      setOnboardingPayload(backup.onboardingPayload);
      try {
        localStorage.setItem(ONBOARDING_KEY, JSON.stringify(backup.onboardingPayload));
      } catch (e) {
        console.error('Failed to save restored onboarding payload:', e);
      }
    }
    updateFormData(backup.formData);
    setCurrentStep(0);
    setShowOnboarding(false);
  };

  const renderActiveStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <StepController
            data={formData.controllerDetails}
            onChange={(controllerDetails) => updateFormData({ ...formData, controllerDetails })}
            onNext={() => setCurrentStep(1)}
            formData={formData}
            onboardingPayload={onboardingPayload}
          />
        );
      case 1:
        return (
          <Step1NeedView
            data={formData.step1Need}
            onChange={(step1Need) => updateFormData({ ...formData, step1Need })}
            onNext={() => setCurrentStep(2)}
            onPrev={() => setCurrentStep(0)}
            formData={formData}
            onboardingPayload={onboardingPayload}
          />
        );
      case 2:
        return (
          <Step2ProcessingView
            data={formData.step2Processing}
            onChange={(step2Processing) => updateFormData({ ...formData, step2Processing })}
            onNext={() => setCurrentStep(3)}
            onPrev={() => setCurrentStep(1)}
            formData={formData}
            onboardingPayload={onboardingPayload}
          />
        );
      case 3:
        return (
          <Step3ConsultationView
            data={formData.step3Consultation}
            onChange={(step3Consultation) => updateFormData({ ...formData, step3Consultation })}
            onNext={() => setCurrentStep(4)}
            onPrev={() => setCurrentStep(2)}
            formData={formData}
            onboardingPayload={onboardingPayload}
          />
        );
      case 4:
        return (
          <Step4NecessityView
            data={formData.step4Necessity}
            onChange={(step4Necessity) => updateFormData({ ...formData, step4Necessity })}
            onNext={() => setCurrentStep(5)}
            onPrev={() => setCurrentStep(3)}
            formData={formData}
            onboardingPayload={onboardingPayload}
          />
        );
      case 5:
        return (
          <Step5Risks
            risks={formData.step5Risks}
            onChange={(step5Risks) => updateFormData({ ...formData, step5Risks })}
            onNext={() => setCurrentStep(6)}
            onPrev={() => setCurrentStep(4)}
            formData={formData}
            onboardingPayload={onboardingPayload}
          />
        );
      case 6:
        return (
          <Step6Mitigations
            risks={formData.step5Risks}
            mitigations={formData.step6Mitigations}
            onChange={(step6Mitigations) => updateFormData({ ...formData, step6Mitigations })}
            onNext={() => setCurrentStep(7)}
            onPrev={() => setCurrentStep(5)}
            formData={formData}
            onboardingPayload={onboardingPayload}
          />
        );
      case 7:
        return (
          <Step7SignOffView
            data={formData.step7SignOff}
            onChange={(step7SignOff) => updateFormData({ ...formData, step7SignOff })}
            onPrev={() => setCurrentStep(6)}
            onOpenPreview={() => setIsPreviewOpen(true)}
          />
        );
      default:
        return null;
    }
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header
        formData={formData}
        onboardingPayload={onboardingPayload}
        orgProfile={orgProfile}
        onOpenNewEvaluation={() => setIsNewEvalModalOpen(true)}
        onOpenPreview={() => setIsPreviewOpen(true)}
        onOpenOnboarding={() => setShowOnboarding(true)}
        onOpenOrgSettings={() => setIsOrgModalOpen(true)}
        onOpenAbout={() => setIsAboutModalOpen(true)}
        onSaveManual={handleManualSave}
        onLogout={() => {
          sessionStorage.removeItem('quest_auth');
          setIsAuthenticated(false);
        }}
        lastSavedAt={lastSavedAt}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8 flex flex-col lg:flex-row gap-6">
        {showOnboarding ? (
          <div className="w-full">
            <OnboardingWizard onComplete={handleOnboardingComplete} orgProfile={orgProfile} />
          </div>
        ) : (
          <>
            <aside className="w-full lg:w-72 shrink-0">
              <StepNavigation
                currentStep={currentStep}
                onSelectStep={(stepId) => setCurrentStep(stepId)}
                formData={formData}
                onboardingPayload={onboardingPayload}
              />
            </aside>

            <section className="flex-1 min-w-0">
              {renderActiveStep()}
            </section>
          </>
        )}
      </main>

      <LivePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        formData={formData}
        onboardingPayload={onboardingPayload}
      />

      <OrganizationSettingsModal
        isOpen={isOrgModalOpen}
        onClose={() => setIsOrgModalOpen(false)}
        profile={orgProfile}
        onSave={handleSaveOrgProfile}
      />

      <NewEvaluationModal
        isOpen={isNewEvalModalOpen}
        onClose={() => setIsNewEvalModalOpen(false)}
        formData={formData}
        onboardingPayload={onboardingPayload}
        onStartNewWizard={handleStartNewWizard}
        onStartBlank={handleStartBlank}
        onLoadBackup={handleLoadBackup}
      />

      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />

      {/* Offscreen element for canvas capturing anytime PDF Export is clicked */}
      <div className="fixed -left-[9999px] top-0 opacity-0 pointer-events-none print:static print:opacity-100 print:left-0">
        <DPIADocumentView formData={formData} id="dpia-document-preview" />
      </div>
    </div>
  );
}

export default App;
