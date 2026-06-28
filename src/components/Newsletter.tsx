import React, { useState } from 'react';
import { Mail, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setStatus('error');
      setErrorMsg('Please enter a valid academic or professional email.');
      return;
    }

    setStatus('success');
    setEmail('');
    setTimeout(() => {
      setStatus('idle');
    }, 4000);
  };

  return (
    <section id="newsletter" className="w-full bg-[#f8f9fb] text-[#1a1a1a] py-16 px-4 md:px-8 overflow-hidden relative">
      {/* Background Decorative Element on the right */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-gray-200 via-gray-100 to-transparent opacity-60 pointer-events-none hidden md:block"></div>

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
        
        {/* Left Side: Content & Form */}
        <div className="w-full md:w-3/5 space-y-6">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1a1a1a]">
              Stay Decisive. Stay Informed.
            </h2>
            <p className="text-base text-gray-500 max-w-lg leading-relaxed">
              Get the world’s most objective political, financial, and technological analysis delivered directly to your inbox every morning. Free from algorithmic sensationalism.
            </p>
          </div>

          <div className="w-full max-w-lg mt-8">
            {status === 'success' ? (
              <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-lg flex items-center gap-4 animate-fade-in text-emerald-800">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold">You are Subscribed!</h4>
                  <p className="text-xs opacity-90 mt-1">We have added your address to our high-priority morning digest. Welcome aboard.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="Your email address..."
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === 'error') setStatus('idle');
                    }}
                    className="flex-1 px-4 py-3.5 text-sm text-[#1A1A1A] outline-none rounded-md border border-gray-200 bg-white shadow-sm focus:border-[#ef3a3e] focus:ring-2 focus:ring-red-100 transition-all duration-200"
                  />
                  <button
                    type="submit"
                    className="bg-[#ef3a3e] hover:bg-[#d12a2e] text-white px-8 py-3.5 font-semibold text-sm transition-colors duration-150 cursor-pointer rounded-md shadow-sm shrink-0"
                  >
                    Subscribe
                  </button>
                </div>

                {status === 'error' && (
                  <div className="text-red-500 text-xs flex items-center gap-1.5 font-medium mt-1">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}
              </form>
            )}

            <p className="text-[11px] text-gray-400 mt-3 leading-normal">
              By subscribing, you agree to our terms. We protect your mailbox with standard secure guidelines and will never sell your credentials.
            </p>
          </div>
        </div>

        {/* Right Side: Visual Element */}
        <div className="hidden md:flex w-full md:w-2/5 justify-center relative">
          {/* Decorative Envelopes */}
          <div className="relative w-64 h-64 flex items-center justify-center">
            {/* Background Blob */}
            <div className="absolute inset-0 bg-gradient-to-tr from-gray-300 to-gray-100 rounded-full blur-3xl opacity-50"></div>
            
            {/* Envelope 1 (Back) */}
            <div className="absolute top-4 left-4 bg-white/80 p-6 rounded-xl shadow-lg border border-gray-100 transform -rotate-12 backdrop-blur-sm">
              <Mail className="w-16 h-16 text-gray-300" strokeWidth={1} />
            </div>
            
            {/* Envelope 2 (Front) */}
            <div className="absolute bottom-4 right-4 bg-white p-8 rounded-xl shadow-xl border border-gray-50 transform rotate-6 z-10">
              <Mail className="w-20 h-20 text-[#ef3a3e]" strokeWidth={1.5} />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
