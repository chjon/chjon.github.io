import * as sketch from './sketch.js';
import { Quadtree } from './quadtree.js';

const GRAB_RADIUS = 10;
let clickedTree;

const modeLabel = document.getElementById('mode-label');
let mode = 'Drawing';
let selected = undefined;
let closest = undefined;

// Connect the two given objects
function connect(a, b) {
  if (a && b) {
    if (a.next) {
      a.next.prev = undefined;
    }
    a.next = b;

    if (b.prev) {
      b.prev.next = undefined;
    }
    b.prev = a;
  }
}

// Disconnect the given object
function disconnect(toDisconnect) {
  if (toDisconnect.prev) {
    toDisconnect.prev.next = undefined;
    toDisconnect.prev = undefined;
  }

  if (toDisconnect.next) {
    toDisconnect.next.prev = undefined;
    toDisconnect.next = undefined;
  }
}

// Output a list of all the points after the current one
function printFrom(startPoint) {
  if (!startPoint) {
    return;
  }

  const toPrint = [{ x: startPoint.x, y: startPoint.y }];
  let curPoint = startPoint.next;
  while (curPoint && curPoint != startPoint) {
    toPrint.push({ x: curPoint.x, y: curPoint.y });
    curPoint = curPoint.next;
  }

  console.log(JSON.stringify(toPrint));
}

// Draw the objects in the quadtree
function drawQuadtree(qTree) {
  if (qTree.bucket) {
    qTree.bucket.forEach((storedObj) => {
      sketch.ellipse(storedObj.x, storedObj.y, 5, 5);

      if (storedObj.next) {
        sketch.line(storedObj.x, storedObj.y, storedObj.next.x, storedObj.next.y);
      }
    });
  } else {
    drawQuadtree(qTree.ne);
    drawQuadtree(qTree.nw);
    drawQuadtree(qTree.se);
    drawQuadtree(qTree.sw);
  }
}

document.onmousemove = (e) => {
  if (!clickedTree) {
    return;
  }

  closest = clickedTree.getClosestWithin(e.pageX, e.pageY, GRAB_RADIUS * GRAB_RADIUS);
}

document.onmousedown = (e) => {
  if (!clickedTree) {
    return;
  }

  if (mode === 'Drawing') {
    // Add a new point
    if (!e.ctrlKey) {
      closest = { x: e.pageX, y: e.pageY };
      clickedTree.push(closest);

    // Remove an existing point
    } else if (closest) {
      disconnect(closest);
      clickedTree.pop(closest);
      closest = clickedTree.getClosestWithin(e.pageX, e.pageY, GRAB_RADIUS * GRAB_RADIUS);
    }
  } else if (mode === 'Connecting') {
    // Disconnect point
    if (e.ctrlKey) {
      disconnect(closest);

    // Connect points together
    } else {
      connect(selected, closest);
      selected = closest;
    }
  } else if (mode === 'Printing') {
    printFrom(closest);
  }
}

document.onkeyup = (e) => {
  if (!clickedTree) {
    return;
  }

  switch (e.keyCode) {
    // Switch to drawing mode
    case 'D'.charCodeAt(0):
      mode = 'Drawing';
      selected = undefined;
      break;

    // Switch to connecting mode
    case 'C'.charCodeAt(0):
      mode = 'Connecting';
      break;
    
    // Output the raw point data
    case 'O'.charCodeAt(0):
      console.log(clickedTree.getAll());
      break;

    // Output the points in order of connection if all of them are connected
    case 'P'.charCodeAt(0):
      mode = 'Printing';
      break;

    default:
      break;
  }

  modeLabel.textContent='Current mode: ' + mode;
}

function setup() {
  sketch.setFrameInterval(20);
  clickedTree = new Quadtree(0, 0, sketch.getWidth(), sketch.getHeight(), 4, 6);
}

function draw() {
  sketch.setStroke('#FFFFFF');
  drawQuadtree(clickedTree);

  // Draw the closest point
  if (closest) {
    sketch.ellipse(closest.x, closest.y, GRAB_RADIUS, GRAB_RADIUS);
  }

  if (selected) {
    sketch.setStroke('#FFFF00');
    sketch.ellipse(selected.x, selected.y, GRAB_RADIUS, GRAB_RADIUS);

    if (selected.next) {
      sketch.setStroke('#00FF00');
      sketch.ellipse(selected.next.x, selected.next.y, GRAB_RADIUS, GRAB_RADIUS);
    }

    if (selected.prev) {
      sketch.setStroke('#FF0000');
      sketch.ellipse(selected.prev.x, selected.prev.y, GRAB_RADIUS, GRAB_RADIUS);
    }
  }
}

sketch.init(setup, draw);