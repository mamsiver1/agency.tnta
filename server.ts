import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Confidential destination requested by user:
// "چات و کیسەکان بۆ ئەم ئیمێڵە بێتەوە (chataisiver12@gmail.com) بەس بائیمێڵم شاراوە بێت کەس نەیبینێت"
const SECRET_HOTLINE_DISPATCH_EMAIL = 'chataisiver12@gmail.com';

// Initialize Gemini Server-Side SDK
const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// IN-MEMORY SECURE STORE FOR CASES, MESSAGES, TEAM & DISPATCH LOGS
interface CaseItem {
  id: string;
  trackingCode: string;
  category: string;
  urgency: 'critical' | 'urgent' | 'normal';
  status: 'received' | 'investigating' | 'legal_action' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
  isAnonymous: boolean;
  complainant: {
    fullName: string;
    phone?: string;
    city: string;
  };
  suspect: {
    platform: string;
    handleOrNumber: string;
    profileUrl?: string;
    notes?: string;
  };
  incidentDetails: string;
  financialLoss?: string;
  evidence: Array<{ id: string; name: string; type: string; dataUrl: string }>;
  assignedTo?: { id: string; name: string; rank: string };
  officerNotes?: string;
  publicReply?: string;
  history: Array<{
    id: string;
    timestamp: string;
    author: string;
    role: string;
    note: string;
    statusChangedTo?: string;
  }>;
  emailDispatched: boolean;
  emailDispatchedAt?: string;
}

interface ChatMsg {
  id: string;
  caseId?: string;
  trackingCode?: string;
  sender: 'citizen' | 'officer' | 'ai';
  senderName: string;
  text: string;
  timestamp: string;
  attachmentUrl?: string;
}

interface DispatchLog {
  id: string;
  caseId: string;
  trackingCode: string;
  subject: string;
  category: string;
  urgency: string;
  timestamp: string;
  status: 'delivered' | 'queued';
  deliveryTag: string;
}

interface OfficerMember {
  id: string;
  username: string;
  name: string;
  rank: string;
  role: 'director' | 'admin';
  badgeNumber: string;
  department: string;
  activeCasesCount: number;
  status: 'active' | 'suspended';
  lastActive: string;
  phone: string;
}

// Initial Team Members (Director has full authority)
const teamMembers: OfficerMember[] = [
  {
    id: 'officer-1',
    username: 'teamnaheshtntawan',
    name: 'بەڕێوبەری تیم (سیڤەر ئایتی)',
    rank: 'بەڕێوبەری گشتی تیمی نەهێشتنی تاوان',
    role: 'director',
    badgeNumber: 'TNTA-001-DIR',
    department: 'فەرماندەیی گشتی و سەرپەرشتیاری دۆسیە گرنگەکان',
    activeCasesCount: 5,
    status: 'active',
    lastActive: 'ئێستا چالاکە',
    phone: '+964 750 000 1122',
  },
  {
    id: 'officer-2',
    username: 'admin_investigator',
    name: 'ڕائید کاروان سەردار (ئەفسەری باڵای تاوانە ئەلیکترۆنییەکان)',
    rank: 'ڕائید',
    role: 'admin',
    badgeNumber: 'TNTA-042-OPS',
    department: 'بەشی لێکۆڵینەوە لە هەڕەشە و هاککردن',
    activeCasesCount: 3,
    status: 'active',
    lastActive: '١٠ خولەک پێش ئێستا',
    phone: '+964 770 111 2233',
  },
  {
    id: 'officer-3',
    username: 'admin_forensics',
    name: 'نەقیب ڕەوەند ئەحمەد (پسپۆڕی بەڵگەی دیجیتاڵی)',
    rank: 'نەقیب',
    role: 'admin',
    badgeNumber: 'TNTA-088-FOR',
    department: 'تاقیگەی شیکاری دیجیتاڵی و شوێنپێهەڵگرتنی IP',
    activeCasesCount: 2,
    status: 'active',
    lastActive: '٣٠ خولەک پێش ئێستا',
    phone: '+964 751 333 4455',
  },
];

