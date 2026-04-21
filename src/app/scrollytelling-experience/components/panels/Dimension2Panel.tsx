'use client';

import React from 'react';
import { ChevronRight, ChevronLeft, RotateCcw, Terminal, Cpu, Eye, EyeOff } from 'lucide-react';
import { ALGORITHM_CODE_LINES } from '../data/dimensions';
import type { AlgorithmStepData } from '../data/dimensions';
import { CITY_NODES } from '../data/mapData';

interface Props {
  isActive: boolean;
  algorithmStep: number;
  algorithmSteps: AlgorithmStepData[];
  origin: string | null;
  destination: string | null;
  showHeuristicDetails: boolean;
  onNext: () => void;
  onPrev: () => void;
  onReset: () => void;
  onShowHeuristicDetailsChange: (value: boolean) => void;
}

export default function Dimension2Panel({
  isActive,
  algorithmStep,
  algorithmSteps,
  origin,
  destination,
  showHeuristicDetails,
  onNext,
  onPrev,
  onReset,
  onShowHeuristicDetailsChange,
}: Props) {
  const currentStep = algorithmSteps[algorithmStep];
  const isFirst = algorithmStep === 0;
  const isLast = algorithmStep === algorithmSteps.length - 1;
  const progress =
    algorithmSteps.length > 0 ? ((algorithmStep + 1) / algorithmSteps.length) * 100 : 0;

  const originNode = CITY_NODES.find((n) => n.id === origin);
  const destNode = CITY_NODES.find((n) => n.id === destination);
  const routeLabel =
    originNode && destNode
      ? `${originNode.name} → ${destNode.name}`
      : origin
        ? `${originNode?.name ?? origin} → (select destination)`
        : 'Select origin & destination on map';

  return (
    <div className={`transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-40'}`}>
      <div className="flex items-center gap-3 mb-8">
        <span className="text-4xl font-black text-green-500/20 font-mono-code">D2</span>
        <div>
          <div className="text-[11px] font-mono-code text-green-400 uppercase tracking-widest mb-1">
            Dimension Two
          </div>
          <h2 className="text-2xl font-bold text-white">A* Algorithm</h2>
        </div>
      </div>

      {/* Route indicator */}
      <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-white/5 border border-white/10 rounded-lg">
        <span className="text-[10px] font-mono-code text-white/40 uppercase tracking-wider">
          Route:
        </span>
        <span className="text-xs font-mono-code text-sky-300">{routeLabel}</span>
        {algorithmSteps.length === 0 && (
          <span className="ml-auto text-[10px] text-amber-400 font-mono-code">
            ← set both cities in D0
          </span>
        )}
      </div>

      <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-md">
        Step through the A* search manually. Each click updates both the code IDE and the map
        simultaneously. Watch the frontier expand and the optimal path crystallize.
      </p>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono-code text-white/40">
            Step {algorithmStep + 1} of {algorithmSteps.length}
          </span>
          <span className="text-[11px] font-mono-code text-green-400">
            {Math.round(progress)}% complete
          </span>
        </div>
        <div className="h-1 bg-white/8 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-sky-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="text-[11px] font-mono-code text-white/35">
          Heuristic postcard mirrors the selected node on the map.
        </div>
        <button
          onClick={() => onShowHeuristicDetailsChange(!showHeuristicDetails)}
          className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-[11px] font-mono-code transition-all ${
            showHeuristicDetails
              ? 'bg-sky-500/12 border-sky-500/30 text-sky-300'
              : 'bg-white/5 border-white/10 text-white/45 hover:text-white/65'
          }`}
        >
          {showHeuristicDetails ? <Eye size={12} /> : <EyeOff size={12} />}
          Show heuristic details {showHeuristicDetails ? 'ON' : 'OFF'}
        </button>
      </div>

      {/* Code IDE */}
      <div className="bg-[hsl(220,30%,5%)] border border-[hsl(215,25%,16%)] rounded-xl overflow-hidden mb-5">
        <div className="flex items-center justify-between px-4 py-2.5 bg-[hsl(215,28%,8%)] border-b border-[hsl(215,25%,14%)]">
          <div className="flex items-center gap-2">
            <Terminal size={12} className="text-green-400" />
            <span className="text-[11px] font-mono-code text-white/50">aStar.js</span>
          </div>
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
          </div>
        </div>
        <div className="p-3 overflow-x-auto">
          {ALGORITHM_CODE_LINES.map((lineData) => {
            const isHighlighted = lineData.line === currentStep?.lineIndex;
            return (
              <div
                key={`code-line-${lineData.line}`}
                className={`flex items-start gap-3 px-3 py-0.5 rounded transition-all duration-300 ${
                  isHighlighted
                    ? 'bg-sky-500/15 border-l-2 border-sky-500'
                    : 'border-l-2 border-transparent'
                }`}
              >
                <span className="text-[10px] font-mono-code text-white/20 w-5 flex-shrink-0 select-none mt-0.5 tabular-nums">
                  {lineData.line + 1}
                </span>
                <pre
                  className={`text-xs font-mono-code leading-5 ${
                    isHighlighted ? 'text-sky-200' : 'text-white/50'
                  } ${lineData.code === '' ? 'h-4' : ''}`}
                >
                  <SyntaxHighlight code={lineData.code} isHighlighted={isHighlighted} />
                </pre>
                {isHighlighted && (
                  <span className="ml-auto text-[9px] font-mono-code text-sky-400 bg-sky-500/20 px-1.5 py-0.5 rounded flex-shrink-0">
                    ← executing
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step description */}
      {currentStep && (
        <div className="bg-sky-500/8 border border-sky-500/20 rounded-xl p-4 mb-5 dim-enter">
          <div className="flex items-center gap-2 mb-2">
            <Cpu size={12} className="text-sky-400" />
            <span className="text-[11px] font-mono-code text-sky-400 uppercase tracking-wider">
              Execution State
            </span>
          </div>
          <p className="text-sm font-semibold text-white mb-2">{currentStep.description}</p>
          <p className="text-xs text-white/50 leading-relaxed">{currentStep.detail}</p>
        </div>
      )}

      {/* Algorithm state tables */}
      {currentStep && (
        <div className="grid grid-cols-2 gap-3 mb-5">
          {/* Open set / Frontier */}
          <div className="bg-[hsl(215,28%,10%)] border border-[hsl(215,25%,18%)] rounded-lg p-3">
            <div className="text-[10px] font-mono-code text-sky-400 uppercase tracking-wider mb-2">
              Open Set (Frontier)
            </div>
            {currentStep.frontier.length === 0 ? (
              <span className="text-xs text-white/30 font-mono-code">∅ empty</span>
            ) : (
              <div className="space-y-1">
                {currentStep.frontier.map((nodeId) => {
                  const node = CITY_NODES.find((n) => n.id === nodeId);
                  return (
                    <div key={`frontier-${nodeId}`} className="flex items-center justify-between">
                      <span className="text-xs text-sky-300 font-mono-code">
                        {node?.shortName ?? nodeId}
                      </span>
                      <span className="text-[10px] text-amber-400 font-mono-code tabular-nums">
                        f={currentStep.fCosts[nodeId] ?? '?'}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Closed set / Visited */}
          <div className="bg-[hsl(215,28%,10%)] border border-[hsl(215,25%,18%)] rounded-lg p-3">
            <div className="text-[10px] font-mono-code text-green-400 uppercase tracking-wider mb-2">
              Closed Set (Visited)
            </div>
            {currentStep.visited.length === 0 ? (
              <span className="text-xs text-white/30 font-mono-code">∅ empty</span>
            ) : (
              <div className="space-y-1">
                {currentStep.visited.map((nodeId) => {
                  const node = CITY_NODES.find((n) => n.id === nodeId);
                  return (
                    <div key={`visited-${nodeId}`} className="flex items-center justify-between">
                      <span className="text-xs text-green-300 font-mono-code">
                        {node?.shortName ?? nodeId}
                      </span>
                      <span className="text-[10px] text-white/40 font-mono-code tabular-nums">
                        g={currentStep.gCosts[nodeId] ?? '?'}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Current path */}
      {currentStep && currentStep.pathSoFar.length > 1 && (
        <div className="bg-amber-500/8 border border-amber-500/20 rounded-lg p-3 mb-5">
          <div className="text-[10px] font-mono-code text-amber-400 uppercase tracking-wider mb-2">
            Current Best Path
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {currentStep.pathSoFar.map((nodeId, idx) => {
              const node = CITY_NODES.find((n) => n.id === nodeId);
              return (
                <React.Fragment key={`path-node-${nodeId}`}>
                  <span className="text-xs text-amber-300 font-mono-code bg-amber-500/15 px-2 py-0.5 rounded">
                    {node?.shortName ?? nodeId}
                  </span>
                  {idx < currentStep.pathSoFar.length - 1 && (
                    <span className="text-white/30 text-xs">→</span>
                  )}
                </React.Fragment>
              );
            })}
            <span className="ml-2 text-xs text-amber-400 font-mono-code tabular-nums">
              {currentStep.gCosts[currentStep.pathSoFar[currentStep.pathSoFar.length - 1]] ?? 0} km
            </span>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={onReset}
          disabled={isFirst}
          className="flex items-center gap-1.5 px-3 py-2 bg-white/5 border border-white/10 text-white/50 rounded-lg text-xs font-mono-code hover:bg-white/8 hover:text-white/70 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
        >
          <RotateCcw size={12} />
          Reset
        </button>
        <button
          onClick={onPrev}
          disabled={isFirst}
          className="flex items-center gap-1.5 px-3 py-2 bg-white/5 border border-white/10 text-white/50 rounded-lg text-xs font-mono-code hover:bg-white/8 hover:text-white/70 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
        >
          <ChevronLeft size={12} />
          Prev
        </button>
        <button
          onClick={onNext}
          disabled={isLast || algorithmSteps.length === 0}
          className="flex items-center gap-2 px-5 py-2 bg-sky-500/20 border border-sky-500/40 text-sky-300 rounded-lg text-xs font-semibold font-mono-code hover:bg-sky-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
        >
          <ChevronRight size={12} />
          Next Step
        </button>
        {isLast && algorithmSteps.length > 0 && (
          <span className="text-xs text-green-400 font-mono-code flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Path found!
          </span>
        )}
      </div>

      <div className="mt-12 flex items-center gap-3 text-white/20">
        <div className="w-px h-12 bg-gradient-to-b from-white/20 to-transparent" />
        <span className="text-xs font-mono-code">
          Scroll to simulate real-world traffic disruption
        </span>
      </div>
    </div>
  );
}

function SyntaxHighlight({ code, isHighlighted }: { code: string; isHighlighted: boolean }) {
  if (!code) return null;
  const keywords = ['function', 'const', 'while', 'for', 'if', 'return', 'of', 'new'];
  const parts = code.split(/(\b(?:function|const|while|for|if|return|of|new)\b|\/\/.*$)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (keywords.includes(part.trim())) {
          return (
            <span
              key={`syn-${i}`}
              className={isHighlighted ? 'text-purple-300' : 'text-purple-400/70'}
            >
              {part}
            </span>
          );
        }
        if (part.startsWith('//')) {
          return (
            <span key={`syn-${i}`} className="text-white/25">
              {part}
            </span>
          );
        }
        return <span key={`syn-${i}`}>{part}</span>;
      })}
    </>
  );
}
