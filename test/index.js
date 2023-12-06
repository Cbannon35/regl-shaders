const regl = require("regl")();
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

let detector, stream, video, videoTexture, copyPixels;
let setup = false;

async function setupVideo() {
  stream = await getStream();
  detector = await setupDetection();
  video = document.createElement("video");
  video.srcObject = stream;
  video.autoplay = true;
  video.onloadedmetadata = () => {
    // const poses = detector.estimatePoses(video);
    try {
      console.log("texture", videoTexture);
      videoTexture = regl.texture(video);
    } catch (e) {
      console.log(e);
    }

    // console.log(poses);
  };
  video.style.transform = "scaleX(-1)";
  video.style.width = "100vw";
  // video.style.display = "none";
  video.style.opacity = "20%";
  console.log("setup");
  document.body.appendChild(video);
  setup = true;

  // videoTexture = regl.texture(video);
  // console.log("texture", videoTexture);
  // copyPixels = regl.texture({
  //   x: 5,
  //   y: 1,
  //   width: 10,
  //   height: 10,
  //   copy: true,
  // });
}
setupVideo();

async function estimate() {
  try {
    let p = await detector.estimatePoses(video);
    if (p === undefined || p[0] === undefined) return [];
    // console.log(p);
    return p[0].keypoints;
  } catch (e) {
    console.log(e);
    return [];
  }
}

let counter = 0; // keep track of times model mispredicts to avoid flickering
let cached = [
  [0, 0],
  [0, 0],
]; // keep track of last prediction to avoid flickering

const draw = regl({
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
    u_resolution: (context) => [context.viewportWidth, context.viewportHeight],
    leftWrist: regl.prop("leftWrist"),
    rightWrist: regl.prop("rightWrist"),
  },

  count: 4,
  primitive: "triangle fan",
});

regl.frame(async (context) => {
  if (setup) {
    // Call pose detection in each frame
    let keypoints = await estimate();
    let lw;
    let rw;
    if (keypoints.length == 0) {
      lw = null;
      rw = null;
    } else {
      let tempLeftWrist = keypoints[9];
      let tempRightWrist = keypoints[10];

      /* For some reason scaling by 3 maps pretty well ? */
      lw =
        tempLeftWrist.score > 0.15
          ? [tempLeftWrist.x * 3, tempLeftWrist.y * 3]
          : null;
      rw =
        tempRightWrist.score > 0.15
          ? [tempRightWrist.x * 3, tempRightWrist.y * 3]
          : null;
    }

    if (lw == null && rw == null) counter++;
    else {
      console.log("update", lw, rw);
      cached = [lw === null ? [0, 0] : lw, rw === null ? [0, 0] : rw];
      counter = 0;
    }

    if (counter > 50) {
      console.log("reset");
      // if model mispredicts 10 times in a row, we can assume that the user is not in the frame
      cached = [
        [0, 0],
        [0, 0],
      ];
    }

    draw({
      leftWrist: cached[0],
      rightWrist: cached[1],
    });

    console.log(lw, rw);
  } else {
    draw({
      // initial draw
      leftWrist: [100, 100],
      rightWrist: [100, 1000],
    });
  }
});
