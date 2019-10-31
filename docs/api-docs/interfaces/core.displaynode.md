---
id: "core.displaynode"
title: "DisplayNode"
sidebar_label: "DisplayNode"
---

[@graph-viz](../index.md) › [Globals](../globals.md) › [core](../modules/core.md) › [DisplayNode](core.displaynode.md)

## Hierarchy

* **DisplayNode**

## Index

### Properties

* [absoluteSize](core.displaynode.md#optional-absolutesize)
* [disableInteractions](core.displaynode.md#optional-disableinteractions)
* [displayGroupIds](core.displaynode.md#optional-displaygroupids)
* [fill](core.displaynode.md#optional-fill)
* [fillOpacity](core.displaynode.md#optional-fillopacity)
* [id](core.displaynode.md#id)
* [innerRadius](core.displaynode.md#optional-innerradius)
* [scale](core.displaynode.md#optional-scale)
* [stroke](core.displaynode.md#optional-stroke)
* [strokeOpacity](core.displaynode.md#optional-strokeopacity)
* [strokeWidth](core.displaynode.md#optional-strokewidth)
* [x](core.displaynode.md#x)
* [y](core.displaynode.md#y)

## Properties

### `Optional` absoluteSize

• **absoluteSize**? : *undefined | number*

*Defined in [core/src/Nodes.ts:47](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/Nodes.ts#L47)*

the absolute side in pixels of the bounding square container of the node
(default is 20 pixels)

___

### `Optional` disableInteractions

• **disableInteractions**? : *undefined | false | true*

*Defined in [core/src/Nodes.ts:83](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/Nodes.ts#L83)*

disables interactions on this node if set
(default is false)
NOTE: this could be defined on a mouse interaction node interface

___

### `Optional` displayGroupIds

• **displayGroupIds**? : *string[]*

*Defined in [core/src/Nodes.ts:19](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/Nodes.ts#L19)*

optional display group IDs

___

### `Optional` fill

• **fill**? : *number | string*

*Defined in [core/src/Nodes.ts:35](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/Nodes.ts#L35)*

node fill color hex string or hex number
(default is 0x333333)

___

### `Optional` fillOpacity

• **fillOpacity**? : *undefined | number*

*Defined in [core/src/Nodes.ts:41](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/Nodes.ts#L41)*

relative node fill opacity
(must be between 0.0 - 1.0)

___

###  id

• **id**: *string*

*Defined in [core/src/Nodes.ts:14](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/Nodes.ts#L14)*

Unique node id

___

### `Optional` innerRadius

• **innerRadius**? : *undefined | number*

*Defined in [core/src/Nodes.ts:59](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/Nodes.ts#L59)*

inner radius of the node circle relative to the absolute container size
(must be between 0.0 to 1.0). (default is 0.2)

___

### `Optional` scale

• **scale**? : *undefined | number*

*Defined in [core/src/Nodes.ts:53](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/Nodes.ts#L53)*

node container's scale factor
(default is 1.0)

___

### `Optional` stroke

• **stroke**? : *number | string*

*Defined in [core/src/Nodes.ts:64](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/Nodes.ts#L64)*

node strike color hex string or hex number

___

### `Optional` strokeOpacity

• **strokeOpacity**? : *undefined | number*

*Defined in [core/src/Nodes.ts:70](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/Nodes.ts#L70)*

relative node stroke opacity
(must be between 0.0 - 1.0)

___

### `Optional` strokeWidth

• **strokeWidth**? : *undefined | number*

*Defined in [core/src/Nodes.ts:76](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/Nodes.ts#L76)*

relative node stroke width
(This width is relative to the node container. Must be between 0.0 to 1.0)

___

###  x

• **x**: *number*

*Defined in [core/src/Nodes.ts:24](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/Nodes.ts#L24)*

x coordinate of the node position

___

###  y

• **y**: *number*

*Defined in [core/src/Nodes.ts:29](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/Nodes.ts#L29)*

y position of the node position
