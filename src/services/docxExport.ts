import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  Table, 
  TableRow, 
  TableCell, 
  WidthType, 
  BorderStyle, 
  HeadingLevel, 
  AlignmentType,
  ShadingType
} from 'docx';
import { saveAs } from 'file-saver';
import type { DPIAFormData } from '../types/dpia';
import type { OnboardingPayload } from '../types/onboarding';
import { getFormattedExportFilename } from '../utils/exportFilename';

const HEADER_BG = '1F2937'; // Dark Slate
const HEADER_TEXT_COLOR = 'FFFFFF';
const LIGHT_BG = 'F9FAFB';
const BORDER_COLOR = 'D1D5DB';

const tableBorder = {
  style: BorderStyle.SINGLE,
  size: 4,
  color: BORDER_COLOR,
};

const cellBorders = {
  top: tableBorder,
  bottom: tableBorder,
  left: tableBorder,
  right: tableBorder,
};

function createHeaderCell(text: string, widthPercent: number = 100): TableCell {
  return new TableCell({
    width: { size: widthPercent, type: WidthType.PERCENTAGE },
    shading: { fill: HEADER_BG, type: ShadingType.CLEAR, color: 'auto' },
    margins: { top: 120, bottom: 120, left: 150, right: 150 },
    borders: cellBorders,
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text,
            bold: true,
            color: HEADER_TEXT_COLOR,
            size: 20, // 10pt
            font: 'Arial',
          }),
        ],
      }),
    ],
  });
}

function createTextCell(text: string, widthPercent: number = 100, isBold: boolean = false, bgHex: string = 'FFFFFF'): TableCell {
  return new TableCell({
    width: { size: widthPercent, type: WidthType.PERCENTAGE },
    shading: bgHex !== 'FFFFFF' ? { fill: bgHex, type: ShadingType.CLEAR, color: 'auto' } : undefined,
    margins: { top: 120, bottom: 120, left: 150, right: 150 },
    borders: cellBorders,
    children: text.split('\n').map((line) => 
      new Paragraph({
        children: [
          new TextRun({
            text: line || ' ',
            bold: isBold,
            size: 20,
            font: 'Arial',
          }),
        ],
      })
    ),
  });
}

