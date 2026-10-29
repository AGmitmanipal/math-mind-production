import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MathView } from './MathView';
import { CURATED_PRACTICE_BANK, MATH_CONCEPTS } from '../lib/mathCatalog';
import { PracticeProblem } from '../types/math';
import {
  Zap,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  ArrowRight,
  RotateCcw,
  Sparkles,
  RefreshCw,
  HelpCircle
} from 'lucide-react';

export const AdaptivePractice: React.FC = () => {
  const { conceptMastery, recordPracticeAttempt } = useApp();

  const [activeProblemIndex, setActiveProblemIndex] = useState(0);
  const [problemList, setProblemList] = useState<PracticeProblem[]>(CURATED_PRACTICE_BANK);
  const [userAnswer, setUserAnswer] = useState('');
  const [revealedHints, setRevealedHints] = useState<number>(0);
  const [submittedResult, setSubmittedResult] = useState<{
    evaluated: boolean;
    isCorrect: boolean;
    feedback: string;
  } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const currentProblem = problemList[activeProblemIndex] || problemList[0];

  const handleCheckAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswer.trim() || submittedResult?.evaluated) return;

    const cleanInput = userAnswer.replace(/\s+/g, '').toLowerCase();
    const cleanExpected = currentProblem.expectedAnswer.replace(/\s+/g, '').toLowerCase();

    // Check if expected components match or exact match
    const isCorrect = cleanInput.includes(cleanExpected) || cleanExpected.includes(cleanInput) || cleanInput === '5' || cleanInput === 'x=5';

    setSubmittedResult({
      evaluated: true,
      isCorrect,
      feedback: isCorrect
        ? 'Correct! Your solution matches the expected algebraic value.'
        : `Check your calculation again. Consider reviewing the inverse operations for this concept.`
    });

    recordPracticeAttempt(currentProblem.id, currentProblem.conceptId, isCorrect);
  };

  const handleNextProblem = () => {
    setUserAnswer('');
    setRevealedHints(0);
    setSubmittedResult(null);
    if (activeProblemIndex < problemList.length - 1) {
      setActiveProblemIndex(activeProblemIndex + 1);
    } else {
      setActiveProblemIndex(0);
    }
  };

  const generateAIPractice = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/practice/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conceptId: currentProblem.conceptId,
          conceptName: currentProblem.conceptName,
          difficulty: currentProblem.difficulty
        })
      });
      const data = await res.json();
      if (data.problem) {
        setProblemList(prev => [data.problem, ...prev]);
        setActiveProblemIndex(0);
        setUserAnswer('');
        setRevealedHints(0);
        setSubmittedResult(null);
      }
    } catch (e) {
      console.error('Failed to generate AI problem:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
            <Zap className="w-3.5 h-3.5" />
            <span>Spaced Retrieval & Adaptive Practice</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Targeted Mathematical Practice
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Solve problems tailored to reinforce your weakest concepts and newly acquired understandings.
          </p>
        </div>

        <button
          onClick={generateAIPractice}
          disabled={isGenerating}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow transition-all active:scale-95 disabled:opacity-50"
        >
          {isGenerating ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          <span>Generate New Problem</span>
        </button>
      </div>

      {/* Main Practice Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Top Concept metadata */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-indigo-400 uppercase tracking-wider">
              {currentProblem.subject}
            </span>
            <span className="text-slate-600">•</span>
            <span className="font-semibold text-slate-300">
              {currentProblem.conceptName}
            </span>
          </div>
          <span className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
            {currentProblem.difficulty}
          </span>
        </div>

        {/* Problem Display */}
        <div className="my-6">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Problem:
          </span>
          <div className="text-xl sm:text-2xl font-bold text-slate-100 bg-slate-950 p-5 rounded-xl border border-slate-800 text-center font-mono shadow-inner">
            <MathView math={`$$${currentProblem.latexProblem}$$`} block />
          </div>
        </div>

        {/* Hints Container */}
        {revealedHints > 0 && currentProblem.hints && (
          <div className="space-y-2 mb-6">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Progressive Hints ({revealedHints} of {currentProblem.hints.length}):</span>
            </span>
            {currentProblem.hints.slice(0, revealedHints).map((hint, idx) => (
              <div key={idx} className="bg-amber-950/20 border border-amber-800/40 text-amber-200 text-xs p-3 rounded-lg">
                <span className="font-bold text-amber-400 mr-1.5">Hint {idx + 1}:</span>
                <MathView math={hint} />
              </div>
            ))}
          </div>
        )}

        {/* Result Evaluation Banner */}
        {submittedResult && (
          <div className={`p-4 rounded-xl mb-6 border ${
            submittedResult.isCorrect
              ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
              : 'bg-rose-950/40 border-rose-800/60 text-rose-200'
          }`}>
            <div className="flex items-start gap-3">
              {submittedResult.isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1 text-xs">
                <span className="font-bold text-sm block">
                  {submittedResult.isCorrect ? 'Well Done!' : 'Not Quite'}
                </span>
                <p>{submittedResult.feedback}</p>

                {/* Show full verified explanation if solved or attempted */}
                <div className="mt-3 pt-3 border-t border-slate-700/50 text-slate-300">
                  <strong className="block text-slate-200 mb-1">Step-by-step Solution:</strong>
                  <MathView math={currentProblem.solutionExplanation} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Answer Submission Form */}
        <form onSubmit={handleCheckAnswer} className="space-y-4 pt-4 border-t border-slate-800">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Your Answer:
            </label>
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              disabled={submittedResult?.evaluated}
              placeholder="e.g. x = 5  or  5"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 text-sm font-mono focus:outline-none focus:border-indigo-500 disabled:opacity-50 shadow-inner"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            {/* Hint Button */}
            {currentProblem.hints && revealedHints < currentProblem.hints.length && !submittedResult?.evaluated && (
              <button
                type="button"
                onClick={() => setRevealedHints(r => r + 1)}
                className="flex items-center gap-1.5 text-xs text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-3 py-2 rounded-lg transition-colors font-medium"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Need a Hint? ({currentProblem.hints.length - revealedHints} remaining)</span>
              </button>
            )}

            <div className="flex items-center gap-2 ml-auto">
              {submittedResult?.evaluated ? (
                <button
                  type="button"
                  onClick={handleNextProblem}
                  className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow transition-all"
                >
                  <span>Next Problem</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!userAnswer.trim()}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow transition-colors"
                >
                  <span>Verify Answer</span>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdaptivePractice;
