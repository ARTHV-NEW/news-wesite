import React from 'react';
import { CheckCircle, AlertTriangle, ExternalLink, ShieldCheck, X, Sparkles } from 'lucide-react';
import { FactCheckReport } from '../../services/aiService';

interface FactCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: FactCheckReport | null;
}

export default function FactCheckModal({ isOpen, onClose, report }: FactCheckModalProps) {
  if (!isOpen || !report) return null;

  const scoreColor =
    report.factCheckScore >= 85
      ? 'text-emerald-600 bg-emerald-50 border-emerald-200'
      : report.factCheckScore >= 70
      ? 'text-amber-600 bg-amber-50 border-amber-200'
      : 'text-rose-600 bg-rose-50 border-rose-200';

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-gray-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-900 to-gray-800 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-600/20 text-red-400 rounded-xl border border-red-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight font-serif">AI Real-Time Fact Check Report</h3>
              <p className="text-xs text-gray-400">Verified against Google Search Grounding sources</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-800 text-gray-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Score & Status */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50">
            <div>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Verification Status</div>
              <div className="text-base font-black text-gray-900">{report.status || 'Verified'}</div>
            </div>
            <div className={`px-4 py-2.5 rounded-xl border flex items-center gap-3 ${scoreColor}`}>
              <div className="text-2xl font-black font-mono">{report.factCheckScore}%</div>
              <div className="text-xs font-bold uppercase tracking-wider leading-tight">
                Fact Check
                <br />
                Accuracy Score
              </div>
            </div>
          </div>

          {/* Summary */}
          {report.summary && (
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Editorial Summary</h4>
              <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                {report.summary}
              </p>
            </div>
          )}

          {/* Flagged Items / Issues */}
          {report.flaggedItems && report.flaggedItems.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> Flagged Claims ({report.flaggedItems.length})
              </h4>
              <div className="space-y-3">
                {report.flaggedItems.map((item, idx) => (
                  <div key={idx} className="p-4 bg-rose-50/60 border border-rose-200/80 rounded-xl space-y-2">
                    <div className="text-xs font-bold text-rose-900">Claim: "{item.claim}"</div>
                    <div className="text-xs text-rose-700"><strong>Issue:</strong> {item.issue}</div>
                    <div className="text-xs text-emerald-800 bg-emerald-50/80 p-2 rounded-lg border border-emerald-200/60">
                      <strong>Suggested Correction:</strong> {item.correction}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Verified Claims */}
          {report.verifiedClaims && report.verifiedClaims.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" /> Verified Claims ({report.verifiedClaims.length})
              </h4>
              <ul className="space-y-1.5">
                {report.verifiedClaims.map((claim, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-gray-700 bg-emerald-50/30 p-2.5 rounded-lg border border-emerald-100">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{claim}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Sources */}
          {report.sources && report.sources.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Web Grounding Sources</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {report.sources.map((src, idx) => (
                  <a
                    key={idx}
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 text-xs text-gray-800 flex items-center justify-between gap-2 transition-colors truncate"
                  >
                    <span className="truncate font-medium">{src.title || src.url}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-gray-800 transition-colors uppercase tracking-wider"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
}
