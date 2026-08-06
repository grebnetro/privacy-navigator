import React, { useState } from 'react';
import { 
  ShieldCheck,
  FileDown, 
  FileText, 
  Eye, 
  Save,
  PlusCircle,
  Download,
  Building2,
  Compass,
  LogOut
} from 'lucide-react';
import type { DPIAFormData } from '../types/dpia';
import { exportToDocx } from '../services/docxExport';
import { exportToPdf } from '../services/pdfExport';
import type { OnboardingPayload } from '../types/onboarding';
import type { OrganizationProfile } from '../types/organization';
import { exportEvaluationJson } from '../utils/evaluationStorage';

import versionData from '../../version.json';

interface HeaderProps {
  formData: DPIAFormData;
  onboardingPayload?: OnboardingPayload | null;
  orgProfile?: OrganizationProfile;
  onOpenNewEvaluation: () => void;
  onOpenPreview: () => void;
  onOpenOnboarding: () => void;
  onOpenOrgSettings: () => void;
  onSaveManual: () => void;
  onLogout?: () => void;
  lastSavedAt?: string;
}

export const Header: React.FC<HeaderProps> = ({
  formData,
  onboardingPayload,
  orgProfile,
  onOpenNewEvaluation,
  onOpenPreview,
  onOpenOnboarding,
  onOpenOrgSettings,
  onSaveManual,
  onLogout,
  lastSavedAt,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [showSaveToast, setShowSaveToast] = useState(false);

  const handleDocxExport = async () => {
    try {
      setIsExporting(true);
      await exportToDocx(formData);
    } catch (err) {
      console.error('Docx Export failed:', err);
      alert('Failed to generate Word document. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePdfExport = async () => {
    try {
      setIsExporting(true);
      await exportToPdf('dpia-document-preview', `DPIA_${formData.controllerDetails.controllerName || 'Official'}.pdf`);
    } catch (err) {
      console.error('PDF Export failed:', err);
      alert('Failed to generate PDF. Make sure to open Live Preview first or use print.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleManualSave = () => {
    onSaveManual();
    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(false), 2500);
  };

  const handleExportJson = () => {
    exportEvaluationJson(formData, onboardingPayload || null);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white px-4 lg:px-8 py-3.5 shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-between gap-4">
        {/* Left Column: Shield Logo + Title Stack */}
        <div className="flex items-start space-x-3.5">
          <div className="p-2.5 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl shadow-lg shadow-blue-500/20 shrink-0 mt-0.5">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col space-y-1">
            {/* Line 1: Title (One single line) */}
            <h1 className="text-xl font-bold font-heading tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent whitespace-nowrap">
              Privacy Navigator
            </h1>

            {/* Line 2: Version */}
            <div>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 font-mono font-semibold inline-block" id="app-version-tag">
                v{versionData.version}
              </span>
            </div>

            {/* Line 3: Framework Badge */}
            <div>
              {onboardingPayload ? (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-600/30 text-blue-300 border border-blue-400/40 font-semibold flex items-center gap-1">
                    <span>{onboardingPayload.determinedAssessmentType} Framework</span>
                  </span>
                  {onboardingPayload.determinedAssessmentType !== 'DPIA' && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/40 font-bold">
                      ⚠️ Module Under Development (Defaulting to DPIA)
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-medium inline-block">
                  Standard 7-Step
                </span>
              )}
            </div>

            {/* Line 4: Assistant Subtitle */}
            <p className="text-xs text-slate-400">
              {onboardingPayload?.assessmentTitle || 'Guided Data Protection Impact Assessment Assistant'}
            </p>
          </div>
        </div>

        {/* Right Column: Action Buttons Grouped Left to Right */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Other Controls (Left of Exports) */}
          <button
            onClick={handleExportJson}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/80 rounded-lg border border-emerald-500/40 transition shadow-sm"
            id="save-backup-btn"
            title="Download a backup file (.json) of your current evaluation"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Save Backup (.json)</span>
          </button>

          <button
            onClick={onOpenOrgSettings}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-200 bg-slate-800/90 hover:bg-slate-700 rounded-lg border border-slate-700 transition shadow-sm"
            id="org-profile-btn"
            title="Edit Organization Defaults (Controller Name, DPO Title, Contact)"
          >
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <span>🏢 {orgProfile?.organizationName || 'Org Profile'}</span>
          </button>

          <button
            onClick={onOpenOnboarding}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-300 bg-blue-950/60 hover:bg-blue-900/80 rounded-lg border border-blue-500/40 transition shadow-sm"
            id="change-framework-btn"
          >
            <Compass className="w-3.5 h-3.5 text-blue-400" />
            <span>Framework Selector</span>
          </button>

          <button
            onClick={onOpenPreview}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-600 transition shadow-sm"
            id="live-preview-btn"
          >
            <Eye className="w-3.5 h-3.5 text-blue-400" />
            <span>Live Document Preview</span>
          </button>

          {/* Export Group (To Left of Sign Out & Start New Evaluation) */}
          <button
            onClick={handleDocxExport}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition shadow-md shadow-blue-600/30 active:scale-95 disabled:opacity-50"
            id="download-docx-btn"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Export Word (.docx)</span>
          </button>

          <button
            onClick={handlePdfExport}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition shadow-md shadow-emerald-600/30 active:scale-95 disabled:opacity-50"
            id="download-pdf-btn"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </button>

          {/* Far Right Primary Actions: Start New Evaluation & Sign Out */}
          <button
            onClick={onOpenNewEvaluation}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-amber-300 bg-amber-950/70 hover:bg-amber-900/90 rounded-lg border border-amber-500/50 transition shadow-sm"
            id="start-new-eval-btn"
            title="Start a new evaluation, jump to beginning, or load saved backup"
          >
            <PlusCircle className="w-4 h-4 text-amber-400" />
            <span>➕ Start New Evaluation</span>
          </button>

          {onLogout && (
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-2.5 py-2 text-xs font-semibold text-slate-400 hover:text-red-300 bg-slate-900 hover:bg-red-950/40 rounded-lg border border-slate-800 hover:border-red-500/40 transition shadow-sm"
              title="Sign Out of Demo Evaluation Session"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-400 hover:text-red-400" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          )}
        </div>
      </div>

      {/* Auto-Save & Manual Save Bar */}
      <div className="max-w-7xl mx-auto mt-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          {showSaveToast && (
            <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40 animate-in fade-in duration-150">
              ✔ Assessment Saved Successfully to Local Storage & Session!
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleManualSave}
            className="text-[11px] font-semibold text-blue-300 hover:text-white bg-blue-950/50 hover:bg-blue-900/70 px-2.5 py-0.5 rounded border border-blue-500/30 transition flex items-center gap-1"
            title="Save current entries to browser storage"
          >
            <Save className="w-3 h-3 text-blue-400" />
            <span>Save Draft Now</span>
          </button>

          {lastSavedAt && (
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Save className="w-3 h-3 text-emerald-400" />
              Auto-saved locally at {lastSavedAt}
            </span>
          )}
        </div>
      </div>
    </header>
  );
};
