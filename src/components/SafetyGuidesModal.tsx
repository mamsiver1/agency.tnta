import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  AlertTriangle,
  Lock,
  Smartphone,
  EyeOff,
  FileCheck,
  PhoneCall,
  CheckCircle2,
} from 'lucide-react';
import { HOTLINE_NUMBER } from '../constants/theme';

interface SafetyGuidesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenReport: () => void;
}

export const SafetyGuidesModal: React.FC<SafetyGuidesModalProps> = ({
  isOpen,
  onClose,
  onOpenReport,
}) => {
  const [activeTab, setActiveTab] = useState<'blackmail' | 'hacking' | 'evidence' | 'financial'>(
    'blackmail'
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl my-6 bg-slate-900 border border-emerald-500/40 rounded-2xl shadow-2xl shadow-black text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-emerald-950/70 via-slate-900 to-slate-900 border-b border-emerald-500/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">
                ڕێنمایی کتوپڕی سەلامەتی و بەرگری دیجیتاڵی
              </h2>
              <p className="text-xs text-emerald-300">
                چۆن خۆت و خێزانەکەت لە هەڕەشە و تاوانە ئەلیکترۆنییەکان بپارێزیت
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

        {/* Tab Selector */}
        <div className="flex border-b border-slate-800 bg-slate-950 px-4 pt-2 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('blackmail')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'blackmail'
                ? 'border-red-500 text-red-400 bg-red-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>هەڕەشەی بڵاوکردنەوەی وێنە (ئیبتزاز)</span>
          </button>

          <button
            onClick={() => setActiveTab('hacking')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'hacking'
                ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>هاککردنی هەژمار و پەیج</span>
          </button>

          <button
            onClick={() => setActiveTab('evidence')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'evidence'
                ? 'border-blue-500 text-blue-400 bg-blue-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>پاراستنی دروستی بەڵگەی دادگا</span>
          </button>

          <button
            onClick={() => setActiveTab('financial')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'financial'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>فێڵی دارایی و وەبەرهێنانی وەهمی</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-200 leading-relaxed">
          {activeTab === 'blackmail' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/40 text-red-200 font-bold">
                ⚠️ گرنگترین یاسا: هەرگیز و بە هیچ جۆرێک یەک دیناریش بۆ کەسی هەڕەشەکار مەنێرە! ناردنی پارە نە تەنها کێشەکە چارەسەر ناکات، بەڵکو دەیسەلمێنێت کە دەتوانیت پارەی زیاتری بدەیتێ.
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <h4 className="font-bold text-amber-300 mb-1">١. ئارامبە و بە پەلە بڕیار مەدە</h4>
                  <p className="text-slate-400">
                    تۆمەتباران یاری بە دەروونی قوربانی دەکەن و دەیانەوێت بتترسێنن تا کۆنترۆڵت بکەن. ڕاستەوخۆ پەیوەندی بە ئێمەوە بکە، ئێمە سەدان کەیسی لەم جۆرەمان بە سەرکەوتوویی و بە نهێنی تەواو چارەسەر کردووە.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <h4 className="font-bold text-amber-300 mb-1">٢. سڕینەوەی چات قەدەغەیە</h4>
                  <p className="text-slate-400">
                    هەرگیز چاتەکان مەسڕەوە. دەستبەجێ سکرینشۆت لە تەواوی نامەکان، هەڕەشەکان، بەستەری پڕۆفایلی کەسەکە و ژمارەکەی بگرە پێش ئەوەی سڕینەوە لەلای هەردوولا ئەنجام بدات.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <h4 className="font-bold text-amber-300 mb-1">٣. هەژمارەکانت دابخە و ناچالاکیان بکە (Deactivate)</h4>
                  <p className="text-slate-400">
                    بۆ کەمکردنەوەی فشار و کات گرتن لە بەرژەوەندی خۆت، هەژمارەکەت بە شێوازی کاتی Deactivate بکە تا تیمی لێکۆڵینەوە بەدواداچوونی تەکنیکی دەکات.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'hacking' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/40 text-amber-200">
                ڕێکارەکانی گەڕاندنەوە و بەرگری لە هاککردنی پەیج و هەژمارەکانی ئینستاگرام، سناپچات و فەیسبووک:
              </div>

              <div className="space-y-2">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="font-bold text-emerald-400">١. ڕاستکردنەوەی دوو قۆناغی (2FA):</span>
                  <p className="text-slate-400 mt-1">
                    بە خێرایی کارای بکە بە بەکارهێنانی ئەپی Google Authenticator نەک کورتەنامەی SMS.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="font-bold text-emerald-400">٢. پشکنینی ئامێرە چالاکەکان (Logged in Devices):</span>
                  <p className="text-slate-400 mt-1">
                    بچۆ بەشی Settings &gt; Security &gt; Where You're Logged In و لە هەموو ئامێرە نەناسراوەکان دەربچۆ (Log Out All).
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="font-bold text-emerald-400">٣. لینکی فیشینگ مەکرەوە:</span>
                  <p className="text-slate-400 mt-1">
                    کۆمپانیاکانی Meta و Snapchat هەرگیز لە دایرێکت داوای کۆد یان پاسۆرد ناکەن بە ناوی هۆشداری بلۆکبوون.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'evidence' && (
            <div className="space-y-4">
              <p className="text-slate-300">
                بۆ ئەوەی بەڵگەکەت لە دادگای کەتن و تاوان بە فەرمی قبوڵ بکرێت:
              </p>
              <ul className="space-y-2 text-slate-400">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>سکرینشۆتی تەواوی شاشەکە بگرە کە کات و پاتری و ڕۆژ دیاربێت.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>بەستەری ڕاستەقینەی پڕۆفایل کۆپی بکە (URL)، چونکە ناوی نمایشی دەگۆڕدرێت بەڵام ID سڕینەوەی ئاسان نییە.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>تۆماری دەنگی ئەگەر هەڕەشەی دەنگی کراوە وەک دەنگ هاوپێچ بکە.</span>
                </li>
              </ul>
            </div>
          )}

          {activeTab === 'financial' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <h4 className="font-bold text-amber-300 mb-1">فێڵەکانی FastPay، FIB، و کریپتۆ:</h4>
                <p className="text-slate-400">
                  هەر پەیج یان کەسێک بەڵێنی دووقاتکردنی پارە یان داشکاندنی نائاسایی دایە پێش گەیشتنی کاڵاکە، فێڵ و ساختەکارییە. لە کاتی خستنەخوارەوەی پارە لە کارتی بانکیت، دەستبەجێ پەیوەندی بە بانکی خۆت بکە بۆ سڕکردنی کارتەکە و ڕاپۆرتی لێرە بنێرە.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <PhoneCall className="w-4 h-4 text-amber-400" />
            <span>هێڵی کتوپڕ: {HOTLINE_NUMBER}</span>
          </div>

          <button
            onClick={() => {
              onClose();
              onOpenReport();
            }}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs shadow-md"
          >
            تۆمارکردنی سکاڵای فەرمی
          </button>
        </div>
      </div>
    </div>
  );
};
