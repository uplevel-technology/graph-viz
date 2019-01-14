// attribute vec3 position is automatic
// attribute vec2 uv is automatic
attribute float length;
attribute vec3 color;
attribute float arrowHeight;

varying vec2 vUV;
varying float vLength;
varying vec3 vColor;
varying float vArrowHeight;

void main() {
    vUV = uv;
    vLength = length;
    vColor = color;
    vArrowHeight = arrowHeight;

    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
