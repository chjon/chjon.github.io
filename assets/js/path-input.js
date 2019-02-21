import * as maths from './math-utils.js';
import * as sketch from './sketch.js';

const clickedPositions = [];
const modeLabel = document.getElementById('mode-label');
let mode = 'Drawing';
let selected = undefined;

function getClosest(x, y) {
  if (!clickedPositions.length) return undefined;

  let closestIndex = 0;
  let closestDist2 = maths.dist2(x, y, clickedPositions[0].x, clickedPositions[0].y);

  for (let i = 1; i < clickedPositions.length; i = i + 1) {
    const dist2 = maths.dist2(x, y, clickedPositions[i].x, clickedPositions[i].y);
    if (dist2 < closestDist2) {
      closestIndex = i;
      closestDist2 = dist2;
    }
  }

  return closestIndex;
}

document.onmousedown = (e) => {
  if (mode === 'Drawing') {
    clickedPositions.push({ x: e.pageX, y: e.pageY });
  } else if (mode === 'Editing') {
    selected = getClosest(e.pageX, e.pageY);
  }
}

document.onmouseup = (e) => {
  selected = undefined;
}

document.onmousemove = (e) => {
  if (selected !== undefined && mode === 'Editing') {
    clickedPositions[selected] = { x: e.pageX, y: e.pageY };
  }
}

document.onkeyup = (e) => {
  switch (e.keyCode) {
    case 'D'.charCodeAt(0):
      mode = 'Drawing';
      break;
    case 'E'.charCodeAt(0):
      mode = 'Editing';
      break;
    case 'O'.charCodeAt(0):
      console.log(JSON.stringify(clickedPositions));
      break;
    case 'Z'.charCodeAt(0):
      if (e.ctrlKey) clickedPositions.pop();
      break;
    default:
      break;
  }

  modeLabel.textContent='Current mode: ' + mode;
}

function setup() {
  sketch.setFrameInterval(20);
}

function draw() {
  sketch.setStroke('#FFFFFF');
  sketch.setFill('#FFFFFF');

  clickedPositions.forEach(({ x, y }) => {
    sketch.ellipse(x, y, 5, 5);
  });

  for (let i = 0; i < clickedPositions.length; i = i + 1) {
    const { x, y } = clickedPositions[i];
    sketch.ellipse(x, y, 5, 5);

    if (clickedPositions[i + 1]) {
      sketch.line(x, y, clickedPositions[i + 1].x, clickedPositions[i + 1].y);
    }
  }
}

sketch.init(setup, draw);