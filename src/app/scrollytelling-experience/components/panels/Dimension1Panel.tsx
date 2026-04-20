'use client';

import React from 'react';
import { GitBranch, Weight, Hash, Info } from 'lucide-react';
import { ROAD_EDGES, CITY_NODES } from '../data/mapData';

interface Props {
  isActive: boolean;
}

export default function Dimension1Panel({ isActive }: Props) {
  return (
    <div className={`transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-40'}`}>
      <div className="flex items-center gap-3 mb-8">
        <span className="text-4xl font-black text-purple-500/20 font-mono-code">D1</span>
        <div>
          <div className="text-[11px] font-mono-code text-purple-400 uppercase tracking-widest mb-1">
            Dimension One
          </div>
          <h2 className="text-2xl font-bold text-white">Graph Abstraction</h2>
        </div>
      </div>

      <p className="text-white/60 text-sm leading-relaxed mb-8 max-w-md">
        The first mathematical transformation. Geography collapses into graph theory. Roads
        straighten into <span className="text-purple-400 font-mono-code">edges</span>. Cities morph
        into diamond-shaped <span className="text-purple-400 font-mono-code">nodes</span>. Distance
        in kilometers becomes{' '}
        <span className="text-amber-400 font-mono-code">edge weight w(e)</span>.
      </p>

      {/* Graph definition */}
      <div className="bg-[hsl(215,28%,10%)] border border-[hsl(215,25%,18%)] rounded-xl p-5 mb-6 font-mono">
        <div className="text-[10px] text-white/30 uppercase tracking-wider mb-3">
          Formal Definition
        </div>
        <div className="space-y-1.5 text-sm">
          <div>
            <span className="text-purple-400">G</span> <span className="text-white/40">=</span>{' '}
            <span className="text-white/70">(V, E, w)</span>
          </div>
          <div>
            <span className="text-purple-400">V</span> <span className="text-white/40">=</span>{' '}
            <span className="text-white/70">
              {`{`}Belagavi, Hubballi, Davanagere, Chitradurga, Shivamogga, Hassan, Tumkur,
              Bengaluru, Mysore, Mangaluru{`}`}
            </span>
          </div>
          <div>
            <span className="text-purple-400">|V|</span> <span className="text-white/40">=</span>{' '}
            <span className="text-amber-400">10</span>
          </div>
          <div>
            <span className="text-purple-400">|E|</span> <span className="text-white/40">=</span>{' '}
            <span className="text-amber-400">13</span>
          </div>
          <div>
            <span className="text-purple-400">w</span>
            <span className="text-white/40">(e)</span> <span className="text-white/40">=</span>{' '}
            <span className="text-white/70">distance in km</span>
          </div>
        </div>
      </div>

      {/* Edge table */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <GitBranch size={14} className="text-purple-400" />
          <span className="text-xs text-white/40 uppercase tracking-wider">Edge Set E</span>
        </div>
        <div className="space-y-1.5">
          {ROAD_EDGES.map((edge) => {
            const fromNode = CITY_NODES.find((n) => n.id === edge.from)!;
            const toNode = CITY_NODES.find((n) => n.id === edge.to)!;
            return (
              <div
                key={`edge-row-${edge.id}`}
                className="flex items-center justify-between px-4 py-2.5 bg-white/3 rounded-lg border border-white/6 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 font-mono-code text-xs">
                    <span className="text-purple-300">{fromNode.shortName}</span>
                    <span className="text-white/30">→</span>
                    <span className="text-purple-300">{toNode.shortName}</span>
                  </div>
                  <span className="text-[10px] text-white/30 bg-white/5 px-2 py-0.5 rounded font-mono-code">
                    {edge.highway}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Weight size={10} className="text-amber-400" />
                  <span className="text-sm font-bold text-amber-400 font-mono-code tabular-nums">
                    {edge.distanceKm}
                  </span>
                  <span className="text-[10px] text-white/30">km</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Heuristic explanation */}
      <div className="bg-amber-500/8 border border-amber-500/20 rounded-xl p-5 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Hash size={14} className="text-amber-400" />
          <span className="text-xs font-mono-code text-amber-400 uppercase tracking-wider">
            Heuristic Function h(n)
          </span>
        </div>
        <p className="text-xs text-white/50 leading-relaxed mb-3">
          A* uses a heuristic to estimate remaining distance. We use the Haversine formula —
          straight-line distance between node n and Belagavi. This is admissible (never
          overestimates).
        </p>
        <div className="font-mono-code text-xs space-y-1">
          <div>
            <span className="text-amber-400">h</span>
            <span className="text-white/40">(Mysore)</span> <span className="text-white/40">=</span>{' '}
            <span className="text-white/70">487 km</span>
          </div>
          <div>
            <span className="text-amber-400">h</span>
            <span className="text-white/40">(Bangalore)</span>{' '}
            <span className="text-white/40">=</span> <span className="text-white/70">502 km</span>
          </div>
          <div>
            <span className="text-amber-400">h</span>
            <span className="text-white/40">(Chitradurga)</span>{' '}
            <span className="text-white/40">=</span> <span className="text-white/70">214 km</span>
          </div>
          <div>
            <span className="text-amber-400">h</span>
            <span className="text-white/40">(Davanagere)</span>{' '}
            <span className="text-white/40">=</span> <span className="text-white/70">183 km</span>
          </div>
          <div>
            <span className="text-amber-400">h</span>
            <span className="text-white/40">(Hubballi)</span>{' '}
            <span className="text-white/40">=</span> <span className="text-white/70">74 km</span>
          </div>
          <div>
            <span className="text-amber-400">h</span>
            <span className="text-white/40">(Belagavi)</span>{' '}
            <span className="text-white/40">=</span> <span className="text-amber-400">0 km</span>{' '}
            <span className="text-white/30">{'// goal node'}</span>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-3 p-4 bg-white/3 rounded-xl border border-white/8">
        <Info size={14} className="text-sky-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-white/40 leading-relaxed">
          The grid overlay you see on the map is the geometric regularization step — Google Maps
          internally works with an adjacency list, not a visual grid. The grid is a pedagogical
          metaphor for the graph data structure.
        </p>
      </div>

      <div className="mt-12 flex items-center gap-3 text-white/20">
        <div className="w-px h-12 bg-gradient-to-b from-white/20 to-transparent" />
        <span className="text-xs font-mono">Scroll to run A* step by step</span>
      </div>
    </div>
  );
}
