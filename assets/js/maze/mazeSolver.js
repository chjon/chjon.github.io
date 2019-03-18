import * as maths from '../math-utils.js';
import { newNDArray } from '../array-utils.js';

export class MazeSolver {
  solveDFS(
    maze,
    visited = newNDArray([maze.width, maze.height], false),
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
    this.visited = newNDArray([maze.width, maze.height], false);
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
    this.visited = newNDArray([maze.width, maze.height], false);
    this.dest = { x: x2, y: y2 };
    this.dir = 2;
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

      // Prune the stack
      if (this.visited[nextPos.x][nextPos.y]) {
        while (
          nextPos.x !== this.stack[this.stack.length - 1].x ||
          nextPos.y !== this.stack[this.stack.length - 1].y
        ) {
          this.stack.pop();
        }
      } else {
        this.stack.push(nextPos);
      }
    }
  }

  draw(sketch, width, height) {
    const hScaleFactor = width / this.maze.width;
    const vScaleFactor = height / this.maze.height;

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