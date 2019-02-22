import * as sketch from './sketch.js';
import { Quadtree } from './quadtree.js';

const GRAB_RADIUS = 20;
let clickedTree;

const modeLabel = document.getElementById('mode-label');
let mode = 'Drawing';
let selected = undefined;

document.onmousedown = (e) => {
  if (mode === 'Drawing') {
    clickedTree.addPoint(e.pageX, e.pageY);
  } else if (mode === 'Editing') {
    selected = clickedTree.popClosestWithin(e.pageX, e.pageY, GRAB_RADIUS * GRAB_RADIUS);
  }
}

document.onmouseup = (e) => {
  if (selected) {
    clickedTree.addPoint(e.pageX, e.pageY);
    selected = undefined;
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
    default:
      break;
  }

  modeLabel.textContent='Current mode: ' + mode;
}

function setup() {
  sketch.setFrameInterval(20);
  clickedTree = new Quadtree(0, 0, sketch.getWidth(), sketch.getHeight(), 4, 5, true);
}

function draw() {
  sketch.setStroke('#FFFFFF');
  sketch.setFill('#FFFFFF');

  clickedTree.draw();
}

sketch.init(setup, draw);