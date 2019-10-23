---
id: quick-start
title: Quick Start
sidebar_label: Quick Start
---

## @graph-viz/core

See docs for class [GraphVisualization](https://uplevel-technology.github.io/graph-viz/classes/core.graphvisualization.html).

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


See docs for [ForceSimulation](https://uplevel-technology.github.io/graph-viz/classes/layouts.forcesimulation.html).

```typescript
import {ForceSimulation} from '@graph-viz/layouts'

const simulation = new ForceSimulation();

simulation.init(data);

simulation.onTick(callback);
```

## @graph-viz/react

See docs for [GraphVizComponent](https://uplevel-technology.github.io/graph-viz/classes/react.graphvizcomponent.html).

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
