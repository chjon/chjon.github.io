/**
 * Scale the canvas
 * @param xScale The amount by which to scale along the x-axis
 * @param yScale The amount by which to scale along the y-axis
 */
function scaleCanvas (xScale, yScale) {
	canvas.width  = xScale * innerWidth;
	canvas.height = yScale * innerHeight;
}

/**
 * A class for tying slider controls to textboxes
 */
class SliderControl {
	/**
	 * Tie a slider to a textbox
	 * @param slider   The slider input
	 * @param textbox  The textbox that displays the slider's value
	 * @param min      The minimum value for the slider
	 * @param max      The maximum value for the slider
	 * @param callback The function to be called when the slider is updated
	 */
	constructor (slider, textbox, min, max, value, width, callback) {
		slider.min = min;
		slider.max = max;
		slider.value = value;
		textbox.size = width;
		textbox.value = slider.value;
		
		slider.oninput = function () {
			textbox.value = slider.value;
			callback(slider, textbox);
		}
		
		textbox.oninput = function () {
			slider.value = Math.min(slider.max, Math.max(slider.min, textbox.value));
			callback(slider, textbox);
		}
	}
}

/**
 * A class for generating text inputs
 */
class TextInput {
	/**
	 * Create a text input box
	 * @param size The width of the textbox in characters
	 * @param maxChars The maximum number of characters that can be entered
	 */
	constructor (size, maxChars) {
		var textInput = document.createElement("input");
		textInput.type = "text";
		textInput.size = size;
		
		textInput.onkeyup = function () {
			if (textInput.value.length >= maxChars) {
				textInput.value = textInput.value.substring(0, maxChars);
			}
		}
		
		this.textInput = textInput;
	}
	
	/**
	 * Return the text input
	 */
	get () {
		return this.textInput;
	}
}

/**
 * A class for generating button inputs
 */
class ButtonInput {
	/**
	 * Create a button input
	 * @param value    The text to be displayed on the button
	 * @param callback The function to be called when the button is pressed
	 */
	constructor (value, callback) {
		var buttonInput = document.createElement("input");
		buttonInput.type = "button";
		buttonInput.value = value;
		
		buttonInput.onclick = function () {
			callback(buttonInput);
		}
		
		this.buttonInput = buttonInput;
	}
	
	/**
	 * Return the button input
	 */
	get () {
		return this.buttonInput;
	}
}

/**
 * A class for generating color inputs
 */
class ColorInput {
	/**
	 * Create a color input
	 * @param value    The text to be displayed on the button
	 * @param callback The function to be called when the color is changed
	 */
	constructor (value, callback) {
		var colorInput = document.createElement("input");
		colorInput.type = "color";
		colorInput.value = value;
		
		colorInput.onchange = function () {
			callback(colorInput);
		}
		
		this.colorInput = colorInput;
	}
	
	/**
	 * Return the button input
	 */
	get () {
		return this.colorInput;
	}
}

function getRandomColor () {
	return "#" +
		Math.floor(255 * Math.random()).toString(16) +
		Math.floor(255 * Math.random()).toString(16) +
		Math.floor(255 * Math.random()).toString(16);
}

function initializeControls () {
	//Add four colour selectors
	var colorSelectorTable = document.getElementById("color-selector-table");
	for (let i = 0; i < CRITICAL_SIZE; i++) {
		var colIndex = 0;
		var row = colorSelectorTable.insertRow(colorSelectorTable.length);
		
		//Add the label for the input
		var textNode = document.createTextNode("" + i + ": ");
		row.insertCell(colIndex++).append(textNode);
		
		var colorInput = new ColorInput(getRandomColor(), function (colorInput) {
			draw();
		}).get();
		colorInput.id = "color-input-" + i;
		row.insertCell(colIndex).append(colorInput);
	}
	
	//Change the size of the grid
	new SliderControl(
		document.getElementById("slider-grid-size"),
		document.getElementById("text-grid-size"),
		3, 300, 75, 2,
		function (slider, textbox) {}
	);
	
	//Change the initial pile size
	new SliderControl(
		document.getElementById("slider-init-size"),
		document.getElementById("text-init-size"),
		4, 100000, 10000, 2,
		function (slider, textbox) {}
	);
	
	//Randomize colours
	var input_run = document.getElementById("input-rand");
	input_run.onclick = function () {
		for (let i = 0; i < CRITICAL_SIZE; i++) {
			var colorInput = document.getElementById("color-input-" + i);
			colorInput.value = getRandomColor();
		}
		
		draw();
	}
	
	//Get data from controls
	var input_run = document.getElementById("input-run");
	input_run.onclick = function () {
		sandpile = generateImage();
		gridSize = getGridSize();
		draw();
	}
}

