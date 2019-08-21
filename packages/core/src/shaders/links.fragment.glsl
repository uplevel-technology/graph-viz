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
