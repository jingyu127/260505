let capture;
let faceMesh;
let faces = [];
let options = { maxFaces: 1, refineLandmarks: false, flipHorizontal: false };

// 你指定的節點編號順序
let lipIndices = [409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291];

function preload() {
  // 載入 faceMesh 模型
  faceMesh = ml5.faceMesh(options);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  capture = createCapture(VIDEO);
  capture.size(640, 480);
  capture.hide();
  
  // 開始偵測臉部
  faceMesh.detectStart(capture, gotFaces);
}

function gotFaces(results) {
  faces = results;
}

function draw() {
  background('#e7c6ff');
  
  // 顯示文字
  fill(0);
  noStroke();
  textSize(32);
  textAlign(CENTER, CENTER);
  text("教科414730142", width / 2, height * 0.1);

  let imgW = width * 0.5;
  let imgH = height * 0.5;
  
  push();
  translate(width / 2, height / 2);
  
  // 先繪製攝影機影像（水平翻轉）
  push();
  scale(-1, 1);
  imageMode(CENTER);
  image(capture, 0, 0, imgW, imgH);
  pop();

  // 繪製臉部連線
  if (faces.length > 0) {
    let face = faces[0];
    
    stroke(255, 0, 0); // 紅色線條
    strokeWeight(15);   // 線條粗細 15
    noFill();
    
    beginShape();
    for (let i = 0; i < lipIndices.length; i++) {
      let index = lipIndices[i];
      let keypoint = face.keypoints[index];
      
      // 座標轉換邏輯：
      // 1. 將原始影像座標 (0~640) 映射到顯示寬高 (imgW, imgH)
      // 2. 考慮到畫布中心 translate 以及影像的 scale(-1, 1)
      // 3. 最終計算出在畫布上的正確位置
      
      let mappedX = map(keypoint.x, 0, capture.width, imgW/2, -imgW/2);
      let mappedY = map(keypoint.y, 0, capture.height, -imgH/2, imgH/2);
      
      vertex(mappedX, mappedY);
    }
    // 如果要閉合線條可加入 endShape(CLOSE)，若只需串接則用 endShape()
    endShape(CLOSE); 
  }
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}