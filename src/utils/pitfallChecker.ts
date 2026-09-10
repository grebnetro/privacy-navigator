/**
 * Pitfall Detection Engine
 * 
 * Evaluates user-entered text against known privacy assessment pitfalls
 * and returns actionable warnings that must be resolved before advancing.
 */

export interface PitfallViolation {
  id: string;
  pitfallDescription: string;
  suggestion: string;
  fieldLabel: string;
}

interface PitfallRule {
  id: string;
  pitfallDescription: string;
  suggestion: string;
  fieldLabel: string;
  detect: (text: string, context?: Record<string, unknown>) => boolean;
}

function lacksAny(text: string, keywords: string[]): boolean {
  const lower = text.toLowerCase();
  return !keywords.some((kw) => lower.includes(kw.toLowerCase()));
}

function containsAny(text: string, keywords: string[]): boolean {
  const lower = text.toLowerCase();
  return keywords.some((kw) => lower.includes(kw.toLowerCase()));
}

// ─── Step 1: Need for DPIA ───
const STEP1_RULES: PitfallRule[] = [
  {
    id: 's1-vague-jargon',
    pitfallDescription: 'Uses overly technical jargon that obscures how personal data is used.',
    suggestion: 'Rewrite in plain language — explain what data is collected and why, as if describing it to a non-technical colleague.',
    fieldLabel: 'Project Overview',
    detect: (text) => {
      const jargonTerms = ['api endpoint', 'microservice', 'kubernetes', 'docker', 'ci/cd', 'webhook', 'oauth token', 'jwt', 'graphql mutation'];
      const hasJargon = containsAny(text, jargonTerms);
      const lacksPlainDesc = lacksAny(text, ['collect', 'personal', 'data', 'user', 'patient', 'customer', 'information']);
      return hasJargon && lacksPlainDesc;
    },
  },
  {
    id: 's1-no-trigger',
    pitfallDescription: 'Does not specify why a DPIA was triggered.',
    suggestion: 'Select at least one trigger reason checkbox below (e.g., new technology, sensitive data, large-scale processing).',
    fieldLabel: 'Trigger Reasons',
    detect: (_text, context) => {
      const triggers = (context?.triggerReasons as string[]) ?? [];
      return triggers.length === 0;
    },
  },
];

// ─── Step 2.1: Nature of Processing ───
const STEP2_NATURE_RULES: PitfallRule[] = [
  {
    id: 's2n-no-vendor',
    pitfallDescription: 'Forgetting to mention third-party APIs or cloud sub-processors.',
    suggestion: 'Specify any third-party services, APIs, cloud providers, or sub-processors involved in data handling (e.g., AWS, Stripe, OpenAI).',
    fieldLabel: 'Nature of Processing',
    detect: (text) => {
      if (text.length < 30) return false;
      return lacksAny(text, ['vendor', 'sub-processor', 'third-party', 'third party', 'api', 'cloud', 'aws', 'azure', 'google cloud', 'stripe', 'processor', 'provider', 'service']);
    },
  },
  {
    id: 's2n-no-deletion',
    pitfallDescription: 'Omitting how long data is stored before being deleted.',
    suggestion: 'Include a data retention/deletion timeline (e.g., "purged after 3 years", "deleted upon account closure").',
    fieldLabel: 'Nature of Processing',
    detect: (text) => {
      if (text.length < 30) return false;
      return lacksAny(text, ['delet', 'purg', 'remov', 'retain', 'retention', 'expir', 'year', 'month', 'day', 'destroy', 'lifecycle', 'dispose']);
    },
  },
];

// ─── Step 2.2: Scope of Processing ───
const STEP2_SCOPE_RULES: PitfallRule[] = [
  {
    id: 's2s-no-volume',
    pitfallDescription: 'Not specifying the number of affected individuals.',
    suggestion: 'Include an estimate of how many people are affected (e.g., "approximately 50,000 patients").',
    fieldLabel: 'Scope of Processing',
    detect: (text) => {
      if (text.length < 20) return false;
      const hasNumber = /\d{2,}/.test(text) || containsAny(text, ['thousand', 'million', 'hundred', 'approximate', 'estimated', 'all employees', 'all patients', 'all customers']);
      return !hasNumber;
    },
  },
  {
    id: 's2s-no-special-cat',
    pitfallDescription: 'Not identifying whether special category or sensitive data is involved.',
    suggestion: 'Explicitly state whether health, biometric, genetic, racial, financial, or children\'s data is processed — or confirm "no special category data."',
    fieldLabel: 'Scope of Processing',
    detect: (text) => {
      if (text.length < 20) return false;
      return lacksAny(text, ['special category', 'health', 'biometric', 'genetic', 'racial', 'financial', 'sensitive', 'phi', 'pii', 'children', 'none', 'no special', 'not applicable', 'n/a', 'lab result', 'medical', 'clinical']);
    },
  },
];

