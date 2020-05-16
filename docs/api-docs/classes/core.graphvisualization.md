---
id: "core.graphvisualization"
title: "GraphVisualization"
sidebar_label: "GraphVisualization"
---

[@graph-viz](../index.md) › [Globals](../globals.md) › [core](../modules/core.md) › [GraphVisualization](core.graphvisualization.md)

## Hierarchy

* **GraphVisualization**

## Index

### Constructors

* [constructor](core.graphvisualization.md#constructor)

### Properties

* [camera](core.graphvisualization.md#readonly-camera)
* [canvas](core.graphvisualization.md#readonly-canvas)
* [config](core.graphvisualization.md#private-config)
* [data](core.graphvisualization.md#private-data)
* [groupsMesh](core.graphvisualization.md#groupsmesh)
* [height](core.graphvisualization.md#private-height)
* [linksMesh](core.graphvisualization.md#linksmesh)
* [mouseInteraction](core.graphvisualization.md#private-readonly-mouseinteraction)
* [nodeIdToIndexMap](core.graphvisualization.md#private-nodeidtoindexmap)
* [nodesMesh](core.graphvisualization.md#nodesmesh)
* [registeredEventHandlers](core.graphvisualization.md#private-registeredeventhandlers)
* [renderer](core.graphvisualization.md#private-readonly-renderer)
* [scene](core.graphvisualization.md#private-readonly-scene)
* [userHasAdjustedViewport](core.graphvisualization.md#private-userhasadjustedviewport)
* [width](core.graphvisualization.md#private-width)

### Methods

* [dispose](core.graphvisualization.md#dispose)
* [handleClick](core.graphvisualization.md#private-handleclick)
* [handleDragEnd](core.graphvisualization.md#private-handledragend)
* [handleDragStart](core.graphvisualization.md#private-handledragstart)
* [handleHoverIn](core.graphvisualization.md#private-handlehoverin)
* [handleHoverOut](core.graphvisualization.md#private-handlehoverout)
* [handleNodeDrag](core.graphvisualization.md#private-handlenodedrag)
* [handlePan](core.graphvisualization.md#private-handlepan)
* [handleSecondaryClick](core.graphvisualization.md#private-handlesecondaryclick)
* [handleZoomOnWheel](core.graphvisualization.md#private-handlezoomonwheel)
* [onClick](core.graphvisualization.md#onclick)
* [onDragEnd](core.graphvisualization.md#ondragend)
* [onDragStart](core.graphvisualization.md#ondragstart)
* [onNodeDrag](core.graphvisualization.md#onnodedrag)
* [onNodeHoverIn](core.graphvisualization.md#onnodehoverin)
* [onNodeHoverOut](core.graphvisualization.md#onnodehoverout)
* [onPan](core.graphvisualization.md#onpan)
* [onSecondaryClick](core.graphvisualization.md#onsecondaryclick)
* [onZoom](core.graphvisualization.md#onzoom)
* [render](core.graphvisualization.md#render)
* [resize](core.graphvisualization.md#resize)
* [toScreenSpacePoint](core.graphvisualization.md#toscreenspacepoint)
* [update](core.graphvisualization.md#update)
* [updateConfig](core.graphvisualization.md#updateconfig)
* [updateGroups](core.graphvisualization.md#updategroups)
* [updateNode](core.graphvisualization.md#updatenode)
* [updatePositions](core.graphvisualization.md#updatepositions)
* [zoom](core.graphvisualization.md#zoom)
* [zoomToFit](core.graphvisualization.md#private-zoomtofit)

## Constructors

###  constructor

\+ **new GraphVisualization**(`graphData`: [VisualizationInputData](../interfaces/core.visualizationinputdata.md), `canvas`: HTMLCanvasElement, `width`: number, `height`: number, `config`: [ConfigurationOptions](../interfaces/core.configurationoptions.md)): *[GraphVisualization](core.graphvisualization.md)*

*Defined in [packages/core/src/GraphVisualization.ts:108](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/GraphVisualization.ts#L108)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`graphData` | [VisualizationInputData](../interfaces/core.visualizationinputdata.md) | - |
`canvas` | HTMLCanvasElement | - |
`width` | number | - |
`height` | number | - |
`config` | [ConfigurationOptions](../interfaces/core.configurationoptions.md) | DEFAULT_CONFIG_OPTIONS |

**Returns:** *[GraphVisualization](core.graphvisualization.md)*

## Properties

### `Readonly` camera

• **camera**: *OrthographicCamera*

*Defined in [packages/core/src/GraphVisualization.ts:84](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/GraphVisualization.ts#L84)*

___

### `Readonly` canvas

• **canvas**: *HTMLCanvasElement*

*Defined in [packages/core/src/GraphVisualization.ts:83](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/GraphVisualization.ts#L83)*

___

### `Private` config

• **config**: *[ConfigurationOptions](../interfaces/core.configurationoptions.md)* = DEFAULT_CONFIG_OPTIONS

*Defined in [packages/core/src/GraphVisualization.ts:108](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/GraphVisualization.ts#L108)*

___

### `Private` data

• **data**: *[VisualizationInputData](../interfaces/core.visualizationinputdata.md)*

*Defined in [packages/core/src/GraphVisualization.ts:86](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/GraphVisualization.ts#L86)*

___

###  groupsMesh

• **groupsMesh**: *[DisplayGroups](core.displaygroups.md)*

*Defined in [packages/core/src/GraphVisualization.ts:81](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/GraphVisualization.ts#L81)*

___

### `Private` height

• **height**: *number*

*Defined in [packages/core/src/GraphVisualization.ts:103](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/GraphVisualization.ts#L103)*

___

###  linksMesh

• **linksMesh**: *[Links](core.links.md)*

*Defined in [packages/core/src/GraphVisualization.ts:80](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/GraphVisualization.ts#L80)*

___

### `Private` `Readonly` mouseInteraction

• **mouseInteraction**: *[MouseInteraction](core.mouseinteraction.md)*

*Defined in [packages/core/src/GraphVisualization.ts:107](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/GraphVisualization.ts#L107)*

___

### `Private` nodeIdToIndexMap

• **nodeIdToIndexMap**: *object*

*Defined in [packages/core/src/GraphVisualization.ts:87](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/GraphVisualization.ts#L87)*

#### Type declaration:

* \[ **key**: *string*\]: number

___

###  nodesMesh

• **nodesMesh**: *[Nodes](core.nodes.md)*

*Defined in [packages/core/src/GraphVisualization.ts:79](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/GraphVisualization.ts#L79)*

___

### `Private` registeredEventHandlers

• **registeredEventHandlers**: *object*

*Defined in [packages/core/src/GraphVisualization.ts:90](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/GraphVisualization.ts#L90)*

#### Type declaration:

* **click**? : *[ClickEventHandler](../modules/core.md#clickeventhandler)*

* **dragEnd**? : *[DragEndEventHandler](../modules/core.md#dragendeventhandler)*

* **dragStart**? : *[DragStartEventHandler](../modules/core.md#dragstarteventhandler)*

* **nodeDrag**? : *[NodeDragEventHandler](../modules/core.md#nodedrageventhandler)*

* **nodeHoverIn**? : *[HoverEventHandler](../modules/core.md#hovereventhandler)*

* **nodeHoverOut**? : *[HoverEventHandler](../modules/core.md#hovereventhandler)*

* **pan**? : *[PanEventHandler](../modules/core.md#paneventhandler)*

* **secondaryClick**? : *[SecondaryClickEventHandler](../modules/core.md#secondaryclickeventhandler)*

* **zoom**? : *[ZoomEventHandler](../modules/core.md#zoomeventhandler)*

___

### `Private` `Readonly` renderer

• **renderer**: *WebGLRenderer*

*Defined in [packages/core/src/GraphVisualization.ts:106](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/GraphVisualization.ts#L106)*

___

### `Private` `Readonly` scene

• **scene**: *Scene*

*Defined in [packages/core/src/GraphVisualization.ts:105](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/GraphVisualization.ts#L105)*

___

### `Private` userHasAdjustedViewport

• **userHasAdjustedViewport**: *boolean*

*Defined in [packages/core/src/GraphVisualization.ts:88](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/GraphVisualization.ts#L88)*

___

### `Private` width

• **width**: *number*

*Defined in [packages/core/src/GraphVisualization.ts:102](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/GraphVisualization.ts#L102)*

## Methods

###  dispose

▸ **dispose**(): *void*

*Defined in [packages/core/src/GraphVisualization.ts:439](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/GraphVisualization.ts#L439)*

disposes the graph viz context

**Returns:** *void*

___

### `Private` handleClick

▸ **handleClick**(`worldSpaceMouse`: Vector3, `clickedNodeIdx`: number | null, `event`: MouseEvent): *void*

*Defined in [packages/core/src/GraphVisualization.ts:583](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/GraphVisualization.ts#L583)*

**Parameters:**

Name | Type |
------ | ------ |
`worldSpaceMouse` | Vector3 |
`clickedNodeIdx` | number &#124; null |
`event` | MouseEvent |

**Returns:** *void*

___

### `Private` handleDragEnd

▸ **handleDragEnd**(`worldSpaceMouse`: Vector3, `nodeIdx`: number, `event`: MouseEvent): *void*

*Defined in [packages/core/src/GraphVisualization.ts:535](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/GraphVisualization.ts#L535)*

**Parameters:**

Name | Type |
------ | ------ |
`worldSpaceMouse` | Vector3 |
`nodeIdx` | number |
`event` | MouseEvent |

**Returns:** *void*

___

### `Private` handleDragStart

▸ **handleDragStart**(`worldSpaceMouse`: Vector3, `draggedNodeIdx`: number | null, `event`: MouseEvent): *void*

*Defined in [packages/core/src/GraphVisualization.ts:509](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/GraphVisualization.ts#L509)*

**Parameters:**

Name | Type |
------ | ------ |
`worldSpaceMouse` | Vector3 |
`draggedNodeIdx` | number &#124; null |
`event` | MouseEvent |

**Returns:** *void*

___

### `Private` handleHoverIn

▸ **handleHoverIn**(`hoveredToNodeIdx`: number): *void*

*Defined in [packages/core/src/GraphVisualization.ts:493](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/GraphVisualization.ts#L493)*

**Parameters:**

Name | Type |
------ | ------ |
`hoveredToNodeIdx` | number |

**Returns:** *void*

___

### `Private` handleHoverOut

▸ **handleHoverOut**(`hoveredFromNodeIdx`: number): *void*

*Defined in [packages/core/src/GraphVisualization.ts:501](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/GraphVisualization.ts#L501)*

**Parameters:**

Name | Type |
------ | ------ |
`hoveredFromNodeIdx` | number |

**Returns:** *void*

___

### `Private` handleNodeDrag

▸ **handleNodeDrag**(`worldSpaceMouse`: Vector3, `draggedNodeIdx`: number): *void*

*Defined in [packages/core/src/GraphVisualization.ts:525](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/GraphVisualization.ts#L525)*

**Parameters:**

Name | Type |
------ | ------ |
`worldSpaceMouse` | Vector3 |
`draggedNodeIdx` | number |

**Returns:** *void*

___

### `Private` handlePan

▸ **handlePan**(`panDelta`: Vector3): *void*

*Defined in [packages/core/src/GraphVisualization.ts:545](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/GraphVisualization.ts#L545)*

**Parameters:**

Name | Type |
------ | ------ |
`panDelta` | Vector3 |

**Returns:** *void*

___

### `Private` handleSecondaryClick

▸ **handleSecondaryClick**(`event`: MouseEvent, `clickedNodeIdx`: number | null): *void*

*Defined in [packages/core/src/GraphVisualization.ts:596](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/GraphVisualization.ts#L596)*

**Parameters:**

Name | Type |
------ | ------ |
`event` | MouseEvent |
`clickedNodeIdx` | number &#124; null |

**Returns:** *void*

___

### `Private` handleZoomOnWheel

▸ **handleZoomOnWheel**(`event`: MouseWheelEvent): *void*

*Defined in [packages/core/src/GraphVisualization.ts:567](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/GraphVisualization.ts#L567)*

**Parameters:**

Name | Type |
------ | ------ |
`event` | MouseWheelEvent |

**Returns:** *void*

___

###  onClick

▸ **onClick**(`callback`: [ClickEventHandler](../modules/core.md#clickeventhandler)): *void*

*Defined in [packages/core/src/GraphVisualization.ts:266](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/GraphVisualization.ts#L266)*

**Parameters:**

Name | Type |
------ | ------ |
`callback` | [ClickEventHandler](../modules/core.md#clickeventhandler) |

**Returns:** *void*

___

###  onDragEnd

▸ **onDragEnd**(`callback`: [DragEndEventHandler](../modules/core.md#dragendeventhandler)): *void*

*Defined in [packages/core/src/GraphVisualization.ts:276](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/GraphVisualization.ts#L276)*

**Parameters:**

Name | Type |
------ | ------ |
`callback` | [DragEndEventHandler](../modules/core.md#dragendeventhandler) |

**Returns:** *void*

___

###  onDragStart

▸ **onDragStart**(`callback`: [DragStartEventHandler](../modules/core.md#dragstarteventhandler)): *void*

*Defined in [packages/core/src/GraphVisualization.ts:271](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/GraphVisualization.ts#L271)*

**Parameters:**

Name | Type |
------ | ------ |
`callback` | [DragStartEventHandler](../modules/core.md#dragstarteventhandler) |

**Returns:** *void*

___

###  onNodeDrag

▸ **onNodeDrag**(`callback`: [NodeDragEventHandler](../modules/core.md#nodedrageventhandler)): *void*

*Defined in [packages/core/src/GraphVisualization.ts:281](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/GraphVisualization.ts#L281)*

**Parameters:**

Name | Type |
------ | ------ |
`callback` | [NodeDragEventHandler](../modules/core.md#nodedrageventhandler) |

**Returns:** *void*

___

###  onNodeHoverIn

▸ **onNodeHoverIn**(`callback`: [HoverEventHandler](../modules/core.md#hovereventhandler)): *void*

*Defined in [packages/core/src/GraphVisualization.ts:256](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/GraphVisualization.ts#L256)*

**Parameters:**

Name | Type |
------ | ------ |
`callback` | [HoverEventHandler](../modules/core.md#hovereventhandler) |

**Returns:** *void*

___

###  onNodeHoverOut

▸ **onNodeHoverOut**(`callback`: [HoverEventHandler](../modules/core.md#hovereventhandler)): *void*

*Defined in [packages/core/src/GraphVisualization.ts:261](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/GraphVisualization.ts#L261)*

**Parameters:**

Name | Type |
------ | ------ |
`callback` | [HoverEventHandler](../modules/core.md#hovereventhandler) |

**Returns:** *void*

___

###  onPan

▸ **onPan**(`callback`: [PanEventHandler](../modules/core.md#paneventhandler)): *void*

*Defined in [packages/core/src/GraphVisualization.ts:291](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/GraphVisualization.ts#L291)*

**Parameters:**

Name | Type |
------ | ------ |
`callback` | [PanEventHandler](../modules/core.md#paneventhandler) |

**Returns:** *void*

___

###  onSecondaryClick

▸ **onSecondaryClick**(`callback`: [SecondaryClickEventHandler](../modules/core.md#secondaryclickeventhandler)): *void*

*Defined in [packages/core/src/GraphVisualization.ts:286](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/GraphVisualization.ts#L286)*

**Parameters:**

Name | Type |
------ | ------ |
`callback` | [SecondaryClickEventHandler](../modules/core.md#secondaryclickeventhandler) |

**Returns:** *void*

___

###  onZoom

▸ **onZoom**(`callback`: [ZoomEventHandler](../modules/core.md#zoomeventhandler)): *void*

*Defined in [packages/core/src/GraphVisualization.ts:296](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/GraphVisualization.ts#L296)*

**Parameters:**

Name | Type |
------ | ------ |
`callback` | [ZoomEventHandler](../modules/core.md#zoomeventhandler) |

**Returns:** *void*

___

###  render

▸ **render**(): *void*

*Defined in [packages/core/src/GraphVisualization.ts:300](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/GraphVisualization.ts#L300)*

**Returns:** *void*

___

###  resize

▸ **resize**(`width`: number, `height`: number): *void*

*Defined in [packages/core/src/GraphVisualization.ts:391](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/GraphVisualization.ts#L391)*

resize the canvas

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`width` | number | - |
`height` | number |   |

**Returns:** *void*

___

###  toScreenSpacePoint

▸ **toScreenSpacePoint**(`worldX`: number, `worldY`: number): *Vector3*

*Defined in [packages/core/src/GraphVisualization.ts:412](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/GraphVisualization.ts#L412)*

converts a world space coordinate to screen space

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`worldX` | number | 0 | - |
`worldY` | number | 0 |   |

**Returns:** *Vector3*

___

###  update

▸ **update**(`graphData`: [VisualizationInputData](../interfaces/core.visualizationinputdata.md)): *void*

*Defined in [packages/core/src/GraphVisualization.ts:310](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/GraphVisualization.ts#L310)*

update or redraw all attributes of nodes and links
adds/removes new/deleted nodes

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`graphData` | [VisualizationInputData](../interfaces/core.visualizationinputdata.md) |   |

**Returns:** *void*

___

###  updateConfig

▸ **updateConfig**(`newConfig`: [ConfigurationOptions](../interfaces/core.configurationoptions.md) | undefined): *void*

*Defined in [packages/core/src/GraphVisualization.ts:179](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/GraphVisualization.ts#L179)*

update config and re-render

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`newConfig` | [ConfigurationOptions](../interfaces/core.configurationoptions.md) &#124; undefined |   |

**Returns:** *void*

___

###  updateGroups

▸ **updateGroups**(`groups`: [DisplayGroup](../interfaces/core.displaygroup.md)[]): *void*

*Defined in [packages/core/src/GraphVisualization.ts:379](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/GraphVisualization.ts#L379)*

updates only the groups mesh.
Useful in situations that require ONLY display groups to update.
E.g. toggling a group on or off when the nodes within a group
have NOT changed.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`groups` | [DisplayGroup](../interfaces/core.displaygroup.md)[] |   |

**Returns:** *void*

___

###  updateNode

▸ **updateNode**(`index`: number, `updatedNode`: [DisplayNode](../interfaces/core.displaynode.md)): *void*

*Defined in [packages/core/src/GraphVisualization.ts:360](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/GraphVisualization.ts#L360)*

update all the attributes of a single node at a given index

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`index` | number | - |
`updatedNode` | [DisplayNode](../interfaces/core.displaynode.md) |   |

**Returns:** *void*

___

###  updatePositions

▸ **updatePositions**(`updatedGraphData`: [VisualizationInputData](../interfaces/core.visualizationinputdata.md)): *void*

*Defined in [packages/core/src/GraphVisualization.ts:329](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/GraphVisualization.ts#L329)*

update only the position attributes of existing nodes and links.

This function assumes that the nodeIdToIndexMap is up to date and
that the updatedGraphData hasn't changed in size or order
and only the position attributes have changed within each node datum.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`updatedGraphData` | [VisualizationInputData](../interfaces/core.visualizationinputdata.md) |   |

**Returns:** *void*

___

###  zoom

▸ **zoom**(`factor`: number): *void*

*Defined in [packages/core/src/GraphVisualization.ts:427](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/GraphVisualization.ts#L427)*

public method to zoom the graph

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`factor` | number | 0 |   |

**Returns:** *void*

___

### `Private` zoomToFit

▸ **zoomToFit**(`graphData`: [VisualizationInputData](../interfaces/core.visualizationinputdata.md)): *void*

*Defined in [packages/core/src/GraphVisualization.ts:445](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/GraphVisualization.ts#L445)*

**Parameters:**

Name | Type |
------ | ------ |
`graphData` | [VisualizationInputData](../interfaces/core.visualizationinputdata.md) |

**Returns:** *void*
