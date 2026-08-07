export type RewordTone = 'formal' | 'technical' | 'concise';

interface ExtractedFacts {
  volumePhrase: string | null; // e.g. "100,000 patients", "50,000 customers"
  numbers: string[];          // e.g. ["100,000", "90"]
  timeframes: string[];       // e.g. ["3 years", "90 days"]
  vendors: string[];          // e.g. ["AWS", "Stripe", "OpenAI"]
}

function extractUserFacts(text: string): ExtractedFacts {
  // Extract number + entity phrases e.g. "100,000 patients", "50,000 active users"
  const volumeRegex = /\b(\d{1,3}(?:,\d{3})+|\d+)\s+(?:active\s+)?(patients|customers|users|employees|individuals|records|subjects|clients|minors|accounts|inquiries)\b/gi;
  const volumeMatch = volumeRegex.exec(text);
  const volumePhrase = volumeMatch ? `${volumeMatch[1]} ${volumeMatch[2]}` : null;

  // Extract stand-alone numbers
  const numberMatches = text.match(/\b\d{1,3}(?:,\d{3})+|\b\d+\b/g) || [];

  // Extract retention timeframes e.g. "3 years", "90 days"
  const timeRegex = /\b(\d+)\s+(days|months|years|year|day|month)\b/gi;
  const timeMatches: string[] = [];
  let tMatch;
  while ((tMatch = timeRegex.exec(text)) !== null) {
    timeMatches.push(`${tMatch[1]} ${tMatch[2]}`);
  }

  // Extract vendor names
  const vendorRegex = /\b(aws|s3|azure|google cloud|gcp|stripe|openai|twilio|salesforce|snowflake|datadog|segment|hubspot)\b/gi;
  const vendorMatches = text.match(vendorRegex) || [];

  return {
    volumePhrase,
    numbers: Array.from(new Set(numberMatches)),
    timeframes: Array.from(new Set(timeMatches)),
    vendors: Array.from(new Set(vendorMatches.map((v) => v.toUpperCase()))),
  };
}

interface ConceptAnalysis {
  isExtension: boolean;
  hasAIorLLM: boolean;
  hasDecisionOrGuidance: boolean;
  hasAggregatedOrRolledUp: boolean;
  hasHealthOrLab: boolean;
  hasCloudOrAWS: boolean;
  hasRetentionOrDeletion: boolean;
  hasVendorOrSharing: boolean;
}

function analyzeConcepts(text: string): ConceptAnalysis {
  const lower = text.toLowerCase();
  return {
    isExtension: lower.includes('add on') || lower.includes('addon') || lower.includes('extension') || lower.includes('existing app') || lower.includes('existing application') || lower.includes('plugin'),
    hasAIorLLM: lower.includes('ai') || lower.includes('llm') || lower.includes('model') || lower.includes('machine learning') || lower.includes('algorithm') || lower.includes('bot'),
    hasDecisionOrGuidance: lower.includes('decision') || lower.includes('guide') || lower.includes('factor') || lower.includes('recommend') || lower.includes('insight'),
    hasAggregatedOrRolledUp: lower.includes('rolled up') || lower.includes('aggregate') || lower.includes('summary') || lower.includes('not looking at individual') || lower.includes('anonymized'),
    hasHealthOrLab: lower.includes('health') || lower.includes('patient') || lower.includes('lab') || lower.includes('medical') || lower.includes('ehr'),
    hasCloudOrAWS: lower.includes('aws') || lower.includes('s3') || lower.includes('cloud') || lower.includes('database') || lower.includes('server'),
    hasRetentionOrDeletion: lower.includes('delete') || lower.includes('purge') || lower.includes('retain') || lower.includes('retention') || lower.includes('expire'),
    hasVendorOrSharing: lower.includes('vendor') || lower.includes('third party') || lower.includes('sub-processor') || lower.includes('share'),
  };
}

