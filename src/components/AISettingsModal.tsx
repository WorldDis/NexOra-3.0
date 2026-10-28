import React, { useState, useEffect } from 'react';
import {
  X,
  Key,
  Cpu,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Bot,
  Zap,
  Globe,
  Radio,
} from 'lucide-react';
import { aiSettingsManager, AIProviderChoice, AISettings } from '../brain/provider/AISettingsManager';

interface AISettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AISettingsModal: React.FC<AISettingsModalProps> = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState<AISettings>(aiSettingsManager.getSettings());
  const [openAiKeyInput, setOpenAiKeyInput] = useState('');
  const [testStatus, setTestStatus] = useState<{ testing: boolean; message: string; success?: boolean } | null>(null);

  useEffect(() => {
    if (isOpen) {
      const current = aiSettingsManager.getSettings();
      setSettings(current);
      setOpenAiKeyInput(current.openAiApiKey || '');
      setTestStatus(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    aiSettingsManager.saveSettings({
      provider: settings.provider,
      openAiApiKey: openAiKeyInput.trim(),
      adminMode: settings.adminMode,
    });
    onClose();
  };

  const handleTestConnection = async () => {
    setTestStatus({ testing: true, message: 'Testing AI Connection...' });
    try {
      const response = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userQuery: 'কেমন আছো? test ping',
          availableToolsJson: '[]',
          currentContextState: 'System idle',
          preferredProvider: settings.provider,
          openAiApiKey: openAiKeyInput.trim() || settings.openAiApiKey,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();
      setTestStatus({
        testing: false,
        success: true,
        message: `Connected successfully! Provider: ${data.provider} ("${data.finalResponseToUser || 'Ready'}")`,
      });
    } catch (e: any) {
      setTestStatus({
        testing: false,
        success: false,
        message: `Connection failed: ${e.message}. (Free Local Reasoner will still operate offline).`,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border border-cyan-500/50 rounded-3xl p-6 shadow-[0_0_60px_rgba(6,182,212,0.3)] space-y-5 relative">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 text-cyan-400 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                AI Engine & Secret Key Setup
              </h3>
              <p className="text-xs text-slate-400 font-bengali">
                OpenAI, Gemini ও Free AI কানেকশন ম্যানেজমেন্ট
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Provider Selection */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-300 block">
            AI Provider নির্বাচন করুন (Choose AI Connection):
          </label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {/* Auto (Smart Free First) */}
            <button
              type="button"
              onClick={() => setSettings({ ...settings, provider: 'auto' })}
              className={`p-3 rounded-2xl border text-left transition-all ${
                settings.provider === 'auto'
                  ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 shadow-[0_0_20px_rgba(6,182,212,0.25)]'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold text-cyan-400">
                <Zap className="w-3.5 h-3.5" />
                <span>Auto (Recommended)</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 font-bengali">
                ফ্রি এআই প্রথম, কি থাকলে ওপেন এআই
              </p>
            </button>

            {/* OpenAI */}
            <button
              type="button"
              onClick={() => setSettings({ ...settings, provider: 'openai' })}
              className={`p-3 rounded-2xl border text-left transition-all ${
                settings.provider === 'openai'
                  ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 shadow-[0_0_20px_rgba(6,182,212,0.25)]'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                <Bot className="w-3.5 h-3.5" />
                <span>OpenAI GPT-4o-mini</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 font-bengali">
                আপনার OpenAI API কি দিয়ে
              </p>
            </button>

            {/* Gemini */}
            <button
              type="button"
              onClick={() => setSettings({ ...settings, provider: 'gemini' })}
              className={`p-3 rounded-2xl border text-left transition-all ${
                settings.provider === 'gemini'
                  ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 shadow-[0_0_20px_rgba(6,182,212,0.25)]'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold text-blue-400">
                <Globe className="w-3.5 h-3.5" />
                <span>Google Gemini AI</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 font-bengali">
                সার্ভার-সাইড আল্ট্রাফাস্ট মডেল
              </p>
            </button>

            {/* Free Neural Reasoner */}
            <button
              type="button"
              onClick={() => setSettings({ ...settings, provider: 'free' })}
              className={`p-3 rounded-2xl border text-left transition-all ${
                settings.provider === 'free'
                  ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 shadow-[0_0_20px_rgba(6,182,212,0.25)]'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold text-purple-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>100% Free Reasoner</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 font-bengali">
                কোনো কি লাগবে না, ১০০% ফ্রি
              </p>
            </button>
          </div>
        </div>

        {/* OpenAI Key Input (Optional if user wants to use OpenAI) */}
        <div className="space-y-2 bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800 text-xs">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-cyan-400" />
              <span>OpenAI Secret API Key (যদি থাকে):</span>
            </label>
            <span className="text-[10px] text-slate-400 font-mono">Optional / Free AI default</span>
          </div>
          <input
            type="password"
            value={openAiKeyInput}
            onChange={(e) => setOpenAiKeyInput(e.target.value)}
            placeholder="sk-proj-... (OpenAI কি থাকলে এখানে দিন, না থাকলে অটো ফ্রি চলবে)"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 font-mono focus:outline-none focus:border-cyan-400"
          />
          <p className="text-[11px] text-slate-400 font-bengali leading-relaxed">
            💡 আপনার কাছে যদি OpenAI API কী থাকে তবে এখানে পেস্ট করতে পারেন। কী না থাকলেও কোনো চিন্তা নেই, নেক্সোরা সম্পূর্ণ বিনামূল্যে <strong>Free AI Reasoner</strong> দিয়ে সব কথা শুনবে ও কাজ করবে!
          </p>
        </div>

        {/* Admin Mode Setting */}
        <div
          onClick={() => setSettings({ ...settings, adminMode: !settings.adminMode })}
          className="p-3 bg-slate-950/70 border border-slate-800 hover:border-cyan-500/50 rounded-2xl flex items-center justify-between cursor-pointer transition-all text-xs"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-slate-200">
                Device Admin Full Authority (এডমিন মুড)
              </div>
              <div className="text-[11px] text-slate-400 font-bengali">
                বারবার অনুমতি না চেয়ে এআই সরাসরি সব কমান্ড কার্যকর করবে
              </div>
            </div>
          </div>
          <input
            type="checkbox"
            checked={settings.adminMode}
            onChange={() => {}}
            className="w-4 h-4 accent-cyan-500 rounded"
          />
        </div>

        {/* Test status banner */}
        {testStatus && (
          <div
            className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${
              testStatus.testing
                ? 'bg-blue-950/50 border-blue-800 text-blue-200 animate-pulse'
                : testStatus.success
                ? 'bg-emerald-950/50 border-emerald-800 text-emerald-200'
                : 'bg-rose-950/50 border-rose-800 text-rose-200'
            }`}
          >
            {testStatus.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            )}
            <div className="leading-relaxed font-mono text-[11px]">{testStatus.message}</div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex items-center gap-2 pt-2">
          <button
            type="button"
            onClick={handleTestConnection}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs border border-slate-700 transition-all flex items-center gap-1.5"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Test Connection</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs shadow-lg shadow-cyan-950/50 transition-all flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4 text-slate-950" />
            <span>SAVE & CONNECT (সংরক্ষণ করুন)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
