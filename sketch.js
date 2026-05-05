let capture;

function setup() {
  // 建立全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  
  // 初始化攝影機擷取
  capture = createCapture(VIDEO);
  capture.size(640, 480);
  capture.hide();
}

function draw() {
  // 設定背景顏色為 e7c6ff
  background('#e7c6ff');
  
  // 1. 顯示文字：放在影像繪製之前，確保它在背景上
  fill(0); // 設定文字顏色為黑色（可依需求修改）
  textSize(32); // 設定文字大小
  textAlign(CENTER, CENTER); // 水平與垂直皆置中
  
  // 計算顯示位置：畫布水平置中，高度放在影像上方（約畫布高度的 20% 處）
  text("教科414730142", width / 2, height * 0.2);
  
  // 2. 顯示影像
  let imgW = width * 0.5;
  let imgH = height * 0.5;
  let x = width / 2;
  let y = height / 2;
  
  push();
  translate(x, y);
  scale(-1, 1); // 左右顛倒處理
  imageMode(CENTER);
  image(capture, 0, 0, imgW, imgH);
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}