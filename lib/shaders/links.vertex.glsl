// attribute vec3 position is automatic
// attribute vec2 uv is automatic
attribute float quadLength;
attribute float linkOffset;
attribute vec3 color;
attribute float arrowHeight;
attribute float dashGap;

varying vec2 vUV;
varying float vQuadLength;
varying float vLinkOffset;
varying vec3 vColor;
varying float vArrowHeight;
varying float vDashGap;

void main() {
    vUV = uv;
    vQuadLength = quadLength;
    vColor = color;
    vArrowHeight = arrowHeight;
    vLinkOffset = linkOffset;
    vDashGap = dashGap;

    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
