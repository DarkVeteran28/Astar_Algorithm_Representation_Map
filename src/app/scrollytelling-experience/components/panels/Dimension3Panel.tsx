'use client';

import React from 'react';
import { AlertTriangle, Brain, Clock, TrendingUp, Zap } from 'lucide-react';
import { TRAFFIC_EVENTS, ROAD_EDGES, CITY_NODES } from '../data/mapData';

interface Props {
  isActive: boolean;
  trafficTimeOffset: number;
  onTimeChange: (offset: number) => void;
}

const TIME_STEPS = [0, 15, 30, 45];

function getSeverityLabel(severity: number): { label: string; color: string } {
  if (severity >= 0.9) return { label: 'Gridlock', color: 'text-red-400' };
  if (severity >= 0.7) return { label: 'Heavy', color: 'text-orange-400' };
  if (severity >= 0.4) return { label: 'Moderate', color: 'text-amber-400' };
  return { label: 'Light', color: 'text-yellow-400' };
}

function getSeverityBg(severity: number): string {
  if (severity >= 0.9) return 'bg-red-500/20 border-red-500/30';
  if (severity >= 0.7) return 'bg-orange-500/15 border-orange-500/25';
  if (severity >= 0.4) return 'bg-amber-500/12 border-amber-500/20';
  return 'bg-yellow-500/10 border-yellow-500/15';
}

