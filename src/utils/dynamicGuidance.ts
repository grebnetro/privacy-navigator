import type { DPIAFormData } from '../types/dpia';
import type { OnboardingPayload } from '../types/onboarding';

export interface DynamicGuidance {
  whyThisExists: string;
  plainEnglishExplanation: string;
  realWorldExample: string;
  commonPitfalls: string[];
}

export function getDynamicGuidance(
  questionKey: string,
  formData?: DPIAFormData,
  onboardingPayload?: OnboardingPayload | null
): DynamicGuidance {
  const orgName = formData?.controllerDetails.controllerName || 'your organization';
  const projectTitle = onboardingPayload?.projectTitle || 'this project';
  const dpoTitle = formData?.controllerDetails.dpoTitle || 'Data Protection Officer';
  const dpoContact = formData?.controllerDetails.dpoContactName || 'the appointed DPO';

  const hasPHI = onboardingPayload?.dataTypes.includes('PHI') ?? false;
  const hasSensitivePII = onboardingPayload?.dataTypes.includes('SENSITIVE_PII') ?? false;
  const hasChildren = onboardingPayload?.dataTypes.includes('CHILDREN') ?? false;
  const hasFinancial = onboardingPayload?.dataTypes.includes('FINANCIAL') ?? false;

  const dataDescription = hasPHI
    ? 'Protected Health Information (PHI) and clinical lab records'
    : hasSensitivePII
    ? 'sensitive PII (biometrics, government IDs, genetic data)'
    : hasFinancial
    ? 'financial billing and payment data'
    : hasChildren
    ? 'children/minor personal information'
    : 'personal identifiable information (PII)';

  switch (questionKey) {
    // ─── Controller Details (Step 0) ───
    case 'controllerDetails':
      return {
        whyThisExists: 'Identifies which legal entity is the Data Controller and who oversees privacy compliance as the DPO.',
        plainEnglishExplanation: 'Enter your company name (the organization legally responsible for the data), and the name and title of the person who handles privacy questions — typically the Data Protection Officer.',
        realWorldExample: `"Data Controller: Quest Diagnostics. DPO Contact: Keena Hausmann, Executive Director, Privacy Officer (privacy@questdiagnostics.com)."`,
        commonPitfalls: [
          'Leaving the DPO contact blank or using a generic support email nobody monitors.',
          'Confusing the Controller (your company) with a third-party vendor or processor (e.g. AWS, OpenAI).',
        ],
      };

    // ─── Step 1: Need for DPIA ───
    case 'step1Need':
      return {
        whyThisExists: `Establishes why ${orgName} requires a formal privacy impact assessment for '${projectTitle}'.`,
        plainEnglishExplanation: `Describe what '${projectTitle}' does in plain language — what problem it solves, what technology it uses, and why a privacy assessment was triggered (e.g. AI, sensitive data, large-scale processing).`,
        realWorldExample: `"${orgName} is deploying '${projectTitle}' to process ${dataDescription}. A DPIA is required because the project involves ${hasPHI ? 'healthcare PHI under HIPAA' : hasSensitivePII ? 'sensitive biometric/genetic data' : 'large-scale processing of personal data'} and introduces new technology."`,
        commonPitfalls: [
          'Using overly technical jargon that obscures how personal data is actually used.',
          'Not specifying the concrete trigger for the DPIA (e.g., novel technology, sensitive data categories).',
        ],
      };

    // ─── Step 2.1: Nature of Processing ───
    case 'step2Nature':
      return {
        whyThisExists: `Documents the full technical data lifecycle of '${projectTitle}' — from initial collection through to permanent deletion.`,
        plainEnglishExplanation: `Detail how ${dataDescription} flows through '${projectTitle}': How is it collected (web forms, APIs, device input)? Where is it stored (cloud DB, on-prem server)? Who can access it? Who is it shared with? How and when is it deleted?`,
        realWorldExample: `"${orgName} collects ${dataDescription} via encrypted web forms. Data is stored in AES-256 encrypted cloud databases, accessible only to authorized clinical staff via role-based access. Records are shared with verified sub-processors under signed DPAs and automatically purged after the retention period."`,
        commonPitfalls: [
          'Forgetting to mention third-party APIs or cloud sub-processors (e.g., OpenAI, Twilio, analytics vendors).',
          'Omitting how long data is stored before being permanently deleted.',
        ],
      };

    // ─── Step 2.2: Scope of Processing ───
    case 'step2Scope':
      return {
        whyThisExists: `Defines the volume, data categories, and geographical reach of processing within '${projectTitle}'.`,
        plainEnglishExplanation: `Specify exactly what data attributes '${projectTitle}' handles (names, emails, lab results, IPs), how many individuals are affected, and what geographic regions the data covers.`,
        realWorldExample: `"'${projectTitle}' processes ${dataDescription} for approximately 50,000 individuals across ${orgName}'s active operating regions. ${hasPHI ? 'Special category health data (lab results, diagnoses) is involved.' : 'No special category data is involved.'}"`,
        commonPitfalls: [
          'Underestimating the total number of affected data subjects.',
          `Failing to identify whether special category data (${hasPHI ? 'PHI/health records' : 'biometric, health, or financial data'}) is included.`,
        ],
      };

    // ─── Step 2.3: Context of Processing ───
    case 'step2Context':
      return {
        whyThisExists: `Examines ${orgName}'s relationship with the Data Subjects whose data is processed in '${projectTitle}'.`,
        plainEnglishExplanation: `Identify who the Data Subjects are — the individuals whose personal data is being collected and processed (e.g. Patients, Customers, Employees). These are NOT company staff operating the software. Would these individuals reasonably expect their data to be used this way?`,
        realWorldExample: `"Data subjects are adult ${hasPHI ? 'healthcare patients' : 'customers'} of ${orgName}. ${hasPHI ? 'Patients expect their lab results to be processed for diagnosis but would not expect data shared with third-party marketers.' : 'Customers expect order data to be processed for service delivery but might be surprised if data is used for AI model training.'} No minors are involved."`,
        commonPitfalls: [
          'Confusing software operators (internal employees using the app) with Data Subjects (the people whose data is stored and processed).',
          'Overlooking vulnerable populations such as patients, children, or elderly individuals.',
        ],
      };

    // ─── Step 2.4: Purpose of Processing ───
    case 'step2Purpose':
      return {
        whyThisExists: `Articulates the core business objectives and tangible benefits of '${projectTitle}' for both ${orgName} and end users.`,
        plainEnglishExplanation: `Why is ${orgName} building '${projectTitle}'? What concrete benefit does the end user get (e.g. faster results, 24/7 access)? What does the organization gain (e.g. lower costs, compliance, efficiency)?`,
        realWorldExample: `"The purpose of '${projectTitle}' is to ${hasPHI ? 'streamline clinical lab result delivery, reducing patient wait times from days to hours' : 'automate routine service inquiries, reducing response times from 15 minutes to 30 seconds'} while lowering ${orgName}'s operational overhead by 30%."`,
        commonPitfalls: [
          'Vague statements like "to improve user experience" without concrete, measurable benefits.',
          'Focusing solely on organizational profit while ignoring the benefit to the Data Subject.',
        ],
      };

    // ─── Step 3: Consultation ───
    case 'step3Consultation':
      return {
        whyThisExists: `Records which stakeholders at ${orgName} reviewed '${projectTitle}' and whether external expert or public feedback was gathered.`,
        plainEnglishExplanation: `List who was consulted: IT Security, Legal Counsel, the DPO (${dpoContact}), external auditors, or user focus groups. If public consultation was not conducted, explain why (e.g. standard commercial processing, security confidentiality).`,
        realWorldExample: `"${orgName}'s project team consulted ${dpoContact} (${dpoTitle}), IT Security Engineers, and outside Legal Counsel to review data flow diagrams and vendor DPAs for '${projectTitle}'. Public user surveys were not conducted because processing aligns with existing Terms of Service."`,
        commonPitfalls: [
          'Claiming consultation occurred without naming the specific people or teams involved.',
          'Leaving the justification blank when public consultation was deliberately skipped.',
        ],
      };

    // ─── Step 4: Necessity & Proportionality ───
    case 'step4Necessity':
      return {
        whyThisExists: `Demonstrates the legal grounds for processing, data minimization practices, and individual rights support within '${projectTitle}'.`,
        plainEnglishExplanation: `Verify that ${orgName} collects only the minimum data required for '${projectTitle}'. Select the applicable lawful basis (e.g. Contract, Consent, Legal Obligation). Explain how function creep is prevented and how Data Subjects can exercise their rights (access, deletion, portability).`,
        realWorldExample: `"Processing for '${projectTitle}' relies on ${hasPHI ? 'Legal Obligation (HIPAA compliance) and Contract Performance' : 'Contract Performance and Legitimate Interest'}. Data minimization restricts collection to essential fields only. ${dpoContact} handles Data Subject access and deletion requests within 30 days."`,
        commonPitfalls: [
          'Selecting a lawful basis without explaining why it applies to this specific project.',
          'Collecting unnecessary data fields "just in case" for undefined future use.',
        ],
      };

    // ─── Step 5: Risk Assessment ───
    case 'step5Risks':
      return {
        whyThisExists: `Identifies and scores potential threats to Data Subject privacy, data security, and regulatory compliance within '${projectTitle}'.`,
        plainEnglishExplanation: `Think worst-case: What if the database is breached? What if an employee misdirects ${dataDescription}? What if a vendor misuses data? Score each risk by Likelihood (Remote / Possible / Probable) and Severity (Minimal / Significant / Severe).`,
        realWorldExample: `"Risk 1: ${hasPHI ? 'Unauthorized access to patient lab records via compromised credentials' : 'Third-party AI vendor retains chat transcripts for model training'} (Likelihood: Possible, Severity: Significant → Overall: Medium). Risk 2: ${hasPHI ? 'Misrouted fax or email exposes patient PHI' : 'Cloud database misconfiguration exposes customer emails'} (Likelihood: Remote, Severity: Severe → Overall: Medium)."`,
        commonPitfalls: [
          'Downplaying severe risks to make the project appear safer than it is.',
          'Only listing technical risks while ignoring human errors, lack of transparency, or vendor risks.',
        ],
      };

    // ─── Step 6: Risk Mitigation ───
    case 'step6Mitigations':
      return {
        whyThisExists: `Outlines the specific technical and organizational controls ${orgName} is implementing to reduce or eliminate each risk identified in Step 5.`,
        plainEnglishExplanation: `For every threat from Step 5, describe the concrete safeguard: Multi-Factor Authentication, AES-256 encryption, zero-data-retention vendor DPAs, automated retention purge schedules, etc. Then calculate the remaining residual risk after the control is applied.`,
        realWorldExample: `"Mitigation for ${hasPHI ? 'unauthorized PHI access' : 'vendor data misuse'}: ${hasPHI ? 'Implemented HIPAA-compliant RBAC, MFA for all clinical staff, and AES-256 encryption at rest. Residual Risk: Low.' : 'Executed enterprise DPA with zero-data-retention clause and deployed client-side PII redactor. Residual Risk: Low.'} Status: Approved by ${dpoContact}."`,
        commonPitfalls: [
          'Listing vague controls like "we will follow security best practices" without naming specific measures.',
          'Leaving high residual risks unapproved by the DPO or senior leadership.',
        ],
      };

    // ─── Step 7: Sign-Off ───
    case 'step7SignOff':
      return {
        whyThisExists: `Formal approval record by ${dpoContact} (${dpoTitle}) and senior management to authorize '${projectTitle}' for launch.`,
        plainEnglishExplanation: `Summarize the DPO's advice, record who approved the safeguards and accepted the residual risks, and set a future date to review this DPIA (e.g. annually or upon major system changes).`,
        realWorldExample: `"DPO Advice: ${dpoContact} approved '${projectTitle}' subject to implementation of all Step 6 controls. Approved by the Chief Information Security Officer on 2026-08-15. Annual review scheduled for August 2027."`,
        commonPitfalls: [
          'Proceeding with high residual risk without consulting the relevant privacy authority (ICO/DPA).',
          'Treating the DPIA as a one-time document that is never reviewed or updated.',
        ],
      };

    default:
      return {
        whyThisExists: `Provides guided privacy compliance assistance for this section of '${projectTitle}'.`,
        plainEnglishExplanation: `Complete this section with specific details about how ${orgName} handles ${dataDescription} within '${projectTitle}'.`,
        realWorldExample: `"Ensure all responses accurately reflect ${orgName}'s actual data handling practices for '${projectTitle}'."`,
        commonPitfalls: ['Leaving required fields incomplete.', 'Providing generic, non-specific answers.'],
      };
  }
}
