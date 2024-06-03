let video, bodypose, pose, keypoint, detector;
let poses = [];
let myImage;
let nameID = "林揚紘 412730441"; // Your student ID and name

async function init() {
  const detectorConfig = {
    modelType: poseDetection.movenet.modelType.MULTIPOSE_LIGHTNING,
  };
  detector = await poseDetection.createDetector(
    poseDetection.SupportedModels.MoveNet,
    detectorConfig
  );
}

async function videoReady() {
  console.log("video ready");
  await getPoses();
}

async function getPoses() {
  if (detector) {
    poses = await detector.estimatePoses(video.elt, {
      maxPoses: 2,
      //flipHorizontal: true,
    });
  }
  requestAnimationFrame(getPoses);
}

async function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO, videoReady);
  video.size(width, height);
  video.hide();
  await init();

  // Load your image
  myImage = loadImage('upload_fc4425b4ca387e988f6909176caae0ca.gif');

  stroke(255);
  strokeWeight(5);
}

function draw() {
  image(video, 0, 0);
  drawSkeleton();
  drawOverlay();
  // flip horizontal
  cam = get();
  translate(cam.width, 0);
  scale(-1, 1);
  image(cam, 0, 0);
}

function drawSkeleton() {
  // Draw all the tracked landmark points
  for (let i = 0; i < poses.length; i++) {
    pose = poses[i];
    // shoulder to wrist
    for (let j = 5; j < 9; j++) {
      if (pose.keypoints[j].score > 0.1 && pose.keypoints[j + 2].score > 0.1) {
        partA = pose.keypoints[j];
        partB = pose.keypoints[j + 2];
        line(partA.x, partA.y, partB.x, partB.y);
      }
    }
    // shoulder to shoulder
    partA = pose.keypoints[5];
    partB = pose.keypoints[6];
    if (partA.score > 0.1 && partB.score > 0.1) {
      line(partA.x, partA.y, partB.x, partB.y);
    }
    // hip to hip
    partA = pose.keypoints[11];
    partB = pose.keypoints[12];
    if (partA.score > 0.1 && partB.score > 0.1) {
      line(partA.x, partA.y, partB.x, partB.y);
    }
    // shoulders to hips
    partA = pose.keypoints[5];
    partB = pose.keypoints[11];
    if (partA.score > 0.1 && partB.score > 0.1) {
      line(partA.x, partA.y, partB.x, partB.y);
    }
    partA = pose.keypoints[6];
    partB = pose.keypoints[12];
    if (partA.score > 0.1 && partB.score > 0.1) {
      line(partA.x, partA.y, partB.x, partB.y);
    }
    // hip to foot
    for (let j = 11; j < 15; j++) {
      if (pose.keypoints[j].score > 0.1 && pose.keypoints[j + 2].score > 0.1) {
        partA = pose.keypoints[j];
        partB = pose.keypoints[j + 2];
        line(partA.x, partA.y, partB.x, partB.y);
      }
    }
  }
}

function drawOverlay() {
  for (let i = 0; i < poses.length; i++) {
    pose = poses[i];
    // Display image on eyes
    displayImage(pose.keypoints[1], myImage); // Left eye
    displayImage(pose.keypoints[2], myImage); // Right eye
    // Display image on shoulders
    displayImage(pose.keypoints[5], myImage); // Left shoulder
    displayImage(pose.keypoints[6], myImage); // Right shoulder
    // Display moving image on wrists
    displayMovingImage(pose.keypoints[9], myImage, -1); // Left wrist
    displayMovingImage(pose.keypoints[10], myImage, -1); // Right wrist
    // Display image on ears and animate them moving from left to right
    displayMovingImage(pose.keypoints[3], myImage, 1); // Left ear
    displayMovingImage(pose.keypoints[4], myImage, 1); // Right ear
    // Display name and ID above the head
    displayTextAboveHead(pose.keypoints[0], nameID);
  }
}

function displayImage(keypoint, img) {
  if (keypoint.score > 0.1) {
    let x = keypoint.x;
    let y = keypoint.y;
    image(img, x - 25, y - 25, 50, 50); // Adjust the size and position of the image
  }
}

function displayMovingImage(keypoint, img, direction) {
  if (keypoint.score > 0.1) {
    let x = keypoint.x + frameCount * 0.5 * direction;
    let y = keypoint.y;
    if (direction === 1) {
      if (x > width) x = 0;
    } else {
      if (x < 0) x = width;
    }
    image(img, x - 25, y - 25, 50, 50); // Adjust the size and position of the image
  }
}

function displayTextAboveHead(keypoint, text) {
  if (keypoint.score > 0.1) {
    let x = keypoint.x;
    let y = keypoint.y - 40; // Adjust the position above the head
    textSize(24);
    fill(255, 0, 0);
    textAlign(CENTER);
    text(text, x, y);
  }
}
