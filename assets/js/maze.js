import * as maths from './math-utils.js';
import * as sketch from './sketch.js';
import { DisjointSet } from './disjoint-set.js';

let window;
let maze;
let mazeGenerator;
let mazeSolver;
let solution;

function newBitField(width, height) {
  const bitField = [];
  for (let i = 0; i < width; i++) {
    bitField[i] = [];
    for (let j = 0; j < height; j++) {
      bitField[i][j] = false;
    }
  }

  return bitField;
}

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

  getWalls() {
    const walls = [];
    for (let x = 0; x < this.width - 1; x++) {
      for (let y = 0; y < this.height - 1; y++) {
        walls.push({ x, y, isHorizontal: true });
        walls.push({ x, y, isHorizontal: false });
      }
    }

    for (let x = 0; x < this.width - 1; x++) {
      walls.push({ x, y: this.height - 1, isHorizontal: false });
    }

    for (let y = 0; y < this.height - 1; y++) {
      walls.push({ x: this.width - 1, y, isHorizontal: true });
    }

    return walls;
  }

  numPossibleMoves(x, y, visited) {
    let numPossibleMoves = 0;
    if (this.openOnLeft(x, y) && (!visited || !visited[x - 1][y])) numPossibleMoves++;
    if (this.openOnRight(x, y) && (!visited || !visited[x + 1][y])) numPossibleMoves++;
    if (this.openOnTop(x, y) && (!visited || !visited[x][y - 1])) numPossibleMoves++;
    if (this.openOnBottom(x, y) && (!visited || !visited[x][y + 1])) numPossibleMoves++;
    return numPossibleMoves;
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

  generateMazeDFS(width, height) {
    const stack = [{ x: maths.randInt(width), y: maths.randInt(height) }];
    const visited = newBitField(width, height);
    const maze = new Maze(width, height);

    while (stack.length > 0) {
      const { x, y } = stack[stack.length - 1];
      visited[x][y] = true;
      const numPossibleMoves = maze.numPossibleMoves(x, y, width, height, visited);
      if (numPossibleMoves) {
        let directionToMove = maths.randInt(numPossibleMoves);
        if (x > 0 && !visited[x - 1][y]) {
          if (!directionToMove) {
            maze.setVWall(x - 1, y, false);
            stack.push({ x: x - 1, y: y });
            continue;
          } else {
            directionToMove--;
          }
        }
        if (x < width - 1 && !visited[x + 1][y]) {
          if (!directionToMove) {
            maze.setVWall(x, y, false);
            stack.push({ x: x + 1, y: y });
            continue;
          } else {
            directionToMove--;
          }
        }
        if (y > 0 && !visited[x][y - 1]) {
          if (!directionToMove) {
            maze.setHWall(x, y - 1, false);
            stack.push({ x: x, y: y - 1 });
            continue;
          } else {
            directionToMove--;
          }
        }
        if (y < height - 1 && !visited[x][y + 1]) {
          if (!directionToMove) {
            maze.setHWall(x, y, false);
            stack.push({ x: x, y: y + 1 });
            continue;
          } else {
            directionToMove--;
          }
        }
      } else {
        stack.pop();
      }
    }
    
    return maze;
  }

  generateMazeDFSAnimated(width, height) {
    this.width = width;
    this.height = height;
    this.stack = [{ x: maths.randInt(width), y: maths.randInt(height) }];
    this.visited = newBitField(width, height);
    this.maze = new Maze(width, height);
  }

  generateMazeDFSStep() {
    if (this.stack.length > 0) {
      const { x, y } = this.stack[this.stack.length - 1];
      this.visited[x][y] = true;
      const numPossibleMoves = this.maze.numPossibleMoves(x, y, this.width, this.height, this.visited);
      if (numPossibleMoves) {
        let directionToMove = maths.randInt(numPossibleMoves);
        if (x > 0 && !this.visited[x - 1][y]) {
          if (!directionToMove) {
            this.maze.setVWall(x - 1, y, false);
            this.stack.push({ x: x - 1, y: y });
            return;
          } else {
            directionToMove--;
          }
        }
        if (x < this.width - 1 && !this.visited[x + 1][y]) {
          if (!directionToMove) {
            this.maze.setVWall(x, y, false);
            this.stack.push({ x: x + 1, y: y });
            return;
          } else {
            directionToMove--;
          }
        }
        if (y > 0 && !this.visited[x][y - 1]) {
          if (!directionToMove) {
            this.maze.setHWall(x, y - 1, false);
            this.stack.push({ x: x, y: y - 1 });
            return;
          } else {
            directionToMove--;
          }
        }
        if (y < this.height - 1 && !this.visited[x][y + 1]) {
          if (!directionToMove) {
            this.maze.setHWall(x, y, false);
            this.stack.push({ x: x, y: y + 1 });
            return;
          } else {
            directionToMove--;
          }
        }
      } else {
        this.stack.pop();
      }
    } else {
      return this.maze;
    }
  }

  generateMazeKruskals(width, height) {
    const sets = new DisjointSet(width * height);
    const maze = new Maze(width, height);
    const walls = maths.shuffleList(maze.getWalls());

    for (let i = 0; i < walls.length && sets.getNumSets() > 1; i++) {
      const { x, y, isHorizontal } = walls[i];
      const cell1 = x + y * width;
      const cell2 = (isHorizontal) ? (x + (y + 1) * width) : (x + 1 + y * width);
      const set1 = sets.getSet(cell1);
      const set2 = sets.getSet(cell2);
      if (set1 !== set2) {
        sets.join(set1, set2);
        if (isHorizontal) {
          maze.setHWall(x, y, false);
        } else {
          maze.setVWall(x, y, false);
        }
      }
    }

    return maze;
  }

  generateMazeKruskalsAnimated(width, height) {
    this.width = width;
    this.height = height;
    this.sets = new DisjointSet(width * height);
    this.maze = new Maze(width, height);
    this.walls = maths.shuffleList(this.maze.getWalls());
    return this.maze;
  }

  generateMazeKruskalsStep() {
    if (!this.walls.length || this.sets.getNumSets() <= 1) {
      return;
    }

    const { x, y, isHorizontal } = this.walls.pop();
    const cell1 = x + y * this.width;
    const cell2 = (isHorizontal) ? (x + (y + 1) * this.width) : (x + 1 + y * this.width);
    const set1 = this.sets.getSet(cell1);
    const set2 = this.sets.getSet(cell2);
    if (set1 !== set2 || Math.random() < 0.3) {
      this.sets.join(set1, set2);
      if (isHorizontal) {
        this.maze.setHWall(x, y, false);
      } else {
        this.maze.setVWall(x, y, false);
      }
    }
  }

  drawDFS() {
    const hScaleFactor = window.width / this.width;
    const vScaleFactor = window.height / this.height;

    // Draw visited cells
    sketch.setFill('#066');
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        if (this.visited[x][y]) {
          sketch.fillRect(hScaleFactor * x, vScaleFactor * y, hScaleFactor * (x + 1), vScaleFactor * (y + 1));
        }
      }
    }

    // Draw stacked cells
    sketch.setFill('#050');
    this.stack.forEach(({ x, y }) => {
      sketch.fillRect(hScaleFactor * x, vScaleFactor * y, hScaleFactor * (x + 1), vScaleFactor * (y + 1));
    });

    // Draw top of stack
    sketch.setFill('#A00');
    if (this.stack.length) {
      const { x, y } = this.stack[this.stack.length - 1];
      sketch.fillRect(hScaleFactor * x, vScaleFactor * y, hScaleFactor * (x + 1), vScaleFactor * (y + 1));
    }

    // Draw maze walls
    this.maze.draw();
  }

  drawKruskals() {
    this.maze.draw();
    if (this.walls.length && this.sets.getNumSets() > 1) {
      const hScaleFactor = window.width / this.width;
      const vScaleFactor = window.height / this.height;
      const { x, y, isHorizontal } = this.walls[this.walls.length - 1];

      sketch.setStroke('#A00');
      if (isHorizontal) {
        sketch.line(hScaleFactor * x, vScaleFactor * (y + 1), hScaleFactor * (x + 1), vScaleFactor * (y + 1));
      } else {
        sketch.line(hScaleFactor * (x + 1), vScaleFactor * y, hScaleFactor * (x + 1), vScaleFactor * (y + 1));
      }
    }
  }
}