export async function exportToDocx(formData: DPIAFormData, onboardingPayload?: OnboardingPayload | null): Promise<void> {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Title
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: 'Data Protection Impact Assessment (DPIA)',
                bold: true,
                size: 32, // 16pt
                color: '1E3A8A',
                font: 'Arial',
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Official Record based on the ICO 7-Step DPIA Standard Template',
                italics: true,
                size: 20,
                color: '4B5563',
                font: 'Arial',
              }),
            ],
          }),
          new Paragraph({ text: '' }),

          // Submitting Controller Details
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [
              new TextRun({
                text: 'Submitting Controller Details',
                bold: true,
                size: 24,
                color: '1F2937',
                font: 'Arial',
              }),
            ],
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createTextCell('Name of controller', 35, true, LIGHT_BG),
                  createTextCell(formData.controllerDetails.controllerName || 'Not specified', 65),
                ],
              }),
              new TableRow({
                children: [
                  createTextCell('Subject/title of DPO', 35, true, LIGHT_BG),
                  createTextCell(formData.controllerDetails.dpoTitle || 'Not specified', 65),
                ],
              }),
              new TableRow({
                children: [
                  createTextCell('Name of controller contact / DPO', 35, true, LIGHT_BG),
                  createTextCell(formData.controllerDetails.dpoContactName || 'Not specified', 65),
                ],
              }),
            ],
          }),
          new Paragraph({ text: '' }),

          // Step 1
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [
              new TextRun({
                text: 'Step 1: Identify the need for a DPIA',
                bold: true,
                size: 24,
                color: '1F2937',
                font: 'Arial',
              }),
            ],
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createHeaderCell('Project Aims & DPIA Trigger Criteria'),
                ],
              }),
              new TableRow({
                children: [
                  createTextCell(
                    `PROJECT OVERVIEW:\n${formData.step1Need.projectOverview || 'None provided.'}\n\nTRIGGER CRITERIA:\n${
                      formData.step1Need.triggerReasons.length > 0
                        ? formData.step1Need.triggerReasons.map((r) => `• ${r}`).join('\n')
                        : 'No specific trigger reasons selected.'
                    }`
                  ),
                ],
              }),
            ],
          }),
          new Paragraph({ text: '' }),

          // Step 2
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [
              new TextRun({
                text: 'Step 2: Describe the processing',
                bold: true,
                size: 24,
                color: '1F2937',
                font: 'Arial',
              }),
            ],
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [createHeaderCell('2.1 Nature of the processing')],
              }),
              new TableRow({
                children: [createTextCell(formData.step2Processing.nature || 'Not specified.')],
              }),
              new TableRow({
                children: [createHeaderCell('2.2 Scope of the processing')],
              }),
              new TableRow({
                children: [createTextCell(formData.step2Processing.scope || 'Not specified.')],
              }),
              new TableRow({
                children: [createHeaderCell('2.3 Context of the processing')],
              }),
              new TableRow({
                children: [createTextCell(formData.step2Processing.context || 'Not specified.')],
              }),
              new TableRow({
                children: [createHeaderCell('2.4 Purposes of the processing')],
              }),
              new TableRow({
                children: [createTextCell(formData.step2Processing.purpose || 'Not specified.')],
              }),
            ],
          }),
          new Paragraph({ text: '' }),

          // Step 3
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [
              new TextRun({
                text: 'Step 3: Consultation process',
                bold: true,
                size: 24,
                color: '1F2937',
                font: 'Arial',
              }),
            ],
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [createHeaderCell('Consider how to consult with relevant stakeholders')],
              }),
              new TableRow({
                children: [
                  createTextCell(
                    `STAKEHOLDER CONSULTATION:\n${formData.step3Consultation.stakeholderConsultation || 'None specified.'}\n\nJUSTIFICATION IF NOT CONSULTED:\n${
                      formData.step3Consultation.justificationIfNotConsulted || 'N/A'
                    }`
                  ),
                ],
              }),
            ],
          }),
          new Paragraph({ text: '' }),

          // Step 4
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [
              new TextRun({
                text: 'Step 4: Assess necessity and proportionality',
                bold: true,
                size: 24,
                color: '1F2937',
                font: 'Arial',
              }),
            ],
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createTextCell('Lawful Basis for Processing', 35, true, LIGHT_BG),
                  createTextCell(
                    formData.step4Necessity.lawfulBasis.length > 0
                      ? formData.step4Necessity.lawfulBasis.join(', ')
                      : 'Not specified',
                    65
                  ),
                ],
              }),
              new TableRow({
                children: [
                  createTextCell('Lawful Basis Details', 35, true, LIGHT_BG),
                  createTextCell(formData.step4Necessity.lawfulBasisDetails || 'N/A', 65),
                ],
              }),
              new TableRow({
                children: [
                  createTextCell('Data Minimization & Quality', 35, true, LIGHT_BG),
                  createTextCell(formData.step4Necessity.dataMinimizationAndQuality || 'N/A', 65),
                ],
              }),
              new TableRow({
                children: [
                  createTextCell('Function Creep Prevention', 35, true, LIGHT_BG),
                  createTextCell(formData.step4Necessity.functionCreepPrevention || 'N/A', 65),
                ],
              }),
              new TableRow({
                children: [
                  createTextCell('Supporting Individual Rights', 35, true, LIGHT_BG),
                  createTextCell(formData.step4Necessity.individualRightsSupport || 'N/A', 65),
                ],
              }),
              new TableRow({
                children: [
                  createTextCell('Processor Compliance & Safeguards', 35, true, LIGHT_BG),
                  createTextCell(formData.step4Necessity.processorSafeguards || 'N/A', 65),
                ],
              }),
              new TableRow({
                children: [
                  createTextCell('International Data Transfers', 35, true, LIGHT_BG),
                  createTextCell(formData.step4Necessity.internationalTransfers || 'N/A', 65),
                ],
              }),
            ],
          }),
          new Paragraph({ text: '' }),

          // Step 5
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [
              new TextRun({
                text: 'Step 5: Identify and assess risks',
                bold: true,
                size: 24,
                color: '1F2937',
                font: 'Arial',
              }),
            ],
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createHeaderCell('Describe source of risk and nature of potential impact on individuals', 50),
                  createHeaderCell('Likelihood of harm', 15),
                  createHeaderCell('Severity of harm', 15),
                  createHeaderCell('Overall risk', 20),
                ],
              }),
              ...formData.step5Risks.map(
                (risk) =>
                  new TableRow({
                    children: [
                      createTextCell(risk.riskDescription || 'Unspecified risk', 50),
                      createTextCell(risk.likelihood, 15),
                      createTextCell(risk.severity, 15),
                      createTextCell(risk.overallRisk, 20, true, risk.overallRisk === 'High' ? 'FEE2E2' : risk.overallRisk === 'Medium' ? 'FEF3C7' : 'D1FAE5'),
                    ],
                  })
              ),
            ],
          }),
          new Paragraph({ text: '' }),

          // Step 6
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [
              new TextRun({
                text: 'Step 6: Identify measures to reduce risk',
                bold: true,
                size: 24,
                color: '1F2937',
                font: 'Arial',
              }),
            ],
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createHeaderCell('Risk', 25),
                  createHeaderCell('Options to reduce or eliminate risk', 35),
                  createHeaderCell('Effect on risk', 15),
                  createHeaderCell('Residual risk', 15),
                  createHeaderCell('Measure approved', 10),
                ],
              }),
              ...formData.step6Mitigations.map(
                (mit) =>
                  new TableRow({
                    children: [
                      createTextCell(mit.riskDescription || 'Risk', 25),
                      createTextCell(mit.mitigationOptions || 'No control specified', 35),
                      createTextCell(mit.effectOnRisk, 15),
                      createTextCell(mit.residualRisk, 15, true, mit.residualRisk === 'High' ? 'FEE2E2' : mit.residualRisk === 'Medium' ? 'FEF3C7' : 'D1FAE5'),
                      createTextCell(mit.measureApproved ? 'Yes' : 'No', 10),
                    ],
                  })
              ),
            ],
          }),
          new Paragraph({ text: '' }),

          // Step 7
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [
              new TextRun({
                text: 'Step 7: Sign off and record outcomes',
                bold: true,
                size: 24,
                color: '1F2937',
                font: 'Arial',
              }),
            ],
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createTextCell('Item', 30, true, LIGHT_BG),
                  createTextCell('Name / Position / Date / Notes', 70, true, LIGHT_BG),
                ],
              }),
              new TableRow({
                children: [
                  createTextCell('Measures approved by:', 30, true),
                  createTextCell(formData.step7SignOff.measuresApprovedBy || 'Not yet signed'),
                ],
              }),
              new TableRow({
                children: [
                  createTextCell('Residual risks approved by:', 30, true),
                  createTextCell(formData.step7SignOff.residualRisksApprovedBy || 'Not yet signed'),
                ],
              }),
              new TableRow({
                children: [
                  createTextCell('DPO advice provided:', 30, true),
                  createTextCell(formData.step7SignOff.dpoAdviceProvided ? 'Yes' : 'No'),
                ],
              }),
              new TableRow({
                children: [
                  createTextCell('Summary of DPO advice:', 30, true),
                  createTextCell(
                    `${formData.step7SignOff.dpoAdviceSummary || 'N/A'}\nStatus: ${formData.step7SignOff.dpoAdviceAccepted}${
                      formData.step7SignOff.dpoAdviceAccepted === 'Overruled'
                        ? `\nReason: ${formData.step7SignOff.dpoOverruledReason}`
                        : ''
                    }`
                  ),
                ],
              }),
              new TableRow({
                children: [
                  createTextCell('Consultation responses reviewed by:', 30, true),
                  createTextCell(
                    `${formData.step7SignOff.consultationReviewedBy || 'N/A'}${
                      formData.step7SignOff.consultationDepartReason
                        ? `\nNote: ${formData.step7SignOff.consultationDepartReason}`
                        : ''
                    }`
                  ),
                ],
              }),
              new TableRow({
                children: [
                  createTextCell('This DPIA will kept under review by:', 30, true),
                  createTextCell(formData.step7SignOff.reviewKeeper || 'Not specified'),
                ],
              }),
            ],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const fileName = getFormattedExportFilename(formData, onboardingPayload, 'docx');
  saveAs(blob, fileName);
}
