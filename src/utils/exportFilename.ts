import type { DPIAFormData } from '../types/dpia';
import type { OnboardingPayload } from '../types/onboarding';

/**
 * Generates standardized export filenames in format:
 * YYYYMMDD - [Assessment Name] - [Project Name].[ext]
 * Example: 20260807 - DPIA - Patient Lab Inquiry Web Portal.pdf
 */
export function getFormattedExportFilename(
  formData: DPIAFormData,
  onboardingPayload?: OnboardingPayload | null,
  extension: 'pdf' | 'docx' = 'pdf'
): string {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const dateStr = `${yyyy}${mm}${dd}`;

  // Assessment Name (e.g. DPIA, HIPAA, PIA, US State PIA)
  let assessmentName = 'DPIA';
  const typeStr = onboardingPayload?.determinedAssessmentType || '';
  if (typeStr.toUpperCase().includes('HIPAA')) {
    assessmentName = 'HIPAA';
  } else if (typeStr.toUpperCase().includes('US_STATE')) {
    assessmentName = 'US State PIA';
  } else if (typeStr.toUpperCase().includes('PIA')) {
    assessmentName = 'PIA';
  } else {
    assessmentName = 'DPIA';
  }

  // Project Name
  const projectName = (formData.step1Need.projectName && formData.step1Need.projectName.trim())
    || (onboardingPayload?.projectTitle && onboardingPayload.projectTitle.trim())
    || 'Privacy Assessment Project';

  const cleanProjectName = projectName.replace(/[/\\?%*:|"<>]/g, '').trim();

  return `${dateStr} - ${assessmentName} - ${cleanProjectName}.${extension}`;
}

/**
 * AI/rule-based helper to extract/suggest a concise Project Name from a description
 */
export function generateProjectNameSuggestion(projectOverview: string, defaultTitle?: string): string {
  if (defaultTitle && defaultTitle.trim() && !defaultTitle.toLowerCase().includes('guided data protection')) {
    return defaultTitle.trim();
  }
  if (!projectOverview || !projectOverview.trim()) {
    return 'Privacy Assessment Project';
  }

  const text = projectOverview.trim();
  
  // Look for common noun phrases e.g. "Launch of an interactive AI Customer Support Assistant" -> "AI Customer Support Assistant"
  const patterns = [
    /(?:launch|implementation|deployment|development|creation|use|integration)\s+of\s+(?:an?\s+)?(?:a\s+)?([^,.;\n]{5,40})/i,
    /(?:system|application|portal|service|platform|module|tool|database|pipeline)\s+for\s+([^,.;\n]{5,40})/i,
  ];

  for (const pattern of patterns) {
    const match = pattern.exec(text);
    if (match && match[1]) {
      const phrase = match[1].trim()
        .replace(/^(secure\s+|cloud-based\s+|web-based\s+|interactive\s+|enterprise\s+)+/i, '')
        .split(' ')
        .slice(0, 5)
        .join(' ');
      if (phrase.length >= 3) {
        return phrase.replace(/\b\w/g, (l) => l.toUpperCase());
      }
    }
  }

  // Fallback: clean and take first 4-5 words
  const words = text.split(/\s+/).slice(0, 5).join(' ').replace(/[,.;!?]/g, '');
  return words.replace(/\b\w/g, (l) => l.toUpperCase());
}
