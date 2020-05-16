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

* [defaults](core.links.md#private-defaults)
* [geometry](core.links.md#private-readonly-geometry)
* [labels](core.links.md#private-readonly-labels)
* [material](core.links.md#private-readonly-material)
* [object](core.links.md#object)

### Methods

* [dispose](core.links.md#dispose)
* [handleCameraZoom](core.links.md#handlecamerazoom)
* [initArrowOffsetIfNeeded](core.links.md#private-initarrowoffsetifneeded)
* [initArrowWidthIfNeeded](core.links.md#private-initarrowwidthifneeded)
* [initColorIfNeeded](core.links.md#private-initcolorifneeded)
* [initDashGapIfNeeded](core.links.md#private-initdashgapifneeded)
* [initOpacityIfNeeded](core.links.md#private-initopacityifneeded)
* [initPositionIfNeeded](core.links.md#private-initpositionifneeded)
* [initQuadLengthIfNeeded](core.links.md#private-initquadlengthifneeded)
* [initUvIfNeeded](core.links.md#private-inituvifneeded)
* [updateAll](core.links.md#updateall)
* [updateAllColors](core.links.md#updateallcolors)
* [updateAllLabels](core.links.md#updatealllabels)
* [updateAllPositions](core.links.md#updateallpositions)
* [updateDefaults](core.links.md#updatedefaults)

## Constructors

###  constructor

\+ **new Links**(`links`: [PopulatedDisplayLink](../interfaces/core.populateddisplaylink.md)[]): *[Links](core.links.md)*

*Defined in [packages/core/src/Links.ts:105](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Links.ts#L105)*

**Parameters:**

Name | Type |
------ | ------ |
`links` | [PopulatedDisplayLink](../interfaces/core.populateddisplaylink.md)[] |

**Returns:** *[Links](core.links.md)*

## Properties

### `Private` defaults

• **defaults**: *Required‹[LinkStyleAttributes](../interfaces/core.linkstyleattributes.md)›* = LINK_DEFAULTS

*Defined in [packages/core/src/Links.ts:105](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Links.ts#L105)*

___

### `Private` `Readonly` geometry

• **geometry**: *BufferGeometry*

*Defined in [packages/core/src/Links.ts:101](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Links.ts#L101)*

___

### `Private` `Readonly` labels

• **labels**: *[Labels](core.labels.md)*

*Defined in [packages/core/src/Links.ts:103](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Links.ts#L103)*

___

### `Private` `Readonly` material

• **material**: *ShaderMaterial*

*Defined in [packages/core/src/Links.ts:102](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Links.ts#L102)*

___

###  object

• **object**: *Mesh*

*Defined in [packages/core/src/Links.ts:99](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Links.ts#L99)*

## Methods

###  dispose

▸ **dispose**(): *void*

*Defined in [packages/core/src/Links.ts:254](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Links.ts#L254)*

**Returns:** *void*

___

###  handleCameraZoom

▸ **handleCameraZoom**(`zoom`: number): *void*

*Defined in [packages/core/src/Links.ts:249](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Links.ts#L249)*

**Parameters:**

Name | Type |
------ | ------ |
`zoom` | number |

**Returns:** *void*

___

### `Private` initArrowOffsetIfNeeded

▸ **initArrowOffsetIfNeeded**(`numVertices`: number): *void*

*Defined in [packages/core/src/Links.ts:223](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Links.ts#L223)*

**Parameters:**

Name | Type |
------ | ------ |
`numVertices` | number |

**Returns:** *void*

___

### `Private` initArrowWidthIfNeeded

▸ **initArrowWidthIfNeeded**(`numVertices`: number): *void*

*Defined in [packages/core/src/Links.ts:210](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Links.ts#L210)*

**Parameters:**

Name | Type |
------ | ------ |
`numVertices` | number |

**Returns:** *void*

___

### `Private` initColorIfNeeded

▸ **initColorIfNeeded**(`numVertices`: number): *void*

*Defined in [packages/core/src/Links.ts:184](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Links.ts#L184)*

**Parameters:**

Name | Type |
------ | ------ |
`numVertices` | number |

**Returns:** *void*

___

### `Private` initDashGapIfNeeded

▸ **initDashGapIfNeeded**(`numVertices`: number): *void*

*Defined in [packages/core/src/Links.ts:236](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Links.ts#L236)*

**Parameters:**

Name | Type |
------ | ------ |
`numVertices` | number |

**Returns:** *void*

___

### `Private` initOpacityIfNeeded

▸ **initOpacityIfNeeded**(`numVertices`: number): *void*

*Defined in [packages/core/src/Links.ts:197](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Links.ts#L197)*

**Parameters:**

Name | Type |
------ | ------ |
`numVertices` | number |

**Returns:** *void*

___

### `Private` initPositionIfNeeded

▸ **initPositionIfNeeded**(`numVertices`: number): *void*

*Defined in [packages/core/src/Links.ts:145](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Links.ts#L145)*

initAttrIfNeeded
initializes the attribute if the attribute is undefined OR if the
attribute.count needs to be resized

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`numVertices` | number |   |

**Returns:** *void*

___

### `Private` initQuadLengthIfNeeded

▸ **initQuadLengthIfNeeded**(`numVertices`: number): *void*

*Defined in [packages/core/src/Links.ts:171](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Links.ts#L171)*

**Parameters:**

Name | Type |
------ | ------ |
`numVertices` | number |

**Returns:** *void*

___

### `Private` initUvIfNeeded

▸ **initUvIfNeeded**(`numVertices`: number): *void*

*Defined in [packages/core/src/Links.ts:158](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Links.ts#L158)*

**Parameters:**

Name | Type |
------ | ------ |
`numVertices` | number |

**Returns:** *void*

___

###  updateAll

▸ **updateAll**(`links`: [PopulatedDisplayLink](../interfaces/core.populateddisplaylink.md)[]): *void*

*Defined in [packages/core/src/Links.ts:291](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Links.ts#L291)*

update all attributes for all links

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`links` | [PopulatedDisplayLink](../interfaces/core.populateddisplaylink.md)[] |   |

**Returns:** *void*

___

###  updateAllColors

▸ **updateAllColors**(`links`: [PopulatedDisplayLink](../interfaces/core.populateddisplaylink.md)[]): *void*

*Defined in [packages/core/src/Links.ts:429](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Links.ts#L429)*

update color attributes for all links

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`links` | [PopulatedDisplayLink](../interfaces/core.populateddisplaylink.md)[] |   |

**Returns:** *void*

___

###  updateAllLabels

▸ **updateAllLabels**(`links`: [PopulatedDisplayLink](../interfaces/core.populateddisplaylink.md)[]): *void*

*Defined in [packages/core/src/Links.ts:466](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Links.ts#L466)*

**Parameters:**

Name | Type |
------ | ------ |
`links` | [PopulatedDisplayLink](../interfaces/core.populateddisplaylink.md)[] |

**Returns:** *void*

___

###  updateAllPositions

▸ **updateAllPositions**(`links`: [PopulatedDisplayLink](../interfaces/core.populateddisplaylink.md)[]): *void*

*Defined in [packages/core/src/Links.ts:301](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Links.ts#L301)*

update position, uv, quadLength, linkOffset, arrowHeight and dashGap attributes for all links

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`links` | [PopulatedDisplayLink](../interfaces/core.populateddisplaylink.md)[] |   |

**Returns:** *void*

___

###  updateDefaults

▸ **updateDefaults**(`newDefaults`: [LinkStyleAttributes](../interfaces/core.linkstyleattributes.md) | undefined, `links`: [PopulatedDisplayLink](../interfaces/core.populateddisplaylink.md)[]): *void*

*Defined in [packages/core/src/Links.ts:266](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Links.ts#L266)*

update default attrs for all links
undefined values reset to default

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`newDefaults` | [LinkStyleAttributes](../interfaces/core.linkstyleattributes.md) &#124; undefined | - |
`links` | [PopulatedDisplayLink](../interfaces/core.populateddisplaylink.md)[] |   |

**Returns:** *void*
