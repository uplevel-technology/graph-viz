---
id: "core.displaygroup"
title: "DisplayGroup"
sidebar_label: "DisplayGroup"
---

[@graph-viz](../index.md) › [Globals](../globals.md) › [core](../modules/core.md) › [DisplayGroup](core.displaygroup.md)

## Hierarchy

* **DisplayGroup**

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

• **fill**? : *number | string*

*Defined in [core/src/DisplayGroups.ts:29](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/DisplayGroups.ts#L29)*

fill color hex string or hex number
(default is 0x333333)

___

### `Optional` fillOpacity

• **fillOpacity**? : *undefined | number*

*Defined in [core/src/DisplayGroups.ts:35](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/DisplayGroups.ts#L35)*

relative node fill opacity
(must be between 0.0 - 1.0)

___

###  id

• **id**: *string*

*Defined in [core/src/DisplayGroups.ts:12](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/DisplayGroups.ts#L12)*

___

### `Optional` padding

• **padding**? : *undefined | number*

*Defined in [core/src/DisplayGroups.ts:40](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/DisplayGroups.ts#L40)*

inner padding from the boundary nodes

___

### `Optional` shape

• **shape**? : *"convexHull" | "circle"*

*Defined in [core/src/DisplayGroups.ts:23](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/DisplayGroups.ts#L23)*

type of polygon to draw
default is convexHull

___

### `Optional` visible

• **visible**? : *undefined | false | true*

*Defined in [core/src/DisplayGroups.ts:17](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/DisplayGroups.ts#L17)*

boolean to toggle the visibility of a display group on or off
