let capture;
let faceMesh;
let faces = [];
let options = { maxFaces: 1, refineLandmarks: false, flipHorizontal: false };

// 嘴唇節點編號
let lipIndices = [409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291];

function preload() {
  faceMesh = ml5.faceMesh(options);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  capture = createCapture(VIDEO);
  capture.size(640, 480);
  capture.hide();
  faceMesh.detectStart(capture, gotFaces);
}

function gotFaces(results) {
  faces = results;
}

function draw() {
  background('#e7c6ff');

  // 1. 顯示學號文字
  push();
  fill(0);
  noStroke();
  textSize(min(width, height) * 0.05);
  textAlign(CENTER, CENTER);
  text("教科414730142", width / 2, height * 0.1);
  pop();

  // 2. 計算影像顯示大小
  let imgW = width * 0.5;
  let imgH = height * 0.5;

  push();
  translate(width / 2, height / 2); // 移到畫布中心

  // --- 關鍵：同步縮放與鏡像 ---
  push();
    scale(-1, 1); // 左右翻轉
    
    // 繪製影像
    imageMode(CENTER);
    image(capture, 0, 0, imgW, imgH);

    // 3. 繪製紅線 (精準對位邏輯)
    if (faces.length > 0) {
      let face = faces[0];
      stroke(255, 0, 0);
      strokeWeight(15);
      noFill();
      
      // 計算攝影機座標到顯示畫面的縮放比例
      let scaleX = imgW / capture.width;
      let scaleY = imgH / capture.height;

      beginShape();
      for (let i = 0; i < lipIndices.length; i++) {
        let index = lipIndices[i];
        let keypoint = face.keypoints[index];

        if (keypoint) {
          // 這裡的座標計算：
          // 先將 keypoint 轉換成以影像中心為原點的座標 (keypoint.x - capture.width/2)
          // 再乘上縮放比例 (scaleX)
          let x = (keypoint.x - capture.width / 2) * scaleX;
          let y = (keypoint.y - capture.height / 2) * scaleY;
          vertex(x, y);
        }
      }
      endShape(CLOSE);
    }
  pop();
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}