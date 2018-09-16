/**
 * Lindenmayer system class
 */
class LSystem {
	/**
	 * Create a new Lindenmayer system
	 */
	constructor () {
		this.rules = new Map();
	}
	
	/**
	 * Add a new production rule for the L-System
	 * @param key   The character to be replaced
	 * @param value A string with which to replace the key
	 */
	addRule (key, value) {
		this.rules.set(key, value);
	}
	
	/**
	 * Remove all rules
	 */
	clearRules () {
		this.rules.clear();
	}
	
	/**
	 * Apply the production rules to the axiom string
	 * @param axiom A seed string of the variables to be replaced
	 */
	generate (axiom) {
		var newString = "";
		
		for (let i = 0; i < axiom.length; i++) {
			var curChar = axiom.charAt(i);
			 
			if (this.rules.has(curChar)) {
				newString += (this.rules.get(curChar));
			} else {
				newString += (curChar);
			}
		}
		
		return newString;
	}
	
	/**
	 * Apply the production rules to the axiom strings multiples times
	 * @param axiom      A seed string of the variables to be replaced
	 * @param iterations The number of times to apply the production rules
	 */
	generateN (axiom, iterations) {
		for (let i = 0; i < iterations; i++) {
			axiom = this.generate(axiom);
		}
		
		return axiom;
	}
}

/**
 * Turtle graphics class
 */
class Turtle {
	/**
	 * Create a new turtle
	 * @param posX      The initial x-coordinate
	 * @param posY      The initial y-coordinate
	 * @param initAngle The initial angle in radians, counterclockwise from the x-axis
	 * @param stepSize  The distance by which the turtle moves each step
	 * @param rotAngle  The angle in radians, counterclockwise, by which the turtle rotates
	 * @param colour    The initial colour that the turtle draws in
	 * @param ctx       The context in which the turtle moves
	 * @param commands  A list of commands
	 */
	constructor (posX, posY, initAngle, stepSize, rotAngle, colour, ctx, commands) {
		//Initialize drawing
		this.ctx = ctx;
		this.ctx.strokeStyle = colour;
		this.ctx.beginPath();
		
		this.stepSize = stepSize;
		this.rotAngle = rotAngle;
		this.commands = commands;
		
		//Position information
		this.initX = posX;
		this.initY = posY;
		this.initAngle = initAngle;
		this.setInit(posX, posY, initAngle);
		this.set(posX, posY, -initAngle);
		this.stack = new Array();
	}
	
	/**
	 * Step in the direction the turtle is facing
	 * @param distance The distance to move
	 * @param draw     Whether to draw a line
	 */
	step (distance) {
		this.posX += distance * Math.cos(this.angle);
		this.posY += distance * Math.sin(this.angle);
		
		this.ctx.lineTo(this.posX, this.posY);
	}
	
	/**
	 * Load a position
	 * @param posX  The new x-coordinate
	 * @param posY  The new y-coordinate
	 * @param angle The new angle
	 */
	set (posX, posY, angle) {
		this.posX  = posX;
		this.posY  = posY;
		this.angle = angle;
		
		this.ctx.moveTo(this.posX, this.posY, this.angle);
	}
	
	/**
	 * Set initial parameters
	 * @param initX     The new initial x-coordinate
	 * @param initY     The new initial y-coordinate
	 * @param initAngle The new initial angle
	 */
	setInit (initX, initY, initAngle) {
		this.initX     = initX;
		this.initY     = initY;
		this.initAngle = initAngle;
	}
	
	/**
	 * Load the initial position
	 */
	reset () {
		this.ctx.beginPath();
		this.set(this.initX, this.initY, -this.initAngle);
	}
	
	/**
	 * Rotate the turtle
	 * @param angle The angle in radians, counterclockwise
	 */
	rotate (angle) {
		this.angle -= angle;
	}
	
