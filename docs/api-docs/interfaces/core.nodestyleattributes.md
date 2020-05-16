---
id: "core.nodestyleattributes"
title: "NodeStyleAttributes"
sidebar_label: "NodeStyleAttributes"
---

[@graph-viz](../index.md) › [Globals](../globals.md) › [core](../modules/core.md) › [NodeStyleAttributes](core.nodestyleattributes.md)

## Hierarchy

* **NodeStyleAttributes**

  ↳ [DisplayNode](core.displaynode.md)

## Index

### Properties

* [absoluteSize](core.nodestyleattributes.md#optional-absolutesize)
* [fill](core.nodestyleattributes.md#optional-fill)
* [fillOpacity](core.nodestyleattributes.md#optional-fillopacity)
* [innerRadius](core.nodestyleattributes.md#optional-innerradius)
* [scale](core.nodestyleattributes.md#optional-scale)
* [stroke](core.nodestyleattributes.md#optional-stroke)
* [strokeOpacity](core.nodestyleattributes.md#optional-strokeopacity)
* [strokeWidth](core.nodestyleattributes.md#optional-strokewidth)

## Properties

### `Optional` absoluteSize

• **absoluteSize**? : *undefined | number*

*Defined in [packages/core/src/Nodes.ts:25](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Nodes.ts#L25)*

the absolute side in pixels of the bounding square container of the node
(default is 20 pixels)

___

### `Optional` fill

• **fill**? : *undefined | string*

*Defined in [packages/core/src/Nodes.ts:13](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Nodes.ts#L13)*

node fill color hex string
(default is #333333)

___

### `Optional` fillOpacity

• **fillOpacity**? : *undefined | number*

*Defined in [packages/core/src/Nodes.ts:19](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Nodes.ts#L19)*

relative node fill opacity
(must be between 0.0 - 1.0)

___

### `Optional` innerRadius

• **innerRadius**? : *undefined | number*

*Defined in [packages/core/src/Nodes.ts:37](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Nodes.ts#L37)*

inner radius of the node circle relative to the absolute container size
(must be between 0.0 to 1.0). (default is 0.2)

___

### `Optional` scale

• **scale**? : *undefined | number*

*Defined in [packages/core/src/Nodes.ts:31](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Nodes.ts#L31)*

node container's scale factor
(default is 1.0)

___

### `Optional` stroke

• **stroke**? : *undefined | string*

*Defined in [packages/core/src/Nodes.ts:42](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Nodes.ts#L42)*

node strike color hex string

___

### `Optional` strokeOpacity

• **strokeOpacity**? : *undefined | number*

*Defined in [packages/core/src/Nodes.ts:48](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Nodes.ts#L48)*

relative node stroke opacity
(must be between 0.0 - 1.0)

___

### `Optional` strokeWidth

• **strokeWidth**? : *undefined | number*

*Defined in [packages/core/src/Nodes.ts:54](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/Nodes.ts#L54)*

relative node stroke width
(This width is relative to the node container. Must be between 0.0 to 1.0)
