---
id: "core"
title: "core"
sidebar_label: "core"
---

[@graph-viz](../index.md) › [Globals](../globals.md) › [core](core.md)

## Index

### Classes

* [DisplayGroups](../classes/core.displaygroups.md)
* [GraphVisualization](../classes/core.graphvisualization.md)
* [Labels](../classes/core.labels.md)
* [Links](../classes/core.links.md)
* [MouseInteraction](../classes/core.mouseinteraction.md)
* [Nodes](../classes/core.nodes.md)

### Interfaces

* [ConfigurationOptions](../interfaces/core.configurationoptions.md)
* [DisplayGroup](../interfaces/core.displaygroup.md)
* [DisplayLink](../interfaces/core.displaylink.md)
* [DisplayNode](../interfaces/core.displaynode.md)
* [LinkStyleAttributes](../interfaces/core.linkstyleattributes.md)
* [Point](../interfaces/core.point.md)
* [PopulatedDisplayLink](../interfaces/core.populateddisplaylink.md)
* [TextTexture](../interfaces/core.texttexture.md)
* [Uniforms](../interfaces/core.uniforms.md)
* [VisualizationInputData](../interfaces/core.visualizationinputdata.md)

### Type aliases

* [ClickEventHandler](core.md#clickeventhandler)
* [DragEndEventHandler](core.md#dragendeventhandler)
* [DragStartEventHandler](core.md#dragstarteventhandler)
* [GenericMouseEventHandler](core.md#genericmouseeventhandler)
* [HoverEventHandler](core.md#hovereventhandler)
* [NodeDragEventHandler](core.md#nodedrageventhandler)
* [PanEventHandler](core.md#paneventhandler)
* [SecondaryClickEventHandler](core.md#secondaryclickeventhandler)
* [ZoomEventHandler](core.md#zoomeventhandler)

### Variables

* [DEFAULT_ARROW_WIDTH](core.md#const-default_arrow_width)
* [DEFAULT_DISPLAY_GROUP_FILL](core.md#const-default_display_group_fill)
* [DEFAULT_DISPLAY_GROUP_FILL_OPACITY](core.md#const-default_display_group_fill_opacity)
* [DEFAULT_LINK_COLOR](core.md#const-default_link_color)
* [DEFAULT_LINK_WIDTH](core.md#const-default_link_width)
* [DEFAULT_NODE_CONTAINER_ABSOLUTE_SIZE](core.md#const-default_node_container_absolute_size)
* [DEFAULT_NODE_FILL](core.md#const-default_node_fill)
* [DEFAULT_NODE_FILL_OPACITY](core.md#const-default_node_fill_opacity)
* [DEFAULT_NODE_INNER_RADIUS](core.md#const-default_node_inner_radius)
* [DEFAULT_NODE_SCALE](core.md#const-default_node_scale)
* [DEFAULT_NODE_STROKE_OPACITY](core.md#const-default_node_stroke_opacity)
* [DEFAULT_NODE_STROKE_WIDTH](core.md#const-default_node_stroke_width)
* [HIGHLIGHTED_LINK_COLOR](core.md#const-highlighted_link_color)
* [HOVERED_NODE_SCALE](core.md#const-hovered_node_scale)
* [LARGE_ARROW_WIDTH](core.md#const-large_arrow_width)
* [LOCKED_NODE_STROKE_OPACITY](core.md#const-locked_node_stroke_opacity)
* [LOCKED_NODE_STROKE_WIDTH](core.md#const-locked_node_stroke_width)
* [MAX_CLICK_DURATION](core.md#const-max_click_duration)
* [MAX_ZOOM](core.md#const-max_zoom)
* [PAN_SPEED](core.md#const-pan_speed)
* [VERTICES_PER_QUAD](core.md#const-vertices_per_quad)
* [linksFragmentShader](core.md#const-linksfragmentshader)
* [linksVertexShader](core.md#const-linksvertexshader)
* [nodesFragmentShader](core.md#const-nodesfragmentshader)
* [nodesVertexShader](core.md#const-nodesvertexshader)
* [requiredMetadataKey](core.md#const-requiredmetadatakey)

### Functions

* [buildMaterial](core.md#buildmaterial)
* [buildTexture](core.md#buildtexture)
* [byPosition](core.md#byposition)
* [calculateAbsoluteArrowOffset](core.md#const-calculateabsolutearrowoffset)
* [constructIdToIdxMap](core.md#constructidtoidxmap)
* [cross](core.md#cross)
* [findNormalViaIntersection](core.md#findnormalviaintersection)
* [get2DConvexHull](core.md#get2dconvexhull)
* [getCapsulePolygon](core.md#getcapsulepolygon)
* [getCentroid](core.md#getcentroid)
* [getCircularHull](core.md#getcircularhull)
* [getDistance](core.md#getdistance)
* [getRoundedOffsetPolygon](core.md#getroundedoffsetpolygon)
* [populateLinks](core.md#populatelinks)
* [required](core.md#required)
* [setMeshTexture](core.md#setmeshtexture)
* [validate](core.md#validate)
* [validateClassConstructor](core.md#validateclassconstructor)

### Object literals

* [DATA](core.md#const-data)
* [DEFAULT_CONFIG_OPTIONS](core.md#const-default_config_options)

## Type aliases

###  ClickEventHandler

Ƭ **ClickEventHandler**: *[GenericMouseEventHandler](core.md#genericmouseeventhandler)*

*Defined in [core/src/MouseInteraction.ts:21](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/MouseInteraction.ts#L21)*

dispatched when the canvas is clicked. if a node click is detected the clickedNodeIdx will be non-null

___

###  DragEndEventHandler

Ƭ **DragEndEventHandler**: *[GenericMouseEventHandler](core.md#genericmouseeventhandler)*

*Defined in [core/src/MouseInteraction.ts:31](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/MouseInteraction.ts#L31)*

dispatched when a mouse drag end is detected anywhere on the canvas

___

###  DragStartEventHandler

Ƭ **DragStartEventHandler**: *[GenericMouseEventHandler](core.md#genericmouseeventhandler)*

*Defined in [core/src/MouseInteraction.ts:26](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/MouseInteraction.ts#L26)*

dispatched when a mouse drag start is detected anywhere on the canvas

___

###  GenericMouseEventHandler

Ƭ **GenericMouseEventHandler**: *function*

*Defined in [core/src/MouseInteraction.ts:7](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/MouseInteraction.ts#L7)*

#### Type declaration:

▸ (`worldSpacePosition`: Vector3, `nodeIdx`: number | null, `event`: MouseEvent): *any*

**Parameters:**

Name | Type |
------ | ------ |
`worldSpacePosition` | Vector3 |
`nodeIdx` | number &#124; null |
`event` | MouseEvent |

___

###  HoverEventHandler

Ƭ **HoverEventHandler**: *function*

*Defined in [core/src/MouseInteraction.ts:16](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/MouseInteraction.ts#L16)*

dispatched when a node is hovered in or out

#### Type declaration:

▸ (`hoveredIdx`: number): *any*

**Parameters:**

Name | Type |
------ | ------ |
`hoveredIdx` | number |

___

###  NodeDragEventHandler

Ƭ **NodeDragEventHandler**: *function*

*Defined in [core/src/MouseInteraction.ts:37](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/MouseInteraction.ts#L37)*

dispatched when a mouse dragging event is detected after dragStart was dispatched with a non-null node
i.e. node was dragged

#### Type declaration:

▸ (`worldSpaceMousePosition`: Vector3, `draggedNodeIdx`: number): *any*

**Parameters:**

Name | Type |
------ | ------ |
`worldSpaceMousePosition` | Vector3 |
`draggedNodeIdx` | number |

___

###  PanEventHandler

Ƭ **PanEventHandler**: *function*

*Defined in [core/src/MouseInteraction.ts:46](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/MouseInteraction.ts#L46)*

dispatched when a mouse dragging event is detected after dragStart was dispatched with a null node
i.e. canvas was panned

#### Type declaration:

▸ (`panDelta`: Vector3): *any*

**Parameters:**

Name | Type |
------ | ------ |
`panDelta` | Vector3 |

___

###  SecondaryClickEventHandler

Ƭ **SecondaryClickEventHandler**: *function*

*Defined in [core/src/MouseInteraction.ts:57](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/MouseInteraction.ts#L57)*

dispatched on event: 'contextmenu'
(usually right click or Ctrl+click in most browsers)

#### Type declaration:

▸ (`event`: MouseEvent, `nodeIdx`: number | null): *any*

**Parameters:**

Name | Type |
------ | ------ |
`event` | MouseEvent |
`nodeIdx` | number &#124; null |

___

###  ZoomEventHandler

Ƭ **ZoomEventHandler**: *function*

*Defined in [core/src/MouseInteraction.ts:51](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/MouseInteraction.ts#L51)*

dispatched on mouse wheel change

#### Type declaration:

▸ (`event`: WheelEvent): *any*

**Parameters:**

Name | Type |
------ | ------ |
`event` | WheelEvent |

## Variables

### `Const` DEFAULT_ARROW_WIDTH

• **DEFAULT_ARROW_WIDTH**: *10* = 10

*Defined in [core/src/Links.ts:24](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/Links.ts#L24)*

___

### `Const` DEFAULT_DISPLAY_GROUP_FILL

• **DEFAULT_DISPLAY_GROUP_FILL**: *0* = 0

*Defined in [core/src/DisplayGroups.ts:43](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/DisplayGroups.ts#L43)*

___

### `Const` DEFAULT_DISPLAY_GROUP_FILL_OPACITY

• **DEFAULT_DISPLAY_GROUP_FILL_OPACITY**: *0.09* = 0.09

*Defined in [core/src/DisplayGroups.ts:44](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/DisplayGroups.ts#L44)*

___

### `Const` DEFAULT_LINK_COLOR

• **DEFAULT_LINK_COLOR**: *13421772* = 13421772

*Defined in [core/src/Links.ts:21](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/Links.ts#L21)*

Constants

___

### `Const` DEFAULT_LINK_WIDTH

• **DEFAULT_LINK_WIDTH**: *1* = 1

*Defined in [core/src/Links.ts:22](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/Links.ts#L22)*

___

### `Const` DEFAULT_NODE_CONTAINER_ABSOLUTE_SIZE

• **DEFAULT_NODE_CONTAINER_ABSOLUTE_SIZE**: *20* = 20

*Defined in [core/src/Nodes.ts:89](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/Nodes.ts#L89)*

Constants

___

### `Const` DEFAULT_NODE_FILL

• **DEFAULT_NODE_FILL**: *3355443* = 3355443

*Defined in [core/src/Nodes.ts:91](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/Nodes.ts#L91)*

___

### `Const` DEFAULT_NODE_FILL_OPACITY

• **DEFAULT_NODE_FILL_OPACITY**: *1* = 1

*Defined in [core/src/Nodes.ts:92](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/Nodes.ts#L92)*

___

### `Const` DEFAULT_NODE_INNER_RADIUS

• **DEFAULT_NODE_INNER_RADIUS**: *0.2* = 0.2

*Defined in [core/src/Nodes.ts:90](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/Nodes.ts#L90)*

___

### `Const` DEFAULT_NODE_SCALE

• **DEFAULT_NODE_SCALE**: *1* = 1

*Defined in [core/src/Nodes.ts:93](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/Nodes.ts#L93)*

___

### `Const` DEFAULT_NODE_STROKE_OPACITY

• **DEFAULT_NODE_STROKE_OPACITY**: *1* = 1

*Defined in [core/src/Nodes.ts:95](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/Nodes.ts#L95)*

___

### `Const` DEFAULT_NODE_STROKE_WIDTH

• **DEFAULT_NODE_STROKE_WIDTH**: *0.03* = 0.03

*Defined in [core/src/Nodes.ts:94](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/Nodes.ts#L94)*

___

### `Const` HIGHLIGHTED_LINK_COLOR

• **HIGHLIGHTED_LINK_COLOR**: *3355443* = 3355443

*Defined in [core/src/Links.ts:23](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/Links.ts#L23)*

___

### `Const` HOVERED_NODE_SCALE

• **HOVERED_NODE_SCALE**: *1.5* = 1.5

*Defined in [core/src/Nodes.ts:98](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/Nodes.ts#L98)*

___

### `Const` LARGE_ARROW_WIDTH

• **LARGE_ARROW_WIDTH**: *20* = 20

*Defined in [core/src/Links.ts:25](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/Links.ts#L25)*

___

### `Const` LOCKED_NODE_STROKE_OPACITY

• **LOCKED_NODE_STROKE_OPACITY**: *0.4* = 0.4

*Defined in [core/src/Nodes.ts:97](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/Nodes.ts#L97)*

___

### `Const` LOCKED_NODE_STROKE_WIDTH

• **LOCKED_NODE_STROKE_WIDTH**: *0.3* = 0.3

*Defined in [core/src/Nodes.ts:96](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/Nodes.ts#L96)*

___

### `Const` MAX_CLICK_DURATION

• **MAX_CLICK_DURATION**: *300* = 300

*Defined in [core/src/MouseInteraction.ts:5](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/MouseInteraction.ts#L5)*

___

### `Const` MAX_ZOOM

• **MAX_ZOOM**: *5* = 5

*Defined in [core/src/GraphVisualization.ts:20](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/GraphVisualization.ts#L20)*

___

### `Const` PAN_SPEED

• **PAN_SPEED**: *1* = 1

*Defined in [core/src/GraphVisualization.ts:21](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/GraphVisualization.ts#L21)*

___

### `Const` VERTICES_PER_QUAD

• **VERTICES_PER_QUAD**: *6* = 6

*Defined in [core/src/Links.ts:16](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/Links.ts#L16)*

___

### `Const` linksFragmentShader

• **linksFragmentShader**: *"
#define SQRT2OVER2 0.707107

varying vec2 vUV;
varying float vQuadLength;
varying vec3 vColor;
varying float vArrowWidth;
varying float vArrowOffset;
varying float vDashGap;

uniform float lineWidth;
uniform float globalScale;

// pseudo "anti-aliased" step
float aaStep(float edge, float x) {
  return smoothstep(edge - SQRT2OVER2/globalScale, edge + SQRT2OVER2/globalScale, x);
}

float map(float value, float inMin, float inMax, float outMin, float outMax) {
  return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
}

void main() {
  float quadWidth = max(vArrowWidth, lineWidth);
  float arrowHeight = vArrowWidth / 3.0;
  vec2 arrowTip = vec2(
    quadWidth / 2.0,
    vQuadLength - vArrowOffset
  );
  vec2 arrowBase = arrowTip - vec2(0.0, arrowHeight);

  // Configure the arrowhead's "aspect ratio" here:
  float arrowWidth = arrowHeight * 1.5;

  float xFromCenter = abs(vUV.x - arrowTip.x);
  float lineMask = 1.0 - aaStep(lineWidth / 2.0, xFromCenter);
  lineMask -= aaStep(arrowBase.y, vUV.y); // line ends at the base of the arrow

  float dashedY = mod(vUV.y - arrowBase.y, vDashGap * 2.0);
  lineMask -= aaStep(vDashGap, dashedY);
  lineMask = clamp(lineMask, 0.0, 1.0);

  float arrowMask = aaStep(arrowBase.y, vUV.y); // base of the arrow
  arrowMask -= aaStep(arrowTip.y, vUV.y); // tip of the arrow
  float diagonalEdgeX = map(
    vUV.y,
    arrowBase.y, arrowTip.y,
    arrowWidth / 2.0, 0.0
  );
  arrowMask -= aaStep(diagonalEdgeX, xFromCenter);

  float mask = lineMask + arrowMask;

  gl_FragColor = vec4(vColor, mask);
}
"* =  `
#define SQRT2OVER2 0.707107

varying vec2 vUV;
varying float vQuadLength;
varying vec3 vColor;
varying float vArrowWidth;
varying float vArrowOffset;
varying float vDashGap;

uniform float lineWidth;
uniform float globalScale;

// pseudo "anti-aliased" step
float aaStep(float edge, float x) {
  return smoothstep(edge - SQRT2OVER2/globalScale, edge + SQRT2OVER2/globalScale, x);
}

float map(float value, float inMin, float inMax, float outMin, float outMax) {
  return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
}

void main() {
  float quadWidth = max(vArrowWidth, lineWidth);
  float arrowHeight = vArrowWidth / 3.0;
  vec2 arrowTip = vec2(
    quadWidth / 2.0,
    vQuadLength - vArrowOffset
  );
  vec2 arrowBase = arrowTip - vec2(0.0, arrowHeight);

  // Configure the arrowhead's "aspect ratio" here:
  float arrowWidth = arrowHeight * 1.5;

  float xFromCenter = abs(vUV.x - arrowTip.x);
  float lineMask = 1.0 - aaStep(lineWidth / 2.0, xFromCenter);
  lineMask -= aaStep(arrowBase.y, vUV.y); // line ends at the base of the arrow

  float dashedY = mod(vUV.y - arrowBase.y, vDashGap * 2.0);
  lineMask -= aaStep(vDashGap, dashedY);
  lineMask = clamp(lineMask, 0.0, 1.0);

  float arrowMask = aaStep(arrowBase.y, vUV.y); // base of the arrow
  arrowMask -= aaStep(arrowTip.y, vUV.y); // tip of the arrow
  float diagonalEdgeX = map(
    vUV.y,
    arrowBase.y, arrowTip.y,
    arrowWidth / 2.0, 0.0
  );
  arrowMask -= aaStep(diagonalEdgeX, xFromCenter);

  float mask = lineMask + arrowMask;

  gl_FragColor = vec4(vColor, mask);
}
`

*Defined in [core/src/shaders/asText.ts:94](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/shaders/asText.ts#L94)*

___

### `Const` linksVertexShader

• **linksVertexShader**: *"// attribute vec3 position is automatic
// attribute vec2 uv is automatic
attribute float quadLength;
attribute vec3 color;
attribute float arrowWidth;
attribute float arrowOffset;
attribute float dashGap;

varying vec2 vUV;
varying float vQuadLength;
varying vec3 vColor;
varying float vArrowWidth;
varying float vArrowOffset;
varying float vDashGap;

void main() {
    vUV = uv;
    vQuadLength = quadLength;
    vColor = color;
    vArrowOffset = arrowOffset;
    vArrowWidth = arrowWidth;
    vDashGap = dashGap;

    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
"* =  `// attribute vec3 position is automatic
// attribute vec2 uv is automatic
attribute float quadLength;
attribute vec3 color;
attribute float arrowWidth;
attribute float arrowOffset;
attribute float dashGap;

varying vec2 vUV;
varying float vQuadLength;
varying vec3 vColor;
varying float vArrowWidth;
varying float vArrowOffset;
varying float vDashGap;

void main() {
    vUV = uv;
    vQuadLength = quadLength;
    vColor = color;
    vArrowOffset = arrowOffset;
    vArrowWidth = arrowWidth;
    vDashGap = dashGap;

    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`

*Defined in [core/src/shaders/asText.ts:67](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/shaders/asText.ts#L67)*

___

### `Const` nodesFragmentShader

• **nodesFragmentShader**: *"
#define SQRT_2 1.41421

varying vec3 vFill;
varying float vFillOpacity;
varying vec3 vStroke;
varying float vStrokeWidth;
varying float vStrokeOpacity;
varying float vSize;
varying float vInnerRadius;

void main() {
    float distanceFromCenter = distance(gl_PointCoord, vec2(0.5, 0.5));
    float edgeWidth = SQRT_2 / vSize;

    float radiusWithStroke = vInnerRadius + vStrokeWidth;

    float strokeMask = smoothstep(vInnerRadius, vInnerRadius + edgeWidth, distanceFromCenter);
    strokeMask -= smoothstep(radiusWithStroke, radiusWithStroke + edgeWidth, distanceFromCenter);
    float fillMask = 1.0 - smoothstep(vInnerRadius, vInnerRadius + edgeWidth, distanceFromCenter);

    gl_FragColor.rgb = mix(vFill, vStroke, strokeMask);
    gl_FragColor.a = max(strokeMask * vStrokeOpacity, fillMask * vFillOpacity);
}
"* =  `
#define SQRT_2 1.41421

varying vec3 vFill;
varying float vFillOpacity;
varying vec3 vStroke;
varying float vStrokeWidth;
varying float vStrokeOpacity;
varying float vSize;
varying float vInnerRadius;

void main() {
    float distanceFromCenter = distance(gl_PointCoord, vec2(0.5, 0.5));
    float edgeWidth = SQRT_2 / vSize;

    float radiusWithStroke = vInnerRadius + vStrokeWidth;

    float strokeMask = smoothstep(vInnerRadius, vInnerRadius + edgeWidth, distanceFromCenter);
    strokeMask -= smoothstep(radiusWithStroke, radiusWithStroke + edgeWidth, distanceFromCenter);
    float fillMask = 1.0 - smoothstep(vInnerRadius, vInnerRadius + edgeWidth, distanceFromCenter);

    gl_FragColor.rgb = mix(vFill, vStroke, strokeMask);
    gl_FragColor.a = max(strokeMask * vStrokeOpacity, fillMask * vFillOpacity);
}
`

*Defined in [core/src/shaders/asText.ts:41](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/shaders/asText.ts#L41)*

___

### `Const` nodesVertexShader

• **nodesVertexShader**: *"
uniform float globalScale;

attribute vec3 fill;
attribute float fillOpacity;
attribute float absoluteSize;
attribute float scale;
attribute float innerRadius;
attribute vec3 stroke;
attribute float strokeOpacity;
attribute float strokeWidth;

varying vec3 vFill;
varying float vFillOpacity;
varying vec3 vStroke;
varying float vStrokeWidth;
varying float vStrokeOpacity;
varying float vSize;
varying float vInnerRadius;

void main() {
    vStroke = stroke;
    vStrokeWidth = strokeWidth;
    vStrokeOpacity = strokeOpacity;
    vInnerRadius = innerRadius;
    vFill = fill;
    vFillOpacity = fillOpacity;

    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

    // NOTE:
    // globalScale multiplication could be logarithmic depending on intended zooming behavior
    // Something like ((2.2 + log2(globalScale + 0.3)) / 2.0)
    gl_PointSize = absoluteSize * scale * globalScale;
    vSize = gl_PointSize;

    gl_Position = projectionMatrix * mvPosition;
}
"* =  `
uniform float globalScale;

attribute vec3 fill;
attribute float fillOpacity;
attribute float absoluteSize;
attribute float scale;
attribute float innerRadius;
attribute vec3 stroke;
attribute float strokeOpacity;
attribute float strokeWidth;

varying vec3 vFill;
varying float vFillOpacity;
varying vec3 vStroke;
varying float vStrokeWidth;
varying float vStrokeOpacity;
varying float vSize;
varying float vInnerRadius;

void main() {
    vStroke = stroke;
    vStrokeWidth = strokeWidth;
    vStrokeOpacity = strokeOpacity;
    vInnerRadius = innerRadius;
    vFill = fill;
    vFillOpacity = fillOpacity;

    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

    // NOTE:
    // globalScale multiplication could be logarithmic depending on intended zooming behavior
    // Something like ((2.2 + log2(globalScale + 0.3)) / 2.0)
    gl_PointSize = absoluteSize * scale * globalScale;
    vSize = gl_PointSize;

    gl_Position = projectionMatrix * mvPosition;
}
`

*Defined in [core/src/shaders/asText.ts:1](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/shaders/asText.ts#L1)*

___

### `Const` requiredMetadataKey

• **requiredMetadataKey**: *unique symbol* =  Symbol('required')

*Defined in [core/src/validators.ts:3](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/validators.ts#L3)*

## Functions

###  buildMaterial

▸ **buildMaterial**(): *ShaderMaterial*

*Defined in [core/src/Labels.ts:66](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/Labels.ts#L66)*

**Returns:** *ShaderMaterial*

___

###  buildTexture

▸ **buildTexture**(`text`: string, `labelScale`: number): *[TextTexture](../interfaces/core.texttexture.md)*

*Defined in [core/src/Labels.ts:13](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/Labels.ts#L13)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`text` | string | - |
`labelScale` | number | 1 |

**Returns:** *[TextTexture](../interfaces/core.texttexture.md)*

___

###  byPosition

▸ **byPosition**(`a`: [Point](../interfaces/core.point.md), `b`: [Point](../interfaces/core.point.md)): *number*

*Defined in [core/src/hullGeometryUtils.ts:15](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/hullGeometryUtils.ts#L15)*

predicate to sort two points by x and y coordinates

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`a` | [Point](../interfaces/core.point.md) | - |
`b` | [Point](../interfaces/core.point.md) |   |

**Returns:** *number*

___

### `Const` calculateAbsoluteArrowOffset

▸ **calculateAbsoluteArrowOffset**(`link`: [PopulatedDisplayLink](../interfaces/core.populateddisplaylink.md)): *number*

*Defined in [core/src/Links.ts:81](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/Links.ts#L81)*

**Parameters:**

Name | Type |
------ | ------ |
`link` | [PopulatedDisplayLink](../interfaces/core.populateddisplaylink.md) |

**Returns:** *number*

___

###  constructIdToIdxMap

▸ **constructIdToIdxMap**(`arr`: Array‹object›): *object*

*Defined in [core/src/GraphVisualization.ts:29](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/GraphVisualization.ts#L29)*

**Parameters:**

Name | Type |
------ | ------ |
`arr` | Array‹object› |

**Returns:** *object*

* \[ **id**: *string*\]: number

___

###  cross

▸ **cross**(`o`: [Point](../interfaces/core.point.md), `p`: [Point](../interfaces/core.point.md), `q`: [Point](../interfaces/core.point.md)): *number*

*Defined in [core/src/hullGeometryUtils.ts:95](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/hullGeometryUtils.ts#L95)*

Returns the 2D cross product of OP and OQ vectors,
i.e. z-component of their 3D cross product.
Returns a positive value, if vector OPQ makes a counter-clockwise turn,
negative for clockwise turn, and zero if the points are collinear.

NOTE: We could use THREE.Vector2().cross() instead of this function.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`o` | [Point](../interfaces/core.point.md) | - |
`p` | [Point](../interfaces/core.point.md) | - |
`q` | [Point](../interfaces/core.point.md) |   |

**Returns:** *number*

___

###  findNormalViaIntersection

▸ **findNormalViaIntersection**(`v1`: Vector2, `v2`: Vector2, `via`: Vector2): *Vector2*

*Defined in [core/src/hullGeometryUtils.ts:317](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/hullGeometryUtils.ts#L317)*

Finds the intersection point P of:
 1. The vector V1→V2, and,
 2. A vector normal to V1→V2 that passes through point "via".

In other words, we drop a perpendicular on line V1→V2 at point P
that passes through point "via".

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`v1` | Vector2 | - |
`v2` | Vector2 | - |
`via` | Vector2 |   |

**Returns:** *Vector2*

___

###  get2DConvexHull

▸ **get2DConvexHull**(`points`: [Point](../interfaces/core.point.md)[]): *[Point](../interfaces/core.point.md)[]*

*Defined in [core/src/hullGeometryUtils.ts:33](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/hullGeometryUtils.ts#L33)*

Returns points on the convex hull of the given set of co-planar points.
The convex hull excludes collinear points.

This function is an implementation of the Monotone Chain Algorithm (A.M Andrew, 1979)
and runs in O(n log(n)) time.

If input has less than three points, it trivially runs in constant time.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`points` | [Point](../interfaces/core.point.md)[] |   |

**Returns:** *[Point](../interfaces/core.point.md)[]*

___

###  getCapsulePolygon

▸ **getCapsulePolygon**(`nodeA`: [DisplayNode](../interfaces/core.displaynode.md), `nodeB`: [DisplayNode](../interfaces/core.displaynode.md), `padding`: number): *Vector2[]*

*Defined in [core/src/hullGeometryUtils.ts:218](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/hullGeometryUtils.ts#L218)*

gets a bounding polygon in the shape of a capsule enclosing two nodes. 💊

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`nodeA` | [DisplayNode](../interfaces/core.displaynode.md) | - | - |
`nodeB` | [DisplayNode](../interfaces/core.displaynode.md) | - | - |
`padding` | number | 0 |   |

**Returns:** *Vector2[]*

___

###  getCentroid

▸ **getCentroid**(`points`: [Point](../interfaces/core.point.md)[]): *[Point](../interfaces/core.point.md)*

*Defined in [core/src/hullGeometryUtils.ts:290](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/hullGeometryUtils.ts#L290)*

gets the centroid of a given list of points

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`points` | [Point](../interfaces/core.point.md)[] |   |

**Returns:** *[Point](../interfaces/core.point.md)*

___

###  getCircularHull

▸ **getCircularHull**(`points`: [Point](../interfaces/core.point.md)[]): *object*

*Defined in [core/src/hullGeometryUtils.ts:265](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/hullGeometryUtils.ts#L265)*

gets the circular hull of a given list of points

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`points` | [Point](../interfaces/core.point.md)[] |   |

**Returns:** *object*

* **center**: *Vector2*

* **radius**: *number*

___

###  getDistance

▸ **getDistance**(`a`: [Point](../interfaces/core.point.md), `b`: [Point](../interfaces/core.point.md)): *number*

*Defined in [core/src/hullGeometryUtils.ts:302](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/hullGeometryUtils.ts#L302)*

gets the distance between two points

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`a` | [Point](../interfaces/core.point.md) | - |
`b` | [Point](../interfaces/core.point.md) |   |

**Returns:** *number*

___

###  getRoundedOffsetPolygon

▸ **getRoundedOffsetPolygon**(`nodes`: [DisplayNode](../interfaces/core.displaynode.md)[], `padding`: number): *Vector2[]*

*Defined in [core/src/hullGeometryUtils.ts:125](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/hullGeometryUtils.ts#L125)*

Gets the rounded offset polygon.
---------------------------------
This implementation is loosely based on the method highlighted in this
thread: https://discourse.threejs.org/t/offsetcontour-function/3185

First, find the offset contour by using the bisector method:

For each vertex V calculate the padded vertex:
 1. Find the bisector B for the outer angle between vectors V1→V and V2→V,
    where V1 and V2 are previous and next vertices respectively.
 2. Translate a point P = V along vector B for a distance of
    offset = node.radius + padding.
 3. Return P (the padded vertex)

Then round the vertices:

Replace each padded vertex with a QuadraticBezierCurve s.t.:
the paddedVertex P is the control point of the curve
and the intersection points of perpendiculars drawn from
vertex V to tangents V1→V and V2→V, are the start and the end points of the
curve respectively.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`nodes` | [DisplayNode](../interfaces/core.displaynode.md)[] | - | - |
`padding` | number | 0 |   |

**Returns:** *Vector2[]*

___

###  populateLinks

▸ **populateLinks**(`graphData`: [VisualizationInputData](../interfaces/core.visualizationinputdata.md), `nodeIdToIdxMap`: object): *[PopulatedDisplayLink](../interfaces/core.populateddisplaylink.md)[]*

*Defined in [core/src/Links.ts:70](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/Links.ts#L70)*

**Parameters:**

Name | Type |
------ | ------ |
`graphData` | [VisualizationInputData](../interfaces/core.visualizationinputdata.md) |
`nodeIdToIdxMap` | object |

**Returns:** *[PopulatedDisplayLink](../interfaces/core.populateddisplaylink.md)[]*

___

###  required

▸ **required**(`target`: Object, `propertyKey`: string | symbol, `parameterIndex`: number): *void*

*Defined in [core/src/validators.ts:5](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/validators.ts#L5)*

**Parameters:**

Name | Type |
------ | ------ |
`target` | Object |
`propertyKey` | string &#124; symbol |
`parameterIndex` | number |

**Returns:** *void*

___

###  setMeshTexture

▸ **setMeshTexture**(`mesh`: Mesh, `texture`: [TextTexture](../interfaces/core.texttexture.md)): *void*

*Defined in [core/src/Labels.ts:99](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/Labels.ts#L99)*

**Parameters:**

Name | Type |
------ | ------ |
`mesh` | Mesh |
`texture` | [TextTexture](../interfaces/core.texttexture.md) |

**Returns:** *void*

___

###  validate

▸ **validate**(`target`: any, `propertyName`: string, `descriptor`: TypedPropertyDescriptor‹Function›): *void*

*Defined in [core/src/validators.ts:22](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/validators.ts#L22)*

**Parameters:**

Name | Type |
------ | ------ |
`target` | any |
`propertyName` | string |
`descriptor` | TypedPropertyDescriptor‹Function› |

**Returns:** *void*

___

###  validateClassConstructor

▸ **validateClassConstructor**<**T**>(`target`: T): *any*

*Defined in [core/src/validators.ts:53](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/validators.ts#L53)*

**Type parameters:**

▪ **T**: *object*

**Parameters:**

Name | Type |
------ | ------ |
`target` | T |

**Returns:** *any*

## Object literals

### `Const` DATA

### ▪ **DATA**: *object*

*Defined in [core/src/GraphVisualization.test.ts:6](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/GraphVisualization.test.ts#L6)*

###  groups

• **groups**: *object[]* =  [
    {
      id: 'c2',
      visible: true,
      shape: 'convexHull' as const,
    },
  ]

*Defined in [core/src/GraphVisualization.test.ts:21](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/GraphVisualization.test.ts#L21)*

###  links

• **links**: *object[]* =  [
    {source: '1', target: '2'},
    {source: '3', target: '4'},
    {source: '3', target: '5'},
    {source: '3', target: '6'},
  ]

*Defined in [core/src/GraphVisualization.test.ts:15](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/GraphVisualization.test.ts#L15)*

###  nodes

• **nodes**: *[DisplayNode](../interfaces/core.displaynode.md)[]* =  [
    {id: '1', fill: 'coral'},
    {id: '2', fill: 'orange'},
    {id: '3', displayGroupIds: ['c2'], fill: 'blue'},
    {id: '4', displayGroupIds: ['c2'], fill: 'lightblue'},
    {id: '5', displayGroupIds: ['c2'], fill: 'orange'},
    {id: '6', displayGroupIds: ['c2'], fill: 'green'},
  ] as DisplayNode[]

*Defined in [core/src/GraphVisualization.test.ts:7](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/GraphVisualization.test.ts#L7)*

___

### `Const` DEFAULT_CONFIG_OPTIONS

### ▪ **DEFAULT_CONFIG_OPTIONS**: *object*

*Defined in [core/src/GraphVisualization.ts:38](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/GraphVisualization.ts#L38)*

###  disableClick

• **disableClick**: *boolean* = false

*Defined in [core/src/GraphVisualization.ts:39](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/GraphVisualization.ts#L39)*

###  disableDrag

• **disableDrag**: *boolean* = false

*Defined in [core/src/GraphVisualization.ts:43](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/GraphVisualization.ts#L43)*

###  disableHover

• **disableHover**: *boolean* = false

*Defined in [core/src/GraphVisualization.ts:40](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/GraphVisualization.ts#L40)*

###  disablePan

• **disablePan**: *boolean* = false

*Defined in [core/src/GraphVisualization.ts:41](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/GraphVisualization.ts#L41)*

###  disableSecondaryClick

• **disableSecondaryClick**: *boolean* = false

*Defined in [core/src/GraphVisualization.ts:44](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/GraphVisualization.ts#L44)*

###  disableZoom

• **disableZoom**: *boolean* = false

*Defined in [core/src/GraphVisualization.ts:42](https://github.com/uplevel-technology/graph-viz/blob/d488454d/packages/core/src/GraphVisualization.ts#L42)*
