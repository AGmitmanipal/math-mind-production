import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MathView } from './MathView';
import { STARTER_PROBLEMS } from '../lib/mathCatalog';
import {
  Sparkles,
  Send,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sliders,
  Scale,
  ArrowRight,
  Bookmark,
  Share2,
  Split,
  ChevronRight,
  Info,
  Check,
  RefreshCw,
  Zap
} from 'lucide-react';

export const TutorWorkspace: React.FC = () => {
  const {
    currentSession,
    isAnalyzing,
    isEvaluating,
    startNewSession,
    submitStepResponse,
    revealNextHint,
    requestAlternativeExplanation,
    requestWhyValid,
    saveCurrentSession,
    openPlaygroundModal,
    setActiveView
  } = useApp();

  const [inputProblem, setInputProblem] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<'Algebra' | 'Functions' | 'Calculus'>('Algebra');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [studentInput, setStudentInput] = useState('');
  const [activeTabMethod, setActiveTabMethod] = useState<number>(0);
  const [showMethodsModal, setShowMethodsModal] = useState<boolean>(false);
  const [savedSuccessAlert, setSavedSuccessAlert] = useState<boolean>(false);

  const handleStartSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputProblem.trim()) return;
    startNewSession(inputProblem.trim(), selectedSubject, selectedDifficulty);
  };

  const handleAnswerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentInput.trim() || isEvaluating) return;
    submitStepResponse(studentInput.trim(), 'direct_answer');
    setStudentInput('');
  };

  const handleQuickPrompt = (starter: typeof STARTER_PROBLEMS[0]) => {
    setInputProblem(starter.problem);
    setSelectedSubject(starter.subject as any);
    setSelectedDifficulty(starter.difficulty);
    startNewSession(starter.problem, starter.subject, starter.difficulty);
  };

  const handleSave = () => {
    saveCurrentSession();
    setSavedSuccessAlert(true);
    setTimeout(() => setSavedSuccessAlert(false), 2500);
  };

  // If no active session or session analyzing
  if (!currentSession || isAnalyzing) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Intro Banner */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Socratic Interactive AI Tutoring</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            Work through any math problem, <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">
              one conceptual step at a time.
            </span>
          </h1>
          <p className="mt-2 text-slate-400 text-sm max-w-xl mx-auto">
            Instead of copying answers, you explore equations interactively, test your understanding, and discover <em>why</em> each transformation works.
          </p>
        </div>

        {/* Input Box Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
          {isAnalyzing && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center gap-3">
              <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" />
              <p className="text-sm font-semibold text-slate-200">Decomposing problem into Socratic learning steps...</p>
              <span className="text-xs text-slate-400">Performing mathematical verification checks</span>
            </div>
          )}

          <form onSubmit={handleStartSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Enter your equation or problem:
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={inputProblem}
                  onChange={(e) => setInputProblem(e.target.value)}
                  placeholder="e.g. 2x + 5 = 15  or  x^2 - 7x + 10 = 0  or  d/dx(x^2)"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3.5 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 text-base font-mono shadow-inner"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!inputProblem.trim()}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white p-2 rounded-lg transition-colors shadow"
                  title="Begin Guided Session"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Subject and Difficulty Filters */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium">Domain:</span>
                <div className="flex rounded-lg border border-slate-800 bg-slate-950 p-0.5 text-xs">
                  {(['Algebra', 'Functions', 'Calculus'] as const).map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSubject(s)}
                      className={`px-3 py-1 rounded transition-colors ${selectedSubject === s ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium">Level:</span>
                <div className="flex rounded-lg border border-slate-800 bg-slate-950 p-0.5 text-xs">
                  {(['Beginner', 'Intermediate', 'Advanced'] as const).map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setSelectedDifficulty(d)}
                      className={`px-3 py-1 rounded transition-colors ${selectedDifficulty === d ? 'bg-sky-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </form>

          {/* Starter Problems */}
          <div className="mt-8 pt-6 border-t border-slate-800/80">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">
              Or explore an interactive starter concept:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {STARTER_PROBLEMS.map((starter, i) => (
                <div
                  key={i}
                  onClick={() => handleQuickPrompt(starter)}
                  className="group bg-slate-950/60 hover:bg-slate-800/60 border border-slate-800 hover:border-indigo-500/50 rounded-xl p-3.5 cursor-pointer transition-all shadow-sm"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-indigo-400 group-hover:text-indigo-300">
                      {starter.title}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                      {starter.difficulty}
                    </span>
                  </div>
                  <div className="font-mono text-sm font-semibold text-slate-200 my-1">
                    <MathView math={`$${starter.problem}$`} />
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1">
                    {starter.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Active session details
  const currentStep = currentSession.steps[currentSession.currentStepIndex];
  const isCompleted = currentSession.state === 'completed';
  const lastResponse = currentSession.studentResponses[currentSession.studentResponses.length - 1];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Session Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
            #{currentSession.currentStepIndex + 1}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                {currentSession.subject} • {currentSession.topic}
              </span>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                {currentSession.difficulty}
              </span>
            </div>
            <div className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <span className="text-slate-400 text-xs">Problem:</span>
              <MathView math={`$${currentSession.normalizedProblem}$`} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {savedSuccessAlert && (
            <span className="text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-1 rounded">
              Saved to History!
            </span>
          )}
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Save Problem</span>
          </button>
          <button
            onClick={() => startNewSession('', currentSession.subject, currentSession.difficulty)}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700/60 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New</span>
          </button>
        </div>
      </div>

      {/* Step Progress Tracker */}
      <div className="mb-6 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span className="font-semibold uppercase tracking-wider text-slate-300">Conceptual Journey</span>
          <span>Step {Math.min(currentSession.currentStepIndex + 1, currentSession.steps.length)} of {currentSession.steps.length}</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {currentSession.steps.map((step, idx) => {
            const isPast = idx < currentSession.currentStepIndex || step.isCompleted;
            const isCurrent = idx === currentSession.currentStepIndex && !isCompleted;
            return (
              <div
                key={step.stepId}
                className={`flex items-center gap-2 p-2 rounded-lg border text-xs transition-all ${
                  isCurrent
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 font-semibold shadow-sm'
                    : isPast
                    ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-300'
                    : 'bg-slate-950/40 border-slate-800/60 text-slate-500'
                }`}
              >
                {isPast ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 ${isCurrent ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                    {idx + 1}
                  </span>
                )}
                <span className="truncate">{step.title}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Active Step Card or Completed State */}
      {!isCompleted && currentStep ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl mb-6 relative">
          {/* Step Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-800/80">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                Step {currentStep.sequenceNumber}: Conceptual Transformation
              </span>
              <h2 className="text-xl font-extrabold text-slate-100 mt-0.5">
                {currentStep.title}
              </h2>
            </div>

            {/* Interactive Tool Button if step supports playground */}
            <div className="flex items-center gap-2">
              {currentStep.alternativeMethods && currentStep.alternativeMethods.length > 0 && (
                <button
                  onClick={() => setShowMethodsModal(true)}
                  className="flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 bg-sky-500/10 border border-sky-500/30 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Split className="w-3.5 h-3.5" />
                  <span>Compare Methods</span>
                </button>
              )}

              {currentStep.visualization?.type === 'equation_balance' && (
                <button
                  onClick={() => openPlaygroundModal('algebra_balance', 'Algebra Balance Scale', currentStep.visualization?.initialEquation)}
                  className="flex items-center gap-1.5 text-xs text-indigo-300 hover:text-white bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 px-3 py-1.5 rounded-lg transition-all"
                >
                  <Scale className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Interactive Balance Tool</span>
                </button>
              )}

              {currentStep.visualization?.type === 'function_graph' && (
                <button
                  onClick={() => openPlaygroundModal('function_plotter', 'Function Graph Explorer')}
                  className="flex items-center gap-1.5 text-xs text-sky-300 hover:text-white bg-sky-600/30 hover:bg-sky-600/50 border border-sky-500/40 px-3 py-1.5 rounded-lg transition-all"
                >
                  <Sliders className="w-3.5 h-3.5 text-sky-400" />
                  <span>Interactive Parabola Graph</span>
                </button>
              )}
            </div>
          </div>

          {/* Mathematical State */}
          <div className="my-5 bg-slate-950/70 p-4 rounded-xl border border-slate-800 text-center">
            <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block mb-1">
              Current Expression:
            </span>
            <div className="text-2xl font-bold text-indigo-300">
              <MathView math={`$$${currentStep.latexExpression}$$`} block />
            </div>
          </div>

          {/* Concise Socratic Explanation */}
          <div className="text-slate-300 text-sm leading-relaxed mb-4">
            <MathView math={currentStep.explanation} />
          </div>

          {/* Socratic Question Prompt */}
          <div className="bg-indigo-950/40 border border-indigo-500/30 p-4 rounded-xl my-4">
            <div className="flex items-start gap-2.5">
              <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 block mb-1">
                  Tutor's Conceptual Question:
                </span>
                <p className="text-base font-semibold text-slate-100">
                  <MathView math={currentStep.question} />
                </p>
              </div>
            </div>
          </div>

          {/* Last Response Feedback & Misconception Diagnosis Alert */}
          {lastResponse && (
            <div className={`p-4 rounded-xl my-4 border ${
              lastResponse.isCorrect
                ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-200'
                : 'bg-rose-950/30 border-rose-800/50 text-rose-200'
            }`}>
              <div className="flex items-start gap-2.5">
                {lastResponse.isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider block">
                    {lastResponse.isCorrect ? 'Understanding Demonstrated' : 'Misconception Identified'}
                  </span>
                  <p className="text-sm">
                    {lastResponse.evaluationFeedback}
                  </p>

                  {/* Diagnostic Breakdown */}
                  {lastResponse.diagnosis && (
                    <div className="mt-3 pt-3 border-t border-rose-800/40 text-xs text-rose-300 space-y-1 bg-rose-950/40 p-3 rounded-lg">
                      <div className="font-semibold text-slate-100 flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5 text-rose-400" />
                        <span>Diagnostic Gap: {lastResponse.diagnosis.description}</span>
                      </div>
                      <p><strong className="text-rose-200">Why this happens:</strong> {lastResponse.diagnosis.underlyingMisconception}</p>
                      <p><strong className="text-rose-200">Guiding Question:</strong> {lastResponse.diagnosis.targetedQuestion}</p>
                      <p><strong className="text-rose-200">Remedial Tip:</strong> {lastResponse.diagnosis.remedialAdvice}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Progressive Hint Reveal Container */}
          {currentStep.revealedHintsCount > 0 && currentStep.hints && (
            <div className="space-y-2 my-4">
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Hints ({currentStep.revealedHintsCount} of {currentStep.hints.length}):</span>
              </span>
              {currentStep.hints.slice(0, currentStep.revealedHintsCount).map((hint, i) => (
                <div key={i} className="text-xs bg-amber-950/20 border border-amber-800/40 text-amber-200 p-3 rounded-lg">
                  <span className="font-bold text-amber-400 mr-1.5">Hint {i + 1}:</span>
                  <MathView math={hint} />
                </div>
              ))}
            </div>
          )}

          {/* Student Response Input Form */}
          <form onSubmit={handleAnswerSubmit} className="mt-5 pt-4 border-t border-slate-800">
            <div className="flex gap-2">
              <input
                type="text"
                value={studentInput}
                onChange={(e) => setStudentInput(e.target.value)}
                placeholder="Type your answer or reasoning (e.g. 'subtract 5', 'x = 5')..."
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 font-mono shadow-inner"
              />
              <button
                type="submit"
                disabled={!studentInput.trim() || isEvaluating}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium text-xs px-4 py-2.5 rounded-xl transition-all shadow flex items-center gap-1.5"
              >
                {isEvaluating ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Submit</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Secondary Action Buttons (Adaptive Controls) */}
          <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-800/60 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => submitStepResponse('I understand this step completely.', 'understood')}
                disabled={isEvaluating}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                <span>I Understand</span>
              </button>

              <button
                onClick={requestAlternativeExplanation}
                disabled={isEvaluating}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
              >
                <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
                <span>Explain Differently</span>
              </button>

              <button
                onClick={requestWhyValid}
                disabled={isEvaluating}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
              >
                <Info className="w-3.5 h-3.5 text-sky-400" />
                <span>Why is this valid?</span>
              </button>
            </div>

            {/* Hint Button */}
            {currentStep.hints && currentStep.revealedHintsCount < currentStep.hints.length && (
              <button
                onClick={revealNextHint}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-colors font-medium"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>
                  {currentStep.revealedHintsCount === 0 ? 'Need a Hint?' : 'Next Level Hint'}
                </span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Completed State */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl text-slate-100 mb-6">
          <div className="text-center max-w-xl mx-auto mb-8">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center mb-3 shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
              Problem Solved & Demonstrated!
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              You worked through each transformation conceptually. Here is your verified mathematical summary:
            </p>
          </div>

          {/* Final Verified Answer Box */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center mb-6">
            <span className="text-xs uppercase tracking-wider font-bold text-slate-400 block mb-1">
              Final Verified Answer:
            </span>
            <div className="text-3xl font-extrabold text-emerald-400 font-mono">
              <MathView math={`$${currentSession.finalAnswer || 'Verified Solution'}$`} />
            </div>
            <p className="text-slate-300 text-sm max-w-md mx-auto mt-3">
              {currentSession.finalSummary}
            </p>
          </div>

          {/* Common Mistakes Summary */}
          {currentSession.commonMistakesSummary && currentSession.commonMistakesSummary.length > 0 && (
            <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 mb-6">
              <h4 className="text-xs font-semibold text-rose-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Key Misconceptions Avoided:</span>
              </h4>
              <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
                {currentSession.commonMistakesSummary.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Next Steps CTA Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-800">
            <button
              onClick={() => setActiveView('practice')}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white font-semibold text-xs py-3 px-4 rounded-xl shadow transition-all"
            >
              <Zap className="w-4 h-4" />
              <span>Practice Similar Problem</span>
            </button>

            <button
              onClick={() => setActiveView('mastery')}
              className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs py-3 px-4 rounded-xl border border-slate-700 transition-all"
            >
              <span>View Updated Mastery Map</span>
            </button>

            <button
              onClick={() => startNewSession('', currentSession.subject, currentSession.difficulty)}
              className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs py-3 px-4 rounded-xl border border-slate-700 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Solve Another Problem</span>
            </button>
          </div>
        </div>
      )}

      {/* Compare Methods Modal */}
      {showMethodsModal && currentStep?.alternativeMethods && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/50">
              <h3 className="font-semibold text-slate-100 text-sm flex items-center gap-2">
                <Split className="w-4 h-4 text-sky-400" />
                <span>Compare Alternative Solution Methods</span>
              </h3>
              <button
                onClick={() => setShowMethodsModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800"
              >
                Close
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800 text-xs">
                {currentStep.alternativeMethods.map((m, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTabMethod(idx)}
                    className={`flex-1 py-1.5 rounded font-medium transition-colors ${
                      activeTabMethod === idx ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {m.name}
                  </button>
                ))}
              </div>

              {currentStep.alternativeMethods[activeTabMethod] && (
                <div className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-xs">
                  <p className="text-slate-300 font-medium">
                    {currentStep.alternativeMethods[activeTabMethod].description}
                  </p>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="bg-emerald-950/30 border border-emerald-800/40 p-2.5 rounded-lg text-emerald-300">
                      <strong className="block text-emerald-400 font-bold mb-1">Advantages:</strong>
                      {currentStep.alternativeMethods[activeTabMethod].pros}
                    </div>
                    <div className="bg-amber-950/30 border border-amber-800/40 p-2.5 rounded-lg text-amber-300">
                      <strong className="block text-amber-400 font-bold mb-1">Trade-offs:</strong>
                      {currentStep.alternativeMethods[activeTabMethod].cons}
                    </div>
                  </div>

                  <div className="mt-3">
                    <strong className="block text-slate-400 mb-1">Method Step Summary:</strong>
                    <ol className="list-decimal list-inside space-y-1 font-mono text-slate-200">
                      {currentStep.alternativeMethods[activeTabMethod].stepsSummary.map((s, si) => (
                        <li key={si}><MathView math={s} /></li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TutorWorkspace;
