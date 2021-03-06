---
id: "core.displaygroup"
title: "DisplayGroup"
sidebar_label: "DisplayGroup"
---

[@graph-viz](../index.md) › [Globals](../globals.md) › [core](../modules/core.md) › [DisplayGroup](core.displaygroup.md)

## Hierarchy

* [GroupStyleAttributes](core.groupstyleattributes.md)

  ↳ **DisplayGroup**

## Index

### Properties

* [fill](core.displaygroup.md#optional-fill)
* [fillOpacity](core.displaygroup.md#optional-fillopacity)
* [id](core.displaygroup.md#id)
* [padding](core.displaygroup.md#optional-padding)
* [shape](core.displaygroup.md#optional-shape)
* [visible](core.displaygroup.md#optional-visible)

## Properties

### `Optional` fill

• **fill**? : *undefined | string*

*Inherited from [GroupStyleAttributes](core.groupstyleattributes.md).[fill](core.groupstyleattributes.md#optional-fill)*

*Defined in [packages/core/src/DisplayGroups.ts:28](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/DisplayGroups.ts#L28)*

fill color hex string
(default is #000000)

___

### `Optional` fillOpacity

• **fillOpacity**? : *undefined | number*

*Inherited from [GroupStyleAttributes](core.groupstyleattributes.md).[fillOpacity](core.groupstyleattributes.md#optional-fillopacity)*

*Defined in [packages/core/src/DisplayGroups.ts:34](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/DisplayGroups.ts#L34)*

relative node fill opacity
(must be between 0.0 - 1.0)

___

###  id

• **id**: *string*

*Defined in [packages/core/src/DisplayGroups.ts:43](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/DisplayGroups.ts#L43)*

___

### `Optional` padding

• **padding**? : *undefined | number*

*Inherited from [GroupStyleAttributes](core.groupstyleattributes.md).[padding](core.groupstyleattributes.md#optional-padding)*

*Defined in [packages/core/src/DisplayGroups.ts:39](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/DisplayGroups.ts#L39)*

inner padding from the boundary nodes

___

### `Optional` shape

• **shape**? : *"convexHull" | "circle"*

*Inherited from [GroupStyleAttributes](core.groupstyleattributes.md).[shape](core.groupstyleattributes.md#optional-shape)*

*Defined in [packages/core/src/DisplayGroups.ts:22](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/DisplayGroups.ts#L22)*

type of polygon to draw
default is convexHull

___

### `Optional` visible

• **visible**? : *undefined | false | true*

*Inherited from [GroupStyleAttributes](core.groupstyleattributes.md).[visible](core.groupstyleattributes.md#optional-visible)*

*Defined in [packages/core/src/DisplayGroups.ts:16](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/DisplayGroups.ts#L16)*

boolean to toggle the visibility of a display group on or off
