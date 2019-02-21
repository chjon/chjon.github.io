import * as maths from './math-utils.js';
import * as sketch from './sketch.js';

const WAVE_POINTS = 400;
const SIGNAL_LENGTH = 200;
let window = { width: 0, height: 0 };
let counter = 0;
let inputSignal = { x: [], y: [] };
let outputSignal = { x: [], y: [] };

function generateStartFunction() {
  const fn = { x: [], y:[] };
  for (let i = 0; i < SIGNAL_LENGTH; i = i + 1) {
    fn.x.push( 100 * Math.cos(i * maths.TWO_PI / SIGNAL_LENGTH));
    fn.y.push(-100 * Math.sin(i * maths.TWO_PI / SIGNAL_LENGTH));
  }

  fn.x = maths.shiftCenter(fn.x);
  fn.y = maths.shiftCenter(fn.y);

  return fn;
}

function drawEpicycles(vals, centerX, centerY, isXAxis) {
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
  const endPoint = { x: centerX, y: centerY };

  for (let freq = 0; freq < vals.length; freq = freq + 1) {
    const val = vals[freq];
    if (!val.r) continue;

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

  // Draw the line from the endpoint
  if (isXAxis) {
    sketch.line(endPoint.x, endPoint.y, window.width, endPoint.y);
  } else {
    sketch.line(endPoint.x, endPoint.y, endPoint.x, window.height);
  }
  
  // Add a point to the output
  return endPoint;
}

function drawWave(wave, x1, y1, x2, y2) {
  const axisLength = Math.hypot(x2 - x1, y2 - y1);
  const scaleFactor = axisLength / WAVE_POINTS;

  sketch.onAxis(x1, y1, x2, y2, () => {
    for (let i = 0; i < wave.length - 1; i = i + 1) {
      sketch.line(scaleFactor * i, wave[i], scaleFactor * (i + 1), wave[i + 1]);
    }
  });
}

function setup() {
  sketch.setFrameInterval(20);
  window = { width: sketch.getWidth(), height: sketch.getHeight() };

  inputSignal = generateStartFunction();
  outputSignal = {
    x: maths.dft(inputSignal.x).map(({ re, im }) => {
      const { r, a } = maths.toPolar(re, im);
      return { r, a };
    }),
    y: maths.dft(inputSignal.y).map(({ re, im }) => {
      const { r, a } = maths.toPolar(re, im);
      return { r, a: a + Math.PI / 2 };
    }),
  }
}

function draw() {
  sketch.setStroke('#FFFFFF');
  sketch.setFill('#FFFFFF');

  const pointX = drawEpicycles(outputSignal.y, 100, window.height / 2 + 100, true).x;
  const pointY = drawEpicycles(outputSignal.x, window.width / 2, 100, false).y;

  counter = (counter + 1) % SIGNAL_LENGTH;
}

sketch.init(setup, draw);