// ─── Step 2.3: Context of Processing ───
const STEP2_CONTEXT_RULES: PitfallRule[] = [
  {
    id: 's2c-confused-users',
    pitfallDescription: 'Confusing software operators (employees using the app) with Data Subjects (whose data is stored).',
    suggestion: 'Clarify who the Data Subjects are — the individuals whose data is collected and processed (e.g., "Patients", "Customers"), not staff operating the software.',
    fieldLabel: 'Context & Data Subjects',
    detect: (text) => {
      const lower = text.toLowerCase();
      const confusingPhrases = ['users of the app', 'our team uses', 'staff use the system', 'employees use', 'we use the app', 'operator'];
      return containsAny(lower, confusingPhrases);
    },
  },
  {
    id: 's2c-no-vulnerable',
    pitfallDescription: 'Overlooking whether vulnerable populations (patients, children, elderly) are involved.',
    suggestion: 'Explicitly state whether any vulnerable groups are involved — or confirm "no vulnerable individuals or minors are included."',
    fieldLabel: 'Context & Data Subjects',
    detect: (text) => {
      if (text.length < 20) return false;
      return lacksAny(text, ['child', 'minor', 'vulnerab', 'patient', 'elder', 'no children', 'no minors', 'adult', 'no vulnerable', 'over 18', '18+']);
    },
  },
];

// ─── Step 2.4: Purpose of Processing ───
const STEP2_PURPOSE_RULES: PitfallRule[] = [
  {
    id: 's2p-vague-purpose',
    pitfallDescription: 'Vague statements like "to improve user experience" without concrete, measurable benefits.',
    suggestion: 'Replace vague goals with specific outcomes (e.g., "reducing wait times from 15 minutes to 30 seconds" or "lowering operational costs by 30%").',
    fieldLabel: 'Purpose of Processing',
    detect: (text) => {
      const vaguePatterns = ['improve user experience', 'better service', 'enhance performance', 'improve efficiency', 'make things better', 'streamline operations'];
      const hasVague = containsAny(text, vaguePatterns);
      const hasSpecifics = /\d+%|\d+ (minute|second|hour|day|percent)/.test(text) || containsAny(text, ['reduce', 'lower', 'faster', 'automate', 'eliminate', 'prevent']);
      return hasVague && !hasSpecifics;
    },
  },
  {
    id: 's2p-no-user-benefit',
    pitfallDescription: 'Focusing solely on organizational profit while ignoring the benefit to the Data Subject.',
    suggestion: 'Include at least one concrete benefit for the Data Subject (e.g., "patients receive results within hours instead of days").',
    fieldLabel: 'Purpose of Processing',
    detect: (text) => {
      if (text.length < 30) return false;
      const hasOrgBenefit = containsAny(text, ['cost', 'profit', 'revenue', 'savings', 'efficiency', 'overhead', 'budget']);
      const hasUserBenefit = containsAny(text, ['patient', 'customer', 'user benefit', 'faster for', 'receive', 'access', 'wait time', 'convenience', 'individual', 'data subject']);
      return hasOrgBenefit && !hasUserBenefit;
    },
  },
];

// ─── Step 3: Consultation ───
const STEP3_RULES: PitfallRule[] = [
  {
    id: 's3-no-names',
    pitfallDescription: 'Claiming consultation occurred without naming who was involved.',
    suggestion: 'Name the specific people or teams consulted (e.g., "IT Security Lead", "Chief Legal Officer", "the DPO").',
    fieldLabel: 'Stakeholders Consulted',
    detect: (text) => {
      if (text.length < 15) return false;
      return lacksAny(text, ['dpo', 'officer', 'lead', 'director', 'manager', 'counsel', 'chief', 'team', 'engineer', 'advisor', 'consultant', 'board', 'committee', 'security', 'legal', 'privacy']);
    },
  },
];

// ─── Step 4: Necessity ───
const STEP4_RULES: PitfallRule[] = [
  {
    id: 's4-no-basis-detail',
    pitfallDescription: 'Selecting a lawful basis without explaining why it applies to this project.',
    suggestion: 'Explain why the selected lawful basis specifically applies — e.g., "Contract performance because users agree to Terms of Service requiring data processing for service delivery."',
    fieldLabel: 'Lawful Basis Details',
    detect: (text, context) => {
      const bases = (context?.lawfulBasis as string[]) ?? [];
      return bases.length > 0 && text.trim().length < 20;
    },
  },
  {
    id: 's4-just-in-case',
    pitfallDescription: 'Collecting unnecessary data fields "just in case" for undefined future use.',
    suggestion: 'Remove or reword language suggesting speculative data collection. Describe only the data strictly needed for the stated purpose.',
    fieldLabel: 'Data Minimization',
    detect: (text) => {
      return containsAny(text, ['just in case', 'might need', 'may need later', 'for future use', 'in case we', 'potentially useful']);
    },
  },
];

