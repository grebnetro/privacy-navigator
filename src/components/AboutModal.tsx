import React, { useState } from 'react';
import { 
  ShieldCheck, 
  X, 
  Search, 
  Lock, 
  Building2, 
  Compass, 
  ClipboardList, 
  Sparkles, 
  Save, 
  Eye, 
  Layout, 
  Info,
  CheckCircle2
} from 'lucide-react';
import versionData from '../../version.json';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FeatureCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  badgeColor: string;
  features: {
    name: string;
    description: string;
  }[];
}

const FEATURE_CATEGORIES: FeatureCategory[] = [
  {
    id: 'auth',
    title: 'Authentication & Session Security',
    icon: <Lock className="w-5 h-5 text-blue-400" />,
    color: 'border-blue-500/40 bg-blue-950/20',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    features: [
      {
        name: 'Enterprise SSO Demo Authentication',
        description: 'Simulated single sign-on login interface pre-populated with evaluator credentials for rapid security compliance demonstration.',
      },
      {
        name: 'Session Persistence & Auth Guards',
        description: 'Session storage management (quest_auth) guarding all evaluation workflows against unauthenticated access.',
      },
      {
        name: 'One-Click Header Sign-Out',
        description: 'Instant session sign-out action in the top header with automated token revocation and state reset.',
      },
    ],
  },
  {
    id: 'org',
    title: 'Organization Profile & System Defaults',
    icon: <Building2 className="w-5 h-5 text-slate-400" />,
    color: 'border-slate-700 bg-slate-900/40',
    badgeColor: 'bg-slate-800 text-slate-300 border-slate-700',
    features: [
      {
        name: 'Centralized Organization Profile Modal',
        description: 'Dedicated control panel (🏢 Org Profile) to define system-wide enterprise defaults.',
      },
      {
        name: 'Default Controller & DPO Attributes',
        description: 'System-wide auto-fill for Organization/Controller Name, DPO Name/Title, and DPO Contact Email across all 7 steps and report exports.',
      },
      {
        name: 'Dynamic Template Interpolation',
        description: 'Real-time binding of organization credentials into step guidance drawers, example cards, and exported preview documents.',
      },
    ],
  },
  {
    id: 'onboarding',
    title: 'Smart Privacy Framework Selector Engine',
    icon: <Compass className="w-5 h-5 text-cyan-400" />,
    color: 'border-cyan-500/40 bg-cyan-950/20',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    features: [
      {
        name: '4-Step Setup Wizard',
        description: 'Step-by-step wizard collecting project scope, operational jurisdictions, data classifications, and processing characteristics.',
      },
      {
        name: 'Multi-Jurisdiction Rule Engine',
        description: 'Intelligent decision matrix determining whether to mandate a GDPR Article 35 DPIA, HIPAA Security Analysis, or Combined Multi-Jurisdictional Assessment.',
      },
      {
        name: 'Dynamic Assessment Titles & Badges',
        description: 'Automatic framework badge generation and customizable project evaluation titles.',
      },
      {
        name: 'Under-Development Framework Gate',
        description: 'Prominent advisory banners for specialized frameworks (standalone HIPAA, US State PIAs) while safely defaulting to the core DPIA assessment engine.',
      },
    ],
  },
  {
    id: 'workflow',
    title: 'Interactive 7-Step DPIA Assessment Workflow',
    icon: <ClipboardList className="w-5 h-5 text-emerald-400" />,
    color: 'border-emerald-500/40 bg-emerald-950/20',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    features: [
      {
        name: 'Step 1: Need for DPIA (Scope & Objectives)',
        description: 'Defines project business aims, DPIA trigger criteria, Project/System Name input, and ✨ AI Auto-Suggest Name button.',
      },
      {
        name: 'Step 2: Processing Operations & Context',
        description: 'Details data flows, collection channels, storage mechanisms, interactive Data Subject Category pills (Patients, Employees, Minors), and data volume quantifiers.',
      },
      {
        name: 'Step 3: Stakeholder Consultation & Engagement',
        description: 'Interactive consultation selector pills (IT Security, Legal & DPO, DevOps, Sub-processors) and disproportional effort justification pills.',
      },
      {
        name: 'Step 4: Lawful Basis, Necessity & Proportionality',
        description: 'Smart GDPR Article 6 & Article 9 lawful basis pre-selection, plain-English legal guidance popups, retention purges, and sub-processor DPA safeguards.',
      },
      {
        name: 'Step 5: Privacy Risk Catalog & Scored Threat Scenarios',
        description: 'Pre-designed catalog featuring 6 real-world threat scenarios (Credential Leak, AI Retraining, Cloud Misconfiguration) pre-scored by Likelihood and Severity.',
      },
      {
        name: 'Step 6: Risk Safeguards & Pre-Designed Control Pills',
        description: 'Dynamic target risk cards rendering pre-designed clickable control pills (MFA, RBAC, Zero-retention DPA, PII Redactor, KMS) with residual risk scoring.',
      },
      {
        name: 'Step 7: Official Sign-Off & Governance Approval',
        description: 'Formal sign-off fields for DPO, InfoSec Lead, and Business Owner, decision status selector (Approved, Conditions, Rejected), and date-stamped execution.',
      },
    ],
  },
  {
    id: 'quality',
    title: 'Real-Time Quality Control & AI Text Polishing',
    icon: <Sparkles className="w-5 h-5 text-amber-400" />,
    color: 'border-amber-500/40 bg-amber-950/20',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    features: [
      {
        name: 'Real-Time Pitfall Quality Gate & Warning Banners',
        description: 'Background checker inspecting user inputs for compliance pitfalls (vague jargon, missing sub-processors, unquantified volume) and pausing advancement until resolved.',
      },
      {
        name: '✨ AI Reword & Text Synthesizer Modal',
        description: 'Advanced AI polishing modal utilizing concept extraction, sentence boundary splitting, and grammatical sentence synthesis.',
      },
      {
        name: 'Numerical Fact Preservation Engine',
        description: 'Automatic detection and retention of exact user quantities (e.g. "100,000 patients"), vendors, and retention timelines in AI outputs.',
      },
      {
        name: 'Quick Detail Insertion Pills',
        description: 'Interactive pills within the AI modal to instantly inject missing compliance facts (+ AWS Cloud DPA, + 3-Year Retention Purge, + 50,000 Scope).',
      },
      {
        name: 'Dynamic Context-Aware Guidance Panel',
        description: 'Step-specific guidance drawer adapting in real-time to organization name, DPO contact, project title, and data types.',
      },
    ],
  },
  {
    id: 'draft',
    title: 'Evaluation Draft Manager & Backup System',
    icon: <Save className="w-5 h-5 text-indigo-400" />,
    color: 'border-indigo-500/40 bg-indigo-950/20',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    features: [
      {
        name: 'New Evaluation Manager Modal',
        description: 'Header launcher (➕ Start New Evaluation) to switch evaluations, start blank drafts, or restore backup files.',
      },
      {
        name: 'JSON Backup Export & Restoration',
        description: 'One-click download (Save Backup (.json)) of full evaluation state and backup file restoration importer.',
      },
      {
        name: 'Auto-Save & Manual Save Status Bar',
        description: 'Background local browser auto-save with timestamp tracking and manual Save Draft Now button featuring animated toast notifications.',
      },
    ],
  },
  {
    id: 'reporting',
    title: 'Live Preview & Multi-Format Audit Reporting',
    icon: <Eye className="w-5 h-5 text-purple-400" />,
    color: 'border-purple-500/40 bg-purple-950/20',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    features: [
      {
        name: 'Interactive Live Document Preview Modal',
        description: 'Full-screen modal rendering the complete DPIA in official regulatory HTML document layout format.',
      },
      {
        name: 'Standardized Unique Export File Naming',
        description: 'Format YYYYMMDD - [Assessment Name] - [Project Name].[ext] (e.g. 20260807 - DPIA - Patient Lab Inquiry Web Portal.pdf).',
      },
      {
        name: 'Vector PDF Export Engine',
        description: 'Export PDF button outputting crisp, print-styled PDF documents formatted for official regulatory filing.',
      },
      {
        name: 'Editable Word (.docx) Export Engine',
        description: 'Export Word (.docx) button generating styled Word documents for internal enterprise archiving.',
      },
    ],
  },
  {
    id: 'ui',
    title: 'User Interface & Responsive Design',
    icon: <Layout className="w-5 h-5 text-teal-400" />,
    color: 'border-teal-500/40 bg-teal-950/20',
    badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
    features: [
      {
        name: 'Header Bar & Mobile Layout',
        description: 'Responsive top navigation featuring single-line titles, stacked version/framework badges, right-justified action buttons, and mobile icon-only rendering.',
      },
      {
        name: 'Corporate Quest Diagnostics Branding',
        description: 'Dark slate backdrop paired with corporate blue/emerald accents and official logo containers.',
      },
    ],
  },
];

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredCategories = FEATURE_CATEGORIES.map((cat) => {
    if (!searchQuery.trim()) return cat;
    const q = searchQuery.toLowerCase();
    const matchesCategory = cat.title.toLowerCase().includes(q);
    const matchingFeatures = cat.features.filter(
      (f) => f.name.toLowerCase().includes(q) || f.description.toLowerCase().includes(q)
    );
    if (matchesCategory) return cat;
    if (matchingFeatures.length > 0) return { ...cat, features: matchingFeatures };
    return null;
  }).filter(Boolean) as FeatureCategory[];

  const totalFeatures = FEATURE_CATEGORIES.reduce((acc, cat) => acc + cat.features.length, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl shadow-lg shadow-blue-500/20">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold font-heading text-white text-lg tracking-tight">
                  Quest Privacy Navigator
                </h3>
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-blue-600/30 text-blue-300 border border-blue-400/40 font-mono font-semibold">
                  v{versionData.version}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Guided Data Protection Impact Assessment Assistant • Feature & Capability Directory ({totalFeatures} Total Features)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            title="Close About Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-6 py-3 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between gap-4 shrink-0">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter features by keyword (e.g. AI, PDF, Risk, Lawful Basis)..."
              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
            <Info className="w-3.5 h-3.5 text-blue-400" />
            <span>8 Feature Categories • Built for GDPR, HIPAA & US Privacy Compliance</span>
          </div>
        </div>

        {/* Body Content: Categorized Feature List */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-950/40">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <p className="text-slate-400 text-sm font-medium">No features matching "{searchQuery}"</p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-xs text-blue-400 hover:underline font-semibold"
              >
                Clear Search Filter
              </button>
            </div>
          ) : (
            filteredCategories.map((category) => (
              <div
                key={category.id}
                className={`rounded-xl p-5 border ${category.color} transition shadow-sm space-y-4`}
              >
                {/* Category Header */}
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-slate-900 rounded-lg border border-slate-800">
                      {category.icon}
                    </div>
                    <h4 className="font-bold text-white text-base tracking-tight">
                      {category.title}
                    </h4>
                  </div>
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-semibold ${category.badgeColor}`}>
                    {category.features.length} Features
                  </span>
                </div>

                {/* Bulleted Feature List */}
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {category.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="p-3 bg-slate-900/80 rounded-lg border border-slate-800/80 hover:border-slate-700 transition flex items-start space-x-2.5 group"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                      <div className="space-y-0.5">
                        <h5 className="text-xs font-bold text-slate-100 group-hover:text-blue-300 transition-colors">
                          {feature.name}
                        </h5>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div>
            <span>Quest Privacy Navigator • Built with React, TypeScript & Tailwind CSS</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-lg transition border border-slate-700"
          >
            Close Directory
          </button>
        </div>
      </div>
    </div>
  );
};
