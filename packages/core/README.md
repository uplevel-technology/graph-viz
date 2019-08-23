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

See docs for all available methods.
