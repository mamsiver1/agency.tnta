import React from 'react';
import {
  ShieldAlert,
  PhoneCall,
  Search,
  FileText,
  Lock,
  LogOut,
  HelpCircle,
  ExternalLink,
  ChevronLeft,
} from 'lucide-react';
import { LOGO_PATH, APP_NAME_KU, APP_MOTTO_KU, HOTLINE_NUMBER } from '../constants/theme';
import { UserSession } from '../types';

interface NavbarProps {
  user: UserSession | null;
  onOpenReport: () => void;
  onOpenTrack: () => void;
  onOpenGuides: () => void;
  onOpenLogin: () => void;
  onOpenDashboard: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onOpenReport,
  onOpenTrack,
  onOpenGuides,
  onOpenLogin,
  onOpenDashboard,
  onLogout,
}) => {
  // Quick emergency exit for victim safety
  const handleQuickExit = () => {
    window.location.replace('https://www.google.com');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-amber-900/30 bg-slate-950/90 backdrop-blur-md">
      {/* Top security marquee & emergency hotlines banner */}
      <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/80 border-b border-amber-500/20 px-4 py-1.5 text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              سیستەمی هێڵی گەرم چالاکە ٢٤/٧
            </span>
            <span className="hidden sm:inline text-slate-400">|</span>
            <span className="hidden sm:inline text-amber-200/90 font-medium">
              پەیوەندی پارێزراو بە ستانداردی سەربازی ٢٥٦-بیت SSL
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold">
              <PhoneCall className="w-3.5 h-3.5 animate-bounce" />
              <span>ژمارەی فریاگوزاری: {HOTLINE_NUMBER}</span>
            </div>

            <button
              onClick={handleQuickExit}
              title="ئەگەر لە مەترسیدایت یان کەسێک چاودێریت دەکات، ئەم دوگمەیە دابگرە بۆ کردنەوەی گووگڵ بە خێرایی"
              className="text-xs bg-red-950/60 hover:bg-red-900 text-red-300 hover:text-white px-2.5 py-0.5 rounded border border-red-500/30 transition-colors flex items-center gap-1"
            >
              <span>دەرچوونی خێرا بۆ سەلامەتی</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Emblem Branding */}
          <div className="flex items-center gap-3 sm:gap-4 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-600 to-yellow-500 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-500" />
              <img
                src={LOGO_PATH}
                alt="تیمی نەهێشتنی تاوانی ئەلیکترۆنی"
                className="relative w-14 h-14 sm:w-16 sm:h-16 object-contain rounded-full border-2 border-amber-500/60 shadow-lg transform group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500">
                  {APP_NAME_KU}
                </h1>
                <span className="hidden md:inline-block px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded">
                  TNTA AGENCY
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">
                {APP_MOTTO_KU}
              </p>
            </div>
          </div>

          {/* Nav Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onOpenReport}
              className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-bold rounded-lg bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white shadow-md shadow-red-900/40 border border-amber-400/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>تۆمارکردنی سکاڵای کتوپڕ</span>
            </button>

            <button
              onClick={onOpenTrack}
              className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-slate-900/80 hover:bg-slate-800 text-amber-200 border border-amber-500/30 transition-colors"
            >
              <Search className="w-4 h-4 text-amber-400" />
              <span>بەدواداچوونی کەیس</span>
            </button>

            <button
              onClick={onOpenGuides}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-blue-400" />
              <span>ڕێنمایی سەلامەتی</span>
            </button>

            {/* Officer / Admin / Director Login or Dashboard button */}
            {user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenDashboard}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-bold rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-colors"
                >
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>
                    ژووری ئۆپەراسیۆن ({user.role === 'director' ? 'بەڕێوبەر' : 'ئەدمین'})
                  </span>
                </button>
                <button
                  onClick={onLogout}
                  title="دەرچوون لە هەژمار"
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-950/30 rounded-lg border border-slate-800 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>چوونەژوورەوەی ستاف</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
