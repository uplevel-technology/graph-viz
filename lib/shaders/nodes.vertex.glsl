#define POINT_SIZE 20.0

uniform float globalScale;

attribute vec3 fill;
attribute float scale;
attribute vec3 stroke;
attribute float strokeOpacity;
attribute float strokeWidth;

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

    // TODO: globalScale multiplication must be logarithmic
    // Something like ((2.2 + log2(globalScale + 0.3)) / 2.0)
    gl_PointSize = POINT_SIZE * scale * globalScale;
    vSize = gl_PointSize;

    gl_Position = projectionMatrix * mvPosition;
}
