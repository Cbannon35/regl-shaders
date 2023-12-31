// precision mediump float;
// #define PI 3.1415926538

// attribute vec3 position;
// attribute vec3 normal;
// attribute vec2 uv;
// attribute float index, frequency, FFT_SIZE;

// varying vec2 vUv;
// varying vec3 vNormal;
// varying float z;

// uniform mat4 projection, view;
// uniform float u_time;


// varying vec2 vuv;

// void main() {
//     vUv = uv;
//     vNormal = normal;
//     z = position.z;

//     float dz = length(uv);
//     dz = sin(dz*8. + u_time) ;
//     // d = abs(d);
//     // d = step(.1, d);


//     // gl_Position = projection * view * vec4(position.x, position.y, position.z + d, 1.);
//      gl_Position = projection * view * vec4(
//           position.x,
//           position.y,
//           position.z + dz,
//           1);
// }

precision mediump float;
    uniform mat4 projection, view;
    attribute vec3 position;
    attribute vec2 barycentric;
    varying vec2 b;
    void main () {
      b = barycentric;
      gl_Position = projection * view * vec4(position, 1);
    }