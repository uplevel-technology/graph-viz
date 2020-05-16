---
id: "react"
title: "react"
sidebar_label: "react"
---

[@graph-viz](../index.md) › [Globals](../globals.md) › [react](react.md)

## Index

### References

* [GraphVizComponent](react.md#graphvizcomponent)
* [GraphVizGroup](react.md#graphvizgroup)
* [GraphVizLink](react.md#graphvizlink)
* [GraphVizNode](react.md#graphviznode)
* [lockNode](react.md#locknode)
* [magnifyNode](react.md#magnifynode)
* [resetNodeScale](react.md#resetnodescale)
* [toggleNodeLock](react.md#togglenodelock)
* [unlockNode](react.md#unlocknode)

### Classes

* [GraphVizComponent](../classes/react.graphvizcomponent.md)

### Interfaces

* [GraphVizComponentProps](../interfaces/react.graphvizcomponentprops.md)
* [NodeTooltipsProps](../interfaces/react.nodetooltipsprops.md)
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
* [HOVERED_NODE_SCALE](react.md#const-hovered_node_scale)
* [LOCKED_NODE_STROKE_OPACITY](react.md#const-locked_node_stroke_opacity)
* [LOCKED_NODE_STROKE_WIDTH](react.md#const-locked_node_stroke_width)

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

## References

###  GraphVizComponent

• **GraphVizComponent**:

___

###  GraphVizGroup

• **GraphVizGroup**:

___

###  GraphVizLink

• **GraphVizLink**:

___

###  GraphVizNode

• **GraphVizNode**:

___

###  lockNode

• **lockNode**:

___

###  magnifyNode

• **magnifyNode**:

___

###  resetNodeScale

• **resetNodeScale**:

___

###  toggleNodeLock

• **toggleNodeLock**:

___

###  unlockNode

• **unlockNode**:

## Type aliases

###  GraphVizGroup

Ƭ **GraphVizGroup**: *DisplayGroup & SimulationGroup*

*Defined in [packages/react/src/GraphVizComponent.tsx:30](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/react/src/GraphVizComponent.tsx#L30)*

___

###  GraphVizLink

Ƭ **GraphVizLink**: *DisplayLink & SimulationLink*

*Defined in [packages/react/src/GraphVizComponent.tsx:28](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/react/src/GraphVizComponent.tsx#L28)*

___

###  GraphVizNode

Ƭ **GraphVizNode**: *Partial‹DisplayNode & SimulationNode› & Pick‹DisplayNode, "id"›*

*Defined in [packages/react/src/GraphVizComponent.tsx:25](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/react/src/GraphVizComponent.tsx#L25)*

Primary GraphVizData type definitions

## Variables

### `Const` DRAFT_NODE_ID

• **DRAFT_NODE_ID**: *"draft-node"* = "draft-node"

*Defined in [packages/react/src/GraphVizComponent.tsx:84](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/react/src/GraphVizComponent.tsx#L84)*

___

### `Const` HOVERED_NODE_SCALE

• **HOVERED_NODE_SCALE**: *1.5* = 1.5

*Defined in [packages/react/src/vizUtils.ts:6](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/react/src/vizUtils.ts#L6)*

___

### `Const` LOCKED_NODE_STROKE_OPACITY

• **LOCKED_NODE_STROKE_OPACITY**: *0.4* = 0.4

*Defined in [packages/react/src/vizUtils.ts:5](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/react/src/vizUtils.ts#L5)*

___

### `Const` LOCKED_NODE_STROKE_WIDTH

• **LOCKED_NODE_STROKE_WIDTH**: *0.3* = 0.3

*Defined in [packages/react/src/vizUtils.ts:4](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/react/src/vizUtils.ts#L4)*

## Functions

###  NodeTooltips

▸ **NodeTooltips**(`props`: [NodeTooltipsProps](../interfaces/react.nodetooltipsprops.md)): *null | Element‹›*

*Defined in [packages/react/src/NodeTooltips.tsx:43](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/react/src/NodeTooltips.tsx#L43)*

**Parameters:**

Name | Type |
------ | ------ |
`props` | [NodeTooltipsProps](../interfaces/react.nodetooltipsprops.md) |

**Returns:** *null | Element‹›*

___

### `Const` getTooltipStyle

▸ **getTooltipStyle**(`node`: [TooltipNode](../interfaces/react.tooltipnode.md)): *CSSProperties*

*Defined in [packages/react/src/NodeTooltips.tsx:14](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/react/src/NodeTooltips.tsx#L14)*

**Parameters:**

Name | Type |
------ | ------ |
`node` | [TooltipNode](../interfaces/react.tooltipnode.md) |

**Returns:** *CSSProperties*

___

### `Const` lockNode

▸ **lockNode**(`node`: [GraphVizNode](react.md#graphviznode), `newPos?`: [Vec2](../interfaces/react.vec2.md)): *void*

*Defined in [packages/react/src/vizUtils.ts:21](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/react/src/vizUtils.ts#L21)*

**Parameters:**

Name | Type |
------ | ------ |
`node` | [GraphVizNode](react.md#graphviznode) |
`newPos?` | [Vec2](../interfaces/react.vec2.md) |

**Returns:** *void*

___

### `Const` magnifyNode

▸ **magnifyNode**(`node`: [GraphVizNode](react.md#graphviznode)): *void*

*Defined in [packages/react/src/vizUtils.ts:42](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/react/src/vizUtils.ts#L42)*

**Parameters:**

Name | Type |
------ | ------ |
`node` | [GraphVizNode](react.md#graphviznode) |

**Returns:** *void*

___

### `Const` resetNodeScale

▸ **resetNodeScale**(`node`: [GraphVizNode](react.md#graphviznode)): *void*

*Defined in [packages/react/src/vizUtils.ts:46](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/react/src/vizUtils.ts#L46)*

**Parameters:**

Name | Type |
------ | ------ |
`node` | [GraphVizNode](react.md#graphviznode) |

**Returns:** *void*

___

### `Const` toggleNodeLock

▸ **toggleNodeLock**(`node`: [GraphVizNode](react.md#graphviznode), `newPos?`: [Vec2](../interfaces/react.vec2.md)): *void*

*Defined in [packages/react/src/vizUtils.ts:13](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/react/src/vizUtils.ts#L13)*

**Parameters:**

Name | Type |
------ | ------ |
`node` | [GraphVizNode](react.md#graphviznode) |
`newPos?` | [Vec2](../interfaces/react.vec2.md) |

**Returns:** *void*

___

### `Const` unlockNode

▸ **unlockNode**(`node`: [GraphVizNode](react.md#graphviznode)): *void*

*Defined in [packages/react/src/vizUtils.ts:34](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/react/src/vizUtils.ts#L34)*

**Parameters:**

Name | Type |
------ | ------ |
`node` | [GraphVizNode](react.md#graphviznode) |

**Returns:** *void*

## Object literals

### `Const` styles

### ▪ **styles**: *object*

*Defined in [packages/react/src/NodeTooltips.tsx:24](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/react/src/NodeTooltips.tsx#L24)*

▪ **root**: *object*

*Defined in [packages/react/src/NodeTooltips.tsx:25](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/react/src/NodeTooltips.tsx#L25)*

* **backgroundColor**: *string* = "rgb(200,207,214, 0.7)"

* **borderRadius**: *number* = 3

* **fontSize**: *number* = 12

* **maxWidth**: *number* = 250

* **overflow**: *"hidden"* = 'hidden' as const

* **padding**: *number* = 6

* **pointerEvents**: *"none"* = 'none' as const

* **position**: *"absolute"* = 'absolute' as const

* **textTransform**: *"capitalize"* = 'capitalize' as const

___

### `Const` styles

### ▪ **styles**: *object*

*Defined in [packages/react/src/GraphVizComponent.tsx:32](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/react/src/GraphVizComponent.tsx#L32)*

▪ **actionButtons**: *object*

*Defined in [packages/react/src/GraphVizComponent.tsx:39](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/react/src/GraphVizComponent.tsx#L39)*

* **position**: *"absolute"* = 'absolute' as const

* **right**: *number* = 0

* **top**: *number* = 0

▪ **root**: *object*

*Defined in [packages/react/src/GraphVizComponent.tsx:33](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/react/src/GraphVizComponent.tsx#L33)*

* **display**: *string* = "flex"

* **height**: *string* = "100%"

* **position**: *"relative"* = 'relative' as const

* **width**: *string* = "100%"