class MazeSolver {
  solveDFS(
    maze,
    visited = newBitField(maze.width, maze.height),
    x1 = 0,
    y1 = 0,
    x2 = maze.width - 1,
    y2 = maze.height - 1,
  ) {
    if (x1 === x2 && y1 === y2) {
      return [{ x: x1, y: y1 }];
    }

    let stack;
    visited[x1][y1] = true;
    if (maze.openOnTop(x1, y1) && !visited[x1][y1 - 1]) {
      stack = this.solveDFS(maze, visited, x1, y1 - 1, x2, y2);
      if (stack) {
        stack.push({ x: x1, y: y1 });
        return stack;
      }
    }

    if (maze.openOnBottom(x1, y1) && !visited[x1][y1 + 1]) {
      stack = this.solveDFS(maze, visited, x1, y1 + 1, x2, y2);
      if (stack) {
        stack.push({ x: x1, y: y1 });
        return stack;
      }
    }

    if (maze.openOnLeft(x1, y1) && !visited[x1 - 1][y1]) {
      stack = this.solveDFS(maze, visited, x1 - 1, y1, x2, y2);
      if (stack) {
        stack.push({ x: x1, y: y1 });
        return stack;
      }
    }

    if (maze.openOnRight(x1, y1) && !visited[x1 + 1][y1]) {
      stack = this.solveDFS(maze, visited, x1 + 1, y1, x2, y2);
      if (stack) {
        stack.push({ x: x1, y: y1 });
        return stack;
      }
    }
    visited[x1][y1] = false;
  }

