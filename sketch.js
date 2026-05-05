let capture;
let faceMesh;
let faces = [];
let options = { maxFaces: 1, refineLandmarks: true, flipHorizontal: false };

// --- 點位群組設定 ---
let lipGroup1 = [409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291];
let lipGroup2 = [76, 77, 90, 180, 85, 16, 315, 404, 320, 307, 306, 408, 304, 303, 302, 11, 72, 73, 74, 184];
let rightEyeOut = [247, 30, 29, 27, 28, 56, 190, 243, 112, 26, 22, 23, 24, 110]; 
let rightEyeIn = [246, 161, 160, 159, 158, 157, 173, 133, 155, 154, 153, 145, 144, 163, 7];
let leftEyeOut = [467, 260, 259, 257, 258, 286, 414, 463, 341, 256, 252, 253, 254, 339];
let leftEyeIn = [466, 388, 387, 386, 385, 384, 398, 362, 382, 381, 380, 374, 373, 390, 249];
let faceOutline = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109];

function preload() {
  faceMesh = ml5.faceMesh(options);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  capture = createCapture(VIDEO, (stream) => {
    faceMesh.detectStart(capture, gotFaces);
  });
  capture.size(640, 480);
  capture.hide();
}

function gotFaces(results) {
  faces = results;
}

function draw() {
  // 1. 底層背景顏色 e7c6ff
  background('#e7c6ff');

  // 顯示文字
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
  translate(x + imgW, y);
  scale(-1, 1);

  if (faces && faces.length > 0) {
    let face = faces[0];

    // --- 關鍵步驟：遮罩裁切 (Masking) ---
    // 先畫出裁切區域，讓影像只出現在臉部輪廓內
    push();
      drawMask(face, faceOutline, imgW, imgH); 
      drawingContext.clip(); // 之後畫的東西都會被限制在臉部輪廓內
      image(capture, 0, 0, imgW, imgH);
    pop();

    // --- 遮罩外背景：填滿 fdf0d5 ---
    // 我們反向思考：先在臉部位置畫影像，然後在外面補顏色
    // 但更簡單的做法是在 image 繪製前先用全畫布遮罩
    
    // 2. 繪製線條效果
    // 臉部輪廓：螢光藍色 (#00FFFF)，粗細 2
    stroke('#00FFFF');
    strokeWeight(2);
    noFill();
    drawLines(face, faceOutline, imgW, imgH);

    // 黑眼圈：灰色偏黑 (#333333)，粗細 15 (僅外圈)
    stroke(51, 51, 51); 
    strokeWeight(15);
    drawLines(face, rightEyeOut, imgW, imgH);
    drawLines(face, leftEyeOut, imgW, imgH);

    // 其他紅線部分：嘴唇與內眼圈，粗細 1
    stroke(255, 0, 0);
    strokeWeight(1);
    drawLines(face, lipGroup1, imgW, imgH);
    drawLines(face, lipGroup2, imgW, imgH);
    drawLines(face, rightEyeIn, imgW, imgH);
    drawLines(face, leftEyeIn, imgW, imgH);

  } else {
    // 沒偵測到臉時，顯示一個空白區塊或提示
    fill('#fdf0d5');
    rect(0, 0, imgW, imgH);
  }
  pop();

  // 3. 在影像區塊之外覆蓋 fdf0d5 (達成擷取影像只出現臉部效果)
  // 這部分是在全域座標處理，確保除了中間臉部，其他都是 fdf0d5
  noStroke();
  fill('#fdf0d5');
  // 這裡我們畫四個大矩形遮住影像周邊
  rect(0, 0, width, y); // 上
  rect(0, y + imgH, width, height - (y + imgH)); // 下
  rect(0, y, x, imgH); // 左
  rect(x + imgW, y, width - (x + imgW), imgH); // 右
}

// 專門用來裁切影像的函式
function drawMask(faceData, indices, w, h) {
  beginShape();
  for (let i = 0; i < indices.length; i++) {
    let pt = faceData.keypoints[indices[i]];
    if (pt) {
      let px = map(pt.x, 0, capture.width, 0, w);
      let py = map(pt.y, 0, capture.height, 0, h);
      vertex(px, py);
    }
  }
  endShape(CLOSE);
}

function drawLines(faceData, indices, w, h) {
  if (!faceData || !faceData.keypoints) return;
  beginShape();
  for (let i = 0; i < indices.length; i++) {
    let pt = faceData.keypoints[indices[i]];
    if (pt) {
      let px = map(pt.x, 0, capture.width, 0, w);
      let py = map(pt.y, 0, capture.height, 0, h);
      vertex(px, py);
    }
  }
  endShape(CLOSE);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}