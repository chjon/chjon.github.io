import * as maths from './math-utils.js';
import * as sketch from './sketch.js';
import * as dom from './dom-utils.js';
import { Quadtree } from './data-structures/quadtree.js';

const GRAB_RADIUS = 10;
let clickedTree;

const modeLabel = document.getElementById('mode-label');
let mode = 'Draw';
let selected = undefined;
let closest = undefined;
let prevPoint = undefined;
let selection = [];
let mousePos = { x: 0, y: 0 };
let startPoint = undefined;

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

  if (toDisconnect === startPoint) {
    startPoint = undefined;
  }
}

const B64LUT = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_-';

function toBase64(num) {
  const rounded = Math.round(num);
  const quo = Math.floor(rounded / 64);
  const rem = rounded - quo * 64;
  return B64LUT.charAt(quo) + B64LUT.charAt(rem);
}

function fromBase64(val) {
  return B64LUT.indexOf(val.charAt(0)) * 64 + B64LUT.indexOf(val.charAt(1))
}

function uriEncode(data) {
  return data.reduce((encoded, { x, y }) => {
    return encoded + `${toBase64(x)}${toBase64(y)}`;
  }, '');
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

// Output a list of all the points after the current one
function printFrom(startPoint) {
  if (!startPoint) {
    alert('Cannot output; missing start point');
    return;
  }

  const toPrint = [{ x: startPoint.x, y: startPoint.y }];
  let curPoint = startPoint.next;
  while (curPoint && curPoint != startPoint) {
    toPrint.push({ x: curPoint.x, y: curPoint.y });
    curPoint = curPoint.next;
  }

  return toPrint;
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

  mousePos = sketch.getMousePos(e);
  closest = clickedTree.getClosestWithin(mousePos.x, mousePos.y, GRAB_RADIUS * GRAB_RADIUS);
}

document.onmousedown = (e) => {
  if (!clickedTree) {
    return;
  }

  const { x, y } = sketch.getMousePos(e);
  const pageX = x;
  const pageY = y;
  if (
    pageX < 0 ||
    pageX >= sketch.getWidth() ||
    pageY < 0 ||
    pageY >= sketch.getHeight()
  ) {
    return;
  }

  if (mode === 'Draw') {
    // Add a new point
    if (!e.ctrlKey) {
      closest = { x: pageX, y: pageY };
      clickedTree.push(closest);

    // Remove an existing point
    } else if (closest) {
      if (closest === startPoint) {
        startPoint = undefined;
      }
      disconnect(closest);
      clickedTree.pop(closest);
      closest = clickedTree.getClosestWithin(pageX, pageY, GRAB_RADIUS * GRAB_RADIUS);
    }
  } else if (mode === 'Connect') {
    // Disconnect point
    if (e.ctrlKey) {
      disconnect(closest);

    // Connect points together
    } else {
      connect(selected, closest);
      selected = closest;
    }
  } else if (mode === 'Move') {
    if (prevPoint) {
      move(pageX - prevPoint.x, pageY - prevPoint.y);
      prevPoint = undefined;
    } else {
      prevPoint = { x: pageX, y: pageY };
    }
  } else if (mode === 'Rotate') {
    if (prevPoint) {
      rotate(prevPoint.x, prevPoint.y, pageX, pageY);
      prevPoint = undefined;
    } else {
      prevPoint = { x: pageX, y: pageY };
    }
  } else if (mode === 'Select') {
    if (closest) {
      if (e.ctrlKey) {
          deselect(closest);
        } else {
          select(closest);
        }
    } else if (prevPoint) {
      const foundPoints = clickedTree.getAllWithin(prevPoint.x, prevPoint.y, pageX, pageY);
      foundPoints.forEach((obj) => {
        if (e.ctrlKey) {
          deselect(obj);
        } else {
          select(obj);
        }
      });
      prevPoint = undefined;
    } else {
      prevPoint = { x: pageX, y: pageY };
    }
  } else if (mode === 'Scale') {
    if (prevPoint) {
      scale(prevPoint.x, prevPoint.y, pageX, pageY);
      prevPoint = undefined;
    } else {
      prevPoint = { x: pageX, y: pageY };
    }
  } else if (mode === 'Set start point') {
    if (closest) {
      startPoint = closest;
    }
  }
}

function updateMode(keyCode) {
  if (!clickedTree) {
    return;
  }

  switch (keyCode) {
    // Cancel current operation
    case 27:
      selected = undefined;
      prevPoint = undefined;
      break;

    // Delete selection
    case 46:
      selection.forEach((obj) => {
        if (obj === startPoint) {
          startPoint = undefined;
        }
        clickedTree.pop(obj);
      });
      selection = [];
      break;

    // Switch to drawing mode
    case 'D'.charCodeAt(0):
      mode = 'Draw';
      selected = undefined;
      selection = [];
      break;

    // Switch to connecting mode
    case 'C'.charCodeAt(0):
      mode = 'Connect';
      selection = [];
      break;
    
    // Switch to moving mode
    case 'M'.charCodeAt(0):
      mode = 'Move';
      selected = undefined;
      break;

    // Output the raw point data
    case 'O'.charCodeAt(0):
      console.log(clickedTree.getAll());
      break;

    // Output the points in order of connection if all of them are connected
    case 'P'.charCodeAt(0):
      mode = 'Set start point';
      selected = undefined;
      break;

    // Switch to rotating mode
    case 'R'.charCodeAt(0):
      mode = 'Rotate';
      selected = undefined;
      break;

    // Switch to selecting mode
    case 'S'.charCodeAt(0):
      mode = 'Select';
      selected = undefined;
      break;

    // Switch to scaling mode
    case 'T'.charCodeAt(0):
      mode = 'Scale';
      selected = undefined;
      break;

    case 'V'.charCodeAt(0):
      mode = 'View';
      selected = undefined;
      selection = [];
      break;

    default:
      break;
  }

  modeLabel.textContent = 'Current mode: ' + mode;
}

document.onkeyup = (e) => {
  updateMode(e.keyCode);
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

function dataImport() {
  clickedTree.clear();
  selection = [];
  selected = undefined;
  prevPoint = undefined;
  startPoint = undefined;
  const points = JSON.parse(uriDecode(document.getElementById('data').value));
  const scaledPoints = scaleAndShift(
    points,
    0.8 * sketch.getWidth(),
    0.8 * sketch.getHeight(),
    0.1 * sketch.getWidth(),
    0.1 * sketch.getHeight(),
  );
  for (let i = 0; i < scaledPoints.length; i++) {
    scaledPoints[i].next = scaledPoints[(i + 1) % scaledPoints.length];
    scaledPoints[i].prev = scaledPoints[(i + scaledPoints.length - 1) % scaledPoints.length];
    clickedTree.push(scaledPoints[i]);
  }
}

function dataExport() {
  // Check connections
  const isDisconnected = clickedTree.getAll().find(({ next }) => {
    return !next;
  });
  if (isDisconnected) {
    alert('Cannot output; points must be connected');
    return;
  }

  const data = printFrom(startPoint);
  if (data) {
    const scaledData = scaleAndShift(data, 64 * 64 - 1, 64 * 64 - 1, 0, 0);
    document.getElementById('data').value = uriEncode(scaledData);
  }
}

function setup() {
  sketch.setFrameInterval(20);
  clickedTree = new Quadtree(0, 0, sketch.getWidth(), sketch.getHeight(), 4, 6);
  dom.tieButtonToHandler('mode-draw', () => { updateMode('D'.charCodeAt(0)); });
  dom.tieButtonToHandler('mode-connect', () => { updateMode('C'.charCodeAt(0)); });
  dom.tieButtonToHandler('mode-select', () => { updateMode('S'.charCodeAt(0)); });
  dom.tieButtonToHandler('mode-move', () => { updateMode('M'.charCodeAt(0)); });
  dom.tieButtonToHandler('mode-rotate', () => { updateMode('R'.charCodeAt(0)); });
  dom.tieButtonToHandler('mode-scale', () => { updateMode('T'.charCodeAt(0)); });
  dom.tieButtonToHandler('mode-view', () => { updateMode('V'.charCodeAt(0)); });
  dom.tieButtonToHandler('mode-set-start', () => { updateMode('P'.charCodeAt(0)); });

  dom.tieButtonToHandler('data-output', dataExport);
  dom.tieButtonToHandler('data-input', dataImport);
}

function draw() {
  sketch.setStroke('#FFFFFF');
  if (mode === 'View') {
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
    if (mode === 'Select') {
      sketch.rect(prevPoint.x, prevPoint.y, mousePos.x, mousePos.y);
    } else if (mode === 'Move' || mode === 'Scale' || mode === 'Rotate') {
      sketch.line(prevPoint.x, prevPoint.y, mousePos.x, mousePos.y);
    }
  }

  if (mode === 'Set start point' && startPoint) {
    sketch.ellipse(startPoint.x, startPoint.y, GRAB_RADIUS, GRAB_RADIUS);
  }
}

sketch.init(setup, draw);