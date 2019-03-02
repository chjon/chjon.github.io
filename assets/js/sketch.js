let canvas;
let ctx;
let waitInterval = 10;
let imageTintBuffer;
let imageTintBufferCtx;

// Getters

export function getWidth () {
  return canvas.width;
}

export function getHeight() {
  return canvas.height;
}

// Setters

export function setFrameInterval(newInterval) {
  waitInterval = newInterval;
}

// Initialization

export function init(
  setup,
  draw,
  canvasName = 'background-canvas',
  canvasWidth = innerWidth,
  canvasHeight = innerHeight
) {
  window.onload = () => {
    canvas = document.getElementById(canvasName);
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx = canvas.getContext('2d');
    imageTintBuffer = document.createElement('canvas');
    imageTintBufferCtx = imageTintBuffer.getContext('2d');
    imageTintBufferCtx.globalCompositeOperation = 'destination-atop';

    setup();
    setInterval(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      draw(ctx);
    }, waitInterval);
  }
}

// Graphics

export function pushState() {
  ctx.save();
}

export function popState() {
  ctx.restore();
}

export function translate(x, y) {
  ctx.translate(x, y);
}

export function rotate(a) {
  ctx.rotate(a);
}

export function onAxis(x1, y1, x2, y2, callback) {
  pushState();
  translate(x1, y1);
  rotate(Math.atan2(y2 - y1, x2 - x1));
  callback();
  popState();
}

export function setStroke(style) {
  ctx.strokeStyle = style;
}

export function setFill(style) {
  ctx.fillStyle = style;
}

export function line(x1, y1, x2, y2) {
  ctx.save();
  ctx.beginPath();

  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);

  ctx.closePath();
  ctx.restore();
  ctx.stroke();
}

export function polarLine(x, y, r, a, ccw = true) {
  line(x, y, x + r * Math.cos(a), (ccw) ? (y - r * Math.sin(a)) : (y + r * Math.sin(a)));
}

export function path(points) {
  if (!points) return;

  ctx.save();  
  ctx.beginPath();

  ctx.moveTo(points[0].x, points[1].y);
  points.forEach(point => {
    ctx.lineTo(point.x, point.y);
  });

  ctx.closePath();
  ctx.restore();
  ctx.stroke();
}

export function arc(x, y, r, sAngle, eAngle) {
  ctx.save();

  ctx.beginPath();
  ctx.arc(x, y, r, sAngle, eAngle);
  ctx.closePath();

  ctx.restore();
  ctx.stroke();
}

export function ellipse(cx, cy, rx, ry) {
  ctx.save();
  ctx.beginPath();

  ctx.translate(cx-rx, cy-ry);
  ctx.scale(rx, ry);
  ctx.arc(1, 1, 1, 0, 2 * Math.PI, false);

  ctx.restore();
  ctx.stroke();
}

export function rect(x1, y1, x2, y2) {
  if (x1 > x2) {
    const tmp = x1;
    x1 = x2;
    x2 = tmp;
  }

  if (y1 > y2) {
    const tmp = y1;
    y1 = y2;
    y2 = tmp;
  }

  ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
}

export function drawImage(img, x, y, width = img.width, height = img.height, color) {

  if (color) {  
    imageTintBufferCtx.width = width;
    imageTintBufferCtx.height = height;
    imageTintBufferCtx.globalCompositeOperation = 'source-over';
    imageTintBufferCtx.fillStyle = color;
    imageTintBufferCtx.fillRect(0, 0, width, height);
    imageTintBufferCtx.globalCompositeOperation = 'destination-atop';
    imageTintBufferCtx.drawImage(img, 0, 0, width, height);

    ctx.drawImage(imageTintBuffer, x, y);
  } else {
    ctx.drawImage(img, x, y, width, height);
  }
}