let video, bodypose, pose, keypoint, detector; // 定義變量
let poses = [];
let img; // 用於存放您的物件圖片
let studentID = "412730441"; // 學號
let studentName = "林揚紘"; // 姓名

let earOffsetX = 0; // 耳朵物件圖片的水平偏移
let earDirection = 1; // 耳朵物件圖片移動方向

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
  
  img = loadImage('upload_fc4425b4ca387e988f6909176caae0ca.gif', () => {
    console.log('Image loaded');
  }); // 加載您的物件圖片
  
  stroke(255); // 設置筆觸顏色為白色
  strokeWeight(5); // 設置筆觸寬度為5
}

// 繪製每一幀
function draw() {
  // 水平翻轉視頻
  cam = get();
  translate(cam.width, 0);
  scale(-1, 1);
  image(cam, 0, 0); // 繪製翻轉的視頻到畫布上

  drawSkeleton(); // 繪製骨架

  // 更新耳朵物件圖片的偏移
  earOffsetX += earDirection * 2;

  // 確保偏移在合理範圍內
  if (earOffsetX > 100 || earOffsetX < -100) {
    earDirection *= -1;
  }
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

    // 在耳朵位置繪製物件圖片
    let leftEar = pose.keypoints[3];
    let rightEar = pose.keypoints[4];
    if (leftEar.score > 0.1) {
      image(img, leftEar.x - 25 + earOffsetX, leftEar.y - 25, 50, 50); // 繪製圖片
    }
    if (rightEar.score > 0.1) {
      image(img, rightEar.x - 25 + earOffsetX, rightEar.y - 25, 50, 50); // 繪製圖片
    }

    // 在頭頂上方顯示學號和姓名
    let nose = pose.keypoints[0];
    if (nose.score > 0.1) {
      fill(255, 0, 0); // 設置填充顏色為紅色
      textSize(20); // 設置文字大小為20
      textAlign(CENTER); // 設置文字對齊方式為中心對齊
      text(`${studentID} ${studentName}`, nose.x, nose.y - 50); // 顯示學號和姓名
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

/* Points (view on left of screen = left part - when mirrored)
  0 nose
  1 left eye
  2 right eye
  3 left ear
  4 right ear
  5 left shoulder
  6 right shoulder
  7 left elbow
  8 right elbow
  9 left wrist
  10 right wrist
  11 left hip
  12 right hip
  13 left knee
  14 right knee
  15 left foot
  16 right foot
*/
