import type { OnboardingState, AssessmentType, OnboardingPayload } from '../types/onboarding';

export interface DecisionResult {
  assessmentType: AssessmentType;
  title: string;
  badgeLabel: string;
  badgeColor: string;
  summary: string;
  explanation: string;
  recommendedSteps: string[];
  isUnderDevelopment?: boolean;
}

export function determineAssessmentFramework(state: OnboardingState): DecisionResult {
  const { dataTypes, isHighRisk, hasStateConsumerPii } = state;

  const regionIds = state.jurisdictionRegionIds || [];
  const codes = state.jurisdictions || (state.jurisdiction ? [state.jurisdiction] : []);

  const hasEU = codes.includes('EU_EEA') || regionIds.some((id) => ['EU_EEA', 'UK', 'GERMANY', 'FRANCE'].includes(id));
  const hasUS = codes.includes('US') || regionIds.includes('US');
  const hasGlobalOrCanada = codes.includes('GLOBAL') || regionIds.some((id) => ['CANADA', 'BRAZIL', 'AUSTRALIA'].includes(id));

  const hasPHI = dataTypes.includes('PHI');
  const hasSensitivePII = dataTypes.includes('SENSITIVE_PII');
  const hasChildrenData = dataTypes.includes('CHILDREN');

  // Rule 1: Multi-Region EU/UK + US + PHI / High-Risk -> Combined GDPR Article 35 DPIA & HIPAA Security Analysis
  if (hasEU && hasUS && (hasPHI || hasSensitivePII || isHighRisk || hasChildrenData)) {
    return {
      assessmentType: 'DPIA',
      title: 'GDPR Article 35 DPIA & US HIPAA Assessment',
      badgeLabel: '🛡️ GDPR DPIA (Article 35) & US HIPAA',
      badgeColor: 'from-blue-600 via-indigo-600 to-cyan-500',
      summary: 'Mandatory Article 35 DPIA under EU/UK GDPR + US HIPAA Security Rule analysis for PHI.',
      explanation:
        'Your project operates across multiple jurisdictions including the European Union / UK and the United States, processing Protected Health Information (PHI) and sensitive data. European GDPR Article 35 requires a mandatory Data Protection Impact Assessment (DPIA), while US HIPAA Security Rule mandates a Security Risk Analysis.',
      recommendedSteps: [
        'Document controller details and appoint Data Protection Officer (DPO).',
        'Analyze GDPR Article 6 & Article 9 lawful bases alongside HIPAA BAA safeguards.',
        'Evaluate technical risk mitigations (AES-256, MFA, zero-retention DPAs).',
        'Record formal DPO advice and executive sign-off prior to project launch.',
      ],
    };
  }

  // Rule 2: EU/EEA or UK + High Risk / PHI / Sensitive PII -> GDPR DPIA (Article 35)
  if (hasEU && (hasPHI || isHighRisk || hasSensitivePII || hasChildrenData)) {
    return {
      assessmentType: 'DPIA',
      title: 'GDPR Data Protection Impact Assessment (DPIA)',
      badgeLabel: '🛡️ GDPR DPIA (Article 35)',
      badgeColor: 'from-blue-600 to-emerald-600',
      summary: 'Mandatory under GDPR Article 35 for high-risk processing activities in the EU/UK.',
      explanation:
        'Your project operates in the EU/EEA or UK and involves processing activities likely to result in a high risk to individuals\' rights and freedoms (e.g. PHI/health data, new technologies, or automated profiling). Article 35 of the European GDPR requires a full 7-step Data Protection Impact Assessment before processing begins.',
      recommendedSteps: [
        'Document controller details and appoint Data Protection Officer (DPO).',
        'Analyze lawful basis, data minimization, and technical risk mitigations.',
        'Record formal DPO advice and executive sign-off prior to project launch.',
      ],
    };
  }

  // Rule 3: EU/EEA or UK + Standard PII -> Standard GDPR PIA
  if (hasEU) {
    return {
      assessmentType: 'PIA',
      title: 'Standard GDPR Privacy Impact Assessment (PIA)',
      badgeLabel: '📋 Standard GDPR PIA',
      badgeColor: 'from-blue-500 to-indigo-500',
      summary: 'Best practice privacy assessment for standard personal data processing in the EU/UK.',
      explanation:
        'Your project operates under European data protection laws. A GDPR Privacy Impact Assessment (PIA) ensures compliance with core data protection principles like lawfulness, transparency, and data minimization.',
      recommendedSteps: [
        'Confirm lawful basis under GDPR Article 6.',
        'Review privacy notices and data subject rights procedures.',
        'Ensure standard Data Processing Agreements (DPAs) are signed with sub-processors.',
      ],
      isUnderDevelopment: true,
    };
  }

  // Rule 4: US ONLY (No EU/UK) + PHI -> HIPAA Security & Privacy Risk Analysis
  if (hasUS && hasPHI && !hasEU) {
    return {
      assessmentType: 'HIPAA',
      title: 'HIPAA Security & Privacy Risk Assessment',
      badgeLabel: '🏥 HIPAA Security Risk Analysis',
      badgeColor: 'from-cyan-500 to-blue-600',
      summary: 'Required for processing Protected Health Information (PHI) under US Federal Law (HIPAA 45 CFR § 164.308).',
      explanation:
        'Your project operates in the United States and processes Protected Health Information (PHI). Under the US Health Insurance Portability and Accountability Act (HIPAA), covered entities and business associates must perform a mandatory Security & Privacy Risk Analysis.',
      recommendedSteps: [
        'Evaluate Business Associate Agreements (BAAs) with third-party vendors.',
        'Review HIPAA Security Rule administrative, physical, and technical safeguards.',
        'Verify minimum necessary disclosure rules and patient access rights.',
      ],
      isUnderDevelopment: true,
    };
  }

  // Rule 5: US ONLY + State Consumer PII -> US State PIA (CCPA/CPRA)
  if (hasUS && (hasStateConsumerPii || hasSensitivePII || hasChildrenData)) {
    return {
      assessmentType: 'US_STATE',
      title: 'US State Privacy Impact Assessment (CCPA / CPRA / VCDPA)',
      badgeLabel: '🏛️ US State PIA (CCPA/CPRA)',
      badgeColor: 'from-purple-500 to-indigo-600',
      summary: 'Required for high-risk processing of US state consumer data under CCPA/CPRA and state privacy laws.',
      explanation:
        'Your project processes personal information of US residents covered by state-level privacy acts (such as California CCPA/CPRA or Virginia VCDPA). State regulations mandate documented Risk Assessments.',
      recommendedSteps: [
        'Assess consumer opt-out mechanisms ("Do Not Sell or Share My Personal Info").',
        'Verify sensitive data usage limits and data retention disclosure requirements.',
        'Validate vendor service provider contracts under CPRA rules.',
      ],
      isUnderDevelopment: true,
    };
  }

  // Rule 6: Global/Other Regional (PIPEDA, LGPD) -> Regional Privacy Assessment
  if (hasGlobalOrCanada || hasSensitivePII || hasPHI || hasChildrenData) {
    return {
      assessmentType: 'GLOBAL_REGIONAL',
      title: 'Global & Regional Privacy Impact Assessment',
      badgeLabel: '🌐 Global Regional Assessment',
      badgeColor: 'from-emerald-500 to-teal-600',
      summary: 'Tailored privacy assessment for international data protection frameworks (LGPD, PIPEDA, APPI).',
      explanation:
        'Your project processes data internationally across global jurisdictions (such as Brazil LGPD, Canada PIPEDA, or Australia Privacy Act).',
      recommendedSteps: [
        'Identify applicable national data protection authorities.',
        'Review international transfer mechanisms (SCCs, Adequacy, BCRs).',
        'Formulate global data retention and data subject access workflows.',
      ],
      isUnderDevelopment: true,
    };
  }

  // Fallback Rule: Standard Best Practice Privacy Assessment
  return {
    assessmentType: 'GENERIC',
    title: 'Standard Best Practice Privacy Assessment',
    badgeLabel: '✨ Best Practice Assessment',
    badgeColor: 'from-slate-600 to-blue-600',
    summary: 'Universal privacy risk framework based on global ISO/IEC 27701 and Privacy-by-Design principles.',
    explanation:
      'Your project involves standard data processing. A Best Practice Privacy Assessment evaluates privacy risks using internationally recognized Privacy-by-Design principles.',
    recommendedSteps: [
      'Document data flows and storage boundaries.',
      'Verify encryption at rest and in transit.',
      'Establish incident response and user notice procedures.',
    ],
    isUnderDevelopment: true,
  };
}

export function generatePayload(state: OnboardingState): OnboardingPayload {
  const result = determineAssessmentFramework(state);
  const primaryJurisdiction = state.jurisdictions?.[0] || state.jurisdiction || 'GLOBAL';
  return {
    projectId: `proj-${Date.now()}`,
    projectTitle: state.projectTitle || '',
    jurisdiction: primaryJurisdiction,
    jurisdictions: state.jurisdictions?.length ? state.jurisdictions : [primaryJurisdiction],
    jurisdictionRegionIds: state.jurisdictionRegionIds || [],
    dataTypes: state.dataTypes,
    isHighRisk: state.isHighRisk,
    determinedAssessmentType: result.assessmentType,
    assessmentTitle: result.title,
    rationale: result.summary,
    timestamp: new Date().toISOString(),
  };
}
