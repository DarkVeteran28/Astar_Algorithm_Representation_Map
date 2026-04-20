'use client';

import React, { useEffect, useState } from 'react';
import { X, ChevronRight, Map, GitBranch, Code, Activity, Sparkles } from 'lucide-react';

interface Props {
  step: number;
  onNext: () => void;
  onSkip: () => void;
  onComplete: () => void;
  totalSteps: number;
}

const TOUR_STEPS = [
  {
    icon: Sparkles,
    title: 'Welcome to RouteDeconstruct',
    description:
      "This is an interactive technical paper. We're going to disassemble the Google Maps routing engine — layer by layer — using the Mysore → Belagavi route as our specimen.",
    highlight: null,
    position: 'center',
  },
  {
    icon: Map,
    title: 'The Sticky Canvas',
    description:
      'The left panel is your GPS-accurate Karnataka map. It stays fixed while you scroll. Watch it transform as you move through each dimension — from real geography to pure mathematics.',
    highlight: 'tour-canvas',
    position: 'right',
  },
  {
    icon: GitBranch,
    title: 'Four Dimensions',
    description:
      'Scroll the right panel to move through D0 → D1 → D2 → D3. Each scroll section transforms the map: GPS map → graph grid → A* search → GNN traffic prediction.',
    highlight: 'tour-narrative',
    position: 'left',
  },
  {
    icon: Code,
    title: 'A* Step Debugger',
    description:
      "In Dimension 2, you'll manually step through A* code. Each click highlights a line AND updates the map simultaneously. You're the CPU.",
    highlight: 'tour-algorithm',
    position: 'left',
  },
  {
    icon: Activity,
    title: 'GNN Traffic Simulation',
    description:
      'In Dimension 3, a crash at Davanagere triggers a Graph Neural Network prediction. Use the timeline to watch congestion ripple through the network at +15, +30, +45 minutes.',
    highlight: 'tour-traffic',
    position: 'left',
  },
];

export default function TooltipTour({ step, onNext, onSkip, onComplete, totalSteps }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  const currentTourStep = TOUR_STEPS[step];
  if (!currentTourStep) return null;

  const isLast = step === totalSteps - 1;
  const Icon = currentTourStep.icon;

  const handleNext = () => {
    if (isLast) {
      onComplete();
    } else {
      onNext();
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onSkip} />

      {/* Tour card */}
      <div className="relative z-10 w-full max-w-md mx-6">
        <div className="bg-[hsl(215,28%,10%)] border border-[hsl(215,25%,22%)] rounded-2xl overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-white/8">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center">
                  <Icon size={18} className="text-sky-400" />
                </div>
                <div>
                  <div className="text-[10px] font-mono-code text-sky-400 uppercase tracking-widest mb-0.5">
                    Step {step + 1} of {totalSteps}
                  </div>
                  <h3 className="text-base font-bold text-white">{currentTourStep.title}</h3>
                </div>
              </div>
              <button
                onClick={onSkip}
                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white/70 transition-all"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-5">
            <p className="text-sm text-white/60 leading-relaxed">{currentTourStep.description}</p>
          </div>

          {/* Progress + actions */}
          <div className="px-6 pb-6">
            {/* Progress dots */}
            <div className="flex items-center gap-1.5 mb-5">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={`tour-dot-${i}`}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    i === step
                      ? 'w-6 bg-sky-400'
                      : i < step
                        ? 'w-1.5 bg-sky-500/40'
                        : 'w-1.5 bg-white/15'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={onSkip}
                className="text-xs text-white/30 hover:text-white/50 transition-colors font-mono-code"
              >
                Skip tour
              </button>
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-5 py-2.5 bg-sky-500/25 hover:bg-sky-500/35 border border-sky-500/40 text-sky-300 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95"
              >
                {isLast ? 'Begin Experience' : 'Next'}
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
