let capture;
let faceMesh;
let faces = [];
let options = { maxFaces: 1, refineLandmarks: false, flipHorizontal: false };

let lipIndices = [409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291];

function preload() {
  faceMesh = ml5.faceMesh(options);
}

function setup() {
  // 使用 windowWidth, windowHeight 建立全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  
  // 設定適合手機的擷取設定
  capture = createCapture(VIDEO);
  // 使用自動適應寬高，避免在手機上變形
  capture.size(VIDEO.width, VIDEO.height); 
  capture.hide();
  
  faceMesh.detectStart(capture, gotFaces);
}

function gotFaces(results) {
  faces = results;
}

function draw() {
  background('#e7c6ff');

  // 文字顯示：確保在不同螢幕尺寸下都能居中
  push();
  fill(0);
  noStroke();
  textSize(width * 0.05); // 根據螢幕寬度動態調整字體大小
  textAlign(CENTER, CENTER);
  text("教科414730142", width / 2, height * 0.1);
  pop();

  // 計算顯示影像的寬高（畫布寬高的 50%）
  let imgW = width * 0.5;
  let imgH = height * 0.5;

  push();
  translate(width / 2, height / 2);

  // 1. 繪製攝影機影像（水平翻轉）
  push();
  scale(-1, 1);
  imageMode(CENTER);
  // 使用顯示寬高繪製
  image(capture, 0, 0, imgW, imgH); 
  pop();

  // 2. 繪製臉部連線
  if (faces.length > 0) {
    let face = faces[0];
    stroke(255, 0, 0);
    strokeWeight(15);
    noFill();
    
    beginShape();
    for (let i = 0; i < lipIndices.length; i++) {
      let index = lipIndices[i];
      let keypoint = face.keypoints[index];

      if (keypoint) {
        // 修正映射邏輯：使用 capture.width/height 作為原始參考基準
        // 這樣無論手機攝影機解析度為何，都能正確對應到顯示區塊
        let mappedX = map(keypoint.x, 0, capture.width, imgW / 2, -imgW / 2);
        let mappedY = map(keypoint.y, 0, capture.height, -imgH / 2, imgH / 2);
        
        vertex(mappedX, mappedY);
      }
    }
    endShape(CLOSE);
  }
  pop();
}

// 修正手機旋轉或視窗改變時的跑版
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}