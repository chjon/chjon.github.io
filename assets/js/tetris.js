const FPS = 60;
let canvases;
let tetris;
const gamePieces = {
	i: [[0, 0, 0, 0],[1, 1, 1, 1],[0, 0, 0, 0],[0, 0, 0, 0]],
	j: [[0, 0, 0, 0],[1, 1, 1, 0],[0, 0, 1, 0],[0, 0, 0, 0]],
	l: [[0, 0, 0, 0],[0, 1, 1, 1],[0, 1, 0, 0],[0, 0, 0, 0]],
	o: [[0, 0, 0, 0],[0, 1, 1, 0],[0, 1, 1, 0],[0, 0, 0, 0]],
	s: [[0, 0, 0, 0],[0, 0, 1, 1],[0, 1, 1, 0],[0, 0, 0, 0]],
	t: [[0, 0, 0, 0],[0, 0, 1, 0],[0, 1, 1, 0],[0, 0, 1, 0]],
	z: [[0, 0, 0, 0],[1, 1, 0, 0],[0, 1, 1, 0],[0, 0, 0, 0]],
};

function line(ctx, x1, y1, x2, y2) {
	ctx.save();
	ctx.beginPath();

	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);

	ctx.closePath();
	ctx.restore();
	ctx.stroke();
}

function arrayCopy2D(collisionMap) {
	let copy = [];
	for (let i = 0; i < collisionMap.length; ++i) {
		copy.push([]);
		for (let j = 0; j < collisionMap[i].length; ++j) {
			copy[i].push(collisionMap[i][j]);
		}
	}
	return copy;
}

class GamePiece {
	constructor(collisionMap, color) {
		this.collisionMap = arrayCopy2D(collisionMap);
		this.color = color;
		this.dims = { x: collisionMap[0].length, y: collisionMap.length };

		// Calculate width and height
		this.widthMin = this.collisionMap[0].length - 1;
		this.widthMax = 0;
		this.heightMin = this.collisionMap.length - 1;
		this.heightMax = 0;
		for (let i = 0; i < this.collisionMap.length; ++i) {
			for (let j = 0; j < this.collisionMap[i].length; ++j) {
				if (this.collisionMap[i][j]) {
					this.widthMin = Math.min(this.widthMin, j);
					this.widthMax = Math.max(this.widthMax, j);
					this.heightMin = Math.min(this.heightMin, i);
					this.heightMax = Math.max(this.heightMax, i);
				}
			}
		}
		this.width  = this.widthMax  - this.widthMin  + 1;
		this.height = this.heightMax - this.heightMin + 1;
	}

	onRotate() {
		const tmp   = this.width;
		this.width  = this.height;
		this.height = tmp;
	}

	getCollisionMap() {
		return this.collisionMap;
	}
}

class PreviewCanvas {
	constructor(previewCanvas) {
		this.ctx = previewCanvas;
		this.paddingFrac = { x: 0.05, y: 0.05 };
	}

	onResize() {
		this.ctx.canvas.width  = this.ctx.canvas.offsetWidth;
		this.ctx.canvas.height = this.ctx.canvas.offsetHeight;
		this.dims = { x: this.ctx.canvas.width * (1 - 2 * this.paddingFrac.x), y: this.ctx.canvas.height * (1 - 2 * this.paddingFrac.y) };
		this.pos  = { x: this.ctx.canvas.width *          this.paddingFrac.x,  y: this.ctx.canvas.height *          this.paddingFrac.y };
	}

	draw(gamePiece) {
		const tileSize = Math.min(this.dims.x / gamePiece.width, this.dims.y / gamePiece.height);
		const offset = {
			x: this.ctx.canvas.width  / 2 - gamePiece.width  * tileSize / 2,
			y: this.ctx.canvas.height / 2 - gamePiece.height * tileSize / 2,
		}

		// Draw piece
		this.ctx.fillStyle = gamePiece.color;
		for (let c_i = gamePiece.heightMin, i = 0; c_i <= gamePiece.heightMax; ++c_i) {
			for (let c_j = gamePiece.widthMin, j = 0; c_j <= gamePiece.widthMax; ++c_j) {
				if (gamePiece.collisionMap[c_i][c_j]) {
					this.ctx.fillRect(
						Math.round(offset.x + j * tileSize), Math.round(offset.y + i * tileSize),
						Math.round(tileSize), Math.round(tileSize)
					);
				}
				++j;
			}
			++i;
		}

		// Draw overlay grid
		this.ctx.strokeStyle = "#000000";
		for (let x = 0; x <= gamePiece.width; ++x) {
			line(this.ctx,
				Math.round(offset.x + x * tileSize), Math.round(0),
				Math.round(offset.x + x * tileSize), Math.round(this.ctx.canvas.height),
			);
		}
		for (let y = 0; y <= gamePiece.height; ++y) {
			line(this.ctx,
				Math.round(0),                     Math.round(offset.y + y * tileSize),
				Math.round(this.ctx.canvas.width), Math.round(offset.y + y * tileSize),
			);
		}
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

		this.holdCanvas.onResize();
		this.nextCanvas.onResize();
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

		// Draw previews
		this.holdCanvas.draw(new GamePiece(gamePieces.z, "#FFFFFF"));
		this.nextCanvas.draw(new GamePiece(gamePieces.j, "#FFFFFF"));
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
		});
		tetris.draw();
	}, 1000 / FPS);
}

window.onresize = () => {
	Object.values(canvases).forEach((ctx) => {
		ctx.canvas.width  = ctx.canvas.offsetWidth;
		ctx.canvas.height = ctx.canvas.offsetHeight;
	});
	tetris.onResize();
};