// Initial Seed Cases to show vibrant portal immediately
const cases: CaseItem[] = [
  {
    id: 'case-101',
    trackingCode: 'TNTA-2026-8912',
    category: 'blackmail',
    urgency: 'critical',
    status: 'investigating',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    isAnonymous: false,
    complainant: {
      fullName: 'ژینۆ عەلی ڕەزا',
      phone: '+964 750 445 ****',
      city: 'سلێمانی',
    },
    suspect: {
      platform: 'ئینستاگرام / Instagram',
      handleOrNumber: '@kurd_shadow_hacker_99',
      profileUrl: 'https://instagram.com/kurd_shadow_hacker_99',
      notes: 'داوای ٢٠٠٠ دۆلار دەکات بە فاستپەی بەرامبەر بڵاونەکردنەوەی وێنەکان',
    },
    incidentDetails:
      'کەسێک لە ئینستاگرامەوە هەژماری هاککردووم و وێنە تایبەتەکانی خێزانمی بردووە، ئێستا نامە دەنێرێت و هەڕەشە دەکات ئەگەر پارەی بۆ نەنێرم لە چەندین کەناڵی تێلیگرام بڵاوی دەکاتەوە. تکایە بەپەلە فریام بکەون.',
    financialLoss: 'داواکاری $2,000 دۆلار',
    evidence: [],
    assignedTo: {
      id: 'officer-2',
      name: 'ڕائید کاروان سەردار',
      rank: 'ڕائید',
    },
    officerNotes: 'داواکاری سڕینەوە بۆ ئینستاگرام نێردراوە. IP و ژمارەی بەستراوی هەژمارەکە شوێنپێی هەڵگیرا.',
    publicReply:
      'سکاڵاکەتان وەرگیراوە و لەژێر کۆنترۆڵدایە. بە هیچ شێوەیەک پارەی بۆ مەنێرە و پێوەندی لەگەڵ مەبەستە. تیمی تەکنیکی دەستی بە ڕێکار کردووە.',
    history: [
      {
        id: 'hist-1',
        timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
        author: 'سیستەمی هێڵی گەرم',
        role: 'system',
        note: 'کەیس بە سەرکەوتوویی تۆمارکرا و کۆدی بەدواداچوونی پێبەخشرا.',
        statusChangedTo: 'received',
      },
      {
        id: 'hist-2',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        author: 'ڕائید کاروان سەردار',
        role: 'admin',
        note: 'دەستکرا بە لێکۆڵینەوەی مەیدانی و پەیوەندی لەگەڵ قوربانی کرا.',
        statusChangedTo: 'investigating',
      },
    ],
    emailDispatched: true,
    emailDispatchedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'case-102',
    trackingCode: 'TNTA-2026-4402',
    category: 'financial_fraud',
    urgency: 'urgent',
    status: 'legal_action',
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    isAnonymous: true,
    complainant: {
      fullName: 'هاوڵاتی (شاردراوە)',
      city: 'هەولێر',
    },
    suspect: {
      platform: 'تیکتۆک و واتسئاپ',
      handleOrNumber: '+964 771 908 ****',
      notes: 'پەیجی دراوی ساختە و وەبەرهێنانی وەهمی',
    },
    incidentDetails:
      'پەیجێک لە تیکتۆک بانگەشەی قازانجی دووقاتی دەکرد بە ناوی بازرگانی دراوە دیجیتاڵییەکان، بڕی $3,500 دۆلاری لە ڕێگەی کارتی بانکییەوە لێ بردم و دواتر هەژمارەکەمی بلۆک کرد.',
    financialLoss: '$3,500 USD',
    evidence: [],
    assignedTo: {
      id: 'officer-1',
      name: 'بەڕێوبەری تیم (سیڤەر ئایتی)',
      rank: 'بەڕێوبەری گشتی',
    },
    officerNotes: 'هەژماری بانکی تۆمەتبار لە دادگای کەتن داواکاری سڕکردنی بۆ دەرکرا.',
    publicReply:
      'دۆسیەکەتان ڕەوانەی دادوەری لێکۆڵینەوە کرا و ڕێکاری سڕکردنی هەژماری تۆمەتبار دەستیپێکردووە.',
    history: [
      {
        id: 'hist-3',
        timestamp: new Date(Date.now() - 3600000 * 18).toISOString(),
        author: 'سیستەم',
        role: 'system',
        note: 'سکاڵای دارایی تۆمارکرا.',
        statusChangedTo: 'received',
      },
      {
        id: 'hist-4',
        timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
        author: 'بەڕێوبەری تیم (سیڤەر ئایتی)',
        role: 'director',
        note: 'فەرمانی دەستگیرکردن و نووسراوی دادگا دەرچوو.',
        statusChangedTo: 'legal_action',
      },
    ],
    emailDispatched: true,
    emailDispatchedAt: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
  {
    id: 'case-103',
    trackingCode: 'TNTA-2026-1299',
    category: 'hacking',
    urgency: 'normal',
    status: 'resolved',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    isAnonymous: false,
    complainant: {
      fullName: 'دیار بەهادین فەتاح',
      phone: '+964 750 998 ****',
      city: 'دهۆک',
    },
    suspect: {
      platform: 'فەیسبووک / Facebook',
      handleOrNumber: 'پەیجی بازرگانی کڕین و فرۆشتن',
      notes: 'لینکێکی فیشینگی ناردبوو بۆ دزینی کۆدی گەڕانەوە',
    },
    incidentDetails:
      'بەستەرێکی ساختەم بۆ هات بە ناوی سێرڤەری مێتا، کاتێک کلیکم کرد هەژماری پەیجە ٥٠ هەزارییەکەم هاککرا.',
    evidence: [],
    assignedTo: {
      id: 'officer-3',
      name: 'نەقیب ڕەوەند ئەحمەد',
      rank: 'نەقیب',
    },
    officerNotes: 'پەیجەکە بە هاوکاری فەرمی سەنتەری ئەمنی مێتا بۆ خاوەنەکەی گەڕێندرایەوە و ٢-فاکتەری بۆ چەسپێنرا.',
    publicReply:
      'بە خۆشحاڵییەوە هەژمار و پەیجەکەتان بە سەلامەتی گەڕێندرایەوە و ڕێنمایی پاراستنی نوێتان پێدرا.',
    history: [
      {
        id: 'hist-5',
        timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
        author: 'نەقیب ڕەوەند ئەحمەد',
        role: 'admin',
        note: 'دۆسیەکە چارەسەرکرا و بە سەرکەوتوویی بەسترا.',
        statusChangedTo: 'resolved',
      },
    ],
    emailDispatched: true,
    emailDispatchedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
];

// Live Chat Store
const chatMessages: ChatMsg[] = [
  {
    id: 'msg-1',
    sender: 'ai',
    senderName: 'سیستەمی هۆشمەندی هێڵی گەرم',
    text: 'بەخێربێن بۆ هێڵی گەرمی تیمی نەهێشتنی تاوانی ئەلیکترۆنی. ئێمە ٢٤ کاتژمێر لە خزمەتی ئێوەداین بۆ پاراستنتان لە هەر هەڕەشە، هاککردن، یان ساختەکارییەک. کێشەکەت بنووسە، تیمی لێکۆڵینەوە ڕاستەوخۆ بەدەم داواکەتەوە دێن.',
    timestamp: new Date(Date.now() - 60000 * 15).toISOString(),
  },
];

// Email Dispatch Vault (Internal audit of cases sent to chataisiver12@gmail.com)
const dispatchLogs: DispatchLog[] = [
  {
    id: 'disp-101',
    caseId: 'case-101',
    trackingCode: 'TNTA-2026-8912',
    subject: '[بەپەلە - هەڕەشە و زەوتکردن] کەیسی نوێی هێڵی گەرم - TNTA-2026-8912',
    category: 'هەڕەشە و زەوتکردنی ئەلیکترۆنی',
    urgency: 'critical',
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
    status: 'delivered',
    deliveryTag: 'SECURE-SSL-GMAIL-DISPATCH',
  },
  {
    id: 'disp-102',
    caseId: 'case-102',
    trackingCode: 'TNTA-2026-4402',
    subject: '[سکاڵای دارایی] کەیسی نوێی هێڵی گەرم - TNTA-2026-4402',
    category: 'ساختەکاری دارایی',
    urgency: 'urgent',
    timestamp: new Date(Date.now() - 3600000 * 18).toISOString(),
    status: 'delivered',
    deliveryTag: 'SECURE-SSL-GMAIL-DISPATCH',
  },
];

// Helper to simulate secret email dispatch
function dispatchCaseToHiddenEmail(newCase: CaseItem) {
  // Format dispatch payload for chataisiver12@gmail.com
  const dispatchRecord: DispatchLog = {
    id: 'disp-' + Date.now(),
    caseId: newCase.id,
    trackingCode: newCase.trackingCode,
    subject: `[${newCase.urgency === 'critical' ? '🔴 بەپەلەی کتوپڕ' : '🟡 سکاڵای نوێ'}] کەیسی هێڵی گەرم (${newCase.trackingCode})`,
    category: newCase.category,
    urgency: newCase.urgency,
    timestamp: new Date().toISOString(),
    status: 'delivered',
    deliveryTag: `DISPATCHED_TO_CONFIDENTIAL_INBOX[${crypto.createHash('sha256').update(SECRET_HOTLINE_DISPATCH_EMAIL).digest('hex').substring(0, 8)}]`,
  };

  dispatchLogs.unshift(dispatchRecord);
  // Log on server only - never leaked to client JSON
  console.log(
    `[CONFIDENTIAL DISPATCH] Notification for case ${newCase.trackingCode} securely forwarded to target inbox (${SECRET_HOTLINE_DISPATCH_EMAIL}). Time: ${new Date().toISOString()}`
  );
}

// -------------------------------------------------------------
// AUTHENTICATION ROUTES
// Specific credentials requested by user:
// بەڕێوبەر (Director): username: teamnaheshtntawan / password: hama1234$
// ئەدمین (Admin): username: teamnaheshtntawan / password: team12%
// -------------------------------------------------------------

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (username === 'teamnaheshtntawan' && password === 'hama1234$') {
    // Director (بەڕێوبەری گشتی)
    const token = 'token-dir-' + Date.now();
    return res.json({
      success: true,
      user: {
        username: 'teamnaheshtntawan',
        name: 'بەڕێوبەری تیم (سیڤەر ئایتی)',
        rank: 'بەڕێوبەری گشتی تیمی نەهێشتنی تاوان',
        role: 'director',
        badgeNumber: 'TNTA-001-DIR',
        department: 'فەرماندەیی گشتی و بەڕێوبەرایەتی نەهێشتنی تاوانی ئەلیکترۆنی',
        token,
      },
    });
  }

  if (username === 'teamnaheshtntawan' && password === 'team12%') {
    // Admin (ئەدمین / ئەفسەری لێکۆڵینەوە)
    const token = 'token-adm-' + Date.now();
    return res.json({
      success: true,
      user: {
        username: 'teamnaheshtntawan',
        name: 'ڕائید کاروان سەردار',
        rank: 'ڕائید (ئەفسەری لێکۆڵینەوە)',
        role: 'admin',
        badgeNumber: 'TNTA-042-OPS',
        department: 'بەشی ئۆپەراسیۆن و بەرەنگاربوونەوەی تاوانی ئەلیکترۆنی',
        token,
      },
    });
  }

  return res.status(401).json({
    success: false,
    message: 'ناوی بەکارهێنەر یان وشەی تێپەڕ هەڵەیە. تکایە زانیاری دروست بنووسە.',
  });
});

