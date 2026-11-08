import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  ShieldCheck,
  ShieldAlert,
  Trash2,
  Phone,
  BadgeCheck,
  UserCheck,
  AlertTriangle,
  Lock,
} from 'lucide-react';
import { TeamMember, UserSession } from '../types';

interface DirectorTeamManagerProps {
  currentUser: UserSession;
  team: TeamMember[];
  onAddMember: (newMember: Partial<TeamMember>) => Promise<void>;
  onToggleStatus: (id: string, currentStatus: 'active' | 'suspended') => Promise<void>;
  onRemoveMember: (id: string) => Promise<void>;
}

export const DirectorTeamManager: React.FC<DirectorTeamManagerProps> = ({
  currentUser,
  team,
  onAddMember,
  onToggleStatus,
  onRemoveMember,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [rank, setRank] = useState('ڕائید');
  const [username, setUsername] = useState('');
  const [department, setDepartment] = useState('بەشی لێکۆڵینەوە لە هەڕەشە و هاککردن');
  const [phone, setPhone] = useState('+964 750 ');
  const [userRole, setUserRole] = useState<'admin' | 'director'>('admin');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDirector = currentUser.role === 'director';

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !username.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddMember({
        name,
        rank,
        username,
        department,
        phone,
        role: userRole,
      });
      setName('');
      setUsername('');
      setIsAdding(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-amber-950/60 border border-amber-500/40 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-black text-amber-300 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <span>دەسەڵاتداریەتی بەڕێوبەری گشتی بەسەر ئەندام و ئەدمینەکان</span>
          </h3>
          <p className="text-xs text-slate-300 mt-0.5">
            بەڕێوبەری گشتی خاوەنی باڵاترین دەسەڵاتی کارگێڕی، چاودێری و دیاریکردنی پلەی ئەفسەران و ئەدمینەکانە.
          </p>
        </div>

        {isDirector && (
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>{isAdding ? 'داخستنی فۆڕم' : 'زیادکردنی ئەفسەر / ئەدمینی نوێ'}</span>
          </button>
        )}
      </div>

      {/* Add New Officer Form (Director only) */}
      {isAdding && isDirector && (
        <form
          onSubmit={handleCreate}
          className="p-5 rounded-xl bg-slate-900 border-2 border-amber-500/40 space-y-4 animate-slideDown"
        >
          <div className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-amber-400" />
            <span>زیادکردنی ئەفسەری نوێ بۆ دەستەی لێکۆڵینەوە</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">ناوی تەواوی ئەفسەر:</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="بۆ نموونە: نەقیب هەڵمەت سامان"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">پلەی سەربازی:</label>
              <select
                value={rank}
                onChange={(e) => setRank(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="عەمید">عەمید</option>
                <option value="عەقید">عەقید</option>
                <option value="موقەدەم">موقەدەم</option>
                <option value="ڕائید">ڕائید</option>
                <option value="نەقیب">نەقیب</option>
                <option value="ملازم">ملازم</option>
                <option value="پسپۆڕی تەکنیکی">پسپۆڕی تەکنیکی دیجیتاڵی</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">دەسەڵات / ڕۆڵ:</label>
              <select
                value={userRole}
                onChange={(e) => setUserRole(e.target.value as 'admin' | 'director')}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="admin">ئەدمین / ئەفسەری لێکۆڵینەوە</option>
                <option value="director">بەڕێوبەری گشتی</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">ناوی بەکارهێنەر (Username):</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="officer_sam"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500 font-mono text-left dir-ltr"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">بەش و تاقیگە:</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">ژمارەی پەیوەندی:</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500 text-left dir-ltr"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-lg bg-slate-800 text-xs text-slate-300 hover:bg-slate-700 transition-colors"
            >
              پاشگەزبوونەوە
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-md transition-colors"
            >
              {isSubmitting ? 'تۆمار دەکرێت...' : 'پەسەندکردنی فەرمانی دامەزراندن'}
            </button>
          </div>
        </form>
      )}

      {/* Team Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden shadow-lg">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="text-xs font-bold text-slate-300">
            لیستی ئەفسەران و ئەدمینە ڕێگەپێدراوەکان ({team.length} کەس):
          </div>
          <span className="text-[11px] text-emerald-400 font-medium">
            تەواوی ستاف دەستنیشانکراون بۆ هێڵی گەرم
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3 font-bold">ئەفسەر و ناو</th>
                <th className="p-3 font-bold">پلە و ڕۆڵ</th>
                <th className="p-3 font-bold">باجی سەربازی</th>
                <th className="p-3 font-bold">بەشی کارکردن</th>
                <th className="p-3 font-bold">دۆسیە چالاکەکان</th>
                <th className="p-3 font-bold">دۆخ</th>
                {isDirector && <th className="p-3 font-bold text-center">دەسەڵاتی بەڕێوبەر</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {team.map((member) => (
                <tr key={member.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3">
                    <div className="font-bold text-slate-100">{member.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      @{member.username} • {member.phone}
                    </div>
                  </td>

                  <td className="p-3">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                        member.role === 'director'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                      }`}
                    >
                      {member.rank} • {member.role === 'director' ? 'بەڕێوبەر' : 'ئەدمین'}
                    </span>
                  </td>

                  <td className="p-3 font-mono text-slate-300">{member.badgeNumber}</td>

                  <td className="p-3 text-slate-300">{member.department}</td>

                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-700 font-bold text-amber-400">
                      {member.activeCasesCount} کەیس
                    </span>
                  </td>

                  <td className="p-3">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                        member.status === 'active' ? 'text-emerald-400' : 'text-red-400'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          member.status === 'active' ? 'bg-emerald-400' : 'bg-red-400'
                        }`}
                      />
                      {member.status === 'active' ? 'چالاکە' : 'ڕاگیراوە'}
                    </span>
                  </td>

                  {isDirector && (
                    <td className="p-3 text-center">
                      {member.username === 'teamnaheshtntawan' && member.role === 'director' ? (
                        <span className="text-[10px] text-amber-400 font-bold">بەڕێوبەری باڵا</span>
                      ) : (
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => onToggleStatus(member.id, member.status)}
                            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors border ${
                              member.status === 'active'
                                ? 'bg-amber-950/40 text-amber-300 border-amber-500/40 hover:bg-amber-900/60'
                                : 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900/60'
                            }`}
                          >
                            {member.status === 'active' ? 'ڕاگرتن' : 'چالاککردن'}
                          </button>

                          <button
                            onClick={() => {
                              if (window.confirm(`ئایا دڵنیایت لە لادانی ${member.name} لە تیمەکە؟`)) {
                                onRemoveMember(member.id);
                              }
                            }}
                            className="p-1 text-slate-400 hover:text-red-400 hover:bg-red-950/40 rounded transition-colors"
                            title="سڕینەوەی ئەفسەر لە تیم"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
