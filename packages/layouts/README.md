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
See docs for detailed API