function getColors () {
	let colors = [];
		
	for (let i = 0; i < CRITICAL_SIZE; i++) {
		var colorInput = document.getElementById("color-input-" + i);
		
		colors[i] = colorInput.value;
	}
	
	return colors;
}

function getGridSize () {
	return document.getElementById("slider-grid-size").value;
}

function getInitSize () {
	return document.getElementById("slider-init-size").value;
}

function generateImage () {
	var gridSize = getGridSize();
	var pileSize = getInitSize();
	
	//Create array to represent all the cells
	let cells = [];
	for (let i = 0; i < gridSize; i++) {
		cells[i] = [];
		
		for (let j = 0; j < gridSize; j++) {
			cells[i][j] = 0;
		}
	}
	
	//Create stack to store all the piles that need to be updated
	let stack = [];
	var centre = Math.floor(gridSize / 2);
	
	//Add initial pile to centre
	cells[centre][centre] = pileSize;
	stack.push([centre, centre]);
	
	//Make sandpile fall down
	while (stack.length > 0) {
		var coords = stack.pop();
		var x = coords[0];
		var y = coords[1];
		var xM = x - 1;
		var xP = x + 1;
		var yM = y - 1;
		var yP = y + 1;
		
		var splitSize = Math.floor(cells[x][y] / CRITICAL_SIZE);
		cells[x][y] %= CRITICAL_SIZE;
		
		if (splitSize >= CRITICAL_SIZE) {
			//Add to the left
			if (x > 0) {
				if (cells[xM][y] < CRITICAL_SIZE) {
					stack.push([xM, y]);
				}
				
				cells[xM][y] += splitSize;
			}
			
			//Add to the right
			if (xP < gridSize) {
				if (cells[xP][y] < CRITICAL_SIZE) {
					stack.push([xP, y]);
				}
				
				cells[xP][y] += splitSize;
			}
			
			//Add to the top
			if (y > 0) {
				if (cells[x][yM] < CRITICAL_SIZE) {
					stack.push([x, yM]);
				}
				
				cells[x][yM] += splitSize;
			}
			
			//Add to the bottom
			if (y < gridSize - 1) {
				if (cells[x][yP] < CRITICAL_SIZE) {
					stack.push([x, yP]);
				}
				
				cells[x][yP] += splitSize;
			}
		} else {
			//Add to the left
			if (x > 0) {
				if (cells[xM][y] < CRITICAL_SIZE) {
					if ((cells[xM][y] += splitSize) >= CRITICAL_SIZE) {
						stack.push([xM, y]);
					}
				} else {
					cells[xM][y] += splitSize;
				}
			}
			
			//Add to the right
			if (xP < gridSize) {
				if (cells[xP][y] < CRITICAL_SIZE) {
					if ((cells[xP][y] += splitSize) >= CRITICAL_SIZE) {
						stack.push([xP, y]);
					}
				} else {
					cells[xP][y] += splitSize;
				}
			}
			
			//Add to the top
			if (y > 0) {
				if (cells[x][yM] < CRITICAL_SIZE) {
					if ((cells[x][yM] += splitSize) >= CRITICAL_SIZE) {
						stack.push([x, yM]);
					}
				} else {
					cells[x][yM] += splitSize;
				}
			}
			
			//Add to the bottom
			if (y < gridSize - 1) {
				if (cells[x][yP] < CRITICAL_SIZE) {
					if ((cells[x][yP] += splitSize) >= CRITICAL_SIZE) {
						stack.push([x, yP]);
					}
				} else {
					cells[x][yP] += splitSize;
				}
			}
		}
	}
	
	console.log(cells);
	return cells;
}

/**
 * Fill the background and draw the turtle
 */
function draw () {
	var colors = getColors();
	var pixelSize = canvas.height / gridSize;
	
	//Fill background
	ctx.fillStyle = colors[0];
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	
	var baseX = Math.floor((canvas.width - gridSize * pixelSize) / 2);
	var baseY = Math.floor((canvas.height - gridSize * pixelSize) / 2);
	
	for (let i = 0; i < gridSize; i++) {
		for (let j = 0; j < gridSize; j++) {
			ctx.fillStyle = colors[sandpile[i][j]];
			ctx.fillRect(baseX + pixelSize * i, baseY + pixelSize * j, pixelSize, pixelSize);
		}
	}
}

const CRITICAL_SIZE = 4;

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var sandpile;
var gridSize;
scaleCanvas(0.90, 0.80);

initializeControls();