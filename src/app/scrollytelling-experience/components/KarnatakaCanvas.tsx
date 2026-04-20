'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { Dimension } from './ScrollytellingClient';
import {
  CITY_NODES,
  ROAD_EDGES,
  KARNATAKA_BOUNDARY,
  FOREST_PATCHES,
  SECONDARY_ROADS,
  GRID_LINES,
  ROAD_BADGES,
  RIVER_PATHS,
} from './data/mapData';
import type { AlgorithmStepData } from './data/dimensions';

interface Props {
  dimension: Dimension;
  morphProgress: number;
  algorithmStep: number;
  algorithmSteps: AlgorithmStepData[];
  origin: string | null;
  destination: string | null;
  onCityClick: (cityId: string) => void;
  selectionMode: 'origin' | 'destination';
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * Math.min(1, Math.max(0, t));
}

function getNodeColor(
  nodeId: string,
  dimension: Dimension,
  stepData: AlgorithmStepData | null
): string {
  if (dimension === 2 && stepData) {
    if (stepData.currentNode === nodeId) return '#f59e0b';
    if (stepData.visited.includes(nodeId)) return '#22c55e';
    if (stepData.frontier.includes(nodeId)) return '#0ea5e9';
    return 'rgba(80,80,100,0.6)';
  }
  return '#1a6b8a';
}

