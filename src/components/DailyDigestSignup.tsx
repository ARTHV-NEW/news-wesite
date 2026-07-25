import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, CheckCircle2, AlertCircle, Clock, FileText, Globe, Cpu, 
  TrendingUp, Activity, Sparkles, ChevronRight, Eye, RefreshCw, Send
} from 'lucide-react';
import { addDailyDigestSubscriber } from '../services/db';
import { DailyDigestSubscriber } from '../types';

interface DeskOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  previewHeadline: string;
  previewBullet: string;
}

const DESK_OPTIONS: DeskOption[] = [
  {
    id: 'geopolitics',
    name: 'Geopolitics & World Affairs',
    description: 'Borders, international agreements, and state negotiations.',
    icon: <Globe className="w-4 h-4" />,
    color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    previewHeadline: 'Geneva Restoration Pact Approved by 45 States',
    previewBullet: 'Global heads of state ratify unified carbon offset targets at emergency UN Geneva Summit.'
  },
  {
    id: 'markets',
    name: 'Financial Markets & Macro',
    description: 'Interest rates, inflation alerts, and index analysis.',
    icon: <TrendingUp className="w-4 h-4" />,
    color: 'text-amber-600 bg-amber-50 border-amber-100',
    previewHeadline: 'Federal Reserve Signals 25bps Cool-down',
    previewBullet: 'Core inflation indexes drop to 2.1%, paving the way for immediate interest rate cuts next month.'
  },
  {
    id: 'tech',
    name: 'Tech & AI Innovations',
    description: 'Breakthrough dispatches, computing, and cybersecurity.',
    icon: <Cpu className="w-4 h-4" />,
    color: 'text-[#ef3a3e] bg-red-50 border-red-100',
    previewHeadline: 'Oncology Diagnostic AI Outperforms Radiologists',
    previewBullet: 'New clinical trials indicate AI screening system boosts early-stage cancer detection rate by 14%.'
  },
  {
    id: 'science',
    name: 'Science & Clinical Health',
    description: 'Space missions, medical research, and ecological frontiers.',
    icon: <Activity className="w-4 h-4" />,
    color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    previewHeadline: 'Quantum Fusion Reaches Net-Energy Threshold',
    previewBullet: 'Experimental lab reports breakthrough in magnetic plasma confinement, sustaining positive heat ratio.'
  }
];

