import * as sketch from '../sketch.js';
import { MazeGenerator } from './mazeGenerator.js';
import { MazeSolver } from './mazeSolver.js';
import { constrainDimensions } from '../array-utils.js/index.js';

let window;
let maze;
let mazeGenerator;
let mazeSolver;
let solution;

function setup() {
  sketch.setFrameInterval(100);
  window = { width: sketch.getWidth(), height: sketch.getHeight() };
  mazeGenerator = new MazeGenerator();
  mazeSolver = new MazeSolver();
  const [numCols, numRows] = constrainDimensions([
    { actual: window.width, max: 40 },
    { actual: window.height, max: 40 },
  ]);
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