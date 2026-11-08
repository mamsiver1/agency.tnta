import React, { useState } from 'react';
import {
  X,
  Search,
  CheckCircle2,
  Clock,
  ShieldCheck,
  FileText,
  AlertCircle,
  Printer,
  MessageSquare,
  ArrowRight,
  Lock,
} from 'lucide-react';
import { STATUS_LABELS, CATEGORY_LABELS, URGENCY_LABELS } from '../constants/theme';
import { CaseCategory, CaseStatus, CaseUrgency } from '../types';

interface CaseTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenChatForCase: (trackingCode: string) => void;
  initialCode?: string;
}

export const CaseTrackerModal: React.FC<CaseTrackerModalProps> = ({
  isOpen,
  onClose,
  onOpenChatForCase,
  initialCode = '',
}) => {
  const [code, setCode] = useState(initialCode);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [caseData, setCaseData] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setErrorMsg('تکایە کۆدی بەدواداچوونی کەیسەکەت بنووسە.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    setCaseData(null);

    try {
      const response = await fetch(`/api/cases/track/${encodeURIComponent(code.trim())}`);
      const data = await response.json();
      if (data.success) {
        setCaseData(data.case);
      } else {
        setErrorMsg(data.message || 'کەیسێک بەم کۆدە نەدۆزرایەوە.');
      }
    } catch (err) {
      setErrorMsg('هەڵە لە پەیوەندی لەگەڵ سێرڤەر. دووبارە هەوڵبدەرەوە.');
    } finally {
      setIsLoading(false);
    }
  };

  const stepsOrder: CaseStatus[] = ['received', 'investigating', 'legal_action', 'resolved'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-blue-500/40 rounded-2xl shadow-2xl shadow-black text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-950/60 via-slate-900 to-blue-950/60 border-b border-blue-500/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/40">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">
                بەدواداچوونی کەیس لە تیمی نەهێشتنی تاوانی ئەلیکترۆنی
              </h2>
              <p className="text-xs text-blue-300">
                بینینی دواین گۆڕانکاری و بڕیاری یاسایی لەسەر سکاڵاکەت
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Search Box */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="بۆ نموونە: TNTA-2026-8912"
              className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-sm font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 tracking-wider text-center"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-colors flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>{isLoading ? 'دەگەڕێت...' : 'پشکنین'}</span>
            </button>
          </form>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/50 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Result Card */}
          {caseData && (
            <div className="space-y-6 animate-fadeIn">
              {/* Header Info */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-[11px] text-slate-400">کۆدی بەدواداچوون:</div>
                  <div className="text-lg font-mono font-black text-amber-400 tracking-wider">
                    {caseData.trackingCode}
                  </div>
                </div>

                <div className="text-left">
                  <div className="text-[11px] text-slate-400">دۆخی ئێستای کەیس:</div>
                  <span
                    className={`inline-block mt-0.5 px-3 py-1 rounded-full text-xs font-bold border ${
                      STATUS_LABELS[caseData.status as CaseStatus]?.color ||
                      'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {STATUS_LABELS[caseData.status as CaseStatus]?.label || caseData.status}
                  </span>
                </div>
              </div>

              {/* Progress Stepper */}
              <div>
                <div className="text-xs font-bold text-slate-300 mb-3">
                  قۆناغەکانی لێکۆڵینەوە لە تیمی تاوانە ئەلیکترۆنییەکان:
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {stepsOrder.map((stepKey, idx) => {
                    const stepMeta = STATUS_LABELS[stepKey];
                    const currentIdx = stepsOrder.indexOf(caseData.status as CaseStatus);
                    const isCompleted = idx <= currentIdx;
                    const isCurrent = idx === currentIdx;

                    return (
                      <div
                        key={stepKey}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          isCurrent
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-lg shadow-amber-950/40'
                            : isCompleted
                            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400'
                            : 'bg-slate-950/50 border-slate-800/80 text-slate-600'
                        }`}
                      >
                        <div className="text-xs font-bold mb-1">قۆناغی {idx + 1}</div>
                        <div className="text-[11px] font-medium leading-tight">
                          {stepMeta.label}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Public Officer Reply / Verdict */}
              {caseData.publicReply && (
                <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40">
                  <div className="text-xs font-bold text-amber-300 mb-1 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>پەیامی فەرمی ئەفسەری لێکۆڵینەوە:</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                    {caseData.publicReply}
                  </p>
                </div>
              )}

              {/* Timeline Updates */}
              {caseData.history && caseData.history.length > 0 && (
                <div>
                  <div className="text-xs font-bold text-slate-300 mb-2">تۆماری کردارەکان:</div>
                  <div className="space-y-2">
                    {caseData.history.map((h: any, i: number) => (
                      <div
                        key={i}
                        className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 flex items-start justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="font-semibold text-slate-200">{h.note}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            لەلایەن: {h.author}
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono whitespace-nowrap">
                          {new Date(h.timestamp).toLocaleTimeString('ar-IQ', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions for Case */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    const c = caseData.trackingCode;
                    onClose();
                    onOpenChatForCase(c);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 text-slate-950 font-bold text-xs shadow-md"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>چاتی ڕاستەوخۆ بۆ ئەم کەیسە</span>
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>چاپکردنی دۆخی کەیس</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