export default function DailyDigestSignup() {
  const [email, setEmail] = useState('');
  const [selectedDesks, setSelectedDesks] = useState<string[]>(['geopolitics', 'tech']);
  const [deliveryTime, setDeliveryTime] = useState<'06:00' | '08:00' | '12:00'>('08:00');
  const [format, setFormat] = useState<'bullet' | 'paragraph' | 'headline'>('bullet');
  
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleToggleDesk = (id: string) => {
    setSelectedDesks(prev => {
      if (prev.includes(id)) {
        // Prevent deselecting all
        if (prev.length === 1) return prev;
        return prev.filter(d => d !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setStatus('error');
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setStatus('submitting');
    setErrorMsg('');

    try {
      const newSubscriber: DailyDigestSubscriber = {
        id: 'digest_sub_' + Date.now(),
        email: email.trim().toLowerCase(),
        categories: selectedDesks,
        deliveryTime,
        format,
        createdAt: new Date().toISOString()
      };

      await addDailyDigestSubscriber(newSubscriber);
      setStatus('success');
      setEmail('');
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setErrorMsg('Subscription failed. Please check network and retry.');
    }
  };

  return (
    <section id="daily-digest" className="w-full bg-[#fcfcfc] border-t border-b border-[#E0E0DE] py-16 px-4 md:px-8 relative overflow-hidden">
      {/* Visual background accents */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#ef3a3e_0.5px,transparent_0.5px)] [background-size:16px_16px] opacity-[0.03] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch relative z-10">
        
        {/* LEFT COLUMN: Core Sign-up form (Takes 7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 border border-gray-200 text-[#1A1A1A] font-mono text-[9px] uppercase tracking-widest font-black rounded-none">
              <Sparkles className="w-3.5 h-3.5 text-[#ef3a3e] fill-red-100 animate-pulse" />
              Headline Newsletters
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-black tracking-tight text-[#1a1a1a] leading-tight">
              Curated Daily Digest
            </h2>
            <p className="text-sm md:text-base text-gray-500 max-w-2xl leading-relaxed">
              Prefer bite-sized dispatches over full-length disquisitions? Receive a clean, tailored summary of the day’s most decisive headlines. 
              <span className="font-semibold text-gray-800 ml-1">No subscription fees, no credit cards, completely separate from premium models.</span>
            </p>
          </div>

          {status === 'success' ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-emerald-50 border border-emerald-200 p-8 rounded-none flex flex-col gap-4 text-emerald-800 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 border border-emerald-300">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-black text-emerald-950">Digest Configuration Complete!</h3>
                  <p className="text-xs text-emerald-700 font-medium">Your customized morning report node is successfully established.</p>
                </div>
              </div>
              <div className="border-t border-emerald-200/50 pt-3 text-xs leading-relaxed opacity-90">
                Starting tomorrow, a clean email digest will land in your inbox precisely at <strong className="font-bold">{deliveryTime}</strong> containing your chosen topics. Welcome to algorithmic independence.
              </div>
              <button 
                onClick={() => setStatus('idle')}
                className="self-start text-xs font-bold font-mono uppercase text-emerald-800 hover:underline mt-2 flex items-center gap-1 cursor-pointer bg-transparent border-none"
              >
                Sign up another address <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Step 1: Select Desks */}
              <div className="space-y-3">
                <span className="block font-mono text-[10px] text-gray-400 uppercase tracking-widest font-black">
                  Step 1: Choose Your Core News Desks
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {DESK_OPTIONS.map((desk) => {
                    const isSelected = selectedDesks.includes(desk.id);
                    return (
                      <div 
                        key={desk.id}
                        onClick={() => handleToggleDesk(desk.id)}
                        className={`p-4 border transition-all duration-200 cursor-pointer flex gap-3.5 items-start ${
                          isSelected 
                            ? 'border-[#ef3a3e] bg-white shadow-sm' 
                            : 'border-gray-200 hover:border-gray-300 bg-white/60'
                        }`}
                      >
                        <div className={`p-2 rounded-none border shrink-0 ${desk.color}`}>
                          {desk.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-sans font-bold text-xs text-[#1A1A1A] block truncate">{desk.name}</span>
                            <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                              isSelected ? 'border-[#ef3a3e] bg-[#ef3a3e]' : 'border-gray-300'
                            }`}>
                              {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                          </div>
                          <p className="text-[10px] text-gray-400 mt-0.5 leading-snug line-clamp-2">
                            {desk.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Delivery & Format Preferences */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                {/* Delivery schedule dials */}
                <div className="space-y-3">
                  <span className="block font-mono text-[10px] text-gray-400 uppercase tracking-widest font-black">
                    Step 2: Morning Delivery Schedule
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { val: '06:00', label: '6:00 AM', desc: 'Dawn Brief' },
                      { val: '08:00', label: '8:00 AM', desc: 'Market Start' },
                      { val: '12:00', label: '12:00 PM', desc: 'Noon Brief' }
                    ].map((time) => {
                      const isActive = deliveryTime === time.val;
                      return (
                        <button
                          key={time.val}
                          type="button"
                          onClick={() => setDeliveryTime(time.val as any)}
                          className={`p-3 border text-center transition-all cursor-pointer rounded-none ${
                            isActive 
                              ? 'border-[#ef3a3e] bg-red-50/10 text-[#ef3a3e]' 
                              : 'border-gray-200 hover:border-gray-300 bg-white text-[#1A1A1A]'
                          }`}
                        >
                          <Clock className={`w-4 h-4 mx-auto mb-1 opacity-70 ${isActive ? 'text-[#ef3a3e]' : 'text-gray-400'}`} />
                          <span className="block text-[11px] font-bold font-sans">{time.label}</span>
                          <span className="block text-[8px] text-gray-400 mt-0.5">{time.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Format choice */}
                <div className="space-y-3">
                  <span className="block font-mono text-[10px] text-gray-400 uppercase tracking-widest font-black">
                    Step 3: Executive Formatting
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { val: 'bullet', label: 'Bullet Points', desc: 'Rapid Reading' },
                      { val: 'paragraph', label: 'Paragraphs', desc: 'Short Context' },
                      { val: 'headline', label: 'Headlines', desc: 'Alert Mode' }
                    ].map((f) => {
                      const isActive = format === f.val;
                      return (
                        <button
                          key={f.val}
                          type="button"
                          onClick={() => setFormat(f.val as any)}
                          className={`p-3 border text-center transition-all cursor-pointer rounded-none ${
                            isActive 
                              ? 'border-[#ef3a3e] bg-red-50/10 text-[#ef3a3e]' 
                              : 'border-gray-200 hover:border-gray-300 bg-white text-[#1A1A1A]'
                          }`}
                        >
                          <FileText className={`w-4 h-4 mx-auto mb-1 opacity-70 ${isActive ? 'text-[#ef3a3e]' : 'text-gray-400'}`} />
                          <span className="block text-[11px] font-bold font-sans">{f.label}</span>
                          <span className="block text-[8px] text-gray-400 mt-0.5">{f.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Step 3: Input Form Submission */}
              <div className="space-y-2 pt-4 border-t border-gray-100">
                <span className="block font-mono text-[10px] text-gray-400 uppercase tracking-widest font-black">
                  Step 4: Establish Delivery Address
                </span>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 flex bg-white border border-gray-200 rounded-none overflow-hidden p-1 focus-within:border-gray-500 transition-colors shadow-sm">
                    <div className="p-3 text-gray-400 flex items-center justify-center">
                      <Mail className="w-4 h-4 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      required
                      placeholder="Enter your professional or private email..."
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (status === 'error') setStatus('idle');
                      }}
                      className="w-full bg-transparent border-none outline-none text-xs md:text-sm text-[#1A1A1A] px-1"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="bg-[#1A1A1A] hover:bg-[#ef3a3e] text-white px-8 py-3.5 font-sans font-bold text-xs uppercase tracking-wider transition-all duration-150 cursor-pointer rounded-none shrink-0 flex items-center justify-center gap-1.5 shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {status === 'submitting' ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Registering...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Initiate Digest</span>
                      </>
                    )}
                  </button>
                </div>

                {status === 'error' && (
                  <div className="text-red-500 text-xs flex items-center gap-1.5 font-medium mt-1 animate-fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}
              </div>

            </form>
          )}

          <div className="text-[10px] text-gray-400 border-t border-gray-100 pt-3 leading-normal">
            No advertisements. Unsubscribing is single-click from any digest footer. We comply strictly with GDPR, security guidelines, and never share subscriber datasets with telemetry aggregators.
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Live Digest Email Preview (Takes 5 cols) */}
        <div className="lg:col-span-5 bg-white border border-[#E0E0DE] p-5 shadow-sm flex flex-col justify-between relative min-h-[420px]">
          {/* Top Envelope Ribbon */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-[#ef3a3e] to-emerald-500"></div>

          <div className="space-y-4">
            {/* Subject/Header bar */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mt-1">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-[#1A1A1A] flex items-center justify-center">
                  <span className="text-[10px] font-black text-white font-serif">P</span>
                </div>
                <div>
                  <span className="font-sans font-black text-[11px] text-gray-900 block leading-none">Morning Pulse</span>
                  <span className="text-[8px] text-gray-400 font-mono">DIGEST NODE</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-gray-400 bg-gray-50 px-2 py-1 border border-gray-100 text-[9px] font-mono rounded-none">
                <Eye className="w-3 h-3 text-[#ef3a3e]" />
                <span>Live Preview</span>
              </div>
            </div>

            {/* Email Headers */}
            <div className="space-y-1 bg-gray-50/50 p-3 border border-gray-100 font-sans text-[11px] text-gray-600">
              <div><strong className="font-semibold text-gray-900">From:</strong> digest@morningpulse.com</div>
              <div><strong className="font-semibold text-gray-900">To:</strong> {email.trim() ? email.trim() : <span className="text-gray-300 italic">your_address@domain.com</span>}</div>
              <div><strong className="font-semibold text-gray-900">Delivery:</strong> Tomorrow at <span className="text-indigo-600 font-bold">{deliveryTime}</span></div>
              <div><strong className="font-semibold text-gray-900">Subject:</strong> [Morning Pulse Digest] Customized Editorial Summary</div>
            </div>

            {/* Email Body Area */}
            <div className="space-y-5 pt-2">
              <div className="text-center">
                <h3 className="font-serif font-black text-sm text-gray-900 tracking-tight">Your Customized Morning Headlines</h3>
                <span className="font-mono text-[8px] text-gray-400 uppercase tracking-widest mt-0.5 block">
                  Format: {format === 'bullet' ? 'Bite-Sized Bullets' : format === 'paragraph' ? 'Context Paragraphs' : 'Headline Alerts Only'}
                </span>
              </div>

              {/* Dynamic content rendering based on selectedDesks */}
              <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1">
                {selectedDesks.length === 0 ? (
                  <div className="text-center py-6 text-xs text-gray-300 italic">
                    Select at least one desk to see your email summary build dynamically...
                  </div>
                ) : (
                  DESK_OPTIONS.filter(d => selectedDesks.includes(d.id)).map((desk) => (
                    <div key={desk.id} className="space-y-1 animate-scale-up">
                      {/* Desk Header */}
                      <div className="flex items-center gap-1">
                        <span className="text-xs uppercase font-bold text-gray-800 font-sans tracking-wide flex items-center gap-1">
                          <span className="inline-block scale-75 text-gray-400">{desk.icon}</span>
                          {desk.name.split(' & ')[0]}
                        </span>
                        <div className="flex-1 h-[0.5px] bg-gray-100"></div>
                      </div>

                      {/* Content style according to format selection */}
                      {format === 'bullet' && (
                        <div className="flex items-start gap-1.5 pl-1">
                          <span className="text-[#ef3a3e] font-bold text-xs pt-0.5 shrink-0">•</span>
                          <p className="text-[11px] text-gray-500 leading-relaxed">
                            <strong className="font-bold text-gray-900 block">{desk.previewHeadline}</strong>
                            {desk.previewBullet}
                          </p>
                        </div>
                      )}

                      {format === 'paragraph' && (
                        <p className="text-[11px] text-gray-500 leading-relaxed pl-1">
                          <strong className="font-bold text-gray-900">{desk.previewHeadline}</strong> — {desk.previewBullet} Analysts point to historic implications for both regional sectors and macroeconomic variables, changing indices values immediately.
                        </p>
                      )}

                      {format === 'headline' && (
                        <div className="flex items-center gap-1.5 pl-1">
                          <span className="px-1 bg-red-100 text-red-700 text-[8px] font-bold font-mono tracking-wider uppercase scale-90">ALERT</span>
                          <span className="text-xs font-bold text-gray-900 leading-snug hover:underline cursor-pointer">{desk.previewHeadline}</span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Email Footer */}
          <div className="border-t border-gray-100 pt-3 mt-4 text-center">
            <span className="text-[8px] text-gray-400 font-mono tracking-wider uppercase block">
              Morning Pulse Media Group LLC · 100 London Wall, UK
            </span>
            <div className="flex justify-center gap-3 text-[8px] text-gray-400 font-sans mt-1">
              <span className="hover:underline cursor-pointer">Unsubscribe instantly</span>
              <span>•</span>
              <span className="hover:underline cursor-pointer">Preferences node</span>
              <span>•</span>
              <span className="hover:underline cursor-pointer">Privacy ledger</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
