---
id: "core.groupstyleattributes"
title: "GroupStyleAttributes"
sidebar_label: "GroupStyleAttributes"
---

[@graph-viz](../index.md) › [Globals](../globals.md) › [core](../modules/core.md) › [GroupStyleAttributes](core.groupstyleattributes.md)

## Hierarchy

* **GroupStyleAttributes**

  ↳ [DisplayGroup](core.displaygroup.md)

## Index

### Properties

* [fill](core.groupstyleattributes.md#optional-fill)
* [fillOpacity](core.groupstyleattributes.md#optional-fillopacity)
* [padding](core.groupstyleattributes.md#optional-padding)
* [shape](core.groupstyleattributes.md#optional-shape)
* [visible](core.groupstyleattributes.md#optional-visible)

## Properties

### `Optional` fill

• **fill**? : *undefined | string*

*Defined in [packages/core/src/DisplayGroups.ts:28](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/DisplayGroups.ts#L28)*

fill color hex string
(default is #000000)

___

### `Optional` fillOpacity

• **fillOpacity**? : *undefined | number*

*Defined in [packages/core/src/DisplayGroups.ts:34](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/DisplayGroups.ts#L34)*

relative node fill opacity
(must be between 0.0 - 1.0)

___

### `Optional` padding

• **padding**? : *undefined | number*

*Defined in [packages/core/src/DisplayGroups.ts:39](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/DisplayGroups.ts#L39)*

inner padding from the boundary nodes

___

### `Optional` shape

• **shape**? : *"convexHull" | "circle"*

*Defined in [packages/core/src/DisplayGroups.ts:22](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/DisplayGroups.ts#L22)*

type of polygon to draw
default is convexHull

___

### `Optional` visible

• **visible**? : *undefined | false | true*

*Defined in [packages/core/src/DisplayGroups.ts:16](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/DisplayGroups.ts#L16)*

boolean to toggle the visibility of a display group on or off
