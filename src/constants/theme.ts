import { CaseCategory, CaseStatus, CaseUrgency } from '../types';

export const LOGO_PATH = '/assets/aistudio/Capajajajjajature-removebg-preview_40168e87.png';
export const APP_NAME_KU = 'تیمی نەهێشتنی تاوانی ئەلیکترۆنی';
export const APP_MOTTO_KU = 'پاراستنی هاوڵاتی ئەرکی سەرشانمانە';
export const HOTLINE_NUMBER = '104';
export const EMERGENCY_PHONE = '+964 750 000 1122';

export const CATEGORY_LABELS: Record<CaseCategory, { label: string; icon: string; desc: string }> = {
  blackmail: {
    label: 'هەڕەشە و زەوتکردنی ئەلیکترۆنی (ئیبتزاز)',
    icon: 'ShieldAlert',
    desc: 'هەڕەشەی بڵاوکردنەوەی وێنە، ڤیدیۆ یان نامە بەرامبەر داواکاری پارە یان کاری تر',
  },
  hacking: {
    label: 'هاککردنی هەژمار و پەیج',
    icon: 'Terminal',
    desc: 'دەستبەسەرداگرتنی ئینستاگرام، سناپچات، تیکتۆک، فەیسبووک یان واتسئاپ',
  },
  financial_fraud: {
    label: 'ساختەکاری دارایی و کڕینی وەهمی',
    icon: 'Banknote',
    desc: 'دزینی باڵانس، فێڵی وەبەرهێنانی وەهمی، فاستپەی، فیب یان کارتی بانکی',
  },
  identity_theft: {
    label: 'دزینی وێنە و دروستکردنی هەژماری ساختە',
    icon: 'UserX',
    desc: 'بەکارهێنانی وێنە و ناوی تۆ بە بێ ڕەزامەندی بۆ ناوزڕاندن',
  },
  harassment: {
    label: 'گێچەڵی ئەلیکترۆنی و ناوزڕاندن',
    icon: 'MessageSquareWarning',
    desc: 'بێزارکردنی بەردەوام، نامەی نەشیاو، بڵاوکردنەوەی پڕوپاگەندە و ناوزڕاندن',
  },
  phishing: {
    label: 'فیشینگ و بەستەری گوماناوی و ڤایرۆس',
    icon: 'Link2',
    desc: 'ناردنی لینکی ساختە بۆ دزینی وشەی نهێنی یان تێکدانی ئامێرەکەت',
  },
  deepfake: {
    label: 'ساختەکاری دەنگ و ڕەنگ بە ژیری دەستکرد (Deepfake)',
    icon: 'Cpu',
    desc: 'دروستکردنی دەنگ یان وێنە و ڤیدیۆی دەستکاریکراو بە ژیری دەستکرد',
  },
  other: {
    label: 'تاوانی ئەلیکترۆنی تر',
    icon: 'HelpCircle',
    desc: 'هەر حاڵەتێکی تری سەرپێچی و تاوانی دیجیتاڵی',
  },
};

export const URGENCY_LABELS: Record<CaseUrgency, { label: string; color: string; badge: string }> = {
  critical: {
    label: 'کتوپڕ و مەترسیدار',
    color: 'border-red-500 bg-red-500/10 text-red-400',
    badge: 'bg-red-500/20 text-red-300 border-red-500/30',
  },
  urgent: {
    label: 'بەپەلە',
    color: 'border-amber-500 bg-amber-500/10 text-amber-400',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  },
  normal: {
    label: 'ئاسایی',
    color: 'border-blue-500 bg-blue-500/10 text-blue-400',
    badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  },
};

export const STATUS_LABELS: Record<
  CaseStatus,
  { label: string; step: number; color: string; icon: string }
> = {
  received: {
    label: 'وەرگیراوە',
    step: 1,
    color: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    icon: 'Inbox',
  },
  investigating: {
    label: 'لەژێر لێکۆڵینەوە و شیکاریدایە',
    step: 2,
    color: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    icon: 'Search',
  },
  legal_action: {
    label: 'ڕێکاری یاسایی گیراوەتەبەر',
    step: 3,
    color: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    icon: 'Scale',
  },
  resolved: {
    label: 'چارەسەرکراوە و پارێزراو',
    step: 4,
    color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    icon: 'CheckCircle2',
  },
  closed: {
    label: 'دۆسیەکە بەستراوە',
    step: 4,
    color: 'bg-slate-500/20 text-slate-300 border-slate-500/40',
    icon: 'Archive',
  },
};
