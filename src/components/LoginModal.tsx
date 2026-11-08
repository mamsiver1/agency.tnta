import React, { useState } from 'react';
import { X, Lock, Shield, KeyRound, AlertCircle, CheckCircle2, UserCheck } from 'lucide-react';
import { LOGO_PATH } from '../constants/theme';
import { UserSession } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (session: UserSession) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [username, setUsername] = useState('teamnaheshtntawan');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
        }),
      });

      const data = await res.json();
      if (data.success && data.user) {
        onLoginSuccess(data.user);
        onClose();
      } else {
        setErrorMsg(data.message || 'ناوی بەکارهێنەر یان وشەی تێپەڕ نادروستە.');
      }
    } catch (err) {
      setErrorMsg('هەڵەی پەیوەندی لەگەڵ سێرڤەر. دووبارە هەوڵبدەرەوە.');
    } finally {
      setIsLoading(false);
    }
  };

  const autofillDirector = () => {
    setUsername('teamnaheshtntawan');
    setPassword('hama1234$');
  };

  const autofillAdmin = () => {
    setUsername('teamnaheshtntawan');
    setPassword('team12%');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-slate-900 border-2 border-amber-500/50 rounded-2xl shadow-2xl shadow-black text-slate-100 overflow-hidden animate-scaleIn">
        {/* Top header */}
        <div className="p-6 text-center bg-gradient-to-b from-amber-950/80 via-slate-900 to-slate-900 border-b border-amber-500/30 relative">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <img
            src={LOGO_PATH}
            alt="لۆگۆی فەرمی"
            className="w-20 h-20 mx-auto object-contain rounded-full border-2 border-amber-500/60 shadow-xl mb-3"
          />
          <h2 className="text-lg font-black text-slate-100">
            دەروازەی ستاف و لێکۆڵەرانی تاوانە ئەلیکترۆنییەکان
          </h2>
          <p className="text-xs text-amber-300 font-medium mt-1">
            چوونەژوورەوەی تایبەت بە بەڕێوبەر و ئەدمین
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/50 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Quick preset buttons for convenience */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-[11px] font-bold text-slate-400">
              دیاریکردنی خێرای هەژماری دەستنیشانکراو:
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={autofillDirector}
                className="p-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold text-center transition-colors"
              >
                بەڕێوبەری تیم (سیڤەر ئایتی)
              </button>
              <button
                type="button"
                onClick={autofillAdmin}
                className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/40 text-blue-300 text-xs font-bold text-center transition-colors"
              >
                ئەدمین / ئەفسەر
              </button>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                ناوی بەکارهێنەر (Username):
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-amber-500 text-left dir-ltr"
                />
                <UserCheck className="absolute top-2.5 right-3 w-4 h-4 text-slate-500" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                وشەی تێپەڕ (Password):
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-amber-500 text-left dir-ltr"
                />
                <KeyRound className="absolute top-2.5 right-3 w-4 h-4 text-slate-500" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-black text-sm shadow-lg shadow-amber-950/40 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>{isLoading ? 'پشتڕاست دەکرێتەوە...' : 'چوونەژوورەوەی پارێزراو'}</span>
            </button>
          </form>

          <div className="text-[11px] text-slate-500 text-center space-y-1">
            <div>• بەڕێوبەر دەسەڵاتی تەواوی بەسەر سەرجەم ئەدمین و ئەندامەکان هەیە.</div>
            <div>• بەکارهێنانی ئەم بەشە تەنها بۆ ئەندامانی ڕێگەپێدراوە.</div>
          </div>
        </div>
      </div>
    </div>
  );
};
