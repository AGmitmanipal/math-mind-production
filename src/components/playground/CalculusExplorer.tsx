import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MathView } from '../MathView';
import { Activity, Layers, Play, RotateCcw } from 'lucide-react';
import { approximateDerivative, calculateRiemannSum } from '../../lib/mathVerification';

export const CalculusExplorer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [mode, setMode] = useState<'tangent' | 'riemann'>('tangent');
  const [tangentX, setTangentX] = useState<number>(1.5);
  const [deltaH, setDeltaH] = useState<number>(1.2);
  const [riemannPartitions, setRiemannPartitions] = useState<number>(8);
  const [riemannBounds] = useState<[number, number]>([0, 3]);

  // Default function: f(x) = 0.5 * x^2 + 1
  const f = useCallback((x: number) => 0.5 * x * x + 1, []);
  // Analytical derivative: f'(x) = x
  const fPrime = useCallback((x: number) => x, []);

  // Exact integral of 0.5 x^2 + 1 from a to b = [ (0.5/3)*x^3 + x ]
  const exactIntegral = useCallback((a: number, b: number) => {
    const F = (x: number) => (0.5 / 3) * Math.pow(x, 3) + x;
    return F(b) - F(a);
  }, []);

  const scale = 36; // px per math unit

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, width, height);

    const originX = 60;
    const originY = height - 50;

    // Grid lines
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;

    for (let x = 0; x <= 10; x++) {
      const px = originX + x * scale;
      ctx.beginPath();
      ctx.moveTo(px, 0);
      ctx.lineTo(px, height);
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = '10px monospace';
      ctx.fillText(`${x}`, px - 4, originY + 16);
    }

    for (let y = 0; y <= 8; y++) {
      const py = originY - y * scale;
      ctx.beginPath();
      ctx.moveTo(0, py);
      ctx.lineTo(width, py);
      ctx.stroke();

      if (y !== 0) {
        ctx.fillStyle = '#64748b';
        ctx.font = '10px monospace';
        ctx.fillText(`${y}`, originX - 20, py + 4);
      }
    }

    // Axes
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.moveTo(0, originY);
    ctx.lineTo(width, originY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, height);
    ctx.stroke();

    // If Riemann mode: draw rectangles under curve
    if (mode === 'riemann') {
      const { rectangles } = calculateRiemannSum(f, riemannBounds[0], riemannBounds[1], riemannPartitions, 'midpoint');
      rectangles.forEach(rect => {
        const px = originX + rect.x * scale;
        const pWidth = rect.width * scale;
        const pHeight = rect.height * scale;
        const py = originY - pHeight;

        ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
        ctx.fillRect(px, py, pWidth, pHeight);

        ctx.strokeStyle = 'rgba(56, 189, 248, 0.8)';
        ctx.lineWidth = 1;
        ctx.strokeRect(px, py, pWidth, pHeight);
      });
    }

    // Draw Function f(x)
    ctx.strokeStyle = '#a855f7'; // Purple
    ctx.lineWidth = 3;
    ctx.beginPath();
    let started = false;
    for (let px = originX; px <= width; px += 2) {
      const mathX = (px - originX) / scale;
      const mathY = f(mathX);
      const py = originY - mathY * scale;

      if (!started) {
        ctx.moveTo(px, py);
        started = true;
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.stroke();

    // If Tangent mode: draw secant line and tangent line
    if (mode === 'tangent') {
      const x0 = tangentX;
      const y0 = f(x0);
      const x1 = tangentX + deltaH;
      const y1 = f(x1);

      // Secant slope
      const secantSlope = (y1 - y0) / deltaH;
      // Instantaneous tangent slope
      const trueSlope = fPrime(x0);

      // Draw Secant Line (Amber dashed)
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      const secantLeftX = -1;
      const secantLeftY = y0 + secantSlope * (secantLeftX - x0);
      const secantRightX = 6;
      const secantRightY = y0 + secantSlope * (secantRightX - x0);

      ctx.moveTo(originX + secantLeftX * scale, originY - secantLeftY * scale);
      ctx.lineTo(originX + secantRightX * scale, originY - secantRightY * scale);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Tangent Line (Emerald solid)
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      const tanLeftX = -1;
      const tanLeftY = y0 + trueSlope * (tanLeftX - x0);
      const tanRightX = 6;
      const tanRightY = y0 + trueSlope * (tanRightX - x0);

      ctx.moveTo(originX + tanLeftX * scale, originY - tanLeftY * scale);
      ctx.lineTo(originX + tanRightX * scale, originY - tanRightY * scale);
      ctx.stroke();

      // Plot point (x0, y0)
      const px0 = originX + x0 * scale;
      const py0 = originY - y0 * scale;
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(px0, py0, 5, 0, Math.PI * 2);
      ctx.fill();

      // Plot point (x0 + h, y0 + delta)
      const px1 = originX + x1 * scale;
      const py1 = originY - y1 * scale;
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(px1, py1, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [f, fPrime, tangentX, deltaH, mode, riemannPartitions, riemannBounds]);

  useEffect(() => {
    draw();
  }, [draw]);

  // Current calculations
  const instantaneousSlope = fPrime(tangentX);
  const secantSlope = (f(tangentX + deltaH) - f(tangentX)) / deltaH;
  const approxDeriv = approximateDerivative(f, tangentX);

  const exactArea = exactIntegral(riemannBounds[0], riemannBounds[1]);
  const riemannCalc = calculateRiemannSum(f, riemannBounds[0], riemannBounds[1], riemannPartitions, 'midpoint');

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl text-slate-100">
      {/* Header & Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-400" />
          <h3 className="font-semibold text-slate-100">Calculus Visual Explorer</h3>
          <span className="text-xs text-slate-400 font-mono">f(x) = 0.5x² + 1</span>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setMode('tangent')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded transition-colors ${mode === 'tangent' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Play className="w-3.5 h-3.5" />
            Derivative & Secant
          </button>
          <button
            onClick={() => setMode('riemann')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded transition-colors ${mode === 'riemann' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Layers className="w-3.5 h-3.5" />
            Integral & Riemann Sum
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="my-4 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-inner">
        <canvas
          ref={canvasRef}
          width={640}
          height={280}
          className="w-full h-64 block"
        />
      </div>

      {/* Mode-specific Controls and Explanations */}
      {mode === 'tangent' ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/40 p-4 rounded-xl border border-slate-800">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400 font-medium">Point of Tangency x₀:</span>
                <span className="font-mono text-emerald-400 font-bold">{tangentX.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="3.5"
                step="0.1"
                value={tangentX}
                onChange={(e) => setTangentX(parseFloat(e.target.value))}
                className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-500">Slide where tangent touches the curve</span>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400 font-medium">Secant Step Distance (h = Δx):</span>
                <span className="font-mono text-amber-400 font-bold">{deltaH.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="2.0"
                step="0.05"
                value={deltaH}
                onChange={(e) => setDeltaH(parseFloat(e.target.value))}
                className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-500">Notice as h → 0, secant slope converges to tangent slope!</span>
            </div>
          </div>

          {/* Mathematical Comparison Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-emerald-950/30 border border-emerald-800/40 p-3 rounded-lg">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wide block mb-1">
                Instantaneous Tangent Slope (Derivative f'(x₀)):
              </span>
              <div className="text-lg font-bold font-mono text-slate-100">
                m = {instantaneousSlope.toFixed(3)}
              </div>
              <p className="text-slate-400 mt-1 text-[11px]">
                Analytical derivative at x = {tangentX.toFixed(2)} is exactly <MathView math={`$f'(${tangentX.toFixed(2)}) = ${tangentX.toFixed(2)}$`} />.
              </p>
            </div>

            <div className="bg-amber-950/30 border border-amber-800/40 p-3 rounded-lg">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wide block mb-1">
                Average Secant Slope ((f(x+h) - f(x)) / h):
              </span>
              <div className="text-lg font-bold font-mono text-slate-100">
                m_sec = {secantSlope.toFixed(3)}
              </div>
              <p className="text-slate-400 mt-1 text-[11px]">
                Approximation error is only {Math.abs(secantSlope - instantaneousSlope).toFixed(3)}!
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400 font-medium">Number of Rectangular Partitions (n):</span>
              <span className="font-mono text-sky-400 font-bold">{riemannPartitions} partitions</span>
            </div>
            <input
              type="range"
              min="2"
              max="40"
              step="1"
              value={riemannPartitions}
              onChange={(e) => setRiemannPartitions(parseInt(e.target.value, 10))}
              className="w-full accent-sky-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <span className="text-[10px] text-slate-500">
              Drag to see how increasing partitions shrinks approximation error towards the exact definite integral!
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-sky-950/30 border border-sky-800/40 p-3 rounded-lg">
              <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wide block mb-1">
                Riemann Sum (Midpoint Partitioning):
              </span>
              <div className="text-lg font-bold font-mono text-slate-100">
                Area ≈ {riemannCalc.area.toFixed(3)}
              </div>
              <p className="text-slate-400 mt-1 text-[11px]">
                Sum of {riemannPartitions} rectangles of width Δx = {(3 / riemannPartitions).toFixed(2)}.
              </p>
            </div>

            <div className="bg-indigo-950/30 border border-indigo-800/40 p-3 rounded-lg">
              <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wide block mb-1">
                Exact Definite Integral ∫₀³ (0.5x² + 1) dx:
              </span>
              <div className="text-lg font-bold font-mono text-slate-100">
                Exact = {exactArea.toFixed(3)}
              </div>
              <p className="text-slate-400 mt-1 text-[11px]">
                Calculated via Fundamental Theorem of Calculus: [(0.5/3)(3)³ + 3] = 7.500.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalculusExplorer;
