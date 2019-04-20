import * as maths from './math-utils.js';
import * as arrays from './array-utils.js';
import * as sketch from './sketch.js';
import * as dom from './dom-utils.js';

let dimensions;
let board;
let scaleFactors;
let offsetToCenter;
const candidateValues = [0, 1, 2];
const pow = [1];

function generateTiles(board, values, numTiles = 1) {
  const freeSpots = [];
  arrays.forEach(board, (val, [x, y]) => {
    if (val === undefined) {
      freeSpots.push({ x, y });
    }
  });
  
  maths.shuffleList(freeSpots);
  let numGenerated = 0;
  while (freeSpots.length > 0 && numGenerated < numTiles) {
    const { x, y } = freeSpots.pop();
    const generatedTile = values[maths.randInt(0, values.length)];
    numGenerated++;
    board[x][y] = generatedTile;
  }
}

function onKeyDown(e) {
  let performedMerge = false;
  let performedMove = false;

  switch (e.keyCode) {
    case 'W'.charCodeAt(0):
      for (let x = 0; x < dimensions.x; x++) {
        let mergeIndex = 0;
        for (let y = 1; y < dimensions.y; y++) {
          if (board[x][y] !== undefined) {
            if (board[x][mergeIndex] === undefined) {
              board[x][mergeIndex] = board[x][y];
              if (mergeIndex !== y) {
                performedMove = true;
                board[x][y] = undefined;
              }
            } else if (board[x][mergeIndex] === board[x][y]) {
              performedMerge = true;
              board[x][mergeIndex]++;
              if (mergeIndex !== y) {
                board[x][y] = undefined;
              }
              mergeIndex++;
            } else {
              mergeIndex++;
              board[x][mergeIndex] = board[x][y];
              if (mergeIndex !== y) {
                performedMove = true;
                board[x][y] = undefined;
              }
            }
          }
        }
      }
      break;
    case 'A'.charCodeAt(0):
      for (let y = 0; y < dimensions.y; y++) {
        let mergeIndex = 0;
        for (let x = 1; x < dimensions.x; x++) {
          if (board[x][y] !== undefined) {
            if (board[mergeIndex][y] === undefined) {
              board[mergeIndex][y] = board[x][y];
              if (mergeIndex !== x) {
                performedMove = true;
                board[x][y] = undefined;
              }
            } else if (board[mergeIndex][y] === board[x][y]) {
              performedMerge = true;
              board[mergeIndex][y]++;
              if (mergeIndex !== x) {
                board[x][y] = undefined;
              }
              mergeIndex++;
            } else {
              mergeIndex++;
              board[mergeIndex][y] = board[x][y];
              if (mergeIndex !== x) {
                performedMove = true;
                board[x][y] = undefined;
              }
            }
          }
        }
      }
      break;
    case 'S'.charCodeAt(0):
      for (let x = 0; x < dimensions.x; x++) {
        let mergeIndex = dimensions.y - 1;
        for (let y = dimensions.y - 2; y >= 0; y--) {
          if (board[x][y] !== undefined) {
            if (board[x][mergeIndex] === undefined) {
              board[x][mergeIndex] = board[x][y];
              if (mergeIndex !== y) {
                performedMove = true;
                board[x][y] = undefined;
              }
            } else if (board[x][mergeIndex] === board[x][y]) {
              performedMerge = true;
              board[x][mergeIndex]++;
              if (mergeIndex !== y) {
                board[x][y] = undefined;
              }
              mergeIndex--;
            } else {
              mergeIndex--;
              board[x][mergeIndex] = board[x][y];
              if (mergeIndex !== y) {
                performedMove = true;
                board[x][y] = undefined;
              }
            }
          }
        }
      }
      break;
    case 'D'.charCodeAt(0):
      for (let y = 0; y < dimensions.y; y++) {
        let mergeIndex = dimensions.x - 1;
        for (let x = dimensions.x - 2; x >= 0; x--) {
          if (board[x][y] !== undefined) {
            if (board[mergeIndex][y] === undefined) {
              board[mergeIndex][y] = board[x][y];
              if (mergeIndex !== x) {
                performedMove = true;
                board[x][y] = undefined;
              }
            } else if (board[mergeIndex][y] === board[x][y]) {
              performedMerge = true;
              board[mergeIndex][y]++;
              if (mergeIndex !== x) {
                board[x][y] = undefined;
              }
              mergeIndex--;
            } else {
              mergeIndex--;
              board[mergeIndex][y] = board[x][y];
              if (mergeIndex !== x) {
                performedMove = true;
                board[x][y] = undefined;
              }
            }
          }
        }
      }
      break;
    default:
      return;
  }

  if (!performedMerge && performedMove) {
    generateTiles(board, candidateValues);
  }
}

function setup() {
  document.onkeydown = onKeyDown;
  dimensions = { x: 4, y: 4 };
  board = arrays.newNDArray([dimensions.x, dimensions.y], undefined);
  scaleFactors = maths.getScaleForBounds(
    { x: dimensions.x, y: dimensions.y },
    { x: sketch.getWidth(), y: sketch.getHeight() },
    true,
  );
  offsetToCenter = {
    x: maths.getOffsetToCenter(0, dimensions.x * scaleFactors.x, 0, sketch.getWidth()),
    y: maths.getOffsetToCenter(0, dimensions.y * scaleFactors.y, 0, sketch.getHeight()),
  };

  sketch.setStroke('#FFFFFF');
  sketch.setFill('#FFFFFF');
  sketch.textAlign('center');
  sketch.textBaseline('middle');
  sketch.textStyle(`${Math.floor(scaleFactors.x * 0.33)}px Helvetica`);

  generateTiles(board, candidateValues);

  const maxPow = dimensions.x * dimensions.y;
  for (let i = 1; i < maxPow; i++) {
    pow[i] = pow[i - 1] << 1;
  } 
}

function draw() {
  sketch.pushState();
  sketch.translate(offsetToCenter.x, offsetToCenter.y);

  arrays.forEach(board, (val, [x, y]) => {
    const screenPos = {
      x: x * scaleFactors.x,
      y: y * scaleFactors.y,
    };

    sketch.rect(
      screenPos.x,
      screenPos.y,
      screenPos.x + scaleFactors.x,
      screenPos.y + scaleFactors.y,
    );

    sketch.text(
      screenPos.x + scaleFactors.x / 2,
      screenPos.y + scaleFactors.y / 2,
      (val === undefined) ? '' : `${pow[val]}`,
      true,
    );
  });

  sketch.popState();
}

sketch.init(setup, draw);