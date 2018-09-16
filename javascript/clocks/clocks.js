class AnalogClock {
	constructor (centerX, centerY) {
		this.centerX = centerX;
		this.centerY = centerY;
	}
	
	drawArc (r, startAngle, endAngle) {
		ctx.beginPath();
		ctx.arc(this.centerX, this.centerY, r, startAngle, endAngle);
		ctx.stroke();
	}
	
	/**
	 * Draw the clock
	 */
	draw (date) {
		var year  = date.getFullYear();
		var month = date.getMonth();
		var day   = date.getDate();
		var hours = date.getHours();
		var mins  = date.getMinutes();
		var secs  = date.getSeconds();
		var milli = date.getMilliseconds();
		secs  += milli / 1000;
		mins  += secs / 60;
		hours += mins / 60;
		
		//Draw the clock hands
		var sAngle = -Math.PI/2 + secs  / 30 * Math.PI;
		var mAngle = -Math.PI/2 + mins  / 30 * Math.PI;
		var hAngle = -Math.PI/2 + hours / 12 * Math.PI;
		
		const radiusLimit  = Math.min(canvas.width, canvas.height);
		const arcThickness = radiusLimit / 14;
		const initRadius   = 3 * arcThickness;
		
		var counter = 0;
		
		ctx.lineWidth = arcThickness;
		ctx.strokeStyle = "#00FF00";
		this.drawArc(initRadius + counter++ * arcThickness, hAngle, sAngle);
		ctx.strokeStyle = "#FFFF00";
		this.drawArc(initRadius + counter++ * arcThickness, sAngle, mAngle);
		ctx.strokeStyle = "#FF0000";
		this.drawArc(initRadius + counter++ * arcThickness, mAngle, hAngle);
		
		//Draw the time
		const timeFontSize = Math.floor(radiusLimit / 16);
		const dateFontSize = Math.floor(radiusLimit / 28);
		const baseLine = this.centerY + timeFontSize;
		
		ctx.fillStyle = "#FFFFFF";
		ctx.textAlign = "center";
		ctx.textBaseline = "bottom";
		ctx.font = timeFontSize + "px bgothl";
		ctx.fillText(getTimeStamp(date), this.centerX, baseLine - dateFontSize);
		
		//Draw the date
		ctx.font = dateFontSize + "px bgothl";
		ctx.fillText(getDateStamp(date), this.centerX, baseLine);
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
 * Fill the background and draw the clock
 */
function draw (date) {
	//Fill background
	ctx.fillStyle = "#1B1B1B";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	
	clock.draw(date);
}

function getTimeStamp (date) {
	var hour  = date.getHours();
	var mins  = date.getMinutes();
	var secs  = date.getSeconds();
	
	var timeStamp = "";
	if (hour  < 10) timeStamp += 0;
	timeStamp += hour + ":";
	if (mins  < 10) timeStamp += 0;
	timeStamp += mins + ":";
	if (secs  < 10) timeStamp += 0;
	timeStamp += secs;
	
	return timeStamp;
}

function getDateStamp (date) {
	var year  = date.getFullYear();
	var month = date.getMonth() + 1;
	var day   = date.getDate();
	
	var dateStamp = year + " - ";
	if (month < 10) dateStamp += 0;
	dateStamp += month + " - ";
	if (day   < 10) dateStamp += 0;
	dateStamp += day;
	
	return dateStamp;
}

function drawDebug (date) {
	var row = 1;
	ctx.fillStyle = "#FFFFFF";
	ctx.font = "20px bgothl";
	ctx.textAlign = "left"; 
	ctx.textBaseline = "bottom";
	ctx.fillText("UNIX TIME: " + date.getTime(), 5, row++ * 20);
	ctx.fillText("TIME: " + getDateStamp(date) + " " + getTimeStamp(date), 5, row++ * 20);
}

function update () {
	//Get the current time
	var date = new Date();
	draw(date);
	// drawDebug(date);
}

var canvas = document.getElementById("canvas");
canvas.width  = innerWidth;
canvas.height = innerHeight;
scaleCanvas(0.9, 0.9);

var ctx = canvas.getContext("2d");
var clock = new AnalogClock(Math.floor(canvas.width / 2), Math.floor(canvas.height / 2));

window.setInterval(update, 1);