  solveDFSAnimated(
    maze,
    x1 = 0,
    y1 = 0,
    x2 = maze.width - 1,
    y2 = maze.height - 1,
  ) {
    this.maze = maze;
    this.stack = [{ x: x1, y: y1 }];
    this.visited = newBitField(maze.width, maze.height);
    this.dest = { x: x2, y: y2 };
  }

  solveDFSStep(randomize) {
    if (!this.stack.length) {
      return;
    }

    const { x, y } = this.stack[this.stack.length - 1];
    this.visited[x][y] = true;
    if (x !== this.dest.x || y !== this.dest.y) {
      const numPossibleMoves = this.maze.numPossibleMoves(x, y, this.visited);
      if (numPossibleMoves) {
        let directionToMove = randomize ? maths.randInt(numPossibleMoves) : 0;
        if (this.maze.openOnRight(x, y) && !this.visited[x + 1][y]) {
          if (!directionToMove) {
            this.stack.push({ x: x + 1, y: y });
            return;
          } else {
            directionToMove--;
          }
        }
        if (this.maze.openOnBottom(x, y) && !this.visited[x][y + 1]) {
          if (!directionToMove) {
            this.stack.push({ x: x, y: y + 1 });
            return;
          } else {
            directionToMove--;
          }
        }
        if (this.maze.openOnLeft(x, y) && !this.visited[x - 1][y]) {
          if (!directionToMove) {
            this.stack.push({ x: x - 1, y: y });
            return;
          } else {
            directionToMove--;
          }
        }
        if (this.maze.openOnTop(x, y) && !this.visited[x][y - 1]) {
          if (!directionToMove) {
            this.stack.push({ x: x, y: y - 1 });
            return;
          } else {
            directionToMove--;
          }
        }
      } else {
        this.stack.pop();
      }
    }
  }

  solveWallOnRightAnimated(
    maze,
    x1 = 0,
    y1 = 0,
    x2 = maze.width - 1,
    y2 = maze.height - 1,
  ) {
    this.maze = maze;
    this.stack = [{ x: x1, y: y1 }];
    this.visited = newBitField(maze.width, maze.height);
    this.dest = { x: x2, y: y2 };
    this.dir = 0;
  }

