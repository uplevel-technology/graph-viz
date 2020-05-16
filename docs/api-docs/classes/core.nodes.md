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

* [defaults](core.nodes.md#private-defaults)
* [geometry](core.nodes.md#private-readonly-geometry)
* [lockedIds](core.nodes.md#private-lockedids)
* [material](core.nodes.md#private-readonly-material)
* [object](core.nodes.md#object)

### Methods

* [dispose](core.nodes.md#dispose)
* [handleCameraZoom](core.nodes.md#handlecamerazoom)
* [initAbsoluteSizeIfNeeded](core.nodes.md#private-initabsolutesizeifneeded)
* [initFillIfNeeded](core.nodes.md#private-initfillifneeded)
* [initFillOpacityIfNeeded](core.nodes.md#private-initfillopacityifneeded)
* [initInnerRadiusIfNeeded](core.nodes.md#private-initinnerradiusifneeded)
* [initPositionIfNeeded](core.nodes.md#private-initpositionifneeded)
* [initScaleIfNeeded](core.nodes.md#private-initscaleifneeded)
* [initStrokeIfNeeded](core.nodes.md#private-initstrokeifneeded)
* [initStrokeOpacityIfNeeded](core.nodes.md#private-initstrokeopacityifneeded)
* [initStrokeWidthIfNeeded](core.nodes.md#private-initstrokewidthifneeded)
* [updateAll](core.nodes.md#updateall)
* [updateAllAbsoluteSizes](core.nodes.md#updateallabsolutesizes)
* [updateAllFills](core.nodes.md#updateallfills)
* [updateAllInnerRadii](core.nodes.md#updateallinnerradii)
* [updateAllPositions](core.nodes.md#updateallpositions)
* [updateAllScales](core.nodes.md#updateallscales)
* [updateAllStrokeOpacities](core.nodes.md#updateallstrokeopacities)
* [updateAllStrokeWidths](core.nodes.md#updateallstrokewidths)
* [updateAllStrokes](core.nodes.md#updateallstrokes)
* [updateDefaults](core.nodes.md#updatedefaults)
* [updateOne](core.nodes.md#updateone)

## Constructors

###  constructor

\+ **new Nodes**(`nodes`: [DisplayNode](../interfaces/core.displaynode.md)[]): *[Nodes](core.nodes.md)*

*Defined in [packages/core/src/Nodes.ts:103](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Nodes.ts#L103)*

**Parameters:**

Name | Type |
------ | ------ |
`nodes` | [DisplayNode](../interfaces/core.displaynode.md)[] |

**Returns:** *[Nodes](core.nodes.md)*

## Properties

### `Private` defaults

• **defaults**: *Required‹[NodeStyleAttributes](../interfaces/core.nodestyleattributes.md)›* = NODE_DEFAULTS

*Defined in [packages/core/src/Nodes.ts:103](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Nodes.ts#L103)*

___

### `Private` `Readonly` geometry

• **geometry**: *BufferGeometry*

*Defined in [packages/core/src/Nodes.ts:100](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Nodes.ts#L100)*

___

### `Private` lockedIds

• **lockedIds**: *object*

*Defined in [packages/core/src/Nodes.ts:102](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Nodes.ts#L102)*

#### Type declaration:

* \[ **id**: *string*\]: boolean

___

### `Private` `Readonly` material

• **material**: *ShaderMaterial*

*Defined in [packages/core/src/Nodes.ts:101](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Nodes.ts#L101)*

___

###  object

• **object**: *Points*

*Defined in [packages/core/src/Nodes.ts:98](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Nodes.ts#L98)*

## Methods

###  dispose

▸ **dispose**(): *void*

*Defined in [packages/core/src/Nodes.ts:260](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Nodes.ts#L260)*

**Returns:** *void*

___

###  handleCameraZoom

▸ **handleCameraZoom**(`zoom`: number): *void*

*Defined in [packages/core/src/Nodes.ts:255](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Nodes.ts#L255)*

**Parameters:**

Name | Type |
------ | ------ |
`zoom` | number |

**Returns:** *void*

___

### `Private` initAbsoluteSizeIfNeeded

▸ **initAbsoluteSizeIfNeeded**(`numVertices`: number): *void*

*Defined in [packages/core/src/Nodes.ts:151](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Nodes.ts#L151)*

**Parameters:**

Name | Type |
------ | ------ |
`numVertices` | number |

**Returns:** *void*

___

### `Private` initFillIfNeeded

▸ **initFillIfNeeded**(`numVertices`: number): *void*

*Defined in [packages/core/src/Nodes.ts:190](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Nodes.ts#L190)*

**Parameters:**

Name | Type |
------ | ------ |
`numVertices` | number |

**Returns:** *void*

___

### `Private` initFillOpacityIfNeeded

▸ **initFillOpacityIfNeeded**(`numVertices`: number): *void*

*Defined in [packages/core/src/Nodes.ts:203](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Nodes.ts#L203)*

**Parameters:**

Name | Type |
------ | ------ |
`numVertices` | number |

**Returns:** *void*

___

### `Private` initInnerRadiusIfNeeded

▸ **initInnerRadiusIfNeeded**(`numVertices`: number): *void*

*Defined in [packages/core/src/Nodes.ts:177](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Nodes.ts#L177)*

**Parameters:**

Name | Type |
------ | ------ |
`numVertices` | number |

**Returns:** *void*

___

### `Private` initPositionIfNeeded

▸ **initPositionIfNeeded**(`numVertices`: number): *void*

*Defined in [packages/core/src/Nodes.ts:138](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Nodes.ts#L138)*

initAttrIfNeeded
initializes the attribute if the attribute is undefined OR if the
attribute.count needs to be resized

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`numVertices` | number |   |

**Returns:** *void*

___

### `Private` initScaleIfNeeded

▸ **initScaleIfNeeded**(`numVertices`: number): *void*

*Defined in [packages/core/src/Nodes.ts:164](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Nodes.ts#L164)*

**Parameters:**

Name | Type |
------ | ------ |
`numVertices` | number |

**Returns:** *void*

___

### `Private` initStrokeIfNeeded

▸ **initStrokeIfNeeded**(`numVertices`: number): *void*

*Defined in [packages/core/src/Nodes.ts:216](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Nodes.ts#L216)*

**Parameters:**

Name | Type |
------ | ------ |
`numVertices` | number |

**Returns:** *void*

___

### `Private` initStrokeOpacityIfNeeded

▸ **initStrokeOpacityIfNeeded**(`numVertices`: number): *void*

*Defined in [packages/core/src/Nodes.ts:242](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Nodes.ts#L242)*

**Parameters:**

Name | Type |
------ | ------ |
`numVertices` | number |

**Returns:** *void*

___

### `Private` initStrokeWidthIfNeeded

▸ **initStrokeWidthIfNeeded**(`numVertices`: number): *void*

*Defined in [packages/core/src/Nodes.ts:229](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Nodes.ts#L229)*

**Parameters:**

Name | Type |
------ | ------ |
`numVertices` | number |

**Returns:** *void*

___

###  updateAll

▸ **updateAll**(`nodes`: [DisplayNode](../interfaces/core.displaynode.md)[]): *void*

*Defined in [packages/core/src/Nodes.ts:392](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Nodes.ts#L392)*

update all attributes of all nodes

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`nodes` | [DisplayNode](../interfaces/core.displaynode.md)[] |   |

**Returns:** *void*

___

###  updateAllAbsoluteSizes

▸ **updateAllAbsoluteSizes**(`nodes`: [DisplayNode](../interfaces/core.displaynode.md)[]): *void*

*Defined in [packages/core/src/Nodes.ts:426](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Nodes.ts#L426)*

update absoluteSize attributes of all nodes

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`nodes` | [DisplayNode](../interfaces/core.displaynode.md)[] |   |

**Returns:** *void*

___

###  updateAllFills

▸ **updateAllFills**(`nodes`: [DisplayNode](../interfaces/core.displaynode.md)[]): *void*

*Defined in [packages/core/src/Nodes.ts:478](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Nodes.ts#L478)*

update fill and fillOpacity attributes of all nodes

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`nodes` | [DisplayNode](../interfaces/core.displaynode.md)[] |   |

**Returns:** *void*

___

###  updateAllInnerRadii

▸ **updateAllInnerRadii**(`nodes`: [DisplayNode](../interfaces/core.displaynode.md)[]): *void*

*Defined in [packages/core/src/Nodes.ts:460](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Nodes.ts#L460)*

update innerRadius attributes of all nodes

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`nodes` | [DisplayNode](../interfaces/core.displaynode.md)[] |   |

**Returns:** *void*

___

###  updateAllPositions

▸ **updateAllPositions**(`nodes`: [DisplayNode](../interfaces/core.displaynode.md)[]): *void*

*Defined in [packages/core/src/Nodes.ts:407](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Nodes.ts#L407)*

udpate position attributes of all nodes

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`nodes` | [DisplayNode](../interfaces/core.displaynode.md)[] |   |

**Returns:** *void*

___

###  updateAllScales

▸ **updateAllScales**(`nodes`: [DisplayNode](../interfaces/core.displaynode.md)[]): *void*

*Defined in [packages/core/src/Nodes.ts:444](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Nodes.ts#L444)*

update scale attributes of all nodes

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`nodes` | [DisplayNode](../interfaces/core.displaynode.md)[] |   |

**Returns:** *void*

___

###  updateAllStrokeOpacities

▸ **updateAllStrokeOpacities**(`nodes`: [DisplayNode](../interfaces/core.displaynode.md)[]): *void*

*Defined in [packages/core/src/Nodes.ts:548](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Nodes.ts#L548)*

update stroke opacity attributes of all nodes

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`nodes` | [DisplayNode](../interfaces/core.displaynode.md)[] |   |

**Returns:** *void*

___

###  updateAllStrokeWidths

▸ **updateAllStrokeWidths**(`nodes`: [DisplayNode](../interfaces/core.displaynode.md)[]): *void*

*Defined in [packages/core/src/Nodes.ts:524](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Nodes.ts#L524)*

update stroke width attributes of all nodes

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`nodes` | [DisplayNode](../interfaces/core.displaynode.md)[] |   |

**Returns:** *void*

___

###  updateAllStrokes

▸ **updateAllStrokes**(`nodes`: [DisplayNode](../interfaces/core.displaynode.md)[]): *void*

*Defined in [packages/core/src/Nodes.ts:506](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Nodes.ts#L506)*

update stroke color attributes of all nodes

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`nodes` | [DisplayNode](../interfaces/core.displaynode.md)[] |   |

**Returns:** *void*

___

###  updateDefaults

▸ **updateDefaults**(`newDefaults`: [NodeStyleAttributes](../interfaces/core.nodestyleattributes.md) | undefined, `nodes`: [DisplayNode](../interfaces/core.displaynode.md)[]): *void*

*Defined in [packages/core/src/Nodes.ts:351](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Nodes.ts#L351)*

update the default style values applied to all nodes
undefined values reset to default

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`newDefaults` | [NodeStyleAttributes](../interfaces/core.nodestyleattributes.md) &#124; undefined | - |
`nodes` | [DisplayNode](../interfaces/core.displaynode.md)[] |   |

**Returns:** *void*

___

###  updateOne

▸ **updateOne**(`index`: number, `node`: [DisplayNode](../interfaces/core.displaynode.md)): *void*

*Defined in [packages/core/src/Nodes.ts:275](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Nodes.ts#L275)*

update all attributes of one node at a given index

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`index` | number | - |
`node` | [DisplayNode](../interfaces/core.displaynode.md) |   |

**Returns:** *void*
