let capture;
let faceMesh;
let faces = [];
let options = { maxFaces: 1, refineLandmarks: false, flipHorizontal: false };

// 嘴唇節點編號順序
let lipIndices = [409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291];

function preload() {
  // 載入 ml5 faceMesh 模型
  faceMesh = ml5.faceMesh(options);
}

function setup() {
  // 1. 建立全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  
  // 2. 初始化攝影機
  capture = createCapture(VIDEO);
  capture.size(640, 480);
  capture.hide();
  
  // 3. 開始偵測臉部
  faceMesh.detectStart(capture, gotFaces);
}

function gotFaces(results) {
  faces = results;
}

function draw() {
  // 背景顏色 e7c6ff
  background('#e7c6ff');

  // 4. 顯示學號文字 (置中在畫布上方)
  push();
  fill(0);
  noStroke();
  let txtSize = constrain(width * 0.05, 20, 32); // 根據螢幕大小動態調整字級
  textSize(txtSize);
  textAlign(CENTER, CENTER);
  text("教科414730142", width / 2, height * 0.1);
  pop();

  // 5. 計算影像顯示大小 (畫布寬高的 50%)
  let imgW = width * 0.5;
  let imgH = height * 0.5;

  push();
  // 將座標移至畫布中心
  translate(width / 2, height / 2);
  
  // --- 影像與連線的座標同步區 ---
  push();
    // 左右顛倒處理
    scale(-1, 1);
    
    // 繪製擷取影像
    imageMode(CENTER);
    image(capture, 0, 0, imgW, imgH);

    // 6. 繪製紅線連線 (嘴唇部分)
    if (faces.length > 0) {
      let face = faces[0];
      stroke(255, 0, 0); // 紅色線條
      strokeWeight(15);   // 線條粗細 15
      noFill();
      
      beginShape();
      for (let i = 0; i < lipIndices.length; i++) {
        let index = lipIndices[i];
        let keypoint = face.keypoints[index];

        if (keypoint) {
          // 關鍵：將偵測到的點映射到 image 顯示的相對區域內
          // 因為座標系已經 scale(-1, 1) 且在中心，直接從 -imgW/2 到 imgW/2 映射
          let x = map(keypoint.x, 0, capture.width, -imgW / 2, imgW / 2);
          let y = map(keypoint.y, 0, capture.height, -imgH / 2, imgH / 2);
          vertex(x, y);
        }
      }
      endShape(CLOSE);
    }
  pop(); 
  pop();
}

// 視窗大小改變時自動調整畫布與顯示
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}