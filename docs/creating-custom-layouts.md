---
id: creating-custom-layouts
title: Creating custom layouts
sidebar_label: Creating custom layouts
---

The renderer from `@graph-viz/core` allows you to provide fixed locations for each node through
the fields `fx` and `fy` on the node. This makes it possible for you to completely own the 
layouting process and create customized layouts such as trees, timelines etc.

Let's see how we can implement a custom timeline layout using [d3.js](https://d3js.org/).

## Timeline Graph Layout

Let's start with a dataset where few nodes have say a timestamp value. We would ideally like to arrange all the nodes
with a timestamp in a linear layout by time. For the purposes of this tutorial we will use d3's 
[`scaleLinear`](https://github.com/d3/d3-scale#continuous-scales) scale
which will help us map the timestamp to the `x` coordinate of node.

```typescript
const data = {
   nodes: [
     {id: '1', fill: 'coral'},
     {id: '2', fill: 'orange'},
     {id: '3', fill: 'blue'},
     {id: '4', fill: 'lightblue'},
     {id: '5', fill: 'orange'},
     {id: '6', fill: 'green'},
     {id: '7', fill: 'pink', timestamp: new Date(2019, 10, 10)},
     {id: '8', fill: 'pink', timestamp: new Date(2019, 10, 12)},
     {id: '9', fill: 'pink', timestamp: new Date(2019, 10, 18)},
     {id: '10', fill: 'pink', timestamp: new Date(2019, 10, 27)},
     {id: '11', fill: 'pink', timestamp: new Date(2019, 10, 30)},
   ],
   links: [
     {source: '7', target: '1', color: 'red'},
     {source: '8', target: '2'},
     {source: '9', target: '3'},
     {source: '11', target: '4'},
     {source: '11', target: '5'},
     {source: '7', target: '5'},
     {source: '8', target: '6'},
   ],
}
```

Before we pass this to our renderer, we should map the `timestamp` fields to `fx` and `fy` coordinates.

### Mapping timestamps to pixels 

```typescript
const canvasWidth = 700 // the width of the canvas element 
const horizontalPadding = 40 // padding on the left and right
const totalWidth = canvasWidth - 2 * horizontalPadding

const allTimestamps = data.nodes
  .map(n => n.timestamp.getTime()) // map to UTC timestamp
  .sort((a, b) => a - b) // sort ascending

const extent = [allTimestamps[0], allTimestamps[allTimestamps.length - 1]]
 
const scale = d3
  .scaleTime()
  .domain(extent)
  .range([-totalWidth / 2, totalWidth / 2]) // because the graph viz library assumes that point (0,0) is at the center of the canvas

for (const node of data.nodes) {
  if (node.timestamp !== undefined) {
    node.x = scale(node.timestamp.getTime())
    node.y = 0 // center vertically
  }
}
```

This should set an `x` and `y` positions to all nodes that have a timestamp.

But what about the other nodes which did not have a timestamp? We still need to manually assign them locations with another
layout algorithm. Let's try to do that using our force-directed simulation from the `@graph-viz/layouts` package.

However, if we pass all our nodes to the `ForceSimulation` package, it would overwrite the `x` and `y` coordinates we set
on the timeline nodes. In such a situation we can set the `fx` and `fy` fixed coordinates on the timeline nodes
instead of the `x` and `y` coordinates to prevent them from taking part in the force-directed layout computation.


## Hybrid layout
_Partially fixed and partially force-directed._

```typescript
for (const node of data.nodes) {
  if (node.timestamp !== undefined) {
    node.fx = scale(node.timestamp.getTime())
    node.fy = 0 // center vertically
  }
}

```

After this step we can follow the steps from the "[Creating your first viz]" tutorial to first pass our timeline
data to the `ForceSimulation` and then to our `GraphVisualization` renderer.
