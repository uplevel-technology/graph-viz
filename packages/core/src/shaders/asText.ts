export const nodesVertexShader = `
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

export const nodesFragmentShader = `
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

export const linksVertexShader = `// attribute vec3 position is automatic
// attribute vec2 uv is automatic
attribute float quadLength;
attribute vec3 color;
attribute float opacity;
attribute float arrowWidth;
attribute float arrowOffset;
attribute float dashGap;

varying vec2 vUV;
varying float vQuadLength;
varying vec3 vColor;
varying float vOpacity;
varying float vArrowWidth;
varying float vArrowOffset;
varying float vDashGap;

void main() {
    vUV = uv;
    vQuadLength = quadLength;
    vColor = color;
    vOpacity = opacity;
    vArrowOffset = arrowOffset;
    vArrowWidth = arrowWidth;
    vDashGap = dashGap;

    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`

export const linksFragmentShader = `
#define SQRT2OVER2 0.707107

varying vec2 vUV;
varying float vQuadLength;
varying vec3 vColor;
varying float vOpacity;
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

  float mask = (lineMask + arrowMask) * vOpacity;
  gl_FragColor = vec4(vColor, mask);
}
`