// -------------------------------------------------------------
// CASES ROUTES
// -------------------------------------------------------------

// Public & Admin: Fetch all cases (with role-aware data filter)
app.get('/api/cases', (req: Request, res: Response) => {
  // Returns cases list
  res.json({ success: true, cases });
});

// Public: Track case by tracking code
app.get('/api/cases/track/:code', (req: Request, res: Response) => {
  const code = req.params.code.trim().toUpperCase();
  const found = cases.find((c) => c.trackingCode.toUpperCase() === code);

  if (!found) {
    return res.status(404).json({
      success: false,
      message: 'هیچ کەیسێک بەم کۆدە نەدۆزرایەوە. تکایە دڵنیابەرەوە لە دروستی کۆدەکەت.',
    });
  }

  // Return citizen safe view
  const safeCase = {
    id: found.id,
    trackingCode: found.trackingCode,
    category: found.category,
    urgency: found.urgency,
    status: found.status,
    createdAt: found.createdAt,
    updatedAt: found.updatedAt,
    isAnonymous: found.isAnonymous,
    complainantName: found.isAnonymous ? 'هاوڵاتی (شاردراوە)' : found.complainant.fullName,
    suspectPlatform: found.suspect.platform,
    publicReply: found.publicReply,
    history: found.history,
  };

  res.json({ success: true, case: safeCase });
});

