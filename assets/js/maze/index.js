import * as sketch from '../sketch.js';
import * as maths from '../math-utils.js';
import { MazeGenerator } from './mazeGenerator.js';
import { MazeSolver } from './mazeSolver.js';
import { constrainDimensions } from '../array-utils.js';
import { addOptionsToSelect, tieButtonToHandler, setProperties } from '../dom-utils.js';

let window;
let maze;
let mazeGenerator;
let mazeSolver;
let dimensions;
const MILLIS_PER_SECOND = 1000;
const FRAME_INTERVAL = 100;
const RESET_WAIT_SECONDS = 3;
let resetCounter;
const inputs = {};
const solverArgs = {};

function resetMaze() {
	maze = mazeGenerator.initialize(dimensions[0], dimensions[1], inputs.generator.alg);
	if (!inputs.generator.autoAnimate) {
		mazeGenerator.generate();
	}
}

function resetPositions() {
	if (inputs.options.startPos.rand) {
		solverArgs.startPos = {
			x: maths.randInt(0, maze.width),
			y: maths.randInt(0, maze.height),
		};
		setProperties('start-x', { value: solverArgs.startPos.x });
		setProperties('start-y', { value: solverArgs.startPos.y });
	} else {
		solverArgs.startPos = inputs.options.startPos;
	}
	if (inputs.options.endPos.rand) {
		solverArgs.endPos = {
			x: maths.randInt(0, maze.width),
			y: maths.randInt(0, maze.height),
		};
		setProperties('stop-x', { value: solverArgs.endPos.x });
		setProperties('stop-y', { value: solverArgs.endPos.y });
	} else {
		solverArgs.endPos = inputs.options.endPos;
	}
}

function resetSolver() {
	mazeSolver.initialize(maze, inputs.solver.alg, solverArgs);
	if (!inputs.solver.autoAnimate) {
		mazeSolver.solve();
	}
}

function checkReset() {
  if (!resetCounter) {
		getInputs();
		const { generator, solver, options } = inputs;

    resetCounter = MILLIS_PER_SECOND / FRAME_INTERVAL * RESET_WAIT_SECONDS;

		if (!maze) {
    	maze = mazeGenerator.initialize(dimensions[0], dimensions[1], generator.alg, { integrity: 1 });
		}

		switch (options.autoReset) {
			case 'ALL':
				resetMaze();
			case 'SOLVER AND POSITIONS':
				resetPositions();
			case 'SOLVER ONLY':
				resetSolver();
			default:
				break;
		}

  } else {
    resetCounter--;
  }
}

function getInputs() {
	inputs.generator = {
		alg: document.getElementById('gen-selector').value.toUpperCase(),
		autoAnimate: document.getElementById('gen-auto-animate').checked,
	};
	inputs.solver = {
		alg: document.getElementById('alg-selector').value.toUpperCase(),
		autoAnimate: document.getElementById('alg-auto-animate').checked,
	};
	inputs.options = {
		autoReset: document.getElementById('auto-reset').value.toUpperCase(),
		startPos: {
			x: parseInt(document.getElementById('start-x').value),
			y: parseInt(document.getElementById('start-y').value),
			rand: document.getElementById('start-rand').checked,
		},
		endPos: {
			x: parseInt(document.getElementById('stop-x').value),
			y: parseInt(document.getElementById('stop-y').value),
			rand: document.getElementById('stop-rand').checked,
		},
	};
}

function setup() {
	addOptionsToSelect('gen-selector', [
		'Kruskal\'s',
		'DFS',
	]);
	addOptionsToSelect('alg-selector', [
		'Dijkstra\'s',
		'DFS',
		'BFS',
		'Backtrack DFS',
		'Keep-right'
	]);
	addOptionsToSelect('auto-reset', [
		'All',
		'Solver and positions',
		'Solver only',
		'None',
	]);
	tieButtonToHandler('reset', () => {
		resetCounter = 0;
		checkReset();
	});

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