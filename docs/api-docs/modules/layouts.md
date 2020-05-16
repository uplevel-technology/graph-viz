---
id: "layouts"
title: "layouts"
sidebar_label: "layouts"
---

[@graph-viz](../index.md) › [Globals](../globals.md) › [layouts](layouts.md)

## Index

### References

* [ForceConfig](layouts.md#forceconfig)
* [ForceSimulation](layouts.md#forcesimulation)
* [NodePosition](layouts.md#nodeposition)
* [SimulationData](layouts.md#simulationdata)
* [SimulationGroup](layouts.md#simulationgroup)
* [SimulationLink](layouts.md#simulationlink)
* [SimulationNode](layouts.md#simulationnode)

### Classes

* [ForceSimulation](../classes/layouts.forcesimulation.md)

### Interfaces

* [ForceConfig](../interfaces/layouts.forceconfig.md)
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
* [getGroupedNodes](layouts.md#getgroupednodes)

### Object literals

* [FORCE_DEFAULTS](layouts.md#const-force_defaults)

## References

###  ForceConfig

• **ForceConfig**:

___

###  ForceSimulation

• **ForceSimulation**:

___

###  NodePosition

• **NodePosition**:

___

###  SimulationData

• **SimulationData**:

___

###  SimulationGroup

• **SimulationGroup**:

___

###  SimulationLink

• **SimulationLink**:

___

###  SimulationNode

• **SimulationNode**:

## Type aliases

###  D3Simulation

Ƭ **D3Simulation**: *Simulation‹SimulationNodeDatum, [SimulationLink](../interfaces/layouts.simulationlink.md)›*

*Defined in [packages/layouts/src/ForceSimulation.ts:53](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/layouts/src/ForceSimulation.ts#L53)*

## Functions

###  forceGroup

▸ **forceGroup**(`groups`: [SimulationGroup](../interfaces/layouts.simulationgroup.md)[], `defaultStrength`: number): *force*

*Defined in [packages/layouts/src/ForceSimulation.ts:62](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/layouts/src/ForceSimulation.ts#L62)*

**Parameters:**

Name | Type |
------ | ------ |
`groups` | [SimulationGroup](../interfaces/layouts.simulationgroup.md)[] |
`defaultStrength` | number |

**Returns:** *force*

___

###  getCentroid

▸ **getCentroid**(`points`: [SimulationNode](../interfaces/layouts.simulationnode.md)[]): *object*

*Defined in [packages/layouts/src/ForceSimulation.ts:95](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/layouts/src/ForceSimulation.ts#L95)*

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

*Defined in [packages/layouts/src/ForceSimulation.ts:124](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/layouts/src/ForceSimulation.ts#L124)*

Based on the default implementation

**`see`** https://github.com/d3/d3-force#link_strength

**Parameters:**

Name | Type |
------ | ------ |
`links` | [SimulationLink](../interfaces/layouts.simulationlink.md)[] |

**Returns:** *number[]*

___

###  getGroupedNodes

▸ **getGroupedNodes**(`nodes`: [SimulationNode](../interfaces/layouts.simulationnode.md)[]): *object*

*Defined in [packages/layouts/src/ForceSimulation.ts:102](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/layouts/src/ForceSimulation.ts#L102)*

**Parameters:**

Name | Type |
------ | ------ |
`nodes` | [SimulationNode](../interfaces/layouts.simulationnode.md)[] |

**Returns:** *object*

* \[ **groupId**: *string*\]: [SimulationNode](../interfaces/layouts.simulationnode.md)[]

## Object literals

### `Const` FORCE_DEFAULTS

### ▪ **FORCE_DEFAULTS**: *object*

*Defined in [packages/layouts/src/ForceSimulation.ts:149](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/layouts/src/ForceSimulation.ts#L149)*

###  groupStrength

• **groupStrength**: *number* = 0

*Defined in [packages/layouts/src/ForceSimulation.ts:152](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/layouts/src/ForceSimulation.ts#L152)*

###  linkStrengthMultiplier

• **linkStrengthMultiplier**: *number* = 1

*Defined in [packages/layouts/src/ForceSimulation.ts:151](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/layouts/src/ForceSimulation.ts#L151)*

###  nodeCharge

• **nodeCharge**: *number* = -30

*Defined in [packages/layouts/src/ForceSimulation.ts:150](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/layouts/src/ForceSimulation.ts#L150)*
