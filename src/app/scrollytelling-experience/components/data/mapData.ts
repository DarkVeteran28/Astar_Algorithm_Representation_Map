export interface CityNode {
  id: string;
  name: string;
  nameKannada: string;
  shortName: string;
  x: number;
  y: number;
  gridX: number;
  gridY: number;
  description: string;
  population: string;
  nhConnections: string[];
  isForest?: boolean;
}

export interface RoadEdge {
  id: string;
  from: string;
  to: string;
  highway: string;
  distanceKm: number;
  tier: 'highway' | 'primary' | 'secondary';
  controlPoints?: Array<{ x: number; y: number }>;
}

export interface TrafficAffectedEdge {
  from: string;
  to: string;
  severity: number;
}

export interface TrafficEvent {
  timeOffset: number;
  description: string;
  affectedEdges: TrafficAffectedEdge[];
}

// GPS-accurate Karnataka node positions mapped to SVG 800x600
export const CITY_NODES: CityNode[] = [
  {
    id: 'belagavi',
    name: 'Belagavi',
    nameKannada: 'ಬೆಳಗಾವಿ',
    shortName: 'BGM',
    x: 195,
    y: 108,
    gridX: 180,
    gridY: 90,
    description: 'Northern gateway of Karnataka. Major commercial and industrial city.',
    population: '5.0L',
    nhConnections: ['NH-48', 'NH-748'],
  },
  {
    id: 'hubballi',
    name: 'Hubballi',
    nameKannada: 'ಹುಬ್ಬಳ್ಳಿ',
    shortName: 'HBL',
    x: 285,
    y: 188,
    gridX: 280,
    gridY: 170,
    description: 'Commercial hub of North Karnataka. Twin city with Dharwad.',
    population: '9.4L',
    nhConnections: ['NH-48', 'NH-67', 'NH-748'],
  },
  {
    id: 'davanagere',
    name: 'Davanagere',
    nameKannada: 'ದಾವಣಗೆರೆ',
    shortName: 'DVG',
    x: 390,
    y: 268,
    gridX: 400,
    gridY: 250,
    description: 'Textile hub of Karnataka. Central NH-48 corridor city.',
    population: '4.3L',
    nhConnections: ['NH-48'],
  },
  {
    id: 'chitradurga',
    name: 'Chitradurga',
    nameKannada: 'ಚಿತ್ರದುರ್ಗ',
    shortName: 'CTG',
    x: 468,
    y: 308,
    gridX: 500,
    gridY: 290,
    description: 'Fort city. Central Karnataka junction on NH-48.',
    population: '1.8L',
    nhConnections: ['NH-48', 'NH-67'],
  },
  {
    id: 'shivamogga',
    name: 'Shivamogga',
    nameKannada: 'ಶಿವಮೊಗ್ಗ',
    shortName: 'SMG',
    x: 310,
    y: 355,
    gridX: 300,
    gridY: 350,
    description: 'Gateway to Malnad region. Surrounded by forest and rivers.',
    population: '3.2L',
    nhConnections: ['NH-169', 'NH-206'],
    isForest: true,
  },
  {
    id: 'hassan',
    name: 'Hassan',
    nameKannada: 'ಹಾಸನ',
    shortName: 'HSN',
    x: 398,
    y: 432,
    gridX: 400,
    gridY: 415,
    description: 'Gateway to Hoysala heritage sites. Agricultural hub.',
    population: '1.3L',
    nhConnections: ['NH-75', 'NH-373'],
  },
  {
    id: 'tumkur',
    name: 'Tumkur',
    nameKannada: 'ತುಮಕೂರು',
    shortName: 'TMK',
    x: 548,
    y: 390,
    gridX: 560,
    gridY: 370,
    description: 'Industrial city north of Bangalore. Coconut capital of Karnataka.',
    population: '3.0L',
    nhConnections: ['NH-48', 'NH-206'],
  },
  {
    id: 'bangalore',
    name: 'Bengaluru',
    nameKannada: 'ಬೆಂಗಳೂರು',
    shortName: 'BLR',
    x: 610,
    y: 455,
    gridX: 640,
    gridY: 435,
    description: 'Silicon Valley of India. Major routing hub.',
    population: '1.2Cr',
    nhConnections: ['NH-275', 'NH-48', 'NH-44'],
  },
  {
    id: 'mysore',
    name: 'Mysore',
    nameKannada: 'ಮೈಸೂರು',
    shortName: 'MYS',
    x: 510,
    y: 510,
    gridX: 540,
    gridY: 495,
    description: 'Cultural capital of Karnataka. Palace city.',
    population: '9.2L',
    nhConnections: ['NH-275', 'NH-766'],
  },
  {
    id: 'mangaluru',
    name: 'Mangaluru',
    nameKannada: 'ಮಂಗಳೂರು',
    shortName: 'MNG',
    x: 218,
    y: 468,
    gridX: 200,
    gridY: 455,
    description: 'Port city on the Arabian Sea coast. Gateway to coastal Karnataka.',
    population: '4.9L',
    nhConnections: ['NH-75', 'NH-169'],
  },
];

