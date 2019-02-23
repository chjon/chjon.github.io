import * as maths from './math-utils.js';
import * as sketch from './sketch.js';

let SIGNAL_LENGTH;
let window = { width: 0, height: 0 };
let counter = 0;
let inputSignal = { x: [], y: [] };
let outputSignal = { x: [], y: [] };
let wave = [];

function loadStartFunction() {
  let points = JSON.parse('[{"x":514,"y":190},{"x":545,"y":185},{"x":564,"y":185},{"x":566,"y":201},{"x":565,"y":215},{"x":565,"y":235},{"x":566,"y":249},{"x":567,"y":268},{"x":567,"y":284},{"x":569,"y":306},{"x":569,"y":325},{"x":570,"y":346},{"x":570,"y":359},{"x":574,"y":377},{"x":572,"y":397},{"x":573,"y":423},{"x":573,"y":443},{"x":541,"y":442},{"x":484,"y":436},{"x":420,"y":439},{"x":373,"y":435},{"x":351,"y":435},{"x":332,"y":434},{"x":329,"y":411},{"x":329,"y":388},{"x":321,"y":369},{"x":306,"y":369},{"x":287,"y":369},{"x":268,"y":367},{"x":267,"y":383},{"x":266,"y":396},{"x":264,"y":417},{"x":259,"y":434},{"x":241,"y":432},{"x":218,"y":432},{"x":201,"y":429},{"x":199,"y":409},{"x":202,"y":395},{"x":204,"y":375},{"x":201,"y":356},{"x":200,"y":340},{"x":199,"y":317},{"x":200,"y":296},{"x":196,"y":266},{"x":200,"y":246},{"x":195,"y":220},{"x":197,"y":198},{"x":224,"y":193},{"x":254,"y":193},{"x":259,"y":224},{"x":260,"y":240},{"x":262,"y":270},{"x":264,"y":306},{"x":287,"y":313},{"x":305,"y":313},{"x":318,"y":311},{"x":321,"y":287},{"x":321,"y":267},{"x":320,"y":256},{"x":320,"y":240},{"x":319,"y":225},{"x":319,"y":203},{"x":321,"y":192},{"x":344,"y":190},{"x":369,"y":192},{"x":384,"y":196},{"x":383,"y":216},{"x":383,"y":228},{"x":383,"y":253},{"x":385,"y":265},{"x":385,"y":287},{"x":385,"y":299},{"x":385,"y":310},{"x":385,"y":329},{"x":385,"y":357},{"x":384,"y":380},{"x":383,"y":394},{"x":384,"y":415},{"x":383,"y":435},{"x":454,"y":437},{"x":521,"y":437},{"x":520,"y":415},{"x":520,"y":393},{"x":521,"y":381},{"x":520,"y":357},{"x":520,"y":339},{"x":520,"y":312},{"x":520,"y":298},{"x":520,"y":281},{"x":520,"y":257},{"x":515,"y":240},{"x":514,"y":215}]');
  points = maths.interpolate(points, 500);
  SIGNAL_LENGTH = points.length;
  points.forEach((point) => {
    inputSignal.x.push(point.x / 2);
    inputSignal.y.push(point.y / 2);
  });

  inputSignal.x = maths.shiftCenter(inputSignal.x);
  inputSignal.y = maths.scale(maths.shiftCenter(inputSignal.y), -1);

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

function setup() {
  sketch.setFrameInterval(20);
  window = { width: sketch.getWidth(), height: sketch.getHeight() };

  inputSignal = loadStartFunction();
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

  const pointY = drawEpicycles(outputSignal.y, 100, window.height / 2 + 100, true).y;
  const pointX = drawEpicycles(outputSignal.x, window.width / 2, 100, false).x;
  wave[counter] = { x: pointX, y: pointY };
  for (let i = 0; i < wave.length - 1; i = i + 1) {
    sketch.line(wave[i].x, wave[i].y, wave[i + 1].x, wave[i + 1].y);
  }

  counter = (counter + 1) % SIGNAL_LENGTH;
  if (!counter) {
    wave = [];
  }
}

sketch.init(setup, draw);