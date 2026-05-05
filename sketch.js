let capture;
let faceMesh;
let faces = [];
let options = { maxFaces: 1, refineLandmarks: true, flipHorizontal: false };

// --- 修正後的點位群組 ---
let lipGroup1 = [409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291];
let lipGroup2 = [76, 77, 90, 180, 85, 16, 315, 404, 320, 307, 306, 408, 304, 303, 302, 11, 72, 73, 74, 184];

// 右眼 (外圈以 247 為主, 內圈以 246 為主)
let rightEyeOut = [247, 30, 29, 27, 28, 56, 190, 243, 112, 26, 22, 23, 24, 110]; 
let rightEyeIn = [246, 161, 160, 159, 158, 157, 173, 133, 155, 154, 153, 145, 144, 163, 7];

// 左眼 (對稱點位)
let leftEyeOut = [467, 260, 259, 257, 258, 286, 414, 463, 341, 256, 252, 253, 254, 339];
let leftEyeIn = [466, 388, 387, 386, 385, 384, 398, 362, 382, 381, 380, 374, 373, 390, 249];

// 臉部外輪廓
let faceOutline = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109];

function preload() {
  faceMesh = ml5.faceMesh(options);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  capture = createCapture(VIDEO, (stream) => {
    // 確保攝影機啟動後才開始偵測
    faceMesh.detectStart(capture, gotFaces);
  });
  capture.size(640, 480);
  capture.hide();
}

function gotFaces(results) {
  faces = results;
}

function draw() {
  background('#e7c6ff');

  // 文字
  fill(0);
  noStroke();
  textSize(32);
  textAlign(CENTER, CENTER);
  text("教科414730142", width / 2, 50);

  let imgW = width * 0.5;
  let imgH = height * 0.5;
  let x = (width - imgW) / 2;
  let y = (height - imgH) / 2;

  push();
  // 移動座標到置中位置並翻轉
  translate(x + imgW, y);
  scale(-1, 1);
  image(capture, 0, 0, imgW, imgH);

  if (faces && faces.length > 0) {
    let face = faces[0];
    
    // 繪製紅色部分 (嘴唇、眼睛)
    stroke(255, 0, 0);
    strokeWeight(1);
    noFill();
    
    drawLines(face, lipGroup1, imgW, imgH);
    drawLines(face, lipGroup2, imgW, imgH);
    drawLines(face, rightEyeOut, imgW, imgH);
    drawLines(face, rightEyeIn, imgW, imgH);
    drawLines(face, leftEyeOut, imgW, imgH);
    drawLines(face, leftEyeIn, imgW, imgH);

    // 繪製藍色部分 (臉部輪廓)
    stroke(0, 0, 255);
    strokeWeight(2);
    drawLines(face, faceOutline, imgW, imgH);
  }
  pop();
}

function drawLines(faceData, indices, w, h) {
  if (!faceData || !faceData.keypoints) return;
  
  beginShape();
  for (let i = 0; i < indices.length; i++) {
    let index = indices[i];
    let pt = faceData.keypoints[index];
    
    if (pt) {
      // 修正：ml5 v1.2 的座標可能直接在 .x .y，確保映射正確
      let px = map(pt.x, 0, capture.width, 0, w);
      let py = map(pt.y, 0, capture.height, 0, h);
      vertex(px, py);
    }
  }
  endShape(CLOSE); // 確保每一組都閉合
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}