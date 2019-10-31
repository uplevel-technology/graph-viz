---
id: "react.props"
title: "Props"
sidebar_label: "Props"
---

[@graph-viz](../index.md) › [Globals](../globals.md) › [react](../modules/react.md) › [Props](react.props.md)

## Hierarchy

* **Props**

## Index

### Properties

* [config](react.props.md#optional-config)
* [editMode](react.props.md#optional-editmode)
* [groups](react.props.md#groups)
* [links](react.props.md#links)
* [nodes](react.props.md#nodes)
* [onClick](react.props.md#onclick)
* [onLinkDrawn](react.props.md#onlinkdrawn)
* [onRefresh](react.props.md#optional-onrefresh)
* [onSecondaryClick](react.props.md#onsecondaryclick)
* [showControls](react.props.md#optional-showcontrols)
* [tooltips](react.props.md#tooltips)

## Properties

### `Optional` config

• **config**? : *[ConfigurationOptions](core.configurationoptions.md)*

*Defined in [react/src/GraphVizComponent.tsx:60](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/react/src/GraphVizComponent.tsx#L60)*

___

### `Optional` editMode

• **editMode**? : *undefined | false | true*

*Defined in [react/src/GraphVizComponent.tsx:66](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/react/src/GraphVizComponent.tsx#L66)*

enables graph editing
i.e. for now only the drawing of links

___

###  groups

• **groups**: *[GraphVizGroup](../modules/react.md#graphvizgroup)[]*

*Defined in [react/src/GraphVizComponent.tsx:57](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/react/src/GraphVizComponent.tsx#L57)*

___

###  links

• **links**: *[GraphVizLink](../modules/react.md#graphvizlink)[]*

*Defined in [react/src/GraphVizComponent.tsx:56](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/react/src/GraphVizComponent.tsx#L56)*

___

###  nodes

• **nodes**: *[GraphVizNode](../modules/react.md#graphviznode)[]*

*Defined in [react/src/GraphVizComponent.tsx:55](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/react/src/GraphVizComponent.tsx#L55)*

___

###  onClick

• **onClick**: *function*

*Defined in [react/src/GraphVizComponent.tsx:77](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/react/src/GraphVizComponent.tsx#L77)*

callback dispatched on primary click

#### Type declaration:

▸ (`event`: MouseEvent, `clickedNodeIdx`: number | null): *any*

**Parameters:**

Name | Type |
------ | ------ |
`event` | MouseEvent |
`clickedNodeIdx` | number &#124; null |

___

###  onLinkDrawn

• **onLinkDrawn**: *function*

*Defined in [react/src/GraphVizComponent.tsx:72](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/react/src/GraphVizComponent.tsx#L72)*

callback dispatched when a valid link is drawn.
requires editMode to be true

#### Type declaration:

▸ (`source`: [GraphVizNode](../modules/react.md#graphviznode), `target`: [GraphVizNode](../modules/react.md#graphviznode)): *any*

**Parameters:**

Name | Type |
------ | ------ |
`source` | [GraphVizNode](../modules/react.md#graphviznode) |
`target` | [GraphVizNode](../modules/react.md#graphviznode) |

___

### `Optional` onRefresh

• **onRefresh**? : *undefined | function*

*Defined in [react/src/GraphVizComponent.tsx:59](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/react/src/GraphVizComponent.tsx#L59)*

___

###  onSecondaryClick

• **onSecondaryClick**: *function*

*Defined in [react/src/GraphVizComponent.tsx:82](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/react/src/GraphVizComponent.tsx#L82)*

callback dispatched on secondary click

#### Type declaration:

▸ (`event`: MouseEvent, `clickedNodeIdx`: number | null): *any*

**Parameters:**

Name | Type |
------ | ------ |
`event` | MouseEvent |
`clickedNodeIdx` | number &#124; null |

___

### `Optional` showControls

• **showControls**? : *undefined | false | true*

*Defined in [react/src/GraphVizComponent.tsx:61](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/react/src/GraphVizComponent.tsx#L61)*

___

###  tooltips

• **tooltips**: *Partial‹[TooltipNode](react.tooltipnode.md)›[]*

*Defined in [react/src/GraphVizComponent.tsx:58](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/react/src/GraphVizComponent.tsx#L58)*
