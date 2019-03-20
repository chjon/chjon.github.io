import * as sketch from '../sketch.js';
import { MazeGenerator } from './mazeGenerator.js';
import { MazeSolver } from './mazeSolver.js';
import { constrainDimensions } from '../array-utils.js/index.js';

let window;
let maze;
let mazeGenerator;
let mazeSolver;
let dimensions;

function setup() {
  sketch.setFrameInterval(100);
  window = { width: sketch.getWidth(), height: sketch.getHeight() };
  mazeGenerator = new MazeGenerator();
  mazeSolver = new MazeSolver();
  const [numCols, numRows] = dimensions = constrainDimensions([
    { actual: window.width, max: 40 },
    { actual: window.height, max: 40 },
  ]);
  mazeGenerator.initialize(numCols, numRows, 'KRUSKAL', { integrity: 0.9 });
  maze = mazeGenerator.generate();
  mazeSolver.initialize(maze, 'KEEP_RIGHT', { dir: 2 });
}

function draw() {
  sketch.setStroke('#FFF');
  sketch.setLineWidth(2);

  const xCellSize = window.width / dimensions[0];
  const yCellSize = window.height / dimensions[1];

  mazeSolver.draw(sketch, xCellSize, yCellSize);
  mazeSolver.step();

  // mazeGenerator.draw(sketch, xCellSize, yCellSize);
  // mazeGenerator.step();

  maze.draw(sketch, xCellSize, yCellSize);
}

sketch.init(setup, draw);