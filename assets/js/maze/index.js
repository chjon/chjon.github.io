import * as sketch from '../sketch.js';
import { MazeGenerator } from './mazeGenerator.js';
import { MazeSolver } from './mazeSolver.js';
import { constrainDimensions } from '../array-utils.js/index.js';

let window;
let maze;
let mazeGenerator;
let mazeSolver;

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
  mazeSolver.initialize(maze, 'KEEP_RIGHT', { dir: 2 });
}

function draw() {
  sketch.setStroke('#FFF');
  sketch.setLineWidth(2);

  const xCellSize = window.width / maze.width;
  const yCellSize = window.height / maze.height;

  mazeSolver.draw(sketch, xCellSize, yCellSize);
  mazeSolver.step();

  maze.draw(sketch, window.width, window.height);
}

sketch.init(setup, draw);