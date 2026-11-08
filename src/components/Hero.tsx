import React from 'react';
import {
  ShieldAlert,
  MessageSquare,
  Search,
  BookOpen,
  Lock,
  PhoneCall,
  CheckCircle2,
  Sparkles,
  Zap,
} from 'lucide-react';
import { LOGO_PATH, APP_NAME_KU, APP_MOTTO_KU, HOTLINE_NUMBER, EMERGENCY_PHONE } from '../constants/theme';

interface HeroProps {
  onOpenReport: () => void;
  onOpenTrack: () => void;
  onOpenChat: () => void;
  onOpenGuides: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenReport,
  onOpenTrack,
  onOpenChat,
  onOpenGuides,
}) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 px-4 sm:px-6 lg:px-8 cyber-grid">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Central Official Seal & Hero Title */}
        <div className="text-center flex flex-col items-center">
          {/* Official Seal with illuminated military ring */}
          <div className="relative mb-6">
            <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-amber-500/20 via-yellow-500/30 to-amber-600/20 blur-xl animate-pulse" />
            <div className="relative p-2 rounded-full bg-gradient-to-b from-amber-500/40 via-slate-900 to-amber-950 border-2 border-amber-500/50 shadow-2xl">
              <img
                src={LOGO_PATH}
                alt="تیمی نەهێشتنی تاوانی ئەلیکترۆنی"
                className="w-32 h-32 sm:w-44 sm:h-44 object-contain rounded-full shadow-2xl transform hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-0 right-2 sm:right-4 bg-emerald-500 text-slate-950 p-1.5 sm:p-2 rounded-full border-2 border-slate-950 shadow-lg" title="سیستەم ئۆنلاینە">
                <Zap className="w-4 h-4 fill-current animate-bounce" />
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-semibold mb-4">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>پۆرتاڵی فەرمی و دەسەڵاتداری نەهێشتنی تاوانە ئەلیکترۆنییەکان</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-100 tracking-tight leading-tight max-w-4xl">
            {APP_NAME_KU}
          </h1>

          <p className="mt-3 text-lg sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500">
            « {APP_MOTTO_KU} »
          </p>

          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            هێڵی گەرمی ٢٤ کاتژمێری بۆ بەهاناوەچوونی خێرای هاوڵاتییان. ڕووبەڕووی هەڕەشەی بڵاوکردنەوەی وێنە (ئیبتزاز)، هاککردنی پەیج و هەژمار، ساختەکاری دارایی یان گێچەڵ بوویتەتەوە؟ ئێمە بە تەواوی نهێنی و یاسایی پارێزگاریت لێدەکەین.
          </p>

          {/* Primary CTA Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4 w-full max-w-xl">
            <button
              onClick={onOpenReport}
              className="flex-1 min-w-[240px] flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl font-extrabold text-white text-base sm:text-lg bg-gradient-to-r from-red-600 via-amber-600 to-red-600 hover:from-red-500 hover:via-amber-500 hover:to-red-500 shadow-xl shadow-red-950/60 border border-amber-400/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <ShieldAlert className="w-6 h-6 animate-pulse" />
              <span>تۆمارکردنی سکاڵای کتوپڕ</span>
            </button>

            <button
              onClick={onOpenChat}
              className="flex-1 min-w-[200px] flex items-center justify-center gap-2 px-5 py-4 rounded-xl font-bold text-amber-200 text-base bg-slate-900/90 hover:bg-slate-800 border border-amber-500/40 hover:border-amber-400 shadow-lg transition-all"
            >
              <MessageSquare className="w-5 h-5 text-amber-400" />
              <span>چاتی ڕاستەوخۆ لەگەڵ ئەفسەر</span>
            </button>
          </div>
        </div>

        {/* 4 Feature Gateways */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Report */}
          <div
            onClick={onOpenReport}
            className="group cursor-pointer p-5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-red-500/30 hover:border-red-500 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-red-950/30 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-xl group-hover:bg-red-500/15 transition-all" />
            <div className="w-12 h-12 rounded-xl bg-red-500/15 border border-red-500/40 flex items-center justify-center text-red-400 mb-4 group-hover:scale-110 transition-transform">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-red-300 transition-colors">
              سکاڵای هەڕەشە و هاک
            </h3>
            <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
              دەستبەجێ زانیاری و بەڵگەکان بۆ سیستەمی لێکۆڵینەوە بنێرە بە بێ ناوهێنان یان بە ناوی فەرمی.
            </p>
          </div>

          {/* Card 2: Live Chat */}
          <div
            onClick={onOpenChat}
            className="group cursor-pointer p-5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-amber-500/30 hover:border-amber-400 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-950/30 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl group-hover:bg-amber-500/15 transition-all" />
            <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
              چاتی خێرای فریاگوزاری
            </h3>
            <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
              گفتوگۆی ڕاستەوخۆ لەگەڵ تیمی ئێشکگری تاوانە ئەلیکترۆنییەکان و ڕێنمایی هۆشمەندی ٢٤ کاتژمێری.
            </p>
          </div>

          {/* Card 3: Track */}
          <div
            onClick={onOpenTrack}
            className="group cursor-pointer p-5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-blue-500/30 hover:border-blue-400 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-950/30 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl group-hover:bg-blue-500/15 transition-all" />
            <div className="w-12 h-12 rounded-xl bg-blue-500/15 border border-blue-500/40 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
              بەدواداچوونی کەیس
            </h3>
            <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
              کۆدی کەیسەکەت لێبدە بۆ بینینی قۆناغەکانی لێکۆڵینەوە، بڕیاری یاسایی و وەڵامی ئەفسەری دۆسیەکەت.
            </p>
          </div>

          {/* Card 4: Safety Guides */}
          <div
            onClick={onOpenGuides}
            className="group cursor-pointer p-5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-emerald-500/30 hover:border-emerald-400 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-950/30 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/15 transition-all" />
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
              ڕێنمایی و بەرگری
            </h3>
            <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
              هەنگاوەکانی مامەڵەکردن لەگەڵ ئیبتزاز، هاککردنی پەیج، و پاراستنی بەڵگەی یاسایی لە تۆڕە کۆمەڵایەتییەکان.
            </p>
          </div>
        </div>

        {/* Live Security Statistics Ribbon */}
        <div className="mt-10 p-4 rounded-xl bg-slate-900/60 border border-amber-900/30 flex flex-wrap items-center justify-around gap-4 text-center">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <div className="text-right">
              <div className="text-sm font-bold text-slate-100">١٠٠٪ پارێزراو و نهێنی</div>
              <div className="text-[11px] text-slate-400">ناسنامەی قوربانی بە یاسا پارێزراوە</div>
            </div>
          </div>

          <div className="w-px h-8 bg-slate-800 hidden sm:block" />

          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-amber-400" />
            <div className="text-right">
              <div className="text-sm font-bold text-slate-100">ناردنی ڕاستەوخۆ بۆ ناوەندی پارێزراو</div>
              <div className="text-[11px] text-slate-400">هاوپێچکردنی سکرینشۆت و داتای دیجیتاڵی</div>
            </div>
          </div>

          <div className="w-px h-8 bg-slate-800 hidden sm:block" />

          <div className="flex items-center gap-2">
            <PhoneCall className="w-5 h-5 text-red-400" />
            <div className="text-right">
              <div className="text-sm font-bold text-slate-100">پەیوەندی کتوپڕ: {HOTLINE_NUMBER}</div>
              <div className="text-[11px] text-slate-400">یان پەیوەندی بە {EMERGENCY_PHONE}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
