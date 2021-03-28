const theme_classes = ["theme-light", "theme-dark"]
let current_theme = 0

function theme_toggle_init(gol) {
	const theme_button = document.getElementById("theme-toggle-button");
	const dark_mode_icon = document.getElementById("dark-mode-icon");
	const light_mode_icon = document.getElementById("light-mode-icon");
	const themed_items = Array.prototype.slice.call(document.getElementsByClassName(theme_classes[current_theme]));
    const canvasEl = document.getElementById("background-canvas");
	theme_button.onclick = () => {
		gol.queue(() => {
			light_mode_icon.style.display = (current_theme) ? "block" : "none";
			dark_mode_icon.style.display  = (current_theme) ? "none"  : "block";
			for (const themed_item of themed_items) {
				themed_item.classList.remove(theme_classes[current_theme    ])
				themed_item.classList.add   (theme_classes[current_theme ^ 1])
			}
		
			current_theme ^= 1;
            canvasEl.style.position = "sticky";
            setTimeout(() => {
                canvasEl.style.position = "fixed";
            }, 0);
		});
	}
}

const FRAME_DELAY = 150;
const MAX_DIMENSIONS = { width: 50, height: 50 };

class GOL {
	getColor() {
		return current_theme ? `rgb(0, 30, 0)` : `rgb(240, 250, 255)`;
	}

  constructor({ width, height }, ctx, { numCols, numRows }, initialProbability = 0.5) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.numCols = numCols;
    this.numRows = numRows;
    this.initialProbability = initialProbability;
	this.state = 0

    this.maxDist = (numCols * numCols + numRows * numRows) / 4;
    this.cellWidth = width / numCols;
    this.cellHeight = height / numRows;
    this.cells = [];

    this.init();
  }

  init() {
    this.needsTick = true;
    this.cells = [];
    for (let i = 0; i < this.numCols; i = i + 1) {
      this.cells[i] = [];
      for (let j = 0; j < this.numRows; j = j + 1) {
        this.cells[i][j] = Math.random() < this.initialProbability;
      }
    }
  }

  iterate(callback) {
    for (let i = 0; i < this.numCols; i = i + 1) {
      for (let j = 0; j < this.numRows; j = j + 1) {
        callback(i, j);
      }
    }
  }

  tick() {
    if (!this.needsTick) return;

    const neighbourCount = [];
    this.iterate((x, y) => {
      if (!neighbourCount[x]) neighbourCount[x] = [];
      neighbourCount[x][y] = 0;

      for (let i = -1; i <= 1; i = i + 1) {
        for (let j = -1; j <= 1; j = j + 1) {
          if (i != 0 || j != 0) {
            neighbourCount[x][y] += (
              this.cells[(x + i + this.numCols) % this.numCols] &&
              this.cells[(x + i + this.numCols) % this.numCols][(y + j + this.numRows) % this.numRows]
            ) ? (1) : (0);
          }
        }
      }
    });

    this.needsTick = false;
    this.iterate((i, j) => {
        const newVal = (
            (neighbourCount[i][j] === 3) ||
            (neighbourCount[i][j] === 2 && this.cells[i][j])
        );

        if (this.cells[i][j] !== newVal) {
          this.cells[i][j] = newVal;
          this.needsTick = true;
        }
    });
  }

  queue(callback) {
	this.callback = callback
  }

  draw() {
	if (this.callback) {
		this.callback()
		delete this.callback
	}

    this.iterate((i, j) => {
      if (this.cells[i][j]) {
        this.ctx.fillStyle = this.getColor();
        this.ctx.fillRect(
		  Math.floor(this.cellWidth * i),
		  Math.floor(this.cellHeight * j),
          Math.ceil(this.cellWidth),
          Math.ceil(this.cellHeight)
        );
      }
    });
  }
}

function constrainDimensions({ actualWidth, actualHeight }, { maxWidth, maxHeight }) {
  const widthInSquares = actualWidth / maxWidth;
  const heightInSquares = actualHeight / maxHeight;
  
  if (widthInSquares > heightInSquares) {
    return {
      numCols: maxWidth,
      numRows: Math.floor(actualHeight / widthInSquares),
    };
  } else {
    return {
      numCols: Math.floor(actualWidth / heightInSquares),
      numRows: maxHeight,
    };
  }
}

function gol_init() {
	const canvas = document.getElementById('background-canvas');
	canvas.width  = innerWidth;
	canvas.height = innerHeight;
	const ctx = canvas.getContext('2d');
	const gol = new GOL(canvas, ctx, constrainDimensions(
		{ actualWidth: canvas.width, actualHeight: canvas.height },
		{ maxWidth: MAX_DIMENSIONS.width, maxHeight: MAX_DIMENSIONS.height },
	));

	setInterval(() => {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		gol.draw();
		ctx.stroke();
		if (gol.state) gol.tick();
	}, FRAME_DELAY);

	const state_button = document.getElementById("gol-pause-button");
	const play_icon = document.getElementById("gol-play-icon");
	const pause_icon = document.getElementById("gol-pause-icon");
	state_button.onclick = () => {
		gol.queue(() => {
			play_icon.style.display = (gol.state) ? "inline" : "none";
			pause_icon.style.display  = (gol.state) ? "none"  : "inline";
			gol.state ^= 1
		});
	}

	const restart_button = document.getElementById("gol-restart-button");
	restart_button.onclick = () => {
		gol.queue(() => {
			gol.init()
		});
	}

	return gol
}

window.onload = () => {
	const gol = gol_init();
	theme_toggle_init(gol);
}
