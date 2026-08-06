import type { DataType } from '../types/onboarding';

export interface DataAttributeItem {
  id: string;
  label: string;
  category: DataType;
  group: 'Health & Medical' | 'Biometric & Sensitive' | 'Identity & Contact' | 'Financial & Billing' | 'Minors & Education';
  icon: string;
}

export const REAL_WORLD_DATA_ITEMS: DataAttributeItem[] = [
  // Health & Medical -> PHI
  { id: 'lab_results', label: 'Patient lab test & diagnostic results', category: 'PHI', group: 'Health & Medical', icon: '🩺' },
  { id: 'medical_records', label: 'Medical diagnoses & treatment history', category: 'PHI', group: 'Health & Medical', icon: '🏥' },
  { id: 'prescriptions', label: 'Prescriptions & medication records', category: 'PHI', group: 'Health & Medical', icon: '💊' },
  { id: 'health_insurance', label: 'Health insurance member / Policy IDs', category: 'PHI', group: 'Health & Medical', icon: '📋' },

  // Biometric & Sensitive -> SENSITIVE_PII
  { id: 'fingerprints_facial', label: 'Fingerprints or facial scan biometrics', category: 'SENSITIVE_PII', group: 'Biometric & Sensitive', icon: '🖐️' },
  { id: 'genetic_dna', label: 'Genetic or DNA sequencing data', category: 'SENSITIVE_PII', group: 'Biometric & Sensitive', icon: '🧬' },
  { id: 'ethnicity_race', label: 'Racial or ethnic origin details', category: 'SENSITIVE_PII', group: 'Biometric & Sensitive', icon: '🌍' },
  { id: 'religious_beliefs', label: 'Religious, political, or philosophical beliefs', category: 'SENSITIVE_PII', group: 'Biometric & Sensitive', icon: '🕊️' },

  // Identity & Contact -> STANDARD_PII
  { id: 'full_names', label: 'Full names of individuals', category: 'STANDARD_PII', group: 'Identity & Contact', icon: '👤' },
  { id: 'email_addresses', label: 'Email addresses & phone numbers', category: 'STANDARD_PII', group: 'Identity & Contact', icon: '📧' },
  { id: 'home_address', label: 'Physical mailing or home addresses', category: 'STANDARD_PII', group: 'Identity & Contact', icon: '🏠' },
  { id: 'ip_device_ids', label: 'IP addresses, device IDs, or cookies', category: 'STANDARD_PII', group: 'Identity & Contact', icon: '💻' },
  { id: 'user_accounts', label: 'Usernames & login credentials', category: 'STANDARD_PII', group: 'Identity & Contact', icon: '🔑' },

  // Financial -> FINANCIAL
  { id: 'credit_cards', label: 'Credit card / Debit card numbers', category: 'FINANCIAL', group: 'Financial & Billing', icon: '💳' },
  { id: 'bank_accounts', label: 'Bank account & routing numbers', category: 'FINANCIAL', group: 'Financial & Billing', icon: '🏦' },
  { id: 'billing_history', label: 'Billing statements & transaction logs', category: 'FINANCIAL', group: 'Financial & Billing', icon: '🧾' },

  // Minors & Education -> CHILDREN
  { id: 'child_records', label: 'Information belonging to children under 16', category: 'CHILDREN', group: 'Minors & Education', icon: '👶' },
  { id: 'school_records', label: 'K-12 student school records', category: 'CHILDREN', group: 'Minors & Education', icon: '🎒' },
];

export function deriveCategoriesFromItems(selectedItemIds: string[]): DataType[] {
  const categories = new Set<DataType>();
  selectedItemIds.forEach((id) => {
    const found = REAL_WORLD_DATA_ITEMS.find((item) => item.id === id);
    if (found) {
      categories.add(found.category);
    }
  });
  return Array.from(categories);
}

export function getTriggersForCategory(category: DataType, selectedItemIds: string[]): string[] {
  return selectedItemIds
    .map((id) => REAL_WORLD_DATA_ITEMS.find((item) => item.id === id))
    .filter((item): item is DataAttributeItem => item !== undefined && item.category === category)
    .map((item) => item.label);
}
