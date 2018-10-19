#define RADIUS 0.2
#define SQRT_2 1.41421

varying vec3 vFill;
varying vec3 vStroke;
varying float vStrokeWidth;
varying float vStrokeOpacity;
varying float vSize;

void main() {
    float distanceFromCenter = distance(gl_PointCoord, vec2(0.5, 0.5));
    float edgeWidth = SQRT_2 / vSize;

    float radiusWithStroke = RADIUS + vStrokeWidth;

    float strokeMask = (smoothstep(RADIUS, RADIUS + edgeWidth, distanceFromCenter) - smoothstep(radiusWithStroke, radiusWithStroke + edgeWidth, distanceFromCenter));
    float fillMask = (1.0 - (smoothstep(RADIUS, RADIUS + edgeWidth, distanceFromCenter)));

    gl_FragColor.rgb = mix(vFill, vStroke, strokeMask);
    gl_FragColor.a = max(strokeMask * vStrokeOpacity, fillMask);
}
