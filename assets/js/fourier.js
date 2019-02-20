import * as sketch from './sketch.js';

const TAU = 2 * Math.PI;
let window = { width: 0, height: 0 };
let time = 0;
let center;
let waveBegin = 400;
let waveScale = 3;
const wave = [];

const inputSignal = [];
let polarSignal;

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

function sin(x) {
  return 150 * Math.sin(x * TAU / 100);
}

function generateStartFunction() {
  for (let i = 0; i < 100; i = i + 1) {
    inputSignal.push(sin(1.5 * i));
  }
}

// Perform a discrete Fourier transform
function dft(x = []) {
  const X = [];
  const N = x.length;
  const phi_0 = TAU / N;
  for (let k = 0; k < N; k = k + 1) {
    let re = 0, im = 0;
    const phi_1 = phi_0 * k;
    for (let n = 0; n < N; n = n + 1) {
      const phi_2 = phi_1 * n;
      re += x[n] * Math.cos(phi_2);
      im -= x[n] * Math.sin(phi_2);
    }

    re /= N;
    im /= N;

    X[k] = { freq: k, amp: Math.hypot(re, im), phase: Math.atan2(re, im) };
  }

  return X;
}

function drawEpicycles(vals) {
  // Draw the circles
  const endPoint = { x: center.x, y: center.y };

  vals.forEach((val) => {
    if (!val.amp) return;

    const circle = new Circle(
      endPoint.x,
      endPoint.y,
      val.amp,
      val.phase + val.freq * time,
    );

    if (circle.x == center.x && circle.y == center.y) {
      sketch.setStroke('#FF0000');
      circle.draw();
      sketch.setStroke('#FFFFFF');
    } else {
      circle.draw();
    }

    endPoint.x = circle.x + circle.r * Math.cos(circle.a);
    endPoint.y = circle.y - circle.r * Math.sin(circle.a);
  });

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
  polarSignal = dft(inputSignal);
  console.log(polarSignal);
  sketch.setFrameInterval(20);
}

function draw() {
  sketch.setStroke('#FFFFFF');
  sketch.setFill('#FFFFFF');

  drawEpicycles(polarSignal);
  drawWave();

  time += TAU / inputSignal.length;
}

sketch.init(setup, draw);