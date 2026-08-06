import type { GuidanceItem } from '../types/dpia';

export const guidanceDictionary: Record<string, GuidanceItem> = {
  controllerDetails: {
    questionKey: 'controllerDetails',
    title: 'Submitting Controller & DPO Details',
    whyThisExists: 'Identifies which legal entity is responsible for the data processing and who oversees compliance.',
    plainEnglishExplanation: 'The Data Controller is your company or organization. The DPO (Data Protection Officer) or Contact Person is the primary human who answers privacy questions.',
    realWorldExample: 'Data Controller: Acme Healthcare Corp. DPO Contact: Jane Doe, Chief Privacy Officer (privacy@acmehealth.com).',
    commonPitfalls: [
      'Leaving contact details blank or putting a generic support email nobody checks.',
      'Confusing the Controller (your company) with a vendor or processor (e.g. AWS or OpenAI).'
    ],
    starterBulletPoints: [
      'Organization Name: [Insert Company Name]',
      'Data Protection Officer / Privacy Lead: [Name, Title, Email]',
      'Department / Business Unit: [Engineering / Operations / HR]'
    ]
  },

  step1Need: {
    questionKey: 'step1Need',
    title: 'Step 1: Identify the Need for a DPIA',
    whyThisExists: 'Explains what the project aims to do and why a formal privacy review is legally or operationally required.',
    plainEnglishExplanation: 'Imagine explaining what your project does to a friend who does not work in tech. State what problem you are solving, what tech you are introducing, and why a DPIA was triggered (e.g. using AI, tracking users, or processing sensitive data).',
    realWorldExample: 'We are deploying an AI Customer Service Assistant to help customers check order status and initiate refunds. A DPIA is needed because we are using automated generative AI and handling personal customer details.',
    commonPitfalls: [
      'Using overly technical jargon that hides how personal data is actually used.',
      'Failing to specify why the DPIA was triggered (e.g., novel technology, large scale, or sensitive data).'
    ],
    starterBulletPoints: [
      'Project Name: [System / Tool Name]',
      'Business Purpose: [Key goal or problem solved]',
      'Trigger Criteria: [e.g. Generative AI deployment, cloud migration, processing health/financial data]'
    ]
  },

  step2Nature: {
    questionKey: 'step2Nature',
    title: 'Step 2.1: Nature of Processing',
    whyThisExists: 'Tracks the exact technical lifecycle of personal data from initial collection to permanent destruction.',
    plainEnglishExplanation: 'Describe the journey of the data step-by-step: How do you get it (web forms, mobile app)? Where is it stored (cloud DB, local server)? Who can see it? Who do you share it with? How and when is it deleted?',
    realWorldExample: 'Customer enters billing details on our website. Data is transmitted over HTTPS, stored in an encrypted AWS PostgreSQL database, accessed by customer support staff via MFA, shared with Stripe for payment processing, and deleted 3 years after account closure.',
    commonPitfalls: [
      'Forgetting to mention third-party APIs or cloud sub-processors (e.g., OpenAI, Twilio, Analytics).',
      'Ignoring how long data is stored before being deleted.'
    ],
    starterBulletPoints: [
      'Collection: Gathered via SSL web forms / mobile app input.',
      'Storage: Hosted in AES-256 encrypted database in region [US/EU].',
      'Sharing: Transmitted securely to verified sub-processors [Vendor Names].',
      'Deletion: Purged automatically after [X years/months] via automated cron job.'
    ]
  },

  step2Scope: {
    questionKey: 'step2Scope',
    title: 'Step 2.2: Scope of Processing',
    whyThisExists: 'Defines the volume, frequency, sensitivity, and geographical reach of the collected personal data.',
    plainEnglishExplanation: 'Be specific about what data elements you collect (names, emails, IP addresses, financial info, health data), how many people are affected, and how large your dataset is.',
    realWorldExample: 'We collect names, emails, billing addresses, and payment tokens for ~50,000 active UK and EU consumer accounts.',
    commonPitfalls: [
      'Claiming "we don\'t collect personal data" when collecting IP addresses, cookies, or user login IDs.',
      'Not identifying whether special category data (health, biometric, racial, political) is involved.'
    ],
    starterBulletPoints: [
      'Data Elements: Name, Email Address, Phone Number, Device IP, Transaction History.',
      'Special Category Data: None / [Specify if health, biometric, or location data].',
      'Volume: Approximately [10,000 / 100,000] user records.',
      'Geographical Scope: UK, EU, and US residents.'
    ]
  },

  step2Context: {
    questionKey: 'step2Context',
    title: 'Step 2.3: Context & Affected Data Subjects',
    whyThisExists: 'Examines your relationship with the individuals whose personal data is handled, their privacy expectations, and any vulnerable groups involved.',
    plainEnglishExplanation: 'Clarify who the Data Subjects are (the individuals whose data is processed, e.g. Patients, Customers, Employees — NOT internal software operators). Would these individuals expect their data to be processed this way?',
    realWorldExample: 'Data subjects are adult healthcare patients. Patients expect clinical lab results to be processed for medical diagnosis, but would not expect their health data to be shared with third-party marketers without explicit consent. No minors are involved.',
    commonPitfalls: [
      'Confusing software users (company employees operating the app) with Data Subjects (patients/customers whose data is stored).',
      'Overlooking vulnerable groups such as patients, children, elderly users, or employees who feel obligated to consent.',
      'Assuming individuals won\'t care how their sensitive personal data is analyzed or shared.'
    ],
    starterBulletPoints: [
      'Affected Data Subjects: Adult healthcare patients / commercial customers / workforce employees.',
      'Privacy Expectations: Data subjects provide information for service delivery; processing aligns with reasonable expectations.',
      'Vulnerable Individuals: No minors (<18) or vulnerable groups involved.',
      'Trust & Safeguards: Enterprise security controls and explicit notice prevent unexpected data usage.'
    ]
  },

  step2Purpose: {
    questionKey: 'step2Purpose',
    title: 'Step 2.4: Purpose of Processing',
    whyThisExists: 'Articulates the core business objectives and tangible benefits for both the organization and the end user.',
    plainEnglishExplanation: 'Why are you doing this project? What benefit does the customer get (e.g. faster service, 24/7 support)? What benefit does your business get (e.g. lower support costs, reduced fraud)?',
    realWorldExample: 'The purpose is to automate routine customer inquiries, reducing wait times from 15 minutes to 30 seconds for users, while lowering customer service operational costs by 35%.',
    commonPitfalls: [
      'Vague statements like "to improve user experience" without explaining concrete benefits.',
      'Focusing only on company profit while ignoring user benefits.'
    ],
    starterBulletPoints: [
      'Customer Benefits: Faster response times, 24/7 availability, convenient self-service options.',
      'Organizational Benefits: Higher operational efficiency, scalable support, lower cost per resolution.',
      'Broader Impact: Standard commercial service enhancement.'
    ]
  },

  step3Consultation: {
    questionKey: 'step3Consultation',
    title: 'Step 3: Stakeholder & Public Consultation',
    whyThisExists: 'Ensures security experts, legal advisors, employees, or end-users were consulted prior to rollout.',
    plainEnglishExplanation: 'Did you talk to IT security, legal experts, third-party vendors, or end users? If you chose not to consult users directly (e.g., due to trade secrets or security concerns), explain why.',
    realWorldExample: 'We conducted internal consultations with IT Security and Legal Counsel, and held beta feedback sessions with a 50-person user focus group. External public consultation was deemed unnecessary as processing aligns with user expectations.',
    commonPitfalls: [
      'Claiming consultation happened without naming who was involved.',
      'Not providing a clear justification when public user surveys were omitted.'
    ],
    starterBulletPoints: [
      'Internal Teams Consulted: IT Security Lead, Chief Legal Officer, Customer Support Team.',
      'External Experts: Third-party penetration testing firm and vendor DPO.',
      'User Feedback: Conducted beta testing with 20 sample users.',
      'Justification (if no public survey): Processing poses standard operational risk and matches existing Terms of Service.'
    ]
  },

  step4Necessity: {
    questionKey: 'step4Necessity',
    title: 'Step 4: Necessity & Proportionality',
    whyThisExists: 'Verifies that you only collect data strictly necessary for the purpose (data minimization) and have a legal basis.',
    plainEnglishExplanation: 'Are you hoarding data "just in case" or strictly collecting what is needed? What is your legal justification under GDPR/privacy law (e.g., Contract, Consent, Legitimate Interest)? How do you prevent "function creep"?',
    realWorldExample: 'Lawful basis is Performance of a Contract. We removed optional middle-name and birthdate fields to minimize data. Function creep is prevented by strict database access controls preventing marketing use.',
    commonPitfalls: [
      'Choosing "Consent" when users have no real choice (e.g. mandatory employee monitoring).',
      'Collecting extra optional fields that have no immediate business purpose.'
    ],
    starterBulletPoints: [
      'Lawful Basis: Contract Performance (for order fulfillment) & Legitimate Interest (for system security).',
      'Data Minimization: Disabled non-essential form fields; collecting minimum necessary attributes.',
      'Function Creep Prevention: Technical boundaries separate customer service logs from marketing databases.',
      'Individual Rights: Users can request data export or deletion via our privacy portal within 30 days.'
    ]
  },

  step5Risks: {
    questionKey: 'step5Risks',
    title: 'Step 5: Identify and Assess Privacy Risks',
    whyThisExists: 'Identifies potential threats to user privacy, data leaks, or regulatory breaches, scoring their likelihood and severity.',
    plainEnglishExplanation: 'Think worst-case scenarios: What if the database is hacked? What if an employee misdirects an email? What if a vendor uses user data for AI training? Score each risk: Likelihood (Remote/Possible/Probable) and Severity (Minimal/Significant/Severe).',
    realWorldExample: 'Risk 1: Third-party AI vendor uses chat transcripts for model training (Likelihood: Possible, Severity: Significant -> Overall: High). Risk 2: Cloud database misconfiguration exposes user emails (Likelihood: Remote, Severity: Severe -> Overall: Medium).',
    commonPitfalls: [
      'Downplaying severe risks to make the project look safe.',
      'Only listing technical risks while ignoring human errors or lack of transparency.'
    ],
    starterBulletPoints: [
      'Risk 1: Unauthorized access / credential leak (Likelihood: Remote, Severity: Severe -> Medium).',
      'Risk 2: Vendor sub-processor retains data for unauthorized AI training (Likelihood: Possible, Severity: Significant -> High).',
      'Risk 3: Excessive retention of user transaction history (Likelihood: Possible, Severity: Minimal -> Low).'
    ]
  },

  step6Mitigations: {
    questionKey: 'step6Mitigations',
    title: 'Step 6: Risk Mitigation & Safeguards',
    whyThisExists: 'Outlines specific technical and organizational controls put in place to reduce or eliminate every risk from Step 5.',
    plainEnglishExplanation: 'For every threat identified in Step 5, what action are you taking? (e.g., Multi-Factor Authentication, zero-data-retention vendor agreements, database encryption, automatic 90-day purge). Calculate the remaining (residual) risk score.',
    realWorldExample: 'Mitigation for AI Vendor Risk: Executed enterprise DPA with zero-data-retention clause and implemented client-side PII redactor. Residual Risk: Reduced to Low. Status: Approved.',
    commonPitfalls: [
      'Listing vague controls like "we will follow security best practices" without naming concrete measures.',
      'Leaving high residual risks unapproved by leadership.'
    ],
    starterBulletPoints: [
      'Control 1: Enforce mandatory Multi-Factor Authentication (MFA) and TLS 1.3 encryption at rest.',
      'Control 2: Negotiate enterprise Data Processing Agreement (DPA) guaranteeing zero vendor model training.',
      'Control 3: Implement automated script purging chat logs after 90 days.'
    ]
  },

  step7SignOff: {
    questionKey: 'step7SignOff',
    title: 'Step 7: Sign-Off & Record Outcomes',
    whyThisExists: 'Formal approval record by the Data Protection Officer (DPO) and senior management to launch the project.',
    plainEnglishExplanation: 'Summarize DPO advice, record who approved the safeguards and residual risks, and set a date to review this DPIA in the future (e.g. annually or upon major system update).',
    realWorldExample: 'DPO Advice: Approved subject to implementation of 90-day retention purge. Approved by Chief Information Security Officer on 2026-08-15. Annual review scheduled for August 2027.',
    commonPitfalls: [
      'Proceeding with high residual risk without consulting privacy authorities (ICO/DPA).',
      'Treating the DPIA as a one-time document that is never reviewed again.'
    ],
    starterBulletPoints: [
      'Measures & Residual Risks Approved By: [Name & Title of Executive/CISO]',
      'DPO Advice Summary: Project complies with GDPR/UK ICO guidelines provided all Step 6 controls remain operational.',
      'DPO Advice Status: Accepted in full.',
      'Review Schedule: DPIA will be reviewed annually or prior to major feature additions.'
    ]
  }
};
