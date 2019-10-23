---
id: creating-first-viz
title: Creating your first graph viz
sidebar_label: Creating your first graph viz
---

To create your first graph visualization with this library you need - 
1. Your graph data -  a list of nodes and links.
2. Layout for your graph, i.e. positions for each node. 
You can add your own positions or use a layout from the `@graph-viz/layouts` package.
2. The renderer from `@graph-viz/core`. This will paint your graph to the HTML canvas.


## Preparing the data
For the purposes of this tutorial we will visualize the following graph data:

```typescript
const data = {
  nodes: [
    {id: '1'},
    {id: '2'},
    {id: '3'},
    {id: '4'},
    {id: '5'},
    {id: '6'},
  ],
  links: [
    {source: '1', target: '2'},
    {source: '3', target: '4'},
    {source: '3', target: '5'},
    {source: '3', target: '6'},
  ],
}
```

The renderer treats data as an immutable entity and simply draws what is provided to it.
If you want to change what is drawn, you need to update the data.

**Input Data Structure:**

The full structure of the expected input data can be found [here TODO](). This
structure should contain all the information that is required by the renderer to 
draw a graph.
```typescript
interface VisualizationInputData {
  nodes: Node[];
  links: Link[];
  groups: Group[];
}
```

The individual structures of `Node`, `Link` and `Group` elements can 
be found [here TODO](). 


## Adding style attributes

Let's add some style attributes to our nodes and links. In this case we only add a fill
color. Let's also make one of the links red.

```typescript
const data = {
   nodes: [
     {id: '1', fill: 'coral'},
     {id: '2', fill: 'orange'},
     {id: '3', fill: 'blue'},
     {id: '4', fill: 'lightblue'},
     {id: '5', fill: 'orange'},
     {id: '6', fill: 'green'},
   ],
   links: [
     {source: '1', target: '2', color: 'red'},
     {source: '3', target: '4'},
     {source: '3', target: '5'},
     {source: '3', target: '6'},
   ],
}
```

## Adding position attributes / Creating a layout

The renderer is incognizant of the position and the layouts of the graph, so we need
to tell it about the positions of the nodes via the position attributes

As mentioned in the [docs TODO](), a node expected by the `GraphVisualization` renderer
requires position attributes `x` & `y`. This is the coordinate of the center of the circle 
that the the renderer will draw to represent the node.

The `@graph-viz` library allows you to use any third-party solution or your own 
layout algorithms to create layouts by allowing you to manually initialize
nodes with positions.

Additionally, we also provide our own solution to create layouts with the
`@graph-viz/layouts` package.

For the purposes of this walk-through, we will use the `@graph-viz/layouts` package to 
initialize nodes with positions in a force-directed layout before sending them to 
the renderer.


```typescript
import {ForceSimulation} from '@graph-viz/layouts'

const data = {
   nodes: [
     {id: '1', fill: 'coral'},
     {id: '2', fill: 'orange'},
     {id: '3', fill: 'blue'},
     {id: '4', fill: 'lightblue'},
     {id: '5', fill: 'orange'},
     {id: '6', fill: 'green'},
   ],
   links: [
     {source: '1', target: '2', color: 'red'},
     {source: '3', target: '4'},
     {source: '3', target: '5'},
     {source: '3', target: '6'},
   ],
}

const simulation = new ForceSimulation();

simulation.init(data);

```

The `simulation.init` method internally initializes a real-time force layout simulation 
based on [`d3-force`TODO]().

You can fetch all the node positions at a given point in time using the `getNodePositions`
method.

```typescript
// get node positions from the simulation
const nodePositions = simulation.getNodePositions()

// seeding data with positions
data.nodes.forEach((node, i) => {
  node.x = nodePositions[i].x
  node.y = nodePositions[i].y
})

```
See docs for [ForceSimulation](https://uplevel-technology.github.io/graph-viz/classes/layouts.forcesimulation.html).

**NOTE:** 

The `getNodePositions()` method gets the positions of all the nodes at a given
point in time. Because the `ForceSimulation` is actually a live simulation, you 
may or may not have the most _settled_ positions depending on when you call `getNodePositions`.
To ensure that a force directed layout simulation has settled, we recommend that 
you update the node positions periodically with the `simulation.onTick` callback.

```typescript
simulation.onTick(nodePositions => {
  data.nodes.forEach((node, i) => {
    node.x = nodePositions[i].x
    node.y = nodePositions[i].y
  })
})
```

The `simulation.onTick` can also be used to animate the force simulation by rerendering
within the callback as shown in [Updating doc TODO]().

## Initializing the renderer

The last step is to pass our formatted data with all the styles and positions to our renderer.

We'll use the WebGL renderer that is available under `@graph-viz/core`.

Here we create an instance of the renderer and assign it to the variable `visualization`.

```typescript
import {GraphVisualization} from '@graph-viz/core'

// See docs for argument structures
const visualization = new GraphVisualization(
  data,    // visualization input data
  canvas,  // Canvas DOM element
  width,   // number
  height,  // number
  config,  // additional config options
);
```



See docs for class [GraphVisualization](https://uplevel-technology.github.io/graph-viz/classes/core.graphvisualization.html).

