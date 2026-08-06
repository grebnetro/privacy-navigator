export type Jurisdiction = 'US' | 'EU_EEA' | 'GLOBAL';

export type DataType = 
  | 'PHI' 
  | 'SENSITIVE_PII' 
  | 'STANDARD_PII' 
  | 'FINANCIAL' 
  | 'CHILDREN';

export type AssessmentType = 
  | 'HIPAA' 
  | 'DPIA' 
  | 'PIA' 
  | 'US_STATE' 
  | 'GLOBAL_REGIONAL' 
  | 'GENERIC';

export interface OnboardingState {
  projectTitle: string;
  jurisdiction: Jurisdiction;
  jurisdictions: Jurisdiction[];
  jurisdictionRegionIds: string[];
  dataTypes: DataType[];
  isHighRisk: boolean;
  hasStateConsumerPii: boolean;
  regionalFramework?: string;
}

export interface OnboardingPayload {
  projectId: string;
  projectTitle: string;
  jurisdiction: Jurisdiction;
  jurisdictions: Jurisdiction[];
  jurisdictionRegionIds: string[];
  dataTypes: DataType[];
  isHighRisk: boolean;
  determinedAssessmentType: AssessmentType;
  assessmentTitle: string;
  rationale: string;
  timestamp: string;
}
