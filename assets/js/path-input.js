import * as maths from './math-utils.js';
import * as sketch from './sketch.js';
import { Quadtree } from './quadtree.js';

const GRAB_RADIUS = 20;
const clickedPositions = [];
let clickedTree;

const modeLabel = document.getElementById('mode-label');
let mode = 'Drawing';
let selected = undefined;

function getPointWithin(x, y, maxR) {
  const rSquared = maxR * maxR;
  for (let i = 0; i < clickedPositions.length; i = i + 1) {
    const dist2 = maths.dist2(x, y, clickedPositions[i].x, clickedPositions[i].y);
    if (dist2 < rSquared) {
      return i;
    }
  }

  return undefined;
}

document.onmousedown = (e) => {
  if (mode === 'Drawing') {
    // clickedPositions.push({ x: e.pageX, y: e.pageY });
    clickedTree.addPoint(e.pageX, e.pageY);
  } else if (mode === 'Editing') {
    selected = clickedTree.popClosestWithin(e.pageX, e.pageY, GRAB_RADIUS * GRAB_RADIUS);
  }
}

document.onmouseup = (e) => {
  if (selected) {
    clickedTree.addPoint(e.pageX, e.pageY);
  }
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
      console.log(clickedTree);
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
  clickedTree = new Quadtree(0, 0, sketch.getWidth(), sketch.getHeight(), 1, 3, true);
}

function draw() {
  sketch.setStroke('#FFFFFF');
  sketch.setFill('#FFFFFF');

  // for (let i = 0; i < clickedPositions.length; i = i + 1) {
  //   const { x, y } = clickedPositions[i];
  //   sketch.ellipse(x, y, GRAB_RADIUS, GRAB_RADIUS);

  //   if (clickedPositions[i + 1]) {
  //     sketch.line(x, y, clickedPositions[i + 1].x, clickedPositions[i + 1].y);
  //   }
  // }

  clickedTree.draw();
}

sketch.init(setup, draw);