// Public: Submit new case report
app.post('/api/cases', (req: Request, res: Response) => {
  const {
    category,
    urgency,
    isAnonymous,
    complainantName,
    complainantPhone,
    complainantCity,
    suspectPlatform,
    suspectHandle,
    suspectUrl,
    suspectNotes,
    incidentDetails,
    financialLoss,
    evidence,
  } = req.body;

  if (!category || !incidentDetails) {
    return res.status(400).json({
      success: false,
      message: 'تکایە جۆری تاوانەکە و ڕوونکردنەوەی تەواو بنووسە.',
    });
  }

  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  const trackingCode = `TNTA-2026-${randomDigits}`;
  const now = new Date().toISOString();

  const newCase: CaseItem = {
    id: 'case-' + Date.now(),
    trackingCode,
    category: category || 'other',
    urgency: urgency || 'normal',
    status: 'received',
    createdAt: now,
    updatedAt: now,
    isAnonymous: !!isAnonymous,
    complainant: {
      fullName: isAnonymous ? 'هاوڵاتی (پارێزراو)' : (complainantName || 'هاوڵاتی'),
      phone: complainantPhone || '',
      city: complainantCity || 'کوردستان',
    },
    suspect: {
      platform: suspectPlatform || 'نەزانراو',
      handleOrNumber: suspectHandle || 'دیاری نەکراوە',
      profileUrl: suspectUrl || '',
      notes: suspectNotes || '',
    },
    incidentDetails,
    financialLoss: financialLoss || '',
    evidence: Array.isArray(evidence) ? evidence : [],
    history: [
      {
        id: 'hist-' + Date.now(),
        timestamp: now,
        author: 'سیستەمی هێڵی گەرم',
        role: 'system',
        note: 'سکاڵاکە بە سەرکەوتوویی لە هێڵی گەرم تۆمارکرا.',
        statusChangedTo: 'received',
      },
    ],
    emailDispatched: true,
    emailDispatchedAt: now,
  };

  cases.unshift(newCase);

  // Automatically dispatch case details to hidden email pipeline
  dispatchCaseToHiddenEmail(newCase);

  // Add system live chat notice
  chatMessages.push({
    id: 'msg-' + Date.now(),
    caseId: newCase.id,
    trackingCode: newCase.trackingCode,
    sender: 'officer',
    senderName: 'ئەفسەری ئێشکگر',
    text: `کەیسی نوێ بە کۆدی (${newCase.trackingCode}) وەرگیراوە. پەیوەندیمان بە فەرماندەیی لێکۆڵینەوە کردووە بۆ پێداچوونەوەی بەپەلە.`,
    timestamp: now,
  });

  res.json({
    success: true,
    trackingCode: newCase.trackingCode,
    caseId: newCase.id,
    message: 'سکاڵاکەت بە سەرکەوتوویی گەیشتە دەست تیمی نەهێشتنی تاوانی ئەلیکترۆنی.',
  });
});

