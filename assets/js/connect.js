import * as sketch from './sketch.js';
import * as maths from './math-utils.js';
import * as arrays from './array-utils.js';

const dimensions = { x: 7, y: 6 };
const valToWin = 4;
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

function isOnBoard(x, y, dimensions) {
  return (
    x >= 0 && x < dimensions.x &&
    y >= 0 && y < dimensions.y
  );
}

function getChainLength(pos, vel) {
  if (!isOnBoard(pos.x, pos.y, dimensions) || board[pos.x][pos.y].team != curTurn) {
    return 0;
  }

  const newPos = { x: pos.x + vel.x, y: pos.y + vel.y };
  return getChainLength(newPos, vel) + 1;
}

function setChainProperty(pos, vel, key, val) {
  if (!isOnBoard(pos.x, pos.y, dimensions) || board[pos.x][pos.y].team != curTurn) {
    return 0;
  }

  board[pos.x][pos.y][key] = val;
  const newPos = { x: pos.x + vel.x, y: pos.y + vel.y };
  return setChainProperty(newPos, vel, key, val);
}

function reset() {
  board = arrays.newNDArray([dimensions.x, dimensions.y], undefined);
  arrays.forEach(board, (val, [x, y]) => {
    board[x][y] = {
      team: undefined,
      increasing: 0,
      decreasing: 0,
      horizontal: 0,
      vertical: 0,
    };
  });
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

  // Update spot
  const selected = { x: boardPos.x, y: rowBottom[boardPos.x] };

  const increasing = 1 +
    getChainLength({ x: selected.x - 1, y: selected.y - 1 }, { x: -1, y: -1 }) +
    getChainLength({ x: selected.x + 1, y: selected.y + 1 }, { x:  1, y:  1 });
  if (increasing >= valToWin) {
    setChainProperty({ x: selected.x - 1, y: selected.y - 1 }, { x: -1, y: -1 }, 'increasing', increasing);
    setChainProperty({ x: selected.x + 1, y: selected.y + 1 }, { x:  1, y:  1 }, 'increasing', increasing);
    remainingMoves = 0;
  }
  const decreasing = 1 +
    getChainLength({ x: selected.x - 1, y: selected.y + 1 }, { x: -1, y:  1 }) +
    getChainLength({ x: selected.x + 1, y: selected.y - 1 }, { x:  1, y: -1 });
  if (decreasing >= valToWin) {
    setChainProperty({ x: selected.x - 1, y: selected.y + 1 }, { x: -1, y:  1 }, 'decreasing', decreasing);
    setChainProperty({ x: selected.x + 1, y: selected.y - 1 }, { x:  1, y: -1 }, 'decreasing', decreasing);
    remainingMoves = 0;
  }
  const horizontal = 1 +
    getChainLength({ x: selected.x - 1, y: selected.y }, { x: -1, y: 0 }) +
    getChainLength({ x: selected.x + 1, y: selected.y }, { x:  1, y: 0 });
  if (horizontal >= valToWin) {
    setChainProperty({ x: selected.x - 1, y: selected.y }, { x: -1, y: 0 }, 'horizontal', horizontal);
    setChainProperty({ x: selected.x + 1, y: selected.y }, { x:  1, y: 0 }, 'horizontal', horizontal);
    remainingMoves = 0;
  }
  const vertical = 1 +
    getChainLength({ x: selected.x, y: selected.y + 1 }, { x: 0, y: 1 });
  if (vertical >= valToWin) {
    setChainProperty({ x: selected.x, y: selected.y + 1 }, { x: 0, y: 1 }, 'vertical', vertical);
    remainingMoves = 0;
  }

  board[selected.x][selected.y] = {
    team: curTurn,
    increasing,
    decreasing,
    horizontal,
    vertical,
  };

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

function drawPieceAt(x, y, scale = 0.9) {
  const screenPos = {
    x: x * scaleFactors.x,
    y: y * scaleFactors.y,
  };
  sketch.ellipse(
    screenPos.x + scaleFactors.x / 2,
    screenPos.y + scaleFactors.y / 2,
    scale * scaleFactors.x / 2,
    scale * scaleFactors.y / 2,
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
  sketch.setStroke(getColorForTeam(remainingMoves ? curTurn : undefined));
  if (boardPos.x >= 0 && boardPos.x < dimensions.x) {
    drawPieceAt(boardPos.x, -1);
  }

  // Draw board contents
  arrays.forEach(board, ({ team, increasing, decreasing, horizontal, vertical }, [x, y]) => {
    sketch.setStroke(getColorForTeam(team));
    drawPieceAt(x, y);

    if (
      increasing >= valToWin ||
      decreasing >= valToWin ||
      horizontal >= valToWin ||
      vertical >= valToWin
    ) {
      drawPieceAt(x, y, 0.5)
    }
  });
  sketch.popState();
}

sketch.init(setup, draw);