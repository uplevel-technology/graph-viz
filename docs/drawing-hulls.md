---
id: drawing-hulls
title: Drawing hulls (groups)
sidebar_label: Drawing hulls (Groups)
---

The hull of a set of nodes is defined as a polygon,
that encloses all of the nodes in the set.

The renderer from `@graph-viz/core` allows you to draw custom hulls to 
underlay the nodes and links. The renderer identifies the hulls to draw
via the `groups` property of the input data provided to it. Hulls can help you 
to highlight subgraphs and clusters.

Drawing hulls also requires you to declare a `displayGroupIds` field on each node that 
has to be included into the hull field that references
the  

## Group data structure

[Link to doc](api-docs/interfaces/core.displaygroup.md)
```typescript
interface DisplayGroup {
  id: string

  /**
   * boolean to toggle the visibility of a display group on or off
   */
  visible?: boolean

  /**
   * type of polygon to draw
   * default is convexHull
   */
  shape?: 'convexHull' | 'circle'

  /**
   * fill color hex string or hex number
   * (default is 0x333333)
   */
  fill?: number | string

  /**
   * relative node fill opacity
   * (must be between 0.0 - 1.0)
   */
  fillOpacity?: number

  /**
   * inner padding from the boundary nodes
   */
  padding?: number
}
```

Currently the library supports drawing convex and circular hulls.



## Convex Hulls

Convex hulls can be drawn as follows:

```typescript
const data = {
  nodes: [
    {id: '1', fill: 'coral'},
    {id: '2', fill: 'orange'},
    {id: '3', displayGroupIds: ['c2'], fill: 'blue'},
    {id: '4', displayGroupIds: ['c2'], fill: 'lightblue'},
    {id: '5', displayGroupIds: ['c2'], fill: 'orange'},
    {id: '6', displayGroupIds: ['c2'], fill: 'green'},
  ],
  links: [
    {source: '1', target: '2'},
    {source: '3', target: '4'},
    {source: '3', target: '5'},
    {source: '3', target: '6'},
  ],
  groups: [
    {
      id: 'c2',
      visible: true,
      shape: 'convexHull' as const,
    },
  ],
}

const visualization = new GraphVisualization(data, ...args)

```


## Circular Hulls

```typescript
const data = {
  nodes: [
    {id: '1', fill: 'coral'},
    {id: '2', fill: 'orange'},
    {id: '3', displayGroupIds: ['c3'], fill: 'blue'},
    {id: '4', displayGroupIds: ['c3'], fill: 'lightblue'},
    {id: '5', displayGroupIds: ['c3'], fill: 'orange'},
    {id: '6', displayGroupIds: ['c3'], fill: 'green'},
  ],
  links: [
    {source: '1', target: '2'},
    {source: '3', target: '4'},
    {source: '3', target: '5'},
    {source: '3', target: '6'},
  ],
  groups: [
    {
      id: 'c3',
      visible: true,
      shape: 'circle' as const,
    },
  ],
}

const visualization = new GraphVisualization(data, ...args)

```

