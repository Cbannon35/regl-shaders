precision mediump float;
#define PI 3.1415926538

attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

varying vec2 vUv;
varying vec3 vNormal;
varying float z;

uniform mat4 projection, view;
uniform float u_time;

void main() {
vUv = uv;
vNormal = normal;
z = position.z;

float d = length(uv);
    d = sin(d*8. + u_time);
    // d = abs(d);
    // d = step(.1, d);

gl_Position = projection * view * vec4(position.x, position.y, position.z + d, 1.);
}