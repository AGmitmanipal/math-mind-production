import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MathView } from './MathView';
import {
  History,
  Trash2,
  Play,
  CheckCircle2,
  Calendar,
  Layers,
  Search,
  ExternalLink
} from 'lucide-react';

export const SessionHistory: React.FC = () => {
  const { savedSessions, deleteSavedSession, resumeSession } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = savedSessions.filter(s =>
    s.originalProblem.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
            <History className="w-3.5 h-3.5" />
            <span>Learning Journey Archive</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Saved Sessions & Problems
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Review past step-by-step reasoning, revisit diagnostic corrections, or resume unfinished problems.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search problems or topics..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Sessions List */}
      {filtered.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
          <History className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="font-semibold text-slate-200 text-base">No saved sessions found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            When you solve or bookmark problems in the Socratic Tutor, your derivations and evidence will be preserved here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((session) => (
            <div
              key={session.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-bold uppercase tracking-wider text-indigo-400">
                    {session.subject}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="font-medium text-slate-300">
                    {session.topic}
                  </span>
                  <span className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded text-[10px] font-mono">
                    {session.difficulty}
                  </span>
                  {session.state === 'completed' && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" /> Completed
                    </span>
                  )}
                </div>

                <div className="text-lg font-bold text-slate-100 font-mono">
                  <MathView math={`$${session.normalizedProblem}$`} />
                </div>

                <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    {new Date(session.createdAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Layers className="w-3 h-3 text-slate-500" />
                    {session.steps.length} conceptual steps
                  </span>
                  {session.finalAnswer && (
                    <span className="text-emerald-400 font-mono">
                      Result: <MathView math={`$${session.finalAnswer}$`} />
                    </span>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => resumeSession(session)}
                  className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors shadow"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Resume & Review</span>
                </button>
                <button
                  onClick={() => deleteSavedSession(session.id)}
                  className="text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 p-2 rounded-xl transition-colors"
                  title="Delete Session"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SessionHistory;
