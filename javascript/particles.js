//scale canvas
function scaleCanvas () {
	canvas.width = 0.60 * innerWidth;
	canvas.height = 0.60 * innerHeight;
}

//Render everything
function draw () {
	if (headerBrightness < 0) {
		headerBrightness += 0.08;
		header.style.opacity = Math.pow(2, headerBrightness);
	}
	
	//Fill background
	ctx.fillStyle = "#0D0D0D";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	
	framesPassed++;
	
	if (framesPassed > framesPerParticle) {
		particles.push(new Particle(0, (maxSpeed - minSpeed) * Math.random()));
		framesPassed = 0;
	}
	
	//Draw particles
	for (let i = 0; i < particles.length; i++) {
		if (particles[i].alpha > 2 * maxAlpha) {
			particles.splice(i, 1);
		} else {
			particles[i].update();
			particles[i].show();
		}
	}
}

//Particle class
class Particle {
	constructor (velX, velY) {
		this.velX = velX;
		this.velY = velY + minSpeed;
		this.posX = Math.random() * (canvas.width - maxSize);
		this.posY = maxSize / 2 + 1;
		this.size = velY / (maxSpeed - minSpeed) * (maxSize - 1) + 1;
		this.alpha = 0;
	}
	
	update () {
		this.posX += this.velX;
		this.posY += this.velY;
		this.alpha++;
	}
	
	show () {		
		if (this.alpha <= maxAlpha) {
			ctx.fillStyle = "rgba(12, 97, 12," + (this.alpha / maxAlpha) + ")";
		} else {
			ctx.fillStyle = "rgba(12, 97, 12," + ((2 * maxAlpha - this.alpha) / maxAlpha) + ")";
		}
		
		ctx.fillRect(this.posX, this.posY, this.size, this.size);
	}
}

var canvas = document.getElementById("canvas");
var header = document.getElementById("header");
var ctx = canvas.getContext("2d");
scaleCanvas();

const framesPerParticle = 4;
const maxAlpha = 800;
const maxSize = 8;
const minSpeed = 0.1;
const maxSpeed = (canvas.height / 2 / maxAlpha);

var framesPassed = 0;
var headerBrightness = -8;
let particles = [];
setInterval(draw, 8);
