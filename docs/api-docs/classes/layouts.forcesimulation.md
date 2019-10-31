---
id: "layouts.forcesimulation"
title: "ForceSimulation"
sidebar_label: "ForceSimulation"
---

[@graph-viz](../index.md) › [Globals](../globals.md) › [layouts](../modules/layouts.md) › [ForceSimulation](layouts.forcesimulation.md)

## Hierarchy

* **ForceSimulation**

## Index

### Properties

* [simulation](layouts.forcesimulation.md#private-simulation)

### Methods

* [getNodePositions](layouts.forcesimulation.md#getnodepositions)
* [initialize](layouts.forcesimulation.md#initialize)
* [onTick](layouts.forcesimulation.md#ontick)
* [reheat](layouts.forcesimulation.md#reheat)
* [restart](layouts.forcesimulation.md#restart)
* [settle](layouts.forcesimulation.md#settle)
* [stop](layouts.forcesimulation.md#stop)
* [update](layouts.forcesimulation.md#update)

### Object literals

* [registeredEventHandlers](layouts.forcesimulation.md#private-registeredeventhandlers)

## Properties

### `Private` simulation

• **simulation**: *[D3Simulation](../modules/layouts.md#d3simulation) | undefined*

*Defined in [layouts/src/ForceSimulation.ts:148](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/layouts/src/ForceSimulation.ts#L148)*

## Methods

###  getNodePositions

▸ **getNodePositions**(): *[NodePosition](../interfaces/layouts.nodeposition.md)[]*

*Defined in [layouts/src/ForceSimulation.ts:217](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/layouts/src/ForceSimulation.ts#L217)*

**Returns:** *[NodePosition](../interfaces/layouts.nodeposition.md)[]*

___

###  initialize

▸ **initialize**(`graph`: [SimulationData](../interfaces/layouts.simulationdata.md)): *void*

*Defined in [layouts/src/ForceSimulation.ts:156](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/layouts/src/ForceSimulation.ts#L156)*

**Parameters:**

Name | Type |
------ | ------ |
`graph` | [SimulationData](../interfaces/layouts.simulationdata.md) |

**Returns:** *void*

___

###  onTick

▸ **onTick**(`callback`: function): *void*

*Defined in [layouts/src/ForceSimulation.ts:230](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/layouts/src/ForceSimulation.ts#L230)*

**Parameters:**

▪ **callback**: *function*

▸ (`nodePositions`: [NodePosition](../interfaces/layouts.nodeposition.md)[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`nodePositions` | [NodePosition](../interfaces/layouts.nodeposition.md)[] |

**Returns:** *void*

___

###  reheat

▸ **reheat**(): *void*

*Defined in [layouts/src/ForceSimulation.ts:260](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/layouts/src/ForceSimulation.ts#L260)*

**Returns:** *void*

___

###  restart

▸ **restart**(): *void*

*Defined in [layouts/src/ForceSimulation.ts:252](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/layouts/src/ForceSimulation.ts#L252)*

**Returns:** *void*

___

###  settle

▸ **settle**(): *void*

*Defined in [layouts/src/ForceSimulation.ts:267](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/layouts/src/ForceSimulation.ts#L267)*

**Returns:** *void*

___

###  stop

▸ **stop**(): *void*

*Defined in [layouts/src/ForceSimulation.ts:274](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/layouts/src/ForceSimulation.ts#L274)*

**Returns:** *void*

___

###  update

▸ **update**(`graph`: [SimulationData](../interfaces/layouts.simulationdata.md)): *void*

*Defined in [layouts/src/ForceSimulation.ts:234](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/layouts/src/ForceSimulation.ts#L234)*

**Parameters:**

Name | Type |
------ | ------ |
`graph` | [SimulationData](../interfaces/layouts.simulationdata.md) |

**Returns:** *void*

## Object literals

### `Private` registeredEventHandlers

### ▪ **registeredEventHandlers**: *object*

*Defined in [layouts/src/ForceSimulation.ts:149](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/layouts/src/ForceSimulation.ts#L149)*

###  tick

• **tick**: *noop* =  noop

*Defined in [layouts/src/ForceSimulation.ts:153](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/layouts/src/ForceSimulation.ts#L153)*
