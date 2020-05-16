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

* [config](layouts.forcesimulation.md#private-readonly-config)
* [defaultLinkForceStrengths](layouts.forcesimulation.md#private-defaultlinkforcestrengths)
* [simulation](layouts.forcesimulation.md#simulation)
* [staticMode](layouts.forcesimulation.md#staticmode)

### Methods

* [execManualTicks](layouts.forcesimulation.md#private-execmanualticks)
* [getNodePositions](layouts.forcesimulation.md#getnodepositions)
* [initialize](layouts.forcesimulation.md#initialize)
* [onTick](layouts.forcesimulation.md#ontick)
* [reheat](layouts.forcesimulation.md#reheat)
* [restart](layouts.forcesimulation.md#restart)
* [settle](layouts.forcesimulation.md#settle)
* [stop](layouts.forcesimulation.md#stop)
* [update](layouts.forcesimulation.md#update)
* [updateConfig](layouts.forcesimulation.md#updateconfig)

### Object literals

* [registeredEventHandlers](layouts.forcesimulation.md#private-registeredeventhandlers)

## Properties

### `Private` `Readonly` config

• **config**: *Required‹[ForceConfig](../interfaces/layouts.forceconfig.md)›* = FORCE_DEFAULTS

*Defined in [packages/layouts/src/ForceSimulation.ts:165](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/layouts/src/ForceSimulation.ts#L165)*

___

### `Private` defaultLinkForceStrengths

• **defaultLinkForceStrengths**: *number[]* = []

*Defined in [packages/layouts/src/ForceSimulation.ts:167](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/layouts/src/ForceSimulation.ts#L167)*

___

###  simulation

• **simulation**: *[D3Simulation](../modules/layouts.md#d3simulation) | undefined*

*Defined in [packages/layouts/src/ForceSimulation.ts:156](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/layouts/src/ForceSimulation.ts#L156)*

___

###  staticMode

• **staticMode**: *boolean* = false

*Defined in [packages/layouts/src/ForceSimulation.ts:157](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/layouts/src/ForceSimulation.ts#L157)*

## Methods

### `Private` execManualTicks

▸ **execManualTicks**(): *void*

*Defined in [packages/layouts/src/ForceSimulation.ts:241](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/layouts/src/ForceSimulation.ts#L241)*

**Returns:** *void*

___

###  getNodePositions

▸ **getNodePositions**(): *[NodePosition](../interfaces/layouts.nodeposition.md)[]*

*Defined in [packages/layouts/src/ForceSimulation.ts:249](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/layouts/src/ForceSimulation.ts#L249)*

**Returns:** *[NodePosition](../interfaces/layouts.nodeposition.md)[]*

___

###  initialize

▸ **initialize**(`graph`: [SimulationData](../interfaces/layouts.simulationdata.md), `config`: [ForceConfig](../interfaces/layouts.forceconfig.md), `staticMode`: boolean): *void*

*Defined in [packages/layouts/src/ForceSimulation.ts:169](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/layouts/src/ForceSimulation.ts#L169)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`graph` | [SimulationData](../interfaces/layouts.simulationdata.md) | - |
`config` | [ForceConfig](../interfaces/layouts.forceconfig.md) | FORCE_DEFAULTS |
`staticMode` | boolean | false |

**Returns:** *void*

___

###  onTick

▸ **onTick**(`callback`: function): *void*

*Defined in [packages/layouts/src/ForceSimulation.ts:262](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/layouts/src/ForceSimulation.ts#L262)*

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

*Defined in [packages/layouts/src/ForceSimulation.ts:334](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/layouts/src/ForceSimulation.ts#L334)*

**Returns:** *void*

___

###  restart

▸ **restart**(): *void*

*Defined in [packages/layouts/src/ForceSimulation.ts:323](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/layouts/src/ForceSimulation.ts#L323)*

**Returns:** *void*

___

###  settle

▸ **settle**(): *void*

*Defined in [packages/layouts/src/ForceSimulation.ts:344](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/layouts/src/ForceSimulation.ts#L344)*

**Returns:** *void*

___

###  stop

▸ **stop**(): *void*

*Defined in [packages/layouts/src/ForceSimulation.ts:351](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/layouts/src/ForceSimulation.ts#L351)*

**Returns:** *void*

___

###  update

▸ **update**(`graph`: [SimulationData](../interfaces/layouts.simulationdata.md)): *void*

*Defined in [packages/layouts/src/ForceSimulation.ts:306](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/layouts/src/ForceSimulation.ts#L306)*

**Parameters:**

Name | Type |
------ | ------ |
`graph` | [SimulationData](../interfaces/layouts.simulationdata.md) |

**Returns:** *void*

___

###  updateConfig

▸ **updateConfig**(`newConfig?`: [ForceConfig](../modules/layouts.md#forceconfig)): *void*

*Defined in [packages/layouts/src/ForceSimulation.ts:270](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/layouts/src/ForceSimulation.ts#L270)*

update config and force simulation as needed

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`newConfig?` | [ForceConfig](../modules/layouts.md#forceconfig) |   |

**Returns:** *void*

## Object literals

### `Private` registeredEventHandlers

### ▪ **registeredEventHandlers**: *object*

*Defined in [packages/layouts/src/ForceSimulation.ts:158](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/layouts/src/ForceSimulation.ts#L158)*

###  tick

• **tick**: *noop* = noop

*Defined in [packages/layouts/src/ForceSimulation.ts:162](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/layouts/src/ForceSimulation.ts#L162)*