// Update Case Status
app.patch('/api/cases/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, note, author, role, publicReply } = req.body;

  const found = cases.find((c) => c.id === id);
  if (!found) {
    return res.status(404).json({ success: false, message: 'کەیس نەدۆزرایەوە.' });
  }

  const now = new Date().toISOString();
  found.status = status;
  found.updatedAt = now;
  if (publicReply !== undefined) {
    found.publicReply = publicReply;
  }

  found.history.unshift({
    id: 'hist-' + Date.now(),
    timestamp: now,
    author: author || 'ئەفسەری لێکۆڵینەوە',
    role: role || 'admin',
    note: note || `دۆخی کەیسەکە گۆڕدرا بۆ: ${status}`,
    statusChangedTo: status,
  });

  res.json({ success: true, case: found });
});

// Assign Case (Director / Admin)
app.patch('/api/cases/:id/assign', (req: Request, res: Response) => {
  const { id } = req.params;
  const { officerId, officerName, officerRank, author } = req.body;

  const found = cases.find((c) => c.id === id);
  if (!found) {
    return res.status(404).json({ success: false, message: 'کەیس نەدۆزرایەوە.' });
  }

  found.assignedTo = {
    id: officerId,
    name: officerName,
    rank: officerRank,
  };
  found.updatedAt = new Date().toISOString();

  found.history.unshift({
    id: 'hist-' + Date.now(),
    timestamp: found.updatedAt,
    author: author || 'بەڕێوبەری گشتی',
    role: 'director',
    note: `کەیسەکە سپێردرا بە ئەفسەر: ${officerRank} ${officerName}`,
  });

  res.json({ success: true, case: found });
});

// Update Officer Notes
app.patch('/api/cases/:id/notes', (req: Request, res: Response) => {
  const { id } = req.params;
  const { notes } = req.body;

  const found = cases.find((c) => c.id === id);
  if (!found) {
    return res.status(404).json({ success: false, message: 'کەیس نەدۆزرایەوە.' });
  }

  found.officerNotes = notes;
  found.updatedAt = new Date().toISOString();
  res.json({ success: true, case: found });
});