  solveWallOnRightStep() {
    if (!this.stack.length) {
      return;
    }

    const { x, y } = this.stack[this.stack.length - 1];
    this.visited[x][y] = true;
    if (x !== this.dest.x || y !== this.dest.y) {
      let nextDir = (this.dir + 1) % 4;
      let nextPos;

      for (let i = 0; i < 4 && !nextPos; i++) {
        this.dir = nextDir;
        switch (nextDir) {
          case 0:
            if (this.maze.openOnTop(x, y)) {
              nextPos = { x, y: y - 1 };
            }
            break;
          case 1:
            if (this.maze.openOnRight(x, y)) {
              nextPos = { x: x + 1, y };
            }
            break;
          case 2:
            if (this.maze.openOnBottom(x, y)) {
              nextPos = { x, y: y + 1 };
            }
            break;
          case 3:
            if (this.maze.openOnLeft(x, y)) {
              nextPos = { x: x - 1, y };
            }
            break;
        }

        nextDir = ((nextDir - 1) % 4 + 4) % 4;
      }

      if (this.stack.length > 1) {
        const { x, y } = this.stack[this.stack.length - 2];
        if (x === nextPos.x && y === nextPos.y) {
          this.stack.pop();
          return;
        }
      }

      this.stack.push(nextPos);
    }
  }

  draw() {
    const hScaleFactor = window.width / this.maze.width;
    const vScaleFactor = window.height / this.maze.height;

    // Draw visited cells
    sketch.setFill('#066');
    for (let x = 0; x < this.maze.width; x++) {
      for (let y = 0; y < this.maze.height; y++) {
        if (this.visited[x][y]) {
          sketch.fillRect(hScaleFactor * x, vScaleFactor * y, hScaleFactor * (x + 1), vScaleFactor * (y + 1));
        }
      }
    }

    // Draw target destination
    sketch.setFill('#AA0');
    sketch.fillRect(
      hScaleFactor * this.dest.x,
      vScaleFactor * this.dest.y,
      hScaleFactor * (this.dest.x + 1),
      vScaleFactor * (this.dest.y + 1),
    );

    if (this.stack.length) {
      const { x, y } = this.stack[this.stack.length - 1];

      // Draw stacked cells
      sketch.setFill((x === this.dest.x && y === this.dest.y) ? '#A00' : '#050');
      this.stack.forEach(({ x, y }) => {
        sketch.fillRect(hScaleFactor * x, vScaleFactor * y, hScaleFactor * (x + 1), vScaleFactor * (y + 1));
      });

      // Draw top of stack
      sketch.setFill('#A00');
      sketch.fillRect(hScaleFactor * x, vScaleFactor * y, hScaleFactor * (x + 1), vScaleFactor * (y + 1));
    }
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

function setup() {
  sketch.setFrameInterval(100);
  window = { width: sketch.getWidth(), height: sketch.getHeight() };
  mazeGenerator = new MazeGenerator();
  mazeSolver = new MazeSolver();
  const { numCols, numRows } = constrainDimensions(
    { actualWidth: window.width, actualHeight: window.height },
    { maxWidth: 40, maxHeight: 40 },
  );
  maze = mazeGenerator.generateMazeKruskals(numCols, numRows);
  //solution = mazeSolver.solveDFS(maze);
  mazeSolver.solveDFSAnimated(maze);
}

function draw() {
  sketch.setStroke('#FFF');
  sketch.setLineWidth(2);

  // const hScaleFactor = window.width / maze.width;
  // const vScaleFactor = window.height / maze.height;

  // sketch.setFill('#A00');
  // solution.forEach(({ x, y }) => {
  //   sketch.fillRect(hScaleFactor * x, vScaleFactor * y, hScaleFactor * (x + 1), vScaleFactor * (y + 1));
  // });

  mazeSolver.draw();
  mazeSolver.solveDFSStep();

  maze.draw();
}

sketch.init(setup, draw);