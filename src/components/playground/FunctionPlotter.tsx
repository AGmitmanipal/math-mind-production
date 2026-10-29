import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MathView } from '../MathView';
import { Sliders, RotateCcw, ZoomIn, ZoomOut, Crosshair, Sparkles } from 'lucide-react';

interface FunctionPlotterProps {
  initialType?: 'quadratic' | 'linear' | 'trig';
}

export const FunctionPlotter: React.FC<FunctionPlotterProps> = ({
  initialType = 'quadratic'
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Function parameters for y = a*x^2 + b*x + c
  const [funcType, setFuncType] = useState<'quadratic' | 'linear' | 'trig'>(initialType);
  const [a, setA] = useState<number>(1);
  const [b, setB] = useState<number>(-4);
  const [c, setC] = useState<number>(3);

  // Viewport
  const [scale, setScale] = useState<number>(30); // pixels per unit
  const [originOffset, setOriginOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hoverCoord, setHoverCoord] = useState<{ x: number; y: number } | null>(null);

  // Evaluate function at x
  const evalFunc = useCallback((x: number): number => {
    if (funcType === 'quadratic') {
      return a * x * x + b * x + c;
    } else if (funcType === 'linear') {
      return a * x + b;
    } else {
      // trig: a * sin(b * x) + c
      return a * Math.sin(b * x) + c;
    }
  }, [funcType, a, b, c]);

  // Derived properties for quadratic: vertex, discriminant, roots
  const discriminant = b * b - 4 * a * c;
  const vertexX = funcType === 'quadratic' && a !== 0 ? -b / (2 * a) : null;
  const vertexY = vertexX !== null ? evalFunc(vertexX) : null;
  
  let realRoots: number[] = [];
  if (funcType === 'quadratic' && a !== 0 && discriminant >= 0) {
    const r1 = (-b + Math.sqrt(discriminant)) / (2 * a);
    const r2 = (-b - Math.sqrt(discriminant)) / (2 * a);
    realRoots = discriminant === 0 ? [r1] : [r1, r2].sort((x, y) => x - y);
  } else if (funcType === 'linear' && a !== 0) {
    realRoots = [-b / a];
  }

  // Draw Cartesian Graph
  const drawGraph = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Background
    ctx.fillStyle = '#0b0f19';
    ctx.fillRect(0, 0, width, height);

    const originX = width / 2 + originOffset.x;
    const originY = height / 2 + originOffset.y;

    // Grid lines
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;

    // Vertical grid
    const leftBound = -originX / scale;
    const rightBound = (width - originX) / scale;
    const topBound = originY / scale;
    const bottomBound = -(height - originY) / scale;

    const startX = Math.floor(leftBound);
    const endX = Math.ceil(rightBound);

    for (let x = startX; x <= endX; x++) {
      const px = originX + x * scale;
      ctx.beginPath();
      ctx.moveTo(px, 0);
      ctx.lineTo(px, height);
      ctx.stroke();

      if (x !== 0 && x % 2 === 0) {
        ctx.fillStyle = '#64748b';
        ctx.font = '10px monospace';
        ctx.fillText(`${x}`, px - 6, originY + 14);
      }
    }

    // Horizontal grid
    const startY = Math.floor(bottomBound);
    const endY = Math.ceil(topBound);

    for (let y = startY; y <= endY; y++) {
      const py = originY - y * scale;
      ctx.beginPath();
      ctx.moveTo(0, py);
      ctx.lineTo(width, py);
      ctx.stroke();

      if (y !== 0 && y % 2 === 0) {
        ctx.fillStyle = '#64748b';
        ctx.font = '10px monospace';
        ctx.fillText(`${y}`, originX + 6, py + 4);
      }
    }

    // Main Axes
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.5;

    // X Axis
    ctx.beginPath();
    ctx.moveTo(0, originY);
    ctx.lineTo(width, originY);
    ctx.stroke();

    // Y Axis
    ctx.beginPath();
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, height);
    ctx.stroke();

    // Axis Labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('x', width - 15, originY - 8);
    ctx.fillText('y', originX + 8, 16);

    // Plot Function curve
    ctx.strokeStyle = '#38bdf8'; // Sky blue
    ctx.lineWidth = 2.5;
    ctx.beginPath();

    let started = false;
    for (let px = 0; px <= width; px += 2) {
      const mathX = (px - originX) / scale;
      const mathY = evalFunc(mathX);
      const py = originY - mathY * scale;

      // Handle discontinuities or overflow
      if (isNaN(py) || !isFinite(py) || py < -1000 || py > height + 1000) {
        started = false;
        continue;
      }

      if (!started) {
        ctx.moveTo(px, py);
        started = true;
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.stroke();

    // Plot Roots (x-intercepts)
    realRoots.forEach((root) => {
      const px = originX + root * scale;
      const py = originY;
      ctx.fillStyle = '#f43f5e'; // Rose
      ctx.beginPath();
      ctx.arc(px, py, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Root label
      ctx.fillStyle = '#fecdd3';
      ctx.font = 'bold 10px monospace';
      ctx.fillText(`(${root.toFixed(2)}, 0)`, px - 18, py - 10);
    });

    // Plot Vertex for quadratic
    if (vertexX !== null && vertexY !== null) {
      const px = originX + vertexX * scale;
      const py = originY - vertexY * scale;
      ctx.fillStyle = '#a855f7'; // Purple
      ctx.beginPath();
      ctx.arc(px, py, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#e9d5ff';
      ctx.font = 'bold 10px monospace';
      ctx.fillText(`Vertex (${vertexX.toFixed(2)}, ${vertexY.toFixed(2)})`, px + 8, py + 4);
    }

    // Hover crosshair
    if (hoverCoord) {
      const px = originX + hoverCoord.x * scale;
      const py = originY - hoverCoord.y * scale;

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(px, 0);
      ctx.lineTo(px, height);
      ctx.moveTo(0, py);
      ctx.lineTo(width, py);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [evalFunc, originOffset, scale, hoverCoord, realRoots, vertexX, vertexY, funcType]);

  useEffect(() => {
    drawGraph();
  }, [drawGraph]);

  // Handle canvas mouse move for coordinate inspection
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const originX = canvas.width / 2 + originOffset.x;
    const mathX = (mouseX - originX) / scale;
    const mathY = evalFunc(mathX);
    setHoverCoord({ x: mathX, y: mathY });
  };

  const handleMouseLeave = () => {
    setHoverCoord(null);
  };

  const equationLatex = funcType === 'quadratic'
    ? `f(x) = ${a === 1 ? '' : a === -1 ? '-' : `${a}`}x^2 ${b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`}x ${c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`}`
    : funcType === 'linear'
    ? `f(x) = ${a}x ${b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`}`
    : `f(x) = ${a}\\sin(${b}x) ${c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`}`;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl text-slate-100">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-sky-400" />
          <h3 className="font-semibold text-slate-100">Interactive Function Explorer</h3>
        </div>

        {/* Function selector */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => { setFuncType('quadratic'); setA(1); setB(-4); setC(3); }}
            className={`px-2.5 py-1 rounded transition-colors ${funcType === 'quadratic' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Quadratic
          </button>
          <button
            onClick={() => { setFuncType('linear'); setA(2); setB(-3); }}
            className={`px-2.5 py-1 rounded transition-colors ${funcType === 'linear' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Linear
          </button>
          <button
            onClick={() => { setFuncType('trig'); setA(2); setB(1); setC(0); }}
            className={`px-2.5 py-1 rounded transition-colors ${funcType === 'trig' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Sine Wave
          </button>
        </div>
      </div>

      {/* Main Equation display */}
      <div className="my-3 text-center bg-slate-950/60 py-2.5 px-4 rounded-xl border border-slate-800 flex items-center justify-center gap-4">
        <div className="text-lg font-bold text-sky-300">
          <MathView math={`$${equationLatex}$`} />
        </div>
        {hoverCoord && (
          <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
            <Crosshair className="w-3.5 h-3.5 text-sky-400" />
            <span className="font-mono">x: {hoverCoord.x.toFixed(2)}, y: {hoverCoord.y.toFixed(2)}</span>
          </div>
        )}
      </div>

      {/* Canvas plotting area */}
      <div className="relative rounded-xl overflow-hidden border border-slate-800 shadow-inner bg-slate-950">
        <canvas
          ref={canvasRef}
          width={640}
          height={320}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="w-full h-72 cursor-crosshair block"
        />

        {/* Floating graph controls */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1 rounded-lg border border-slate-700 shadow-lg">
          <button
            onClick={() => setScale(s => Math.min(s + 8, 70))}
            className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setScale(s => Math.max(s - 8, 12))}
            className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => { setScale(30); setOriginOffset({ x: 0, y: 0 }); }}
            className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded"
            title="Reset View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Interactive Parameter Sliders */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-950/40 p-4 rounded-xl border border-slate-800">
        {/* Slider A */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400 font-medium">Coefficient a:</span>
            <span className="font-mono text-sky-400 font-bold">{a}</span>
          </div>
          <input
            type="range"
            min="-5"
            max="5"
            step="0.5"
            value={a}
            onChange={(e) => setA(parseFloat(e.target.value))}
            className="w-full accent-sky-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <span className="text-[10px] text-slate-500">Controls curvature & direction</span>
        </div>

        {/* Slider B */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400 font-medium">Coefficient b:</span>
            <span className="font-mono text-sky-400 font-bold">{b}</span>
          </div>
          <input
            type="range"
            min="-8"
            max="8"
            step="0.5"
            value={b}
            onChange={(e) => setB(parseFloat(e.target.value))}
            className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <span className="text-[10px] text-slate-500">Shifts axis of symmetry</span>
        </div>

        {/* Slider C */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400 font-medium">Constant c:</span>
            <span className="font-mono text-sky-400 font-bold">{c}</span>
          </div>
          <input
            type="range"
            min="-8"
            max="8"
            step="0.5"
            value={c}
            onChange={(e) => setC(parseFloat(e.target.value))}
            className="w-full accent-purple-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <span className="text-[10px] text-slate-500">Vertical shift (y-intercept)</span>
        </div>
      </div>

      {/* Mathematical Intuition & Properties */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-800/30 p-3 rounded-lg border border-slate-700/50">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="font-medium text-slate-200">Key Features:</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {realRoots.length > 0 ? (
            <span className="text-rose-400 font-mono">
              Roots: {realRoots.map(r => r.toFixed(2)).join(', ')}
            </span>
          ) : (
            <span className="text-slate-400">No real roots (discriminant &lt; 0)</span>
          )}

          {vertexX !== null && vertexY !== null && (
            <span className="text-purple-400 font-mono">
              Vertex: ({vertexX.toFixed(2)}, {vertexY.toFixed(2)})
            </span>
          )}

          <span className="text-sky-400 font-mono">
            y-intercept: (0, {c})
          </span>
        </div>
      </div>
    </div>
  );
};

export default FunctionPlotter;
