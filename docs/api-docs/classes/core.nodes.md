---
id: "core.nodes"
title: "Nodes"
sidebar_label: "Nodes"
---

[@graph-viz](../index.md) › [Globals](../globals.md) › [core](../modules/core.md) › [Nodes](core.nodes.md)

## Hierarchy

* **Nodes**

## Index

### Constructors

* [constructor](core.nodes.md#constructor)

### Properties

* [geometry](core.nodes.md#private-geometry)
* [lockedIds](core.nodes.md#private-lockedids)
* [material](core.nodes.md#private-material)
* [object](core.nodes.md#object)

### Methods

* [dispose](core.nodes.md#dispose)
* [handleCameraZoom](core.nodes.md#handlecamerazoom)
* [updateAll](core.nodes.md#updateall)
* [updateAllAbsoluteSizes](core.nodes.md#updateallabsolutesizes)
* [updateAllFills](core.nodes.md#updateallfills)
* [updateAllInnerRadii](core.nodes.md#updateallinnerradii)
* [updateAllPositions](core.nodes.md#updateallpositions)
* [updateAllScales](core.nodes.md#updateallscales)
* [updateAllStrokeOpacities](core.nodes.md#updateallstrokeopacities)
* [updateAllStrokeWidths](core.nodes.md#updateallstrokewidths)
* [updateAllStrokes](core.nodes.md#updateallstrokes)
* [updateOne](core.nodes.md#updateone)

## Constructors

###  constructor

\+ **new Nodes**(`nodes`: [DisplayNode](../interfaces/core.displaynode.md)[]): *[Nodes](core.nodes.md)*

*Defined in [core/src/Nodes.ts:105](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/Nodes.ts#L105)*

**Parameters:**

Name | Type |
------ | ------ |
`nodes` | [DisplayNode](../interfaces/core.displaynode.md)[] |

**Returns:** *[Nodes](core.nodes.md)*

## Properties

### `Private` geometry

• **geometry**: *BufferGeometry*

*Defined in [core/src/Nodes.ts:103](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/Nodes.ts#L103)*

___

### `Private` lockedIds

• **lockedIds**: *object*

*Defined in [core/src/Nodes.ts:105](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/Nodes.ts#L105)*

#### Type declaration:

* \[ **id**: *string*\]: boolean

___

### `Private` material

• **material**: *ShaderMaterial*

*Defined in [core/src/Nodes.ts:104](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/Nodes.ts#L104)*

___

###  object

• **object**: *Points*

*Defined in [core/src/Nodes.ts:101](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/Nodes.ts#L101)*

## Methods

###  dispose

▸ **dispose**(): *void*

*Defined in [core/src/Nodes.ts:167](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/Nodes.ts#L167)*

**Returns:** *void*

___

###  handleCameraZoom

▸ **handleCameraZoom**(`zoom`: number): *void*

*Defined in [core/src/Nodes.ts:162](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/Nodes.ts#L162)*

**Parameters:**

Name | Type |
------ | ------ |
`zoom` | number |

**Returns:** *void*

___

###  updateAll

▸ **updateAll**(`nodes`: [DisplayNode](../interfaces/core.displaynode.md)[]): *void*

*Defined in [core/src/Nodes.ts:256](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/Nodes.ts#L256)*

update all attributes of all nodes

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`nodes` | [DisplayNode](../interfaces/core.displaynode.md)[] |   |

**Returns:** *void*

___

###  updateAllAbsoluteSizes

▸ **updateAllAbsoluteSizes**(`nodes`: [DisplayNode](../interfaces/core.displaynode.md)[]): *void*

*Defined in [core/src/Nodes.ts:294](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/Nodes.ts#L294)*

update absoluteSize attributes of all nodes

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`nodes` | [DisplayNode](../interfaces/core.displaynode.md)[] |   |

**Returns:** *void*

___

###  updateAllFills

▸ **updateAllFills**(`nodes`: [DisplayNode](../interfaces/core.displaynode.md)[]): *void*

*Defined in [core/src/Nodes.ts:358](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/Nodes.ts#L358)*

update fill and fillOpacity attributes of all nodes

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`nodes` | [DisplayNode](../interfaces/core.displaynode.md)[] |   |

**Returns:** *void*

___

###  updateAllInnerRadii

▸ **updateAllInnerRadii**(`nodes`: [DisplayNode](../interfaces/core.displaynode.md)[]): *void*

*Defined in [core/src/Nodes.ts:337](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/Nodes.ts#L337)*

update innerRadius attributes of all nodes

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`nodes` | [DisplayNode](../interfaces/core.displaynode.md)[] |   |

**Returns:** *void*

___

###  updateAllPositions

▸ **updateAllPositions**(`nodes`: [DisplayNode](../interfaces/core.displaynode.md)[]): *void*

*Defined in [core/src/Nodes.ts:271](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/Nodes.ts#L271)*

udpate position attributes of all nodes

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`nodes` | [DisplayNode](../interfaces/core.displaynode.md)[] |   |

**Returns:** *void*

___

###  updateAllScales

▸ **updateAllScales**(`nodes`: [DisplayNode](../interfaces/core.displaynode.md)[]): *void*

*Defined in [core/src/Nodes.ts:318](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/Nodes.ts#L318)*

update scale attributes of all nodes

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`nodes` | [DisplayNode](../interfaces/core.displaynode.md)[] |   |

**Returns:** *void*

___

###  updateAllStrokeOpacities

▸ **updateAllStrokeOpacities**(`nodes`: [DisplayNode](../interfaces/core.displaynode.md)[]): *void*

*Defined in [core/src/Nodes.ts:436](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/Nodes.ts#L436)*

update stroke opacity attributes of all nodes

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`nodes` | [DisplayNode](../interfaces/core.displaynode.md)[] |   |

**Returns:** *void*

___

###  updateAllStrokeWidths

▸ **updateAllStrokeWidths**(`nodes`: [DisplayNode](../interfaces/core.displaynode.md)[]): *void*

*Defined in [core/src/Nodes.ts:409](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/Nodes.ts#L409)*

update stroke width attributes of all nodes

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`nodes` | [DisplayNode](../interfaces/core.displaynode.md)[] |   |

**Returns:** *void*

___

###  updateAllStrokes

▸ **updateAllStrokes**(`nodes`: [DisplayNode](../interfaces/core.displaynode.md)[]): *void*

*Defined in [core/src/Nodes.ts:388](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/Nodes.ts#L388)*

update stroke color attributes of all nodes

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`nodes` | [DisplayNode](../interfaces/core.displaynode.md)[] |   |

**Returns:** *void*

___

###  updateOne

▸ **updateOne**(`index`: number, `node`: [DisplayNode](../interfaces/core.displaynode.md)): *void*

*Defined in [core/src/Nodes.ts:182](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/Nodes.ts#L182)*

update all attributes of one node at a given index

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`index` | number | - |
`node` | [DisplayNode](../interfaces/core.displaynode.md) |   |

**Returns:** *void*
