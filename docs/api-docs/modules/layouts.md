---
id: "layouts"
title: "layouts"
sidebar_label: "layouts"
---

[@graph-viz](../index.md) › [Globals](../globals.md) › [layouts](layouts.md)

## Index

### Classes

* [ForceSimulation](../classes/layouts.forcesimulation.md)

### Interfaces

* [NodePosition](../interfaces/layouts.nodeposition.md)
* [SimulationData](../interfaces/layouts.simulationdata.md)
* [SimulationGroup](../interfaces/layouts.simulationgroup.md)
* [SimulationLink](../interfaces/layouts.simulationlink.md)
* [SimulationNode](../interfaces/layouts.simulationnode.md)

### Type aliases

* [D3Simulation](layouts.md#d3simulation)

### Functions

* [forceGroup](layouts.md#forcegroup)
* [getCentroid](layouts.md#getcentroid)
* [getDefaultLinkForceStrengths](layouts.md#getdefaultlinkforcestrengths)
* [getForceLinkDistance](layouts.md#getforcelinkdistance)
* [getGroupedNodes](layouts.md#getgroupednodes)

## Type aliases

###  D3Simulation

Ƭ **D3Simulation**: *Simulation‹SimulationNodeDatum, [SimulationLink](../interfaces/layouts.simulationlink.md)›*

*Defined in [layouts/src/ForceSimulation.ts:53](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/layouts/src/ForceSimulation.ts#L53)*

## Functions

###  forceGroup

▸ **forceGroup**(`groups`: [SimulationGroup](../interfaces/layouts.simulationgroup.md)[]): *force*

*Defined in [layouts/src/ForceSimulation.ts:69](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/layouts/src/ForceSimulation.ts#L69)*

**Parameters:**

Name | Type |
------ | ------ |
`groups` | [SimulationGroup](../interfaces/layouts.simulationgroup.md)[] |

**Returns:** *force*

___

###  getCentroid

▸ **getCentroid**(`points`: [SimulationNode](../interfaces/layouts.simulationnode.md)[]): *object*

*Defined in [layouts/src/ForceSimulation.ts:102](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/layouts/src/ForceSimulation.ts#L102)*

**Parameters:**

Name | Type |
------ | ------ |
`points` | [SimulationNode](../interfaces/layouts.simulationnode.md)[] |

**Returns:** *object*

* **x**: *number*

* **y**: *number*

___

###  getDefaultLinkForceStrengths

▸ **getDefaultLinkForceStrengths**(`links`: [SimulationLink](../interfaces/layouts.simulationlink.md)[]): *number[]*

*Defined in [layouts/src/ForceSimulation.ts:127](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/layouts/src/ForceSimulation.ts#L127)*

**Parameters:**

Name | Type |
------ | ------ |
`links` | [SimulationLink](../interfaces/layouts.simulationlink.md)[] |

**Returns:** *number[]*

___

###  getForceLinkDistance

▸ **getForceLinkDistance**(`links`: object[]): *number*

*Defined in [layouts/src/ForceSimulation.ts:55](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/layouts/src/ForceSimulation.ts#L55)*

**Parameters:**

Name | Type |
------ | ------ |
`links` | object[] |

**Returns:** *number*

___

###  getGroupedNodes

▸ **getGroupedNodes**(`nodes`: [SimulationNode](../interfaces/layouts.simulationnode.md)[]): *object*

*Defined in [layouts/src/ForceSimulation.ts:109](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/layouts/src/ForceSimulation.ts#L109)*

**Parameters:**

Name | Type |
------ | ------ |
`nodes` | [SimulationNode](../interfaces/layouts.simulationnode.md)[] |

**Returns:** *object*

* \[ **groupId**: *string*\]: [SimulationNode](../interfaces/layouts.simulationnode.md)[]
