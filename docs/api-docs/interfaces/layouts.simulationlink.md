---
id: "layouts.simulationlink"
title: "SimulationLink"
sidebar_label: "SimulationLink"
---

[@graph-viz](../index.md) › [Globals](../globals.md) › [layouts](../modules/layouts.md) › [SimulationLink](layouts.simulationlink.md)

## Hierarchy

* **SimulationLink**

## Index

### Properties

* [source](layouts.simulationlink.md#source)
* [strengthMultiplier](layouts.simulationlink.md#optional-strengthmultiplier)
* [target](layouts.simulationlink.md#target)

## Properties

###  source

• **source**: *string*

*Defined in [packages/layouts/src/ForceSimulation.ts:29](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/layouts/src/ForceSimulation.ts#L29)*

___

### `Optional` strengthMultiplier

• **strengthMultiplier**? : *undefined | number*

*Defined in [packages/layouts/src/ForceSimulation.ts:39](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/layouts/src/ForceSimulation.ts#L39)*

Multiplicative factor applied to default d3 link force,
which serves as an attractive force between the endpoints.
A value between 0 and 1 will reduce the attractive force,
tending to increase the length of the link.

**`see`** https://github.com/d3/d3-force#link_strength

___

###  target

• **target**: *string*

*Defined in [packages/layouts/src/ForceSimulation.ts:30](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/layouts/src/ForceSimulation.ts#L30)*
