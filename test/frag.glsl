
  
  precision mediump float;
  uniform vec4 u_color;
  uniform float u_time;
  varying vec2 vPos;

uniform vec2 u_resolution;


  void main () {

    // vec2 pos = vec2(newPos.x, newPos.y);
  
    gl_FragColor = vec4(vPos.x, vPos.y, 0.0, 1.0);

  }