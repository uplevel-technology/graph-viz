#define POINT_SIZE 50.0

uniform float cameraZoom;

attribute vec3 fill;
attribute vec3 stroke;
attribute float strokeWidth;
attribute float strokeOpacity;
attribute float scale;

varying vec3 vFill;
varying vec3 vStroke;
varying float vStrokeWidth;
varying float vStrokeOpacity;
varying float vSize;

void main() {
    vStroke = stroke;
    vStrokeWidth = strokeWidth;
    vStrokeOpacity = strokeOpacity;
    vFill = fill;

    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

    // TODO: camerazoom multiplication must be logarithmic
    // Something like ((2.2 + log2(cameraZoom + 0.3)) / 2.0)
    gl_PointSize = POINT_SIZE * scale * cameraZoom;
    vSize = gl_PointSize;

    gl_Position = projectionMatrix * mvPosition;
}
