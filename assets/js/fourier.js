import * as maths from './math-utils.js';
import * as sketch from './sketch.js';

let window = { width: 0, height: 0 };
let time = 0;
let center;
let waveBegin = 400;
let waveScale = 3;
const wave = [];

let inputSignal = [];
let outputSignal;

function generateStartFunction() {
  for (let i = -200; i < 200; i = i + 1) {
    inputSignal.push(i * i);
  }

  inputSignal = maths.normalize(inputSignal);
  inputSignal = maths.scale(inputSignal, 200);
}

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

function drawEpicycles(vals) {
  // Draw the circles
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
  sketch.line(endPoint.x, endPoint.y, waveBegin, endPoint.y);
  
  // Add a point to the output
  wave.unshift(endPoint.y);
  if (waveBegin + waveScale * wave.length > window.width) {
    wave.pop();
  }
}

function drawWave() {
  for (let i = 0; i < wave.length - 1; i = i + 1) {
    sketch.line(waveBegin + waveScale * i, wave[i], waveBegin + waveScale * (i + 1), wave[i + 1]);
  }
}

function setup() {
  window = { width: sketch.getWidth(), height: sketch.getHeight() };
  center = { x: 200, y: window.height / 2 };

  generateStartFunction();
  outputSignal = maths.dft(inputSignal);
  outputSignal = outputSignal.map(({ re, im }) => {
    return maths.toPolar(re, im);
  });
  outputSignal = outputSignal.map(({ r, a }) => {
    return { r, a: a + Math.PI / 2 };
  });
  sketch.setFrameInterval(20);
}

function draw() {
  sketch.setStroke('#FFFFFF');
  sketch.setFill('#FFFFFF');

  drawEpicycles(outputSignal);
  drawWave();

  time += maths.TWO_PI / inputSignal.length;
}

sketch.init(setup, draw);