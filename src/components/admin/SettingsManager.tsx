import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, CheckCircle2, Plus, Trash2, Sliders } from 'lucide-react';
import { subscribeSettings, updateGeneralSettings, GeneralSettings } from '../../services/db';

export default function SettingsManager() {
  const [settings, setSettings] = useState<GeneralSettings | null>(null);
  
  // Form States
  const [siteName, setSiteName] = useState('');
  const [siteLogoText, setSiteLogoText] = useState('');
  const [siteSubtitle, setSiteSubtitle] = useState('');
  const [tickerItems, setTickerItems] = useState<string[]>([]);
  
  // Ticker adding helper
  const [newTickerLine, setNewTickerLine] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    const unsubscribe = subscribeSettings((liveSettings) => {
      if (liveSettings) {
        setSettings(liveSettings);
        setSiteName(liveSettings.siteName || '');
        setSiteLogoText(liveSettings.siteLogoText || '');
        setSiteSubtitle(liveSettings.siteSubtitle || '');
        setTickerItems(liveSettings.tickerItems || []);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleAddTickerLine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTickerLine.trim()) return;
    setTickerItems([...tickerItems, newTickerLine.trim().toUpperCase()]);
    setNewTickerLine('');
  };

  const handleRemoveTickerLine = (idx: number) => {
    setTickerItems(tickerItems.filter((_, i) => i !== idx));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteName.trim() || !siteLogoText.trim()) return;

    setIsSaving(true);
    setStatus('idle');
    try {
      await updateGeneralSettings({
        siteName,
        siteLogoText,
        siteSubtitle,
        tickerItems
      });
      setStatus('success');
    } catch (err) {
      console.error('Error saving settings: ', err);
      setStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl font-black text-gray-900 tracking-tight font-serif">General Newsroom Settings</h2>
          <p className="text-sm text-gray-500">Edit core site name, logos, subtitles and the global scrolling tickers in real-time.</p>
        </div>
      </div>

      {status === 'success' && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" /> Settings updated successfully. Changes are now live.
        </div>
      )}
      {status === 'error' && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2">
          <AlertCircle className="w-5 h-5" /> Failed to save settings. Please try again.
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-xl border border-gray-200 p-6 space-y-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100 pb-2 flex items-center gap-1">
              <Sliders className="w-4 h-4 text-red-600" /> Identity configuration
            </h3>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Global Site / App Title</label>
              <input 
                type="text" 
                value={siteName} 
                onChange={e => setSiteName(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none"
                placeholder="E.g. Morning Pulse"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Header Logo Badge Text</label>
              <input 
                type="text" 
                value={siteLogoText} 
                onChange={e => setSiteLogoText(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none"
                placeholder="E.g. PRO"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Site Headline Subtitle / Motto</label>
              <input 
                type="text" 
                value={siteSubtitle} 
                onChange={e => setSiteSubtitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none"
                placeholder="E.g. The News of Today, Analyzed for Tomorrow"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100 pb-2">
              Global Breaking Ticker Lines
            </h3>

            <div className="space-y-2">
              {tickerItems.length === 0 ? (
                <p className="text-xs text-gray-400 italic">No custom breaking lines active. Ticker will show defaults.</p>
              ) : (
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {tickerItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg text-xs">
                      <span className="font-mono text-gray-700 truncate font-semibold">◆ {item}</span>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveTickerLine(idx)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <input 
                type="text" 
                value={newTickerLine} 
                onChange={e => setNewTickerLine(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-xs"
                placeholder="E.g. TECH GIANT RELEASES RADICAL QUANTUM ACCELERATOR CHIP"
              />
              <button 
                type="button" 
                onClick={handleAddTickerLine}
                className="px-3 py-2 bg-gray-900 text-white hover:bg-black rounded-lg text-xs font-bold uppercase tracking-wider shrink-0"
              >
                Add Line
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end pt-3 border-t border-gray-100">
          <button 
            type="submit" 
            disabled={isSaving}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
          >
            {isSaving ? 'Updating...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
