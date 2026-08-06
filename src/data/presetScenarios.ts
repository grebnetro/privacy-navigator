import type { DPIAFormData } from '../types/dpia';

export const presetScenarios: Record<string, { label: string; description: string; data: DPIAFormData }> = {
  aiChatbot: {
    label: '🤖 AI Support Assistant (LLM Chatbot)',
    description: 'Deploying an automated LLM chatbot for customer inquiries and refund processing.',
    data: {
      controllerDetails: {
        controllerName: 'Apex Retail Solutions Ltd.',
        dpoTitle: 'Head of Data Privacy & Governance',
        dpoContactName: 'Sarah Jenkins (privacy@apexretail.com)'
      },
      step1Need: {
        projectOverview: 'Apex Retail is introducing an interactive AI Customer Support Assistant powered by an Enterprise LLM API to automatically handle tier-1 customer inquiries, track shipment status, and initiate return requests 24/7.',
        triggerReasons: [
          'Use of new technology (Generative AI / LLMs)',
          'Automated processing of customer personal data',
          'Third-party cloud data transfers'
        ]
      },
      step2Processing: {
        nature: 'Customer enters inquiries via a website chat widget. Prompts pass through an automated client-side PII sanitizer (redacting credit cards and social security numbers) before reaching an Enterprise LLM API. Data is processed transiently, returned to the user, and stored in an AWS PostgreSQL database encrypted with AES-256 for 90 days before automated deletion.',
        scope: 'Collects customer name, order number, email address, shipping address, and chat conversation history. Affects approximately 120,000 active UK & EU consumers annually.',
        context: 'Users are existing adult retail customers expecting quick resolution of order inquiries. Users do not expect chat logs to be used for public AI training or advertising.',
        purpose: 'To reduce average customer support wait times from 15 minutes to under 30 seconds, provide 24/7 self-service resolutions, and lower support operational costs by 35%.'
      },
      step3Consultation: {
        stakeholderConsultation: 'Consulted internal Information Security team, Legal Counsel, and external Privacy Auditors. Conducted usability and privacy testing with a sample focus group of 30 customers.',
        justificationIfNotConsulted: 'Public consultation with all 120,000 customers was omitted as processing aligns directly with standard order execution and user expectations.'
      },
      step4Necessity: {
        lawfulBasis: ['Contract', 'Legitimate interests'],
        lawfulBasisDetails: 'Contract Performance (GDPR Art. 6(1)(b)) for fulfilling return requests and order tracking. Legitimate Interest (GDPR Art. 6(1)(f)) for maintaining chat history to ensure service quality and audit compliance.',
        functionCreepPrevention: 'Strict technical separation prevents chat log data from being accessed by marketing or sales engines. LLM API responses are isolated to customer support domain knowledge.',
        dataMinimizationAndQuality: 'Optional free-text fields are sanitized to remove unnecessary PII before API dispatch. Unneeded data attributes (such as IP logs) are discarded after session termination.',
        individualRightsSupport: 'Users can request a copy of their chat transcript or request permanent erasure via Apex’s automated Privacy Rights Portal within 14 days.',
        processorSafeguards: 'Formal Data Processing Agreement (DPA) signed with the LLM API vendor guaranteeing zero data retention for model training, encrypted transit, and SOC 2 Type II compliance.',
        internationalTransfers: 'EU-US Data Privacy Framework certification verified for US-hosted LLM endpoints with Standard Contractual Clauses (SCCs) in place.'
      },
      step5Risks: [
        {
          id: 'risk-1',
          riskDescription: 'LLM Vendor uses customer prompts to train public AI models, leading to potential data exposure.',
          likelihood: 'Possible',
          severity: 'Significant',
          overallRisk: 'High'
        },
        {
          id: 'risk-2',
          riskDescription: 'Accidental disclosure of sensitive PII (e.g. credit card number) pasted by customer into free-text chat.',
          likelihood: 'Possible',
          severity: 'Significant',
          overallRisk: 'High'
        },
        {
          id: 'risk-3',
          riskDescription: 'Unauthorized access to centralized chat history database via compromised credentials.',
          likelihood: 'Remote',
          severity: 'Severe',
          overallRisk: 'Medium'
        }
      ],
      step6Mitigations: [
        {
          id: 'mit-1',
          riskId: 'risk-1',
          riskDescription: 'Vendor training on user prompts',
          mitigationOptions: 'Execute enterprise zero-retention DPA clause forbidding vendor from storing prompts or training models.',
          effectOnRisk: 'Eliminated',
          residualRisk: 'Low',
          measureApproved: true
        },
        {
          id: 'mit-2',
          riskId: 'risk-2',
          riskDescription: 'Accidental sensitive PII input',
          mitigationOptions: 'Deploy automated client-side Regex and Named Entity Recognition (NER) sanitizer to scrub credit cards & IDs before API dispatch.',
          effectOnRisk: 'Reduced',
          residualRisk: 'Low',
          measureApproved: true
        },
        {
          id: 'mit-3',
          riskId: 'risk-3',
          riskDescription: 'Database credential leak',
          mitigationOptions: 'Enforce AES-256 encryption at rest, TLS 1.3 in transit, MFA for all admin accounts, and automated 90-day retention purge.',
          effectOnRisk: 'Reduced',
          residualRisk: 'Low',
          measureApproved: true
        }
      ],
      step7SignOff: {
        measuresApprovedBy: 'Marcus Vance, Chief Technology Officer (2026-08-10)',
        residualRisksApprovedBy: 'Sarah Jenkins, Data Protection Officer (2026-08-11)',
        dpoAdviceProvided: true,
        dpoAdviceSummary: 'The DPO confirms that the proposed technical controls (zero-retention enterprise DPA, PII redactor, and 90-day retention purge) satisfy GDPR requirements.',
        dpoAdviceAccepted: 'Accepted',
        dpoOverruledReason: '',
        consultationReviewedBy: 'Legal & Compliance Committee',
        consultationDepartReason: 'No departure from stakeholder recommendations.',
        reviewKeeper: 'Data Protection Officer (Annual review scheduled for August 2027)'
      }
    }
  },

  paymentPortal: {
    label: '💳 Customer Billing & Payment Portal',
    description: 'Self-service web portal allowing customers to pay invoices online via PCI-DSS compliant gateways.',
    data: {
      controllerDetails: {
        controllerName: 'Horizon Utility Partners',
        dpoTitle: 'Information Governance Lead',
        dpoContactName: 'David Miller (dpo@horizonutility.com)'
      },
      step1Need: {
        projectOverview: 'Launch of a secure web-based billing portal allowing 45,000 residential utility customers to view monthly electricity statements, update payment methods, and make online payments.',
        triggerReasons: [
          'Processing of financial and payment data',
          'Large-scale processing of consumer personal data',
          'Migration from legacy paper billing to cloud portal'
        ]
      },
      step2Processing: {
        nature: 'Data is gathered via HTTPS forms. Payment card details are tokenized directly by Stripe (PCI-DSS Level 1 Processor) without touching Horizon’s servers. Account balances and payment confirmation logs are stored in a secure cloud database.',
        scope: 'Customer name, utility account number, billing address, email, phone, and payment transaction references for 45,000 households.',
        context: 'Existing residential customers paying regular bills. Users expect bank-grade security and immediate payment verification.',
        purpose: 'Provide customers with convenient 24/7 billing access, reduce paper waste, and eliminate overdue payment processing delays.'
      },
      step3Consultation: {
        stakeholderConsultation: 'Internal consultation with Finance, IT Infrastructure, and Legal teams. External PCI-DSS Qualified Security Assessor (QSA) audit conducted.',
        justificationIfNotConsulted: 'Direct customer survey was not required as self-service digital billing was overwhelmingly requested in annual satisfaction surveys.'
      },
      step4Necessity: {
        lawfulBasis: ['Contract', 'Legal obligation'],
        lawfulBasisDetails: 'Contract Performance (utility supply contract) and Legal Obligation (financial tax record compliance).',
        functionCreepPrevention: 'Financial logs are maintained strictly for accounting and audit compliance. Marketing opt-ins are decoupled and explicit.',
        dataMinimizationAndQuality: 'Card details are never stored on internal servers. Only tokenized payment identifiers are retained.',
        individualRightsSupport: 'Customers can view full billing history and download tax receipts anytime via the portal.',
        processorSafeguards: 'PCI-DSS Level 1 Service Provider contract with Stripe including strict DPAs.',
        internationalTransfers: 'All primary and backup database nodes hosted within UK/EU AWS regions.'
      },
      step5Risks: [
        {
          id: 'risk-p1',
          riskDescription: 'Credential stuffing attack leading to unauthorized viewing of billing statements.',
          likelihood: 'Possible',
          severity: 'Significant',
          overallRisk: 'High'
        },
        {
          id: 'risk-p2',
          riskDescription: 'Interception of session data during online payment entry.',
          likelihood: 'Remote',
          severity: 'Severe',
          overallRisk: 'Medium'
        }
      ],
      step6Mitigations: [
        {
          id: 'mit-p1',
          riskId: 'risk-p1',
          riskDescription: 'Credential stuffing attack',
          mitigationOptions: 'Enforce rate-limiting, CAPTCHA on multi-failed logins, and optional Multi-Factor Authentication (MFA).',
          effectOnRisk: 'Reduced',
          residualRisk: 'Low',
          measureApproved: true
        },
        {
          id: 'mit-p2',
          riskId: 'risk-p2',
          riskDescription: 'Session data interception',
          mitigationOptions: 'Mandatory HSTS, TLS 1.3 encryption, and Stripe iFrame tokenization.',
          effectOnRisk: 'Eliminated',
          residualRisk: 'Low',
          measureApproved: true
        }
      ],
      step7SignOff: {
        measuresApprovedBy: 'Chief Financial Officer & CISO',
        residualRisksApprovedBy: 'Information Governance Lead',
        dpoAdviceProvided: true,
        dpoAdviceSummary: 'DPO approves rollout subject to completion of quarterly PCI-DSS vulnerability scans.',
        dpoAdviceAccepted: 'Accepted',
        dpoOverruledReason: '',
        consultationReviewedBy: 'Finance & Compliance Board',
        consultationDepartReason: '',
        reviewKeeper: 'Information Governance Lead (Biannual Review)'
      }
    }
  }
};
