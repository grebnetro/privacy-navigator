import type { DPIAFormData } from '../types/dpia';
import type { OnboardingPayload } from '../types/onboarding';

export interface EvaluationBackup {
  version: string;
  exportedAt: string;
  onboardingPayload: OnboardingPayload | null;
  formData: DPIAFormData;
}

/**
 * Downloads a timestamped .json backup of the evaluation data
 */
export function exportEvaluationJson(formData: DPIAFormData, onboardingPayload: OnboardingPayload | null): void {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
  const orgName = formData.controllerDetails.controllerName || 'Assessment';
  const filename = `Privacy_Evaluation_${orgName.replace(/[^a-zA-Z0-9]/g, '_')}_${timestamp}.json`;

  const backupData: EvaluationBackup = {
    version: '0.10.0',
    exportedAt: new Date().toISOString(),
    onboardingPayload,
    formData,
  };

  const jsonStr = JSON.stringify(backupData, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Reads and parses a .json backup file uploaded by the user
 */
export function readEvaluationJsonFile(file: File): Promise<EvaluationBackup> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content) as EvaluationBackup;
        if (!parsed.formData || !parsed.formData.controllerDetails) {
          throw new Error('Invalid evaluation backup format.');
        }
        resolve(parsed);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsText(file);
  });
}
