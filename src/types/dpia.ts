export type Likelihood = 'Remote' | 'Possible' | 'Probable';
export type Severity = 'Minimal' | 'Significant' | 'Severe';
export type RiskLevel = 'Low' | 'Medium' | 'High';
export type EffectOnRisk = 'Eliminated' | 'Reduced' | 'Accepted';
export type LawfulBasisType = 
  | 'Consent' 
  | 'Contract' 
  | 'Legal obligation' 
  | 'Vital interests' 
  | 'Public task' 
  | 'Legitimate interests';

export interface ControllerDetails {
  controllerName: string;
  dpoTitle: string;
  dpoContactName: string;
}

export interface Step1Need {
  projectName?: string;
  projectOverview: string;
  triggerReasons: string[];
}

export interface Step2Processing {
  nature: string;
  scope: string;
  context: string;
  purpose: string;
}

export interface Step3Consultation {
  stakeholderConsultation: string;
  justificationIfNotConsulted: string;
}

export interface Step4Necessity {
  lawfulBasis: LawfulBasisType[];
  lawfulBasisDetails: string;
  functionCreepPrevention: string;
  dataMinimizationAndQuality: string;
  individualRightsSupport: string;
  processorSafeguards: string;
  internationalTransfers: string;
}

export interface Step5RiskItem {
  id: string;
  riskDescription: string;
  likelihood: Likelihood;
  severity: Severity;
  overallRisk: RiskLevel;
}

export interface Step6MitigationItem {
  id: string;
  riskId: string;
  riskDescription: string;
  mitigationOptions: string;
  effectOnRisk: EffectOnRisk;
  residualRisk: RiskLevel;
  measureApproved: boolean;
}

export interface Step7SignOff {
  measuresApprovedBy: string;
  residualRisksApprovedBy: string;
  dpoAdviceProvided: boolean;
  dpoAdviceSummary: string;
  dpoAdviceAccepted: 'Accepted' | 'Overruled';
  dpoOverruledReason: string;
  consultationReviewedBy: string;
  consultationDepartReason: string;
  reviewKeeper: string;
}

export interface DPIAFormData {
  controllerDetails: ControllerDetails;
  step1Need: Step1Need;
  step2Processing: Step2Processing;
  step3Consultation: Step3Consultation;
  step4Necessity: Step4Necessity;
  step5Risks: Step5RiskItem[];
  step6Mitigations: Step6MitigationItem[];
  step7SignOff: Step7SignOff;
  lastSavedAt?: string;
}

export interface GuidanceItem {
  questionKey: string;
  title: string;
  whyThisExists: string;
  plainEnglishExplanation: string;
  realWorldExample: string;
  commonPitfalls: string[];
  starterBulletPoints: string[];
}
