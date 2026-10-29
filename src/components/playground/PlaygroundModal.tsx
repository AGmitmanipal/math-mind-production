import React from 'react';
import { X } from 'lucide-react';
import { AlgebraBalance } from './AlgebraBalance';
import { FunctionPlotter } from './FunctionPlotter';
import { CalculusExplorer } from './CalculusExplorer';

interface PlaygroundModalProps {
  toolType: 'algebra_balance' | 'function_plotter' | 'calculus_explorer';
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  initialEquation?: {
    left: string;
    right: string;
  };
}

export const PlaygroundModal: React.FC<PlaygroundModalProps> = ({
  toolType,
  isOpen,
  onClose,
  title,
  initialEquation
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950/50">
          <h2 className="font-semibold text-slate-100 text-sm">
            {title || (toolType === 'algebra_balance' ? 'Algebra Balance Scale' : toolType === 'function_plotter' ? 'Function Graph Explorer' : 'Calculus Visualizer')}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 max-h-[85vh] overflow-y-auto">
          {toolType === 'algebra_balance' && (
            <AlgebraBalance
              initialLeft={initialEquation?.left || '2x + 5'}
              initialRight={initialEquation?.right || '15'}
            />
          )}

          {toolType === 'function_plotter' && (
            <FunctionPlotter />
          )}

          {toolType === 'calculus_explorer' && (
            <CalculusExplorer />
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaygroundModal;
