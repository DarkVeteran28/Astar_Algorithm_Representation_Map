'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import KarnatakaCanvas from './KarnatakaCanvas';
import DimensionNarrative from './DimensionNarrative';
import { computeAStarSteps } from './data/dimensions';

export type Dimension = 0 | 1 | 2;

const DIMENSION_COUNT = 3;

export default function ScrollytellingClient() {
  const [dimension, setDimension] = useState<Dimension>(0);
  const [algorithmStep, setAlgorithmStep] = useState(0);
  const [origin, setOrigin] = useState<string | null>(null);
  const [destination, setDestination] = useState<string | null>(null);
  const [selectionMode, setSelectionMode] = useState<'origin' | 'destination'>('origin');
  const [morphProgress, setMorphProgress] = useState(0);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([null, null, null]);

  // ── Dynamically compute A* steps whenever origin/destination changes ──
  const dynamicAlgorithmSteps = useMemo(() => {
    if (origin && destination && origin !== destination) {
      return computeAStarSteps(origin, destination);
    }
    // Fallback: Mysore → Belagavi
    return computeAStarSteps('mysore', 'belagavi');
  }, [origin, destination]);

  // Reset step counter when route changes
  useEffect(() => {
    setAlgorithmStep(0);
  }, [origin, destination]);

  // ── Scroll State Machine ──
  useEffect(() => {
    const panel = rightPanelRef.current;
    if (!panel) return;

    const handleScroll = () => {
      const scrollTop = panel.scrollTop;
      const totalHeight = panel.scrollHeight - panel.clientHeight;
      if (totalHeight <= 0) return;

      const sectionHeight = totalHeight / DIMENSION_COUNT;
      const rawDim = Math.floor(scrollTop / sectionHeight);
      const clampedDim = Math.min(DIMENSION_COUNT - 1, Math.max(0, rawDim)) as Dimension;
      const sectionProgress = (scrollTop - clampedDim * sectionHeight) / sectionHeight;

      setDimension(clampedDim);
      setMorphProgress(Math.min(1, Math.max(0, sectionProgress)));
    };

    panel.addEventListener('scroll', handleScroll, { passive: true });
    return () => panel.removeEventListener('scroll', handleScroll);
  }, []);

  // ── City click handler — toggles origin/destination ──
  const handleCityClick = useCallback(
    (cityId: string) => {
      if (selectionMode === 'origin') {
        setOrigin(cityId);
        setSelectionMode('destination');
      } else {
        if (cityId === origin) {
          setOrigin(null);
          setSelectionMode('origin');
        } else {
          setDestination(cityId);
          setSelectionMode('origin');
        }
      }
    },
    [selectionMode, origin]
  );

  const handleSetOrigin = useCallback(
    (cityId: string) => {
      setOrigin(cityId);
      if (destination === cityId) setDestination(null);
    },
    [destination]
  );

  const handleSetDestination = useCallback(
    (cityId: string) => {
      setDestination(cityId);
      if (origin === cityId) setOrigin(null);
    },
    [origin]
  );

  const handleNextAlgorithmStep = useCallback(() => {
    setAlgorithmStep((prev) => Math.min(prev + 1, dynamicAlgorithmSteps.length - 1));
  }, [dynamicAlgorithmSteps.length]);

  const handlePrevAlgorithmStep = useCallback(() => {
    setAlgorithmStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const handleResetAlgorithm = useCallback(() => {
    setAlgorithmStep(0);
  }, []);

  const handleScrollToDimension = useCallback((dim: Dimension) => {
    const panel = rightPanelRef.current;
    if (!panel) return;
    const totalHeight = panel.scrollHeight - panel.clientHeight;
    const sectionHeight = totalHeight / DIMENSION_COUNT;
    panel.scrollTo({ top: dim * sectionHeight, behavior: 'smooth' });
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[hsl(220,30%,6%)]">
      {/* Left: Sticky SVG Canvas */}
      <div className="relative flex-shrink-0 w-[58%] h-full bg-[hsl(220,30%,6%)] border-r border-[hsl(215,25%,12%)]">
        <KarnatakaCanvas
          dimension={dimension}
          morphProgress={morphProgress}
          algorithmStep={algorithmStep}
          algorithmSteps={dynamicAlgorithmSteps}
          origin={origin}
          destination={destination}
          onCityClick={handleCityClick}
          selectionMode={selectionMode}
        />

        {/* Dimension indicator nav */}
        <div className="absolute top-5 left-5 flex flex-col gap-2">
          {([0, 1, 2] as Dimension[]).map((d) => (
            <button
              key={`dim-indicator-${d}`}
              onClick={() => handleScrollToDimension(d)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono transition-all duration-300 ${
                dimension === d
                  ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
                  : 'bg-white/5 text-white/30 border border-white/10 hover:text-white/50'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${dimension === d ? 'bg-sky-400' : 'bg-white/20'}`}
              />
              D{d}
            </button>
          ))}
        </div>

        {/* Bottom legend */}
        <div className="absolute bottom-5 left-5 right-5">
          <CanvasLegend dimension={dimension} />
        </div>
      </div>

      {/* Right: Scroll Narrative */}
      <div ref={rightPanelRef} className="flex-1 h-full overflow-y-auto">
        <DimensionNarrative
          dimension={dimension}
          algorithmStep={algorithmStep}
          algorithmSteps={dynamicAlgorithmSteps}
          origin={origin}
          destination={destination}
          selectionMode={selectionMode}
          sectionRefs={sectionRefs}
          onNextAlgorithmStep={handleNextAlgorithmStep}
          onPrevAlgorithmStep={handlePrevAlgorithmStep}
          onResetAlgorithm={handleResetAlgorithm}
          onSetOrigin={handleSetOrigin}
          onSetDestination={handleSetDestination}
          onSelectionModeChange={setSelectionMode}
        />
      </div>
    </div>
  );
}

function CanvasLegend({ dimension }: { dimension: Dimension }) {
  const legends: Record<Dimension, Array<{ color: string; label: string }>> = {
    0: [
      { color: 'bg-blue-500', label: 'Origin city' },
      { color: 'bg-red-500', label: 'Destination' },
      { color: 'bg-yellow-400', label: 'NH highway' },
      { color: 'bg-white/50', label: 'Primary road' },
    ],
    1: [
      { color: 'bg-sky-400', label: 'Graph node' },
      { color: 'bg-white/30', label: 'Graph edge' },
      { color: 'bg-purple-400', label: 'Grid overlay' },
    ],
    2: [
      { color: 'bg-sky-400', label: 'Frontier' },
      { color: 'bg-green-400', label: 'Visited' },
      { color: 'bg-amber-400', label: 'Current node' },
      { color: 'bg-white/20', label: 'Unvisited' },
    ],
  };

  return (
    <div className="flex flex-wrap gap-3">
      {legends[dimension].map((item) => (
        <div key={`legend-${item.label}`} className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${item.color}`} />
          <span className="text-[11px] text-white/40 font-mono">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
