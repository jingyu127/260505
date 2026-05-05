let capture;

function setup() {
  // 建立全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  
  // 初始化攝影機擷取
  capture = createCapture(VIDEO);
  capture.size(640, 480); // 設定擷取解析度
  capture.hide(); // 隱藏預設產生的 HTML 影片元件，只在畫布上繪製
}

function draw() {
  // 設定背景顏色為 e7c6ff
  background('#e7c6ff');
  
  // 計算顯示影像的寬度與高度（畫布寬高的 50%）
  let imgW = width * 0.5;
  let imgH = height * 0.5;
  
  // 計算影像在中心點的位置
  let x = width / 2;
  let y = height / 2;
  
  push();
  // 將座標系統移動到畫布中心
  translate(x, y);
  
  // 處理左右顛倒（水平鏡像）：將 X 軸縮放比例設為 -1
  scale(-1, 1);
  
  // 繪製影像，由於使用了 translate 和 scale，影像位置需設為 (-imgW/2, -imgH/2)
  // 這樣影像才會準確地以中心點對齊畫布中心
  imageMode(CENTER);
  image(capture, 0, 0, imgW, imgH);
  pop();
}

// 當視窗大小改變時，自動調整畫布大小
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}