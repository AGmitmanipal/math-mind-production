import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Shield, FileText, Scale } from 'lucide-react';

export const LegalModal: React.FC = () => {
  const { legalModal, closeLegalModal, openLegalModal } = useApp();

  if (!legalModal.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
        {/* Modal Header & Tabs */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <button
              onClick={() => openLegalModal('terms')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                legalModal.tab === 'terms' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Terms of Service
            </button>
            <button
              onClick={() => openLegalModal('privacy')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                legalModal.tab === 'privacy' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Privacy Policy
            </button>
            <button
              onClick={() => openLegalModal('research')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                legalModal.tab === 'research' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Pedagogical Principles
            </button>
          </div>

          <button
            onClick={closeLegalModal}
            className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-xs text-slate-300 leading-relaxed max-h-[70vh] overflow-y-auto space-y-4">
          {legalModal.tab === 'terms' && (
            <>
              <h2 className="text-base font-bold text-slate-100">Terms of Service Template</h2>
              <p className="text-amber-300/90 bg-amber-950/30 border border-amber-800/40 p-2.5 rounded-lg">
                Notice: This is an educational and commercial template for the MathMind platform. It requires legal counsel review prior to commercial consumer deployment in specific jurisdictions.
              </p>
              <h3 className="font-semibold text-slate-200 text-sm">1. Acceptance of Terms</h3>
              <p>
                By accessing MathMind, you agree to these Terms. MathMind is an interactive Socratic mathematics learning environment intended to foster conceptual understanding.
              </p>
              <h3 className="font-semibold text-slate-200 text-sm">2. Educational Disclaimers</h3>
              <p>
                MathMind does not guarantee specific academic grades or test scores. Mathematical verification tools are provided to assist in learning, but users are encouraged to verify calculations independently for mission-critical engineering or research tasks.
              </p>
              <h3 className="font-semibold text-slate-200 text-sm">3. Acceptable Use</h3>
              <p>
                Users agree not to attempt to reverse engineer AI model weights, bypass per-user rate limits, or utilize the service to violate educational integrity codes.
              </p>
            </>
          )}

          {legalModal.tab === 'privacy' && (
            <>
              <h2 className="text-base font-bold text-slate-100">Privacy Policy & Data Protection</h2>
              <h3 className="font-semibold text-slate-200 text-sm">1. Data Minimization</h3>
              <p>
                MathMind collects only the minimal data required to render personalized tutoring: mathematical problem inputs, student response attempts, and concept mastery metrics.
              </p>
              <h3 className="font-semibold text-slate-200 text-sm">2. AI Request Privacy</h3>
              <p>
                Student mathematical queries are processed via secure server-side API proxying. No sensitive payment details or credentials are stored directly.
              </p>
              <h3 className="font-semibold text-slate-200 text-sm">3. Data Deletion Rights</h3>
              <p>
                Users can delete their individual problem history and concept mastery scores at any time from the Session History panel or account settings.
              </p>
            </>
          )}

          {legalModal.tab === 'research' && (
            <>
              <h2 className="text-base font-bold text-slate-100">Pedagogical Framework & Research Foundations</h2>
              <p>
                MathMind is architected upon established cognitive science and mathematics education research principles:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-300">
                <li>
                  <strong className="text-indigo-300">Cognitive Load Theory:</strong> Solutions are partitioned into single conceptual steps with focused questions, preventing information overload.
                </li>
                <li>
                  <strong className="text-indigo-300">Constructivist Knowledge Building:</strong> Students actively manipulate variables on visual balances and Cartesian graphs to observe invariants before formalizing theorems.
                </li>
                <li>
                  <strong className="text-indigo-300">Formative Misconception Diagnosis:</strong> Errors are treated as diagnostic learning opportunities. We isolate specific misunderstandings (e.g., sign transpositions, inverse operation confusions) with targeted follow-up questions.
                </li>
                <li>
                  <strong className="text-indigo-300">Spaced Retrieval Practice:</strong> Prerequisite mastery maps highlight concepts needing review before advancing to higher-order calculus or polynomial analysis.
                </li>
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LegalModal;
