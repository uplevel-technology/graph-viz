GraphViz library is a high-performance WebGL based library for drawing graph visualizations.

# `@graph-viz/core`

> WebGL based core drawing utility for graph visualizations

The `@graph-viz/core` package takes graph data as input and draws it on a canvas using WebGL.
Input data is treated as an immutable entity by this package and it only exposes interaction events that
can be used by callers to update the data and re-render the visualization.  

## Installation
`npm i @graph-viz/core --save`

## Usage

```typescript
import {GraphVisualization} from '@graph-viz/core'

// See docs for argument structures
const visualization = new GraphVisualization(
  vizData, // visualization input data
  canvas,  // dom element
  width,   // number
  height,  // number
  config,  // config
);
```


# `@graph-viz/layouts`

> Layout algorithms for graphs.

Implemented:
* Force Simulation (uses d3-force)

In Progress:
* Temporal Graph Layout

This packages exposes stateful (force simulations) as well as stateless plug-n-play 
layout generation functions that can be used to seed nodes and links data with positions 
on the canvas. 

## Installation
`npm install @graph-viz/layouts --save`

## Usage

```typescript
import {ForceSimulation} from '@graph-viz/layouts'

const simulation = new ForceSimulation();

simulation.init(data);

simulation.onTick(callback);
```

# `react`

A zero-config plug and play React component to draw a force directed graph visualization.
Depends on `@graph-viz/core` and `@graph-viz/layouts`

## Installation
`npm install @graph-viz/react --save`

## Usage

```typescript
import {GraphVizComponent} from '@graph-viz/react'

...
  <GraphVizComponent
    editMode
    nodes={[]}
    links={[]]}
    tooltips={[]}
  />
```
