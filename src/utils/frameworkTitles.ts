export interface FrameworkTitles {
  navStep1Title: string;
  navStep1Subtitle: string;
  navStep2Title: string;
  navStep3Title: string;
  navStep4Title: string;
  navStep5Title: string;
  navStep6Title: string;
  navStep7Title: string;
  controllerNextButton: string;
  step1Header: string;
  step1TriggerLabel: string;
  step1NextButton: string;
  step2Header: string;
  step3Header: string;
  step4Header: string;
  step5Header: string;
  step6Header: string;
  step7Header: string;
  officerRoleName: string;
}

export function getFrameworkTitles(assessmentType?: string): FrameworkTitles {
  if (assessmentType === 'HIPAA') {
    return {
      navStep1Title: 'Step 1: Need for HIPAA Assessment',
      navStep1Subtitle: 'Aims & HIPAA Triggers',
      navStep2Title: 'Step 2: PHI Processing',
      navStep3Title: 'Step 3: Consultation',
      navStep4Title: 'Step 4: Permitted Uses',
      navStep5Title: 'Step 5: Security Risk Analysis',
      navStep6Title: 'Step 6: Safeguards & Controls',
      navStep7Title: 'Step 7: Security Sign Off',
      controllerNextButton: 'Continue to Step 1: Need for HIPAA Assessment →',
      step1Header: 'Step 1: Identify the Need for a HIPAA Security Assessment',
      step1TriggerLabel: '1.2 Select Key HIPAA & Security Rule Trigger Criteria',
      step1NextButton: 'Continue to Step 2: PHI Processing →',
      step2Header: 'Step 2: Describe PHI Processing & Data Flow',
      step3Header: 'Step 3: Business Associate & Workforce Consultation',
      step4Header: 'Step 4: HIPAA Permitted Uses & Safeguards',
      step5Header: 'Step 5: Identify and Assess HIPAA Security Risks',
      step6Header: 'Step 6: Identify Technical & Administrative Safeguards',
      step7Header: 'Step 7: HIPAA Security Officer Sign-Off & Approvals',
      officerRoleName: 'HIPAA Privacy & Security Officer',
    };
  }

  if (assessmentType === 'US_STATE') {
    return {
      navStep1Title: 'Step 1: Need for State PIA',
      navStep1Subtitle: 'Aims & CPRA Triggers',
      navStep2Title: 'Step 2: Consumer Data Processing',
      navStep3Title: 'Step 3: Consultation',
      navStep4Title: 'Step 4: Consumer Rights',
      navStep5Title: 'Step 5: Identify Privacy Risks',
      navStep6Title: 'Step 6: Reduce Privacy Risks',
      navStep7Title: 'Step 7: Privacy Sign Off',
      controllerNextButton: 'Continue to Step 1: Need for State PIA →',
      step1Header: 'Step 1: Identify the Need for a US State Privacy Impact Assessment',
      step1TriggerLabel: '1.2 Select Key CPRA & State Privacy Act Triggers',
      step1NextButton: 'Continue to Step 2: Consumer Data Processing →',
      step2Header: 'Step 2: Describe Consumer Data Processing',
      step3Header: 'Step 3: Stakeholder & Consumer Consultation',
      step4Header: 'Step 4: Consumer Rights & Opt-Out Safeguards',
      step5Header: 'Step 5: Identify Consumer Privacy Risks',
      step6Header: 'Step 6: Identify Technical & Contractual Safeguards',
      step7Header: 'Step 7: Privacy Officer Sign-Off & CPRA Approvals',
      officerRoleName: 'Privacy Officer',
    };
  }

  // Default: GDPR Article 35 DPIA
  return {
    navStep1Title: 'Step 1: Need for DPIA',
    navStep1Subtitle: 'Aims & Triggers',
    navStep2Title: 'Step 2: Processing',
    navStep3Title: 'Step 3: Consultation',
    navStep4Title: 'Step 4: Necessity',
    navStep5Title: 'Step 5: Identify Risks',
    navStep6Title: 'Step 6: Reduce Risks',
    navStep7Title: 'Step 7: Sign Off',
    controllerNextButton: 'Continue to Step 1: Need for DPIA →',
    step1Header: 'Step 1: Identify the Need for a Data Protection Impact Assessment (DPIA)',
    step1TriggerLabel: '1.2 Select Key DPIA Trigger Criteria',
    step1NextButton: 'Continue to Step 2: Processing →',
    step2Header: 'Step 2: Describe the Processing Activity',
    step3Header: 'Step 3: Stakeholder & User Consultation',
    step4Header: 'Step 4: Necessity & Proportionality Safeguards',
    step5Header: 'Step 5: Identify and Assess Privacy Risks',
    step6Header: 'Step 6: Identify Measures to Reduce Risk',
    step7Header: 'Step 7: DPO Advice & Executive Sign Off',
    officerRoleName: 'Data Protection Officer (DPO)',
  };
}
