/* Citation: https://github.com/regl-project/regl/blob/gh-pages/example/cloth.js */

const canvas = document.body.appendChild(document.createElement("canvas"));
const glslify = require("glslify");
const fit = require("canvas-fit");
const regl = require("regl")(canvas);
const mat4 = require("gl-mat4");
const camera = require("canvas-orbit-camera")(canvas);
window.addEventListener("resize", fit(canvas), false);
const vec3 = require("gl-vec3");

/* START AUDIO */
const audioPlayer = require("web-audio-player");
const src = "../assets/sage_room_hylics.mp3";
const AudioContext = window.AudioContext || window.webkitAudioContext;
let analyser, fftSize, fftBuffer, frequencies;

const audioContext = new AudioContext();
const audio = audioPlayer(src, {
  context: audioContext,
  loop: true,
  buffer: false,
  volume: 0.5,
});
// const loader = document.querySelector('.loader')
audio.once("load", () => {
  // analyser = glAudioAnalyser(gl, audio.node, audioContext)
  analyser = audioContext.createAnalyser();
  audio.node.connect(analyser);
  audio.node.connect(audioContext.destination);
  fftSize = analyser.frequencyBinCount;
  frequencies = new Uint8Array(fftSize);
  fftBuffer = regl.buffer({
    length: fftSize,
    type: "uint8",
    usage: "dynamic",
  });
});

window.addEventListener("click", toggle_audio);

let playing = false;
function toggle_audio() {
  if (playing) audio.pause();
  else audio.play();
  playing = !playing;
}
/* END AUDIO */

// configure intial camera view.
// camera.view(mat4.lookAt([], [300, 300.0, 300.0], [0, 0, 0.0], [0, 0, 0]));
camera.zoom(-10.0);
camera.rotate([0, 0], [0, 0.5]);
const uv = [];
const elements = [];
var position = [];
var oldPosition = [];
const normal = [];
var constraints = [];

// create a constraint between the vertices with the indices i0 and i1.
function Constraint(i0, i1) {
  this.i0 = i0;
  this.i1 = i1;

  this.restLength = vec3.distance(position[i0], position[i1]);
}

var size = 5.5;
var xmin = -size;
var xmax = +size;
var ymin = -size;
var ymax = +size;

// the tesselation level of the cloth.
const N = 30;

var row;
var col;

// create cloth vertices and uvs.
for (row = 0; row <= N; ++row) {
  var z = (row / N) * (ymax - ymin) + ymin;
  var v = row / N;

  for (col = 0; col <= N; ++col) {
    var x = (col / N) * (xmax - xmin) + xmin;
    var u = col / N;

    position.push([x, 0.0, z]);
    oldPosition.push([x, 0.0, z]);
    uv.push([u, v]);
  }
}

const positionBuffer = regl.buffer({
  length: position.length * 3 * 4,
  type: "float",
  usage: "dynamic",
});

var i, i0, i1, i2, i3;

// for every vertex, create a corresponding normal.
for (i = 0; i < position.length; ++i) {
  normal.push([0.0, 0.0, 0.0]);
}

const normalBuffer = regl.buffer({
  length: normal.length * 3 * 4,
  type: "float",
  usage: "dynamic",
});

// create faces
for (row = 0; row <= N - 1; ++row) {
  for (col = 0; col <= N - 1; ++col) {
    i = row * (N + 1) + col;

    i0 = i + 0;
    i1 = i + 1;
    i2 = i + (N + 1) + 0;
    i3 = i + (N + 1) + 1;

    elements.push([i3, i1, i0]);
    elements.push([i0, i2, i3]);
  }
}

// create constraints
for (row = 0; row <= N; ++row) {
  for (col = 0; col <= N; ++col) {
    i = row * (N + 1) + col;

    i0 = i + 0;
    i1 = i + 1;
    i2 = i + (N + 1) + 0;
    i3 = i + (N + 1) + 1;

    // add constraint linked to the element in the next column, if it exist.
    if (col < N) {
      constraints.push(new Constraint(i0, i1));
    }

    // add constraint linked to the element in the next row, if it exists
    if (row < N) {
      constraints.push(new Constraint(i0, i2));
    }

    // add constraint linked the next diagonal element, if it exists.
    if (col < N && row < N) {
      constraints.push(new Constraint(i0, i3));
    }
  }
}

const drawCloth = regl({
  // no culling, because we'll be rendering both the backside and the frontside of the cloth.
  //   cull: {
  //     enable: false,
  //   },
  context: {
    view: () => camera.view(),
  },

  frag: glslify("./frag.glsl"),
  vert: glslify("./vert.glsl"),

  uniforms: {
    view: regl.context("view"),
    projection: ({ viewportWidth, viewportHeight }) =>
      mat4.perspective(
        [],
        Math.PI / 4,
        viewportWidth / viewportHeight,
        0.02,
        1000
      ),
    u_time: regl.context("time"),
    u_resolution: () => [
      regl.context(context.viewportWidth),
      regl.context(context.viewportHeight),
    ],
  },

  attributes: {
    position: {
      buffer: positionBuffer,
      normalized: true,
    },
    uv: regl.prop("uv"),
    normal: {
      buffer: normalBuffer,
      normalized: true,
    },
  },
  elements: regl.prop("elements"),
});

regl.frame(({ tick }) => {
  const deltaTime = 0.017;

  regl.clear({
    color: [0, 0, 0, 255],
    depth: 1,
  });

  positionBuffer.subdata(position);
  normalBuffer.subdata(normal);

  drawCloth({ elements, uv });
  camera.tick();
});
