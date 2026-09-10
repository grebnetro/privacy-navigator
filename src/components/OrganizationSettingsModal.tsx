import React, { useState } from 'react';
import type { OrganizationProfile } from '../types/organization';
import { ALL_JURISDICTION_OPTIONS } from '../types/organization';
import { Building2, UserCheck, Mail, Globe, Save, X, Sparkles, CheckCircle2, Square } from 'lucide-react';

interface OrganizationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: OrganizationProfile;
  onSave: (updated: OrganizationProfile) => void;
}

const REGIONAL_PILLS = [
  { id: 'Canada PIPEDA', label: '🇨🇦 Canada PIPEDA' },
  { id: 'Brazil LGPD', label: '🇧🇷 Brazil LGPD' },
  { id: 'Australia Privacy Act', label: '🇦🇺 Australia Privacy Act' },
  { id: 'Singapore PDPA', label: '🇸🇬 Singapore PDPA' },
  { id: 'Japan APPI', label: '🇯🇵 Japan APPI' },
  { id: 'UK GDPR / DPA 2018', label: '🇬🇧 UK GDPR / DPA 2018' },
];

export const OrganizationSettingsModal: React.FC<OrganizationSettingsModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
}) => {
  const [formData, setFormData] = useState<OrganizationProfile>(profile);
  const [savedSuccess, setSavedSuccess] = useState(false);

  React.useEffect(() => {
    setFormData(profile);
  }, [profile, isOpen]);

  if (!isOpen) return null;

  const handleToggleOperatingJurisdiction = (jId: string) => {
    const active = formData.activeOperatingJurisdictions || [];
    const exists = active.includes(jId);
    const updated = exists ? active.filter((id) => id !== jId) : [...active, jId];
    setFormData({ ...formData, activeOperatingJurisdictions: updated });
  };

  const handleToggleFramework = (fwId: string) => {
    const exists = formData.defaultRegionalFrameworks.includes(fwId);
    const updated = exists
      ? formData.defaultRegionalFrameworks.filter((f) => f !== fwId)
      : [...formData.defaultRegionalFrameworks, fwId];
    setFormData({ ...formData, defaultRegionalFrameworks: updated });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-2xl rounded-2xl p-6 border border-slate-800 shadow-2xl space-y-5 bg-slate-900/95 relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Organization Profile & Operating Regions
              </h2>
              <p className="text-xs text-slate-400">
                Configure your company's operating regions. Only selected regions will appear as choices during project assessments.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {savedSuccess && (
          <div className="p-3 bg-emerald-950/60 border border-emerald-500/50 rounded-xl text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Organization profile saved! All subsequent inquiries will use these operating regions automatically.</span>
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
              Organization / Controller Legal Name *
            </label>
            <input
              type="text"
              required
              value={formData.organizationName}
              onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
              placeholder="e.g. Acme Health"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                Default DPO Title
              </label>
              <input
                type="text"
                value={formData.dpoTitle}
                onChange={(e) => setFormData({ ...formData, dpoTitle: e.target.value })}
                placeholder="e.g. Executive Director, Privacy Officer"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                Default DPO Contact Name
              </label>
              <input
                type="text"
                value={formData.dpoContactName}
                onChange={(e) => setFormData({ ...formData, dpoContactName: e.target.value })}
                placeholder="e.g. Jane Doe"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Master Operating Regions Selector */}
          <div className="space-y-2.5 bg-slate-950 p-4 rounded-xl border border-blue-500/30">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-blue-400" />
                Company Operating Regions & Jurisdictions *
              </label>
              <span className="text-[11px] text-slate-400">
                {(formData.activeOperatingJurisdictions || []).length} region(s) selected
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Check all geographic regions where your company operates. Only selected regions will appear as choices when starting a new privacy assessment:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
              {ALL_JURISDICTION_OPTIONS.map((opt) => {
                const isSelected = (formData.activeOperatingJurisdictions || []).includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleToggleOperatingJurisdiction(opt.id)}
                    className={`text-left p-2.5 rounded-xl border text-xs transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-600/30 border-blue-500 text-blue-100 font-semibold shadow-sm'
                        : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate">
                      <span className="text-base shrink-0">{opt.flag}</span>
                      <span className="truncate">{opt.title}</span>
                    </span>
                    {isSelected ? (
                      <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 ml-1" />
                    ) : (
                      <Square className="w-3.5 h-3.5 text-slate-700 shrink-0 ml-1" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Default Regional Framework Pills (Multi-Select)
            </label>
            <div className="flex flex-wrap gap-2">
              {REGIONAL_PILLS.map((pill) => {
                const isSelected = formData.defaultRegionalFrameworks.includes(pill.id);
                return (
                  <button
                    key={pill.id}
                    type="button"
                    onClick={() => handleToggleFramework(pill.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-emerald-600/30 border-emerald-500 text-emerald-200 shadow-sm'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                    }`}
                  >
                    <span>{pill.label}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-blue-600/30 flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save Organization Defaults</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
