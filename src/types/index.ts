export type UserRole = 'director' | 'admin';

export interface UserSession {
  username: string;
  name: string;
  role: UserRole;
  rank: string;
  badgeNumber: string;
  avatar?: string;
  token: string;
}

export type CaseCategory =
  | 'blackmail' // هەڕەشە و زەوتکردنی ئەلیکترۆنی
  | 'hacking' // هاککردنی هەژمار و پەیج
  | 'financial_fraud' // ساختەکاری دارایی و کڕینی وەهمی
  | 'identity_theft' // دزینی وێنە و ناسنامە
  | 'harassment' // گێچەڵی ئەلیکترۆنی و ناوزڕاندن
  | 'phishing' // فیشینگ و بەستەری گوماناوی
  | 'deepfake' // ساختەکاری دەنگ و ڕەنگ بە ژیری دەستکرد
  | 'other'; // تاوانی تر

export type CaseUrgency = 'critical' | 'urgent' | 'normal';

export type CaseStatus =
  | 'received' // وەرگیراوە
  | 'investigating' // لەژێر لێکۆڵینەوەی تەکنیکیدایە
  | 'legal_action' // ڕێکاری یاسایی گیراوەتەبەر
  | 'resolved' // چارەسەرکراوە
  | 'closed'; // داخراوە

export interface CaseEvidence {
  id: string;
  name: string;
  type: string;
  dataUrl: string;
  size?: number;
}

export interface CaseUpdateLog {
  id: string;
  timestamp: string;
  author: string;
  role: string;
  note: string;
  statusChangedTo?: CaseStatus;
}

export interface CaseReport {
  id: string;
  trackingCode: string; // e.g. TNTA-2026-9281
  category: CaseCategory;
  urgency: CaseUrgency;
  status: CaseStatus;
  createdAt: string;
  updatedAt: string;
  isAnonymous: boolean;
  complainant: {
    fullName: string;
    phone?: string;
    city: string;
  };
  suspect: {
    platform: string; // Instagram, WhatsApp, Telegram, Facebook, TikTok, Phone...
    handleOrNumber: string;
    profileUrl?: string;
    notes?: string;
  };
  incidentDetails: string;
  financialLoss?: string;
  evidence: CaseEvidence[];
  assignedTo?: {
    id: string;
    name: string;
    rank: string;
  };
  officerNotes?: string;
  publicReply?: string;
  history: CaseUpdateLog[];
  emailDispatched: boolean;
  emailDispatchedAt?: string;
}

export interface ChatMessage {
  id: string;
  caseId?: string;
  sender: 'citizen' | 'officer' | 'ai';
  senderName: string;
  text: string;
  timestamp: string;
  attachmentUrl?: string;
  isInternalNote?: boolean;
}

export interface TeamMember {
  id: string;
  username: string;
  name: string;
  rank: string;
  role: UserRole;
  badgeNumber: string;
  department: string;
  activeCasesCount: number;
  status: 'active' | 'suspended';
  lastActive: string;
  phone: string;
}

export interface EmailDispatchRecord {
  id: string;
  caseId: string;
  trackingCode: string;
  recipientHash: string; // [PARASPARAW - SECURE ENCRYPTED INBOX]
  category: string;
  urgency: string;
  timestamp: string;
  status: 'delivered' | 'queued' | 'acknowledged';
  subject: string;
}
