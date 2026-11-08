import React, { useState } from 'react';
import {
  X,
  ShieldAlert,
  Upload,
  Lock,
  UserCheck,
  UserX,
  CheckCircle2,
  Copy,
  Printer,
  MessageSquare,
  FileText,
  AlertTriangle,
  Image as ImageIcon,
  Trash2,
} from 'lucide-react';
import { CATEGORY_LABELS, URGENCY_LABELS, LOGO_PATH } from '../constants/theme';
import { CaseCategory, CaseUrgency, CaseEvidence } from '../types';

interface SubmitReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessOpenChat: (trackingCode: string) => void;
}

export const SubmitReportModal: React.FC<SubmitReportModalProps> = ({
  isOpen,
  onClose,
  onSuccessOpenChat,
}) => {
  const [category, setCategory] = useState<CaseCategory>('blackmail');
  const [urgency, setUrgency] = useState<CaseUrgency>('critical');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [complainantName, setComplainantName] = useState('');
  const [complainantPhone, setComplainantPhone] = useState('');
  const [complainantCity, setComplainantCity] = useState('سلێمانی');

  const [suspectPlatform, setSuspectPlatform] = useState('ئینستاگرام / Instagram');
  const [suspectHandle, setSuspectHandle] = useState('');
  const [suspectUrl, setSuspectUrl] = useState('');
  const [suspectNotes, setSuspectNotes] = useState('');

  const [incidentDetails, setIncidentDetails] = useState('');
  const [financialLoss, setFinancialLoss] = useState('');
  const [evidenceList, setEvidenceList] = useState<CaseEvidence[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  // Handle file uploads (converts to base64 for reliable transmission & display)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.size > 10 * 1024 * 1024) {
        setErrorMsg('قەبارەی پەڕگە لە ١٠ مێگابایت زیاتر نابێت.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setEvidenceList((prev) => [
          ...prev,
          {
            id: 'ev-' + Date.now() + '-' + Math.random(),
            name: file.name,
            type: file.type,
            dataUrl: reader.result as string,
            size: file.size,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeEvidence = (id: string) => {
    setEvidenceList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!incidentDetails.trim()) {
      setErrorMsg('تکایە بە کورتی ڕوونکردنەوە لەسەر کێشەکە و هەڕەشەکە بنووسە.');
      return;
    }

    if (!isAnonymous && !complainantName.trim()) {
      setErrorMsg('تکایە ناوی خۆت بنووسە یان بژاردەی (بە شێوازی نەناسراو / بێ ناو) چالاک بکە.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          urgency,
          isAnonymous,
          complainantName: isAnonymous ? 'هاوڵاتی (شاردراوە)' : complainantName,
          complainantPhone,
          complainantCity,
          suspectPlatform,
          suspectHandle,
          suspectUrl,
          suspectNotes,
          incidentDetails,
          financialLoss,
          evidence: evidenceList,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSubmittedCode(data.trackingCode);
      } else {
        setErrorMsg(data.message || 'هەڵەیەک ڕوویدا لە کاتی ناردن.');
      }
    } catch (err) {
      setErrorMsg('هێڵی پەیوەندی بەردەست نییە. تکایە دووبارە هەوڵبدەرەوە.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyCode = () => {
    if (submittedCode) {
      navigator.clipboard.writeText(submittedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const resetForm = () => {
    setSubmittedCode(null);
    setIncidentDetails('');
    setSuspectHandle('');
    setSuspectNotes('');
    setFinancialLoss('');
    setEvidenceList([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl my-8 bg-slate-900 border border-amber-500/40 rounded-2xl shadow-2xl shadow-black text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/80 border-b border-amber-500/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/20 text-red-400 border border-red-500/40">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">
                تۆمارکردنی سکاڵای فەرمی لە هێڵی گەرم
              </h2>
              <p className="text-xs text-amber-300 font-medium">
                تیمی نەهێشتنی تاوانی ئەلیکترۆنی • دڵنیایی پاراستنی ١٠٠٪ نهێنی
              </p>
            </div>
          </div>
          <button
            onClick={resetForm}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {submittedCode ? (
            /* Successful Submission View */
            <div className="text-center py-6 space-y-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-950/50">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-emerald-400">
                  سکاڵاکەت بە سەرکەوتوویی تۆمارکرا
                </h3>
                <p className="mt-2 text-sm text-slate-300 max-w-md mx-auto">
                  زانیارییەکانت دەستبەجێ بە شێوازێکی پارێزراو گەیشتە بەردەستی ئەفسەرانی تیمی نەهێشتنی تاوانی ئەلیکترۆنی.
                </p>
              </div>

              {/* Official Tracking Code Box */}
              <div className="p-6 rounded-xl bg-slate-950 border-2 border-dashed border-amber-500/50 max-w-md mx-auto relative group">
                <span className="text-xs uppercase tracking-wider font-bold text-amber-400">
                  کۆدی بەدواداچوونی فەرمی (Tracking Code)
                </span>
                <div className="mt-2 text-3xl font-mono font-black text-white tracking-widest selection:bg-amber-500">
                  {submittedCode}
                </div>
                <p className="mt-2 text-xs text-slate-400">
                  تکایە ئەم کۆدە لە شوێنێکی پارێزراو بنووسە بۆ بەدواداچوونی کەیسەکەت لە پۆرتاڵەکەدا.
                </p>

                <div className="mt-4 flex items-center justify-center gap-2">
                  <button
                    onClick={copyCode}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copied ? 'کۆپیکرا!' : 'کۆپیکردنی کۆد'}</span>
                  </button>

                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>چاپکردنی پسوولە</span>
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-amber-950/30 border border-amber-500/30 max-w-md mx-auto text-xs text-amber-200/90 text-right space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-amber-300">
                  <Lock className="w-4 h-4" />
                  <span>ڕێنمایی بەپەلە لە کاتی چاوەڕوانیدا:</span>
                </div>
                <p>• بە هیچ شێوەیەک پارە بۆ هەڕەشەکار مەنێرە و پێوەندی مەبەستە.</p>
                <p>• سکرینشۆتەکانی چات مەسڕەوە؛ بەڵگەی سەرەکی دادگاییە.</p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                <button
                  onClick={() => {
                    const code = submittedCode;
                    resetForm();
                    onSuccessOpenChat(code);
                  }}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-950/40 transition-transform active:scale-95"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>چاتی ڕاستەوخۆ دەستپێبکە بۆ ئەم کەیسە</span>
                </button>

                <button
                  onClick={resetForm}
                  className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition-colors"
                >
                  داخستن
                </button>
              </div>
            </div>
          ) : (
            /* Form Input View */
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMsg && (
                <div className="p-3.5 rounded-lg bg-red-950/50 border border-red-500/50 text-red-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* 1. Category Selection */}
              <div>
                <label className="block text-xs font-bold text-amber-300 mb-2">
                  ١. جۆری تاوانە ئەلیکترۆنییەکە دیاریبکە:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(Object.keys(CATEGORY_LABELS) as CaseCategory[]).map((catKey) => {
                    const isSelected = category === catKey;
                    return (
                      <button
                        type="button"
                        key={catKey}
                        onClick={() => setCategory(catKey)}
                        className={`text-right p-3 rounded-xl border text-xs transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-amber-500/15 border-amber-500 text-amber-200 shadow-md shadow-amber-950/30'
                            : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="font-bold text-sm">{CATEGORY_LABELS[catKey].label}</div>
                        <div className="mt-1 text-[11px] text-slate-400 line-clamp-1">
                          {CATEGORY_LABELS[catKey].desc}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Urgency Selection */}
              <div>
                <label className="block text-xs font-bold text-amber-300 mb-2">
                  ٢. ئاستی کتوپڕی و مەترسی کەیسەکە:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['critical', 'urgent', 'normal'] as CaseUrgency[]).map((urgKey) => {
                    const isSelected = urgency === urgKey;
                    const uMeta = URGENCY_LABELS[urgKey];
                    return (
                      <button
                        type="button"
                        key={urgKey}
                        onClick={() => setUrgency(urgKey)}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                          isSelected
                            ? uMeta.color + ' shadow-md'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {uMeta.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Anonymous Mode Toggle */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isAnonymous ? (
                      <UserX className="w-5 h-5 text-amber-400" />
                    ) : (
                      <UserCheck className="w-5 h-5 text-emerald-400" />
                    )}
                    <div>
                      <div className="text-xs font-bold text-slate-200">
                        {isAnonymous ? 'سکاڵای نهێنی (بە بێ ناوهێنان)' : 'سکاڵا بە زانیاری کەسیی'}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        دەتوانیت بە تەواوی بێ ناو بمێنیتەوە ئەگەر ترست هەیە
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsAnonymous(!isAnonymous)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      isAnonymous
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {isAnonymous ? 'چالاککراوە: بێ ناو' : 'گۆڕین بۆ نەناسراو'}
                  </button>
                </div>

                {!isAnonymous && (
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">ناوی تەواوت:</label>
                      <input
                        type="text"
                        value={complainantName}
                        onChange={(e) => setComplainantName(e.target.value)}
                        placeholder="ناو و نازناو"
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">
                        ژمارەی مۆبایل (ئارەزوومەندانە):
                      </label>
                      <input
                        type="text"
                        value={complainantPhone}
                        onChange={(e) => setComplainantPhone(e.target.value)}
                        placeholder="0750 xxx xxxx"
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">شار / پارێزگا:</label>
                      <select
                        value={complainantCity}
                        onChange={(e) => setComplainantCity(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                      >
                        <option value="هەولێر">هەولێر</option>
                        <option value="سلێمانی">سلێمانی</option>
                        <option value="دهۆک">دهۆک</option>
                        <option value="هەڵەبجە">هەڵەبجە</option>
                        <option value="کەرکووک">کەرکووک</option>
                        <option value="گەرمیان">گەرمیان</option>
                        <option value="زاخۆ">زاخۆ</option>
                        <option value="ڕاپەڕین">ڕاپەڕین</option>
                        <option value="دەرەوەی هەرێم">دەرەوەی هەرێم</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* 4. Suspect Information */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-amber-300">
                  ٣. زانیاری لەسەر کەسی تۆمەتبار یان هەڕەشەکار:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      سەکۆ / پلاتفۆرمی هەڕەشەکە:
                    </label>
                    <select
                      value={suspectPlatform}
                      onChange={(e) => setSuspectPlatform(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="ئینستاگرام / Instagram">ئینستاگرام / Instagram</option>
                      <option value="واتسئاپ / WhatsApp">واتسئاپ / WhatsApp</option>
                      <option value="تیکتۆک / TikTok">تیکتۆک / TikTok</option>
                      <option value="تێلیگرام / Telegram">تێلیگرام / Telegram</option>
                      <option value="فەیسبووک / Facebook">فەیسبووک / Facebook</option>
                      <option value="سناپچات / Snapchat">سناپچات / Snapchat</option>
                      <option value="پەیوەندی مۆبایل یان SMS">پەیوەندی مۆبایل یان SMS</option>
                      <option value="ماڵپەڕ یان بەستەری ساختە">ماڵپەڕ یان بەستەری ساختە</option>
                      <option value="تر">تر</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      یوزەرنەیم یان ژمارەی تۆمەتبار:
                    </label>
                    <input
                      type="text"
                      value={suspectHandle}
                      onChange={(e) => setSuspectHandle(e.target.value)}
                      placeholder="@username یان ژمارەی مۆبایل"
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      بەستەر / لینکی پڕۆفایلی تۆمەتبار (ئەگەر هەتە):
                    </label>
                    <input
                      type="text"
                      value={suspectUrl}
                      onChange={(e) => setSuspectUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      داواکاری دارایی یان زیانی پارە (ئەگەر هەبێت):
                    </label>
                    <input
                      type="text"
                      value={financialLoss}
                      onChange={(e) => setFinancialLoss(e.target.value)}
                      placeholder="بۆ نموونە: داوای $1,000 دەکات یان 500 هەزار دینارم لێ ڕۆشت"
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* 5. Incident Details */}
              <div>
                <label className="block text-xs font-bold text-amber-300 mb-1">
                  ٤. وردەکاری ڕووداوەکە و چۆنیەتی هەڕەشەکە روونبکەرەوە: *
                </label>
                <textarea
                  rows={4}
                  value={incidentDetails}
                  onChange={(e) => setIncidentDetails(e.target.value)}
                  placeholder="بە تەواوی بنووسە چی ڕوویداوە، چۆن پەیوەندی پێوە کردوویت، چی ووتووە و چی داواکردووە..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500 resize-none leading-relaxed"
                />
              </div>

              {/* 6. Evidence Upload */}
              <div>
                <label className="block text-xs font-bold text-amber-300 mb-1">
                  ٥. هاوپێچکردنی وێنە و بەڵگەکان (سکرینشۆتی چات، تۆماری دەنگی، بەستەر):
                </label>
                <div className="border-2 border-dashed border-slate-800 hover:border-amber-500/50 rounded-xl p-4 text-center bg-slate-950/50 transition-colors">
                  <input
                    type="file"
                    id="evidence-upload"
                    multiple
                    accept="image/*,.pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="evidence-upload"
                    className="cursor-pointer flex flex-col items-center justify-center gap-1.5"
                  >
                    <Upload className="w-6 h-6 text-amber-400" />
                    <span className="text-xs font-bold text-slate-200">
                      کلیک لێرە بکە بۆ هەڵبژاردنی سکرینشۆت و وێنەی بەڵگەکان
                    </span>
                    <span className="text-[10px] text-slate-500">
                      فۆرماتەکانی JPG, PNG, WEBP, PDF (تا ١٠ مێگابایت)
                    </span>
                  </label>
                </div>

                {evidenceList.length > 0 && (
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {evidenceList.map((item) => (
                      <div
                        key={item.id}
                        className="relative p-2 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-2 group"
                      >
                        {item.type.startsWith('image') ? (
                          <img
                            src={item.dataUrl}
                            alt="بەڵگە"
                            className="w-8 h-8 rounded object-cover"
                          />
                        ) : (
                          <FileText className="w-8 h-8 text-amber-400 shrink-0" />
                        )}
                        <span className="text-[10px] text-slate-300 truncate">{item.name}</span>
                        <button
                          type="button"
                          onClick={() => removeEvidence(item.id)}
                          className="absolute -top-1 -right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-1 text-[11px] text-emerald-400">
                  <Lock className="w-3.5 h-3.5" />
                  <span>داتاکەت ڕاستەوخۆ دەگاتە سێرڤەری پارێزراوی هێڵی گەرم</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                  >
                    پەشیمانبوونەوە
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 shadow-md shadow-red-950/40 disabled:opacity-50 transition-all"
                  >
                    {isSubmitting ? (
                      <span>دەگوازرێتەوە بۆ ناوەندی لێکۆڵینەوە...</span>
                    ) : (
                      <>
                        <ShieldAlert className="w-4 h-4" />
                        <span>ناردنی فەرمی سکاڵاکە</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
