import * as sketch from './sketch.js';

const FPS = 60;
let titleString = "Tetris"
let tetris;

class Tetris {
	constructor(minPaddingRatio) {
		this.minPaddingRatio = minPaddingRatio;
		this.uiRatio = { left: 0.2, centre: 0.4, right: 0.2 };
		this.gridDim = { x: 10, y: 20 };
	}

	onResize(width, height) {
		this.dim = { x: width, y: height };
		const minPadding = Math.min(this.minPaddingRatio.x * width, this.minPaddingRatio.y * height);
		const padding = { x: minPadding, y: minPadding };
		this.titleSize = Math.floor(padding.y / 2);
		this.titlePos = { x: width / 2, y: padding.y / 2 };
		this.textSize = Math.floor(padding.y / 4);
		const renderBounds = {
			pos: padding,
			dim: { x: width - 2 * padding.x, y: height - 2 * padding.y }
		};

		// Calculate grid size and position
		const gridRenderBounds = {
			pos: { x: ( 1 - this.uiRatio.centre) * renderBounds.dim.x / 2  + renderBounds.pos.x, y: renderBounds.pos.y },
			dim: { x:       this.uiRatio.centre  * renderBounds.dim.x,                           y: renderBounds.dim.y }
		};
		const tileDim = Math.min(gridRenderBounds.dim.x / this.gridDim.x, gridRenderBounds.dim.y / this.gridDim.y);
		this.gridTileDim  = { x: tileDim,                  y: tileDim };
		this.gridPixelDim = { x: tileDim * this.gridDim.x, y: tileDim * this.gridDim.y };
		this.gridPixelPos = {
			x: gridRenderBounds.pos.x + gridRenderBounds.dim.x / 2 - this.gridPixelDim.x / 2,
			y: gridRenderBounds.pos.y + gridRenderBounds.dim.y / 2 - this.gridPixelDim.y / 2
		};
		
		// Calculate the upper left hand corner of the tetris game
		this.pixelDim = renderBounds.dim;
		this.pos = renderBounds.pos;		
	}

	init() {
		this.onResize(sketch.getWidth(), sketch.getHeight());
	}

	drawGameGrid() {
		sketch.setStroke("#FFFFFF");
		// Draw vertical lines
		for (let x = 0; x <= this.gridDim.x; ++x) {
			sketch.line(
				Math.round(this.gridPixelPos.x + x * this.gridTileDim.x), Math.round(this.gridPixelPos.y),
				Math.round(this.gridPixelPos.x + x * this.gridTileDim.x), Math.round(this.gridPixelPos.y + this.gridPixelDim.y)
			);
		}
		// Draw horizontal lines
		for (let y = 0; y <= this.gridDim.y; ++y) {
			sketch.line(
				Math.round(this.gridPixelPos.x),                       Math.round(this.gridPixelPos.y + y * this.gridTileDim.y),
				Math.round(this.gridPixelPos.x + this.gridPixelDim.x), Math.round(this.gridPixelPos.y + y * this.gridTileDim.y)
			);
		}
	}

	draw() {
		// Draw title
		sketch.setFill("#FFFFFF");
		sketch.textStyle(`${this.titleSize}px Arial`);
		sketch.textAlign("center");
		sketch.textBaseline("middle");
		sketch.text(this.titlePos.x, this.titlePos.y, titleString, true);

		// Draw render bounds
		sketch.setFill("#333333");
		sketch.fillRect(
			this.pos.x,                   this.pos.y,
			this.pos.x + this.pixelDim.x, this.pos.y + this.pixelDim.y,
		);

		// Draw game grid
		this.drawGameGrid();
	}
}

function draw() {
	// Draw game
	tetris.draw();
}

function onResize(width, height) {
	tetris.onResize(width, height);
}

function setup() {
	sketch.setFrameInterval(1000 / FPS);
	tetris = new Tetris({ x: 0.1, y: 0.1 });
	onResize(sketch.getWidth(), sketch.getHeight());
	tetris.init();
}

sketch.onResize(onResize);
sketch.init(setup, draw);