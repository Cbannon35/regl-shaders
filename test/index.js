const regl = require("regl")(document.body);
const glslify = require("glslify");

const poseDetection = require("@tensorflow-models/pose-detection");
const tf = require("@tensorflow/tfjs-core");
// Register one of the TF.js backends.
require("@tensorflow/tfjs-backend-webgl");
async function loadBacked() {
  await tf.setBackend("webgl");
}
loadBacked();
// import '@tensorflow/tfjs-backend-wasm';

// /* Webcam */ //https://stackoverflow.com/questions/61763796/record-webcam-video-using-javascript
async function getStream() {
  return await navigator.mediaDevices.getUserMedia({ video: true });
}
/* Pose detection */
const detectorConfig = {
  modelType: poseDetection.movenet.modelType.MULTIPOSE_LIGHTNING,
  enableTracking: true,
  trackerType: poseDetection.TrackerType.BoundingBox,
};
async function setupDetection() {
  const detector = await poseDetection.createDetector(
    poseDetection.SupportedModels.MoveNet,
    detectorConfig
  );
  return detector;
}

let detector, stream, video;
let setup = false;

async function setupVideo() {
  stream = await getStream();
  detector = await setupDetection();
  video = document.createElement("video");
  video.srcObject = stream;
  video.autoplay = true;
  video.onloadedmetadata = () => {
    const poses = detector.estimatePoses(video);
    console.log(poses);
  };
  video.style.transform = "scaleX(-1)";
  video.style.display = "none";
  console.log("setup");
  document.body.appendChild(video);
  setup = true;
}
setupVideo();

const drawBG = regl({
  frag: glslify("./frag.glsl"),
  vert: glslify("./vert.glsl"),

  attributes: {
    position: regl.buffer([
      [-1, -1],
      [1, -1],
      [1, 1],
      [-1, 1],
    ]),
  },

  uniforms: {
    u_time: (context) => context.time,
  },

  count: 4,
  primitive: "triangle fan",
});

regl.frame((context) => {
  drawBG();

  if (setup) {
    // Call pose detection in each frame
    const poses = detector.estimatePoses(video);
    console.log(poses);
  }
});
