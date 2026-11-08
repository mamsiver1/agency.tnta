/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ShieldAlert,
  Search,
  MessageSquare,
  BookOpen,
  PhoneCall,
  Lock,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Eye,
  Building,
  Scale,
  Users,
  ChevronLeft,
  ExternalLink,
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SubmitReportModal } from './components/SubmitReportModal';
import { CaseTrackerModal } from './components/CaseTrackerModal';
import { SafetyGuidesModal } from './components/SafetyGuidesModal';
import { LoginModal } from './components/LoginModal';
import { LiveChatWidget } from './components/LiveChatWidget';
import { Dashboard } from './components/Dashboard';
import { LOGO_PATH, APP_NAME_KU, APP_MOTTO_KU, HOTLINE_NUMBER, EMERGENCY_PHONE, CATEGORY_LABELS } from './constants/theme';
import { UserSession } from './types';

export default function App() {
  // Session State
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [viewMode, setViewMode] = useState<'portal' | 'dashboard'>('portal');

  // Modals
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isTrackOpen, setIsTrackOpen] = useState(false);
  const [isGuidesOpen, setIsGuidesOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLiveChatOpen, setIsLiveChatOpen] = useState(false);

  const [linkedTrackingCode, setLinkedTrackingCode] = useState<string | undefined>(undefined);

  // When a report is successfully submitted, open live chat directly for that case
  const handleOpenChatForCase = (code: string) => {
    setLinkedTrackingCode(code);
    setIsLiveChatOpen(true);
  };

  const handleLoginSuccess = (user: UserSession) => {
    setCurrentUser(user);
    setViewMode('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setViewMode('portal');
  };

  // If viewing dashboard
  if (viewMode === 'dashboard' && currentUser) {
    return (
      <Dashboard
        user={currentUser}
        onLogout={handleLogout}
        onBackToPortal={() => setViewMode('portal')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Navbar */}
      <Navbar
        user={currentUser}
        onOpenReport={() => setIsReportOpen(true)}
        onOpenTrack={() => setIsTrackOpen(true)}
        onOpenGuides={() => setIsGuidesOpen(true)}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenDashboard={() => setViewMode('dashboard')}
        onLogout={handleLogout}
      />

      {/* Hero Section */}
      <Hero
        onOpenReport={() => setIsReportOpen(true)}
        onOpenTrack={() => setIsTrackOpen(true)}
        onOpenChat={() => setIsLiveChatOpen(true)}
        onOpenGuides={() => setIsGuidesOpen(true)}
      />

      {/* Cybercrime Categories Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold mb-3">
            <span>پسپۆڕییەکانی تیمی لێکۆڵینەوە</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-100">
            ئەو تاوانە ئەلیکترۆنییانەی ڕاستەوخۆ بەهاناوەچوونی بۆ دەکەین
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            تیمە پسپۆڕەکانمان بە کەرەستەی سەردەمییانەی شوێنپێهەڵگرتنی دیجیتاڵی ئامادەن بۆ پاراستنی ماف و ئاسایشی ئەلیکترۆنی هاوڵاتییان.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 1. Blackmail */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/20 hover:border-amber-500/50 transition-all hover:-translate-y-1 group">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-2">
              هەڕەشەی بڵاوکردنەوەی وێنە (ئیبتزاز)
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              هەڕەشەی بڵاوکردنەوەی وێنە و ڤیدیۆی کەسی، نامە تایبەتەکان، یان زانیاری نهێنی بەرامبەر پارە یان کاری ناڕەوا. بە دڵنیاییەوە ناسنامەی تۆ بە نهێنی دەمێنێتەوە.
            </p>
            <button
              onClick={() => setIsReportOpen(true)}
              className="mt-4 text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              <span>ڕاپۆرتی ئەم تاوانە بنێرە</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {/* 2. Hacking */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/20 hover:border-amber-500/50 transition-all hover:-translate-y-1 group">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-2">
              هاککردنی هەژمار و پەیجی فەرمی
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              دەستبەسەرداگرتنی هەژمارەکانی ئینستاگرام، فەیسبووک، سناپچات، تیکتۆک یان واتسئاپ بە ڕێگەی لینکی ساختە و فیشینگ. هەوڵی گەڕاندنەوە لەگەڵ کۆمپانیاکانی مێتا.
            </p>
            <button
              onClick={() => setIsReportOpen(true)}
              className="mt-4 text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <span>داواکاری گەڕاندنەوەی هەژمار</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {/* 3. Financial Fraud */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/20 hover:border-amber-500/50 transition-all hover:-translate-y-1 group">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Scale className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-2">
              ساختەکاری دارایی و کڕینی وەهمی
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              فێڵی بازرگانی دراوە دیجیتاڵییەکان، بەڵێنی دووقاتکردنی پارە، دزینی کارتی بانکی و فاستپەی لە ڕێگەی لاپەڕە و کاناڵی ساختە.
            </p>
            <button
              onClick={() => setIsReportOpen(true)}
              className="mt-4 text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <span>ڕاپۆرتکردنی ساختەکاری دارایی</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {/* 4. Deepfake */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/20 hover:border-amber-500/50 transition-all hover:-translate-y-1 group">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-2">
              ساختەکاری دەنگ و ڕەنگ (Deepfake AI)
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              دروستکردنی وێنە و ڤیدیۆی دەستکاریکراو یان تەقلیدکردنی دەنگ بە ژیری دەستکرد بە مەبەستی شکاندنی کەرامەت یان فێڵی خێزانی.
            </p>
            <button
              onClick={() => setIsReportOpen(true)}
              className="mt-4 text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1"
            >
              <span>شیکاری فۆڕێنسیکی وێنەی دەستکاریکراو</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {/* 5. Impersonation */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/20 hover:border-amber-500/50 transition-all hover:-translate-y-1 group">
            <div className="w-12 h-12 rounded-xl bg-yellow-500/20 text-yellow-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-2">
              دزینی وێنە و هەژماری ساختە
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              دروستکردنی هەژمار بە وێنە و ناوی تۆ بە مەبەستی خراپ بەکارهێنان لەگەڵ هاوڕێ و خزمەکانت لە سناپچات، تیکتۆک یان ئینستاگرام.
            </p>
            <button
              onClick={() => setIsReportOpen(true)}
              className="mt-4 text-xs font-bold text-yellow-400 hover:text-yellow-300 flex items-center gap-1"
            >
              <span>داواکاری سڕینەوەی هەژماری ساختە</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {/* 6. Phishing */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/20 hover:border-amber-500/50 transition-all hover:-translate-y-1 group">
            <div className="w-12 h-12 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FileCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-2">
              فیشینگ و ڤایرۆسی سیخوڕی
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              ناردنی بەستەری گوماناوی و ئەپڵیکەیشنی زیانبەخش بە مەبەستی دزینی زانیاری ناو مۆبایل، کۆنتڕۆڵکردنی کامێرا و پەیامەکان.
            </p>
            <button
              onClick={() => setIsReportOpen(true)}
              className="mt-4 text-xs font-bold text-pink-400 hover:text-pink-300 flex items-center gap-1"
            >
              <span>پشکنینی بەستەر یان ئەپی گوماناوی</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* How it works: 3 Steps */}
      <section className="py-16 bg-slate-900/60 border-y border-amber-900/20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-100">
              چۆن سکاڵاکەت لە هێڵی گەرم بەڕێوەدەچێت؟
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-400">
              پرۆسەیەکی خێرا، بە تەواوی نهێنی و یاسایی بۆ پاراستنی هاوڵاتی
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center relative">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center mx-auto text-lg font-black mb-4">
                ١
              </div>
              <h3 className="text-base font-bold text-slate-100 mb-2">
                ناردنی سکاڵا یان چاتی ڕاستەوخۆ
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                زانیارییەکان لە ڕێگەی فۆڕم بە بێ ناوهێنان یان لە ڕێگەی چاتی ڕاستەوخۆ دەگاتە سێرڤەری پارێزراوی هێڵی گەرم و ئیمەیڵی فەرمی ناوەند.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center relative">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/40 flex items-center justify-center mx-auto text-lg font-black mb-4">
                ٢
              </div>
              <h3 className="text-base font-bold text-slate-100 mb-2">
                وەرگرتنی کۆدی بەدواداچوون
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                کۆدێکی تایبەت وەک (TNTA-2026-XXXX) وەردەگریت بۆ ئەوەی لە هەر کاتێکدا بتوانیت قۆناغەکانی لێکۆڵینەوە و پەیامی ئەفسەری دۆسیەکەت ببینی.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center relative">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto text-lg font-black mb-4">
                ٣
              </div>
              <h3 className="text-base font-bold text-slate-100 mb-2">
                بەهاناوەچوون و ڕێکاری یاسایی
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                تیمی تەکنیکی دەستبەجێ بەستەر و هەژمارە زیانبەخشەکان بلۆک دەکات و بە هەماهەنگی لەگەڵ دادوەری لێکۆڵینەوە تۆمەتبار دەستنیشان دەکرێت.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Confidentiality Pledge Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <div className="p-8 rounded-3xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-amber-950/60 border-2 border-amber-500/40 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <img
              src={LOGO_PATH}
              alt="لۆگۆی فەرمی تیمی نەهێشتنی تاوانی ئەلیکترۆنی"
              className="w-28 h-28 object-contain rounded-full border-2 border-amber-500/50 shadow-xl shrink-0"
            />
            <div className="space-y-3 text-right">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40">
                <CheckCircle2 className="w-4 h-4" />
                <span>پەیمانی نهێنی بوون و پاراستنی هاوڵاتی</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-100">
                « پاراستنی کەرامەت و ئاسایشی هاوڵاتی ئەرکی سەرشانمانە »
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                تیمی نەهێشتنی تاوانی ئەلیکترۆنی دڵنیایی دەدات بە هەموو قوربانییەکی هەڕەشە و هاککردن کە زانیارییەکانتان بە ١٠٠٪ بە نهێنی دەمێنێتەوە لای ئەفسەرانی باڵا. هیچ ترسێکت نەبێت لە بەشداریکردنی کێشەکەت، ئێمە لەگەڵتین بۆ گێڕانەوەی ئارامیت.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800 bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img
              src={LOGO_PATH}
              alt="لۆگۆی فەرمی"
              className="w-12 h-12 object-contain rounded-full border border-amber-500/40"
            />
            <div>
              <div className="font-bold text-slate-200 text-sm">{APP_NAME_KU}</div>
              <div className="text-[11px] text-amber-400">{APP_MOTTO_KU}</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            <button onClick={() => setIsReportOpen(true)} className="hover:text-amber-400 transition-colors">
              تۆمارکردنی سکاڵا
            </button>
            <span>•</span>
            <button onClick={() => setIsTrackOpen(true)} className="hover:text-amber-400 transition-colors">
              بەدواداچوونی کەیس
            </button>
            <span>•</span>
            <button onClick={() => setIsGuidesOpen(true)} className="hover:text-amber-400 transition-colors">
              ڕێنمایی سەلامەتی
            </button>
            <span>•</span>
            <button onClick={() => setIsLiveChatOpen(true)} className="hover:text-amber-400 transition-colors">
              چاتی ڕاستەوخۆ
            </button>
            <span>•</span>
            <button onClick={() => setIsLoginOpen(true)} className="text-amber-400 hover:underline">
              دەروازەی ستاف و ئەدمین
            </button>
          </div>

          <div className="text-center sm:text-left text-[11px] text-slate-500">
            <div>پۆرتاڵی فەرمی هێڵی گەرمی تاوانە ئەلیکترۆنییەکان</div>
            <div>فریاگوزاری: {HOTLINE_NUMBER} • مۆبایل: {EMERGENCY_PHONE}</div>
          </div>
        </div>
      </footer>

      {/* Interactive Modals */}
      <SubmitReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        onSuccessOpenChat={handleOpenChatForCase}
      />

      <CaseTrackerModal
        isOpen={isTrackOpen}
        onClose={() => setIsTrackOpen(false)}
        onOpenChatForCase={handleOpenChatForCase}
      />

      <SafetyGuidesModal
        isOpen={isGuidesOpen}
        onClose={() => setIsGuidesOpen(false)}
        onOpenReport={() => {
          setIsGuidesOpen(false);
          setIsReportOpen(true);
        }}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Floating 24/7 Live Chat Widget */}
      <LiveChatWidget
        isOpen={isLiveChatOpen}
        onToggle={() => setIsLiveChatOpen(!isLiveChatOpen)}
        linkedTrackingCode={linkedTrackingCode}
        onClearLinkedTrackingCode={() => setLinkedTrackingCode(undefined)}
      />
    </div>
  );
}
