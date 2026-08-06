import type { DPIAFormData } from '../types/dpia';

export interface StepValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateStep(stepId: number, formData: DPIAFormData): StepValidationResult {
  const errors: Record<string, string> = {};

  switch (stepId) {
    case 0: {
      if (!formData.controllerDetails.controllerName.trim()) {
        errors.controllerName = 'Name of Controller (Company/Organization) is required.';
      }
      break;
    }
    case 1: {
      if (!formData.step1Need.projectOverview.trim()) {
        errors.projectOverview = 'Project Overview & Business Aims is required.';
      }
      if (formData.step1Need.triggerReasons.length === 0) {
        errors.triggerReasons = 'Please select at least one DPIA trigger criterion.';
      }
      break;
    }
    case 2: {
      if (!formData.step2Processing.nature.trim()) {
        errors.nature = '2.1 Nature of processing is required.';
      }
      if (!formData.step2Processing.scope.trim()) {
        errors.scope = '2.2 Scope of processing is required.';
      }
      if (!formData.step2Processing.context.trim()) {
        errors.context = '2.3 Context of processing is required.';
      }
      if (!formData.step2Processing.purpose.trim()) {
        errors.purpose = '2.4 Purpose of processing is required.';
      }
      break;
    }
    case 3: {
      if (!formData.step3Consultation.stakeholderConsultation.trim()) {
        errors.stakeholderConsultation = 'Stakeholders Consulted field is required.';
      }
      break;
    }
    case 4: {
      if (formData.step4Necessity.lawfulBasis.length === 0) {
        errors.lawfulBasis = 'Please select at least one Lawful Basis for processing.';
      }
      break;
    }
    case 5: {
      if (formData.step5Risks.length === 0) {
        errors.risks = 'Please add at least one privacy risk.';
      } else {
        formData.step5Risks.forEach((r, idx) => {
          if (!r.riskDescription.trim()) {
            errors[`risk-${idx}`] = `Risk #${idx + 1} description is required.`;
          }
        });
      }
      break;
    }
    case 6: {
      if (formData.step6Mitigations.length === 0) {
        errors.mitigations = 'No risks to configure controls for.';
      } else {
        formData.step6Mitigations.forEach((m, idx) => {
          if (!m.mitigationOptions.trim()) {
            errors[`mit-${idx}`] = `Control options for Risk #${idx + 1} are required.`;
          }
        });
      }
      break;
    }
    case 7: {
      if (!formData.step7SignOff.measuresApprovedBy.trim()) {
        errors.measuresApprovedBy = 'Measures Approved By is required.';
      }
      if (
        formData.step7SignOff.dpoAdviceAccepted === 'Overruled' &&
        !formData.step7SignOff.dpoOverruledReason.trim()
      ) {
        errors.dpoOverruledReason = 'Reason DPO advice was overruled is required.';
      }
      break;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function canNavigateToStep(targetStepId: number, formData: DPIAFormData): boolean {
  if (targetStepId === 0) return true;
  for (let s = 0; s < targetStepId; s++) {
    const { isValid } = validateStep(s, formData);
    if (!isValid) return false;
  }
  return true;
}
