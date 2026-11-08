import React, { useEffect, useState } from 'react';
import {
  Mail,
  ShieldCheck,
  Lock,
  CheckCircle2,
  Clock,
  RefreshCw,
  ExternalLink,
  AlertCircle,
} from 'lucide-react';
import { EmailDispatchRecord, UserSession } from '../types';

interface EmailDispatchVaultProps {
  currentUser: UserSession;
}

export const EmailDispatchVault: React.FC<EmailDispatchVaultProps> = ({ currentUser }) => {
  const [logs, setLogs] = useState<EmailDispatchRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [notice, setNotice] = useState('');

  const fetchLogs = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/admin/dispatch-logs', {
        headers: {
          'x-user-role': currentUser.role,
        },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.logs)) {
        setLogs(data.logs);
        setNotice(data.notice || '');
      } else {
        setErrorMsg(data.message || 'ناتوانرێت تۆماری ئیمێڵەکان بهێنرێت.');
      }
    } catch (err) {
      setErrorMsg('هەڵە لە هێنانی تۆمارەکان.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-emerald-950/60 border border-emerald-500/40 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-black text-emerald-300 flex items-center gap-2">
              <span>تۆماری گەیاندنی پارێزراو بۆ ئیمێڵی فەرمی ناوەند</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              سەرجەم کەیسەکان، چاتە کتوپڕەکان و ئاگادارییەکان بە نهێنی و لە ڕێگەی سێرڤەرەوە دەگەنە ئیمێڵی سەرەکی دەستنیشانکراو.
            </p>
          </div>
        </div>

        <button
          onClick={fetchLogs}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>نوێکردنەوەی تۆمارەکان</span>
        </button>
      </div>

      {notice && (
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2 text-xs text-slate-300">
          <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/50 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Logs Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden shadow-lg">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="text-xs font-bold text-slate-300">
            تۆماری دۆسیە نێردراوەکان ({logs.length} نێردراو):
          </div>
          <span className="text-[11px] text-emerald-400 font-mono">
            SSL-ENCRYPTED DIRECT DISPATCH
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3 font-bold">بابەتی نامە و دۆسیە</th>
                <th className="p-3 font-bold">کۆدی بەدواداچوون</th>
                <th className="p-3 font-bold">جۆری تاوان</th>
                <th className="p-3 font-bold">ئاستی کتوپڕی</th>
                <th className="p-3 font-bold">کات و ڕێکەوت</th>
                <th className="p-3 font-bold">دۆخی گەیاندن</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-semibold text-slate-200">
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{log.subject}</span>
                    </div>
                  </td>

                  <td className="p-3 font-mono text-amber-400 font-bold">
                    {log.trackingCode}
                  </td>

                  <td className="p-3 text-slate-300">{log.category}</td>

                  <td className="p-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.urgency === 'critical'
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {log.urgency === 'critical' ? '🔴 کتوپڕ' : '🟡 ئاسایی'}
                    </span>
                  </td>

                  <td className="p-3 font-mono text-slate-400 text-[11px]">
                    {new Date(log.timestamp).toLocaleString('ar-IQ')}
                  </td>

                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>بە سەرکەوتوویی گەیشت</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
