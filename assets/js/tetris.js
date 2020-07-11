const FPS = 60;
let canvases;
let tetris;

function line(ctx, x1, y1, x2, y2) {
	ctx.save();
	ctx.beginPath();

	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);

	ctx.closePath();
	ctx.restore();
	ctx.stroke();
}

class PreviewCanvas {
	constructor(previewCanvas) {
		this.ctx = previewCanvas;
	}

	onResize() {

	}

	draw() {

	}
}

class Tetris {
	constructor(canvases) {
		this.holdCanvas = new PreviewCanvas(canvases.hold);
		this.nextCanvas = new PreviewCanvas(canvases.next);
		this.ctx = canvases.game;
		this.gridDim = { x: 10, y: 20 };
	}

	onResize() {
		// Calculate grid size and position
		this.gridTileDim  = { x: this.ctx.canvas.width / this.gridDim.x, y: this.ctx.canvas.height / this.gridDim.y };
		this.gridPixelDim = { x: this.ctx.canvas.width, y: this.ctx.canvas.height };	
	}

	init() {
		this.onResize();
	}

	drawGameGrid() {
		this.ctx.strokeStyle = "#FFFFFF";
		// Draw vertical lines
		for (let x = 0; x <= this.gridDim.x; ++x) {
			line(this.ctx,
				Math.round(x * this.gridTileDim.x), Math.round(0),
				Math.round(x * this.gridTileDim.x), Math.round(this.gridPixelDim.y)
			);
		}
		// Draw horizontal lines
		for (let y = 0; y <= this.gridDim.y; ++y) {
			line(this.ctx,
				Math.round(0),                   Math.round(y * this.gridTileDim.y),
				Math.round(this.gridPixelDim.x), Math.round(y * this.gridTileDim.y)
			);
		}
	}

	draw() {
		// Draw game grid
		this.drawGameGrid();
	}
}

function setUpCanvas(canvasName) {
	let canvas = document.getElementById(canvasName);
	canvas.width = canvas.offsetWidth;
	canvas.height = canvas.offsetHeight;
	return canvas.getContext('2d');
}

window.onload = () => {
	canvases = {
		hold: setUpCanvas("hold-canvas"),
		next: setUpCanvas("next-canvas"),
		game: setUpCanvas("game-canvas")
	};
	tetris = new Tetris(canvases);
	tetris.init();
	setInterval(() => {
		Object.values(canvases).forEach((ctx) => {
			ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
			tetris.draw();
		});
	}, 1000 / FPS);
}

window.onresize = () => {
	Object.values(canvases).forEach((ctx) => {
		ctx.canvas.width  = ctx.canvas.offsetWidth;
		ctx.canvas.height = ctx.canvas.offsetHeight;
	});
	tetris.onResize();
};