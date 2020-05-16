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

* [defaults](core.displaygroups.md#private-defaults)
* [meshes](core.displaygroups.md#private-meshes)
* [object](core.displaygroups.md#object)

### Methods

* [getGroupedNodes](core.displaygroups.md#getgroupednodes)
* [renderCircle](core.displaygroups.md#private-rendercircle)
* [renderConvexHull](core.displaygroups.md#private-renderconvexhull)
* [updateAll](core.displaygroups.md#updateall)
* [updateDefaults](core.displaygroups.md#updatedefaults)

## Constructors

###  constructor

\+ **new DisplayGroups**(`nodes`: [DisplayNode](../interfaces/core.displaynode.md)[], `groups`: [DisplayGroup](../interfaces/core.displaygroup.md)[]): *[DisplayGroups](core.displaygroups.md)*

*Defined in [packages/core/src/DisplayGroups.ts:57](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/DisplayGroups.ts#L57)*

**Parameters:**

Name | Type |
------ | ------ |
`nodes` | [DisplayNode](../interfaces/core.displaynode.md)[] |
`groups` | [DisplayGroup](../interfaces/core.displaygroup.md)[] |

**Returns:** *[DisplayGroups](core.displaygroups.md)*

## Properties

### `Private` defaults

• **defaults**: *Required‹[GroupStyleAttributes](../interfaces/core.groupstyleattributes.md)›* = GROUP_DEFAULTS

*Defined in [packages/core/src/DisplayGroups.ts:57](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/DisplayGroups.ts#L57)*

___

### `Private` meshes

• **meshes**: *object*

*Defined in [packages/core/src/DisplayGroups.ts:56](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/DisplayGroups.ts#L56)*

#### Type declaration:

* \[ **groupId**: *string*\]: Mesh

___

###  object

• **object**: *Group‹›* = new THREE.Group()

*Defined in [packages/core/src/DisplayGroups.ts:55](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/DisplayGroups.ts#L55)*

## Methods

###  getGroupedNodes

▸ **getGroupedNodes**(`nodes`: [DisplayNode](../interfaces/core.displaynode.md)[]): *object*

*Defined in [packages/core/src/DisplayGroups.ts:119](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/DisplayGroups.ts#L119)*

**Parameters:**

Name | Type |
------ | ------ |
`nodes` | [DisplayNode](../interfaces/core.displaynode.md)[] |

**Returns:** *object*

* \[ **groupId**: *string*\]: [DisplayNode](../interfaces/core.displaynode.md)[]

___

### `Private` renderCircle

▸ **renderCircle**(`group`: [DisplayGroup](../interfaces/core.displaygroup.md), `nodesInGroup`: [DisplayNode](../interfaces/core.displaynode.md)[]): *void*

*Defined in [packages/core/src/DisplayGroups.ts:183](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/DisplayGroups.ts#L183)*

**Parameters:**

Name | Type |
------ | ------ |
`group` | [DisplayGroup](../interfaces/core.displaygroup.md) |
`nodesInGroup` | [DisplayNode](../interfaces/core.displaynode.md)[] |

**Returns:** *void*

___

### `Private` renderConvexHull

▸ **renderConvexHull**(`group`: [DisplayGroup](../interfaces/core.displaygroup.md), `nodesInGroup`: [DisplayNode](../interfaces/core.displaynode.md)[]): *void*

*Defined in [packages/core/src/DisplayGroups.ts:137](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/DisplayGroups.ts#L137)*

**Parameters:**

Name | Type |
------ | ------ |
`group` | [DisplayGroup](../interfaces/core.displaygroup.md) |
`nodesInGroup` | [DisplayNode](../interfaces/core.displaynode.md)[] |

**Returns:** *void*

___

###  updateAll

▸ **updateAll**(`nodes`: [DisplayNode](../interfaces/core.displaynode.md)[], `groups`: [DisplayGroup](../interfaces/core.displaygroup.md)[]): *void*

*Defined in [packages/core/src/DisplayGroups.ts:90](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/DisplayGroups.ts#L90)*

update all attributes and recompute everything to be sent to gpu

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`nodes` | [DisplayNode](../interfaces/core.displaynode.md)[] | - |
`groups` | [DisplayGroup](../interfaces/core.displaygroup.md)[] |   |

**Returns:** *void*

___

###  updateDefaults

▸ **updateDefaults**(`newDefaults`: [GroupStyleAttributes](../interfaces/core.groupstyleattributes.md) | undefined, `nodes`: [DisplayNode](../interfaces/core.displaynode.md)[], `groups`: [DisplayGroup](../interfaces/core.displaygroup.md)[]): *void*

*Defined in [packages/core/src/DisplayGroups.ts:70](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/DisplayGroups.ts#L70)*

update defaults
undefined values reset to default

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`newDefaults` | [GroupStyleAttributes](../interfaces/core.groupstyleattributes.md) &#124; undefined | - |
`nodes` | [DisplayNode](../interfaces/core.displaynode.md)[] | - |
`groups` | [DisplayGroup](../interfaces/core.displaygroup.md)[] |   |

**Returns:** *void*
