import * as sketch from '../sketch.js';
import { MazeGenerator } from './mazeGenerator.js';
import { MazeSolver } from './mazeSolver.js';

let window;
let maze;
let mazeGenerator;
let mazeSolver;
let solution;

function constrainDimensions({ actualWidth, actualHeight }, { maxWidth, maxHeight }) {
  const widthInSquares = actualWidth / maxWidth;
  const heightInSquares = actualHeight / maxHeight;
  
  if (widthInSquares > heightInSquares) {
    return {
      numCols: maxWidth,
      numRows: Math.floor(actualHeight / widthInSquares),
    };
  } else {
    return {
      numCols: Math.floor(actualWidth / heightInSquares),
      numRows: maxHeight,
    };
  }
}

function setup() {
  sketch.setFrameInterval(100);
  window = { width: sketch.getWidth(), height: sketch.getHeight() };
  mazeGenerator = new MazeGenerator();
  mazeSolver = new MazeSolver();
  const { numCols, numRows } = constrainDimensions(
    { actualWidth: window.width, actualHeight: window.height },
    { maxWidth: 40, maxHeight: 40 },
  );
  maze = mazeGenerator.generate(numCols, numRows, 'Kruskal');
  //solution = mazeSolver.solveDFS(maze);
  //mazeSolver.solveDFSAnimated(maze);
  mazeSolver.solveWallOnRightAnimated(maze);
}

function draw() {
  sketch.setStroke('#FFF');
  sketch.setLineWidth(2);

  // const hScaleFactor = window.width / maze.width;
  // const vScaleFactor = window.height / maze.height;

  // sketch.setFill('#A00');
  // solution.forEach(({ x, y }) => {
  //   sketch.fillRect(hScaleFactor * x, vScaleFactor * y, hScaleFactor * (x + 1), vScaleFactor * (y + 1));
  // });

  mazeSolver.draw(sketch, window.width, window.height);
  // mazeSolver.solveDFSStep(true);
  mazeSolver.solveWallOnRightStep();

  maze.draw(sketch, window.width, window.height);
}

sketch.init(setup, draw);