// ─── Step 5: Risk Assessment ───
const STEP5_RULES: PitfallRule[] = [
  {
    id: 's5-all-low',
    pitfallDescription: 'Downplaying severe risks to make the project appear safer than it is.',
    suggestion: 'Review risk scores honestly. Most projects handling personal data have at least one Medium or High risk.',
    fieldLabel: 'Risk Assessment',
    detect: (_text, context) => {
      const risks = (context?.risks as Array<{ overallRisk: string }>) ?? [];
      return risks.length >= 2 && risks.every((r) => r.overallRisk === 'Low');
    },
  },
];

// ─── Step 6: Mitigations ───
const STEP6_RULES: PitfallRule[] = [
  {
    id: 's6-vague-controls',
    pitfallDescription: 'Listing vague controls like "we will follow security best practices" without concrete measures.',
    suggestion: 'Name specific controls: MFA, AES-256 encryption, DPA agreements, automated retention purges, RBAC, etc.',
    fieldLabel: 'Mitigation Options',
    detect: (text) => {
      const vagueControls = ['best practices', 'will follow', 'standard security', 'industry standard', 'appropriate measures', 'reasonable steps'];
      const hasVague = containsAny(text, vagueControls);
      const hasSpecific = containsAny(text, ['mfa', 'multi-factor', 'encrypt', 'aes', 'tls', 'dpa', 'rbac', 'access control', 'audit log', 'purge', 'retention', 'firewall', 'soc 2', 'iso 27001', 'penetration']);
      return hasVague && !hasSpecific;
    },
  },
];

// ─── Public API ───

export function checkStep1Pitfalls(projectOverview: string, triggerReasons: string[]): PitfallViolation[] {
  return STEP1_RULES.filter((rule) => rule.detect(projectOverview, { triggerReasons })).map(toViolation);
}

export function checkStep2NaturePitfalls(nature: string): PitfallViolation[] {
  return STEP2_NATURE_RULES.filter((rule) => rule.detect(nature)).map(toViolation);
}

export function checkStep2ScopePitfalls(scope: string): PitfallViolation[] {
  return STEP2_SCOPE_RULES.filter((rule) => rule.detect(scope)).map(toViolation);
}

export function checkStep2ContextPitfalls(context: string): PitfallViolation[] {
  return STEP2_CONTEXT_RULES.filter((rule) => rule.detect(context)).map(toViolation);
}

export function checkStep2PurposePitfalls(purpose: string): PitfallViolation[] {
  return STEP2_PURPOSE_RULES.filter((rule) => rule.detect(purpose)).map(toViolation);
}

export function checkStep3Pitfalls(stakeholderConsultation: string): PitfallViolation[] {
  return STEP3_RULES.filter((rule) => rule.detect(stakeholderConsultation)).map(toViolation);
}

export function checkStep4Pitfalls(lawfulBasisDetails: string, dataMinimization: string, lawfulBasis: string[]): PitfallViolation[] {
  const violations: PitfallViolation[] = [];
  for (const rule of STEP4_RULES) {
    if (rule.id === 's4-no-basis-detail' && rule.detect(lawfulBasisDetails, { lawfulBasis })) {
      violations.push(toViolation(rule));
    }
    if (rule.id === 's4-just-in-case' && rule.detect(dataMinimization)) {
      violations.push(toViolation(rule));
    }
  }
  return violations;
}

export function checkStep5Pitfalls(risks: Array<{ overallRisk: string }>): PitfallViolation[] {
  return STEP5_RULES.filter((rule) => rule.detect('', { risks })).map(toViolation);
}

export function checkStep6Pitfalls(mitigationTexts: string[]): PitfallViolation[] {
  const violations: PitfallViolation[] = [];
  for (const text of mitigationTexts) {
    for (const rule of STEP6_RULES) {
      if (rule.detect(text) && !violations.some((v) => v.id === rule.id)) {
        violations.push(toViolation(rule));
      }
    }
  }
  return violations;
}

function toViolation(rule: PitfallRule): PitfallViolation {
  return {
    id: rule.id,
    pitfallDescription: rule.pitfallDescription,
    suggestion: rule.suggestion,
    fieldLabel: rule.fieldLabel,
  };
}
