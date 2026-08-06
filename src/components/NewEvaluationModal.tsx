import React, { useRef } from 'react';
import { PlusCircle, Compass, FileSpreadsheet, Download, Upload, X, AlertTriangle } from 'lucide-react';
import type { DPIAFormData } from '../types/dpia';
import type { OnboardingPayload } from '../types/onboarding';
import { exportEvaluationJson, readEvaluationJsonFile, type EvaluationBackup } from '../utils/evaluationStorage';

interface NewEvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: DPIAFormData;
  onboardingPayload: OnboardingPayload | null;
  onStartNewWizard: () => void;
  onStartBlank: () => void;
  onLoadBackup: (backup: EvaluationBackup) => void;
}

export const NewEvaluationModal: React.FC<NewEvaluationModalProps> = ({
  isOpen,
  onClose,
  formData,
  onboardingPayload,
  onStartNewWizard,
  onStartBlank,
  onLoadBackup,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loadError, setLoadError] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handleExportBackup = () => {
    exportEvaluationJson(formData, onboardingPayload);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoadError(null);
      const backup = await readEvaluationJsonFile(file);
      onLoadBackup(backup);
      onClose();
    } catch (err) {
      console.error('Failed to load evaluation file:', err);
      setLoadError('Invalid evaluation JSON file format. Please select a valid Quest Privacy Navigator backup.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-6 relative text-slate-100">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600/20 border border-blue-500/30 rounded-xl text-blue-400">
            <PlusCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-heading">
              Start a New Privacy Evaluation
            </h3>
            <p className="text-xs text-slate-400">
              Your current evaluation is saved in local browser storage. Choose how you'd like to proceed:
            </p>
          </div>
        </div>

        {loadError && (
          <div className="p-3 bg-red-950/40 border border-red-500/50 rounded-xl text-xs text-red-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{loadError}</span>
          </div>
        )}

        {/* Action Options Grid */}
        <div className="space-y-3">
          {/* Option 1: Launch Onboarding Wizard */}
          <button
            type="button"
            onClick={() => {
              onStartNewWizard();
              onClose();
            }}
            className="w-full text-left p-4 bg-slate-950/80 hover:bg-blue-950/50 border border-slate-800 hover:border-blue-500/60 rounded-xl transition group flex items-start justify-between"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-bold text-sm text-blue-300 group-hover:text-blue-200">
                <Compass className="w-4 h-4 text-blue-400" />
                <span>🚀 Launch Framework Setup Wizard</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed pl-6">
                Start a fresh evaluation by answering the 4-step framework determination wizard for your new project.
              </p>
            </div>
          </button>

          {/* Option 2: Start Blank 7-Step Assessment */}
          <button
            type="button"
            onClick={() => {
              onStartBlank();
              onClose();
            }}
            className="w-full text-left p-4 bg-slate-950/80 hover:bg-indigo-950/50 border border-slate-800 hover:border-indigo-500/60 rounded-xl transition group flex items-start justify-between"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-bold text-sm text-indigo-300 group-hover:text-indigo-200">
                <FileSpreadsheet className="w-4 h-4 text-indigo-400" />
                <span>📝 Start Blank 7-Step Assessment</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed pl-6">
                Clear all fields and jump directly to Step 0 Controller Details using your company profile defaults.
              </p>
            </div>
          </button>

          {/* Option 3: Save Backup File (.json) */}
          <button
            type="button"
            onClick={handleExportBackup}
            className="w-full text-left p-4 bg-slate-950/80 hover:bg-emerald-950/50 border border-slate-800 hover:border-emerald-500/60 rounded-xl transition group flex items-start justify-between"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-bold text-sm text-emerald-300 group-hover:text-emerald-200">
                <Download className="w-4 h-4 text-emerald-400" />
                <span>💾 Save & Export Backup File (.json)</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed pl-6">
                Download a JSON backup file of your current evaluation before starting a new one.
              </p>
            </div>
          </button>

          {/* Option 4: Load Saved Evaluation File (.json) */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full text-left p-4 bg-slate-950/80 hover:bg-amber-950/50 border border-slate-800 hover:border-amber-500/60 rounded-xl transition group flex items-start justify-between"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-bold text-sm text-amber-300 group-hover:text-amber-200">
                <Upload className="w-4 h-4 text-amber-400" />
                <span>📂 Restore Saved Evaluation File (.json)</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed pl-6">
                Upload a previously saved `.json` evaluation file to restore your answers.
              </p>
            </div>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />
        </div>

        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
