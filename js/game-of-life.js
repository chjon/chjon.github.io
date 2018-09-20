// Set up canvas
var canvas = document.getElementById("game-of-life-canvas");
canvas.width  = innerWidth * 0.9;
canvas.height = innerHeight;

// Constants
const SCALE_FACTOR = 0.06;
const MAX_OPACITY = 0.4;
const FRAME_DELAY = 100;
const INITIAL_PROBABILITY = 0.6;

const GAME_WIDTH = Math.floor(canvas.width * SCALE_FACTOR);
const GAME_HEIGHT = Math.floor(canvas.height * SCALE_FACTOR);
const PIXEL_SIZE = canvas.width / GAME_WIDTH;
const MID_X = GAME_WIDTH / 2;
const MID_Y = GAME_HEIGHT / 2;

// Initialization
let cells = [];
initialize();
setInterval(nextFrame, FRAME_DELAY);

/**
 * Initialize the cells for the game of life
 */
function initialize () {
	// Create array to represent all the cells
	for (let i = 0; i < GAME_WIDTH; i++) {
		cells[i] = [];
		
		for (let j = 0; j < GAME_HEIGHT; j++) {
			// Randomly determine whether the cell should be alive
			cells[i][j] = Math.random() > INITIAL_PROBABILITY;
		}
	}
}

function nextFrame () {
	draw();
	update();
}

/**
 * Update the cells for the game of life
 */
 function update () {
	 // Create new array to represent the next state
	 let newCells = [];
	 
	 for (let i = 0; i < GAME_WIDTH; i++) {
		 newCells[i] = [];
		 
		 for (let j = 0; j < GAME_HEIGHT; j++) {
			 var numNeigbours = countNeighbours(i, j);
			 if (numNeigbours == 2) {
				 newCells[i][j] = cells[i][j];
			 } else if (numNeigbours == 3) {
				 newCells[i][j] = true;
			 } else {
				 newCells[i][j] = false;
			 }
		 }
	 }
	 
	 cells = newCells;
 }
 
 function countNeighbours (x, y) {
	 var count = 0;
	 
	 // Check left
	 if (x > 0) {
		 if (cells[x - 1][y]) count++;
		 
		 // Check up
		 if (y > 0) {
			 if (cells[x - 1][y - 1]) count++;
		 }
		 
		 // Check down
		 if (y < GAME_HEIGHT - 1) {
			 if (cells[x - 1][y + 1]) count++;
		 }
	 }
	 
	 // Check right
	 if (x < GAME_WIDTH - 1) {
		 if (cells[x + 1][y]) count++;
		 
		 // Check up
		 if (y > 0) {
			 if (cells[x + 1][y - 1]) count++;
		 }
		 
		 // Check down
		 if (y < GAME_HEIGHT - 1) {
			 if (cells[x + 1][y + 1]) count++;
		 }
	 }
	 
	 // Check up
	 if (y > 0) {
		 if (cells[x][y - 1]) count++;
	 }
	 
	 // Check down
	 if (y < GAME_HEIGHT - 1) {
		 if (cells[x][y + 1]) count++;
	 }
	 
	 return count;
 }

/**
 * Draw all the cells
 */
function draw () {
	var ctx = canvas.getContext("2d");
	
	// Clear the canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	for (let x = 0; x < GAME_WIDTH; x++) {
		for (let y = 0; y < GAME_HEIGHT; y++) {
			if (cells[x][y]) {
				// Calculate the cell opacity
				var distX = Math.abs(MID_X - x);
				var distY = Math.abs(MID_Y - y);
				var alpha = MAX_OPACITY * (1 - (distX / MID_X)) * (1 - (distY / MID_Y));
				
				// Draw the cell
				ctx.fillStyle = "rgba(0, 255, 0," + alpha + ")";
				ctx.fillRect(PIXEL_SIZE * x, PIXEL_SIZE * y, PIXEL_SIZE, PIXEL_SIZE);
			}
		}
	}
	
	ctx.stroke();
}