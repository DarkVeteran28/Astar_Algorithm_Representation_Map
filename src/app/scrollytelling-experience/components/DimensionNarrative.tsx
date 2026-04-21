'use client';

import React from 'react';
import type { Dimension } from './ScrollytellingClient';
import Dimension0Panel from './panels/Dimension0Panel';
import Dimension1Panel from './panels/Dimension1Panel';
import Dimension2Panel from './panels/Dimension2Panel';
import type { AlgorithmStepData } from './data/dimensions';

interface Props {
  dimension: Dimension;
  algorithmStep: number;
  algorithmSteps: AlgorithmStepData[];
  origin: string | null;
  destination: string | null;
  selectionMode: 'origin' | 'destination';
  showHeuristicDetails: boolean;
  sectionRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  onNextAlgorithmStep: () => void;
  onPrevAlgorithmStep: () => void;
  onResetAlgorithm: () => void;
  onSetOrigin: (cityId: string) => void;
  onSetDestination: (cityId: string) => void;
  onSelectionModeChange: (mode: 'origin' | 'destination') => void;
  onShowHeuristicDetailsChange: (value: boolean) => void;
}

export default function DimensionNarrative({
  dimension,
  algorithmStep,
  algorithmSteps,
  origin,
  destination,
  selectionMode,
  showHeuristicDetails,
  sectionRefs,
  onNextAlgorithmStep,
  onPrevAlgorithmStep,
  onResetAlgorithm,
  onSetOrigin,
  onSetDestination,
  onSelectionModeChange,
  onShowHeuristicDetailsChange,
}: Props) {
  return (
    <div className="min-h-[300vh]">
      {/* Hero header */}
      <div className="sticky top-0 z-20 bg-[hsl(220,30%,6%)]/90 backdrop-blur-sm border-b border-[hsl(215,25%,12%)] px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">RouteDeconstruct</h1>
            <p className="text-[11px] text-white/40 font-mono mt-0.5">
              Karnataka Road Network · 3 Dimensions
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-sky-400 bg-sky-500/10 border border-sky-500/20 px-3 py-1 rounded-full">
              D{dimension} · {['GPS Map', 'Graph Theory', 'A* Search'][dimension]}
            </span>
          </div>
        </div>
      </div>

      {/* Dimension 0 */}
      <div
        ref={(el) => {
          sectionRefs.current[0] = el;
        }}
        className="min-h-screen px-8 py-16"
      >
        <Dimension0Panel
          isActive={dimension === 0}
          origin={origin}
          destination={destination}
          selectionMode={selectionMode}
          onSetOrigin={onSetOrigin}
          onSetDestination={onSetDestination}
          onSelectionModeChange={onSelectionModeChange}
        />
      </div>

      {/* Dimension 1 */}
      <div
        ref={(el) => {
          sectionRefs.current[1] = el;
        }}
        className="min-h-screen px-8 py-16 border-t border-[hsl(215,25%,10%)]"
      >
        <Dimension1Panel isActive={dimension === 1} />
      </div>

      {/* Dimension 2 */}
      <div
        ref={(el) => {
          sectionRefs.current[2] = el;
        }}
        className="min-h-screen px-8 py-16 border-t border-[hsl(215,25%,10%)]"
      >
        <Dimension2Panel
          isActive={dimension === 2}
          algorithmStep={algorithmStep}
          algorithmSteps={algorithmSteps}
          origin={origin}
          destination={destination}
          showHeuristicDetails={showHeuristicDetails}
          onNext={onNextAlgorithmStep}
          onPrev={onPrevAlgorithmStep}
          onReset={onResetAlgorithm}
          onShowHeuristicDetailsChange={onShowHeuristicDetailsChange}
        />
      </div>

      {/* Footer */}
      <div className="px-8 py-20 border-t border-[hsl(215,25%,10%)] text-center">
        <p className="text-white/20 text-sm">RouteDeconstruct · An Interactive Technical Paper</p>
        <p className="text-white/10 text-xs mt-2 font-mono">
          Built with Next.js · SVG · A* Algorithm
        </p>
      </div>
    </div>
  );
}
