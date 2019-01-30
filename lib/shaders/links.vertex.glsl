// attribute vec3 position is automatic
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
