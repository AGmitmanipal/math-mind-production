import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MATH_CONCEPTS } from '../lib/mathCatalog';
import { SubjectArea, ConceptDefinition } from '../types/math';
import {
  Compass,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Zap,
  Info,
  ChevronRight,
  Filter
} from 'lucide-react';

export const MasteryMap: React.FC = () => {
  const { conceptMastery, setActiveView } = useApp();
  const [selectedSubject, setSelectedSubject] = useState<SubjectArea | 'All'>('All');
  const [selectedConcept, setSelectedConcept] = useState<ConceptDefinition | null>(null);

  const filteredConcepts = selectedSubject === 'All'
    ? MATH_CONCEPTS
    : MATH_CONCEPTS.filter(c => c.subject === selectedSubject);

  const getStatusBadge = (state: string) => {
    switch (state) {
      case 'demonstrated_understanding':
        return {
          label: 'Mastered',
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          dot: 'bg-emerald-400'
        };
      case 'developing':
        return {
          label: 'Developing',
          bg: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
          dot: 'bg-sky-400'
        };
      case 'learning':
        return {
          label: 'Learning',
          bg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
          dot: 'bg-indigo-400'
        };
      case 'needs_review':
        return {
          label: 'Needs Review',
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          dot: 'bg-amber-400'
        };
      default:
        return {
          label: 'Not Assessed',
          bg: 'bg-slate-800 text-slate-400 border-slate-700',
          dot: 'bg-slate-500'
        };
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Knowledge Graph & Prerequisites</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Personalized Concept Mastery Map
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Understanding builds on foundations. We track demonstrated comprehension across prerequisites, not just raw activity.
          </p>
        </div>

        {/* Filter by subject */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400 ml-2" />
          {(['All', 'Algebra', 'Functions', 'Calculus'] as const).map(subj => (
            <button
              key={subj}
              onClick={() => setSelectedSubject(subj)}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                selectedSubject === subj
                  ? 'bg-indigo-600 text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {subj}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Concept Nodes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredConcepts.map((concept) => {
          const mastery = conceptMastery[concept.id] || {
            masteryState: 'not_assessed',
            score: 0,
            confidence: 0,
            evidenceCount: 0,
            lastAssessedAt: '',
            mistakesRecorded: []
          };

          const status = getStatusBadge(mastery.masteryState);
          const hasPrereqs = concept.prerequisites.length > 0;

          return (
            <div
              key={concept.id}
              onClick={() => setSelectedConcept(concept)}
              className="group bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-5 cursor-pointer transition-all hover:shadow-xl hover:-translate-y-0.5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {concept.subject}
                  </span>
                  <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${status.bg}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                    {status.label}
                  </span>
                </div>

                <h3 className="font-bold text-slate-100 text-base group-hover:text-indigo-300 transition-colors">
                  {concept.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {concept.description}
                </p>

                {/* Score Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Demonstrated Mastery</span>
                    <span className="font-mono text-slate-200 font-bold">{mastery.score}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        mastery.score >= 80 ? 'bg-emerald-500' : mastery.score >= 50 ? 'bg-sky-500' : 'bg-indigo-500'
                      }`}
                      style={{ width: `${mastery.score}%` }}
                    />
                  </div>
                </div>

                {/* Prerequisites tags */}
                {hasPrereqs && (
                  <div className="mt-3 flex flex-wrap items-center gap-1">
                    <span className="text-[10px] text-slate-500 font-medium">Prerequisites:</span>
                    {concept.prerequisites.map(pid => {
                      const pDef = MATH_CONCEPTS.find(m => m.id === pid);
                      return (
                        <span key={pid} className="text-[10px] bg-slate-950 text-slate-400 px-1.5 py-0.5 rounded border border-slate-800">
                          {pDef?.name || pid}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Bottom footer evidence */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {mastery.evidenceCount} verified responses
                </span>
                <span className="text-indigo-400 font-medium flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Details <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Drill-down Drawer Modal */}
      {selectedConcept && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400">
                  {selectedConcept.subject} Concept Drill-down
                </span>
                <h3 className="font-extrabold text-slate-100 text-lg">
                  {selectedConcept.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedConcept(null)}
                className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800"
              >
                Close
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs text-slate-300">
              <p className="text-sm leading-relaxed text-slate-200">
                {selectedConcept.description}
              </p>

              {/* Current evidence breakdown */}
              {(() => {
                const mastery = conceptMastery[selectedConcept.id] || {
                  masteryState: 'not_assessed',
                  score: 0,
                  confidence: 0,
                  evidenceCount: 0,
                  lastAssessedAt: '',
                  mistakesRecorded: []
                };
                return (
                  <div className="grid grid-cols-2 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <div>
                      <span className="text-slate-400 block mb-0.5">Mastery Confidence:</span>
                      <span className="text-base font-bold font-mono text-emerald-400">
                        {Math.round((mastery.confidence || 0) * 100)}%
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">Evidence Points:</span>
                      <span className="text-base font-bold font-mono text-sky-400">
                        {mastery.evidenceCount} answers
                      </span>
                    </div>
                  </div>
                );
              })()}

              {/* Common Pitfalls & Misconceptions */}
              <div className="bg-amber-950/20 border border-amber-800/40 p-4 rounded-xl text-amber-200 space-y-2">
                <span className="font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Frequent Conceptual Pitfalls:</span>
                </span>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  {selectedConcept.commonMisconceptions.map((m, idx) => (
                    <li key={idx}>{m}</li>
                  ))}
                </ul>
              </div>

              {/* Prerequisites Tree */}
              <div>
                <span className="font-semibold text-slate-300 block mb-1.5">
                  Direct Prerequisites:
                </span>
                {selectedConcept.prerequisites.length > 0 ? (
                  <div className="space-y-1.5">
                    {selectedConcept.prerequisites.map(pid => {
                      const pDef = MATH_CONCEPTS.find(m => m.id === pid);
                      return (
                        <div key={pid} className="flex items-center justify-between bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                          <span className="text-slate-200 font-medium">{pDef?.name || pid}</span>
                          <span className="text-emerald-400 text-[10px] font-mono">Foundational</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <span className="text-slate-500">None (Fundamental starting concept)</span>
                )}
              </div>

              {/* Action buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  onClick={() => {
                    setSelectedConcept(null);
                    setActiveView('practice');
                  }}
                  className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2 rounded-xl transition-colors shadow"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Practice this Concept</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasteryMap;
