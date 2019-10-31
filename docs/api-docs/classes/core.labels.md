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

* [meshes](core.labels.md#private-meshes)
* [object](core.labels.md#object)
* [planeGeometry](core.labels.md#private-planegeometry)
* [textures](core.labels.md#private-textures)

### Methods

* [dispose](core.labels.md#dispose)
* [getTexture](core.labels.md#private-gettexture)
* [updateAll](core.labels.md#updateall)

## Constructors

###  constructor

\+ **new Labels**(): *[Labels](core.labels.md)*

*Defined in [core/src/Labels.ts:128](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/Labels.ts#L128)*

**Returns:** *[Labels](core.labels.md)*

## Properties

### `Private` meshes

• **meshes**: *object*

*Defined in [core/src/Labels.ts:127](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/Labels.ts#L127)*

#### Type declaration:

* \[ **linkIndex**: *number*\]: Mesh

___

###  object

• **object**: *Object3D*

*Defined in [core/src/Labels.ts:125](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/Labels.ts#L125)*

___

### `Private` planeGeometry

• **planeGeometry**: *PlaneBufferGeometry*

*Defined in [core/src/Labels.ts:126](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/Labels.ts#L126)*

___

### `Private` textures

• **textures**: *object*

*Defined in [core/src/Labels.ts:128](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/Labels.ts#L128)*

#### Type declaration:

* \[ **text**: *string*\]: [TextTexture](../interfaces/core.texttexture.md)

## Methods

###  dispose

▸ **dispose**(): *void*

*Defined in [core/src/Labels.ts:214](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/Labels.ts#L214)*

**Returns:** *void*

___

### `Private` getTexture

▸ **getTexture**(`text`: string, `labelScale`: number): *[TextTexture](../interfaces/core.texttexture.md)*

*Defined in [core/src/Labels.ts:138](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/Labels.ts#L138)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`text` | string | - |
`labelScale` | number | 1 |

**Returns:** *[TextTexture](../interfaces/core.texttexture.md)*

___

###  updateAll

▸ **updateAll**(`links`: [PopulatedDisplayLink](../interfaces/core.populateddisplaylink.md)[]): *void*

*Defined in [core/src/Labels.ts:148](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/Labels.ts#L148)*

**Parameters:**

Name | Type |
------ | ------ |
`links` | [PopulatedDisplayLink](../interfaces/core.populateddisplaylink.md)[] |

**Returns:** *void*
