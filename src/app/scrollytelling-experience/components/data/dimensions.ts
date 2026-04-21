import { CITY_NODES, ROAD_EDGES } from './mapData';

export interface DimensionData {
  id: number;
  title: string;
  subtitle: string;
  tagline: string;
  description: string;
  algorithmSteps?: AlgorithmStepData[];
}

export interface AlgorithmStepData {
  step: number;
  lineIndex: number;
  currentNode: string;
  frontier: string[];
  visited: string[];
  pathSoFar: string[];
  gCosts: Record<string, number>;
  fCosts: Record<string, number>;
  selectedNode: {
    id: string;
    x: number;
    y: number;
    g: number;
    h: number;
    f: number;
  };
  openSetDetails: Array<{
    id: string;
    x: number;
    y: number;
    g: number;
    h: number;
    f: number;
  }>;
  description: string;
  detail: string;
  explanation: string;
}

export const ALGORITHM_CODE_LINES = [
  { line: 0, code: 'function aStar(graph, start, goal) {' },
  { line: 1, code: '  const openSet = new PriorityQueue();' },
  { line: 2, code: '  const gCost = { [start]: 0 };' },
  { line: 3, code: '  const fCost = { [start]: heuristic(start, goal) };' },
  { line: 4, code: '  openSet.push(start, fCost[start]);' },
  { line: 5, code: '' },
  { line: 6, code: '  while (!openSet.isEmpty()) {' },
  { line: 7, code: '    const current = openSet.pop(); // lowest f(n)' },
  { line: 8, code: '    if (current === goal) return reconstructPath();' },
  { line: 9, code: '' },
  { line: 10, code: '    for (const neighbor of graph[current]) {' },
  { line: 11, code: '      const tentG = gCost[current] + neighbor.weight;' },
  { line: 12, code: '      if (tentG < (gCost[neighbor.id] ?? Infinity)) {' },
  { line: 13, code: '        gCost[neighbor.id] = tentG;' },
  { line: 14, code: '        fCost[neighbor.id] = tentG + heuristic(neighbor.id, goal);' },
  { line: 15, code: '        openSet.push(neighbor.id, fCost[neighbor.id]);' },
  { line: 16, code: '      }' },
  { line: 17, code: '    }' },
  { line: 18, code: '  }' },
  { line: 19, code: '  return null; // no path found' },
  { line: 20, code: '}' },
];

// ── Dynamic A* step generator ──────────────────────────────────────────────
// Computes A* steps between any two cities in the Karnataka graph.
// Returns an array of AlgorithmStepData for the IDE stepper.

function euclideanDist(aId: string, bId: string): number {
  const a = CITY_NODES.find((n) => n.id === aId);
  const b = CITY_NODES.find((n) => n.id === bId);
  if (!a || !b) return 999;
  // Use SVG coordinates as proxy for geographic distance
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  // Scale: ~1 SVG unit ≈ 1.8 km based on the map scale
  return Math.round(Math.sqrt(dx * dx + dy * dy) * 1.8);
}

function buildAdjacency(): Record<string, Array<{ id: string; weight: number; highway: string }>> {
  const adj: Record<string, Array<{ id: string; weight: number; highway: string }>> = {};
  CITY_NODES.forEach((n) => {
    adj[n.id] = [];
  });
  ROAD_EDGES.forEach((e) => {
    adj[e.from].push({ id: e.to, weight: e.distanceKm, highway: e.highway });
    adj[e.to].push({ id: e.from, weight: e.distanceKm, highway: e.highway });
  });
  return adj;
}

