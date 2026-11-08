import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Search,
  Filter,
  Users,
  Mail,
  MessageSquare,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  LogOut,
  RefreshCw,
  Plus,
  Send,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';
import { LOGO_PATH, CATEGORY_LABELS, STATUS_LABELS, URGENCY_LABELS } from '../constants/theme';
import { CaseReport, CaseStatus, CaseUrgency, CaseCategory, UserSession, TeamMember, ChatMessage } from '../types';
import { CaseDetailModal } from './CaseDetailModal';
import { DirectorTeamManager } from './DirectorTeamManager';
import { EmailDispatchVault } from './EmailDispatchVault';

interface DashboardProps {
  user: UserSession;
  onLogout: () => void;
  onBackToPortal: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  onLogout,
  onBackToPortal,
}) => {
  const [cases, setCases] = useState<CaseReport[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [liveChatMessages, setLiveChatMessages] = useState<ChatMessage[]>([]);
  const [officerReplyText, setOfficerReplyText] = useState('');

  const [activeTab, setActiveTab] = useState<'cases' | 'team' | 'emailVault' | 'chat'>('cases');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const [activeCaseModal, setActiveCaseModal] = useState<CaseReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isDirector = user.role === 'director';

  // Fetch all cases
  const fetchCases = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/cases');
      const data = await res.json();
      if (data.success && Array.isArray(data.cases)) {
        setCases(data.cases);
      }
    } catch (err) {
      console.error('Error fetching cases:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch team members
  const fetchTeam = async () => {
    try {
      const res = await fetch('/api/team');
      const data = await res.json();
      if (data.success && Array.isArray(data.team)) {
        setTeam(data.team);
      }
    } catch (err) {
      console.error('Error fetching team:', err);
    }
  };

  // Fetch live chat
  const fetchChat = async () => {
    try {
      const res = await fetch('/api/chat/messages');
      const data = await res.json();
      if (data.success && Array.isArray(data.messages)) {
        setLiveChatMessages(data.messages);
      }
    } catch (err) {
      console.error('Error fetching chat:', err);
    }
  };

  useEffect(() => {
    fetchCases();
    fetchTeam();
    fetchChat();

    const interval = setInterval(() => {
      fetchCases();
      fetchChat();
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Update Case Status
  const handleUpdateStatus = async (
    caseId: string,
    newStatus: CaseStatus,
    note: string,
    publicReply?: string
  ) => {
    try {
      const res = await fetch(`/api/cases/${caseId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          note,
          author: user.name,
          role: user.role,
          publicReply,
        }),
      });
      const data = await res.json();
      if (data.success && data.case) {
        setCases((prev) => prev.map((c) => (c.id === caseId ? data.case : c)));
        setActiveCaseModal(data.case);
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  // Assign Officer
  const handleAssignOfficer = async (
    caseId: string,
    officerId: string,
    officerName: string,
    officerRank: string
  ) => {
    try {
      const res = await fetch(`/api/cases/${caseId}/assign`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          officerId,
          officerName,
          officerRank,
          author: user.name,
        }),
      });
      const data = await res.json();
      if (data.success && data.case) {
        setCases((prev) => prev.map((c) => (c.id === caseId ? data.case : c)));
        setActiveCaseModal(data.case);
      }
    } catch (err) {
      console.error('Failed to assign officer:', err);
    }
  };

  // Delete Case (Director only)
  const handleDeleteCase = async (caseId: string) => {
    try {
      const res = await fetch(`/api/cases/${caseId}`, {
        method: 'DELETE',
        headers: { 'x-user-role': user.role },
      });
      const data = await res.json();
      if (data.success) {
        setCases((prev) => prev.filter((c) => c.id !== caseId));
        setActiveCaseModal(null);
      }
    } catch (err) {
      console.error('Failed to delete case:', err);
    }
  };

  // Team Management Handlers (Director only)
  const handleAddMember = async (newMember: Partial<TeamMember>) => {
    try {
      const res = await fetch('/api/team', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': user.role,
        },
        body: JSON.stringify(newMember),
      });
      const data = await res.json();
      if (data.success && data.member) {
        setTeam((prev) => [...prev, data.member]);
      }
    } catch (err) {
      console.error('Failed to add team member:', err);
    }
  };

  const handleToggleMemberStatus = async (id: string, currentStatus: 'active' | 'suspended') => {
    try {
      const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
      const res = await fetch(`/api/team/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': user.role,
        },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (data.success && data.member) {
        setTeam((prev) => prev.map((m) => (m.id === id ? data.member : m)));
      }
    } catch (err) {
      console.error('Failed to toggle member status:', err);
    }
  };

  const handleRemoveMember = async (id: string) => {
    try {
      const res = await fetch(`/api/team/${id}`, {
        method: 'DELETE',
        headers: { 'x-user-role': user.role },
      });
      const data = await res.json();
      if (data.success) {
        setTeam((prev) => prev.filter((m) => m.id !== id));
      }
    } catch (err) {
      console.error('Failed to remove member:', err);
    }
  };

  // Officer sends reply in live chat console
  const handleSendOfficerReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!officerReplyText.trim()) return;

    try {
      const res = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: officerReplyText.trim(),
          sender: 'officer',
          senderName:
            user.role === 'director'
              ? 'بەڕێوبەری تیم (سیڤەر ئایتی)'
              : `${user.rank} ${user.name}`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setLiveChatMessages((prev) => [...prev, data.message]);
        setOfficerReplyText('');
      }
    } catch (err) {
      console.error('Officer chat send error:', err);
    }
  };

  // Filter cases
  const filteredCases = cases.filter((c) => {
    const matchesSearch =
      c.trackingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.complainant.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.suspect.handleOrNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.incidentDetails.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesUrgency = selectedUrgency === 'all' || c.urgency === selectedUrgency;
    const matchesStatus = selectedStatus === 'all' || c.status === selectedStatus;
    const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory;

    return matchesSearch && matchesUrgency && matchesStatus && matchesCategory;
  });

  // Calculate high-level stats
  const totalCount = cases.length;
  const criticalCount = cases.filter((c) => c.urgency === 'critical').length;
  const investigatingCount = cases.filter((c) => c.status === 'investigating').length;
  const resolvedCount = cases.filter((c) => c.status === 'resolved').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Command Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/95 border-b border-amber-500/40 backdrop-blur-md px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={LOGO_PATH}
              alt="لۆگۆی فەرمی"
              className="w-12 h-12 object-contain rounded-full border-2 border-amber-500/60 shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-500">
                  ژووری کۆنترۆڵ و ئۆپەراسیۆنە ئەلیکترۆنییەکان
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    isDirector
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                  }`}
                >
                  {isDirector ? 'دەسەڵاتی بەڕێوبەری گشتی' : 'ئەدمین / ئەفسەری ئۆپەراسیۆن'}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium">
                {user.role === 'director' ? (
                  <span className="text-amber-200 font-bold">
                    بەڕێوبەری تیم (سیڤەر ئایتی) • بەڕێوبەری گشتی تیمی نەهێشتنی تاوان
                  </span>
                ) : (
                  <span>
                    {user.name} ({user.rank})
                  </span>
                )}{' '}
                • باجی فەرمی: <span className="font-mono text-amber-400">{user.badgeNumber}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onBackToPortal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
            >
              <span>گەڕانەوە بۆ پۆرتاڵی هاوڵاتییان</span>
              <ArrowRight className="w-3.5 h-3.5 rotate-180" />
            </button>

            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-xs font-bold text-red-300 border border-red-500/30 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>دەرچوون</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg">
            <div className="text-xs text-slate-400 font-medium">کۆی گشتی کەیسەکان</div>
            <div className="mt-1 text-2xl sm:text-3xl font-black text-white">{totalCount}</div>
            <div className="mt-1 text-[11px] text-slate-500">سەرجەم سکاڵا تۆمارکراوەکان</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-red-500/40 shadow-lg">
            <div className="text-xs text-red-400 font-bold flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>کتوپڕ و مەترسیدار</span>
            </div>
            <div className="mt-1 text-2xl sm:text-3xl font-black text-red-400">{criticalCount}</div>
            <div className="mt-1 text-[11px] text-red-300/80">پێویستی بە دەستبەجێ بەهاناوەچوونە</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/40 shadow-lg">
            <div className="text-xs text-amber-400 font-bold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>لەژێر لێکۆڵینەوە</span>
            </div>
            <div className="mt-1 text-2xl sm:text-3xl font-black text-amber-400">{investigatingCount}</div>
            <div className="mt-1 text-[11px] text-amber-300/80">شیکاری دیجیتاڵی لە تاقیگە</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/40 shadow-lg">
            <div className="text-xs text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>چارەسەرکراو و پارێزراو</span>
            </div>
            <div className="mt-1 text-2xl sm:text-3xl font-black text-emerald-400">{resolvedCount}</div>
            <div className="mt-1 text-[11px] text-emerald-300/80">هەڕەشە نەهێڵراوە</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('cases')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'cases'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>بەڕێوەبردنی کەیس و سکاڵاکان ({totalCount})</span>
          </button>

          {/* Director-Only: Team Management */}
          {isDirector && (
            <button
              onClick={() => setActiveTab('team')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                activeTab === 'team'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>دەسەڵاتی بەڕێوبەر بەسەر ئەندام و ئەدمینەکان</span>
            </button>
          )}

          {/* Director-Only: Email Dispatch Vault */}
          {isDirector && (
            <button
              onClick={() => setActiveTab('emailVault')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                activeTab === 'emailVault'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>تۆماری گەیاندنی ئیمێڵ (پارێزراو)</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'chat'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>کۆنسۆڵی چاتی هاوڵاتییان ({liveChatMessages.length})</span>
          </button>
        </div>

        {/* Tab 1: Cases Table & Filters */}
        {activeTab === 'cases' && (
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex-1 min-w-[240px] relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="گەڕان بەدوای کۆدی کەیس، ناوی قوربانی، سەکۆ، یان دەقی سکاڵا..."
                  className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                />
                <Search className="absolute top-2.5 right-3 w-4 h-4 text-slate-400" />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={selectedUrgency}
                  onChange={(e) => setSelectedUrgency(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-300 focus:outline-none focus:border-amber-500"
                >
                  <option value="all">هەموو ئاستەکانی کتوپڕی</option>
                  <option value="critical">🔴 کتوپڕ و مەترسیدار</option>
                  <option value="urgent">🟡 بەپەلە</option>
                  <option value="normal">🟢 ئاسایی</option>
                </select>

                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-300 focus:outline-none focus:border-amber-500"
                >
                  <option value="all">هەموو دۆخەکان</option>
                  <option value="received">وەرگیراوە</option>
                  <option value="investigating">لەژێر لێکۆڵینەوە</option>
                  <option value="legal_action">ڕێکاری یاسایی</option>
                  <option value="resolved">چارەسەرکراو</option>
                  <option value="closed">داخراو</option>
                </select>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-300 focus:outline-none focus:border-amber-500"
                >
                  <option value="all">هەموو جۆرەکانی تاوان</option>
                  {(Object.keys(CATEGORY_LABELS) as CaseCategory[]).map((k) => (
                    <option key={k} value={k}>
                      {CATEGORY_LABELS[k].label}
                    </option>
                  ))}
                </select>

                <button
                  onClick={fetchCases}
                  disabled={isLoading}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="نوێکردنەوە"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* Cases Table */}
            <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-bold">
                    <tr>
                      <th className="p-3">کۆدی بەدواداچوون</th>
                      <th className="p-3">جۆری تاوان</th>
                      <th className="p-3">سکاڵاکار</th>
                      <th className="p-3">تۆمەتبار / سەکۆ</th>
                      <th className="p-3">ئاستی کتوپڕی</th>
                      <th className="p-3">دۆخی لێکۆڵینەوە</th>
                      <th className="p-3">ئەفسەری ڕاسپێردراو</th>
                      <th className="p-3 text-center">کردار</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredCases.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-slate-500">
                          هیچ کەیسێک نەدۆزرایەوە بەپێی ئەم فلتەرە.
                        </td>
                      </tr>
                    ) : (
                      filteredCases.map((c) => (
                        <tr
                          key={c.id}
                          className="hover:bg-slate-800/50 transition-colors cursor-pointer"
                          onClick={() => setActiveCaseModal(c)}
                        >
                          <td className="p-3 font-mono font-bold text-amber-400">
                            {c.trackingCode}
                          </td>

                          <td className="p-3 font-semibold text-slate-200">
                            {CATEGORY_LABELS[c.category]?.label || c.category}
                          </td>

                          <td className="p-3">
                            <div className="font-medium text-slate-200">
                              {c.complainant.fullName}
                            </div>
                            <div className="text-[10px] text-slate-500">{c.complainant.city}</div>
                          </td>

                          <td className="p-3">
                            <div className="font-semibold text-slate-300">
                              {c.suspect.handleOrNumber || 'نەزانراو'}
                            </div>
                            <div className="text-[10px] text-amber-400 font-medium">
                              {c.suspect.platform}
                            </div>
                          </td>

                          <td className="p-3">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                URGENCY_LABELS[c.urgency]?.badge || 'bg-slate-800 text-slate-300'
                              }`}
                            >
                              {URGENCY_LABELS[c.urgency]?.label || c.urgency}
                            </span>
                          </td>

                          <td className="p-3">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                STATUS_LABELS[c.status]?.color || 'bg-slate-800 text-slate-300'
                              }`}
                            >
                              {STATUS_LABELS[c.status]?.label || c.status}
                            </span>
                          </td>

                          <td className="p-3 text-slate-300">
                            {c.assignedTo ? (
                              <span className="text-emerald-400 font-medium">
                                {c.assignedTo.rank} {c.assignedTo.name}
                              </span>
                            ) : (
                              <span className="text-slate-500 italic">دیاری نەکراوە</span>
                            )}
                          </td>

                          <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => setActiveCaseModal(c)}
                              className="px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-bold transition-colors"
                            >
                              بینینی دۆسیە
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Team Management (Director Only) */}
        {activeTab === 'team' && isDirector && (
          <DirectorTeamManager
            currentUser={user}
            team={team}
            onAddMember={handleAddMember}
            onToggleStatus={handleToggleMemberStatus}
            onRemoveMember={handleRemoveMember}
          />
        )}

        {/* Tab 3: Email Dispatch Vault (Director Only) */}
        {activeTab === 'emailVault' && isDirector && (
          <EmailDispatchVault currentUser={user} />
        )}

        {/* Tab 4: Live Chat Console */}
        {activeTab === 'chat' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col h-[600px]">
              <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
                <div className="text-sm font-bold text-amber-300 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-amber-400" />
                  <span>تەواوی پەیامەکانی هێڵی گەرم و چاتی ڕاستەوخۆ</span>
                </div>
                <button
                  onClick={fetchChat}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Chat Message Stream */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-950/60 rounded-xl my-3">
                {liveChatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-3 rounded-xl text-xs space-y-1 ${
                      msg.sender === 'officer'
                        ? 'bg-amber-950/40 border border-amber-500/40 text-amber-100 mr-8'
                        : msg.sender === 'ai'
                        ? 'bg-slate-900 border border-slate-700 text-slate-300 mr-8'
                        : 'bg-blue-950/40 border border-blue-500/40 text-blue-100 ml-8'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                      <span>{msg.senderName} ({msg.sender === 'citizen' ? 'هاوڵاتی' : msg.sender === 'ai' ? 'ژیری دەستکرد' : 'ئەفسەر'})</span>
                      <span className="font-mono">{new Date(msg.timestamp).toLocaleTimeString('ar-IQ')}</span>
                    </div>
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  </div>
                ))}
              </div>

              {/* Officer Reply Form */}
              <form onSubmit={handleSendOfficerReply} className="flex gap-2">
                <input
                  type="text"
                  value={officerReplyText}
                  onChange={(e) => setOfficerReplyText(e.target.value)}
                  placeholder={`وەڵام بدەرەوە وەک: ${user.role === 'director' ? 'بەڕێوبەری تیم (سیڤەر ئایتی)' : `${user.rank} ${user.name}`}...`}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  disabled={!officerReplyText.trim()}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold text-xs shadow-md transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5 rotate-180" />
                  <span>ناردنی وەڵامی فەرمی</span>
                </button>
              </form>
            </div>

            {/* Quick Officer Instructions */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-amber-300">ڕێنمایی ئۆپەراسیۆنی هێڵی گەرم:</h3>
              <ul className="text-xs text-slate-300 space-y-3 leading-relaxed">
                <li className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <strong className="text-amber-400">١. کتوپڕی کات:</strong> لە کاتی هەڕەشەی وێنە، قوربانی لە ژێر ترسی گەورەدایە؛ دڵنیایی پێبدە کە تیمەکە دەستی بە پاراستنی کردووە.
                </li>
                <li className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <strong className="text-amber-400">٢. گەیاندنی نهێنی:</strong> سەرجەم ئەم پەیامانە لە سێرڤەری پارێزراودا دەمێننەوە و لە ئیمەیڵی فەرمی ناوەند هەڵگیراون.
                </li>
                <li className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <strong className="text-amber-400">٣. ڕێنمایی دادگایی:</strong> هۆشداری بدە لە سڕینەوەی بەڵگە و داوای لێبکە فۆڕمی سکاڵا پڕبکاتەوە بۆ وەرگرتنی کۆدی بەدواداچوون.
                </li>
              </ul>
            </div>
          </div>
        )}
      </main>

      {/* Deep Case Detail Modal */}
      {activeCaseModal && (
        <CaseDetailModal
          isOpen={!!activeCaseModal}
          onClose={() => setActiveCaseModal(null)}
          caseItem={activeCaseModal}
          currentUser={user}
          teamList={team}
          onUpdateStatus={handleUpdateStatus}
          onAssignOfficer={handleAssignOfficer}
          onDeleteCase={handleDeleteCase}
        />
      )}
    </div>
  );
};
