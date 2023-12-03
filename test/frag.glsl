precision mediump float;
// uniform vec4 u_color;
// uniform float u_time;
varying vec2 vPos;

uniform vec2 leftWrist;
uniform vec2 rightWrist;
uniform vec2 u_resolution;


  void main () {
    vec2 st = (gl_FragCoord.xy / u_resolution) * 2.0 - 1.;
    vec2 leftWristPos = (leftWrist / u_resolution) * 2.0 - 1.;
    // printf("leftWristPos: %f, %f\n", leftWristPos.x, leftWristPos.y);
    vec2 rightWristPos = (rightWrist / u_resolution) * 2.0 - 1.0;

    // vec2 newPos = vec2(0.0, 0.0);
    // float dist = distance(leftWristPos, rightWristPos);

    // vec2 pos = vec2(newPos.x, newPos.y);

    // vec4 black = vec4(0.0, 0.0, 0.0, 1.0);
    // vec4 white = vec4(1.0, 1.0, 1.0, 1.0);
  
    gl_FragColor = vec4(rightWristPos.x, rightWristPos.y, 1.0, 1.0);

  }