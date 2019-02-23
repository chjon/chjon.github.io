import * as maths from './math-utils.js';
import * as sketch from './sketch.js';
import { Quadtree } from './quadtree.js';

const GRAB_RADIUS = 10;
let clickedTree;

const modeLabel = document.getElementById('mode-label');
let mode = 'Drawing';
let selected = undefined;
let closest = undefined;
let prevPoint = undefined;
let selection = [];
let mousePos = { x: 0, y: 0 };

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

// Translate the currently selected points
function move(xShift, yShift) {
  selection.forEach((obj) => {
    clickedTree.pop(obj);
    obj.x += xShift;
    obj.y += yShift;
    clickedTree.push(obj);
  });
}

// Scale the currently selected points
function scale(x1, y1, x2, y2) {
  const selectionComponents = selection.reduce((selectionComponents, obj) => {
    selectionComponents.x.push(obj.x);
    selectionComponents.y.push(obj.y);
    return selectionComponents;
  }, { x: [], y: [] });

  function getCenter(list) {
    const bounds = maths.getBounds(list);
    return maths.avg(bounds.min, bounds.max);
  }

  const mid = {
    x: getCenter(selectionComponents.x),
    y: getCenter(selectionComponents.y),
  }

  const xScale = (x2 - mid.x) / (x1 - mid.x);
  const yScale = (y2 - mid.y) / (y1 - mid.y);

  selection.forEach((obj) => {
    clickedTree.pop(obj);
    obj.x = (obj.x - mid.x) * xScale + mid.x;
    obj.y = (obj.y - mid.y) * yScale + mid.y;
    clickedTree.push(obj);
  });
}

// Rotate the currently selected points
function rotate(x1, y1, x2, y2) {
  const selectionComponents = selection.reduce((selectionComponents, obj) => {
    selectionComponents.x.push(obj.x);
    selectionComponents.y.push(obj.y);
    return selectionComponents;
  }, { x: [], y: [] });

  function getCenter(list) {
    const bounds = maths.getBounds(list);
    return maths.avg(bounds.min, bounds.max);
  }

  const mid = {
    x: getCenter(selectionComponents.x),
    y: getCenter(selectionComponents.y),
  }

  const shiftAngle = Math.atan2(y2 - mid.y, x2 - mid.x) - Math.atan2(y1 - mid.y, x1 - mid.x);
  const cosAngle = Math.cos(shiftAngle);
  const sinAngle = Math.sin(shiftAngle);

  selection.forEach((obj) => {
    clickedTree.pop(obj);
    obj.x -= mid.x;
    obj.y -= mid.y;
    const newX = obj.x * cosAngle - obj.y * sinAngle + mid.x;
    const newY = obj.x * sinAngle + obj.y * cosAngle + mid.y;
    obj.x = newX;
    obj.y = newY;
    clickedTree.push(obj);
  });
}

function deselect(obj) {
  const objIndex = selection.findIndex((testObj) => {
    return testObj === obj;
  });
  if (obj && objIndex !== -1) {
    selection.splice(objIndex, 1);
  }
}

function select(obj) {
  const objIndex = selection.findIndex((testObj) => {
    return testObj === obj;
  });
  if (obj && objIndex === -1) {
    selection.push(obj);
  }
}

// Draw the objects in the quadtree
function drawQuadtree(qTree, pointSize) {
  if (qTree.bucket) {
    qTree.bucket.forEach((storedObj) => {
      sketch.ellipse(storedObj.x, storedObj.y, pointSize, pointSize);

      if (storedObj.next) {
        sketch.line(storedObj.x, storedObj.y, storedObj.next.x, storedObj.next.y);
      }
    });
  } else {
    drawQuadtree(qTree.ne, pointSize);
    drawQuadtree(qTree.nw, pointSize);
    drawQuadtree(qTree.se, pointSize);
    drawQuadtree(qTree.sw, pointSize);
  }
}

