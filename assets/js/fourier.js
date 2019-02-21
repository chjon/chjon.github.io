import * as maths from './math-utils.js';
import * as sketch from './sketch.js';

const WAVE_BEGIN = 400;
const WAVE_END = 1200;
const WAVE_POINTS = 400;
let window = { width: 0, height: 0 };
let counter = 0;
let CENTER;
const wave = [];
let outputSignal = [];

function generateStartFunction() {
  const fn = [];
  for (let i = -100; i < 100; i = i + 1) {
    fn.push(Math.abs(i));
  }

  return maths.scale(maths.normalize(fn), 200);
}

function drawEpicycles(center, vals) {
  class Circle {
    constructor(x, y, r, a) {
      this.x = x;
      this.y = y;
      this.r = r;
      this.a = a;
    }

    draw() {
      sketch.ellipse(this.x, this.y, this.r, this.r);
      sketch.polarLine(this.x, this.y, this.r, this.a);
    }
  }

  // Draw the circles
  const time = counter * maths.TWO_PI / vals.length;
  const endPoint = { x: center.x, y: center.y };

  for (let freq = 0; freq < vals.length; freq = freq + 1) {
    const val = vals[freq];
    if (!val.r) return;

    const circle = new Circle(
      endPoint.x,
      endPoint.y,
      val.r,
      val.a + freq * time,
    );

    circle.draw();
    endPoint.x = circle.x + circle.r * Math.cos(circle.a);
    endPoint.y = circle.y - circle.r * Math.sin(circle.a);
  };

  // Draw the line across
  sketch.line(endPoint.x, endPoint.y, WAVE_BEGIN, endPoint.y);
  
  // Add a point to the output
  wave.unshift(endPoint.y - CENTER.y);
  if (wave.length > WAVE_POINTS) {
    wave.pop();
  }
}

function drawWave(wave, x1, y1, x2, y2) {
  const axisLength = Math.hypot(x2 - x1, y2 - y1);
  const scaleFactor = axisLength / WAVE_POINTS;

  sketch.onAxis(x1, y1, x2, y2, () => {
    sketch.line(0, 0, axisLength, 0);

    for (let i = 0; i < wave.length - 1; i = i + 1) {
      sketch.line(scaleFactor * i, wave[i], scaleFactor * (i + 1), wave[i + 1]);
    }
  });
}

function setup() {
  sketch.setFrameInterval(20);
  window = { width: sketch.getWidth(), height: sketch.getHeight() };
  CENTER = { x: 200, y: window.height / 2 };

  outputSignal = maths.dft(generateStartFunction())
  .map(({ re, im }) => {
    return maths.toPolar(re, im);
  }).map(({ r, a }) => {
    return { r, a: a + Math.PI / 2 };
  });
}

function draw() {
  sketch.setStroke('#FFFFFF');
  sketch.setFill('#FFFFFF');

  drawEpicycles(CENTER, outputSignal);
  drawWave(wave, WAVE_BEGIN, CENTER.y , WAVE_END, CENTER.y);

  counter = (counter + 1) % outputSignal.length;
}

sketch.init(setup, draw);