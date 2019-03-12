import * as maths from './math-utils.js';
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
        this.vWalls[i][j] = true;
        this.hWalls[i][j] = true;
      }
    }

    for (let i = 0; i < this.width - 1; i++) {
      this.vWalls[i][this.height - 1] = true;
    }

    this.hWalls[this.width - 1] = [];
    for (let i = 0; i < this.height - 1; i++) {
      this.hWalls[this.width - 1][i] = true;
    }
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

  setHWall(x, y, hasWall) {
    this.hWalls[x][y] = hasWall;
  }

  setVWall(x, y, hasWall) {
    this.vWalls[x][y] = hasWall;
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
  }
}

class MazeGenerator {
  generateMaze(width, height) {
    const maze = new Maze(width, height);
    this.generateMazeDFS(width, height, maze);
    return maze;
  }

  newBitField(width, height) {
    const bitField = [];
    for (let i = 0; i < width; i++) {
      bitField[i] = [];
      for (let j = 0; j < height; j++) {
        bitField[i][j] = false;
      }
    }

    return bitField;
  }

  numPossibleMoves(x, y, width, height, visited) {
    let numPossibleMoves = 0;
    if (x > 0 && !visited[x - 1][y]) numPossibleMoves++;
    if (x < width - 1 && !visited[x + 1][y]) numPossibleMoves++;
    if (y > 0 && !visited[x][y - 1]) numPossibleMoves++;
    if (y < height - 1 && !visited[x][y + 1]) numPossibleMoves++;
    return numPossibleMoves;
  }

  generateMazeDFS(
    width, height, maze,
    x = maths.randInt(width),
    y = maths.randInt(height),
    visited = this.newBitField(width, height),
  ) {
    visited[x][y] = true;
    while (this.numPossibleMoves(x, y, width, height, visited)) {
      const numPossibleMoves = this.numPossibleMoves(x, y, width, height, visited);
      let directionToMove = maths.randInt(numPossibleMoves);
      if (x > 0 && !visited[x - 1][y]) {
        if (!directionToMove) {
          maze.setVWall(x - 1, y, false);
          this.generateMazeDFS(width, height, maze, x - 1, y, visited);
          continue;
        } else {
          directionToMove--;
        }
      }
      if (x < width - 1 && !visited[x + 1][y]) {
        if (!directionToMove) {
          maze.setVWall(x, y, false);
          this.generateMazeDFS(width, height, maze, x + 1, y, visited);
          continue;
        } else {
          directionToMove--;
        }
      }
      if (y > 0 && !visited[x][y - 1]) {
        if (!directionToMove) {
          maze.setHWall(x, y - 1, false);
          this.generateMazeDFS(width, height, maze, x, y - 1, visited);
          continue;
        } else {
          directionToMove--;
        }
      }
      if (y < height - 1 && !visited[x][y + 1]) {
        if (!directionToMove) {
          maze.setHWall(x, y, false);
          this.generateMazeDFS(width, height, maze, x, y + 1, visited);
          continue;
        } else {
          directionToMove--;
        }
      }
    }
  }
}

function setup() {
  sketch.setFrameInterval(20);
  window = { width: sketch.getWidth(), height: sketch.getHeight() };

  const mazeGenerator = new MazeGenerator();
  maze = mazeGenerator.generateMaze(60, 45);
  console.log(maze);
}

function draw() {
  sketch.setStroke('#FFFFFF');
  maze.draw();
}

sketch.init(setup, draw);