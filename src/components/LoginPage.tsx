import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('evaluator@questdiagnostics.com');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      sessionStorage.setItem('quest_auth', 'true');
      setIsLoading(false);
      onLogin();
    }, 600);
  };

  const handleSsoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      sessionStorage.setItem('quest_auth', 'true');
      setIsLoading(false);
      onLogin();
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Dynamic Background Glow Elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-blue-600/20 via-indigo-600/10 to-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full relative z-10 space-y-6">
        {/* Logo & Portal Branding */}
        <div className="text-center space-y-3">
          <div className="inline-flex p-3 bg-white rounded-2xl border border-slate-200 shadow-2xl items-center justify-center mb-1">
            <img src="/DGX.svg" alt="Quest Diagnostics Logo" className="h-11 w-auto object-contain" />
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-heading tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
            Privacy Navigator
          </h1>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            Enterprise Data Protection Impact Assessment (DPIA) & Regulatory Compliance Suite
          </p>
        </div>

        {/* Glassmorphic Login Card */}
        <div className="glass-panel rounded-2xl p-6 md:p-8 border border-slate-800 shadow-2xl space-y-6 bg-slate-900/80 backdrop-blur-xl">
          {/* SSO Quick Login Button */}
          <button
            type="button"
            onClick={handleSsoLogin}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-blue-600/25 transition flex items-center justify-center gap-2 group"
          >
            <Lock className="w-4 h-4 text-blue-200" />
            <span>Sign In with Quest Enterprise SSO (Okta / Azure AD)</span>
            <ArrowRight className="w-4 h-4 text-blue-200 group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-800" />
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">or sign in with demo credentials</span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                Work Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="privacy.officer@questdiagnostics.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-blue-400" />
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="••••••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-blue-500/50 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-slate-300 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to Evaluation Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Evaluator Quick Demo Banner */}
          <div className="bg-blue-950/40 p-3.5 rounded-xl border border-blue-500/30 text-xs text-blue-300 space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Evaluator Demo Access:</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Click either button above to enter the live proof-of-concept assessment workspace.
            </p>
          </div>
        </div>

        {/* Footer Feature Pills */}
        <div className="grid grid-cols-3 gap-2 text-center text-[10px] text-slate-400 font-medium">
          <div className="p-2 bg-slate-900/60 rounded-lg border border-slate-800">
            🛡️ GDPR & HIPAA Engine
          </div>
          <div className="p-2 bg-slate-900/60 rounded-lg border border-slate-800">
            ⚡ Real-time Quality Gate
          </div>
          <div className="p-2 bg-slate-900/60 rounded-lg border border-slate-800">
            ✨ AI Audit Polisher
          </div>
        </div>

        <p className="text-[11px] text-slate-500 text-center font-mono">
          Quest Diagnostics Privacy Navigator • Proof of Concept Demo
        </p>
      </div>
    </div>
  );
};
