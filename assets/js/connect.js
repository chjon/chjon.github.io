import * as sketch from './sketch.js';
import * as maths from './math-utils.js';
import * as arrays from './array-utils.js';

const dimensions = { x: 7, y: 6 };
const teamColours = [
  '#FF0000',
  '#00FF00',
];
let board;
let rowBottom;
let remainingMoves;
let scaleFactors;
let offsetToCenter;
let boardPos = { x: 0, y: 0 };
let curTurn = 0;

function reset() {
  board = arrays.newNDArray([dimensions.x, dimensions.y], undefined);
  rowBottom = arrays.newNDArray([dimensions.x], dimensions.y - 1);
  remainingMoves = dimensions.x;
}

function onMouseMove(e) {
  const mousePos = sketch.getMousePos(e);
  boardPos = {
    x: Math.floor(maths.linearMap(
      mousePos.x - offsetToCenter.x,
      0, dimensions.x * scaleFactors.x,
      0, dimensions.x,
    )),
    y: Math.floor(maths.linearMap(
      mousePos.y - offsetToCenter.y,
      0, dimensions.y * scaleFactors.y,
      0, dimensions.y,
    )),
  };
}

function onMouseUp(e) {
  // Ensure mouse is on canvas
  if (
    boardPos.x < 0 || boardPos.x >= dimensions.x ||
    boardPos.y < 0 || boardPos.y >= dimensions.y
  ) {
    return;
  }

  if (remainingMoves === 0) {
    reset();
    return;
  }

  // Find the bottom-most spot
  if (rowBottom[boardPos.x] === -1) {
    return;
  }

  board[boardPos.x][rowBottom[boardPos.x]] = curTurn;
  rowBottom[boardPos.x]--;
  curTurn = (curTurn + 1) % teamColours.length;

  if (rowBottom[boardPos.x] === -1) {
    remainingMoves--;
  }
}

function setup() {
  document.onmousemove = onMouseMove;
  document.onmouseup = onMouseUp;
  scaleFactors = maths.getScaleForBounds(
    { x: dimensions.x, y: dimensions.y + 1 },
    { x: sketch.getWidth(), y: sketch.getHeight() },
    true,
  );
  offsetToCenter = {
    x: maths.getOffsetToCenter(0, dimensions.x * scaleFactors.x, 0, sketch.getWidth()),
    y: maths.getOffsetToCenter(0, dimensions.y * scaleFactors.y, 0, sketch.getHeight() + scaleFactors.y),
  };

  reset();
}

function drawPieceAt(x, y) {
  const screenPos = {
    x: x * scaleFactors.x,
    y: y * scaleFactors.y,
  };
  sketch.ellipse(
    screenPos.x + scaleFactors.x / 2,
    screenPos.y + scaleFactors.y / 2,
    scaleFactors.x / 2,
    scaleFactors.y / 2,
  );
}

function getColorForTeam(team) {
  if (team === undefined) return '#333333';
  return teamColours[team];
}

function draw() {
  sketch.pushState();
  sketch.translate(offsetToCenter.x, offsetToCenter.y);

  // Draw selected row indicator
  sketch.setStroke(getColorForTeam(curTurn));
  if (boardPos.x >= 0 && boardPos.x < dimensions.x) {
    drawPieceAt(boardPos.x, -1);
  }

  // Draw board contents
  arrays.forEach(board, (boardVal, [x, y]) => {
    sketch.setStroke(getColorForTeam(boardVal));
    drawPieceAt(x, y);
  });
  sketch.popState();
}

sketch.init(setup, draw);