export const ROAD_EDGES: RoadEdge[] = [
  // NH-48 backbone (Bangalore–Pune highway)
  {
    id: 'bangalore-tumkur',
    from: 'bangalore',
    to: 'tumkur',
    highway: 'NH-48',
    distanceKm: 70,
    tier: 'highway',
    controlPoints: [{ x: 580, y: 422 }],
  },
  {
    id: 'tumkur-chitradurga',
    from: 'tumkur',
    to: 'chitradurga',
    highway: 'NH-48',
    distanceKm: 132,
    tier: 'highway',
    controlPoints: [{ x: 508, y: 348 }],
  },
  {
    id: 'chitradurga-davanagere',
    from: 'chitradurga',
    to: 'davanagere',
    highway: 'NH-48',
    distanceKm: 68,
    tier: 'highway',
    controlPoints: [{ x: 428, y: 288 }],
  },
  {
    id: 'davanagere-hubballi',
    from: 'davanagere',
    to: 'hubballi',
    highway: 'NH-48',
    distanceKm: 98,
    tier: 'highway',
    controlPoints: [{ x: 336, y: 228 }],
  },
  {
    id: 'hubballi-belagavi',
    from: 'hubballi',
    to: 'belagavi',
    highway: 'NH-48',
    distanceKm: 97,
    tier: 'highway',
    controlPoints: [{ x: 238, y: 148 }],
  },
  // NH-275 (Mysore–Bangalore expressway)
  {
    id: 'mysore-bangalore',
    from: 'mysore',
    to: 'bangalore',
    highway: 'NH-275',
    distanceKm: 143,
    tier: 'highway',
    controlPoints: [{ x: 562, y: 482 }],
  },
  // NH-75 (Mangaluru–Hassan–Bangalore)
  {
    id: 'mangaluru-hassan',
    from: 'mangaluru',
    to: 'hassan',
    highway: 'NH-75',
    distanceKm: 178,
    tier: 'highway',
    controlPoints: [{ x: 308, y: 450 }],
  },
  {
    id: 'hassan-bangalore',
    from: 'hassan',
    to: 'bangalore',
    highway: 'NH-75',
    distanceKm: 187,
    tier: 'highway',
    controlPoints: [{ x: 505, y: 443 }],
  },
  // NH-169 (Shivamogga–Mangaluru)
  {
    id: 'shivamogga-mangaluru',
    from: 'shivamogga',
    to: 'mangaluru',
    highway: 'NH-169',
    distanceKm: 165,
    tier: 'primary',
    controlPoints: [{ x: 262, y: 412 }],
  },
  // Secondary connections
  {
    id: 'shivamogga-davanagere',
    from: 'shivamogga',
    to: 'davanagere',
    highway: 'NH-206',
    distanceKm: 112,
    tier: 'primary',
    controlPoints: [{ x: 350, y: 310 }],
  },
  {
    id: 'shivamogga-hassan',
    from: 'shivamogga',
    to: 'hassan',
    highway: 'SH-57',
    distanceKm: 98,
    tier: 'secondary',
    controlPoints: [{ x: 354, y: 394 }],
  },
  {
    id: 'hassan-mysore',
    from: 'hassan',
    to: 'mysore',
    highway: 'NH-275',
    distanceKm: 118,
    tier: 'primary',
    controlPoints: [{ x: 455, y: 471 }],
  },
  {
    id: 'chitradurga-hubballi',
    from: 'chitradurga',
    to: 'hubballi',
    highway: 'NH-67',
    distanceKm: 181,
    tier: 'primary',
    controlPoints: [{ x: 376, y: 248 }],
  },
];

