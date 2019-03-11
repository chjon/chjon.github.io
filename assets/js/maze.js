import * as sketch from './sketch.js';

let window;
let maze;

class Maze {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.vWalls = [];
    this.hWalls = [];

    // Initialize all walls
    for (let i = 0; i < this.width - 1; i++) {
      this.hWalls[i] = [];
      this.vWalls[i] = [];
      for (let j = 0; j < this.height - 1; j++) {
        this.hWalls[i][j] = (Math.random() < 0.5);
        this.vWalls[i][j] = (Math.random() < 0.5);
      }
    }

    for (let i = 0; i < this.width - 1; i++) {
      this.vWalls[i][this.height - 1] = (Math.random() < 0.5);
    }

    this.hWalls[this.width - 1] = [];
    for (let i = 0; i < this.height - 1; i++) {
      this.hWalls[this.width - 1][i] = (Math.random() < 0.5);
    }

    console.log(this.hWalls);
    console.log(this.vWalls);
  }

  openOnLeft(x, y) {
    return x && this.vWalls[x - 1] && this.vWalls[x - 1][y] === false;
  }

  openOnRight(x, y) {
    return this.vWalls[x] && this.vWalls[x][y] === false;
  }

  openOnTop(x, y) {
    return y && this.hWalls[x][y - 1] === false;
  }

  openOnBottom(x, y) {
    return this.hWalls[x][y] === false;
  }

  draw() {
    const hScaleFactor = window.width / this.width;
    const vScaleFactor = window.height / this.height;

    // Draw walls
    for (let i = 0; i < this.width - 1; i++) {
      for (let j = 0; j < this.height - 1; j++) {
        if (this.hWalls[i][j]) {
          sketch.line(hScaleFactor * i, vScaleFactor * (j + 1), hScaleFactor * (i + 1), vScaleFactor * (j + 1));
        }

        if (this.vWalls[i][j]) {
          sketch.line(hScaleFactor * (i + 1), vScaleFactor * j, hScaleFactor * (i + 1), vScaleFactor * (j + 1));
        }
      }
    }

    for (let i = 0; i < this.height - 1; i++) {
      if (this.hWalls[this.width - 1][i]) {
        sketch.line(
          hScaleFactor * (this.width - 1),
          vScaleFactor * (i + 1),
          hScaleFactor * (this.width),
          vScaleFactor * (i + 1)
        );
      }
    }

    for (let i = 0; i < this.width - 1; i++) {
      if (this.vWalls[i][this.height - 1]) {
        sketch.line(
          hScaleFactor * (i + 1),
          vScaleFactor * (this.height - 1),
          hScaleFactor * (i + 1),
          vScaleFactor * (this.height)
        );
      }
    }

    // Draw cell states
    /*
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        if (this.openOnTop(x, y)) {
          sketch.ellipse(
            hScaleFactor * x + hScaleFactor / 2,
            vScaleFactor * y + vScaleFactor / 4,
            hScaleFactor / 8,
            vScaleFactor / 8,
          );
        }

        if (this.openOnBottom(x, y)) {
          sketch.ellipse(
            hScaleFactor * x + hScaleFactor / 2,
            vScaleFactor * y + 3 * vScaleFactor / 4,
            hScaleFactor / 8,
            vScaleFactor / 8,
          );
        }

        if (this.openOnLeft(x, y)) {
          sketch.ellipse(
            hScaleFactor * x + hScaleFactor / 4,
            vScaleFactor * y + vScaleFactor / 2,
            hScaleFactor / 8,
            vScaleFactor / 8,
          );
        }

        if (this.openOnRight(x, y)) {
          sketch.ellipse(
            hScaleFactor * x + 3 * hScaleFactor / 4,
            vScaleFactor * y + vScaleFactor / 2,
            hScaleFactor / 8,
            vScaleFactor / 8,
          );
        }
      }
    }
    */
  }
}

class MazeGenerator {
  generateMaze(width, height) {
    const maze = new Maze(width, height);
    return maze;
  }
}

function setup() {
  sketch.setFrameInterval(20);
  window = { width: sketch.getWidth(), height: sketch.getHeight() };

  const mazeGenerator = new MazeGenerator();
  maze = mazeGenerator.generateMaze(40, 30);
}

function draw() {
  sketch.setStroke('#FFFFFF');
  maze.draw();
}

sketch.init(setup, draw);