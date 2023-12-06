precision mediump float;

varying vec2 vUv;
varying vec3 vNormal;
varying float z;

uniform sampler2D texture;
uniform vec2 u_resolution;
uniform float u_time;

void main () {
    vec2 st = vUv * 2. -1.;

    float d = length(st);
    d = sin(d*8. + u_time) / 8.;
    d = abs(d);
    d = step(.1, d);

    // gl_FragColor = vec4(d,d, 0.0, 1.);
    gl_FragColor = vec4(1.0);
}