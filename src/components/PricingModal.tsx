import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CreditCard,
  Check,
  Zap,
  Sparkles,
  ShieldCheck,
  HelpCircle,
  X
} from 'lucide-react';

export const PricingModal: React.FC<{ isOpen?: boolean; onClose?: () => void }> = ({
  isOpen = true,
  onClose
}) => {
  const { user, updateUserTier } = useApp();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [upgradedSuccess, setUpgradedSuccess] = useState<string | null>(null);

  const plans = [
    {
      id: 'free',
      name: 'Free Explorer',
      priceMonthly: 0,
      priceAnnual: 0,
      description: 'Foundational Socratic math tutoring for students getting started.',
      features: [
        '25 Socratic tutoring sessions / month',
        'Basic linear & quadratic equations',
        '1-level hints per step',
        'Standard KaTeX math typesetting',
        'Basic mastery dashboard'
      ],
      isPopular: false
    },
    {
      id: 'plus',
      name: 'MathMind Plus',
      priceMonthly: 12,
      priceAnnual: 9,
      description: 'Ideal for high school & college students seeking complete intuition.',
      features: [
        '250 Socratic tutoring sessions / month',
        'Algebra Balance Scale interactive playground',
        'Interactive Cartesian Function Explorer',
        'Automated Misconception Diagnosis Engine',
        '3-tier progressive hints & adaptive analogies',
        'Complete Concept Mastery Map with prerequisites',
        'Unlimited saved session history'
      ],
      isPopular: true
    },
    {
      id: 'pro',
      name: 'MathMind Pro',
      priceMonthly: 24,
      priceAnnual: 19,
      description: 'Maximum power for STEM majors, competitive exams & advanced calculus.',
      features: [
        '1,000 Socratic tutoring sessions / month',
        'Calculus Explorer (tangents, secants, Riemann sums)',
        'Side-by-side multiple solution path comparison',
        'Automated AI practice problem generator',
        'Deterministic mathematical proof verification',
        'Priority low-latency Gemini 3.8 Flash pipeline',
        'Exportable mastery transcripts for educators'
      ],
      isPopular: false
    }
  ];

  const handleSelectPlan = (planId: 'free' | 'plus' | 'pro') => {
    updateUserTier(planId);
    setUpgradedSuccess(planId);
    setTimeout(() => {
      setUpgradedSuccess(null);
      if (onClose) onClose();
    }, 1800);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-3">
          <CreditCard className="w-3.5 h-3.5" />
          <span>SaaS Subscriptions & Entitlements</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
          Transparent plans for genuine math mastery
        </h1>
        <p className="mt-2 text-slate-400 text-sm">
          No hidden fees. Switch or cancel anytime. All plans adhere to ethical AI tutoring principles without answer dumps.
        </p>

        {/* Billing cycle toggle */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <span className={`text-xs ${billingCycle === 'monthly' ? 'text-slate-100 font-bold' : 'text-slate-400'}`}>
            Monthly Billing
          </span>
          <button
            onClick={() => setBillingCycle(b => b === 'monthly' ? 'annual' : 'monthly')}
            className="w-12 h-6 rounded-full bg-slate-800 p-1 relative border border-slate-700 transition-colors"
          >
            <div className={`w-4 h-4 rounded-full bg-indigo-500 transition-transform ${billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
          <span className={`text-xs flex items-center gap-1.5 ${billingCycle === 'annual' ? 'text-slate-100 font-bold' : 'text-slate-400'}`}>
            Annual Billing
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-bold">
              Save 25%
            </span>
          </span>
        </div>
      </div>

      {/* Upgrade success banner */}
      {upgradedSuccess && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-center text-sm font-semibold animate-in fade-in">
          Successfully updated subscription to {upgradedSuccess.toUpperCase()} tier!
        </div>
      )}

      {/* Current plan usage meter */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Current Active Plan:</span>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xl font-bold text-slate-100 capitalize">{user.tier} Tier</span>
            <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-mono">
              Active Member
            </span>
          </div>
        </div>

        <div className="w-full sm:w-64">
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Monthly AI Requests</span>
            <span className="font-mono text-slate-200 font-bold">
              {user.monthlyAiRequestsUsed} / {user.monthlyAiRequestsLimit}
            </span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full"
              style={{ width: `${Math.min(100, (user.monthlyAiRequestsUsed / user.monthlyAiRequestsLimit) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p) => {
          const isCurrent = user.tier === p.id;
          const price = billingCycle === 'annual' ? p.priceAnnual : p.priceMonthly;

          return (
            <div
              key={p.id}
              className={`bg-slate-900 rounded-2xl p-6 sm:p-8 flex flex-col justify-between border relative transition-all ${
                p.isPopular
                  ? 'border-indigo-500/80 shadow-2xl shadow-indigo-500/10 scale-105 z-10'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {p.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-sky-500 text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow">
                  Most Popular for Students
                </div>
              )}

              <div>
                <h3 className="text-lg font-bold text-slate-100">{p.name}</h3>
                <p className="text-xs text-slate-400 mt-1 min-h-[32px]">{p.description}</p>

                <div className="my-5 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-slate-100">${price}</span>
                  <span className="text-xs text-slate-400">/ user / month</span>
                </div>

                <div className="pt-4 border-t border-slate-800 space-y-2.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Included capabilities:
                  </span>
                  {p.features.map((f, fi) => (
                    <div key={fi} className="flex items-start gap-2 text-xs text-slate-300">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-800">
                <button
                  onClick={() => handleSelectPlan(p.id as any)}
                  disabled={isCurrent}
                  className={`w-full py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isCurrent
                      ? 'bg-slate-800 text-slate-400 cursor-default'
                      : p.isPopular
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  }`}
                >
                  {isCurrent ? 'Current Plan' : `Upgrade to ${p.name}`}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PricingModal;
