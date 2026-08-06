import React from 'react';
import { X, FileText, FileDown, Printer, ShieldCheck } from 'lucide-react';
import type { DPIAFormData } from '../types/dpia';
import { exportToDocx } from '../services/docxExport';
import { exportToPdf } from '../services/pdfExport';
import { DPIADocumentView } from './DPIADocumentView';

interface LivePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: DPIAFormData;
}

export const LivePreviewModal: React.FC<LivePreviewModalProps> = ({
  isOpen,
  onClose,
  formData,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto no-print">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-blue-600/20 text-blue-400 rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-heading text-white">
                ICO 7-Step DPIA Document Live Preview
              </h3>
              <p className="text-xs text-slate-400">
                Official document format matching standard ICO schema (`dpia-template.docx`)
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition"
              title="Print document"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              onClick={() => exportToDocx(formData)}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg flex items-center gap-1.5 transition"
            >
              <FileText className="w-4 h-4" />
              <span>Word (.docx)</span>
            </button>
            <button
              onClick={() => exportToPdf('dpia-document-preview-modal', `DPIA_${formData.controllerDetails.controllerName || 'Official'}.pdf`)}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg flex items-center gap-1.5 transition"
            >
              <FileDown className="w-4 h-4" />
              <span>PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto bg-slate-950/60">
          <DPIADocumentView formData={formData} id="dpia-document-preview-modal" />
        </div>
      </div>
    </div>
  );
};
