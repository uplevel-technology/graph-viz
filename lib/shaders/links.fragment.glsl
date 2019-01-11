varying vec2 vUV;
varying float vLength;
varying vec3 vColor;

uniform float quadWidth;
uniform float lineWidth;
uniform float arrowHeight;

void main() {
  // TODO: this should be a varying:
  float lineOffset = 4.0; // e.g. node radius

  float arrowWidth = arrowHeight * 2.0;

  vec2 arrowTip = vec2(
    quadWidth / 2.0,
    vLength - lineOffset
  );
  vec2 arrowBase = arrowTip - vec2(0.0, arrowHeight);

  float xFromCenter = abs(vUV.x - arrowTip.x);
  float lineMask = 1.0 - step(lineWidth / 2.0, xFromCenter);
  lineMask -= step(arrowBase.y, vUV.y); // line ends at the base of the arrow
  lineMask = clamp(lineMask, 0.0, 1.0);

  float arrowMask = step(arrowBase.y, vUV.y); // base of the arrow
  arrowMask -= step(arrowTip.y, vUV.y); // tip of the arrow
  arrowMask -= step(arrowTip.y - vUV.y, xFromCenter); // diagonal edge

  float mask = lineMask + arrowMask;

	gl_FragColor = vec4(vColor, mask);
}
