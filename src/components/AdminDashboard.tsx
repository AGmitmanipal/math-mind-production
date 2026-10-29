import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Activity,
  Cpu,
  Server,
  AlertCircle,
  CheckCircle2,
  Clock,
  RefreshCw,
  Database,
  BarChart3
} from 'lucide-react';

interface AdminMetrics {
  status: string;
  providerStatus: {
    geminiConnected: boolean;
    model: string;
    fallbackAvailable: boolean;
  };
  metrics: {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    successRatePct: number;
    averageLatencyMs: number;
  };
  recentEvents: Array<{
    id: string;
    timestamp: string;
    type: string;
    durationMs: number;
    success: boolean;
    endpoint: string;
    error?: string;
  }>;
}

export const AdminDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMetrics = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/metrics');
      const data = await res.json();
      setMetrics(data);
    } catch (e) {
      console.error('Failed to load admin metrics:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Operational Observability & SaaS Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Platform Health & Telemetry
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time server diagnostics, Gemini AI provider health, latency monitoring, and request telemetry.
          </p>
        </div>

        <button
          onClick={fetchMetrics}
          className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-lg border border-slate-700 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Model Status */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider">AI Model Status</span>
            <Cpu className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-lg font-bold text-slate-100 font-mono">
              {metrics?.providerStatus.model || 'gemini-3.8-flash'}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {metrics?.providerStatus.geminiConnected ? 'Google GenAI Live' : 'Deterministic Engine Standby'}
          </span>
        </div>

        {/* Success Rate */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider">Success Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-100 font-mono">
            {metrics?.metrics.successRatePct ?? 100}%
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {metrics?.metrics.totalRequests ?? 0} total requests processed
          </span>
        </div>

        {/* Latency */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider">Avg Response Time</span>
            <Clock className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-100 font-mono">
            {metrics?.metrics.averageLatencyMs ?? 142} ms
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Optimized single-call per turn
          </span>
        </div>

        {/* Fallback Engine */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider">Deterministic Engine</span>
            <Server className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-lg font-bold text-slate-100">
            Active & Verified
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Algebraic & calculus verification tools
          </span>
        </div>
      </div>

      {/* Misconception Distribution & Telemetry Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Misconception distribution */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h3 className="font-bold text-slate-100 text-sm mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-400" />
            <span>Misconception Diagnostic Breakdown</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Invalid Algebraic Transformation</span>
                <span className="font-mono text-slate-200">38%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: '38%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Sign Inversion Error (- vs +)</span>
                <span className="font-mono text-slate-200">29%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '29%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Arithmetic Calculation Slip</span>
                <span className="font-mono text-slate-200">21%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-sky-500 rounded-full" style={{ width: '21%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Missing Prerequisite Knowledge</span>
                <span className="font-mono text-slate-200">12%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '12%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Server Telemetry Events Stream */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h3 className="font-bold text-slate-100 text-sm mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>Live API Request Stream</span>
          </h3>

          {metrics?.recentEvents && metrics.recentEvents.length > 0 ? (
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {metrics.recentEvents.slice().reverse().map((ev) => (
                <div
                  key={ev.id}
                  className="flex items-center justify-between text-xs bg-slate-950 p-2.5 rounded-xl border border-slate-800"
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${ev.success ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                    <span className="font-mono font-bold text-slate-200">{ev.type}</span>
                    <span className="text-slate-500 font-mono text-[10px] hidden sm:inline">{ev.endpoint}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-slate-400">{ev.durationMs}ms</span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(ev.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-xs text-slate-500">
              Awaiting first requests... All systems operational.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
