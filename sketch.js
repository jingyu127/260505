let capture;
let faceMesh;
let faces = [];
let options = { maxFaces: 1, refineLandmarks: false, flipHorizontal: false };

let lipIndices = [409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291];

function preload() {
  faceMesh = ml5.faceMesh(options);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  // 強制設定一個常用的比例，減少手機端的裁切誤差
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

  // 1. 文字顯示
  push();
  fill(0);
  noStroke();
  textSize(min(width, height) * 0.05);
  textAlign(CENTER, CENTER);
  text("教科414730142", width / 2, height * 0.1);
  pop();

  // 2. 核心對位邏輯
  let imgW = width * 0.5;
  let imgH = height * 0.5;

  push();
  translate(width / 2, height / 2); // 移到畫布中心

  // 先縮放到你要的大小 (50%)，然後進入「攝影機座標系」
  // 這樣無論攝影機解析度是多少，紅線跟影像都會等比例縮放
  let finalScale = min(imgW / capture.width, imgH / capture.height);
  
  push();
    scale(finalScale); // 統一縮放倍率
    scale(-1, 1);      // 左右翻轉
    
    imageMode(CENTER);
    image(capture, 0, 0); // 在 0,0 繪製，因為外層已經 scale 了

    // 3. 繪製紅線
    if (faces.length > 0) {
      let face = faces[0];
      stroke(255, 0, 0);
      // 因為外層 scale 了，所以線條粗細要反向乘回來，否則會變很細
      strokeWeight(15 / finalScale); 
      noFill();
      
      beginShape();
      for (let i = 0; i < lipIndices.length; i++) {
        let index = lipIndices[i];
        let pt = face.keypoints[index];

        if (pt) {
          // 直接使用原始座標，減掉寬高的一半來對齊 CENTER 模式
          vertex(pt.x - capture.width / 2, pt.y - capture.height / 2);
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