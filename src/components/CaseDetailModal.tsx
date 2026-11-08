import React, { useState } from 'react';
import {
  X,
  Shield,
  AlertTriangle,
  User,
  Clock,
  Printer,
  Sparkles,
  Send,
  Trash2,
  Lock,
  CheckCircle2,
  FileText,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { STATUS_LABELS, CATEGORY_LABELS, URGENCY_LABELS, LOGO_PATH } from '../constants/theme';
import { CaseReport, CaseStatus, UserSession, TeamMember } from '../types';

interface CaseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseItem: CaseReport | null;
  currentUser: UserSession;
  teamList: TeamMember[];
  onUpdateStatus: (caseId: string, newStatus: CaseStatus, note: string, publicReply?: string) => Promise<void>;
  onAssignOfficer: (caseId: string, officerId: string, officerName: string, officerRank: string) => Promise<void>;
  onDeleteCase: (caseId: string) => Promise<void>;
}

export const CaseDetailModal: React.FC<CaseDetailModalProps> = ({
  isOpen,
  onClose,
  caseItem,
  currentUser,
  teamList,
  onUpdateStatus,
  onAssignOfficer,
  onDeleteCase,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<CaseStatus>('received');
  const [statusNote, setStatusNote] = useState('');
  const [publicReply, setPublicReply] = useState('');
  const [selectedOfficerId, setSelectedOfficerId] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // AI Forensic state
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Full-screen evidence viewer
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  if (!isOpen || !caseItem) return null;

  // Run Gemini AI Forensics
  const handleRunAiForensics = async () => {
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/ai/analyze-case', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: CATEGORY_LABELS[caseItem.category]?.label || caseItem.category,
          urgency: URGENCY_LABELS[caseItem.urgency]?.label || caseItem.urgency,
          suspectPlatform: caseItem.suspect.platform,
          suspectHandle: caseItem.suspect.handleOrNumber,
          incidentDetails: caseItem.incidentDetails,
          evidenceCount: caseItem.evidence.length,
        }),
      });

      const data = await res.json();
      if (data.success && data.analysis) {
        setAiAnalysis(data.analysis);
      }
    } catch (err) {
      console.error('Error running AI forensics:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await onUpdateStatus(caseItem.id, selectedStatus, statusNote, publicReply);
      setStatusNote('');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAssign = async (officerId: string) => {
    const officer = teamList.find((m) => m.id === officerId);
    if (!officer) return;
    setIsUpdating(true);
    try {
      await onAssignOfficer(caseItem.id, officer.id, officer.name, officer.rank);
    } finally {
      setIsUpdating(false);
    }
  };

  const isDirector = currentUser.role === 'director';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl my-6 bg-slate-900 border-2 border-amber-500/40 rounded-2xl shadow-2xl shadow-black text-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-amber-950/80 via-slate-900 to-slate-950 border-b border-amber-500/30">
          <div className="flex items-center gap-3">
            <img
              src={LOGO_PATH}
              alt="لۆگۆی فەرمی"
              className="w-10 h-10 object-contain rounded-full border border-amber-500/50"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono font-black text-amber-400">
                  {caseItem.trackingCode}
                </span>
                <span
                  className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold border ${
                    URGENCY_LABELS[caseItem.urgency]?.badge || 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {URGENCY_LABELS[caseItem.urgency]?.label || caseItem.urgency}
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-100">
                {CATEGORY_LABELS[caseItem.category]?.label || caseItem.category}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="چاپکردنی دۆسیە بە شێوازی فەرمی"
            >
              <Printer className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* 1. Complainant & Suspect Dossier Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Complainant card */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-slate-400 flex items-center justify-between">
                <span>زانیاری قوربانی / سکاڵاکار:</span>
                {caseItem.isAnonymous && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    نهێنی (بێ ناو)
                  </span>
                )}
              </div>
              <div className="text-sm font-bold text-slate-100">
                {caseItem.complainant.fullName}
              </div>
              {caseItem.complainant.phone && (
                <div className="text-xs text-slate-400">
                  ژمارەی مۆبایل: <span className="font-mono text-slate-300">{caseItem.complainant.phone}</span>
                </div>
              )}
              <div className="text-xs text-slate-400">
                شار / پارێزگا: <span className="text-slate-300">{caseItem.complainant.city}</span>
              </div>
            </div>

            {/* Suspect card */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-red-400 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>زانیاری کەسی تۆمەتبار / هەڕەشەکار:</span>
              </div>
              <div className="text-sm font-bold text-slate-100">
                {caseItem.suspect.handleOrNumber || 'نەزانراو'}
              </div>
              <div className="text-xs text-slate-400">
                سەکۆ: <span className="text-amber-300 font-semibold">{caseItem.suspect.platform}</span>
              </div>
              {caseItem.financialLoss && (
                <div className="text-xs text-red-400 font-medium">
                  داواکاری / زیانی دارایی: {caseItem.financialLoss}
                </div>
              )}
              {caseItem.suspect.profileUrl && (
                <a
                  href={caseItem.suspect.profileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-blue-400 hover:underline flex items-center gap-1"
                >
                  <span>کردنەوەی بەستەری هەژمار</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          {/* 2. Full Incident Details */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-amber-300">
              دەقی ڕوونکردنەوەی سکاڵاکە:
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
              {caseItem.incidentDetails}
            </p>
          </div>

          {/* 3. Evidence Gallery */}
          {caseItem.evidence && caseItem.evidence.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>پەڕگە و وێنەی بەڵگەکان ({caseItem.evidence.length} دانە):</span>
                <span className="text-[10px] text-slate-500">کلیک بکە بۆ گەورەکردن</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {caseItem.evidence.map((ev) => (
                  <div
                    key={ev.id}
                    onClick={() => setPreviewImage(ev.dataUrl)}
                    className="cursor-pointer group relative rounded-lg overflow-hidden border border-slate-700 bg-slate-900 aspect-video flex items-center justify-center hover:border-amber-400 transition-colors"
                  >
                    {ev.type.startsWith('image') ? (
                      <img
                        src={ev.dataUrl}
                        alt={ev.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <FileText className="w-8 h-8 text-amber-400" />
                    )}
                    <span className="absolute bottom-1 right-1 text-[9px] bg-slate-950/80 px-1.5 py-0.5 rounded text-slate-300 truncate max-w-[90%]">
                      {ev.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Gemini AI Cyber Forensics Assistant */}
          <div className="p-5 rounded-xl bg-gradient-to-r from-amber-950/40 via-slate-950 to-amber-950/40 border-2 border-amber-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                  <Sparkles className="w-5 h-5 animate-spin" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-amber-200">
                    شیکاری فۆڕێنسیکی ژیری دەستکرد (Gemini 3.8 Flash)
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    هەڵسەنگاندنی ئاستی مەترسی، پێشنیاری ڕێکاری یاسایی و شوێنپێهەڵگرتنی تۆمەتبار
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRunAiForensics}
                disabled={isAiLoading}
                className="px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isAiLoading ? 'شیکاری دەکات...' : 'ئەنجامدانی شیکاری فۆڕێنسیک'}</span>
              </button>
            </div>

            {aiAnalysis && (
              <div className="p-4 rounded-xl bg-slate-900/90 border border-amber-500/40 text-xs text-slate-200 leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
                {aiAnalysis}
              </div>
            )}
          </div>

          {/* 5. Assignment & Status Management */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Officer Assignment */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="text-xs font-bold text-slate-300">
                سپاردن بە ئەفسەری لێکۆڵینەوە:
              </div>
              <div className="text-xs text-slate-400">
                ئەفسەری ئێستا: <strong className="text-amber-400">{caseItem.assignedTo ? `${caseItem.assignedTo.rank} ${caseItem.assignedTo.name}` : 'دیاری نەکراوە'}</strong>
              </div>

              {/* Only Director or Admin can reassign */}
              <div className="flex gap-2">
                <select
                  value={selectedOfficerId || caseItem.assignedTo?.id || ''}
                  onChange={(e) => {
                    setSelectedOfficerId(e.target.value);
                    handleAssign(e.target.value);
                  }}
                  className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="">هەڵبژاردنی ئەفسەری تر...</option>
                  {teamList.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.rank} {m.name} ({m.department})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Status & Public Reply Update Form */}
            <form onSubmit={handleStatusSubmit} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="text-xs font-bold text-slate-300">
                نوێکردنەوەی دۆخی دۆسیەکە و وەڵامی فەرمی:
              </div>

              <div className="flex gap-2">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as CaseStatus)}
                  className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  {(Object.keys(STATUS_LABELS) as CaseStatus[]).map((st) => (
                    <option key={st} value={st}>
                      {STATUS_LABELS[st].label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <input
                  type="text"
                  value={publicReply}
                  onChange={(e) => setPublicReply(e.target.value)}
                  placeholder="وەڵامی فەرمی بۆ هاوڵاتی (لە پۆرتاڵ دەبینرێت)..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <input
                  type="text"
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="تێبینی ناوخۆیی لێکۆڵینەوە..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={isUpdating}
                className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors"
              >
                {isUpdating ? 'نوێ دەکرێتەوە...' : 'تۆمارکردنی گۆڕانکاری دۆسیە'}
              </button>
            </form>
          </div>

          {/* 6. Case Timeline Logs */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-slate-300">مێژووی کردارەکان لەسەر ئەم کەیسە:</div>
            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {caseItem.history.map((h) => (
                <div
                  key={h.id}
                  className="p-2 rounded bg-slate-900/70 border border-slate-800/80 flex items-center justify-between text-[11px]"
                >
                  <div>
                    <span className="font-semibold text-amber-300">{h.author}: </span>
                    <span className="text-slate-300">{h.note}</span>
                  </div>
                  <span className="font-mono text-slate-500 text-[10px]">
                    {new Date(h.timestamp).toLocaleTimeString('ar-IQ')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 7. Permanent Delete - Director Only */}
          {isDirector && (
            <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-red-400">دەسەڵاتی تایبەتی بەڕێوبەری گشتی</div>
                <div className="text-[11px] text-slate-400">سڕینەوەی یەکجارەکی دۆسیەکە لە داتابەیس</div>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('ئایا دڵنیایت لە سڕینەوەی ئەم دۆسیەیە لەلایەن بەڕێوبەری گشتی؟')) {
                    onDeleteCase(caseItem.id);
                  }
                }}
                className="px-3.5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>سڕینەوەی کەیس</span>
              </button>
            </div>
          )}
        </div>

        {/* Evidence Fullscreen Lightbox */}
        {previewImage && (
          <div
            className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
            onClick={() => setPreviewImage(null)}
          >
            <img
              src={previewImage}
              alt="بەڵگەی تەواو"
              className="max-w-[90vw] max-h-[90vh] object-contain rounded-xl border border-slate-700 shadow-2xl"
            />
          </div>
        )}
      </div>
    </div>
  );
};