function cleanAndFixGrammarSentences(raw: string): string[] {
  let formatted = raw.replace(/([a-z0-9])\s+([A-Z])/g, '$1. $2');
  const sentences = formatted.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);

  return sentences.map((s) => {
    let clean = s
      .replace(/\bdo\s+do\b/gi, 'do')
      .replace(/\bthe\s+the\b/gi, 'the')
      .replace(/\ba\s+a\b/gi, 'a')
      .replace(/\bthe ai make\b/gi, 'the AI system makes')
      .replace(/\bai make\b/gi, 'the AI model makes')
      .replace(/\bthey're not looking at\b/gi, 'the system does not evaluate')
      .replace(/\bnot looking at\b/gi, 'does not process')
      .replace(/\bguide the us\b/gi, 'provide users with operational guidance')
      .replace(/\bguide us\b/gi, 'provide operational guidance')
      .replace(/\badd on to\b/gi, 'extension to')
      .replace(/\brolled up information\b/gi, 'aggregated summary data')
      .replace(/\bapp\b/gi, 'application')
      .replace(/\b(i|we|our team)\b/gi, 'the organization');

    // Trim trailing prepositions, conjunctions, and incomplete connectors at end of sentence
    clean = clean.trim().replace(/\b(of|to|for|in|with|on|at|by|from|about|over|under|and|or|such as)\s*$/i, '').trim();
    clean = clean.replace(/[,;:-]\s*$/, '').trim();

    if (!clean) return '';

    clean = clean.charAt(0).toUpperCase() + clean.slice(1);
    if (!clean.endsWith('.')) clean += '.';

    return clean;
  }).filter(Boolean);
}

