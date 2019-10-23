---
id: creating-first-viz
title: Creating your first graph
sidebar_label: Creating your first graph viz
---

To create your first graph visualization with this library you need - 
1. Your graph data -  a list of nodes and links.
2. Layout for your graph, i.e. positions for each node. 
You can add your own positions or use a layout from the `@graph-viz/layouts` package.
2. The renderer from `@graph-viz/core`. This will paint your graph to the HTML canvas.



## Initializing the renderer:

TODO

### Input Data Structure:
The full structure of the expected input data can be found [here TODO]().

## Seeding positions / Creating a layout:

Each node should have position attributes `x` & `y`. 
This is the position coordinate of the center of the circle used to represent the node.


The modular structure of the `@graph-viz` library allows you to use any third-party
solution or your own layout algorithms to create layouts by manually initializing
nodes with position.

Additionally, we also expose our own solution to create layouts with the
`@graph-viz/layouts` package.

For the purposes of this walkthrough, we will use the `@graph-viz/layouts` package to 
create a basic force-directed layout.
