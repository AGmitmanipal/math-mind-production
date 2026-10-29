import React, { useState } from 'react';
import { AlgebraBalance } from './AlgebraBalance';
import { FunctionPlotter } from './FunctionPlotter';
import { CalculusExplorer } from './CalculusExplorer';
import { Sliders, Scale, Activity } from 'lucide-react';

export const PlaygroundHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'balance' | 'plotter' | 'calculus'>('balance');

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold mb-2">
            <Sliders className="w-3.5 h-3.5" />
            <span>Interactive Mathematics Sandbox</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            MathMind Playground
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Build spatial intuition. Manipulate equations, observe balance preservation, and explore functions dynamically.
          </p>
        </div>

        {/* Playground tool selector */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs">
          <button
            onClick={() => setActiveTab('balance')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all ${
              activeTab === 'balance'
                ? 'bg-indigo-600 text-white font-medium shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>Algebra Balance</span>
          </button>

          <button
            onClick={() => setActiveTab('plotter')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all ${
              activeTab === 'plotter'
                ? 'bg-sky-600 text-white font-medium shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Function Explorer</span>
          </button>

          <button
            onClick={() => setActiveTab('calculus')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all ${
              activeTab === 'calculus'
                ? 'bg-purple-600 text-white font-medium shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Calculus Explorer</span>
          </button>
        </div>
      </div>

      {/* Tool Viewer */}
      {activeTab === 'balance' && (
        <div className="space-y-4">
          <AlgebraBalance />
        </div>
      )}

      {activeTab === 'plotter' && (
        <div className="space-y-4">
          <FunctionPlotter />
        </div>
      )}

      {activeTab === 'calculus' && (
        <div className="space-y-4">
          <CalculusExplorer />
        </div>
      )}
    </div>
  );
};

export default PlaygroundHub;
