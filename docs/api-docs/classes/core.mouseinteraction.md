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

* [camera](core.mouseinteraction.md#private-readonly-camera)
* [canvas](core.mouseinteraction.md#private-readonly-canvas)
* [dragging](core.mouseinteraction.md#private-dragging)
* [intersectedPointIdx](core.mouseinteraction.md#private-intersectedpointidx)
* [mouse](core.mouseinteraction.md#private-readonly-mouse)
* [nodesData](core.mouseinteraction.md#private-nodesdata)
* [nodesMesh](core.mouseinteraction.md#private-readonly-nodesmesh)
* [panDelta](core.mouseinteraction.md#private-readonly-pandelta)
* [panEnd](core.mouseinteraction.md#private-readonly-panend)
* [panStart](core.mouseinteraction.md#private-readonly-panstart)
* [raycaster](core.mouseinteraction.md#private-readonly-raycaster)
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

*Defined in [packages/core/src/MouseInteraction.ts:97](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/MouseInteraction.ts#L97)*

**Parameters:**

Name | Type |
------ | ------ |
`canvas` | HTMLCanvasElement |
`camera` | OrthographicCamera |
`nodesMesh` | [Nodes](core.nodes.md) |
`nodesData` | [DisplayNode](../interfaces/core.displaynode.md)[] |

**Returns:** *[MouseInteraction](core.mouseinteraction.md)*

## Properties

### `Private` `Readonly` camera

• **camera**: *OrthographicCamera*

*Defined in [packages/core/src/MouseInteraction.ts:92](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/MouseInteraction.ts#L92)*

___

### `Private` `Readonly` canvas

• **canvas**: *HTMLCanvasElement*

*Defined in [packages/core/src/MouseInteraction.ts:91](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/MouseInteraction.ts#L91)*

___

### `Private` dragging

• **dragging**: *boolean*

*Defined in [packages/core/src/MouseInteraction.ts:66](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/MouseInteraction.ts#L66)*

___

### `Private` intersectedPointIdx

• **intersectedPointIdx**: *number | null*

*Defined in [packages/core/src/MouseInteraction.ts:65](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/MouseInteraction.ts#L65)*

___

### `Private` `Readonly` mouse

• **mouse**: *Vector2*

*Defined in [packages/core/src/MouseInteraction.ts:96](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/MouseInteraction.ts#L96)*

___

### `Private` nodesData

• **nodesData**: *[DisplayNode](../interfaces/core.displaynode.md)[]*

*Defined in [packages/core/src/MouseInteraction.ts:64](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/MouseInteraction.ts#L64)*

___

### `Private` `Readonly` nodesMesh

• **nodesMesh**: *[Nodes](core.nodes.md)*

*Defined in [packages/core/src/MouseInteraction.ts:90](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/MouseInteraction.ts#L90)*

___

### `Private` `Readonly` panDelta

• **panDelta**: *Vector3*

*Defined in [packages/core/src/MouseInteraction.ts:95](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/MouseInteraction.ts#L95)*

___

### `Private` `Readonly` panEnd

• **panEnd**: *Vector3*

*Defined in [packages/core/src/MouseInteraction.ts:94](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/MouseInteraction.ts#L94)*

___

### `Private` `Readonly` panStart

• **panStart**: *Vector3*

*Defined in [packages/core/src/MouseInteraction.ts:93](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/MouseInteraction.ts#L93)*

___

### `Private` `Readonly` raycaster

• **raycaster**: *Raycaster*

*Defined in [packages/core/src/MouseInteraction.ts:97](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/MouseInteraction.ts#L97)*

___

### `Private` registerClick

• **registerClick**: *boolean*

*Defined in [packages/core/src/MouseInteraction.ts:67](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/MouseInteraction.ts#L67)*

## Methods

### `Private` findNearestNodeIndex

▸ **findNearestNodeIndex**(`event`: MouseEvent): *number | null*

*Defined in [packages/core/src/MouseInteraction.ts:169](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/MouseInteraction.ts#L169)*

**Parameters:**

Name | Type |
------ | ------ |
`event` | MouseEvent |

**Returns:** *number | null*

___

### `Private` getMouseInWorldSpace

▸ **getMouseInWorldSpace**(`z`: number): *Vector3‹›*

*Defined in [packages/core/src/MouseInteraction.ts:299](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/MouseInteraction.ts#L299)*

**Parameters:**

Name | Type |
------ | ------ |
`z` | number |

**Returns:** *Vector3‹›*

___

###  onClick

▸ **onClick**(`callback`: [ClickEventHandler](../modules/core.md#clickeventhandler)): *void*

*Defined in [packages/core/src/MouseInteraction.ts:141](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/MouseInteraction.ts#L141)*

**Parameters:**

Name | Type |
------ | ------ |
`callback` | [ClickEventHandler](../modules/core.md#clickeventhandler) |

**Returns:** *void*

___

### `Private` onContextMenu

▸ **onContextMenu**(`event`: MouseEvent): *void*

*Defined in [packages/core/src/MouseInteraction.ts:305](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/MouseInteraction.ts#L305)*

**Parameters:**

Name | Type |
------ | ------ |
`event` | MouseEvent |

**Returns:** *void*

___

###  onDragEnd

▸ **onDragEnd**(`callback`: [DragEndEventHandler](../modules/core.md#dragendeventhandler)): *void*

*Defined in [packages/core/src/MouseInteraction.ts:153](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/MouseInteraction.ts#L153)*

**Parameters:**

Name | Type |
------ | ------ |
`callback` | [DragEndEventHandler](../modules/core.md#dragendeventhandler) |

**Returns:** *void*

___

###  onDragStart

▸ **onDragStart**(`callback`: [DragStartEventHandler](../modules/core.md#dragstarteventhandler)): *void*

*Defined in [packages/core/src/MouseInteraction.ts:145](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/MouseInteraction.ts#L145)*

**Parameters:**

Name | Type |
------ | ------ |
`callback` | [DragStartEventHandler](../modules/core.md#dragstarteventhandler) |

**Returns:** *void*

___

### `Private` onMouseDown

▸ **onMouseDown**(`event`: MouseEvent): *void*

*Defined in [packages/core/src/MouseInteraction.ts:213](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/MouseInteraction.ts#L213)*

**Parameters:**

Name | Type |
------ | ------ |
`event` | MouseEvent |

**Returns:** *void*

___

### `Private` onMouseMove

▸ **onMouseMove**(`event`: MouseEvent): *void*

*Defined in [packages/core/src/MouseInteraction.ts:253](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/MouseInteraction.ts#L253)*

**Parameters:**

Name | Type |
------ | ------ |
`event` | MouseEvent |

**Returns:** *void*

___

### `Private` onMouseUp

▸ **onMouseUp**(`event`: MouseEvent): *void*

*Defined in [packages/core/src/MouseInteraction.ts:231](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/MouseInteraction.ts#L231)*

**Parameters:**

Name | Type |
------ | ------ |
`event` | MouseEvent |

**Returns:** *void*

___

### `Private` onMouseWheel

▸ **onMouseWheel**(`event`: WheelEvent): *void*

*Defined in [packages/core/src/MouseInteraction.ts:293](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/MouseInteraction.ts#L293)*

**Parameters:**

Name | Type |
------ | ------ |
`event` | WheelEvent |

**Returns:** *void*

___

###  onNodeDrag

▸ **onNodeDrag**(`callback`: [NodeDragEventHandler](../modules/core.md#nodedrageventhandler)): *void*

*Defined in [packages/core/src/MouseInteraction.ts:149](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/MouseInteraction.ts#L149)*

**Parameters:**

Name | Type |
------ | ------ |
`callback` | [NodeDragEventHandler](../modules/core.md#nodedrageventhandler) |

**Returns:** *void*

___

###  onNodeHoverIn

▸ **onNodeHoverIn**(`callback`: [HoverEventHandler](../modules/core.md#hovereventhandler)): *void*

*Defined in [packages/core/src/MouseInteraction.ts:133](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/MouseInteraction.ts#L133)*

**Parameters:**

Name | Type |
------ | ------ |
`callback` | [HoverEventHandler](../modules/core.md#hovereventhandler) |

**Returns:** *void*

___

###  onNodeHoverOut

▸ **onNodeHoverOut**(`callback`: [HoverEventHandler](../modules/core.md#hovereventhandler)): *void*

*Defined in [packages/core/src/MouseInteraction.ts:137](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/MouseInteraction.ts#L137)*

**Parameters:**

Name | Type |
------ | ------ |
`callback` | [HoverEventHandler](../modules/core.md#hovereventhandler) |

**Returns:** *void*

___

###  onPan

▸ **onPan**(`callback`: [PanEventHandler](../modules/core.md#paneventhandler)): *void*

*Defined in [packages/core/src/MouseInteraction.ts:157](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/MouseInteraction.ts#L157)*

**Parameters:**

Name | Type |
------ | ------ |
`callback` | [PanEventHandler](../modules/core.md#paneventhandler) |

**Returns:** *void*

___

###  onSecondaryClick

▸ **onSecondaryClick**(`callback`: [SecondaryClickEventHandler](../modules/core.md#secondaryclickeventhandler)): *void*

*Defined in [packages/core/src/MouseInteraction.ts:165](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/MouseInteraction.ts#L165)*

**Parameters:**

Name | Type |
------ | ------ |
`callback` | [SecondaryClickEventHandler](../modules/core.md#secondaryclickeventhandler) |

**Returns:** *void*

___

###  onZoom

▸ **onZoom**(`callback`: [ZoomEventHandler](../modules/core.md#zoomeventhandler)): *void*

*Defined in [packages/core/src/MouseInteraction.ts:161](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/MouseInteraction.ts#L161)*

**Parameters:**

Name | Type |
------ | ------ |
`callback` | [ZoomEventHandler](../modules/core.md#zoomeventhandler) |

**Returns:** *void*

___

###  updateData

▸ **updateData**(`nodesData`: [DisplayNode](../interfaces/core.displaynode.md)[]): *void*

*Defined in [packages/core/src/MouseInteraction.ts:129](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/MouseInteraction.ts#L129)*

**Parameters:**

Name | Type |
------ | ------ |
`nodesData` | [DisplayNode](../interfaces/core.displaynode.md)[] |

**Returns:** *void*

## Object literals

### `Private` registeredEventHandlers

### ▪ **registeredEventHandlers**: *object*

*Defined in [packages/core/src/MouseInteraction.ts:68](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/MouseInteraction.ts#L68)*

###  click

• **click**: *noop* = noop

*Defined in [packages/core/src/MouseInteraction.ts:79](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/MouseInteraction.ts#L79)*

###  dragEnd

• **dragEnd**: *noop* = noop

*Defined in [packages/core/src/MouseInteraction.ts:83](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/MouseInteraction.ts#L83)*

###  dragStart

• **dragStart**: *noop* = noop

*Defined in [packages/core/src/MouseInteraction.ts:82](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/MouseInteraction.ts#L82)*

###  nodeDrag

• **nodeDrag**: *noop* = noop

*Defined in [packages/core/src/MouseInteraction.ts:84](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/MouseInteraction.ts#L84)*

###  nodeHoverIn

• **nodeHoverIn**: *noop* = noop

*Defined in [packages/core/src/MouseInteraction.ts:80](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/MouseInteraction.ts#L80)*

###  nodeHoverOut

• **nodeHoverOut**: *noop* = noop

*Defined in [packages/core/src/MouseInteraction.ts:81](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/MouseInteraction.ts#L81)*

###  pan

• **pan**: *noop* = noop

*Defined in [packages/core/src/MouseInteraction.ts:85](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/MouseInteraction.ts#L85)*

###  secondaryClick

• **secondaryClick**: *noop* = noop

*Defined in [packages/core/src/MouseInteraction.ts:87](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/MouseInteraction.ts#L87)*

###  zoom

• **zoom**: *noop* = noop

*Defined in [packages/core/src/MouseInteraction.ts:86](https://github.com/uplevel-technology/graph-viz/blob/a1a88b4/packages/core/src/MouseInteraction.ts#L86)*
