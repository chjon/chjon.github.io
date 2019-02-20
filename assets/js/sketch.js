let canvas;
let ctx;
let waitInterval = 10;

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

export function init(setup, draw) {
  window.onload = () => {
    canvas = document.getElementById('background-canvas');
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    ctx = canvas.getContext('2d');

    setup();
    setInterval(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      draw(ctx);
    }, waitInterval);
  }
}

// Graphics

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

export function ellipse(cx, cy, rx, ry){
  ctx.save();
  ctx.beginPath();

  ctx.translate(cx-rx, cy-ry);
  ctx.scale(rx, ry);
  ctx.arc(1, 1, 1, 0, 2 * Math.PI, false);

  ctx.restore();
  ctx.stroke();
}