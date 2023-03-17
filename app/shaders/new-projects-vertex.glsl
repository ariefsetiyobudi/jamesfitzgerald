#define GLSLIFY 1
attribute vec3 position;
attribute vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform float uTime;
uniform float uSpeed;

varying float vPosition;
varying vec2 vUv;

void main() {
  vUv = uv;

  vec3 p = position;
  float speed = 0.1 + uSpeed;

  p.z = (sin(p.x * 4.0 + uTime) * speed + cos(p.y * 2.0 + uTime) * speed);

  vPosition = p.z;

  vec4 newPosition = modelViewMatrix * vec4(p, 1.0);

  gl_Position = projectionMatrix * newPosition;
}
