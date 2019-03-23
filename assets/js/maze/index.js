import * as sketch from '../sketch.js';
import { MazeGenerator } from './mazeGenerator.js';
import { MazeSolver } from './mazeSolver.js';
import { constrainDimensions } from '../array-utils.js';

let window;
let maze;
let mazeGenerator;
let mazeSolver;
let dimensions;
const MILLIS_PER_SECOND = 1000;
const FRAME_INTERVAL = 100;
const RESET_WAIT_SECONDS = 3;
let resetCounter;

function checkReset() {
  if (!resetCounter) {
    resetCounter = MILLIS_PER_SECOND / FRAME_INTERVAL * RESET_WAIT_SECONDS;
    mazeGenerator.initialize(dimensions[0], dimensions[1], 'KRUSKAL', { integrity: 1 });
    maze = mazeGenerator.generate();
    mazeSolver.initialize(maze, 'DIJKSTRA');
  } else {
    resetCounter--;
  }
}

function setup() {
  sketch.setFrameInterval(FRAME_INTERVAL);
  window = { width: sketch.getWidth(), height: sketch.getHeight() };
  mazeGenerator = new MazeGenerator();
  mazeSolver = new MazeSolver();
  dimensions = constrainDimensions([
    { actual: window.width, max: 40 },
    { actual: window.height, max: 40 },
  ]);
  checkReset();
}

function draw() {
  sketch.setLineWidth(2);

  const xCellSize = window.width / dimensions[0];
  const yCellSize = window.height / dimensions[1];

  mazeSolver.draw(sketch, xCellSize, yCellSize);
  if (mazeSolver.step()) {
    checkReset();
  }

  // mazeGenerator.draw(sketch, xCellSize, yCellSize);
  // mazeGenerator.step();

  sketch.setStroke('#FFF');
  maze.draw(sketch, xCellSize, yCellSize);
}

sketch.init(setup, draw);