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

* [camera](core.graphvisualization.md#camera)
* [canvas](core.graphvisualization.md#canvas)
* [data](core.graphvisualization.md#private-data)
* [groupsMesh](core.graphvisualization.md#groupsmesh)
* [height](core.graphvisualization.md#private-height)
* [linksMesh](core.graphvisualization.md#linksmesh)
* [mouseInteraction](core.graphvisualization.md#private-mouseinteraction)
* [nodeIdToIndexMap](core.graphvisualization.md#private-nodeidtoindexmap)
* [nodesMesh](core.graphvisualization.md#nodesmesh)
* [registeredEventHandlers](core.graphvisualization.md#private-registeredeventhandlers)
* [renderer](core.graphvisualization.md#private-renderer)
* [scene](core.graphvisualization.md#private-scene)
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
* [updateGroups](core.graphvisualization.md#updategroups)
* [updateNode](core.graphvisualization.md#updatenode)
* [updatePositions](core.graphvisualization.md#updatepositions)
* [zoom](core.graphvisualization.md#zoom)
* [zoomToFit](core.graphvisualization.md#private-zoomtofit)

## Constructors

###  constructor

\+ **new GraphVisualization**(`graphData`: [VisualizationInputData](../interfaces/core.visualizationinputdata.md), `canvas`: HTMLCanvasElement, `width`: number, `height`: number, `config`: [ConfigurationOptions](../interfaces/core.configurationoptions.md)): *[GraphVisualization](core.graphvisualization.md)*

*Defined in [core/src/GraphVisualization.ts:86](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/GraphVisualization.ts#L86)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`graphData` | [VisualizationInputData](../interfaces/core.visualizationinputdata.md) | - |
`canvas` | HTMLCanvasElement | - |
`width` | number | - |
`height` | number | - |
`config` | [ConfigurationOptions](../interfaces/core.configurationoptions.md) |  {} |

**Returns:** *[GraphVisualization](core.graphvisualization.md)*

## Properties

###  camera

• **camera**: *OrthographicCamera*

*Defined in [core/src/GraphVisualization.ts:63](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/GraphVisualization.ts#L63)*

___

###  canvas

• **canvas**: *HTMLCanvasElement*

*Defined in [core/src/GraphVisualization.ts:62](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/GraphVisualization.ts#L62)*

___

### `Private` data

• **data**: *[VisualizationInputData](../interfaces/core.visualizationinputdata.md)*

*Defined in [core/src/GraphVisualization.ts:65](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/GraphVisualization.ts#L65)*

___

###  groupsMesh

• **groupsMesh**: *[DisplayGroups](core.displaygroups.md)*

*Defined in [core/src/GraphVisualization.ts:60](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/GraphVisualization.ts#L60)*

___

### `Private` height

• **height**: *number*

*Defined in [core/src/GraphVisualization.ts:82](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/GraphVisualization.ts#L82)*

___

###  linksMesh

• **linksMesh**: *[Links](core.links.md)*

*Defined in [core/src/GraphVisualization.ts:59](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/GraphVisualization.ts#L59)*

___

### `Private` mouseInteraction

• **mouseInteraction**: *[MouseInteraction](core.mouseinteraction.md)*

*Defined in [core/src/GraphVisualization.ts:86](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/GraphVisualization.ts#L86)*

___

### `Private` nodeIdToIndexMap

• **nodeIdToIndexMap**: *object*

*Defined in [core/src/GraphVisualization.ts:66](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/GraphVisualization.ts#L66)*

#### Type declaration:

* \[ **key**: *string*\]: number

___

###  nodesMesh

• **nodesMesh**: *[Nodes](core.nodes.md)*

*Defined in [core/src/GraphVisualization.ts:58](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/GraphVisualization.ts#L58)*

___

### `Private` registeredEventHandlers

• **registeredEventHandlers**: *object*

*Defined in [core/src/GraphVisualization.ts:69](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/GraphVisualization.ts#L69)*

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

### `Private` renderer

• **renderer**: *WebGLRenderer*

*Defined in [core/src/GraphVisualization.ts:85](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/GraphVisualization.ts#L85)*

___

### `Private` scene

• **scene**: *Scene*

*Defined in [core/src/GraphVisualization.ts:84](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/GraphVisualization.ts#L84)*

___

### `Private` userHasAdjustedViewport

• **userHasAdjustedViewport**: *boolean*

*Defined in [core/src/GraphVisualization.ts:67](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/GraphVisualization.ts#L67)*

___

### `Private` width

• **width**: *number*

*Defined in [core/src/GraphVisualization.ts:81](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/GraphVisualization.ts#L81)*

## Methods

###  dispose

▸ **dispose**(): *void*

*Defined in [core/src/GraphVisualization.ts:371](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/GraphVisualization.ts#L371)*

disposes the graph viz context

**Returns:** *void*

___

### `Private` handleClick

▸ **handleClick**(`worldSpaceMouse`: Vector3, `clickedNodeIdx`: number | null, `event`: MouseEvent): *void*

*Defined in [core/src/GraphVisualization.ts:513](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/GraphVisualization.ts#L513)*

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

*Defined in [core/src/GraphVisualization.ts:465](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/GraphVisualization.ts#L465)*

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

*Defined in [core/src/GraphVisualization.ts:439](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/GraphVisualization.ts#L439)*

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

*Defined in [core/src/GraphVisualization.ts:423](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/GraphVisualization.ts#L423)*

**Parameters:**

Name | Type |
------ | ------ |
`hoveredToNodeIdx` | number |

**Returns:** *void*

___

### `Private` handleHoverOut

▸ **handleHoverOut**(`hoveredFromNodeIdx`: number): *void*

*Defined in [core/src/GraphVisualization.ts:431](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/GraphVisualization.ts#L431)*

**Parameters:**

Name | Type |
------ | ------ |
`hoveredFromNodeIdx` | number |

**Returns:** *void*

___

### `Private` handleNodeDrag

▸ **handleNodeDrag**(`worldSpaceMouse`: Vector3, `draggedNodeIdx`: number): *void*

*Defined in [core/src/GraphVisualization.ts:455](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/GraphVisualization.ts#L455)*

**Parameters:**

Name | Type |
------ | ------ |
`worldSpaceMouse` | Vector3 |
`draggedNodeIdx` | number |

**Returns:** *void*

___

### `Private` handlePan

▸ **handlePan**(`panDelta`: Vector3): *void*

*Defined in [core/src/GraphVisualization.ts:475](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/GraphVisualization.ts#L475)*

**Parameters:**

Name | Type |
------ | ------ |
`panDelta` | Vector3 |

**Returns:** *void*

___

### `Private` handleSecondaryClick

▸ **handleSecondaryClick**(`event`: MouseEvent, `clickedNodeIdx`: number | null): *void*

*Defined in [core/src/GraphVisualization.ts:526](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/GraphVisualization.ts#L526)*

**Parameters:**

Name | Type |
------ | ------ |
`event` | MouseEvent |
`clickedNodeIdx` | number &#124; null |

**Returns:** *void*

___

### `Private` handleZoomOnWheel

▸ **handleZoomOnWheel**(`event`: MouseWheelEvent): *void*

*Defined in [core/src/GraphVisualization.ts:497](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/GraphVisualization.ts#L497)*

**Parameters:**

Name | Type |
------ | ------ |
`event` | MouseWheelEvent |

**Returns:** *void*

___

###  onClick

▸ **onClick**(`callback`: [ClickEventHandler](../modules/core.md#clickeventhandler)): *void*

*Defined in [core/src/GraphVisualization.ts:195](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/GraphVisualization.ts#L195)*

**Parameters:**

Name | Type |
------ | ------ |
`callback` | [ClickEventHandler](../modules/core.md#clickeventhandler) |

**Returns:** *void*

___

###  onDragEnd

▸ **onDragEnd**(`callback`: [DragEndEventHandler](../modules/core.md#dragendeventhandler)): *void*

*Defined in [core/src/GraphVisualization.ts:205](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/GraphVisualization.ts#L205)*

**Parameters:**

Name | Type |
------ | ------ |
`callback` | [DragEndEventHandler](../modules/core.md#dragendeventhandler) |

**Returns:** *void*

___

###  onDragStart

▸ **onDragStart**(`callback`: [DragStartEventHandler](../modules/core.md#dragstarteventhandler)): *void*

*Defined in [core/src/GraphVisualization.ts:200](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/GraphVisualization.ts#L200)*

**Parameters:**

Name | Type |
------ | ------ |
`callback` | [DragStartEventHandler](../modules/core.md#dragstarteventhandler) |

**Returns:** *void*

___

###  onNodeDrag

▸ **onNodeDrag**(`callback`: [NodeDragEventHandler](../modules/core.md#nodedrageventhandler)): *void*

*Defined in [core/src/GraphVisualization.ts:210](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/GraphVisualization.ts#L210)*

**Parameters:**

Name | Type |
------ | ------ |
`callback` | [NodeDragEventHandler](../modules/core.md#nodedrageventhandler) |

**Returns:** *void*

___

###  onNodeHoverIn

▸ **onNodeHoverIn**(`callback`: [HoverEventHandler](../modules/core.md#hovereventhandler)): *void*

*Defined in [core/src/GraphVisualization.ts:185](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/GraphVisualization.ts#L185)*

**Parameters:**

Name | Type |
------ | ------ |
`callback` | [HoverEventHandler](../modules/core.md#hovereventhandler) |

**Returns:** *void*

___

###  onNodeHoverOut

▸ **onNodeHoverOut**(`callback`: [HoverEventHandler](../modules/core.md#hovereventhandler)): *void*

*Defined in [core/src/GraphVisualization.ts:190](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/GraphVisualization.ts#L190)*

**Parameters:**

Name | Type |
------ | ------ |
`callback` | [HoverEventHandler](../modules/core.md#hovereventhandler) |

**Returns:** *void*

___

###  onPan

▸ **onPan**(`callback`: [PanEventHandler](../modules/core.md#paneventhandler)): *void*

*Defined in [core/src/GraphVisualization.ts:220](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/GraphVisualization.ts#L220)*

**Parameters:**

Name | Type |
------ | ------ |
`callback` | [PanEventHandler](../modules/core.md#paneventhandler) |

**Returns:** *void*

___

###  onSecondaryClick

▸ **onSecondaryClick**(`callback`: [SecondaryClickEventHandler](../modules/core.md#secondaryclickeventhandler)): *void*

*Defined in [core/src/GraphVisualization.ts:215](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/GraphVisualization.ts#L215)*

**Parameters:**

Name | Type |
------ | ------ |
`callback` | [SecondaryClickEventHandler](../modules/core.md#secondaryclickeventhandler) |

**Returns:** *void*

___

###  onZoom

▸ **onZoom**(`callback`: [ZoomEventHandler](../modules/core.md#zoomeventhandler)): *void*

*Defined in [core/src/GraphVisualization.ts:225](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/GraphVisualization.ts#L225)*

**Parameters:**

Name | Type |
------ | ------ |
`callback` | [ZoomEventHandler](../modules/core.md#zoomeventhandler) |

**Returns:** *void*

___

###  render

▸ **render**(): *void*

*Defined in [core/src/GraphVisualization.ts:229](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/GraphVisualization.ts#L229)*

**Returns:** *void*

___

###  resize

▸ **resize**(`width`: number, `height`: number): *void*

*Defined in [core/src/GraphVisualization.ts:320](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/GraphVisualization.ts#L320)*

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

*Defined in [core/src/GraphVisualization.ts:341](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/GraphVisualization.ts#L341)*

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

*Defined in [core/src/GraphVisualization.ts:239](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/GraphVisualization.ts#L239)*

update or redraw all attributes of nodes and links
adds/removes new/deleted nodes

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`graphData` | [VisualizationInputData](../interfaces/core.visualizationinputdata.md) |   |

**Returns:** *void*

___

###  updateGroups

▸ **updateGroups**(`groups`: [DisplayGroup](../interfaces/core.displaygroup.md)[]): *void*

*Defined in [core/src/GraphVisualization.ts:308](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/GraphVisualization.ts#L308)*

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

*Defined in [core/src/GraphVisualization.ts:289](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/GraphVisualization.ts#L289)*

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

*Defined in [core/src/GraphVisualization.ts:258](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/GraphVisualization.ts#L258)*

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

*Defined in [core/src/GraphVisualization.ts:359](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/GraphVisualization.ts#L359)*

public method to zoom the graph

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`factor` | number | 0 |   |

**Returns:** *void*

___

### `Private` zoomToFit

▸ **zoomToFit**(`graphData`: [VisualizationInputData](../interfaces/core.visualizationinputdata.md)): *void*

*Defined in [core/src/GraphVisualization.ts:377](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/GraphVisualization.ts#L377)*

**Parameters:**

Name | Type |
------ | ------ |
`graphData` | [VisualizationInputData](../interfaces/core.visualizationinputdata.md) |

**Returns:** *void*