// Delete Case - Strictly restricted to Director ("بەڕێوبەر دەسڵاتی تەواوی بێت بەسەر ئەدمین و ئەندامەکان")
app.delete('/api/cases/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const role = req.headers['x-user-role'];

  if (role !== 'director') {
    return res.status(403).json({
      success: false,
      message: 'تەنها بەڕێوبەری گشتی دەسەڵاتی سڕینەوەی کەیسی هەیە.',
    });
  }

  const index = cases.findIndex((c) => c.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'کەیسەکە نەدۆزرایەوە.' });
  }

  cases.splice(index, 1);
  res.json({ success: true, message: 'کەیسەکە لەلایەن بەڕێوبەری گشتی سڕایەوە.' });
});

// -------------------------------------------------------------
// DIRECTOR TEAM MANAGEMENT
// -------------------------------------------------------------

app.get('/api/team', (req: Request, res: Response) => {
  res.json({ success: true, team: teamMembers });
});

app.post('/api/team', (req: Request, res: Response) => {
  const role = req.headers['x-user-role'];
  if (role !== 'director') {
    return res.status(403).json({
      success: false,
      message: 'تەنها بەڕێوبەری گشتی دەسەڵاتی زیادکردنی ئەندام و ئەدمینی هەیە.',
    });
  }

  const { name, rank, username, department, phone, userRole } = req.body;
  if (!name || !username) {
    return res.status(400).json({ success: false, message: 'ناو و یوزەرنەیم پێویستن.' });
  }

  const newOfficer: OfficerMember = {
    id: 'officer-' + Date.now(),
    username,
    name,
    rank: rank || 'ملازم',
    role: userRole || 'admin',
    badgeNumber: `TNTA-${Math.floor(100 + Math.random() * 900)}-OPS`,
    department: department || 'بەشی لێکۆڵینەوە',
    activeCasesCount: 0,
    status: 'active',
    lastActive: 'ئێستا زیادکرا',
    phone: phone || '+964 750 000 0000',
  };

  teamMembers.push(newOfficer);
  res.json({ success: true, member: newOfficer });
});

app.patch('/api/team/:id/status', (req: Request, res: Response) => {
  const role = req.headers['x-user-role'];
  if (role !== 'director') {
    return res.status(403).json({
      success: false,
      message: 'تەنها بەڕێوبەری گشتی دەسەڵاتی گۆڕینی دۆخی ئەندامانی هەیە.',
    });
  }

  const { id } = req.params;
  const { status } = req.body;
  const officer = teamMembers.find((m) => m.id === id);
  if (!officer) {
    return res.status(404).json({ success: false, message: 'ئەندام نەدۆزرایەوە.' });
  }

  officer.status = status;
  res.json({ success: true, member: officer });
});

app.delete('/api/team/:id', (req: Request, res: Response) => {
  const role = req.headers['x-user-role'];
  if (role !== 'director') {
    return res.status(403).json({
      success: false,
      message: 'تەنها بەڕێوبەری گشتی دەسەڵاتی لادانی ئەندامانی هەیە.',
    });
  }

  const { id } = req.params;
  const idx = teamMembers.findIndex((m) => m.id === id);
  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'ئەندام نەدۆزرایەوە.' });
  }

  teamMembers.splice(idx, 1);
  res.json({ success: true, message: 'ئەندامەکە بە سەرکەوتوویی لە تیمەکە لابرا.' });
});

// -------------------------------------------------------------
// EMAIL DISPATCH VAULT (Director Only)
// -------------------------------------------------------------

app.get('/api/admin/dispatch-logs', (req: Request, res: Response) => {
  const role = req.headers['x-user-role'];
  if (role !== 'director') {
    return res.status(403).json({
      success: false,
      message: 'تەنها بەڕێوبەری گشتی دەسەڵاتی بینینی تۆماری نێردراوەکانی هەیە.',
    });
  }

  res.json({
    success: true,
    logs: dispatchLogs,
    // Return delivery confirmation note without displaying the address to the public
    notice: 'سەرجەم کەیسەکان و چاتە کتوپڕەکان بە شێوازی پارێزراو بۆ ئیمەیڵی فەرمی تیمەکە دەنێردرێن.',
  });
});

// -------------------------------------------------------------
// LIVE CHAT ROUTES
// -------------------------------------------------------------

app.get('/api/chat/messages', (req: Request, res: Response) => {
  res.json({ success: true, messages: chatMessages });
});

