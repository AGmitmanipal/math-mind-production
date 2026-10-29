import React, { useState } from 'react';
import { MathView } from '../MathView';
import { Scale, RotateCcw, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

interface BalanceStep {
  left: string;
  right: string;
  operation: string;
  explanation: string;
}

export const AlgebraBalance: React.FC<{
  initialLeft?: string;
  initialRight?: string;
  onSolved?: () => void;
}> = ({
  initialLeft = '2x + 5',
  initialRight = '15',
  onSolved
}) => {
  // Current state of the equation: left = a*x + b, right = c
  // Default: 2x + 5 = 15
  const [a, setA] = useState<number>(2);
  const [b, setB] = useState<number>(5);
  const [c, setC] = useState<number>(15);
  
  const [opType, setOpType] = useState<'add' | 'subtract' | 'multiply' | 'divide'>('subtract');
  const [opValue, setOpValue] = useState<number>(5);
  const [history, setHistory] = useState<BalanceStep[]>([
    {
      left: initialLeft,
      right: initialRight,
      operation: 'Initial Equation',
      explanation: 'Both sides are currently balanced in weight.'
    }
  ]);
  const [feedback, setFeedback] = useState<string>('Try subtracting 5 from both sides to isolate the 2x term.');

  const isSolved = a === 1 && b === 0;

  const currentLeftLatex = b !== 0 
    ? `${a === 1 ? 'x' : a === -1 ? '-x' : `${a}x`} ${b > 0 ? `+ ${b}` : `- ${Math.abs(b)}`}`
    : `${a === 1 ? 'x' : a === -1 ? '-x' : `${a}x`}`;
  
  const currentRightLatex = `${c}`;

  const applyOperation = () => {
    if (opType === 'divide' && opValue === 0) {
      setFeedback('Division by zero is undefined and destroys equality!');
      return;
    }

    let newB = b;
    let newA = a;
    let newC = c;
    let desc = '';

    if (opType === 'subtract') {
      newB = b - opValue;
      newC = c - opValue;
      desc = `Subtracted ${opValue} from both sides`;
    } else if (opType === 'add') {
      newB = b + opValue;
      newC = c + opValue;
      desc = `Added ${opValue} to both sides`;
    } else if (opType === 'divide') {
      newA = a / opValue;
      newB = b / opValue;
      newC = c / opValue;
      desc = `Divided both sides by ${opValue}`;
    } else if (opType === 'multiply') {
      newA = a * opValue;
      newB = b * opValue;
      newC = c * opValue;
      desc = `Multiplied both sides by ${opValue}`;
    }

    setA(newA);
    setB(newB);
    setC(newC);

    const nextStep: BalanceStep = {
      left: `${newA}x ${newB !== 0 ? (newB > 0 ? `+ ${newB}` : `- ${Math.abs(newB)}`) : ''}`,
      right: `${newC}`,
      operation: desc,
      explanation: `Preserved equality because the exact same operation [${desc}] was applied to both sides.`
    };

    setHistory(prev => [...prev, nextStep]);

    if (newA === 1 && newB === 0) {
      setFeedback(`Success! Variable x is isolated: x = ${newC}. You solved the equation!`);
      if (onSolved) onSolved();
    } else if (newB === 0 && newA !== 1) {
      setFeedback(`Constants eliminated! Now divide both sides by the coefficient ${newA}.`);
    } else {
      setFeedback(`Good balance step! Notice how both pans remain equal.`);
    }
  };

  const handleReset = () => {
    setA(2);
    setB(5);
    setC(15);
    setOpType('subtract');
    setOpValue(5);
    setHistory([
      {
        left: '2x + 5',
        right: '15',
        operation: 'Initial Equation',
        explanation: 'Both sides are currently balanced in weight.'
      }
    ]);
    setFeedback('Reset to start: 2x + 5 = 15. What operation cancels the +5?');
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl text-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-indigo-400" />
          <h3 className="font-semibold text-slate-100">Algebra Balance Scale</h3>
          <span className="text-xs bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded-full">
            Golden Rule: What you do to one side, you must do to the other
          </span>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors px-2 py-1 rounded bg-slate-800 hover:bg-slate-700"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>

      {/* Visual Balance Scale */}
      <div className="my-6 py-4 bg-slate-950/60 rounded-xl border border-slate-800/80 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Scale fulcrum & beam */}
        <div className="w-full max-w-md relative flex flex-col items-center">
          {/* Horizontal Beam */}
          <div className="w-72 h-2.5 bg-gradient-to-r from-indigo-500 via-sky-400 to-indigo-500 rounded-full shadow-lg relative">
            {/* Center pivot point */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-slate-100 border-2 border-indigo-600 shadow" />
          </div>

          {/* Vertical Fulcrum triangle */}
          <div className="w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-b-[32px] border-b-slate-700 mt-0" />
          <div className="w-24 h-2 bg-slate-700 rounded-full mt-1" />

          {/* Left Pan Hanging */}
          <div className="absolute top-2.5 left-2 flex flex-col items-center">
            <div className="w-0.5 h-10 bg-slate-500" />
            <div className="w-32 bg-slate-800/90 border border-indigo-500/40 rounded-xl p-3 shadow-lg text-center backdrop-blur-sm">
              <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider block mb-1">Left Pan</span>
              <div className="text-lg font-bold text-slate-100">
                <MathView math={`$${currentLeftLatex}$`} />
              </div>
            </div>
          </div>

          {/* Equal Symbol */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-2xl font-bold text-sky-400 bg-slate-900/90 border border-sky-500/30 px-3 py-1 rounded-full shadow">
            =
          </div>

          {/* Right Pan Hanging */}
          <div className="absolute top-2.5 right-2 flex flex-col items-center">
            <div className="w-0.5 h-10 bg-slate-500" />
            <div className="w-32 bg-slate-800/90 border border-indigo-500/40 rounded-xl p-3 shadow-lg text-center backdrop-blur-sm">
              <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider block mb-1">Right Pan</span>
              <div className="text-lg font-bold text-slate-100">
                <MathView math={`$${currentRightLatex}$`} />
              </div>
            </div>
          </div>
        </div>

        {/* Current status banner */}
        <div className="mt-8 flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-3 py-1.5 rounded-lg">
          <ShieldCheck className="w-4 h-4" />
          <span>Equivalence Preserved: Current equation is <MathView math={`$${currentLeftLatex} = ${currentRightLatex}$`} /></span>
        </div>
      </div>

      {/* Interactive Controls */}
      <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-4">
        <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
          Choose Operation to Apply to Both Sides:
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
          <div className="flex rounded-lg overflow-hidden border border-slate-700 bg-slate-800/80">
            <button
              onClick={() => { setOpType('subtract'); setOpValue(5); }}
              className={`flex-1 py-1.5 text-xs font-medium transition-colors ${opType === 'subtract' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}
            >
              - Subtract
            </button>
            <button
              onClick={() => { setOpType('add'); setOpValue(5); }}
              className={`flex-1 py-1.5 text-xs font-medium transition-colors ${opType === 'add' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}
            >
              + Add
            </button>
            <button
              onClick={() => { setOpType('divide'); setOpValue(2); }}
              className={`flex-1 py-1.5 text-xs font-medium transition-colors ${opType === 'divide' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}
            >
              ÷ Divide
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Value:</span>
            <input
              type="number"
              value={opValue}
              onChange={(e) => setOpValue(parseFloat(e.target.value) || 0)}
              className="w-20 bg-slate-900 border border-slate-700 text-slate-100 rounded px-2.5 py-1 text-sm focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <button
            onClick={applyOperation}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white font-medium text-xs px-4 py-2.5 rounded-lg shadow-md transition-all active:scale-95"
          >
            <span>Apply to Both Sides</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Feedback message */}
        <div className="mt-3 flex items-start gap-2 text-xs text-slate-300 bg-slate-800/40 p-2.5 rounded-lg border border-slate-700/50">
          <AlertCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <span>{feedback}</span>
        </div>
      </div>

      {/* Step Derivation Trail */}
      <div className="mt-4">
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Derivation Trail:</h4>
        <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
          {history.map((h, i) => (
            <div key={i} className="flex items-center justify-between text-xs bg-slate-950/30 px-3 py-1.5 rounded border border-slate-800/60">
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-mono">{i + 1}.</span>
                <span className="font-semibold text-indigo-300">{h.operation}</span>
                <span className="text-slate-400">→</span>
                <span className="font-mono text-slate-200">
                  <MathView math={`$${h.left} = ${h.right}$`} />
                </span>
              </div>
              <span className="text-[11px] text-slate-400 italic hidden sm:inline">{h.explanation}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlgebraBalance;
