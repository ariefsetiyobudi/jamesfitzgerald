precision highp float;

attribute vec3 position;
attribute vec2 uv;

uniform float uTime;
uniform float uSpeed;
uniform vec2 uViewportSizes;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

varying vec4 vPosition;
varying vec2 vUv;

void main() {
  vUv = uv;

  vec3 p = position;

  p.z = (sin(p.x * 4.0 + uTime) * 1.5 + cos(p.y * 2.0 + uTime) * 1.5) * (0.1 + uSpeed * 0.5);

  vec4 newPosition = modelViewMatrix * vec4(p, 1.0);

  vPosition = newPosition;

  gl_Position = projectionMatrix * newPosition;
}
