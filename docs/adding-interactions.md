---
id: adding-interactions
title: Adding interactions
sidebar_label: Adding interactions
---

The `GraphVisualization` renderer in the `core` package treats input data as an immutable entity. The flow of data
to the data visualization is unidirectional and the renderer only draws the data provided to it.

A good graph visualization often needs to be complemented with interactions such as dragging a node or the canvas, \
clicking on a node, highlighting the nodes or links on hover interactions etc.

The `GraphVisualization` renderer allows this by exposing several event handlers that you can initialize. You are
responsible for updating your data on these events.

Here are some examples on how some standard interactions can be built:


## Scaling a node on hover

```typescript

const data = {...someData}
const visualization = new GraphVisualization(
  data,    // visualization input data
  canvas,  // Canvas DOM element
  width,   // number
  height,  // number
  config,  // additional config options
);


visualization.onNodeHoverIn((hoveredNodeIdx: number) => {
  const hoveredNode = data.nodes[hoveredNodeIdx]
  hoveredNode.scale = 1.5 // scale size by 50%
  
  // redraw the updated node
  visualization.updateNode(hoveredNodeIdx, hoveredNode)
})

visualization.onNodeHoverOut(hoveredOutNodeIdx => {
  const hoveredOutNode = data.nodes[hoveredOutNodeIdx]
  hoveredOutNode.scale = 1.0 // reset scale to default

  // redraw the updated node
  visualization.updateNode(hoveredOutNodeIdx, hoveredOutNode)
})

```

## Clicking a node

```typescript
visualization.onClick((clickPosition, clickedNodeIdx, event: MouseEvent) => {
  // do something
})

visualization.onSecondaryClick((clickPosition, clickedNodeIdx, event: MouseEvent) => {
  // do something
})
```

## Dragging the canvas or the node
```typescript
visualization.onDragStart((mouse, draggedNodeIdx: number | null) => {
  if (draggedNodeIdx === null) {
    return
  }
  const draggedNode = data.nodes[draggedNodeIdx]
  draggedNode.fx = draggedNode.x
  draggedNode.fy = draggedNode.y

  // rerender the new node
  visualization.updateNode(draggedNodeIdx, draggedNode)

  // reheat the force simulation because of the position change
  simulation.reheat()
})

visualization.onNodeDrag((worldPos, draggedNodeIdx) => {
  let node = data.nodes[draggedNodeIdx] as SimulationNode
  node.x = worldPos.x
  node.y = worldPos.y
  node.fx = worldPos.x
  node.fy = worldPos.y

  // update the force simulation
  simulation.update({
    nodes: data.nodes,
    links: data.links,
  })
  // ^ the simulation tick handler should handle the position updates after this in our viz
})


visualization.onClick((clickPosition, clickedNodeIdx, event: MouseEvent) => {
  let clickedNode = data.nodes[clickedNodeIdx]

  // reset the fx, fy fixed coordinates of any dragged node if it's clicked
  clickedNode.fx = null
  clickedNode.fy = null
})

```


# Zooming
```typescript
// Zooming in
visualization.zoom(0.2)

// Zooming out
visualization.zoom(-0.2)
```