// Karnataka state boundary — proper closed polygon, no sea cutoff
// Represents the actual state border on all sides
export const KARNATAKA_BOUNDARY = `
  M 148,62
  L 185,52 L 240,48 L 298,50 L 358,46 L 418,48 L 478,52 L 535,56 L 588,64
  L 632,78 L 662,98 L 680,125 L 688,158 L 685,195 L 675,235 L 660,275
  L 648,315 L 638,355 L 625,392 L 608,425 L 585,455 L 558,478 L 528,496
  L 495,510 L 460,518 L 422,516 L 385,510 L 348,500 L 312,488 L 278,474
  L 245,458 L 215,440 L 188,420 L 165,396 L 148,368 L 136,338 L 128,305
  L 124,270 L 122,235 L 124,200 L 128,168 L 135,138 L 142,110 L 148,82
  Z
`;

// Forest patches (green areas — Malnad/Western Ghats region)
export const FOREST_PATCHES = [
  { id: 'forest-1', cx: 268, cy: 385, rx: 42, ry: 30 },
  { id: 'forest-2', cx: 232, cy: 335, rx: 32, ry: 24 },
  { id: 'forest-3', cx: 295, cy: 428, rx: 36, ry: 22 },
  { id: 'forest-4', cx: 350, cy: 368, rx: 24, ry: 20 },
  { id: 'forest-5', cx: 210, cy: 408, rx: 22, ry: 18 },
  { id: 'forest-6', cx: 248, cy: 302, rx: 20, ry: 16 },
  { id: 'forest-7', cx: 185, cy: 362, rx: 18, ry: 14 },
];

// River paths for geographic realism
export const RIVER_PATHS = [
  // Tungabhadra river
  {
    id: 'river-tungabhadra',
    path: 'M 310,355 Q 360,340 410,332 Q 455,325 498,318 Q 540,312 578,308',
    label: 'Tungabhadra',
    labelX: 445,
    labelY: 320,
    labelAngle: -5,
  },
  // Krishna river (north)
  {
    id: 'river-krishna',
    path: 'M 148,168 Q 195,158 248,152 Q 295,148 340,145 Q 388,142 428,138',
    label: 'Krishna',
    labelX: 290,
    labelY: 140,
    labelAngle: -3,
  },
  // Cauvery river (south)
  {
    id: 'river-cauvery',
    path: 'M 398,432 Q 445,448 488,462 Q 530,475 568,482 Q 598,488 622,492',
    label: 'Cauvery',
    labelX: 510,
    labelY: 488,
    labelAngle: 5,
  },
  // Sharavati river (west)
  {
    id: 'river-sharavati',
    path: 'M 218,468 Q 238,440 255,412 Q 270,385 278,355',
    label: '',
    labelX: 0,
    labelY: 0,
    labelAngle: 0,
  },
];

// Terrain elevation zones (lighter = higher elevation / Deccan plateau)
export const TERRAIN_ZONES = [
  // Deccan plateau (central-east) — slightly lighter
  { id: 'terrain-deccan', cx: 540, cy: 310, rx: 160, ry: 120, color: 'rgba(235,225,200,0.35)' },
  // Western Ghats (west) — darker green-brown
  { id: 'terrain-ghats', cx: 240, cy: 380, rx: 80, ry: 140, color: 'rgba(180,200,160,0.28)' },
  // Northern plains
  { id: 'terrain-north', cx: 340, cy: 155, rx: 180, ry: 80, color: 'rgba(240,232,210,0.22)' },
];

