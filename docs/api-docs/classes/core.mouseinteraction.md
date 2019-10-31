---
id: "core.mouseinteraction"
title: "MouseInteraction"
sidebar_label: "MouseInteraction"
---

[@graph-viz](../index.md) › [Globals](../globals.md) › [core](../modules/core.md) › [MouseInteraction](core.mouseinteraction.md)

## Hierarchy

* **MouseInteraction**

## Index

### Constructors

* [constructor](core.mouseinteraction.md#constructor)

### Properties

* [camera](core.mouseinteraction.md#private-camera)
* [canvas](core.mouseinteraction.md#private-canvas)
* [dragging](core.mouseinteraction.md#private-dragging)
* [intersectedPointIdx](core.mouseinteraction.md#private-intersectedpointidx)
* [mouse](core.mouseinteraction.md#private-mouse)
* [nodesData](core.mouseinteraction.md#private-nodesdata)
* [nodesMesh](core.mouseinteraction.md#private-nodesmesh)
* [panDelta](core.mouseinteraction.md#private-pandelta)
* [panEnd](core.mouseinteraction.md#private-panend)
* [panStart](core.mouseinteraction.md#private-panstart)
* [raycaster](core.mouseinteraction.md#private-raycaster)
* [registerClick](core.mouseinteraction.md#private-registerclick)

### Methods

* [findNearestNodeIndex](core.mouseinteraction.md#private-findnearestnodeindex)
* [getMouseInWorldSpace](core.mouseinteraction.md#private-getmouseinworldspace)
* [onClick](core.mouseinteraction.md#onclick)
* [onContextMenu](core.mouseinteraction.md#private-oncontextmenu)
* [onDragEnd](core.mouseinteraction.md#ondragend)
* [onDragStart](core.mouseinteraction.md#ondragstart)
* [onMouseDown](core.mouseinteraction.md#private-onmousedown)
* [onMouseMove](core.mouseinteraction.md#private-onmousemove)
* [onMouseUp](core.mouseinteraction.md#private-onmouseup)
* [onMouseWheel](core.mouseinteraction.md#private-onmousewheel)
* [onNodeDrag](core.mouseinteraction.md#onnodedrag)
* [onNodeHoverIn](core.mouseinteraction.md#onnodehoverin)
* [onNodeHoverOut](core.mouseinteraction.md#onnodehoverout)
* [onPan](core.mouseinteraction.md#onpan)
* [onSecondaryClick](core.mouseinteraction.md#onsecondaryclick)
* [onZoom](core.mouseinteraction.md#onzoom)
* [updateData](core.mouseinteraction.md#updatedata)

### Object literals

* [registeredEventHandlers](core.mouseinteraction.md#private-registeredeventhandlers)

## Constructors

###  constructor

\+ **new MouseInteraction**(`canvas`: HTMLCanvasElement, `camera`: OrthographicCamera, `nodesMesh`: [Nodes](core.nodes.md), `nodesData`: [DisplayNode](../interfaces/core.displaynode.md)[]): *[MouseInteraction](core.mouseinteraction.md)*

*Defined in [core/src/MouseInteraction.ts:96](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/MouseInteraction.ts#L96)*

**Parameters:**

Name | Type |
------ | ------ |
`canvas` | HTMLCanvasElement |
`camera` | OrthographicCamera |
`nodesMesh` | [Nodes](core.nodes.md) |
`nodesData` | [DisplayNode](../interfaces/core.displaynode.md)[] |

**Returns:** *[MouseInteraction](core.mouseinteraction.md)*

## Properties

### `Private` camera

• **camera**: *OrthographicCamera*

*Defined in [core/src/MouseInteraction.ts:91](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/MouseInteraction.ts#L91)*

___

### `Private` canvas

• **canvas**: *HTMLCanvasElement*

*Defined in [core/src/MouseInteraction.ts:90](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/MouseInteraction.ts#L90)*

___

### `Private` dragging

• **dragging**: *boolean*

*Defined in [core/src/MouseInteraction.ts:65](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/MouseInteraction.ts#L65)*

___

### `Private` intersectedPointIdx

• **intersectedPointIdx**: *number | null*

*Defined in [core/src/MouseInteraction.ts:64](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/MouseInteraction.ts#L64)*

___

### `Private` mouse

• **mouse**: *Vector2*

*Defined in [core/src/MouseInteraction.ts:95](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/MouseInteraction.ts#L95)*

___

### `Private` nodesData

• **nodesData**: *[DisplayNode](../interfaces/core.displaynode.md)[]*

*Defined in [core/src/MouseInteraction.ts:63](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/MouseInteraction.ts#L63)*

___

### `Private` nodesMesh

• **nodesMesh**: *[Nodes](core.nodes.md)*

*Defined in [core/src/MouseInteraction.ts:89](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/MouseInteraction.ts#L89)*

___

### `Private` panDelta

• **panDelta**: *Vector3*

*Defined in [core/src/MouseInteraction.ts:94](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/MouseInteraction.ts#L94)*

___

### `Private` panEnd

• **panEnd**: *Vector3*

*Defined in [core/src/MouseInteraction.ts:93](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/MouseInteraction.ts#L93)*

___

### `Private` panStart

• **panStart**: *Vector3*

*Defined in [core/src/MouseInteraction.ts:92](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/MouseInteraction.ts#L92)*

___

### `Private` raycaster

• **raycaster**: *Raycaster*

*Defined in [core/src/MouseInteraction.ts:96](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/MouseInteraction.ts#L96)*

___

### `Private` registerClick

• **registerClick**: *boolean*

*Defined in [core/src/MouseInteraction.ts:66](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/MouseInteraction.ts#L66)*

## Methods

### `Private` findNearestNodeIndex

▸ **findNearestNodeIndex**(`event`: MouseEvent): *number | null*

*Defined in [core/src/MouseInteraction.ts:168](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/MouseInteraction.ts#L168)*

**Parameters:**

Name | Type |
------ | ------ |
`event` | MouseEvent |

**Returns:** *number | null*

___

### `Private` getMouseInWorldSpace

▸ **getMouseInWorldSpace**(`z`: number): *Vector3*

*Defined in [core/src/MouseInteraction.ts:297](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/MouseInteraction.ts#L297)*

**Parameters:**

Name | Type |
------ | ------ |
`z` | number |

**Returns:** *Vector3*

___

###  onClick

▸ **onClick**(`callback`: [ClickEventHandler](../modules/core.md#clickeventhandler)): *void*

*Defined in [core/src/MouseInteraction.ts:140](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/MouseInteraction.ts#L140)*

**Parameters:**

Name | Type |
------ | ------ |
`callback` | [ClickEventHandler](../modules/core.md#clickeventhandler) |

**Returns:** *void*

___

### `Private` onContextMenu

▸ **onContextMenu**(`event`: MouseEvent): *void*

*Defined in [core/src/MouseInteraction.ts:303](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/MouseInteraction.ts#L303)*

**Parameters:**

Name | Type |
------ | ------ |
`event` | MouseEvent |

**Returns:** *void*

___

###  onDragEnd

▸ **onDragEnd**(`callback`: [DragEndEventHandler](../modules/core.md#dragendeventhandler)): *void*

*Defined in [core/src/MouseInteraction.ts:152](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/MouseInteraction.ts#L152)*

**Parameters:**

Name | Type |
------ | ------ |
`callback` | [DragEndEventHandler](../modules/core.md#dragendeventhandler) |

**Returns:** *void*

___

###  onDragStart

▸ **onDragStart**(`callback`: [DragStartEventHandler](../modules/core.md#dragstarteventhandler)): *void*

*Defined in [core/src/MouseInteraction.ts:144](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/MouseInteraction.ts#L144)*

**Parameters:**

Name | Type |
------ | ------ |
`callback` | [DragStartEventHandler](../modules/core.md#dragstarteventhandler) |

**Returns:** *void*

___

### `Private` onMouseDown

▸ **onMouseDown**(`event`: MouseEvent): *void*

*Defined in [core/src/MouseInteraction.ts:211](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/MouseInteraction.ts#L211)*

**Parameters:**

Name | Type |
------ | ------ |
`event` | MouseEvent |

**Returns:** *void*

___

### `Private` onMouseMove

▸ **onMouseMove**(`event`: MouseEvent): *void*

*Defined in [core/src/MouseInteraction.ts:251](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/MouseInteraction.ts#L251)*

**Parameters:**

Name | Type |
------ | ------ |
`event` | MouseEvent |

**Returns:** *void*

___

### `Private` onMouseUp

▸ **onMouseUp**(`event`: MouseEvent): *void*

*Defined in [core/src/MouseInteraction.ts:229](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/MouseInteraction.ts#L229)*

**Parameters:**

Name | Type |
------ | ------ |
`event` | MouseEvent |

**Returns:** *void*

___

### `Private` onMouseWheel

▸ **onMouseWheel**(`event`: WheelEvent): *void*

*Defined in [core/src/MouseInteraction.ts:291](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/MouseInteraction.ts#L291)*

**Parameters:**

Name | Type |
------ | ------ |
`event` | WheelEvent |

**Returns:** *void*

___

###  onNodeDrag

▸ **onNodeDrag**(`callback`: [NodeDragEventHandler](../modules/core.md#nodedrageventhandler)): *void*

*Defined in [core/src/MouseInteraction.ts:148](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/MouseInteraction.ts#L148)*

**Parameters:**

Name | Type |
------ | ------ |
`callback` | [NodeDragEventHandler](../modules/core.md#nodedrageventhandler) |

**Returns:** *void*

___

###  onNodeHoverIn

▸ **onNodeHoverIn**(`callback`: [HoverEventHandler](../modules/core.md#hovereventhandler)): *void*

*Defined in [core/src/MouseInteraction.ts:132](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/MouseInteraction.ts#L132)*

**Parameters:**

Name | Type |
------ | ------ |
`callback` | [HoverEventHandler](../modules/core.md#hovereventhandler) |

**Returns:** *void*

___

###  onNodeHoverOut

▸ **onNodeHoverOut**(`callback`: [HoverEventHandler](../modules/core.md#hovereventhandler)): *void*

*Defined in [core/src/MouseInteraction.ts:136](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/MouseInteraction.ts#L136)*

**Parameters:**

Name | Type |
------ | ------ |
`callback` | [HoverEventHandler](../modules/core.md#hovereventhandler) |

**Returns:** *void*

___

###  onPan

▸ **onPan**(`callback`: [PanEventHandler](../modules/core.md#paneventhandler)): *void*

*Defined in [core/src/MouseInteraction.ts:156](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/MouseInteraction.ts#L156)*

**Parameters:**

Name | Type |
------ | ------ |
`callback` | [PanEventHandler](../modules/core.md#paneventhandler) |

**Returns:** *void*

___

###  onSecondaryClick

▸ **onSecondaryClick**(`callback`: [SecondaryClickEventHandler](../modules/core.md#secondaryclickeventhandler)): *void*

*Defined in [core/src/MouseInteraction.ts:164](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/MouseInteraction.ts#L164)*

**Parameters:**

Name | Type |
------ | ------ |
`callback` | [SecondaryClickEventHandler](../modules/core.md#secondaryclickeventhandler) |

**Returns:** *void*

___

###  onZoom

▸ **onZoom**(`callback`: [ZoomEventHandler](../modules/core.md#zoomeventhandler)): *void*

*Defined in [core/src/MouseInteraction.ts:160](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/MouseInteraction.ts#L160)*

**Parameters:**

Name | Type |
------ | ------ |
`callback` | [ZoomEventHandler](../modules/core.md#zoomeventhandler) |

**Returns:** *void*

___

###  updateData

▸ **updateData**(`nodesData`: [DisplayNode](../interfaces/core.displaynode.md)[]): *void*

*Defined in [core/src/MouseInteraction.ts:128](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/MouseInteraction.ts#L128)*

**Parameters:**

Name | Type |
------ | ------ |
`nodesData` | [DisplayNode](../interfaces/core.displaynode.md)[] |

**Returns:** *void*

## Object literals

### `Private` registeredEventHandlers

### ▪ **registeredEventHandlers**: *object*

*Defined in [core/src/MouseInteraction.ts:67](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/MouseInteraction.ts#L67)*

###  click

• **click**: *noop* =  noop

*Defined in [core/src/MouseInteraction.ts:78](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/MouseInteraction.ts#L78)*

###  dragEnd

• **dragEnd**: *noop* =  noop

*Defined in [core/src/MouseInteraction.ts:82](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/MouseInteraction.ts#L82)*

###  dragStart

• **dragStart**: *noop* =  noop

*Defined in [core/src/MouseInteraction.ts:81](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/MouseInteraction.ts#L81)*

###  nodeDrag

• **nodeDrag**: *noop* =  noop

*Defined in [core/src/MouseInteraction.ts:83](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/MouseInteraction.ts#L83)*

###  nodeHoverIn

• **nodeHoverIn**: *noop* =  noop

*Defined in [core/src/MouseInteraction.ts:79](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/MouseInteraction.ts#L79)*

###  nodeHoverOut

• **nodeHoverOut**: *noop* =  noop

*Defined in [core/src/MouseInteraction.ts:80](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/MouseInteraction.ts#L80)*

###  pan

• **pan**: *noop* =  noop

*Defined in [core/src/MouseInteraction.ts:84](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/MouseInteraction.ts#L84)*

###  secondaryClick

• **secondaryClick**: *noop* =  noop

*Defined in [core/src/MouseInteraction.ts:86](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/MouseInteraction.ts#L86)*

###  zoom

• **zoom**: *noop* =  noop

*Defined in [core/src/MouseInteraction.ts:85](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/MouseInteraction.ts#L85)*
