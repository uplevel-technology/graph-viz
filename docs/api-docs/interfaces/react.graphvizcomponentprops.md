---
id: "react.graphvizcomponentprops"
title: "GraphVizComponentProps"
sidebar_label: "GraphVizComponentProps"
---

[@graph-viz](../index.md) › [Globals](../globals.md) › [react](../modules/react.md) › [GraphVizComponentProps](react.graphvizcomponentprops.md)

## Hierarchy

* **GraphVizComponentProps**

## Index

### Properties

* [config](react.graphvizcomponentprops.md#optional-config)
* [editMode](react.graphvizcomponentprops.md#optional-editmode)
* [forceConfig](react.graphvizcomponentprops.md#optional-forceconfig)
* [groups](react.graphvizcomponentprops.md#groups)
* [links](react.graphvizcomponentprops.md#links)
* [nodes](react.graphvizcomponentprops.md#nodes)
* [onClick](react.graphvizcomponentprops.md#onclick)
* [onLinkDrawn](react.graphvizcomponentprops.md#onlinkdrawn)
* [onRefresh](react.graphvizcomponentprops.md#optional-onrefresh)
* [onSecondaryClick](react.graphvizcomponentprops.md#onsecondaryclick)
* [showControls](react.graphvizcomponentprops.md#optional-showcontrols)
* [tooltips](react.graphvizcomponentprops.md#tooltips)

## Properties

### `Optional` config

• **config**? : *[ConfigurationOptions](core.configurationoptions.md)*

*Defined in [packages/react/src/GraphVizComponent.tsx:58](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/react/src/GraphVizComponent.tsx#L58)*

___

### `Optional` editMode

• **editMode**? : *undefined | false | true*

*Defined in [packages/react/src/GraphVizComponent.tsx:65](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/react/src/GraphVizComponent.tsx#L65)*

enables graph editing
i.e. for now only the drawing of links

___

### `Optional` forceConfig

• **forceConfig**? : *[ForceConfig](layouts.forceconfig.md)*

*Defined in [packages/react/src/GraphVizComponent.tsx:59](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/react/src/GraphVizComponent.tsx#L59)*

___

###  groups

• **groups**: *[GraphVizGroup](../modules/react.md#graphvizgroup)[]*

*Defined in [packages/react/src/GraphVizComponent.tsx:55](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/react/src/GraphVizComponent.tsx#L55)*

___

###  links

• **links**: *[GraphVizLink](../modules/react.md#graphvizlink)[]*

*Defined in [packages/react/src/GraphVizComponent.tsx:54](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/react/src/GraphVizComponent.tsx#L54)*

___

###  nodes

• **nodes**: *[GraphVizNode](../modules/react.md#graphviznode)[]*

*Defined in [packages/react/src/GraphVizComponent.tsx:53](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/react/src/GraphVizComponent.tsx#L53)*

___

###  onClick

• **onClick**: *function*

*Defined in [packages/react/src/GraphVizComponent.tsx:76](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/react/src/GraphVizComponent.tsx#L76)*

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

*Defined in [packages/react/src/GraphVizComponent.tsx:71](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/react/src/GraphVizComponent.tsx#L71)*

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

*Defined in [packages/react/src/GraphVizComponent.tsx:57](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/react/src/GraphVizComponent.tsx#L57)*

___

###  onSecondaryClick

• **onSecondaryClick**: *function*

*Defined in [packages/react/src/GraphVizComponent.tsx:81](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/react/src/GraphVizComponent.tsx#L81)*

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

*Defined in [packages/react/src/GraphVizComponent.tsx:60](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/react/src/GraphVizComponent.tsx#L60)*

___

###  tooltips

• **tooltips**: *Partial‹[TooltipNode](react.tooltipnode.md)›[]*

*Defined in [packages/react/src/GraphVizComponent.tsx:56](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/react/src/GraphVizComponent.tsx#L56)*
