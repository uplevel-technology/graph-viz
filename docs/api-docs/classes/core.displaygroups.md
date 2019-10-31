---
id: "core.displaygroups"
title: "DisplayGroups"
sidebar_label: "DisplayGroups"
---

[@graph-viz](../index.md) › [Globals](../globals.md) › [core](../modules/core.md) › [DisplayGroups](core.displaygroups.md)

## Hierarchy

* **DisplayGroups**

## Index

### Constructors

* [constructor](core.displaygroups.md#constructor)

### Properties

* [meshes](core.displaygroups.md#private-meshes)
* [object](core.displaygroups.md#object)

### Methods

* [getGroupedNodes](core.displaygroups.md#getgroupednodes)
* [renderCircle](core.displaygroups.md#private-rendercircle)
* [renderConvexHull](core.displaygroups.md#private-renderconvexhull)
* [updateAll](core.displaygroups.md#updateall)

## Constructors

###  constructor

\+ **new DisplayGroups**(`nodes`: [DisplayNode](../interfaces/core.displaynode.md)[], `groups`: [DisplayGroup](../interfaces/core.displaygroup.md)[]): *[DisplayGroups](core.displaygroups.md)*

*Defined in [core/src/DisplayGroups.ts:48](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/DisplayGroups.ts#L48)*

**Parameters:**

Name | Type |
------ | ------ |
`nodes` | [DisplayNode](../interfaces/core.displaynode.md)[] |
`groups` | [DisplayGroup](../interfaces/core.displaygroup.md)[] |

**Returns:** *[DisplayGroups](core.displaygroups.md)*

## Properties

### `Private` meshes

• **meshes**: *object*

*Defined in [core/src/DisplayGroups.ts:48](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/DisplayGroups.ts#L48)*

#### Type declaration:

* \[ **groupId**: *string*\]: Mesh

___

###  object

• **object**: *Group* =  new THREE.Group()

*Defined in [core/src/DisplayGroups.ts:47](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/DisplayGroups.ts#L47)*

## Methods

###  getGroupedNodes

▸ **getGroupedNodes**(`nodes`: [DisplayNode](../interfaces/core.displaynode.md)[]): *object*

*Defined in [core/src/DisplayGroups.ts:83](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/DisplayGroups.ts#L83)*

**Parameters:**

Name | Type |
------ | ------ |
`nodes` | [DisplayNode](../interfaces/core.displaynode.md)[] |

**Returns:** *object*

* \[ **groupId**: *string*\]: [DisplayNode](../interfaces/core.displaynode.md)[]

___

### `Private` renderCircle

▸ **renderCircle**(`group`: [DisplayGroup](../interfaces/core.displaygroup.md), `nodesInGroup`: [DisplayNode](../interfaces/core.displaynode.md)[]): *void*

*Defined in [core/src/DisplayGroups.ts:140](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/DisplayGroups.ts#L140)*

**Parameters:**

Name | Type |
------ | ------ |
`group` | [DisplayGroup](../interfaces/core.displaygroup.md) |
`nodesInGroup` | [DisplayNode](../interfaces/core.displaynode.md)[] |

**Returns:** *void*

___

### `Private` renderConvexHull

▸ **renderConvexHull**(`group`: [DisplayGroup](../interfaces/core.displaygroup.md), `nodesInGroup`: [DisplayNode](../interfaces/core.displaynode.md)[]): *void*

*Defined in [core/src/DisplayGroups.ts:101](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/DisplayGroups.ts#L101)*

**Parameters:**

Name | Type |
------ | ------ |
`group` | [DisplayGroup](../interfaces/core.displaygroup.md) |
`nodesInGroup` | [DisplayNode](../interfaces/core.displaynode.md)[] |

**Returns:** *void*

___

###  updateAll

▸ **updateAll**(`nodes`: [DisplayNode](../interfaces/core.displaynode.md)[], `groups`: [DisplayGroup](../interfaces/core.displaygroup.md)[]): *void*

*Defined in [core/src/DisplayGroups.ts:54](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/DisplayGroups.ts#L54)*

**Parameters:**

Name | Type |
------ | ------ |
`nodes` | [DisplayNode](../interfaces/core.displaynode.md)[] |
`groups` | [DisplayGroup](../interfaces/core.displaygroup.md)[] |

**Returns:** *void*