export async function rewordText(
  originalText: string,
  tone: RewordTone = 'formal',
  promptContext?: string
): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const trimmed = originalText.trim();
  if (!trimmed) return originalText;

  const facts = extractUserFacts(trimmed);
  const concepts = analyzeConcepts(trimmed);

  // Define clean, grammatical volume phrases
  const volumeForPhrase = facts.volumePhrase
    ? `for approximately ${facts.volumePhrase}`
    : facts.numbers.length > 0
    ? `for approximately ${facts.numbers[0]} affected records`
    : 'across the active enterprise user base';

  const volumeCoversSentence = facts.volumePhrase
    ? `Processing covers approximately ${facts.volumePhrase}.`
    : facts.numbers.length > 0
    ? `Processing covers approximately ${facts.numbers[0]} affected records.`
    : 'Processing covers the active user base across enterprise deployments.';

  const vendorString = facts.vendors.length > 0
    ? facts.vendors.join(', ')
    : 'AWS cloud sub-processors';

  const retentionString = facts.timeframes.length > 0
    ? `programmatically purged after ${facts.timeframes[0]}`
    : 'automatically purged upon retention schedule expiration';

  // 1. AI Decision Support & Aggregated Data
  if (concepts.hasAIorLLM && (concepts.hasDecisionOrGuidance || concepts.hasAggregatedOrRolledUp || concepts.isExtension)) {
    if (tone === 'formal') {
      return `This module operates as an artificial intelligence extension integrated into an existing enterprise application framework hosted within secure ${vendorString} infrastructure. The AI model evaluates multi-variable inputs to deliver high-level operational guidance ${volumeForPhrase}. Data processing is restricted strictly to aggregated summary metrics rather than individual-level personal data identifiers, with stored records retained strictly for operational lifecycles and ${retentionString} under signed sub-processor DPAs.`;
    }
    if (tone === 'technical') {
      return `Integrates an automated AI decision-support pipeline into host ${vendorString} infrastructure ${volumeForPhrase}. Algorithmic logic evaluates multi-dimensional inputs to generate high-level operational recommendations under signed sub-processor DPAs. Data pipelines operate exclusively on anonymized, rolled-up summary datasets, with automated ILM policies enforcing retention deletion (${retentionString}).`;
    }
    return `Integrates an AI decision-support extension into the application hosted on secure cloud infrastructure ${volumeForPhrase}, using aggregated summary data and ${retentionString}.`;
  }

  // 2. Health / Patient / Lab PHI Data
  if (concepts.hasHealthOrLab) {
    if (tone === 'formal') {
      return `Protected Health Information (PHI) including clinical diagnostic records and patient health metrics are processed ${volumeForPhrase} under HIPAA privacy and security standards. Data is hosted in AES-256 encrypted ${vendorString} databases, accessed strictly via role-based access control (RBAC), and retained in compliance with statutory medical record retention schedules (${retentionString}).`;
    }
    if (tone === 'technical') {
      return `Clinical health diagnostic data and laboratory metrics ${volumeForPhrase} are ingested via TLS 1.3 encrypted conduits, stored within HIPAA-compliant ${vendorString} encrypted storage, and bound by third-party DPAs with ${retentionString}.`;
    }
    return `Processes patient health and lab diagnostic records ${volumeForPhrase} securely in ${vendorString} storage under HIPAA compliance guidelines with ${retentionString}.`;
  }

  // 3. AWS / Cloud Storage
  if (concepts.hasCloudOrAWS) {
    if (tone === 'formal') {
      return `Information is housed within enterprise cloud sub-processors (${vendorString}) ${volumeForPhrase}, employing multi-region redundancy, role-based access control (RBAC), and continuous monitoring. Stored records are retained strictly for the operational lifecycle and ${retentionString}.`;
    }
    if (tone === 'technical') {
      return `Storage is provisioned within ${vendorString} buckets ${volumeForPhrase}, featuring KMS envelope encryption, private VPC endpoints, and CloudTrail auditing. Automated ILM policies enforce object deletion (${retentionString}).`;
    }
    return `Encrypted cloud storage hosted on secure ${vendorString} infrastructure ${volumeForPhrase} with strict access controls and ${retentionString}.`;
  }

  // 4. Data Retention & Purge Lifecycle
  if (concepts.hasRetentionOrDeletion) {
    if (tone === 'formal') {
      return `Personal data processed ${volumeForPhrase} via enterprise cloud sub-processors (${vendorString}) is retained strictly for the operational lifecycle required by purpose limitation principles and ${retentionString}.`;
    }
    if (tone === 'technical') {
      return `Automated Information Lifecycle Management (ILM) policies enforce programmatic object deletion ${volumeForPhrase} in ${vendorString} storage, securely overwriting data blocks upon lifecycle expiry (${retentionString}) under signed sub-processor DPAs.`;
    }
    return `Automated data retention lifecycle purges stored cloud records ${volumeForPhrase} upon lifecycle expiry (${retentionString}).`;
  }

  // 5. Vendor & Sub-processor Sharing
  if (concepts.hasVendorOrSharing) {
    if (tone === 'formal') {
      return `Third-party sub-processors (${vendorString}) processing data ${volumeForPhrase} are bound by formal Data Processing Agreements (DPAs) ensuring equivalent data protection standards, SOC 2 compliance, and ${retentionString}.`;
    }
    if (tone === 'technical') {
      return `Sub-processors (${vendorString}) processing data ${volumeForPhrase} undergo SOC 2 Type II security evaluations and are restricted via signed DPAs with Standard Contractual Clauses (SCCs), enforcing ${retentionString}.`;
    }
    return `Third-party cloud sub-processors (${vendorString}) process data ${volumeForPhrase} under signed Data Processing Agreements (DPAs) with strict retention limits.`;
  }

  // 6. General Fallback preserving exact user sentences & numbers
  const sentences = cleanAndFixGrammarSentences(trimmed);
  let combined = sentences.join(' ');

  // Inject volume if present in user facts but missing from sentence context
  if (facts.volumePhrase && !combined.toLowerCase().includes(facts.volumePhrase.toLowerCase())) {
    combined = combined.replace(/\bprocessed\b/i, `processed ${volumeForPhrase}`);
  }

  // Auto-fill missing critical compliance elements if rewording for Nature of Processing
  if (promptContext && promptContext.toLowerCase().includes('nature')) {
    if (!combined.toLowerCase().includes('cloud') && !combined.toLowerCase().includes('sub-processor') && !combined.toLowerCase().includes('aws')) {
      combined += ` Data is hosted on secure enterprise ${vendorString} under signed Data Processing Agreements (DPAs).`;
    }
    if (!combined.toLowerCase().includes('purg') && !combined.toLowerCase().includes('delet') && !combined.toLowerCase().includes('retention')) {
      combined += ` Stored records are retained strictly for operational lifecycles and ${retentionString}.`;
    }
  }

  // Auto-fill missing volume/scope if rewording for Scope of Processing
  if (promptContext && promptContext.toLowerCase().includes('scope')) {
    if (!/\d+/.test(combined) && !combined.toLowerCase().includes('thousand') && !combined.toLowerCase().includes('million') && !combined.toLowerCase().includes('active user base') && !combined.toLowerCase().includes('enterprise deployments')) {
      combined += ` ${volumeCoversSentence}`;
    }
  }

  if (tone === 'concise') {
    return combined.replace(/\bthe organization\b/gi, '').replace(/\s+/g, ' ').trim();
  }

  if (tone === 'technical') {
    return `System implementation: ${combined}`;
  }

  return combined;
}
