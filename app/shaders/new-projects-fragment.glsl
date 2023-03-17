precision highp float;
#define GLSLIFY 1

uniform float uAlpha;
uniform sampler2D tMap;

varying float vPosition;
varying vec2 vUv;

vec3 saturation(vec3 rgb, float adjustment) {
  const vec3 W = vec3(0.2125, 0.7154, 0.0721);
  vec3 intensity = vec3(dot(rgb, W));
  return mix(intensity, rgb, adjustment);
}

void main() {
  vec4 color = texture2D(tMap, vUv);
  float value = 1.0;

  if (vPosition > 0.0) {
    color.rgb += clamp(vPosition, 0.0, 0.1);
    value = 1.0 + vPosition;
  }

  color.rgb = saturation(color.rgb, value);

  gl_FragColor = vec4(color.rgb, color.a * uAlpha);
}
