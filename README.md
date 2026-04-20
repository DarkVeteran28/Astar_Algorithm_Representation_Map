# RouteDeconstruct

RouteDeconstruct is a cinematic scrollytelling app built with Next.js that explains how map routing can be modeled and visualized through Karnataka's road network. It turns a set of real-world city connections into an interactive teaching experience for graph abstraction and the A* pathfinding algorithm.

## What This Project Does

The experience is split into three dimensions:

1. `Dimension 0` shows the physical world: cities, highways, and route selection across Karnataka.
2. `Dimension 1` converts that geography into a graph of nodes and weighted edges.
3. `Dimension 2` steps through A* search line by line, showing the frontier, visited nodes, costs, and current best path.

Users can pick an origin and destination, then watch the route state update dynamically as the app recomputes A* steps for that pair of cities.

## Features

- Interactive Karnataka road-network visualization
- Clickable city selection for origin and destination
- Dynamic A* step generation based on the selected route
- Side-by-side scrollytelling layout with sticky canvas and narrative panels
- Educational code viewer with highlighted execution state
- Weighted graph model using real city and highway metadata

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Lucide React
- Recharts
- Framer Motion

## Project Structure

```text
src/
  app/
    layout.tsx
    not-found.tsx
    scrollytelling-experience/
      page.tsx
      components/
        ScrollytellingClient.tsx
        KarnatakaCanvas.tsx
        DimensionNarrative.tsx
        panels/
        data/
  styles/
    tailwind.css
```

Key files:

- `src/app/scrollytelling-experience/page.tsx` mounts the experience.
- `src/app/scrollytelling-experience/components/ScrollytellingClient.tsx` manages dimension state, route selection, and algorithm progress.
- `src/app/scrollytelling-experience/components/data/mapData.ts` defines the cities, roads, and map metadata.
- `src/app/scrollytelling-experience/components/data/dimensions.ts` defines the dimension content and computes A* steps.

## Getting Started

### Prerequisites

- Node.js 18+ recommended
- npm

### Install

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

The app runs on:

```text
http://localhost:4028
```

Open the scrollytelling page at:

```text
http://localhost:4028/scrollytelling-experience
```

## Available Scripts

- `npm run dev` starts the Next.js dev server on port `4028`
- `npm run build` creates a production build
- `npm run serve` starts the production server
- `npm run lint` runs lint checks
- `npm run lint:fix` fixes lint issues where possible
- `npm run format` formats source files with Prettier
- `npm run type-check` runs TypeScript without emitting output

## How A* Is Modeled Here

The app represents Karnataka as a weighted graph:

- Cities are nodes
- Roads are edges
- Edge weights are road distances in kilometers
- The heuristic is derived from straight-line distance between cities using the SVG coordinate system as a proxy

When the route changes, the app recomputes the search steps so the visualization and explanation stay in sync with the chosen origin and destination.

## Notes

- The main interactive route currently lives at `/scrollytelling-experience`.
- The project is designed as an educational visualization, not a production navigation engine.
- Some map and traffic elements are pedagogical abstractions meant to explain routing concepts clearly.
