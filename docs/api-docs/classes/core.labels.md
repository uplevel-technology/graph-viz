---
id: "core.labels"
title: "Labels"
sidebar_label: "Labels"
---

[@graph-viz](../index.md) › [Globals](../globals.md) › [core](../modules/core.md) › [Labels](core.labels.md)

## Hierarchy

* **Labels**

## Index

### Constructors

* [constructor](core.labels.md#constructor)

### Properties

* [defaults](core.labels.md#private-defaults)
* [meshes](core.labels.md#private-readonly-meshes)
* [object](core.labels.md#readonly-object)
* [planeGeometry](core.labels.md#private-readonly-planegeometry)
* [textures](core.labels.md#private-readonly-textures)

### Methods

* [dispose](core.labels.md#dispose)
* [getTexture](core.labels.md#private-gettexture)
* [updateAll](core.labels.md#updateall)
* [updateDefaults](core.labels.md#updatedefaults)

## Constructors

###  constructor

\+ **new Labels**(): *[Labels](core.labels.md)*

*Defined in [packages/core/src/Labels.ts:135](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Labels.ts#L135)*

**Returns:** *[Labels](core.labels.md)*

## Properties

### `Private` defaults

• **defaults**: *Required‹[LabelStyleAttributes](../interfaces/core.labelstyleattributes.md)›* = LABEL_DEFAULTS

*Defined in [packages/core/src/Labels.ts:135](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Labels.ts#L135)*

___

### `Private` `Readonly` meshes

• **meshes**: *object*

*Defined in [packages/core/src/Labels.ts:133](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Labels.ts#L133)*

#### Type declaration:

* \[ **linkIndex**: *number*\]: Mesh

___

### `Readonly` object

• **object**: *Object3D*

*Defined in [packages/core/src/Labels.ts:131](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Labels.ts#L131)*

___

### `Private` `Readonly` planeGeometry

• **planeGeometry**: *PlaneBufferGeometry*

*Defined in [packages/core/src/Labels.ts:132](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Labels.ts#L132)*

___

### `Private` `Readonly` textures

• **textures**: *object*

*Defined in [packages/core/src/Labels.ts:134](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Labels.ts#L134)*

#### Type declaration:

* \[ **text**: *string*\]: [TextTexture](../interfaces/core.texttexture.md)

## Methods

###  dispose

▸ **dispose**(): *void*

*Defined in [packages/core/src/Labels.ts:232](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Labels.ts#L232)*

**Returns:** *void*

___

### `Private` getTexture

▸ **getTexture**(`text`: string, `labelScale`: number): *[TextTexture](../interfaces/core.texttexture.md)*

*Defined in [packages/core/src/Labels.ts:145](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Labels.ts#L145)*

**Parameters:**

Name | Type |
------ | ------ |
`text` | string |
`labelScale` | number |

**Returns:** *[TextTexture](../interfaces/core.texttexture.md)*

___

###  updateAll

▸ **updateAll**(`links`: [PopulatedDisplayLink](../interfaces/core.populateddisplaylink.md)[]): *void*

*Defined in [packages/core/src/Labels.ts:166](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Labels.ts#L166)*

**Parameters:**

Name | Type |
------ | ------ |
`links` | [PopulatedDisplayLink](../interfaces/core.populateddisplaylink.md)[] |

**Returns:** *void*

___

###  updateDefaults

▸ **updateDefaults**(`newDefaults`: [LabelStyleAttributes](../interfaces/core.labelstyleattributes.md), `links`: [PopulatedDisplayLink](../interfaces/core.populateddisplaylink.md)[]): *void*

*Defined in [packages/core/src/Labels.ts:155](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Labels.ts#L155)*

**Parameters:**

Name | Type |
------ | ------ |
`newDefaults` | [LabelStyleAttributes](../interfaces/core.labelstyleattributes.md) |
`links` | [PopulatedDisplayLink](../interfaces/core.populateddisplaylink.md)[] |

**Returns:** *void*
