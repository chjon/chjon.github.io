import * as sketch from './sketch.js';
import * as maths from './math-utils.js';
import * as arrays from './array-utils.js';

const dimensions = { x: 16, y: 9 };
const board = arrays.newNDArray([dimensions.x, dimensions.y], null);
let scaleFactors = { x: 0, y: 0 };
let offsetToCenter = { x: 0, y: 0 };

document.onmouseup = function(e) {
  const mousePos = sketch.getMousePos(e);
  const boardPos = {
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
  board[boardPos.x][boardPos.y] = 1;
}

function setup() {
  scaleFactors = maths.getScaleForBounds(
    dimensions,
    { x: sketch.getWidth(), y: sketch.getHeight() },
    true,
  );

  offsetToCenter = {
    x: maths.getOffsetToCenter(0, dimensions.x * scaleFactors.x, 0, sketch.getWidth()),
    y: maths.getOffsetToCenter(0, dimensions.y * scaleFactors.y, 0, sketch.getHeight()),
  };
}

function draw() {
  sketch.setStroke('#FFFFFF');
  // Draw board
  sketch.pushState();
  sketch.translate(offsetToCenter.x, offsetToCenter.y);
  arrays.forEach(board, (boardVal, [x, y]) => {
    switch(boardVal) {
      case 1:
        sketch.setFill('#00FF00');
        break;
      case 2:
        sketch.setFill('#FF0000');
        break;
      default:
        sketch.setFill('#FFFFFF');
        break;
    }

    const screenPos = {
      x: x * scaleFactors.x,
      y: y * scaleFactors.y,
    };
    sketch.fillRect(
      screenPos.x,
      screenPos.y,
      screenPos.x + scaleFactors.x,
      screenPos.y + scaleFactors.y,
    );
  });
  sketch.popState();
}

sketch.init(setup, draw);