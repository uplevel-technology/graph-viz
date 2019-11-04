---
id: quick-start
title: Quick Start
sidebar_label: Quick Start
---

## @graph-viz/core

See docs for class [GraphVisualization](api-docs/classes/core.graphvisualization.md).

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


## @graph-viz/layouts


See docs for [ForceSimulation](api-docs/classes/layouts.forcesimulation.md).

```typescript
import {ForceSimulation} from '@graph-viz/layouts'

const simulation = new ForceSimulation();

simulation.init(data);

simulation.onTick(callback);
```

## @graph-viz/react

See docs for [GraphVizComponent](api-docs/classes/react.graphvizcomponent.md).

```tsx
import {GraphVizComponent} from '@graph-viz/react'

...
  <GraphVizComponent
    editMode
    nodes={[]}
    links={[]]}
    tooltips={[]}
  />
```
