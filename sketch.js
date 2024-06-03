let video, bodypose, pose, keypoint, detector; // 定義變量
let poses = [];
let img; // 用於存放您的物件圖片
let studentID = "412730441"; // 學號
let studentName = "林揚紘"; // 姓名

// 初始化MoveNet檢測器
async function init() {
  const detectorConfig = {
    modelType: poseDetection.movenet.modelType.MULTIPOSE_LIGHTNING,
  };
  detector = await poseDetection.createDetector(
    poseDetection.SupportedModels.MoveNet,
    detectorConfig
  );
}

// 當視頻準備好時調用
async function videoReady() {
  console.log("video ready");
  await getPoses();
}

// 獲取姿勢數據
async function getPoses() {
  if (detector) {
    poses = await detector.estimatePoses(video.elt, {
      maxPoses: 2,
      //flipHorizontal: true,
    });
  }
  requestAnimationFrame(getPoses);
}

// 設置畫布和視頻
async function setup() {
  createCanvas(640, 480); // 創建畫布
  video = createCapture(VIDEO, videoReady); // 捕捉視頻
  video.size(width, height); // 設置視頻尺寸
  video.hide(); // 隱藏視頻元素
  await init(); // 初始化檢測器
  
  img = loadImage('upload_fc4425b4ca387e988f6909176caae0ca.gif', imgLoaded); // 加載您的物件圖片
  
  stroke(255); // 設置筆觸顏色為白色
  strokeWeight(5); // 設置筆觸寬度為5
}

function imgLoaded() {
  console.log("Image loaded");
}

// 繪製每一幀
function draw() {
  image(video, 0, 0); // 繪製視頻到畫布上
  drawSkeleton(); // 繪製骨架
  drawOverlay(); // 繪製圖片和文字
  // 水平翻轉圖像
  cam = get();
  translate(cam.width, 0);
  scale(-1, 1);
  image(cam, 0, 0);
}

// 繪製骨架
function drawSkeleton() {
  for (let i = 0; i < poses.length; i++) {
    pose = poses[i];

    // 繪製肩膀到手腕的線條
    for (let j = 5; j < 9; j++) {
      if (pose.keypoints[j].score > 0.1 && pose.keypoints[j + 2].score > 0.1) {
        let partA = pose.keypoints[j];
        let partB = pose.keypoints[j + 2];
        line(partA.x, partA.y, partB.x, partB.y); // 繪製線條
      }
    }

    // 繪製肩膀到肩膀的線條
    let partA = pose.keypoints[5];
    let partB = pose.keypoints[6];
    if (partA.score > 0.1 && partB.score > 0.1) {
      line(partA.x, partA.y, partB.x, partB.y); // 繪製線條
    }

    // 繪製髖部到髖部的線條
    partA = pose.keypoints[11];
    partB = pose.keypoints[12];
    if (partA.score > 0.1 && partB.score > 0.1) {
      line(partA.x, partA.y, partB.x, partB.y); // 繪製線條
    }

    // 繪製肩膀到髖部的線條
    partA = pose.keypoints[5];
    partB = pose.keypoints[11];
    if (partA.score > 0.1 && partB.score > 0.1) {
      line(partA.x, partA.y, partB.x, partB.y); // 繪製線條
    }
    partA = pose.keypoints[6];
    partB = pose.keypoints[12];
    if (partA.score > 0.1 && partB.score > 0.1) {
      line(partA.x, partA.y, partB.x, partB.y); // 繪製線條
    }

    // 繪製髖部到腳部的線條
    for (let j = 11; j < 15; j++) {
      if (pose.keypoints[j].score > 0.1 && pose.keypoints[j + 2].score > 0.1) {
        partA = pose.keypoints[j];
        partB = pose.keypoints[j + 2];
        line(partA.x, partA.y, partB.x, partB.y); // 繪製線條
      }
    }
  }
}

// 繪製圖片和文字
function drawOverlay() {
  for (let i = 0; i < poses.length; i++) {
    pose = poses[i];

    // 在耳朵位置繪製並移動物件圖片
    let leftEar = pose.keypoints[3];
    let rightEar = pose.keypoints[4];
    if (leftEar.score > 0.1) {
      displayMovingImage(leftEar, img, 1); // 左耳
    }
    if (rightEar.score > 0.1) {
      displayMovingImage(rightEar, img, 1); // 右耳
    }

    // 在手腕位置繪製並移動物件圖片
    let leftWrist = pose.keypoints[9];
    let rightWrist = pose.keypoints[10];
    if (leftWrist.score > 0.1) {
      displayMovingImage(leftWrist, img, -1); // 左手腕
    }
    if (rightWrist.score > 0.1) {
      displayMovingImage(rightWrist, img, -1); // 右手腕
    }

    // 在頭頂上方顯示學號和姓名
    let nose = pose.keypoints[0];
    if (nose.score > 0.1) {
      fill(255, 0, 0); // 設置填充顏色為紅色
      textSize(20); // 設置文字大小為20
      textAlign(CENTER); // 設置文字對齊方式為中心對齊
      text(`${studentID} ${studentName}`, nose.x, nose.y - 50); // 顯示學號和姓名
    }
  }
}
