precision mediump float;
attribute vec2 position;

varying vec2 vPos;

uniform float u_time;

  void main () {
    vPos = position;
    gl_Position = vec4(position, sin(u_time), 1);    
  }