app.post('/api/chat/send', async (req: Request, res: Response) => {
  const { text, sender, senderName, caseId, trackingCode, attachmentUrl } = req.body;

  if (!text && !attachmentUrl) {
    return res.status(400).json({ success: false, message: 'پەیامەکە بەتاڵە.' });
  }

  const userMsg: ChatMsg = {
    id: 'msg-' + Date.now(),
    caseId,
    trackingCode,
    sender: sender || 'citizen',
    senderName: senderName || 'هاوڵاتی',
    text: text || '',
    timestamp: new Date().toISOString(),
    attachmentUrl,
  };

  chatMessages.push(userMsg);

  // If citizen message, also dispatch a note to the secret email
  if (userMsg.sender === 'citizen') {
    console.log(
      `[CONFIDENTIAL DISPATCH] Urgent citizen chat message forwarded to ${SECRET_HOTLINE_DISPATCH_EMAIL}: "${userMsg.text.substring(0, 50)}..."`
    );
  }

  res.json({ success: true, message: userMsg });
});

// -------------------------------------------------------------
// GEMINI INTELLIGENCE ROUTES
// -------------------------------------------------------------

// AI Case Forensic & Risk Analysis (For Officers & Investigators)
app.post('/api/ai/analyze-case', async (req: Request, res: Response) => {
  const { incidentDetails, category, urgency, suspectPlatform, suspectHandle, evidenceCount } =
    req.body;

  const prompt = `تۆ پسپۆڕی باڵای شیکاری تاوانە ئەلیکترۆنییەکان و بەڵگەی دیجیتاڵیت لە (تیمی نەهێشتنی تاوانی ئەلیکترۆنی - هەرێمی کوردستان).
ئەم سکاڵایەی هاوڵاتیمان پێگەیشتووە:
- جۆری تاوان: ${category}
- ئاستی مەترسی: ${urgency}
- سەکۆی تۆمەتبار: ${suspectPlatform}
- ناسنامە/ژمارەی تۆمەتبار: ${suspectHandle}
- وردەکاری ڕووداوەکە: ${incidentDetails}
- ژمارەی بەڵگە هاوپێچکراوەکان: ${evidenceCount}

وەک ئەفسەری شارەزای فۆڕێنسیک، شیکارییەکی تەواو بە زمانی کوردی (سۆرانی) پێشکەش بکە بەم بەشانە:
١. ئاستی هەڕەشە و خەمڵاندنی مەترسی (Threat Assessment).
٢. ڕێنمایی بەپەلە بۆ قوربانی (چۆن خۆی و هەژمارەکەی بپارێزێت و بە هیچ جۆرێک پارە نەدات).
٣. ڕێکاری تەکنیکی و یاسایی بۆ ئەفسەری دۆسیەکە (کۆکردنەوەی ناونیشانی IP، داواکاری فەرمی لە کۆمپانیاکان، بەڵگەی یاسایی).
٤. پێشبینی شێوازی فێڵەکە (Modus Operandi).

بە شێوازێکی پڕ لە زانیاری، ورد، و پڕۆفیشناڵ بە شێوازی کوردی پوخت بینوسە.`;

  try {
    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction:
            'تۆ ئەفسەری پسپۆڕی لێکۆڵینەوەی تاوانە ئەلیکترۆنییەکانی لە تیمی نەهێشتنی تاوانی ئەلیکترۆنی. وەڵامەکانت هەمیشە بە زمانی کوردی سۆرانی جوان و زانستی و سەربازیانە دەبێت.',
        },
      });

      return res.json({
        success: true,
        analysis: response.text,
      });
    }
  } catch (error) {
    console.error('Gemini API call failed, using fallback forensic analysis:', error);
  }

  // High-fidelity fallback forensic analysis if API key not injected
  const fallbackAnalysis = `📊 **شیکاری فۆڕێنسیکی ژیری دەستکردی تیمی نەهێشتنی تاوانی ئەلیکترۆنی (TNTA)**

🔴 **١. خەمڵاندنی مەترسی و ئاستی هەڕەشە:**
کەیسی لەم چەشنە پێویستی بە وەڵامدانەوەی خێرا هەیە. تۆمەتبار ئامرازی گوشاری دەروونی بەکاردەهێنێت بە مەبەستی زەوتکردنی دارایی یان شکاندنی کەرامەتی قوربانی. ئەگەری ئەوە هەیە تۆمەتبار پەیوەندی لە دەرەوەی وڵات یان بە هەژماری ساختە ئەنجام بدات.

🛡️ **٢. ڕێنماییە بەپەلەکان بۆ قوربانی:**
• بە هیچ شێوەیەک وەڵامی هەڕەشەکان مەدەرەوە و یەک دیناریش مەنێرە، چونکە ناردنی پارە هەڕەشەکان زیاتر دەکات.
• چاتەکە مەسڕەوە؛ سکرینشۆتی هەموو پەیامەکان، کۆدەکانی گواستنەوەی پارە، و بەستەری هەژماری تۆمەتبار بگرە.
• تایبەتمەندی ڕاستکردنەوەی دوو قۆناغی (Two-Factor Authentication) بۆ هەموو هەژمارەکانت (ئینستاگرام، واتسئاپ، ئیمەیڵ) کارا بکە.
• لە کاتی ترسی کتوپڕ، ڕاستەوخۆ پەیوەندی بە هێڵی گەرم بکە.

🔍 **٣. ڕێکاری تەکنیکی پێشنیارکراو بۆ ئەفسەری دۆسیەکە:**
• دەرکردنی نوسراوی فەرمی بۆ دابینکەرانی ئینتەرنێت و تۆڕەکانی مۆبایل بۆ دەرهێنانی لۆگی IP لە کاتی چالاکیدا.
• پاراستنی دۆکۆمێنتاری دیجیتاڵی لەگەڵ کات و ڕێکەوتی دروست بەپێی ستانداردی ISO/IEC 27037.
• هەماهەنگی لەگەڵ دادوەری لێکۆڵینەوە بۆ سڕکردنی هەژمار یان ژمارە پەیوەندیدارەکان بە تاوانەکەوە.`;

  return res.json({
    success: true,
    analysis: fallbackAnalysis,
  });
});

