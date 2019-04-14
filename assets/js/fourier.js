import * as maths from './math-utils.js';
import * as dom from './dom-utils.js';
import * as sketch from './sketch.js';

const initialData = '[{"x":823,"y":382},{"x":806,"y":380},{"x":775,"y":380},{"x":741,"y":384},{"x":711,"y":383},{"x":698,"y":384},{"x":664,"y":384},{"x":629,"y":391},{"x":611,"y":389},{"x":606,"y":373},{"x":606,"y":358},{"x":606,"y":347},{"x":606,"y":331},{"x":597,"y":319},{"x":584,"y":315},{"x":565,"y":314},{"x":564,"y":329},{"x":562,"y":343},{"x":563,"y":355},{"x":562,"y":373},{"x":564,"y":392},{"x":550,"y":388},{"x":535,"y":388},{"x":521,"y":385},{"x":519,"y":365},{"x":516,"y":339},{"x":513,"y":317},{"x":514,"y":298},{"x":513,"y":285},{"x":514,"y":260},{"x":513,"y":238},{"x":511,"y":222},{"x":515,"y":208},{"x":520,"y":191},{"x":537,"y":187},{"x":558,"y":186},{"x":560,"y":198},{"x":561,"y":211},{"x":561,"y":223},{"x":562,"y":247},{"x":566,"y":272},{"x":583,"y":275},{"x":602,"y":273},{"x":602,"y":259},{"x":602,"y":240},{"x":602,"y":223},{"x":599,"y":202},{"x":600,"y":192},{"x":598,"y":181},{"x":618,"y":183},{"x":636,"y":186},{"x":634,"y":203},{"x":635,"y":221},{"x":635,"y":239},{"x":637,"y":258},{"x":638,"y":280},{"x":640,"y":304},{"x":639,"y":317},{"x":641,"y":332},{"x":641,"y":353},{"x":645,"y":368},{"x":645,"y":384},{"x":683,"y":383},{"x":680,"y":359},{"x":680,"y":341},{"x":681,"y":326},{"x":679,"y":302},{"x":679,"y":282},{"x":678,"y":267},{"x":676,"y":252},{"x":674,"y":234},{"x":674,"y":211},{"x":674,"y":199},{"x":675,"y":181},{"x":688,"y":181},{"x":702,"y":180},{"x":719,"y":180},{"x":720,"y":200},{"x":722,"y":217},{"x":722,"y":236},{"x":722,"y":250},{"x":722,"y":263},{"x":723,"y":280},{"x":723,"y":297},{"x":723,"y":313},{"x":722,"y":333},{"x":724,"y":354},{"x":724,"y":370},{"x":726,"y":383},{"x":756,"y":384},{"x":791,"y":381},{"x":821,"y":376},{"x":831,"y":361},{"x":833,"y":342},{"x":835,"y":323},{"x":841,"y":303},{"x":841,"y":283},{"x":840,"y":266},{"x":841,"y":249},{"x":839,"y":230},{"x":838,"y":206},{"x":827,"y":178},{"x":811,"y":145},{"x":793,"y":122},{"x":765,"y":100},{"x":732,"y":86},{"x":705,"y":77},{"x":673,"y":73},{"x":644,"y":64},{"x":601,"y":63},{"x":576,"y":63},{"x":544,"y":67},{"x":502,"y":86},{"x":467,"y":106},{"x":448,"y":129},{"x":433,"y":158},{"x":422,"y":195},{"x":414,"y":224},{"x":408,"y":248},{"x":411,"y":276},{"x":407,"y":300},{"x":406,"y":320},{"x":409,"y":349},{"x":414,"y":379},{"x":424,"y":402},{"x":432,"y":416},{"x":445,"y":443},{"x":466,"y":468},{"x":482,"y":483},{"x":501,"y":493},{"x":527,"y":504},{"x":554,"y":513},{"x":582,"y":514},{"x":618,"y":514},{"x":645,"y":519},{"x":669,"y":519},{"x":689,"y":516},{"x":718,"y":510},{"x":748,"y":495},{"x":773,"y":468},{"x":787,"y":449},{"x":805,"y":428},{"x":816,"y":406}]';

let pointDensity = 0.08;
let window = { width: 0, height: 0 };
let counter = 0;
let inputSignal = { x: [], y: [] };
let outputSignal = { x: [], y: [] };
let wave;

function loadStartFunction(inputString) {
  let points = JSON.parse(inputString);
  
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

  const range = {
    x: maths.getBounds(inputSignal.x),
    y: maths.getBounds(inputSignal.y),
  }

  const scales = {
    x: 0.4 * window.width / (range.x.max - range.x.min),
    y: 0.4 * window.height / (range.y.max - range.y.min),
  }

  const scale = Math.min(scales.x, scales.y);

  inputSignal.x = maths.scale(maths.shiftCenter(inputSignal.x), scale);
  inputSignal.y = maths.scale(maths.shiftCenter(inputSignal.y), -scale);

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
  inputSignal = loadStartFunction(data);
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
  document.getElementById('data-input').value = initialData;
  dom.tieButtonToHandler('reset', reset);
  dom.setPropertiesById('density', { value: 0.08, step: 0.01, min: 0.02, max: 0.2 });
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