import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Wrench, User, Mail, Phone, Lock, MapPin, CheckCircle2 } from 'lucide-react';

interface SignUpProps {
  onNavigate: (page: string) => void;
}

export const SignUp: React.FC<SignUpProps> = ({ onNavigate }) => {
  const { signup } = useApp();
  const [name, setName] = useState('Taylor Brooks');
  const [email, setEmail] = useState('taylor.brooks@example.com');
  const [phone, setPhone] = useState('+1 (512) 555-0188');
  const [password, setPassword] = useState('••••••••••••');
  const [city, setCity] = useState('Austin, TX — South Congress');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signup(name, email, phone, password, city);
    onNavigate('dashboard');
  };

  return (
    <div className="max-w-md mx-auto py-14 px-4 sm:px-6 space-y-6 animate-in fade-in duration-300">
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto shadow-sm mb-3">
          <Wrench className="w-7 h-7 -rotate-12" />
        </div>
        <h1 className="text-3xl font-black text-slate-900">Create your unified account</h1>
        <p className="text-sm text-slate-600">
          One account lets you both borrow tools nearby and list your own to earn.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-slate-200 border-b-2 border-b-slate-300 shadow-elevated space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">Full Name</label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-navy-900 focus:bg-white focus:border-brand-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-navy-800 uppercase tracking-wider block">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-navy-900 focus:bg-white focus:border-brand-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-navy-800 uppercase tracking-wider block">Phone Number</label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-navy-900 focus:bg-white focus:border-brand-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-navy-800 uppercase tracking-wider block">City / Neighborhood</label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-navy-900 focus:bg-white focus:border-brand-500 focus:outline-none cursor-pointer"
            >
              <option value="Austin, TX — South Congress">Austin, TX — South Congress</option>
              <option value="Austin, TX — Eastside">Austin, TX — Eastside</option>
              <option value="Austin, TX — North Loop">Austin, TX — North Loop</option>
              <option value="Austin, TX — Hyde Park">Austin, TX — Hyde Park</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-navy-800 uppercase tracking-wider block">Create Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-navy-900 focus:bg-white focus:border-brand-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-navy-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            No separate account types needed
          </div>
          <p className="text-[11px] pl-5">You can immediately browse and rent tools, or list your own anytime.</p>
        </div>

        <button
          type="submit"
          className="btn-primary w-full py-3.5 text-base mt-2"
        >
          Create Account & Start Sharing →
        </button>

        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-xs text-slate-600">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="font-bold text-blue-600 hover:text-blue-700 underline ml-1"
            >
              Log In
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};
