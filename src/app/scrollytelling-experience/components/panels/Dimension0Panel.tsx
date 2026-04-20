'use client';

import React from 'react';
import { MapPin, Navigation, Info, ArrowRight } from 'lucide-react';
import { CITY_NODES } from '../data/mapData';

interface Props {
  isActive: boolean;
  origin: string | null;
  destination: string | null;
  selectionMode: 'origin' | 'destination';
  onSetOrigin: (cityId: string) => void;
  onSetDestination: (cityId: string) => void;
  onSelectionModeChange: (mode: 'origin' | 'destination') => void;
}

export default function Dimension0Panel({
  isActive,
  origin,
  destination,
  selectionMode,
  onSetOrigin,
  onSetDestination,
  onSelectionModeChange,
}: Props) {
  const originCity = CITY_NODES.find((c) => c.id === origin);
  const destCity = CITY_NODES.find((c) => c.id === destination);

  return (
    <div className={`transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-40'}`}>
      {/* Dimension label */}
      <div className="flex items-center gap-3 mb-8">
        <span className="text-4xl font-black text-sky-500/20 font-mono">D0</span>
        <div>
          <div className="text-[11px] font-mono text-sky-400 uppercase tracking-widest mb-1">
            Dimension Zero
          </div>
          <h2 className="text-2xl font-bold text-white">The Physical World</h2>
        </div>
      </div>

      <p className="text-white/60 text-sm leading-relaxed mb-8 max-w-md">
        Before any algorithm runs, there is geography. Ten cities encoded as latitude/longitude
        pairs, connected by national highways.{' '}
        <span className="text-sky-400 font-mono">Click any city on the map</span> to set your origin
        and destination.
      </p>

      {/* Selection mode toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => onSelectionModeChange('origin')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-xs font-semibold transition-all duration-200 ${
            selectionMode === 'origin'
              ? 'bg-blue-500/20 border-blue-500/50 text-blue-300'
              : 'bg-white/5 border-white/10 text-white/40 hover:text-white/60'
          }`}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-blue-400" />
          Set Origin
        </button>
        <button
          onClick={() => onSelectionModeChange('destination')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-xs font-semibold transition-all duration-200 ${
            selectionMode === 'destination'
              ? 'bg-red-500/20 border-red-500/50 text-red-300'
              : 'bg-white/5 border-white/10 text-white/40 hover:text-white/60'
          }`}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
          Set Destination
        </button>
      </div>

      {/* Route summary */}
      {(originCity || destCity) && (
        <div className="bg-[hsl(215,28%,10%)] border border-[hsl(215,25%,18%)] rounded-xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Navigation size={14} className="text-sky-400" />
            <span className="text-xs font-mono text-sky-400 uppercase tracking-wider">
              Selected Route
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="text-[10px] text-white/30 uppercase tracking-wider mb-1">From</div>
              {originCity ? (
                <div>
                  <div className="text-sm font-semibold text-blue-300">{originCity.name}</div>
                  <div className="text-[10px] text-white/40 font-mono">
                    {originCity.nameKannada}
                  </div>
                </div>
              ) : (
                <div className="text-sm text-white/25 italic">Not selected</div>
              )}
            </div>
            <ArrowRight size={16} className="text-white/20 flex-shrink-0" />
            <div className="flex-1">
              <div className="text-[10px] text-white/30 uppercase tracking-wider mb-1">To</div>
              {destCity ? (
                <div>
                  <div className="text-sm font-semibold text-red-300">{destCity.name}</div>
                  <div className="text-[10px] text-white/40 font-mono">{destCity.nameKannada}</div>
                </div>
              ) : (
                <div className="text-sm text-white/25 italic">Not selected</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* City grid — click to set origin or destination */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <MapPin size={14} className="text-white/40" />
          <span className="text-xs text-white/40 uppercase tracking-wider">
            {selectionMode === 'origin' ? 'Select origin city' : 'Select destination city'}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {CITY_NODES.map((city) => {
            const isOrigin = origin === city.id;
            const isDest = destination === city.id;
            return (
              <div key={`city-row-${city.id}`} className="flex gap-1">
                <button
                  onClick={() => onSetOrigin(city.id)}
                  title="Set as origin"
                  className={`flex-shrink-0 w-7 h-full rounded-l-lg border flex items-center justify-center transition-all duration-150 ${
                    isOrigin
                      ? 'bg-blue-500/25 border-blue-500/50 text-blue-300'
                      : 'bg-white/3 border-white/8 text-white/25 hover:bg-blue-500/10 hover:border-blue-500/30 hover:text-blue-300'
                  }`}
                >
                  <div className="w-2 h-2 rounded-full bg-current" />
                </button>
                <button
                  onClick={() => {
                    if (selectionMode === 'origin') onSetOrigin(city.id);
                    else onSetDestination(city.id);
                  }}
                  className={`flex-1 flex items-center gap-2.5 px-3 py-2.5 border text-left transition-all duration-200 ${
                    isOrigin
                      ? 'bg-blue-500/12 border-blue-500/35 text-blue-200'
                      : isDest
                        ? 'bg-red-500/12 border-red-500/35 text-red-200'
                        : 'bg-white/3 border-white/8 text-white/60 hover:bg-white/6 hover:border-white/15 hover:text-white/80'
                  }`}
                >
                  <div>
                    <div className="text-xs font-semibold">{city.name}</div>
                    <div className="text-[9px] opacity-55 font-mono">
                      {city.nameKannada} · {city.shortName}
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => onSetDestination(city.id)}
                  title="Set as destination"
                  className={`flex-shrink-0 w-7 h-full rounded-r-lg border flex items-center justify-center transition-all duration-150 ${
                    isDest
                      ? 'bg-red-500/25 border-red-500/50 text-red-300'
                      : 'bg-white/3 border-white/8 text-white/25 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-300'
                  }`}
                >
                  <MapPin size={10} className="text-current" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected city detail */}
      {(originCity || destCity) && (
        <div className="space-y-3 mb-6">
          {originCity && (
            <div className="bg-blue-500/8 border border-blue-500/20 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-blue-300 mb-0.5">
                    {originCity.name} — Origin
                  </div>
                  <p className="text-xs text-white/45 leading-relaxed mb-2">
                    {originCity.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {originCity.nhConnections.map((nh) => (
                      <span
                        key={`nh-o-${nh}`}
                        className="text-[9px] font-mono bg-white/8 text-white/45 px-2 py-0.5 rounded"
                      >
                        {nh}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          {destCity && (
            <div className="bg-red-500/8 border border-red-500/20 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
                  <MapPin size={12} className="text-red-400" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-red-300 mb-0.5">
                    {destCity.name} — Destination
                  </div>
                  <p className="text-xs text-white/45 leading-relaxed mb-2">
                    {destCity.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {destCity.nhConnections.map((nh) => (
                      <span
                        key={`nh-d-${nh}`}
                        className="text-[9px] font-mono bg-white/8 text-white/45 px-2 py-0.5 rounded"
                      >
                        {nh}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* GPS insight */}
      <div className="flex items-start gap-3 p-4 bg-white/3 rounded-xl border border-white/8">
        <Info size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-white/40 leading-relaxed">
          GPS coordinates are encoded as floating-point pairs in the routing graph. The map you see
          is a projection — real routing engines operate on raw lat/long values, not any visual
          representation. Click cities on the map or use the buttons above.
        </p>
      </div>

      {/* Scroll hint */}
      <div className="mt-12 flex items-center gap-3 text-white/20">
        <div className="w-px h-12 bg-gradient-to-b from-white/20 to-transparent" />
        <span className="text-xs font-mono">Scroll to transform into graph space</span>
      </div>
    </div>
  );
}
