import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Compass,
  Sparkles,
  BookOpen,
  History,
  ShieldCheck,
  CreditCard,
  PlusCircle,
  Flame,
  Zap,
  Sliders
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { activeView, setActiveView, user, currentSession } = useApp();

  const navItems = [
    { id: 'landing', label: 'Overview', icon: BookOpen },
    { id: 'tutor', label: 'Tutor Workspace', icon: Sparkles, hasActive: !!currentSession && currentSession.state !== 'completed' },
    { id: 'playground', label: 'Playground', icon: Sliders },
    { id: 'mastery', label: 'Mastery Map', icon: Compass },
    { id: 'practice', label: 'Practice', icon: Zap },
    { id: 'history', label: 'History', icon: History },
    { id: 'pricing', label: 'Plans', icon: CreditCard },
    { id: 'admin', label: 'Admin', icon: ShieldCheck }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => setActiveView('landing')}
          className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-sky-500 to-indigo-400 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <span className="font-mono font-extrabold text-transparent bg-clip-text bg-gradient-to-tr from-sky-400 to-indigo-300 text-lg">
                ∫x
              </span>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-slate-100 tracking-tight text-lg">MathMind</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Socratic AI
              </span>
            </div>
            <span className="text-[10px] text-slate-400 hidden sm:inline -mt-0.5">
              Reasoning & Intuition Platform
            </span>
          </div>
        </div>

        {/* Center Nav tabs */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800/60">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id as any)}
                className={`relative flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.hasActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right side stats & CTA */}
        <div className="flex items-center gap-3">
          {/* Streak indicator */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg" title="Consecutive learning days">
            <Flame className="w-3.5 h-3.5 fill-amber-400" />
            <span className="font-bold">{user.streakDays}d Streak</span>
          </div>

          {/* Usage badge */}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-300 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg">
            <span className="text-[10px] uppercase font-bold text-slate-400">{user.tier}</span>
            <span className="text-slate-500">•</span>
            <span className="font-mono text-slate-200">{user.monthlyAiRequestsUsed}/{user.monthlyAiRequestsLimit}</span>
          </div>

          {/* New Problem Action */}
          <button
            onClick={() => setActiveView('tutor')}
            className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-md transition-all active:scale-95"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Problem</span>
          </button>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="lg:hidden flex items-center justify-around border-t border-slate-800/80 bg-slate-950/95 py-2 px-1 overflow-x-auto text-[11px]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as any)}
              className={`flex flex-col items-center gap-1 px-2 py-1 rounded transition-colors whitespace-nowrap ${
                isActive ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};

export default Navbar;
