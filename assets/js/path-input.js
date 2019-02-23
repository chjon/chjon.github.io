import * as sketch from './sketch.js';
import { Quadtree } from './quadtree.js';

const GRAB_RADIUS = 10;
let clickedTree;

const modeLabel = document.getElementById('mode-label');
let mode = 'Drawing';
let selected = undefined;
let closest;

document.onmousemove = (e) => {
  if (!clickedTree) {
    return;
  }

  if (!selected) {
    closest = clickedTree.getClosestWithin(e.pageX, e.pageY, GRAB_RADIUS * GRAB_RADIUS);
  }
}

document.onmousedown = (e) => {
  if (!clickedTree) {
    return;
  }

  if (mode === 'Drawing') {
    if (!e.ctrlKey) {
      clickedTree.addPoint(e.pageX, e.pageY);
      closest = { x: e.pageX, y: e.pageY };
    } else if (closest) {
      clickedTree.pop(closest.x, closest.y);
      closest = clickedTree.getClosestWithin(e.pageX, e.pageY, GRAB_RADIUS * GRAB_RADIUS);;
    }
  }
}

document.onmouseup = (e) => {
}

document.onkeyup = (e) => {
  if (!clickedTree) {
    return;
  }

  switch (e.keyCode) {
    case 'D'.charCodeAt(0):
      mode = 'Drawing';
      break;
    case 'C'.charCodeAt(0):
      mode = 'Connecting';
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

  if (closest) {
    sketch.ellipse(closest.x, closest.y, GRAB_RADIUS, GRAB_RADIUS);
  }
}

sketch.init(setup, draw);