	/**
	 * Move the turtle according to the instructions given by a string
	 * @param instructions A string encoded with the turtle's instructions
	 */
	follow (instructions) {
		for (let i = 0; i < instructions.length; i++) {
			var curInstruction = instructions.charAt(i);
			
			switch (curInstruction) {
				//Step forward and draw a line
				case this.commands[0]:
					this.step(this.stepSize);
					break;
				
				//Turn to the left
				case this.commands[1]:
					this.rotate(this.rotAngle);
					break;
					
				//Turn to the right
				case this.commands[2]:
					this.rotate(-this.rotAngle);
					break;
				
				//Save the current position and orientation
				case this.commands[3]:
					this.stack.push([this.posX, this.posY, this.angle]);
					break;
				
				//Load the last saved position and orientation
				case this.commands[4]:
					var pos = this.stack.pop();
					this.set(pos[0], pos[1], pos[2]);
					break;
			}
		}
	}
	
	/**
	 * Draw the turtle's path
	 */
	draw () {
		this.ctx.stroke();
	}
}

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
 * Reset the turtle and redraw the scene
 */
function redraw () {
	turtle.reset();
	turtle.follow(instructions);
	draw();
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
	constructor (slider, textbox, min, max, value, callback) {
		slider.min = min;
		slider.max = max;
		slider.value = value;
		textbox.innerHTML = slider.value;
		
		slider.oninput = function () {
			textbox.innerHTML = slider.value;
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
 * Set up the GUI controls
 */
function initializeGUIControls () {
	//Change the rotation angle
	new SliderControl(
		document.getElementById("slider-angle"),
		document.getElementById("text-angle"),
		0, 360, 90,
		function (slider, textbox) {
			turtle.rotAngle = slider.value / 180 * Math.PI;
			redraw();
		}
	);
	
	//Change the step size
	new SliderControl(
		document.getElementById("slider-step-size"),
		document.getElementById("text-step-size"),
		1, 256, 1,
		function (slider, textbox) {
			turtle.stepSize = slider.value;
			redraw();
		}
	);
	
	//Change the initial x-coordinate
	new SliderControl(
		document.getElementById("slider-init-x"),
		document.getElementById("text-init-x"),
		0, canvas.width, canvas.width / 2,
		function (slider, textbox) {
			turtle.initX = parseInt(slider.value);
			redraw();
		}
	);
	
	//Change the initial y-coordinate
	new SliderControl(
		document.getElementById("slider-init-y"),
		document.getElementById("text-init-y"),
		0, canvas.height, canvas.height / 2,
		function (slider, textbox) {
			turtle.initY = parseInt(slider.value);
			redraw();
		}
	);
	
	//Change the initial angle
	new SliderControl(
		document.getElementById("slider-init-angle"),
		document.getElementById("text-init-angle"),
		0, 360, 0,
		function (slider, textbox) {
			turtle.initAngle = parseInt(slider.value) / 180 * Math.PI;
			redraw();
		}
	);
	
	//Change the red part of the colour
	new SliderControl(
		document.getElementById("slider-draw-red"),
		document.getElementById("text-draw-red"),
		0, 255, 255,
		function (slider, textbox) {
			setColor();
			redraw();
		}
	);
	
	//Change the green part of the colour
	new SliderControl(
		document.getElementById("slider-draw-green"),
		document.getElementById("text-draw-green"),
		0, 255,	255,
		function (slider, textbox) {
			setColor();
			redraw();
		}
	);
	
	//Change the blue part of the colour
	new SliderControl(
		document.getElementById("slider-draw-blue"),
		document.getElementById("text-draw-blue"),
		0, 255, 255,
		function (slider, textbox) {
			setColor();
			redraw();
		}
	);
	
	/**
	 * Set the stroke colour based on the sliders
	 */
	function setColor () {
		ctx.strokeStyle = "rgb(" +
			document.getElementById("slider-draw-red").value + "," +
			document.getElementById("slider-draw-green").value + "," +
			document.getElementById("slider-draw-blue").value + ")";
	}
	
	redraw();
}

function initializeLSystemControls () {
	//Add a production rule
	var input_addRule = document.getElementById("input-add-rule");
	var ruleList = document.getElementById("rule-list");
	input_addRule.onclick = function () {
		var colIndex = 0;
		var row = ruleList.insertRow(0);
		
		//Add inputs to the table
		row.insertCell(colIndex++).append(new TextInput(1, 1).get());
		row.insertCell(colIndex++).innerHTML = "to";
		row.insertCell(colIndex++).append(new TextInput(5, undefined).get());
		row.insertCell(colIndex++).append(new ButtonInput("Remove", function (buttonInput) {
			var i = buttonInput.parentNode.parentNode.rowIndex;
			ruleList.deleteRow(i);
		}).get());
	}
	
	//Remove all production rules
	var input_clearRule = document.getElementById("input-clear-rule");
	input_clearRule.onclick = function () {
		while (ruleList.rows.length > 0) {
			ruleList.deleteRow(0);
		}
	}
	
	//Add a variable definition
	var input_addDef = document.getElementById("input-add-def");
	var defList = document.getElementById("def-list");
	input_addDef.onclick = function () {
		var colIndex = 0;
		var row = defList.insertRow(0);
		
		//Add the text input for the variable
		row.insertCell(colIndex++).append(new TextInput(1, 1).get());
		
		//Add command options
		let options = ["Step and draw", "Turn left", "Turn right", "Save position", "Load position"];
		var valueContainer = row.insertCell(colIndex++);
		var valueInput = document.createElement("select");
		valueContainer.append(valueInput);
		valueInput.type = "text";
		
		for (let i = 0; i < options.length; i++) {
			var opt = document.createElement("option");
			opt.innerHTML = options[i];
			valueInput.appendChild(opt);
		}
		
		//Add the button to remove the variable definition
		row.insertCell(colIndex++).append(new ButtonInput("Remove", function (buttonInput) {
			var i = buttonInput.parentNode.parentNode.rowIndex;
			defList.deleteRow(i);
		}).get());
	}
	
	//Remove all variable definitions
	var input_clearDef = document.getElementById("input-clear-def");
	input_clearDef.onclick = function () {
		while (defList.rows.length > 0) {
			defList.deleteRow(0);
		}
	}
	
	//Change the number of iterations
	new SliderControl(
		document.getElementById("slider-num-iter"),
		document.getElementById("text-num-iter"),
		0, 10, 0,
		function (slider, textbox) {}
	);
	
	//Generate new instructions based on the current axiom, production rules,
	//and variable definitions
	var input_run = document.getElementById("input-run");
	input_run.onclick = function () {
		redraw(generateInstructions());
	}
}

/**
 * Generate new instructions based on the current axiom, production rules,
 * and variable definitions
 */
function generateInstructions () {
	lSystem.clearRules();
	
	var ruleList = document.getElementById("rule-list");
	var defList = document.getElementById("def-list");
		
	//Get rules
	for (let i = 0; i < ruleList.rows.length; i++) {
		var key = ruleList.rows[i].cells[0].childNodes[0].value;
		var val = ruleList.rows[i].cells[2].childNodes[0].value;
		lSystem.addRule(key, val);
	}
	
	var axiom = document.getElementById("input-axiom").value;
	var numIter = document.getElementById("slider-num-iter").value;
	var result = lSystem.generateN(axiom, numIter);
	
	let dictionary = new Map();
	
	//Get definitions
	for (let i = 0; i < defList.rows.length; i++) {
		var key = defList.rows[i].cells[0].childNodes[0].value;
		var index = defList.rows[i].cells[1].childNodes[0].selectedIndex;
		
		dictionary.set(key, turtle.commands[index]);
	}
	
	instructions = "";
	
	//Generate instructions
	for (let i = 0; i < result.length; i++) {
		var curChar = result.charAt(i);
		
		if (dictionary.has(curChar)) {
			instructions += dictionary.get(curChar);
		}
	}
	
	return instructions;
}

/**
 * Fill the background and draw the turtle
 */
function draw () {
	//Fill background
	ctx.fillStyle = "#1B1B1B";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	
	//Draw turtle
	turtle.draw();
}

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var instructions = "";
scaleCanvas(0.6, 0.8);

let lSystem = new LSystem();

let turtle = new Turtle(
	canvas.width / 2,   //The initial x-coordinate
	canvas.height / 2,  //The initial y-coordinate
	0,                  //The initial angle in radians, clockwise from the x-axis
	1,                  //The step size
	Math.PI / 4,        //The rotation angle in radians, clockwise
	"#FFFFFF",			//The initial colour that the turtle draws in
	ctx,                //The context in which the turtle moves
	['W', 'A', 'D', 'S', 'L']
);

initializeLSystemControls();
initializeGUIControls();