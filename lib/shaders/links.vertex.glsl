// attribute vec3 position is automatic
// attribute vec2 uv is automatic
attribute vec2 size;
attribute vec3 color;

varying vec2 vUV;
varying vec2 vSize;
varying vec3 vColor;

void main() {
    vUV = uv;
    vSize = size;
    vColor = color;

    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
