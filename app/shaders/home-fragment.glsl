precision highp float;
#define GLSLIFY 1

uniform float uAlpha;
uniform sampler2D tMap;

varying vec2 vUv;

void main() {
  vec4 texture = texture2D(tMap, vUv);

  gl_FragColor = vec4(texture.rgb, texture.a * uAlpha);
}

