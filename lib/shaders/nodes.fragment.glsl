#define SQRT_2 1.41421

varying vec3 vFill;
varying float vFillOpacity;
varying vec3 vStroke;
varying float vStrokeWidth;
varying float vStrokeOpacity;
varying float vSize;
varying float vInnerRadius;

void main() {
    float distanceFromCenter = distance(gl_PointCoord, vec2(0.5, 0.5));
    float edgeWidth = SQRT_2 / vSize;

    float radiusWithStroke = vInnerRadius + vStrokeWidth;

    float strokeMask = smoothstep(vInnerRadius, vInnerRadius + edgeWidth, distanceFromCenter);
    strokeMask -= smoothstep(radiusWithStroke, radiusWithStroke + edgeWidth, distanceFromCenter);
    float fillMask = 1.0 - smoothstep(vInnerRadius, vInnerRadius + edgeWidth, distanceFromCenter);
    fillMask *= vFillOpacity;

    gl_FragColor.rgb = mix(vFill, vStroke, strokeMask);
    gl_FragColor.a = max(strokeMask * vStrokeOpacity, fillMask);
}
