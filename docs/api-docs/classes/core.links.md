---
id: "core.links"
title: "Links"
sidebar_label: "Links"
---

[@graph-viz](../index.md) › [Globals](../globals.md) › [core](../modules/core.md) › [Links](core.links.md)

## Hierarchy

* **Links**

## Index

### Constructors

* [constructor](core.links.md#constructor)

### Properties

* [geometry](core.links.md#private-geometry)
* [labels](core.links.md#private-labels)
* [material](core.links.md#private-material)
* [object](core.links.md#object)

### Methods

* [dispose](core.links.md#dispose)
* [handleCameraZoom](core.links.md#handlecamerazoom)
* [updateAll](core.links.md#updateall)
* [updateAllColors](core.links.md#updateallcolors)
* [updateAllLabels](core.links.md#updatealllabels)
* [updateAllPositions](core.links.md#updateallpositions)

## Constructors

###  constructor

\+ **new Links**(`links`: [PopulatedDisplayLink](../interfaces/core.populateddisplaylink.md)[]): *[Links](core.links.md)*

*Defined in [core/src/Links.ts:98](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/Links.ts#L98)*

**Parameters:**

Name | Type |
------ | ------ |
`links` | [PopulatedDisplayLink](../interfaces/core.populateddisplaylink.md)[] |

**Returns:** *[Links](core.links.md)*

## Properties

### `Private` geometry

• **geometry**: *BufferGeometry*

*Defined in [core/src/Links.ts:95](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/Links.ts#L95)*

___

### `Private` labels

• **labels**: *[Labels](core.labels.md)*

*Defined in [core/src/Links.ts:98](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/Links.ts#L98)*

___

### `Private` material

• **material**: *ShaderMaterial*

*Defined in [core/src/Links.ts:96](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/Links.ts#L96)*

___

###  object

• **object**: *Mesh*

*Defined in [core/src/Links.ts:93](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/Links.ts#L93)*

## Methods

###  dispose

▸ **dispose**(): *void*

*Defined in [core/src/Links.ts:159](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/Links.ts#L159)*

**Returns:** *void*

___

###  handleCameraZoom

▸ **handleCameraZoom**(`zoom`: number): *void*

*Defined in [core/src/Links.ts:154](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/Links.ts#L154)*

**Parameters:**

Name | Type |
------ | ------ |
`zoom` | number |

**Returns:** *void*

___

###  updateAll

▸ **updateAll**(`links`: [PopulatedDisplayLink](../interfaces/core.populateddisplaylink.md)[]): *void*

*Defined in [core/src/Links.ts:169](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/Links.ts#L169)*

update all attributes for all links

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`links` | [PopulatedDisplayLink](../interfaces/core.populateddisplaylink.md)[] |   |

**Returns:** *void*

___

###  updateAllColors

▸ **updateAllColors**(`links`: [PopulatedDisplayLink](../interfaces/core.populateddisplaylink.md)[]): *void*

*Defined in [core/src/Links.ts:325](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/Links.ts#L325)*

update color attributes for all links

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`links` | [PopulatedDisplayLink](../interfaces/core.populateddisplaylink.md)[] |   |

**Returns:** *void*

___

###  updateAllLabels

▸ **updateAllLabels**(`links`: [PopulatedDisplayLink](../interfaces/core.populateddisplaylink.md)[]): *void*

*Defined in [core/src/Links.ts:356](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/Links.ts#L356)*

**Parameters:**

Name | Type |
------ | ------ |
`links` | [PopulatedDisplayLink](../interfaces/core.populateddisplaylink.md)[] |

**Returns:** *void*

___

###  updateAllPositions

▸ **updateAllPositions**(`links`: [PopulatedDisplayLink](../interfaces/core.populateddisplaylink.md)[]): *void*

*Defined in [core/src/Links.ts:179](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/Links.ts#L179)*

update position, uv, quadLength, linkOffset, arrowHeight and dashGap attributes for all links

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`links` | [PopulatedDisplayLink](../interfaces/core.populateddisplaylink.md)[] |   |

**Returns:** *void*