export function computeAStarSteps(startId: string, goalId: string): AlgorithmStepData[] {
  if (!startId || !goalId || startId === goalId) return [];

  const adj = buildAdjacency();
  const steps: AlgorithmStepData[] = [];

  const gCost: Record<string, number> = {};
  const fCost: Record<string, number> = {};
  const cameFrom: Record<string, string | null> = {};
  const visited: string[] = [];
  // Priority queue as sorted array
  const openSet: string[] = [];

  gCost[startId] = 0;
  fCost[startId] = euclideanDist(startId, goalId);
  openSet.push(startId);
  cameFrom[startId] = null;

  const getPath = (nodeId: string): string[] => {
    const path: string[] = [];
    let cur: string | null = nodeId;
    while (cur !== null && cur !== undefined) {
      path.unshift(cur);
      cur = cameFrom[cur] ?? null;
    }
    return path;
  };

  const getNodeMetrics = (nodeId: string) => {
    const node = CITY_NODES.find((n) => n.id === nodeId);
    const g = gCost[nodeId] ?? 0;
    const f = fCost[nodeId] ?? g + euclideanDist(nodeId, goalId);
    const h = Math.max(0, f - g);

    return {
      id: nodeId,
      x: node?.gridX ?? node?.x ?? 0,
      y: node?.gridY ?? node?.y ?? 0,
      g,
      h,
      f,
    };
  };

  const buildCandidateDetails = (nodeIds: string[]) =>
    nodeIds
      .map((nodeId) => getNodeMetrics(nodeId))
      .sort((a, b) => a.f - b.f || a.h - b.h || a.g - b.g);

  const getStartNode = CITY_NODES.find((n) => n.id === startId);
  const getGoalNode = CITY_NODES.find((n) => n.id === goalId);
  const startName = getStartNode?.name ?? startId;
  const goalName = getGoalNode?.name ?? goalId;

  // Step 0: Initialize
  steps.push({
    step: steps.length,
    lineIndex: 1,
    currentNode: startId,
    frontier: [...openSet],
    visited: [],
    pathSoFar: [startId],
    gCosts: { ...gCost },
    fCosts: { ...fCost },
    selectedNode: getNodeMetrics(startId),
    openSetDetails: [],
    description: `Initialize open set with ${startName}`,
    detail: `Push ${startName} into the priority queue with f(n) = h(n) = ${fCost[startId]} km (straight-line to ${goalName}). g(n) = 0 — no movement yet.`,
    explanation: `Starting at ${startName}. It is the only candidate, so A* seeds the search with h(n) = ${fCost[startId]}.`,
  });

  let iterations = 0;
  const MAX_ITER = 30;

  while (openSet.length > 0 && iterations < MAX_ITER) {
    iterations++;
    // Pop node with lowest fCost
    openSet.sort((a, b) => (fCost[a] ?? Infinity) - (fCost[b] ?? Infinity));
    const candidateOrder = [...openSet];
    const current = openSet.shift()!;

    if (visited.includes(current)) continue;
    visited.push(current);

    const currentName = CITY_NODES.find((n) => n.id === current)?.name ?? current;
    const currentMetrics = getNodeMetrics(current);
    const openSetDetails = buildCandidateDetails(candidateOrder.filter((nodeId) => nodeId !== current));

    // Step: Pop current
    steps.push({
      step: steps.length,
      lineIndex: 7,
      currentNode: current,
      frontier: [...openSet],
      visited: [...visited],
      pathSoFar: getPath(current),
      gCosts: { ...gCost },
      fCosts: { ...fCost },
      selectedNode: currentMetrics,
      openSetDetails,
      description: `Pop ${currentName} (lowest f-cost = ${fCost[current]})`,
      detail: `${currentName} has the lowest f(n) = ${fCost[current]} km. Removing from open set and expanding its neighbors.`,
      explanation:
        openSetDetails.length > 0
          ? `Chosen because it has the lowest f(n) among ${openSetDetails.length + 1} candidates.`
          : `Chosen because it is the only candidate in the frontier.`,
    });

    if (current === goalId) {
      // Goal reached
      steps.push({
        step: steps.length,
        lineIndex: 8,
        currentNode: current,
        frontier: [],
        visited: [...visited],
        pathSoFar: getPath(current),
        gCosts: { ...gCost },
        fCosts: { ...fCost },
        selectedNode: currentMetrics,
        openSetDetails: [],
        description: `🎯 Goal reached! Path cost: ${gCost[current]} km`,
        detail: `current === goal → reconstruct path. Optimal route: ${getPath(current)
          .map((id) => CITY_NODES.find((n) => n.id === id)?.name ?? id)
          .join(' → ')} = ${gCost[current]} km total. A* found the shortest path!`,
        explanation: `The selected node is the goal, so the search stops and reconstructs the optimal path.`,
      });
      break;
    }

    // Expand neighbors
    const neighbors = adj[current] ?? [];
    const newlyDiscovered: string[] = [];

    for (const neighbor of neighbors) {
      if (visited.includes(neighbor.id)) continue;
      const tentG = (gCost[current] ?? 0) + neighbor.weight;
      if (tentG < (gCost[neighbor.id] ?? Infinity)) {
        cameFrom[neighbor.id] = current;
        gCost[neighbor.id] = tentG;
        fCost[neighbor.id] = tentG + euclideanDist(neighbor.id, goalId);
        if (!openSet.includes(neighbor.id)) {
          openSet.push(neighbor.id);
          newlyDiscovered.push(neighbor.id);
        }
      }
    }

    if (newlyDiscovered.length > 0) {
      const neighborNames = newlyDiscovered
        .map((id) => CITY_NODES.find((n) => n.id === id)?.name ?? id)
        .join(', ');
      steps.push({
        step: steps.length,
        lineIndex: 10,
        currentNode: current,
        frontier: [...openSet],
        visited: [...visited],
        pathSoFar: getPath(current),
        gCosts: { ...gCost },
        fCosts: { ...fCost },
        selectedNode: currentMetrics,
        openSetDetails: buildCandidateDetails(openSet),
        description: `Expand ${currentName} → discover ${neighborNames}`,
        detail: `${currentName} connects to: ${newlyDiscovered
          .map((id) => {
            const edge = ROAD_EDGES.find(
              (e) => (e.from === current && e.to === id) || (e.from === id && e.to === current)
            );
            const name = CITY_NODES.find((n) => n.id === id)?.name ?? id;
            return `${name} (${edge?.distanceKm ?? '?'} km, ${edge?.highway ?? ''})`;
          })
          .join(', ')}. Updated f-costs and pushed to frontier.`,
        explanation:
          openSet.length > 0
            ? `Heuristic estimates are refreshed for ${openSet.length} frontier candidates after expanding ${currentName}.`
            : `No better frontier candidates were added from ${currentName}.`,
      });
    }
  }

  return steps;
}

