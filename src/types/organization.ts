import type { Jurisdiction } from './onboarding';

export interface JurisdictionOption {
  id: string;
  code: Jurisdiction;
  flag: string;
  title: string;
  desc: string;
  frameworkName: string;
}

export const ALL_JURISDICTION_OPTIONS: JurisdictionOption[] = [
  {
    id: 'US',
    code: 'US',
    flag: '🇺🇸',
    title: 'United States (US Federal & State Laws)',
    desc: 'Processes US resident data subject to HIPAA (health), CCPA/CPRA, or state privacy laws.',
    frameworkName: 'HIPAA / US State Laws',
  },
  {
    id: 'EU_EEA',
    code: 'EU_EEA',
    flag: '🇪🇺',
    title: 'European Union / EEA (GDPR)',
    desc: 'Processes personal data of residents in EU member states under GDPR rules.',
    frameworkName: 'EU GDPR (Art. 35)',
  },
  {
    id: 'CANADA',
    code: 'GLOBAL',
    flag: '🇨🇦',
    title: 'Canada (PIPEDA & Quebec Law 25)',
    desc: 'Processes Canadian resident data under PIPEDA or provincial privacy regulations.',
    frameworkName: 'Canada PIPEDA / Law 25',
  },
  {
    id: 'UK',
    code: 'EU_EEA',
    flag: '🇬🇧',
    title: 'United Kingdom (UK GDPR & DPA 2018)',
    desc: 'Processes UK resident data under UK GDPR and Data Protection Act 2018.',
    frameworkName: 'UK GDPR / DPA 2018',
  },
  {
    id: 'BRAZIL',
    code: 'GLOBAL',
    flag: '🇧🇷',
    title: 'Brazil (LGPD)',
    desc: 'Processes Brazilian resident data under Lei Geral de Proteção de Dados (LGPD).',
    frameworkName: 'Brazil LGPD',
  },
  {
    id: 'AUSTRALIA',
    code: 'GLOBAL',
    flag: '🇦🇺',
    title: 'Australia (Privacy Act 1988)',
    desc: 'Processes Australian resident data under Australian Privacy Principles (APPs).',
    frameworkName: 'Australia Privacy Act',
  },
  {
    id: 'GLOBAL',
    code: 'GLOBAL',
    flag: '🌐',
    title: 'Global / Multi-Regional (International)',
    desc: 'Operates across multiple international regions concurrently.',
    frameworkName: 'Multi-Regional Assessment',
  },
];

export interface OrganizationProfile {
  organizationName: string;
  dpoTitle: string;
  dpoContactName: string;
  activeOperatingJurisdictions: string[];
  defaultJurisdiction?: string;
  defaultRegionalFrameworks: string[];
}

export const DEFAULT_ORG_PROFILE: OrganizationProfile = {
  organizationName: 'Quest Diagnostics',
  dpoTitle: 'Executive Director, Privacy Officer',
  dpoContactName: 'Keena Hausmann',
  activeOperatingJurisdictions: ['US', 'EU_EEA', 'CANADA', 'UK', 'BRAZIL', 'AUSTRALIA', 'GLOBAL'],
  defaultRegionalFrameworks: ['Canada PIPEDA', 'Brazil LGPD'],
};

const ORG_STORAGE_KEY = 'ICO_ORGANIZATION_PROFILE';

export function getStoredOrgProfile(): OrganizationProfile {
  try {
    const saved = localStorage.getItem(ORG_STORAGE_KEY);
    if (saved) {
      return { ...DEFAULT_ORG_PROFILE, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error('Failed to load organization profile:', e);
  }
  return DEFAULT_ORG_PROFILE;
}

export function saveOrgProfile(profile: OrganizationProfile): void {
  try {
    localStorage.setItem(ORG_STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save organization profile:', e);
  }
}