// Secondary road network for visual richness
export const SECONDARY_ROADS = [
  { id: 'sec-1', path: 'M 510,510 Q 478,498 448,485 Q 418,472 388,458', opacity: 0.35 },
  { id: 'sec-2', path: 'M 610,455 Q 638,432 658,408 Q 672,385 678,360', opacity: 0.3 },
  { id: 'sec-3', path: 'M 468,308 Q 495,322 520,338 Q 545,352 568,368', opacity: 0.3 },
  { id: 'sec-4', path: 'M 285,188 Q 262,232 250,278 Q 238,322 232,365', opacity: 0.35 },
  { id: 'sec-5', path: 'M 195,108 Q 170,138 155,170 Q 142,202 138,235', opacity: 0.3 },
  { id: 'sec-6', path: 'M 390,268 Q 358,295 328,318 Q 300,340 278,362', opacity: 0.32 },
  { id: 'sec-7', path: 'M 610,455 Q 588,478 558,496 Q 532,512 505,520', opacity: 0.28 },
  { id: 'sec-8', path: 'M 218,468 Q 245,455 272,442 Q 298,430 322,418', opacity: 0.3 },
  { id: 'sec-9', path: 'M 398,432 Q 425,420 450,410 Q 475,400 498,392', opacity: 0.28 },
  { id: 'sec-10', path: 'M 548,390 Q 528,408 510,425 Q 492,442 478,458', opacity: 0.28 },
  { id: 'sec-11', path: 'M 285,188 Q 320,198 355,210 Q 388,222 420,235', opacity: 0.25 },
  { id: 'sec-12', path: 'M 195,108 Q 228,118 262,128 Q 295,138 325,148', opacity: 0.25 },
];

// Grid lines for Dimension 1
export const GRID_LINES = {
  horizontal: [80, 140, 200, 260, 320, 380, 440, 500, 560],
  vertical: [80, 150, 220, 290, 360, 430, 500, 570, 640, 700],
};

// Road number badges positions
export const ROAD_BADGES = [
  { id: 'badge-nh48', label: 'NH 48', x: 340, y: 240, color: '#2d6a4f' },
  { id: 'badge-nh275', label: 'NH 275', x: 558, y: 484, color: '#2d6a4f' },
  { id: 'badge-nh75', label: 'NH 75', x: 308, y: 458, color: '#2d6a4f' },
  { id: 'badge-nh169', label: 'NH 169', x: 255, y: 415, color: '#2d6a4f' },
  { id: 'badge-nh206', label: 'NH 206', x: 352, y: 312, color: '#1a5276' },
];

export const TRAFFIC_EVENTS: TrafficEvent[] = [
  {
    timeOffset: 0,
    description:
      'Crash detected at Davanagere. The model flags the NH-48 corridor as unstable and starts forecasting immediate spillback on the nearest segment.',
    affectedEdges: [
      { from: 'davanagere', to: 'chitradurga', severity: 0.95 },
      { from: 'davanagere', to: 'hubballi', severity: 0.88 },
    ],
  },
  {
    timeOffset: 15,
    description:
      'Congestion wave reaches the next highway hops. Queueing begins to affect approach speeds from Chitradurga and propagates northwest toward Hubballi.',
    affectedEdges: [
      { from: 'davanagere', to: 'chitradurga', severity: 0.92 },
      { from: 'davanagere', to: 'hubballi', severity: 0.9 },
      { from: 'tumkur', to: 'chitradurga', severity: 0.58 },
      { from: 'chitradurga', to: 'hubballi', severity: 0.52 },
    ],
  },
  {
    timeOffset: 30,
    description:
      'The GNN predicts broader network effects. Drivers are rerouting, secondary bottlenecks emerge, and the Chitradurga junction becomes the key pressure point.',
    affectedEdges: [
      { from: 'davanagere', to: 'chitradurga', severity: 0.9 },
      { from: 'davanagere', to: 'hubballi', severity: 0.86 },
      { from: 'tumkur', to: 'chitradurga', severity: 0.72 },
      { from: 'chitradurga', to: 'hubballi', severity: 0.68 },
      { from: 'shivamogga', to: 'davanagere', severity: 0.48 },
    ],
  },
  {
    timeOffset: 45,
    description:
      'Peak disruption window. The primary NH-48 spine stays saturated, and the model recommends diverting through the NH-67 branch to avoid compounding delays.',
    affectedEdges: [
      { from: 'davanagere', to: 'chitradurga', severity: 0.93 },
      { from: 'davanagere', to: 'hubballi', severity: 0.89 },
      { from: 'tumkur', to: 'chitradurga', severity: 0.78 },
      { from: 'chitradurga', to: 'hubballi', severity: 0.76 },
      { from: 'hubballi', to: 'belagavi', severity: 0.44 },
      { from: 'shivamogga', to: 'davanagere', severity: 0.55 },
    ],
  },
];
