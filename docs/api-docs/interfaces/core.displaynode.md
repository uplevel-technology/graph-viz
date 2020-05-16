---
id: "core.displaynode"
title: "DisplayNode"
sidebar_label: "DisplayNode"
---

[@graph-viz](../index.md) › [Globals](../globals.md) › [core](../modules/core.md) › [DisplayNode](core.displaynode.md)

## Hierarchy

* [NodeStyleAttributes](core.nodestyleattributes.md)

  ↳ **DisplayNode**

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

*Inherited from [NodeStyleAttributes](core.nodestyleattributes.md).[absoluteSize](core.nodestyleattributes.md#optional-absolutesize)*

*Defined in [packages/core/src/Nodes.ts:25](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Nodes.ts#L25)*

the absolute side in pixels of the bounding square container of the node
(default is 20 pixels)

___

### `Optional` disableInteractions

• **disableInteractions**? : *undefined | false | true*

*Defined in [packages/core/src/Nodes.ts:83](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Nodes.ts#L83)*

disables interactions on this node if set
(default is false)
NOTE: this could be defined on a mouse interaction node interface

___

### `Optional` displayGroupIds

• **displayGroupIds**? : *string[]*

*Defined in [packages/core/src/Nodes.ts:66](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Nodes.ts#L66)*

optional display group IDs

___

### `Optional` fill

• **fill**? : *undefined | string*

*Inherited from [NodeStyleAttributes](core.nodestyleattributes.md).[fill](core.nodestyleattributes.md#optional-fill)*

*Defined in [packages/core/src/Nodes.ts:13](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Nodes.ts#L13)*

node fill color hex string
(default is #333333)

___

### `Optional` fillOpacity

• **fillOpacity**? : *undefined | number*

*Inherited from [NodeStyleAttributes](core.nodestyleattributes.md).[fillOpacity](core.nodestyleattributes.md#optional-fillopacity)*

*Defined in [packages/core/src/Nodes.ts:19](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Nodes.ts#L19)*

relative node fill opacity
(must be between 0.0 - 1.0)

___

###  id

• **id**: *string*

*Defined in [packages/core/src/Nodes.ts:61](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Nodes.ts#L61)*

Unique node id

___

### `Optional` innerRadius

• **innerRadius**? : *undefined | number*

*Inherited from [NodeStyleAttributes](core.nodestyleattributes.md).[innerRadius](core.nodestyleattributes.md#optional-innerradius)*

*Defined in [packages/core/src/Nodes.ts:37](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Nodes.ts#L37)*

inner radius of the node circle relative to the absolute container size
(must be between 0.0 to 1.0). (default is 0.2)

___

### `Optional` scale

• **scale**? : *undefined | number*

*Inherited from [NodeStyleAttributes](core.nodestyleattributes.md).[scale](core.nodestyleattributes.md#optional-scale)*

*Defined in [packages/core/src/Nodes.ts:31](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Nodes.ts#L31)*

node container's scale factor
(default is 1.0)

___

### `Optional` stroke

• **stroke**? : *undefined | string*

*Inherited from [NodeStyleAttributes](core.nodestyleattributes.md).[stroke](core.nodestyleattributes.md#optional-stroke)*

*Defined in [packages/core/src/Nodes.ts:42](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Nodes.ts#L42)*

node strike color hex string

___

### `Optional` strokeOpacity

• **strokeOpacity**? : *undefined | number*

*Inherited from [NodeStyleAttributes](core.nodestyleattributes.md).[strokeOpacity](core.nodestyleattributes.md#optional-strokeopacity)*

*Defined in [packages/core/src/Nodes.ts:48](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Nodes.ts#L48)*

relative node stroke opacity
(must be between 0.0 - 1.0)

___

### `Optional` strokeWidth

• **strokeWidth**? : *undefined | number*

*Inherited from [NodeStyleAttributes](core.nodestyleattributes.md).[strokeWidth](core.nodestyleattributes.md#optional-strokewidth)*

*Defined in [packages/core/src/Nodes.ts:54](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Nodes.ts#L54)*

relative node stroke width
(This width is relative to the node container. Must be between 0.0 to 1.0)

___

###  x

• **x**: *number*

*Defined in [packages/core/src/Nodes.ts:71](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Nodes.ts#L71)*

x coordinate of the node position

___

###  y

• **y**: *number*

*Defined in [packages/core/src/Nodes.ts:76](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Nodes.ts#L76)*

y position of the node position
