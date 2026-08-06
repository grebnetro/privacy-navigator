import React from 'react';
import type { DPIAFormData } from '../types/dpia';

interface DPIADocumentViewProps {
  formData: DPIAFormData;
  id?: string;
}

export const DPIADocumentView: React.FC<DPIADocumentViewProps> = ({
  formData,
  id = 'dpia-document-preview',
}) => {
  return (
    <div
      id={id}
      style={{
        backgroundColor: '#ffffff',
        color: '#1e293b',
        fontFamily: 'Inter, Arial, sans-serif',
        padding: '32px',
        borderRadius: '8px',
        maxWidth: '896px',
        margin: '0 auto',
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
      }}
    >
      {/* Document Header */}
      <div style={{ borderBottom: '2px solid #0f172a', paddingBottom: '16px', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', margin: 0 }}>
          Data Protection Impact Assessment (DPIA)
        </h1>
        <p style={{ fontSize: '12px', color: '#475569', fontStyle: 'italic', marginTop: '4px', margin: 0 }}>
          Submitting Controller DPIA Record - Official ICO Standard Template Format
        </p>
      </div>

      {/* Controller Details */}
      <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>Submitting controller details</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px', fontSize: '13px' }}>
        <tbody>
          <tr>
            <th style={{ border: '1px solid #cbd5e1', padding: '10px', backgroundColor: '#f1f5f9', color: '#0f172a', width: '33%', textAlign: 'left' }}>Name of controller</th>
            <td style={{ border: '1px solid #cbd5e1', padding: '10px', backgroundColor: '#ffffff' }}>{formData.controllerDetails.controllerName || 'Not specified'}</td>
          </tr>
          <tr>
            <th style={{ border: '1px solid #cbd5e1', padding: '10px', backgroundColor: '#f1f5f9', color: '#0f172a', textAlign: 'left' }}>Subject/title of DPO</th>
            <td style={{ border: '1px solid #cbd5e1', padding: '10px', backgroundColor: '#ffffff' }}>{formData.controllerDetails.dpoTitle || 'Not specified'}</td>
          </tr>
          <tr>
            <th style={{ border: '1px solid #cbd5e1', padding: '10px', backgroundColor: '#f1f5f9', color: '#0f172a', textAlign: 'left' }}>Name of controller contact / DPO</th>
            <td style={{ border: '1px solid #cbd5e1', padding: '10px', backgroundColor: '#ffffff' }}>{formData.controllerDetails.dpoContactName || 'Not specified'}</td>
          </tr>
        </tbody>
      </table>

      {/* Step 1 */}
      <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>Step 1: Identify the need for a DPIA</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px', fontSize: '13px' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #cbd5e1', padding: '10px', backgroundColor: '#0f172a', color: '#ffffff', textAlign: 'left' }}>
              Explain broadly what project aims to achieve and why DPIA is needed
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ border: '1px solid #cbd5e1', padding: '12px', whiteSpace: 'pre-line', backgroundColor: '#ffffff', lineHeight: 1.5 }}>
              <strong style={{ color: '#0f172a' }}>PROJECT OVERVIEW:</strong>
              {'\n'}
              {formData.step1Need.projectOverview || 'None provided.'}
              {'\n\n'}
              <strong style={{ color: '#0f172a' }}>TRIGGER CRITERIA:</strong>
              {'\n'}
              {formData.step1Need.triggerReasons.length > 0
                ? formData.step1Need.triggerReasons.map((r) => `• ${r}`).join('\n')
                : 'No specific trigger reasons selected.'}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Step 2 */}
      <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>Step 2: Describe the processing</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px', fontSize: '13px' }}>
        <tbody>
          <tr>
            <th style={{ border: '1px solid #cbd5e1', padding: '10px', backgroundColor: '#1e293b', color: '#ffffff', textAlign: 'left' }}>
              2.1 Describe the nature of the processing
            </th>
          </tr>
          <tr>
            <td style={{ border: '1px solid #cbd5e1', padding: '12px', whiteSpace: 'pre-line', backgroundColor: '#ffffff', lineHeight: 1.5 }}>
              {formData.step2Processing.nature || 'Not specified.'}
            </td>
          </tr>

          <tr>
            <th style={{ border: '1px solid #cbd5e1', padding: '10px', backgroundColor: '#1e293b', color: '#ffffff', textAlign: 'left' }}>
              2.2 Describe the scope of the processing
            </th>
          </tr>
          <tr>
            <td style={{ border: '1px solid #cbd5e1', padding: '12px', whiteSpace: 'pre-line', backgroundColor: '#ffffff', lineHeight: 1.5 }}>
              {formData.step2Processing.scope || 'Not specified.'}
            </td>
          </tr>

          <tr>
            <th style={{ border: '1px solid #cbd5e1', padding: '10px', backgroundColor: '#1e293b', color: '#ffffff', textAlign: 'left' }}>
              2.3 Describe the context of the processing
            </th>
          </tr>
          <tr>
            <td style={{ border: '1px solid #cbd5e1', padding: '12px', whiteSpace: 'pre-line', backgroundColor: '#ffffff', lineHeight: 1.5 }}>
              {formData.step2Processing.context || 'Not specified.'}
            </td>
          </tr>

          <tr>
            <th style={{ border: '1px solid #cbd5e1', padding: '10px', backgroundColor: '#1e293b', color: '#ffffff', textAlign: 'left' }}>
              2.4 Describe the purposes of the processing
            </th>
          </tr>
          <tr>
            <td style={{ border: '1px solid #cbd5e1', padding: '12px', whiteSpace: 'pre-line', backgroundColor: '#ffffff', lineHeight: 1.5 }}>
              {formData.step2Processing.purpose || 'Not specified.'}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Step 3 */}
      <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>Step 3: Consultation process</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px', fontSize: '13px' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #cbd5e1', padding: '10px', backgroundColor: '#0f172a', color: '#ffffff', textAlign: 'left' }}>
              Consider how to consult with relevant stakeholders
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ border: '1px solid #cbd5e1', padding: '12px', whiteSpace: 'pre-line', backgroundColor: '#ffffff', lineHeight: 1.5 }}>
              <strong style={{ color: '#0f172a' }}>STAKEHOLDER CONSULTATION:</strong>
              {'\n'}
              {formData.step3Consultation.stakeholderConsultation || 'None specified.'}
              {'\n\n'}
              <strong style={{ color: '#0f172a' }}>JUSTIFICATION IF NOT CONSULTED:</strong>
              {'\n'}
              {formData.step3Consultation.justificationIfNotConsulted || 'N/A'}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Step 4 */}
      <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>Step 4: Assess necessity and proportionality</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px', fontSize: '13px' }}>
        <tbody>
          <tr>
            <th style={{ border: '1px solid #cbd5e1', padding: '10px', backgroundColor: '#f1f5f9', color: '#0f172a', width: '33%', textAlign: 'left' }}>Lawful Basis for Processing</th>
            <td style={{ border: '1px solid #cbd5e1', padding: '10px', backgroundColor: '#ffffff' }}>
              {formData.step4Necessity.lawfulBasis.length > 0
                ? formData.step4Necessity.lawfulBasis.join(', ')
                : 'Not specified'}
            </td>
          </tr>
          <tr>
            <th style={{ border: '1px solid #cbd5e1', padding: '10px', backgroundColor: '#f1f5f9', color: '#0f172a', textAlign: 'left' }}>Lawful Basis Details</th>
            <td style={{ border: '1px solid #cbd5e1', padding: '10px', whiteSpace: 'pre-line', backgroundColor: '#ffffff' }}>{formData.step4Necessity.lawfulBasisDetails || 'N/A'}</td>
          </tr>
          <tr>
            <th style={{ border: '1px solid #cbd5e1', padding: '10px', backgroundColor: '#f1f5f9', color: '#0f172a', textAlign: 'left' }}>Data Minimization & Quality</th>
            <td style={{ border: '1px solid #cbd5e1', padding: '10px', whiteSpace: 'pre-line', backgroundColor: '#ffffff' }}>{formData.step4Necessity.dataMinimizationAndQuality || 'N/A'}</td>
          </tr>
          <tr>
            <th style={{ border: '1px solid #cbd5e1', padding: '10px', backgroundColor: '#f1f5f9', color: '#0f172a', textAlign: 'left' }}>Function Creep Prevention</th>
            <td style={{ border: '1px solid #cbd5e1', padding: '10px', whiteSpace: 'pre-line', backgroundColor: '#ffffff' }}>{formData.step4Necessity.functionCreepPrevention || 'N/A'}</td>
          </tr>
          <tr>
            <th style={{ border: '1px solid #cbd5e1', padding: '10px', backgroundColor: '#f1f5f9', color: '#0f172a', textAlign: 'left' }}>Supporting Individual Rights</th>
            <td style={{ border: '1px solid #cbd5e1', padding: '10px', whiteSpace: 'pre-line', backgroundColor: '#ffffff' }}>{formData.step4Necessity.individualRightsSupport || 'N/A'}</td>
          </tr>
          <tr>
            <th style={{ border: '1px solid #cbd5e1', padding: '10px', backgroundColor: '#f1f5f9', color: '#0f172a', textAlign: 'left' }}>Processor Compliance</th>
            <td style={{ border: '1px solid #cbd5e1', padding: '10px', whiteSpace: 'pre-line', backgroundColor: '#ffffff' }}>{formData.step4Necessity.processorSafeguards || 'N/A'}</td>
          </tr>
          <tr>
            <th style={{ border: '1px solid #cbd5e1', padding: '10px', backgroundColor: '#f1f5f9', color: '#0f172a', textAlign: 'left' }}>International Transfers</th>
            <td style={{ border: '1px solid #cbd5e1', padding: '10px', whiteSpace: 'pre-line', backgroundColor: '#ffffff' }}>{formData.step4Necessity.internationalTransfers || 'N/A'}</td>
          </tr>
        </tbody>
      </table>

      {/* Step 5 */}
      <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>Step 5: Identify and assess risks</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px', fontSize: '13px' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #cbd5e1', padding: '10px', backgroundColor: '#0f172a', color: '#ffffff', width: '50%', textAlign: 'left' }}>Describe source of risk & potential impact on individuals</th>
            <th style={{ border: '1px solid #cbd5e1', padding: '10px', backgroundColor: '#0f172a', color: '#ffffff', textAlign: 'left' }}>Likelihood</th>
            <th style={{ border: '1px solid #cbd5e1', padding: '10px', backgroundColor: '#0f172a', color: '#ffffff', textAlign: 'left' }}>Severity</th>
            <th style={{ border: '1px solid #cbd5e1', padding: '10px', backgroundColor: '#0f172a', color: '#ffffff', textAlign: 'left' }}>Overall risk</th>
          </tr>
        </thead>
        <tbody>
          {formData.step5Risks.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ border: '1px solid #cbd5e1', padding: '10px', fontStyle: 'italic', color: '#64748b' }}>No risks recorded.</td>
            </tr>
          ) : (
            formData.step5Risks.map((risk) => (
              <tr key={risk.id}>
                <td style={{ border: '1px solid #cbd5e1', padding: '10px', whiteSpace: 'pre-line', backgroundColor: '#ffffff' }}>{risk.riskDescription || 'Unspecified risk'}</td>
                <td style={{ border: '1px solid #cbd5e1', padding: '10px', backgroundColor: '#ffffff' }}>{risk.likelihood}</td>
                <td style={{ border: '1px solid #cbd5e1', padding: '10px', backgroundColor: '#ffffff' }}>{risk.severity}</td>
                <td style={{ 
                  border: '1px solid #cbd5e1', 
                  padding: '10px', 
                  fontWeight: 700, 
                  backgroundColor: risk.overallRisk === 'High' ? '#fee2e2' : risk.overallRisk === 'Medium' ? '#fef3c7' : '#d1fae5',
                  color: risk.overallRisk === 'High' ? '#991b1b' : risk.overallRisk === 'Medium' ? '#92400e' : '#065f46'
                }}>
                  {risk.overallRisk}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Step 6 */}
      <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>Step 6: Identify measures to reduce risk</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px', fontSize: '13px' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #cbd5e1', padding: '10px', backgroundColor: '#0f172a', color: '#ffffff', textAlign: 'left' }}>Risk</th>
            <th style={{ border: '1px solid #cbd5e1', padding: '10px', backgroundColor: '#0f172a', color: '#ffffff', textAlign: 'left' }}>Options to reduce or eliminate risk</th>
            <th style={{ border: '1px solid #cbd5e1', padding: '10px', backgroundColor: '#0f172a', color: '#ffffff', textAlign: 'left' }}>Effect</th>
            <th style={{ border: '1px solid #cbd5e1', padding: '10px', backgroundColor: '#0f172a', color: '#ffffff', textAlign: 'left' }}>Residual risk</th>
            <th style={{ border: '1px solid #cbd5e1', padding: '10px', backgroundColor: '#0f172a', color: '#ffffff', textAlign: 'left' }}>Approved</th>
          </tr>
        </thead>
        <tbody>
          {formData.step6Mitigations.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ border: '1px solid #cbd5e1', padding: '10px', fontStyle: 'italic', color: '#64748b' }}>No mitigations recorded.</td>
            </tr>
          ) : (
            formData.step6Mitigations.map((mit) => (
              <tr key={mit.id}>
                <td style={{ border: '1px solid #cbd5e1', padding: '10px', backgroundColor: '#ffffff' }}>{mit.riskDescription}</td>
                <td style={{ border: '1px solid #cbd5e1', padding: '10px', whiteSpace: 'pre-line', backgroundColor: '#ffffff' }}>{mit.mitigationOptions || 'N/A'}</td>
                <td style={{ border: '1px solid #cbd5e1', padding: '10px', backgroundColor: '#ffffff' }}>{mit.effectOnRisk}</td>
                <td style={{ 
                  border: '1px solid #cbd5e1', 
                  padding: '10px', 
                  fontWeight: 700, 
                  backgroundColor: mit.residualRisk === 'High' ? '#fee2e2' : mit.residualRisk === 'Medium' ? '#fef3c7' : '#d1fae5',
                  color: mit.residualRisk === 'High' ? '#991b1b' : mit.residualRisk === 'Medium' ? '#92400e' : '#065f46'
                }}>
                  {mit.residualRisk}
                </td>
                <td style={{ border: '1px solid #cbd5e1', padding: '10px', backgroundColor: '#ffffff' }}>{mit.measureApproved ? 'Yes' : 'No'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Step 7 */}
      <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>Step 7: Sign off and record outcomes</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px', fontSize: '13px' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #cbd5e1', padding: '10px', backgroundColor: '#f1f5f9', color: '#0f172a', width: '33%', textAlign: 'left' }}>Item</th>
            <th style={{ border: '1px solid #cbd5e1', padding: '10px', backgroundColor: '#f1f5f9', color: '#0f172a', textAlign: 'left' }}>Name / Position / Date / Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th style={{ border: '1px solid #cbd5e1', padding: '10px', backgroundColor: '#ffffff', textAlign: 'left' }}>Measures approved by:</th>
            <td style={{ border: '1px solid #cbd5e1', padding: '10px', backgroundColor: '#ffffff' }}>{formData.step7SignOff.measuresApprovedBy || 'Not yet signed'}</td>
          </tr>
          <tr>
            <th style={{ border: '1px solid #cbd5e1', padding: '10px', backgroundColor: '#ffffff', textAlign: 'left' }}>Residual risks approved by:</th>
            <td style={{ border: '1px solid #cbd5e1', padding: '10px', backgroundColor: '#ffffff' }}>{formData.step7SignOff.residualRisksApprovedBy || 'Not yet signed'}</td>
          </tr>
          <tr>
            <th style={{ border: '1px solid #cbd5e1', padding: '10px', backgroundColor: '#ffffff', textAlign: 'left' }}>DPO advice provided:</th>
            <td style={{ border: '1px solid #cbd5e1', padding: '10px', backgroundColor: '#ffffff' }}>{formData.step7SignOff.dpoAdviceProvided ? 'Yes' : 'No'}</td>
          </tr>
          <tr>
            <th style={{ border: '1px solid #cbd5e1', padding: '10px', backgroundColor: '#ffffff', textAlign: 'left' }}>Summary of DPO advice:</th>
            <td style={{ border: '1px solid #cbd5e1', padding: '10px', whiteSpace: 'pre-line', backgroundColor: '#ffffff' }}>
              {formData.step7SignOff.dpoAdviceSummary || 'N/A'}
              {'\n'}
              Status: <strong>{formData.step7SignOff.dpoAdviceAccepted}</strong>
              {formData.step7SignOff.dpoAdviceAccepted === 'Overruled' && (
                `\nReason: ${formData.step7SignOff.dpoOverruledReason}`
              )}
            </td>
          </tr>
          <tr>
            <th style={{ border: '1px solid #cbd5e1', padding: '10px', backgroundColor: '#ffffff', textAlign: 'left' }}>Consultation responses reviewed by:</th>
            <td style={{ border: '1px solid #cbd5e1', padding: '10px', whiteSpace: 'pre-line', backgroundColor: '#ffffff' }}>
              {formData.step7SignOff.consultationReviewedBy || 'N/A'}
              {formData.step7SignOff.consultationDepartReason && (
                `\nNote: ${formData.step7SignOff.consultationDepartReason}`
              )}
            </td>
          </tr>
          <tr>
            <th style={{ border: '1px solid #cbd5e1', padding: '10px', backgroundColor: '#ffffff', textAlign: 'left' }}>DPIA review keeper:</th>
            <td style={{ border: '1px solid #cbd5e1', padding: '10px', backgroundColor: '#ffffff' }}>{formData.step7SignOff.reviewKeeper || 'Not specified'}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