// Default steps (Mysore → Belagavi) used as fallback
export const ALGORITHM_STEPS: AlgorithmStepData[] = computeAStarSteps('mysore', 'belagavi');

export const DIMENSIONS: DimensionData[] = [
  {
    id: 0,
    title: 'Dimension 0',
    subtitle: 'The Physical World',
    tagline: 'Karnataka in GPS coordinates',
    description:
      'Before any algorithm runs, there is geography. Ten cities encoded as latitude/longitude pairs, connected by national highways. Click any city on the map to set your origin or destination. This is the raw input — the world as Google Maps sees it.',
    algorithmSteps: undefined,
  },
  {
    id: 1,
    title: 'Dimension 1',
    subtitle: 'Graph Abstraction',
    tagline: 'Roads become edges. Cities become nodes.',
    description:
      'The first transformation: geography collapses into graph theory. Every city becomes a diamond-shaped node. Every road becomes a weighted edge. Distance in kilometers becomes edge weight. The map snaps into a geometric grid — the mathematical skeleton that A* will traverse.',
    algorithmSteps: undefined,
  },
  {
    id: 2,
    title: 'Dimension 2',
    subtitle: 'A* Algorithm',
    tagline: 'Step through the search, line by line',
    description:
      'Now we run A*. Each step you trigger updates both the code IDE and the visual graph simultaneously. Watch the frontier expand, heuristics guide decisions, and the optimal path crystallize from pure mathematics.',
    algorithmSteps: ALGORITHM_STEPS,
  },
];