document.onmousemove = (e) => {
  if (!clickedTree) {
    return;
  }

  closest = clickedTree.getClosestWithin(e.pageX, e.pageY, GRAB_RADIUS * GRAB_RADIUS);
  mousePos.x = e.pageX;
  mousePos.y = e.pageY;
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
  } else if (mode === 'Moving') {
    if (prevPoint) {
      move(e.pageX - prevPoint.x, e.pageY - prevPoint.y);
      prevPoint = undefined;
    } else {
      prevPoint = { x: e.pageX, y: e.pageY };
    }
  } else if (mode === 'Printing') {
    printFrom(closest);
  } else if (mode === 'Rotating') {
    if (prevPoint) {
      rotate(prevPoint.x, prevPoint.y, e.pageX, e.pageY);
      prevPoint = undefined;
    } else {
      prevPoint = { x: e.pageX, y: e.pageY };
    }
  } else if (mode === 'Selecting') {
    if (closest) {
      if (e.ctrlKey) {
          deselect(closest);
        } else {
          select(closest);
        }
    } else if (prevPoint) {
      const foundPoints = clickedTree.getAllWithin(prevPoint.x, prevPoint.y, e.pageX, e.pageY);
      foundPoints.forEach((obj) => {
        if (e.ctrlKey) {
          deselect(obj);
        } else {
          select(obj);
        }
      });
      prevPoint = undefined;
    } else {
      prevPoint = { x: e.pageX, y: e.pageY };
    }
  } else if (mode === 'Scaling') {
    if (prevPoint) {
      scale(prevPoint.x, prevPoint.y, e.pageX, e.pageY);
      prevPoint = undefined;
    } else {
      prevPoint = { x: e.pageX, y: e.pageY };
    }
  }
}

document.onkeyup = (e) => {
  if (!clickedTree) {
    return;
  }

  switch (e.keyCode) {
    // Cancel current operation
    case 27:
      prevPoint = undefined;
      break;

    // Delete selection
    case 46:
      selection.forEach((obj) => {
        clickedTree.pop(obj);
      });
      selection = [];
      break;

    // Switch to drawing mode
    case 'D'.charCodeAt(0):
      mode = 'Drawing';
      selected = undefined;
      selection = [];
      break;

    // Switch to connecting mode
    case 'C'.charCodeAt(0):
      mode = 'Connecting';
      selection = [];
      break;
    
    // Switch to moving mode
    case 'M'.charCodeAt(0):
      mode = 'Moving';
      selected = undefined;
      break;

    // Output the raw point data
    case 'O'.charCodeAt(0):
      console.log(clickedTree.getAll());
      break;

    // Output the points in order of connection if all of them are connected
    case 'P'.charCodeAt(0):
      mode = 'Printing';
      break;

    // Switch to rotating mode
    case 'R'.charCodeAt(0):
      mode = 'Rotating';
      selected = undefined;
      break;

    // Switch to selecting mode
    case 'S'.charCodeAt(0):
      mode = 'Selecting';
      selected = undefined;
      break;

    // Switch to scaling mode
    case 'T'.charCodeAt(0):
      mode = 'Scaling';
      selected = undefined;
      break;

    case 'V'.charCodeAt(0):
      mode = 'Viewing';
      selected = undefined;
      selection = [];
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
  if (mode === 'Viewing') {
    drawQuadtree(clickedTree, 1);
  } else {
    drawQuadtree(clickedTree, 5);
  }

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

  // Draw all selected points
  sketch.setStroke('#FFFFFF');
  selection.forEach((obj) => {
    sketch.ellipse(obj.x, obj.y, GRAB_RADIUS, GRAB_RADIUS);
  });

  if (prevPoint) {
    if (mode === 'Selecting') {
      sketch.rect(prevPoint.x, prevPoint.y, mousePos.x, mousePos.y);
    } else if (mode === 'Moving' || mode === 'Scaling' || mode === 'Rotating') {
      sketch.line(prevPoint.x, prevPoint.y, mousePos.x, mousePos.y);
    }
  }
}

sketch.init(setup, draw);