export default function Dimension3Panel({ isActive, trafficTimeOffset, onTimeChange }: Props) {
  const currentEvent =
    TRAFFIC_EVENTS.find((event) => event.timeOffset === trafficTimeOffset) ?? TRAFFIC_EVENTS[0];

  return (
    <div className={`transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-40'}`}>
      <div className="flex items-center gap-3 mb-8">
        <span className="text-4xl font-black text-red-500/20 font-mono-code">D3</span>
        <div>
          <div className="text-[11px] font-mono-code text-red-400 uppercase tracking-widest mb-1">
            Dimension Three
          </div>
          <h2 className="text-2xl font-bold text-white">GNN Traffic Prediction</h2>
        </div>
      </div>

      {/* Crash alert */}
      <div className="bg-red-500/12 border border-red-500/30 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <AlertTriangle size={16} className="text-red-400 flex-shrink-0 mt-0.5 animate-pulse" />
          <div>
            <div className="text-sm font-semibold text-red-300 mb-1">
              Incident Report · NH-48 km 412
            </div>
            <p className="text-xs text-white/50 leading-relaxed">
              Multi-vehicle collision near Davanagere bypass at{' '}
              <span className="font-mono-code text-red-300">14:32 IST</span>. 2 lanes blocked.
              Emergency services en route. GNN model activated — propagating congestion predictions.
            </p>
            <div className="flex gap-3 mt-2">
              <span className="text-[10px] font-mono-code text-red-400 bg-red-500/15 px-2 py-0.5 rounded">
                SEVERITY: CRITICAL
              </span>
              <span className="text-[10px] font-mono-code text-white/30 bg-white/5 px-2 py-0.5 rounded">
                DVG · 14.46°N 75.92°E
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* GNN explanation */}
      <div className="bg-[hsl(215,28%,10%)] border border-[hsl(215,25%,18%)] rounded-xl p-5 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Brain size={14} className="text-purple-400" />
          <span className="text-xs font-mono-code text-purple-400 uppercase tracking-wider">
            Graph Neural Network
          </span>
        </div>
        <p className="text-xs text-white/50 leading-relaxed mb-3">
          A GNN treats the road network as a graph where each node aggregates information from its
          neighbors. After the Davanagere crash, the model propagates
          <span className="text-purple-400"> message-passing</span> across edges to predict which
          roads will be affected and when.
        </p>
        <div className="font-mono-code text-xs space-y-1">
          <div>
            <span className="text-purple-400">h_v</span>
            <span className="text-white/40">(t+1)</span> <span className="text-white/40">=</span>{' '}
            <span className="text-white/60">σ(W · AGG({`h_u(t)`} : u ∈ N(v)))</span>
          </div>
          <div className="text-white/25 text-[10px] mt-1">
            {'// h = hidden state, N(v) = neighbors of v, W = learned weights'}
          </div>
        </div>
      </div>

      {/* Time slider */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock size={14} className="text-amber-400" />
          <span className="text-xs text-white/40 uppercase tracking-wider">
            Simulation Timeline
          </span>
        </div>
        <div className="relative mb-4">
          <div className="flex gap-2">
            {TIME_STEPS.map((t) => (
              <button
                key={`time-${t}`}
                onClick={() => onTimeChange(t)}
                className={`flex-1 py-3 rounded-lg border text-center transition-all duration-200 active:scale-95 ${
                  trafficTimeOffset === t
                    ? t === 0
                      ? 'bg-red-500/20 border-red-500/40 text-red-300'
                      : t === 15
                        ? 'bg-orange-500/20 border-orange-500/40 text-orange-300'
                        : t === 30
                          ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                          : 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300'
                    : 'bg-white/3 border-white/8 text-white/40 hover:bg-white/6 hover:text-white/60'
                }`}
              >
                <div className="text-[10px] font-mono-code font-bold">
                  {t === 0 ? 'T+0' : `+${t}m`}
                </div>
                <div className="text-[9px] opacity-60 mt-0.5">
                  {t === 0 ? 'Crash' : t === 15 ? 'Wave' : t === 30 ? 'Spread' : 'Peak'}
                </div>
              </button>
            ))}
          </div>
          {/* Timeline connector */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-white/8 -z-10 mx-8" />
        </div>
      </div>

      {/* Current event description */}
      <div className="bg-amber-500/8 border border-amber-500/20 rounded-xl p-4 mb-5 dim-enter">
        <div className="flex items-center gap-2 mb-2">
          <Zap size={12} className="text-amber-400" />
          <span className="text-[11px] font-mono-code text-amber-400">
            {trafficTimeOffset === 0 ? '14:32 IST' : `14:${32 + trafficTimeOffset} IST`} · GNN
            Prediction
          </span>
        </div>
        <p className="text-xs text-white/60 leading-relaxed">{currentEvent.description}</p>
      </div>

      {/* Affected edges */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={14} className="text-white/40" />
          <span className="text-xs text-white/40 uppercase tracking-wider">
            Affected Road Segments
          </span>
        </div>
        <div className="space-y-2">
          {currentEvent.affectedEdges.map((ae) => {
            const edge =
              ROAD_EDGES.find((e) => e.from === ae.from && e.to === ae.to) ||
              ROAD_EDGES.find((e) => e.from === ae.to && e.to === ae.from);
            const fromNode = CITY_NODES.find((n) => n.id === ae.from)!;
            const toNode = CITY_NODES.find((n) => n.id === ae.to)!;
            const { label, color } = getSeverityLabel(ae.severity);
            const bgClass = getSeverityBg(ae.severity);

            return (
              <div
                key={`affected-${ae.from}-${ae.to}`}
                className={`flex items-center justify-between px-4 py-2.5 rounded-lg border ${bgClass}`}
              >
                <div className="flex items-center gap-3">
                  <div className="font-mono-code text-xs text-white/70">
                    {fromNode?.shortName} <span className="text-white/30">↔</span>{' '}
                    {toNode?.shortName}
                  </div>
                  <span className="text-[10px] text-white/30 font-mono-code">
                    {edge?.highway ?? 'NH-48'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${ae.severity * 100}%`,
                        background:
                          ae.severity >= 0.8
                            ? '#ef4444'
                            : ae.severity >= 0.5
                              ? '#f97316'
                              : '#f59e0b',
                      }}
                    />
                  </div>
                  <span className={`text-[10px] font-mono-code font-semibold ${color}`}>
                    {label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rerouting suggestion */}
      {trafficTimeOffset >= 30 && (
        <div className="bg-green-500/8 border border-green-500/20 rounded-xl p-4 dim-enter">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={12} className="text-green-400" />
            <span className="text-[11px] font-mono-code text-green-400 uppercase tracking-wider">
              Dynamic Reroute Suggested
            </span>
          </div>
          <p className="text-xs text-white/50 leading-relaxed mb-3">
            GNN confidence: <span className="text-green-400 font-mono-code">87.3%</span>. Avoid
            NH-48 Davanagere segment. Alternate via NH-67 (Chitradurga → Hubballi direct).
          </p>
          <div className="flex items-center gap-1.5 font-mono-code text-xs">
            <span className="text-white/60">MYS</span>
            <span className="text-white/30">→</span>
            <span className="text-white/60">BLR</span>
            <span className="text-white/30">→</span>
            <span className="text-white/60">CTG</span>
            <span className="text-white/30">→</span>
            <span className="text-green-400 font-semibold">HBL (NH-67)</span>
            <span className="text-white/30">→</span>
            <span className="text-white/60">BGM</span>
            <span className="ml-3 text-green-400">+43 km · saves ~2h</span>
          </div>
        </div>
      )}

      {/* Footer note */}
      <div className="mt-12 p-4 bg-white/3 rounded-xl border border-white/8">
        <p className="text-xs text-white/30 leading-relaxed">
          This simulation uses a simplified GNN model. Real Google Maps uses a proprietary
          spatio-temporal GNN trained on billions of GPS traces, incident reports, and historical
          traffic patterns across the global road network.
        </p>
      </div>
    </div>
  );
}
