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
