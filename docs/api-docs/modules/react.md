---
id: "react"
title: "react"
sidebar_label: "react"
---

[@graph-viz](../index.md) › [Globals](../globals.md) › [react](react.md)

## Index

### Classes

* [GraphVizComponent](../classes/react.graphvizcomponent.md)

### Interfaces

* [NodeTooltipsProps](../interfaces/react.nodetooltipsprops.md)
* [Props](../interfaces/react.props.md)
* [State](../interfaces/react.state.md)
* [TooltipFields](../interfaces/react.tooltipfields.md)
* [TooltipNode](../interfaces/react.tooltipnode.md)
* [Vec2](../interfaces/react.vec2.md)

### Type aliases

* [GraphVizGroup](react.md#graphvizgroup)
* [GraphVizLink](react.md#graphvizlink)
* [GraphVizNode](react.md#graphviznode)

### Variables

* [DRAFT_NODE_ID](react.md#const-draft_node_id)

### Functions

* [NodeTooltips](react.md#nodetooltips)
* [getTooltipStyle](react.md#const-gettooltipstyle)
* [lockNode](react.md#const-locknode)
* [magnifyNode](react.md#const-magnifynode)
* [resetNodeScale](react.md#const-resetnodescale)
* [toggleNodeLock](react.md#const-togglenodelock)
* [unlockNode](react.md#const-unlocknode)

### Object literals

* [styles](react.md#const-styles)
* [styles](react.md#const-styles)

## Type aliases

###  GraphVizGroup

Ƭ **GraphVizGroup**: *DisplayGroup & SimulationGroup*

*Defined in [react/src/GraphVizComponent.tsx:29](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/react/src/GraphVizComponent.tsx#L29)*

___

###  GraphVizLink

Ƭ **GraphVizLink**: *DisplayLink & SimulationLink*

*Defined in [react/src/GraphVizComponent.tsx:27](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/react/src/GraphVizComponent.tsx#L27)*

___

###  GraphVizNode

Ƭ **GraphVizNode**: *Partial‹DisplayNode & SimulationNode› & Pick‹DisplayNode, "id"›*

*Defined in [react/src/GraphVizComponent.tsx:24](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/react/src/GraphVizComponent.tsx#L24)*

Primary GraphVizData type definitions

## Variables

### `Const` DRAFT_NODE_ID

• **DRAFT_NODE_ID**: *"draft-node"* = "draft-node"

*Defined in [react/src/GraphVizComponent.tsx:85](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/react/src/GraphVizComponent.tsx#L85)*

## Functions

###  NodeTooltips

▸ **NodeTooltips**(`props`: [NodeTooltipsProps](../interfaces/react.nodetooltipsprops.md)): *null | Element*

*Defined in [react/src/NodeTooltips.tsx:43](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/react/src/NodeTooltips.tsx#L43)*

**Parameters:**

Name | Type |
------ | ------ |
`props` | [NodeTooltipsProps](../interfaces/react.nodetooltipsprops.md) |

**Returns:** *null | Element*

___

### `Const` getTooltipStyle

▸ **getTooltipStyle**(`node`: [TooltipNode](../interfaces/react.tooltipnode.md)): *CSSProperties*

*Defined in [react/src/NodeTooltips.tsx:14](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/react/src/NodeTooltips.tsx#L14)*

**Parameters:**

Name | Type |
------ | ------ |
`node` | [TooltipNode](../interfaces/react.tooltipnode.md) |

**Returns:** *CSSProperties*

___

### `Const` lockNode

▸ **lockNode**(`node`: [GraphVizNode](react.md#graphviznode), `newPos?`: [Vec2](../interfaces/react.vec2.md)): *void*

*Defined in [react/src/vizUtils.ts:24](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/react/src/vizUtils.ts#L24)*

**Parameters:**

Name | Type |
------ | ------ |
`node` | [GraphVizNode](react.md#graphviznode) |
`newPos?` | [Vec2](../interfaces/react.vec2.md) |

**Returns:** *void*

___

### `Const` magnifyNode

▸ **magnifyNode**(`node`: [GraphVizNode](react.md#graphviznode)): *void*

*Defined in [react/src/vizUtils.ts:45](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/react/src/vizUtils.ts#L45)*

**Parameters:**

Name | Type |
------ | ------ |
`node` | [GraphVizNode](react.md#graphviznode) |

**Returns:** *void*

___

### `Const` resetNodeScale

▸ **resetNodeScale**(`node`: [GraphVizNode](react.md#graphviznode)): *void*

*Defined in [react/src/vizUtils.ts:49](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/react/src/vizUtils.ts#L49)*

**Parameters:**

Name | Type |
------ | ------ |
`node` | [GraphVizNode](react.md#graphviznode) |

**Returns:** *void*

___

### `Const` toggleNodeLock

▸ **toggleNodeLock**(`node`: [GraphVizNode](react.md#graphviznode), `newPos?`: [Vec2](../interfaces/react.vec2.md)): *void*

*Defined in [react/src/vizUtils.ts:16](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/react/src/vizUtils.ts#L16)*

**Parameters:**

Name | Type |
------ | ------ |
`node` | [GraphVizNode](react.md#graphviznode) |
`newPos?` | [Vec2](../interfaces/react.vec2.md) |

**Returns:** *void*

___

### `Const` unlockNode

▸ **unlockNode**(`node`: [GraphVizNode](react.md#graphviznode)): *void*

*Defined in [react/src/vizUtils.ts:37](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/react/src/vizUtils.ts#L37)*

**Parameters:**

Name | Type |
------ | ------ |
`node` | [GraphVizNode](react.md#graphviznode) |

**Returns:** *void*

## Object literals

### `Const` styles

### ▪ **styles**: *object*

*Defined in [react/src/NodeTooltips.tsx:24](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/react/src/NodeTooltips.tsx#L24)*

▪ **root**: *object*

*Defined in [react/src/NodeTooltips.tsx:25](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/react/src/NodeTooltips.tsx#L25)*

* **backgroundColor**: *string* = "rgb(200,207,214, 0.7)"

* **borderRadius**: *number* = 3

* **fontSize**: *number* = 12

* **maxWidth**: *number* = 250

* **overflow**: *"hidden"* =  'hidden' as const

* **padding**: *number* = 6

* **pointerEvents**: *"none"* =  'none' as const

* **position**: *"absolute"* =  'absolute' as const

* **textTransform**: *"capitalize"* =  'capitalize' as const

___

### `Const` styles

### ▪ **styles**: *object*

*Defined in [react/src/GraphVizComponent.tsx:31](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/react/src/GraphVizComponent.tsx#L31)*

▪ **actionButtons**: *object*

*Defined in [react/src/GraphVizComponent.tsx:41](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/react/src/GraphVizComponent.tsx#L41)*

* **position**: *"absolute"* =  'absolute' as const

* **right**: *number* = 0

* **top**: *number* = 0

▪ **canvas**: *object*

*Defined in [react/src/GraphVizComponent.tsx:38](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/react/src/GraphVizComponent.tsx#L38)*

* **backgroundColor**: *string* = "white"

▪ **root**: *object*

*Defined in [react/src/GraphVizComponent.tsx:32](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/react/src/GraphVizComponent.tsx#L32)*

* **display**: *string* = "flex"

* **height**: *string* = "100%"

* **position**: *"relative"* =  'relative' as const

* **width**: *string* = "100%"