export default function KarnatakaCanvas({
  dimension,
  morphProgress,
  algorithmStep,
  algorithmSteps,
  origin,
  destination,
  onCityClick,
  selectionMode,
}: Props) {
  const [drawProgress, setDrawProgress] = useState(0);
  const [gridOpacity, setGridOpacity] = useState(0);
  const [pulseNodes, setPulseNodes] = useState<Set<string>>(new Set());
  const animFrameRef = useRef<number | null>(null);

  // Road draw-on animation on mount
  useEffect(() => {
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / 2800);
      setDrawProgress(progress);
      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      }
    };
    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Grid fade in dimension 1
  useEffect(() => {
    if (dimension >= 1) {
      setGridOpacity(Math.min(1, morphProgress * 2));
    } else {
      setGridOpacity(0);
    }
  }, [dimension, morphProgress]);

  // Node pulse on algorithm step change
  useEffect(() => {
    if (dimension === 2) {
      const step = algorithmSteps[algorithmStep];
      if (step) {
        const active = new Set([step.currentNode, ...step.frontier]);
        setPulseNodes(active);
        const t = setTimeout(() => setPulseNodes(new Set()), 1200);
        return () => clearTimeout(t);
      }
    }
  }, [algorithmStep, dimension, algorithmSteps]);

  const currentAlgStep = dimension === 2 ? (algorithmSteps[algorithmStep] ?? null) : null;

  // Morph interpolation — only applies in D1 transition
  // In D0: morphT = 0 (pure realistic map)
  // In D1+: morphT progresses to 1 (pure grid)
  const morphT = dimension >= 1 ? Math.min(1, morphProgress * 1.6) : 0;

  // Whether we're showing the realistic map (D0 only, never again after D1 starts)
  const showRealisticMap = dimension === 0;
  // Whether we're in the morph transition (D1 early)
  const inMorphTransition = dimension === 1 && morphT < 0.85;
  const getNodePos = (nodeId: string) => {
    const node = CITY_NODES.find((n) => n.id === nodeId)!;
    return {
      x: lerp(node.x, node.gridX, morphT),
      y: lerp(node.y, node.gridY, morphT),
    };
  };

  const isPathEdge = (edge: (typeof ROAD_EDGES)[0]): boolean => {
    if (!currentAlgStep) return false;
    const path = currentAlgStep.pathSoFar;
    for (let i = 0; i < path.length - 1; i++) {
      if (
        (path[i] === edge.from && path[i + 1] === edge.to) ||
        (path[i] === edge.to && path[i + 1] === edge.from)
      )
        return true;
    }
    return false;
  };

  const isFrontierEdge = (edge: (typeof ROAD_EDGES)[0]): boolean => {
    if (!currentAlgStep) return false;
    return currentAlgStep.frontier.includes(edge.from) || currentAlgStep.frontier.includes(edge.to);
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg
        viewBox="0 0 800 600"
        className="w-full h-full max-h-full"
        style={{ fontFamily: 'system-ui, sans-serif' }}
      >
        <defs>
          {/* Realistic map land gradient — warm parchment/topographic */}
          <linearGradient id="landGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e8dfc8" />
            <stop offset="40%" stopColor="#ddd4b8" />
            <stop offset="100%" stopColor="#d4c9a8" />
          </linearGradient>
          {/* Deccan plateau — slightly lighter/yellower */}
          <radialGradient id="plateauGrad" cx="65%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#e6dab8" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#d4c9a8" stopOpacity="0" />
          </radialGradient>
          {/* Western Ghats — darker green-brown */}
          <radialGradient id="ghatsGrad" cx="28%" cy="62%" r="40%">
            <stop offset="0%" stopColor="#b8c8a0" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#b8c8a0" stopOpacity="0" />
          </radialGradient>
          {/* Forest gradient */}
          <radialGradient id="forestGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(140,185,120,0.72)" />
            <stop offset="100%" stopColor="rgba(110,160,90,0.35)" />
          </radialGradient>
          {/* Dark grid background */}
          <linearGradient id="gridBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(220,30%,7%)" />
            <stop offset="100%" stopColor="hsl(220,30%,5%)" />
          </linearGradient>
          <filter id="glowFilter">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="labelShadow">
            <feDropShadow
              dx="0"
              dy="1"
              stdDeviation="1.5"
              floodColor="rgba(255,255,255,0.9)"
              floodOpacity="1"
            />
          </filter>
          <filter id="darkLabelShadow">
            <feDropShadow
              dx="0"
              dy="1"
              stdDeviation="2"
              floodColor="rgba(0,0,0,0.5)"
              floodOpacity="0.8"
            />
          </filter>
          <filter id="riverBlur">
            <feGaussianBlur stdDeviation="0.8" />
          </filter>
          <radialGradient id="nodeGlowAmber" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="nodeGlowGreen" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="nodeGlowSky" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
          </radialGradient>
          <clipPath id="karnatakaClip">
            <path d={KARNATAKA_BOUNDARY} />
          </clipPath>
          {/* Subtle paper texture pattern */}
          <pattern id="paperTexture" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
            <rect width="4" height="4" fill="none" />
            <circle cx="1" cy="1" r="0.3" fill="rgba(160,140,100,0.08)" />
            <circle cx="3" cy="3" r="0.3" fill="rgba(160,140,100,0.06)" />
          </pattern>
        </defs>

        {/* ════════════════════════════════════════════════════════════
            REALISTIC MAP LAYERS — D0 only, fade out during D1 morph
            ════════════════════════════════════════════════════════════ */}

        {/* Full canvas background — transitions from parchment to dark */}
        <rect
          width="800"
          height="600"
          fill={showRealisticMap || inMorphTransition ? 'url(#landGrad)' : 'url(#gridBg)'}
        />

        {/* Paper texture overlay (D0 only) */}
        {showRealisticMap && (
          <rect width="800" height="600" fill="url(#paperTexture)" opacity="0.8" />
        )}

        {/* Outer border/frame area — slightly darker than land (D0 only) */}
        {showRealisticMap && (
          <rect
            width="800"
            height="600"
            fill="none"
            stroke="rgba(160,140,100,0.3)"
            strokeWidth="1"
          />
        )}

        {/* Karnataka land fill with proper boundary */}
        {(showRealisticMap || inMorphTransition) && (
          <g opacity={lerp(1, 0, morphT * 1.8)}>
            {/* Base land color */}
            <path
              d={KARNATAKA_BOUNDARY}
              fill="url(#landGrad)"
              stroke="rgba(140,120,80,0.55)"
              strokeWidth="1.8"
            />
            {/* Plateau elevation overlay */}
            <path
              d={KARNATAKA_BOUNDARY}
              fill="url(#plateauGrad)"
              stroke="none"
              clipPath="url(#karnatakaClip)"
            />
            {/* Western Ghats green overlay */}
            <path
              d={KARNATAKA_BOUNDARY}
              fill="url(#ghatsGrad)"
              stroke="none"
              clipPath="url(#karnatakaClip)"
            />
            {/* Subtle inner shadow along border */}
            <path
              d={KARNATAKA_BOUNDARY}
              fill="none"
              stroke="rgba(100,80,40,0.18)"
              strokeWidth="6"
              clipPath="url(#karnatakaClip)"
            />
            {/* State border — crisp outer line */}
            <path
              d={KARNATAKA_BOUNDARY}
              fill="none"
              stroke="rgba(120,95,55,0.65)"
              strokeWidth="1.8"
              strokeDasharray="none"
            />
          </g>
        )}

        {/* Surrounding region (outside Karnataka) — slightly different tone */}
        {showRealisticMap && (
          <g>
            {/* Neighboring state fill — slightly cooler/greyer */}
            <rect width="800" height="600" fill="rgba(210,205,188,0.45)" />
            {/* Karnataka land on top */}
            <path d={KARNATAKA_BOUNDARY} fill="url(#landGrad)" />
            <path d={KARNATAKA_BOUNDARY} fill="url(#plateauGrad)" />
            <path d={KARNATAKA_BOUNDARY} fill="url(#ghatsGrad)" />
            {/* State border */}
            <path d={KARNATAKA_BOUNDARY} fill="none" stroke="rgba(120,95,55,0.7)" strokeWidth="2" />
            {/* Inner shadow */}
            <path
              d={KARNATAKA_BOUNDARY}
              fill="none"
              stroke="rgba(100,80,40,0.15)"
              strokeWidth="8"
              clipPath="url(#karnatakaClip)"
            />
          </g>
        )}

        {/* Forest patches (D0 only) */}
        {showRealisticMap &&
          FOREST_PATCHES.map((patch) => (
            <ellipse
              key={patch.id}
              cx={patch.cx}
              cy={patch.cy}
              rx={patch.rx}
              ry={patch.ry}
              fill="url(#forestGrad)"
              clipPath="url(#karnatakaClip)"
            />
          ))}

        {/* Forest / Malnad label (D0 only) */}
        {showRealisticMap && (
          <>
            <text
              x="268"
              y="372"
              fill="rgba(70,120,60,0.75)"
              fontSize="9"
              fontStyle="italic"
              textAnchor="middle"
              fontWeight="600"
            >
              Western Ghats
            </text>
            <text
              x="268"
              y="383"
              fill="rgba(70,120,60,0.6)"
              fontSize="8"
              fontStyle="italic"
              textAnchor="middle"
            >
              Malnad Region
            </text>
          </>
        )}

        {/* Rivers (D0 only) */}
        {showRealisticMap &&
          RIVER_PATHS.map((river) => (
            <g key={river.id}>
              {/* River casing (slightly wider, lighter) */}
              <path
                d={river.path}
                fill="none"
                stroke="rgba(140,195,220,0.35)"
                strokeWidth="3.5"
                strokeLinecap="round"
                filter="url(#riverBlur)"
              />
              {/* River main line */}
              <path
                d={river.path}
                fill="none"
                stroke="rgba(90,160,200,0.65)"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              {/* River label */}
              {river.label && (
                <text
                  fill="rgba(50,120,170,0.7)"
                  fontSize="8.5"
                  fontStyle="italic"
                  fontWeight="500"
                  textAnchor="middle"
                >
                  <textPath href={`#${river.id}`} startOffset="50%">
                    {river.label}
                  </textPath>
                </text>
              )}
            </g>
          ))}

        {/* Invisible river paths for textPath (D0 only) */}
        {showRealisticMap && (
          <defs>
            {RIVER_PATHS.map((river) => (
              <path key={`rp-${river.id}`} id={river.id} d={river.path} />
            ))}
          </defs>
        )}

        {/* ── LAYER: Grid overlay (D1+) ── */}
        {gridOpacity > 0 && (
          <g opacity={gridOpacity * 0.28}>
            {GRID_LINES.horizontal.map((y) => (
              <line
                key={`hgrid-${y}`}
                x1="80"
                y1={y}
                x2="720"
                y2={y}
                stroke="#7c3aed"
                strokeWidth="0.5"
                strokeDasharray="4 8"
              />
            ))}
            {GRID_LINES.vertical.map((x) => (
              <line
                key={`vgrid-${x}`}
                x1={x}
                y1="55"
                x2={x}
                y2="540"
                stroke="#7c3aed"
                strokeWidth="0.5"
                strokeDasharray="4 8"
              />
            ))}
          </g>
        )}

        {/* ── LAYER: Secondary roads ── */}
        <g>
          {SECONDARY_ROADS.map((road, i) => {
            const edgeDrawStart = i * 0.06;
            const edgeProgress = Math.min(1, Math.max(0, (drawProgress - edgeDrawStart) / 0.3));
            const pathLen = 250;
            // In D0: warm grey roads; in D1+: fade out
            const roadOpacity = showRealisticMap
              ? road.opacity
              : inMorphTransition
                ? road.opacity * (1 - morphT)
                : 0;
            if (roadOpacity <= 0) return null;
            return (
              <path
                key={road.id}
                d={road.path}
                fill="none"
                stroke={
                  showRealisticMap
                    ? `rgba(175,162,140,${roadOpacity})`
                    : `rgba(80,80,80,${roadOpacity})`
                }
                strokeWidth={showRealisticMap ? 1.4 : 0.8}
                strokeDasharray={drawProgress < 1 ? pathLen : 'none'}
                strokeDashoffset={drawProgress < 1 ? pathLen * (1 - edgeProgress) : 0}
              />
            );
          })}
        </g>

        {/* ── LAYER: Main road edges ── */}
        {ROAD_EDGES.map((edge, edgeIdx) => {
          const fromPos = getNodePos(edge.from);
          const toPos = getNodePos(edge.to);
          const cp = edge.controlPoints?.[0];

          const morphedCpX = cp
            ? lerp(cp.x, (fromPos.x + toPos.x) / 2, morphT)
            : (fromPos.x + toPos.x) / 2;
          const morphedCpY = cp
            ? lerp(cp.y, (fromPos.y + toPos.y) / 2, morphT)
            : (fromPos.y + toPos.y) / 2;

          const pathD =
            morphT > 0.6
              ? `M ${fromPos.x},${fromPos.y} L ${toPos.x},${toPos.y}`
              : `M ${fromPos.x},${fromPos.y} Q ${morphedCpX},${morphedCpY} ${toPos.x},${toPos.y}`;

          const isPath = isPathEdge(edge);
          const isFrontier = isFrontierEdge(edge);

          let strokeColor: string;
          let strokeWidth: number;
          let casingColor: string | null = null;
          let casingWidth = 0;

          if (dimension === 2) {
            if (isPath) {
              strokeColor = '#f59e0b';
              strokeWidth = 3.5;
            } else if (isFrontier) {
              strokeColor = 'rgba(14,165,233,0.55)';
              strokeWidth = 2;
            } else {
              strokeColor = 'rgba(120,120,140,0.3)';
              strokeWidth = 1.5;
            }
          } else if (dimension === 1) {
            strokeColor = `rgba(${lerp(160, 100, morphT)},${lerp(148, 100, morphT)},${lerp(130, 120, morphT)},${lerp(0.55, 0.35, morphT)})`;
            strokeWidth = edge.tier === 'highway' ? lerp(2.8, 2, morphT) : lerp(1.8, 1.2, morphT);
          } else {
            // D0 — realistic map road colors
            if (edge.tier === 'highway') {
              // National highways: golden yellow with white casing
              strokeColor = 'rgba(255,195,40,0.92)';
              strokeWidth = 3.2;
              casingColor = 'rgba(200,170,60,0.45)';
              casingWidth = 5.5;
            } else if (edge.tier === 'primary') {
              // Primary roads: warm white/cream
              strokeColor = 'rgba(255,252,240,0.88)';
              strokeWidth = 2.0;
              casingColor = 'rgba(180,165,130,0.4)';
              casingWidth = 3.5;
            } else {
              // Secondary roads: light grey
              strokeColor = 'rgba(210,200,182,0.72)';
              strokeWidth = 1.4;
            }
          }

          const edgeDrawStart = edgeIdx * 0.08;
          const edgeDrawEnd = edgeDrawStart + 0.4;
          const edgeProgress = Math.min(
            1,
            Math.max(0, (drawProgress - edgeDrawStart) / (edgeDrawEnd - edgeDrawStart))
          );
          const pathLength = 400;
          const dashOffset = pathLength * (1 - edgeProgress);

          return (
            <g key={edge.id}>
              {/* Road casing (D0 only) */}
              {dimension === 0 && casingColor && edgeProgress > 0.3 && (
                <path
                  d={pathD}
                  fill="none"
                  stroke={casingColor}
                  strokeWidth={casingWidth}
                  strokeLinecap="round"
                />
              )}
              {/* Glow for path edges */}
              {isPath && (
                <path
                  d={pathD}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="8"
                  opacity="0.2"
                  filter="url(#softGlow)"
                />
              )}
              <path
                d={pathD}
                fill="none"
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={drawProgress < 1 ? pathLength : 'none'}
                strokeDashoffset={drawProgress < 1 ? dashOffset : 0}
                style={{ transition: 'stroke 0.5s ease, stroke-width 0.4s ease' }}
              />
              {/* Highway label in D0 */}
              {dimension === 0 && edge.tier === 'highway' && edgeProgress > 0.85 && (
                <text
                  x={(fromPos.x + toPos.x) / 2 + (morphedCpX - (fromPos.x + toPos.x) / 2) * 0.2}
                  y={(fromPos.y + toPos.y) / 2 + (morphedCpY - (fromPos.y + toPos.y) / 2) * 0.2 - 8}
                  fill="rgba(90,70,20,0.72)"
                  fontSize="7.5"
                  textAnchor="middle"
                  fontWeight="700"
                >
                  {edge.highway}
                </text>
              )}
              {/* Edge weight in D1+ */}
              {dimension >= 1 && morphT > 0.4 && (
                <text
                  x={(fromPos.x + toPos.x) / 2}
                  y={(fromPos.y + toPos.y) / 2 - 9}
                  fill={isPath ? '#f59e0b' : 'rgba(148,163,184,0.55)'}
                  fontSize="9"
                  textAnchor="middle"
                  fontWeight={isPath ? '700' : '400'}
                  fontFamily="JetBrains Mono, monospace"
                >
                  {edge.distanceKm}
                </text>
              )}
            </g>
          );
        })}

        {/* ── LAYER: Road number badges (D0 only) ── */}
        {dimension === 0 &&
          drawProgress > 0.7 &&
          ROAD_BADGES.map((badge) => (
            <g key={badge.id} opacity={Math.min(1, (drawProgress - 0.7) / 0.3)}>
              <rect
                x={badge.x - 18}
                y={badge.y - 8}
                width={36}
                height={16}
                rx={3}
                fill={badge.color}
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="0.8"
              />
              <text
                x={badge.x}
                y={badge.y + 4}
                fill="white"
                fontSize="7.5"
                fontWeight="700"
                textAnchor="middle"
                letterSpacing="0.3"
              >
                {badge.label}
              </text>
            </g>
          ))}

        {/* ── LAYER: City nodes ── */}
        {CITY_NODES.map((node) => {
          const pos = getNodePos(node.id);
          const nodeColor = getNodeColor(node.id, dimension, currentAlgStep);
          const isOrigin = origin === node.id;
          const isDest = destination === node.id;
          const isSelected = isOrigin || isDest;
          const isPulsing = pulseNodes.has(node.id);
          const isCurrentAlg = currentAlgStep?.currentNode === node.id;

          const nodeSize = isSelected ? 9 : 7;
          const morphedSize = lerp(nodeSize, nodeSize * 1.1, morphT);

          const realisticDotColor = isOrigin ? '#1a73e8' : isDest ? '#ea4335' : '#5a4a2a';
          const actualColor = dimension === 0 ? realisticDotColor : nodeColor;

          return (
            <g key={node.id} onClick={() => onCityClick(node.id)} style={{ cursor: 'pointer' }}>
              {/* Pulse ring */}
              {(isPulsing || isSelected) && (
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={morphedSize + 10}
                  fill="none"
                  stroke={isOrigin ? '#1a73e8' : isDest ? '#ea4335' : actualColor}
                  strokeWidth="1.5"
                  opacity="0.45"
                />
              )}

              {/* Outer glow (D1+ only) */}
              {dimension >= 1 && (
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={morphedSize + 7}
                  fill={
                    isCurrentAlg
                      ? 'url(#nodeGlowAmber)'
                      : currentAlgStep?.visited.includes(node.id)
                        ? 'url(#nodeGlowGreen)'
                        : 'url(#nodeGlowSky)'
                  }
                />
              )}

              {/* Main node shape */}
              {dimension >= 1 && morphT > 0.35 ? (
                // Diamond shape for graph view
                <polygon
                  points={`${pos.x},${pos.y - morphedSize * 1.4} ${pos.x + morphedSize * 1.4},${pos.y} ${pos.x},${pos.y + morphedSize * 1.4} ${pos.x - morphedSize * 1.4},${pos.y}`}
                  fill={actualColor}
                  opacity={0.92}
                  stroke={isSelected ? '#ffffff' : 'rgba(255,255,255,0.2)'}
                  strokeWidth={isSelected ? 1.5 : 0.5}
                  style={{ transition: 'fill 0.5s ease' }}
                  filter={isSelected ? 'url(#glowFilter)' : undefined}
                />
              ) : dimension === 0 ? (
                // Realistic map city dot — styled like Google Maps
                <g>
                  {/* Drop shadow */}
                  <circle
                    cx={pos.x + 0.5}
                    cy={pos.y + 1}
                    r={morphedSize * 0.85}
                    fill="rgba(0,0,0,0.18)"
                  />
                  {/* White halo */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={morphedSize + (isSelected ? 3 : 1.5)}
                    fill="white"
                    opacity={0.92}
                  />
                  {/* Colored fill */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={morphedSize}
                    fill={actualColor}
                    opacity={0.95}
                    style={{ transition: 'fill 0.3s ease' }}
                  />
                  {/* Inner highlight */}
                  <circle
                    cx={pos.x - morphedSize * 0.25}
                    cy={pos.y - morphedSize * 0.25}
                    r={morphedSize * 0.35}
                    fill="rgba(255,255,255,0.45)"
                  />
                </g>
              ) : (
                // Morph transition — circle
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={morphedSize}
                  fill={actualColor}
                  opacity={0.92}
                  stroke="white"
                  strokeWidth={isSelected ? 2 : 1.2}
                  style={{ transition: 'fill 0.5s ease' }}
                  filter={isSelected ? 'url(#glowFilter)' : undefined}
                />
              )}

              {/* City name — English */}
              <text
                x={pos.x}
                y={pos.y - morphedSize - (dimension === 0 ? 9 : 7)}
                fill={dimension === 0 ? 'rgba(25,25,35,0.95)' : 'rgba(255,255,255,0.95)'}
                fontSize={isSelected ? 13 : dimension === 0 ? 11.5 : 11}
                fontWeight={isSelected ? '700' : dimension === 0 ? '600' : '600'}
                textAnchor="middle"
                filter={dimension === 0 ? 'url(#labelShadow)' : 'url(#darkLabelShadow)'}
                letterSpacing={dimension === 0 ? '0.2' : '0'}
              >
                {node.name}
              </text>

              {/* Kannada script label (D0 only) */}
              {dimension === 0 && (
                <text
                  x={pos.x}
                  y={pos.y - morphedSize - 21}
                  fill="rgba(55,50,70,0.62)"
                  fontSize="8.5"
                  textAnchor="middle"
                  filter="url(#labelShadow)"
                >
                  {node.nameKannada}
                </text>
              )}

              {/* Population label (D0, selected cities only) */}
              {dimension === 0 && isSelected && (
                <text
                  x={pos.x}
                  y={pos.y + morphedSize + 14}
                  fill={isOrigin ? 'rgba(26,115,232,0.8)' : 'rgba(234,67,53,0.8)'}
                  fontSize="8"
                  textAnchor="middle"
                  fontWeight="600"
                >
                  Pop: {node.population}
                </text>
              )}

              {/* Origin / Destination badge */}
              {isOrigin && (
                <g>
                  <rect
                    x={pos.x + morphedSize + 4}
                    y={pos.y - 9}
                    width={30}
                    height={16}
                    rx={4}
                    fill="#1a73e8"
                    filter="url(#glowFilter)"
                  />
                  <text
                    x={pos.x + morphedSize + 19}
                    y={pos.y + 4}
                    fill="white"
                    fontSize="7.5"
                    fontWeight="700"
                    textAnchor="middle"
                  >
                    FROM
                  </text>
                </g>
              )}
              {isDest && (
                <g>
                  <rect
                    x={pos.x + morphedSize + 4}
                    y={pos.y - 9}
                    width={22}
                    height={16}
                    rx={4}
                    fill="#ea4335"
                    filter="url(#glowFilter)"
                  />
                  <text
                    x={pos.x + morphedSize + 15}
                    y={pos.y + 4}
                    fill="white"
                    fontSize="7.5"
                    fontWeight="700"
                    textAnchor="middle"
                  >
                    TO
                  </text>
                </g>
              )}

              {/* f(n) cost label in Dimension 2 */}
              {dimension === 2 &&
                currentAlgStep &&
                currentAlgStep.fCosts[node.id] !== undefined && (
                  <g>
                    <rect
                      x={pos.x + 12}
                      y={pos.y - 10}
                      width={52}
                      height={18}
                      rx={3}
                      fill="rgba(0,0,0,0.75)"
                      stroke={actualColor}
                      strokeWidth="0.5"
                    />
                    <text
                      x={pos.x + 38}
                      y={pos.y + 4}
                      fill={actualColor}
                      fontSize="9"
                      textAnchor="middle"
                      fontFamily="JetBrains Mono, monospace"
                    >
                      f={currentAlgStep.fCosts[node.id]}
                    </text>
                  </g>
                )}
            </g>
          );
        })}

        {/* ── LAYER: Selection mode hint (D0 only) ── */}
        {dimension === 0 && (
          <g>
            <rect
              x="560"
              y="18"
              width="220"
              height="34"
              rx="7"
              fill="rgba(255,255,255,0.88)"
              stroke="rgba(160,140,100,0.4)"
              strokeWidth="1"
            />
            <circle
              cx="580"
              cy="35"
              r="6"
              fill={selectionMode === 'origin' ? '#1a73e8' : '#ea4335'}
            />
            <text x="592" y="39" fill="rgba(30,30,40,0.88)" fontSize="10.5" fontWeight="600">
              {selectionMode === 'origin' ? 'Click to set origin' : 'Click to set destination'}
            </text>
          </g>
        )}

        {/* ── LAYER: Map title (D0 only) ── */}
        {dimension === 0 && (
          <g>
            <rect
              x="12"
              y="12"
              width="148"
              height="42"
              rx="5"
              fill="rgba(255,255,255,0.82)"
              stroke="rgba(160,140,100,0.35)"
              strokeWidth="1"
            />
            <text
              x="22"
              y="30"
              fill="rgba(30,25,15,0.9)"
              fontSize="11"
              fontWeight="700"
              letterSpacing="0.5"
            >
              Karnataka
            </text>
            <text x="22" y="44" fill="rgba(80,70,50,0.7)" fontSize="8.5" fontStyle="italic">
              Road Network Map
            </text>
          </g>
        )}

        {/* ── LAYER: Compass rose ── */}
        <g transform="translate(748, 72)" opacity={dimension === 0 ? 0.55 : 0.2}>
          <circle
            cx="0"
            cy="0"
            r="18"
            fill={dimension === 0 ? 'rgba(255,255,255,0.7)' : 'none'}
            stroke={dimension === 0 ? 'rgba(120,100,60,0.4)' : 'rgba(100,100,120,0.4)'}
            strokeWidth="1"
          />
          <text
            x="0"
            y="-22"
            textAnchor="middle"
            fill={dimension === 0 ? 'rgba(60,50,30,0.8)' : 'rgba(80,80,100,0.7)'}
            fontSize="9"
            fontWeight="700"
          >
            N
          </text>
          <path
            d="M0,-14 L3,-4 L0,0 L-3,-4 Z"
            fill={dimension === 0 ? 'rgba(60,50,30,0.7)' : 'rgba(80,80,100,0.6)'}
          />
          <path
            d="M0,14 L3,4 L0,0 L-3,4 Z"
            fill={dimension === 0 ? 'rgba(60,50,30,0.3)' : 'rgba(80,80,100,0.25)'}
          />
        </g>

        {/* ── LAYER: Scale bar ── */}
        <g transform="translate(80, 558)" opacity={dimension === 0 ? 0.65 : 0.3}>
          <line
            x1="0"
            y1="0"
            x2="65"
            y2="0"
            stroke={dimension === 0 ? 'rgba(60,50,30,0.7)' : 'rgba(80,80,100,0.6)'}
            strokeWidth="1.2"
          />
          <line
            x1="0"
            y1="-5"
            x2="0"
            y2="5"
            stroke={dimension === 0 ? 'rgba(60,50,30,0.7)' : 'rgba(80,80,100,0.6)'}
            strokeWidth="1.2"
          />
          <line
            x1="65"
            y1="-5"
            x2="65"
            y2="5"
            stroke={dimension === 0 ? 'rgba(60,50,30,0.7)' : 'rgba(80,80,100,0.6)'}
            strokeWidth="1.2"
          />
          <text
            x="32"
            y="-8"
            textAnchor="middle"
            fill={dimension === 0 ? 'rgba(60,50,30,0.7)' : 'rgba(80,80,100,0.6)'}
            fontSize="9"
            fontWeight="500"
          >
            100 km
          </text>
        </g>

        {/* ── LAYER: Dimension watermark ── */}
        <text
          x="400"
          y="582"
          textAnchor="middle"
          fill={dimension === 0 ? 'rgba(100,80,40,0.05)' : 'rgba(14,165,233,0.07)'}
          fontSize="58"
          fontWeight="800"
          letterSpacing="8"
        >
          D{dimension}
        </text>
      </svg>
    </div>
  );
}
