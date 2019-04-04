import * as sketch from '../sketch.js';
import * as maths from '../math-utils.js';
import { MazeGenerator } from './mazeGenerator.js';
import { MazeSolver } from './mazeSolver.js';
import { constrainDimensions } from '../array-utils.js';
import {
	addOptionsToSelect,
	tieButtonToHandler,
	setPropertiesById,
	setPropertiesByClass,
} from '../dom-utils.js';

let window;
let maze;
let mazeGenerator;
let mazeSolver;
let dimensions;
const MILLIS_PER_SECOND = 1000;
const FRAME_INTERVAL = 100;
const RESET_WAIT_SECONDS = 3;
let resetCounter;
const inputs = { options: { autoReset: true } };
const solverArgs = {};
let state = 'GENERATE';

function resetMaze() {
	getInputs();
	maze = mazeGenerator.initialize(dimensions[0], dimensions[1], inputs.generator.alg);
	if (!inputs.generator.autoAnimate) {
		mazeGenerator.generate();
		state = 'SOLVE'
	}
}

function resetPositions() {
	getInputs();
	if (inputs.options.startPos.rand) {
		solverArgs.startPos = {
			x: maths.randInt(0, maze.width),
			y: maths.randInt(0, maze.height),
		};
		setPropertiesById('start-x', { value: solverArgs.startPos.x });
		setPropertiesById('start-y', { value: solverArgs.startPos.y });
	} else {
		solverArgs.startPos = inputs.options.startPos;
	}
	if (inputs.options.endPos.rand) {
		solverArgs.endPos = {
			x: maths.randInt(0, maze.width),
			y: maths.randInt(0, maze.height),
		};
		setPropertiesById('stop-x', { value: solverArgs.endPos.x });
		setPropertiesById('stop-y', { value: solverArgs.endPos.y });
	} else {
		solverArgs.endPos = inputs.options.endPos;
	}
}

function resetSolver() {
	getInputs();
	mazeSolver.initialize(maze, inputs.solver.alg, solverArgs);
	if (!inputs.solver.autoAnimate) {
		mazeSolver.solve();
	}
}

function checkReset() {
	resetCounter = MILLIS_PER_SECOND / FRAME_INTERVAL * RESET_WAIT_SECONDS;
	state = 'GENERATE';
	getInputs();
	const { generator, options } = inputs;

	if (!maze) {
		maze = mazeGenerator.initialize(dimensions[0], dimensions[1], generator.alg, { integrity: 1 });
	}

	switch (options.resetLevel) {
		case 'ALL':
			resetMaze();
		case 'SOLVER AND POSITIONS':
			resetPositions();
		case 'SOLVER ONLY':
			resetSolver();
		default:
			break;
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
		...inputs.options,
		resetLevel: document.getElementById('reset-level').value.toUpperCase(),
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
	addOptionsToSelect('reset-level', [
		'All',
		'Solver and positions',
		'Solver only',
	]);
	tieButtonToHandler('reset', () => {
		resetCounter = 0;
		checkReset();
	});
	tieButtonToHandler('auto-reset', (button) => {
		inputs.options.autoReset = button.checked;
	});

  sketch.setFrameInterval(FRAME_INTERVAL);
  window = { width: sketch.getWidth(), height: sketch.getHeight() };
  mazeGenerator = new MazeGenerator();
  mazeSolver = new MazeSolver();
  dimensions = constrainDimensions([
    { actual: window.width, max: 40 },
    { actual: window.height, max: 40 },
  ]);

	setPropertiesByClass('control-number', { min: 0, value: 0, step: 1 });
	setPropertiesById('start-x', { max: dimensions[0] - 1 });
	setPropertiesById('start-y', { max: dimensions[1] - 1 });
	setPropertiesById('stop-x', { max: dimensions[0] - 1 });
	setPropertiesById('stop-y', { max: dimensions[1] - 1 });

  checkReset();
}

function draw() {
  sketch.setLineWidth(2);

  const xCellSize = window.width / dimensions[0];
  const yCellSize = window.height / dimensions[1];

	if (state === 'GENERATE') {
		if (mazeGenerator.step()) {
			switch (inputs.options.resetLevel) {
				case 'SOLVER AND POSITIONS':
					resetPositions();
				case 'SOLVER ONLY':
					resetSolver();
				default:
					state = 'SOLVE';
					break;
			}
		}
	
  	sketch.setStroke('#FFF');
		maze.draw(sketch, xCellSize, yCellSize);
  	mazeGenerator.draw(sketch, xCellSize, yCellSize);
	} else if (state === 'SOLVE') {
		if (mazeSolver.step()) {
			resetCounter--;
			
			if (resetCounter <= 0 && inputs.options.autoReset) {
				checkReset();
			}
		}

		mazeSolver.draw(sketch, xCellSize, yCellSize);
		sketch.setStroke('#FFF');
		maze.draw(sketch, xCellSize, yCellSize);
	}
}

sketch.init(setup, draw);