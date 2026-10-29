import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MathView } from './MathView';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Scale,
  Sliders,
  Activity,
  Compass,
  Zap,
  HelpCircle,
  Lightbulb,
  Check,
  Play,
  RotateCcw,
  BookOpen,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setActiveView, startNewSession, openPlaygroundModal, openLegalModal } = useApp();

  // Interactive Hero Demo State
  const [heroStep, setHeroStep] = useState<number>(0);
  const [heroInput, setHeroInput] = useState<string>('');
  const [heroFeedback, setHeroFeedback] = useState<string | null>(null);
  const [heroRevealedHint, setHeroRevealedHint] = useState<boolean>(false);

  const heroSteps = [
    {
      title: 'Step 1: Isolate the Variable Term',
      latex: '2x + 5 = 15',
      explanation: 'We want to simplify the left side so that the variable term 2x becomes isolated. What operation cancels the +5?',
      question: 'What operation cancels adding 5 to both sides?',
      validKeywords: ['subtract', 'minus', '-5', 'sub'],
      correctFeedback: 'Spot on! Subtracting 5 from both sides maintains equality: 2x = 10.',
      hint: 'The opposite of addition is subtraction. Try subtracting 5 from both sides!'
    },
    {
      title: 'Step 2: Isolate the Variable x',
      latex: '2x = 10',
      explanation: 'The coefficient 2 is multiplying x. To undo multiplication, apply division by 2 to both sides.',
      question: 'What is the value of x after dividing 10 by 2?',
      validKeywords: ['5', 'x=5', 'x = 5'],
      correctFeedback: 'Correct! x = 5. You have solved the linear equation through inverse operations!',
      hint: 'Divide 10 by 2 to get the isolated value of x.'
    }
  ];

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroInput.trim()) return;

    const current = heroSteps[heroStep];
    const userText = heroInput.toLowerCase();
    const isMatch = current.validKeywords.some(k => userText.includes(k));

    if (isMatch) {
      setHeroFeedback(current.correctFeedback);
      setTimeout(() => {
        if (heroStep < heroSteps.length - 1) {
          setHeroStep(heroStep + 1);
          setHeroInput('');
          setHeroFeedback(null);
          setHeroRevealedHint(false);
        }
      }, 1500);
    } else {
      setHeroFeedback('Let us think: to undo addition, what is the inverse operation? (Hint: try subtraction)');
    }
  };

  const handleHeroReset = () => {
    setHeroStep(0);
    setHeroInput('');
    setHeroFeedback(null);
    setHeroRevealedHint(false);
  };

  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: 'How is MathMind different from standard AI chatbots?',
      a: 'Generic chatbots simply generate long answers or steps all at once, which encourages passive memorization. MathMind is a dedicated Socratic tutoring environment: it guides you one conceptual step at a time, tests your understanding with focused questions, provides interactive physical balances and function sliders, and diagnoses specific mathematical misconceptions.'
    },
    {
      q: 'Does MathMind verify calculations deterministically?',
      a: 'Yes! MathMind combines modern Gemini reasoning with deterministic mathematical verification engines. It evaluates algebraic balance equivalence, verifies polynomial roots via substitution, and checks calculus derivatives analytically rather than blindly trusting raw model text.'
    },
    {
      q: 'Can I use MathMind on both desktop and mobile devices?',
      a: 'Absolutely. The interface is fully responsive, featuring touch-friendly interactive sliders, scalable KaTeX typography, and a collapsible workspace.'
    },
    {
      q: 'How does the Concept Mastery Map work?',
      a: 'Rather than counting hours spent on the app, the mastery map measures verified student responses across prerequisite concept nodes (such as linear balance, factoring, function transformations, and derivatives). Concepts are categorized from "Not Assessed" to "Demonstrated Understanding" with transparent evidence counts.'
    }
  ];

  return (
    <div className="space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 sm:pt-20 pb-16 px-4 max-w-7xl mx-auto overflow-hidden">
        {/* Ambient gradient glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-600/15 via-sky-500/15 to-purple-600/10 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span>The Socratic AI Mathematics Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-100 tracking-tight leading-[1.15]">
            Stop memorizing steps. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-300 to-indigo-500">
              Start understanding math.
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Meet your personal AI mathematics tutor. Explore problems interactively, discover why each step works, and build understanding that lasts.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setActiveView('tutor')}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 via-sky-600 to-indigo-600 hover:from-indigo-500 hover:to-sky-500 text-white font-bold text-sm px-7 py-3.5 rounded-xl shadow-xl shadow-indigo-600/25 transition-all hover:scale-[1.02] active:scale-95"
            >
              <span>Start Learning</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => startNewSession('2x + 5 = 15', 'Algebra', 'Beginner')}
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-sm px-6 py-3.5 rounded-xl border border-slate-700/80 transition-all shadow-sm"
            >
              <Play className="w-4 h-4 text-sky-400 fill-sky-400" />
              <span>Explore Live Example</span>
            </button>
          </div>
        </div>

        {/* Real Functioning Live Product Demonstration */}
        <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-6">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="text-xs font-mono text-slate-400 ml-2">MathMind Interactive Tutor Sandbox</span>
            </div>
            <button
              onClick={handleHeroReset}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 bg-slate-800 px-2 py-1 rounded"
            >
              <RotateCcw className="w-3 h-3" /> Reset Demo
            </button>
          </div>

          {/* Current step preview */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                {heroSteps[heroStep].title}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                Step {heroStep + 1} of {heroSteps.length}
              </span>
            </div>

            {/* LaTeX Display */}
            <div className="text-center py-4 bg-slate-950 rounded-xl border border-slate-800">
              <div className="text-2xl sm:text-3xl font-extrabold text-sky-300 font-mono">
                <MathView math={`$$${heroSteps[heroStep].latex}$$`} block />
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {heroSteps[heroStep].explanation}
            </p>

            {/* Socratic Question */}
            <div className="bg-indigo-950/40 border border-indigo-500/30 p-3.5 rounded-xl text-xs sm:text-sm text-slate-100 font-medium flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <span>{heroSteps[heroStep].question}</span>
            </div>

            {/* Hint Box */}
            {heroRevealedHint && (
              <div className="bg-amber-950/30 border border-amber-800/40 text-amber-200 text-xs p-3 rounded-xl flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{heroSteps[heroStep].hint}</span>
              </div>
            )}

            {/* Feedback Message */}
            {heroFeedback && (
              <div className="bg-emerald-950/40 border border-emerald-800/50 text-emerald-200 text-xs p-3 rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{heroFeedback}</span>
              </div>
            )}

            {/* Interactive demo input */}
            <form onSubmit={handleHeroSubmit} className="pt-2 flex gap-2">
              <input
                type="text"
                value={heroInput}
                onChange={(e) => setHeroInput(e.target.value)}
                placeholder="Type your mathematical action (e.g. 'subtract 5')..."
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors shadow"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={() => setHeroRevealedHint(true)}
                className="bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs px-3 py-2.5 rounded-xl border border-slate-700"
                title="Get a hint"
              >
                <Lightbulb className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 2. HOW THE LEARNING EXPERIENCE WORKS */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 block mb-2">
            Pedagogical Architecture
          </span>
          <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight">
            Designed for genuine understanding, not shortcuts
          </h2>
          <p className="mt-2 text-slate-400 text-sm">
            Every feature in MathMind addresses the root reasons students get stuck in mathematics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-2">1. Step-by-Step Socratic Dialogue</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Never be overwhelmed by an entire page of algebra dumped all at once. The tutor isolates single conceptual operations, asking targeted questions that provoke active reasoning.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center mb-4">
              <Scale className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-2">2. Interactive Playground</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Manipulate algebra balance scales, drag function parameters, and watch secant lines converge to tangents. Visual intuition turns abstract symbols into tangible mental models.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-2">3. Misconception Diagnosis</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Mistakes are diagnostic goldmines. MathMind pinpoints whether an error was an arithmetic slip, a sign inversion, or a missing prerequisite, offering immediate remedial guidance.
            </p>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE MATHEMATICAL PLAYGROUND PREVIEW */}
      <section className="max-w-6xl mx-auto px-4 bg-slate-900/60 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-lg">
            <div className="inline-flex items-center gap-1.5 text-xs text-sky-400 font-semibold bg-sky-500/10 border border-sky-500/20 px-3 py-1 rounded-full">
              <Sliders className="w-3.5 h-3.5" />
              <span>Interactive Math Tools</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
              Experiment with equations directly
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Math is not a spectator sport. Open dedicated sandbox tools directly from your tutoring session to see balance scales preserve equality and function graphs shift dynamically.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => openPlaygroundModal('algebra_balance', 'Algebra Balance Scale')}
                className="flex items-center gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2.5 rounded-xl transition-all shadow"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Launch Balance Scale</span>
              </button>
              <button
                onClick={() => openPlaygroundModal('function_plotter', 'Function Graph Explorer')}
                className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-4 py-2.5 rounded-xl border border-slate-700 transition-all"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Function Explorer</span>
              </button>
              <button
                onClick={() => openPlaygroundModal('calculus_explorer', 'Calculus Explorer')}
                className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-4 py-2.5 rounded-xl border border-slate-700 transition-all"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Calculus Visualizer</span>
              </button>
            </div>
          </div>

          <div className="w-full max-w-md bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center space-y-4 shadow-inner">
            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Playground Preview: Parabola Invariants</span>
            <div className="font-mono text-xl font-bold text-sky-400">
              <MathView math={`$$y = ax^2 + bx + c$$`} block />
            </div>
            <div className="text-xs text-slate-400 leading-relaxed">
              Adjust coefficient <em>a</em> to flip concavity, shift <em>b</em> to translate the axis of symmetry, and alter <em>c</em> to observe y-intercept changes in real time.
            </div>
            <button
              onClick={() => openPlaygroundModal('function_plotter', 'Function Graph Explorer')}
              className="w-full py-2.5 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 text-xs font-semibold rounded-xl border border-indigo-500/40 transition-colors"
            >
              Open Interactive Graph Demo
            </button>
          </div>
        </div>
      </section>

      {/* 4. SUPPORTED TOPICS CURRICULUM */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 block mb-2">
            Broad Mathematical Scope
          </span>
          <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight">
            From foundational algebra to differential calculus
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: 'Linear & Systems',
              topics: ['One-variable isolation', 'Simultaneous equations', 'Graph intersections', 'Matrix methods']
            },
            {
              title: 'Quadratic & Polynomials',
              topics: ['Binomial factoring', 'Quadratic formula', 'Completing square', 'Complex roots']
            },
            {
              title: 'Functions & Curves',
              topics: ['Domain & Range', 'Transformations f(x-h)+k', 'Symmetry & Vertex', 'Asymptotes']
            },
            {
              title: 'Limits & Calculus',
              topics: ['Difference quotients', 'Power, Product, Chain Rules', 'Tangent slopes', 'Riemann integration']
            }
          ].map((col, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <h3 className="font-bold text-slate-100 text-sm mb-3 pb-2 border-b border-slate-800 text-indigo-300">
                {col.title}
              </h3>
              <ul className="space-y-2 text-xs text-slate-400">
                {col.topics.map((t, ti) => (
                  <li key={ti} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* 5. PRICING PREVIEW */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 block mb-2">
            Simple Subscriptions
          </span>
          <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight">
            Affordable plans for students and educators
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-100">Free Explorer</h3>
              <p className="text-xs text-slate-400 mt-1">Foundational Socratic math tutoring.</p>
              <div className="text-3xl font-extrabold text-slate-100 my-4">$0</div>
              <ul className="text-xs text-slate-300 space-y-2 pt-2 border-t border-slate-800">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> 25 Socratic sessions / mo</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Linear equations & algebra</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> KaTeX mathematical formulas</li>
              </ul>
            </div>
            <button
              onClick={() => setActiveView('tutor')}
              className="mt-6 w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700"
            >
              Get Started Free
            </button>
          </div>

          <div className="bg-slate-900 border-2 border-indigo-500 rounded-2xl p-6 flex flex-col justify-between shadow-xl shadow-indigo-500/10">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">Recommended</span>
              <h3 className="text-base font-bold text-slate-100 mt-1">MathMind Plus</h3>
              <p className="text-xs text-slate-400 mt-1">Full interactive playground & diagnostics.</p>
              <div className="text-3xl font-extrabold text-slate-100 my-4">$12 <span className="text-xs text-slate-400 font-normal">/ mo</span></div>
              <ul className="text-xs text-slate-300 space-y-2 pt-2 border-t border-slate-800">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> 250 Socratic sessions / mo</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Algebra Balance & Function Plotter</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Misconception Diagnosis Engine</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Concept Mastery Map & Spaced Review</li>
              </ul>
            </div>
            <button
              onClick={() => setActiveView('pricing')}
              className="mt-6 w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow"
            >
              Upgrade to Plus
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-100">MathMind Pro</h3>
              <p className="text-xs text-slate-400 mt-1">For advanced calculus & competitive STEM.</p>
              <div className="text-3xl font-extrabold text-slate-100 my-4">$24 <span className="text-xs text-slate-400 font-normal">/ mo</span></div>
              <ul className="text-xs text-slate-300 space-y-2 pt-2 border-t border-slate-800">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> 1,000 Socratic sessions / mo</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Calculus Visual Explorer</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Compare Alternative Solution Paths</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Automated AI Practice Generator</li>
              </ul>
            </div>
            <button
              onClick={() => setActiveView('pricing')}
              className="mt-6 w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700"
            >
              View Pro Plan
            </button>
          </div>
        </div>
      </section>

      {/* 6. FAQ SECTION */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isExpanded = expandedFaq === idx;
            return (
              <div
                key={idx}
                className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between text-slate-200 font-semibold text-xs sm:text-sm hover:text-indigo-300 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </button>
                {isExpanded && (
                  <div className="px-4 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="max-w-6xl mx-auto px-4 pt-12 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-300">MathMind</span>
          <span>© 2026 MathMind Inc. All rights reserved.</span>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button onClick={() => openLegalModal('terms')} className="hover:text-slate-300 transition-colors">
            Terms of Service
          </button>
          <button onClick={() => openLegalModal('privacy')} className="hover:text-slate-300 transition-colors">
            Privacy Policy
          </button>
          <button onClick={() => openLegalModal('research')} className="hover:text-slate-300 transition-colors">
            Pedagogical Principles
          </button>
          <button onClick={() => setActiveView('admin')} className="hover:text-slate-300 transition-colors">
            System Telemetry
          </button>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