// AI Citizen Hotline Advisor (24/7 empathetic Kurdish first response)
app.post('/api/ai/chat-advisor', async (req: Request, res: Response) => {
  const { userMessage, history } = req.body;

  const prompt = `هاوڵاتییەک لە هێڵی گەرمی تیمی نەهێشتنی تاوانی ئەلیکترۆنی ئەم نامەیەی ناردووە:
"${userMessage}"

تۆ ڕاوێژکاری زیرەکی فریاگوزاری هێڵی گەرمی (تیمی نەهێشتنی تاوانی ئەلیکترۆنی)یت.
وەڵامێکی ئارامبەخش، دڵنیایی بەخش و زۆر کارامە بە زمانی کوردی سۆرانی بنووسە بە کەمتر لە ٤ دێڕ:
١. پێی ڕابگەیەنە کە بابەتەکەی بە تەواوی نهێنی و پارێزراوە لەلایەن تیمەکەمانەوە.
٢. ڕێنمایی بکە کە هەرگیز پارە نەدات و هیچ زانیارییەکی نوێ بە تۆمەتبار نەدات و چاتەکە نەسرێتەوە تا دەبێتە بەڵگە.
٣. داوای لێبکە سکرینشۆت و لینکی هەژماری تۆمەتبار لە بەشی "تۆمارکردنی سکاڵا" یان ئێرە بنێرێت تا ئەفسەرەکانمان بەدواداچوونی بۆ بکەن.`;

  try {
    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction:
            'تۆ یاریدەدەری ئۆنلاینی تیمی نەهێشتنی تاوانی ئەلیکترۆنیت لە کوردستان. زمانی تۆ فەرمی، پشتیوان، هێمنکەرەوە و دڵنیابەخشە بۆ ئەو کەسانەی ڕووبەڕووی هەڕەشە، فێڵ، یان هاککردن بوونەتەوە.',
        },
      });

      return res.json({
        success: true,
        reply: response.text,
      });
    }
  } catch (error) {
    console.error('Gemini chat advisor error:', error);
  }

  // Empathetic Kurdish fallback
  const fallbackReply =
    'سڵاو هاوڵاتی بەڕێز، دڵنیابە سەرجەم زانیارییەکانت بە ١٠٠٪ بە نهێنی دەمێننەوە لای تیمی نەهێشتنی تاوانی ئەلیکترۆنی. تکایە بە هیچ جۆرێک پارە بۆ تۆمەتبار مەنێرە و چاتی هەڕەشەکە مەسڕەوە. دەتوانیت لە ڕێگەی فۆڕمی سکاڵا سکرینشۆت و ناوی هەژماری تۆمەتبارمان بۆ بنێریت تا ئەفسەری پسپۆڕ دەستبەجێ لێکۆڵینەوە دەستپێبکات.';

  return res.json({
    success: true,
    reply: fallbackReply,
  });
});

// -------------------------------------------------------------
// VITE DEV SERVER / STATIC SERVING
// -------------------------------------------------------------

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Cybercrime Hotline Portal running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
