import * as maths from './math-utils.js';
import * as dom from './dom-utils.js';
import * as sketch from './sketch.js';

const initialData = 'Ct5_Cc5yC75yBb60B75-Aw60AO609r679Z659U5r9U5c9U5R9U5B9L4-984x8r4w8q598o5N8p5Z8o5r8q688c648N648961875j845J814z824g814T8244813k7-3U833G882-8P2x8k2w8m368n3J8n3V8o3t8s4G974J9Q4H9Q439Q3m9Q3V9N3A9O309M2r9g2t9y2w9w3B9x3T9x3l9z429_4OA04m9-4zA15CA15XA55mA560Ah5-Ae5dAe5LAf56Ad4kAd4QAc4BAa3yAY3gAY3JAY37AZ2rAm2rA_2qBF2qBG38BI3PBI3iBI3wBI47BJ4OBJ4fBJ4vBI5DBK5YBK5oBM5-Bq60CN5zCr5uC-5fD15MD353D94lD94RD84AD93vD73cD63ECx2oCh2HCP1wBz1aBS1MB11DAX19A4109P0-900-8W137s1M7J1g70216n2U6c336U3W6O3u6R4K6N4i6M506P5T6U5x6e6I6m6W6z6x7I7K7Y7Z7r7j8F7u8g8196829g82A587AT87An84BE7_Bi7lC57KCJ71Cb6iCm6M';

let pointDensity = 0.08;
let window = { width: 0, height: 0 };
let counter = 0;
let inputSignal = { x: [], y: [] };
let outputSignal = { x: [], y: [] };
let wave;

const B64LUT = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_-';

function fromBase64(val) {
  return B64LUT.indexOf(val.charAt(0)) * 64 + B64LUT.indexOf(val.charAt(1))
}

function uriDecode(data) {
  const decoded = [];
  for (let i = 0; i < data.length; i = i + 4) {
    decoded.push({
      x: fromBase64(data.charAt(i + 0) + data.charAt(i + 1)),
      y: fromBase64(data.charAt(i + 2) + data.charAt(i + 3)),
    });
  }
  return JSON.stringify(decoded);
}

function scaleAndShift(data, width, height, shiftX, shiftY) {
  const limits = data.reduce((limits, { x, y }) => {
    limits.minX = Math.min(limits.minX, x);
    limits.maxX = Math.max(limits.maxX, x);
    limits.minY = Math.min(limits.minY, y);
    limits.maxY = Math.max(limits.maxY, y);
    return limits;
  }, { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity });
  const range = {
    x: limits.maxX - limits.minX,
    y: limits.maxY - limits.minY,
  }
  const scaleFactors = {
    x: width ? width / range.x : 0,
    y: height ? height / range.y : 0,
  }
  const scaleFactor = (range.x * scaleFactors.y <= width) ? scaleFactors.y : scaleFactors.x;
  const offset = {
    x: (width - (limits.maxX - limits.minX) * scaleFactor) / 2,
    y: (height - (limits.maxY - limits.minY) * scaleFactor) / 2,
  }
  return data.map(({ x, y }) => {
    const scaled = {
      x: (x - limits.minX) * scaleFactor,
      y: (y - limits.minY) * scaleFactor,
    };
    const centered = {
      x: scaled.x + offset.x,
      y: scaled.y + offset.y,
    };
    const shifted = {
      x: centered.x + shiftX,
      y: centered.y + shiftY,
    }
    return shifted;
  });
}

function loadStartFunction(inputString) {
  const rawData = JSON.parse(inputString).map(({ x, y }) => {
    return { x, y: -y };
  });
  let points = scaleAndShift(
    rawData,
    0.5 * window.width,
    0.5 * window.height,
    0.1 * window.width,
    0.1 * window.height,
  );
  
  let totalDist = 0;
  for (let i = 0; i < points.length - 1; i = i + 1) {
    totalDist += maths.dist(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y);
  }
  totalDist += maths.dist(points[points.length - 1].x, points[points.length - 1].y, points[0].x, points[0].y);
  const numPoints = Math.floor(totalDist * pointDensity);

  points = maths.interpolate(points, numPoints);
  points.forEach((point) => {
    inputSignal.x.push(point.x);
    inputSignal.y.push(point.y);
  });

  inputSignal.x = maths.shiftCenter(inputSignal.x);
  inputSignal.y = maths.shiftCenter(inputSignal.y);

  return inputSignal;
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

function reset() {
  const data = document.getElementById('data-input').value;
  pointDensity = document.getElementById('density').value;

  counter = 0;
  wave = [];
  inputSignal = { x: [], y: [] };
  inputSignal = loadStartFunction(uriDecode(data));
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

function setup() {
  sketch.setFrameInterval(20);
  window = { width: sketch.getWidth(), height: sketch.getHeight() };
  const { query } = dom.decodeURI();
  const message = query.m;
  const density = query.d;
  document.getElementById('data-input').value = message || initialData;
  dom.tieButtonToHandler('reset', reset);
  dom.setPropertiesById('density', {
    value: density ? parseInt(density) * 0.01 : 0.16,
    step: 0.01,
    min: 0.02,
    max: 0.2,
  });
  reset();
}

function draw() {
  sketch.setStroke('rgba(255, 255, 255, 0.1)');
  const pointY = drawEpicycles(outputSignal.y, window.width * 0.1, window.height * 0.5, true).y;
  const pointX = drawEpicycles(outputSignal.x, window.width * 0.5, window.height * 0.1, false).x;

  sketch.setStroke('#FFFFFF');
  wave[counter] = wave[counter] || { x: pointX, y: pointY };
  for (let i = 0; i < counter; i = i + 1) {
    sketch.line(wave[i].x, wave[i].y, wave[i + 1].x, wave[i + 1].y);
  }

  counter = (counter + 1) % outputSignal.x.length;
}

sketch.init(setup, draw);