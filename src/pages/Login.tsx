import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lock, Mail } from 'lucide-react';

interface LoginProps {
  onNavigate: (page: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onNavigate }) => {
  const { login } = useApp();
  const [email, setEmail] = useState('alex.rivera@assetex.io');
  const [password, setPassword] = useState('••••••••••••');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
    onNavigate('dashboard');
  };

  const handleQuickDemoLogin = () => {
    login('alex.rivera@assetex.io');
    onNavigate('dashboard');
  };

  return (
    <div className="max-w-md mx-auto py-16 px-4 sm:px-6 space-y-8 animate-in fade-in duration-300">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3.5 mb-3">
          <img src="/icon.png" alt="ASSETEX Logo" className="h-12 w-auto object-contain" />
          <span className="font-outfit text-3xl font-black tracking-tight text-slate-900">
            ASSETEX
          </span>
        </div>
        <h1 className="text-3xl font-black text-slate-900">Welcome back to Assetex</h1>
        <p className="text-sm text-slate-600">
          Log in to your unified account to manage rentals and listings.
        </p>
      </div>

      {/* Quick Demo Login Callout */}
      <div className="bg-slate-50 border border-slate-200 border-b-2 border-b-slate-300 rounded-2xl p-5 space-y-3 text-left shadow-card">
        <div className="text-slate-900 font-extrabold text-sm">
          Prototype Demo Access
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Want to test the full lifecycle right away? Log in as our pre-seeded user <strong>Alex Rivera</strong> to inspect active listings and approve incoming booking requests!
        </p>
        <button
          onClick={handleQuickDemoLogin}
          className="btn-primary w-full py-2.5 text-xs"
        >
          1-Click Demo Login (Alex Rivera) →
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-slate-200 border-b-2 border-b-slate-300 shadow-elevated space-y-5">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition-all shadow-sm"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition-all shadow-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn-primary w-full py-3.5 text-base bg-slate-800 hover:bg-slate-900 text-white font-bold shadow-sm border border-slate-700"
        >
          Log In
        </button>

        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-xs text-slate-600">
            Don't have an account yet?{' '}
            <button
              type="button"
              onClick={() => onNavigate('signup')}
              className="font-bold text-blue-600 hover:text-blue-700 underline ml-1"
            >
              Sign Up Free
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};
