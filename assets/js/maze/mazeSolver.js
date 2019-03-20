import * as maths from '../math-utils.js';
import * as arrays from '../array-utils.js';

const DFS = {
  initialize: (maze, algoParams = {}) => {
    algoParams.stack = [algoParams.startPos];
    algoParams.visited = arrays.newNDArray([maze.width, maze.height], false);
  },
  step: (maze, algoParams) => {
    const { stack, visited, endPos, randomize } = algoParams;
    if (!stack.length) {
      return false;
    }

    const { x, y } = stack[stack.length - 1];
    visited[x][y] = true;
    if (x !== endPos.x || y !== endPos.y) {
      const numPossibleMoves = maze.numPossibleMoves(x, y, visited);
      if (numPossibleMoves) {
        let directionToMove = randomize ? maths.randInt(numPossibleMoves) : 0;
        if (maze.openOnRight(x, y) && !visited[x + 1][y]) {
          if (!directionToMove) {
            stack.push({ x: x + 1, y: y });
            return;
          } else {
            directionToMove--;
          }
        }
        if (maze.openOnBottom(x, y) && !visited[x][y + 1]) {
          if (!directionToMove) {
            stack.push({ x: x, y: y + 1 });
            return;
          } else {
            directionToMove--;
          }
        }
        if (maze.openOnLeft(x, y) && !visited[x - 1][y]) {
          if (!directionToMove) {
            stack.push({ x: x - 1, y: y });
            return;
          } else {
            directionToMove--;
          }
        }
        if (maze.openOnTop(x, y) && !visited[x][y - 1]) {
          if (!directionToMove) {
            stack.push({ x: x, y: y - 1 });
            return;
          } else {
            directionToMove--;
          }
        }
      } else {
        stack.pop();
      }
    } else {
      return true;
    }
  },
  draw: (sketch, xCellSize, yCellSize, algoParams) => {
    const { stack, visited, endPos } = algoParams;

    // Draw visited cells
    sketch.setFill('#066');
    arrays.forEach(visited, (visited, [x, y]) => {
      if (visited) {
        sketch.fillRect(xCellSize * x, yCellSize * y, xCellSize * (x + 1), yCellSize * (y + 1));
      }
    });

    // Draw target destination
    sketch.setFill('#AA0');
    sketch.fillRect(
      xCellSize * endPos.x,
      yCellSize * endPos.y,
      xCellSize * (endPos.x + 1),
      yCellSize * (endPos.y + 1),
    );

    if (stack.length) {
      const { x, y } = stack[stack.length - 1];

      // Draw stacked cells
      sketch.setFill((x === endPos.x && y === endPos.y) ? '#A00' : '#050');
      stack.forEach(({ x, y }) => {
        sketch.fillRect(xCellSize * x, yCellSize * y, xCellSize * (x + 1), yCellSize * (y + 1));
      });

      // Draw top of stack
      sketch.setFill('#A00');
      sketch.fillRect(xCellSize * x, yCellSize * y, xCellSize * (x + 1), yCellSize * (y + 1));
    }
  },
};

const KEEP_RIGHT = {
  initialize: (maze, algoParams = {}) => {
    DFS.initialize(maze, algoParams);
    algoParams.dir = algoParams.dir | 2;
  },
  step: (maze, algoParams) => {
    const { stack, visited, endPos } = algoParams
    if (!stack.length) {
      return false;
    }

    const { x, y } = stack[stack.length - 1];
    visited[x][y] = true;
    if (x !== endPos.x || y !== endPos.y) {
      let nextDir = (algoParams.dir + 1) % 4;
      let nextPos;

      for (let i = 0; i < 4 && !nextPos; i++) {
        algoParams.dir = nextDir;
        switch (nextDir) {
          case 0:
            if (maze.openOnTop(x, y)) {
              nextPos = { x, y: y - 1 };
            }
            break;
          case 1:
            if (maze.openOnRight(x, y)) {
              nextPos = { x: x + 1, y };
            }
            break;
          case 2:
            if (maze.openOnBottom(x, y)) {
              nextPos = { x, y: y + 1 };
            }
            break;
          case 3:
            if (maze.openOnLeft(x, y)) {
              nextPos = { x: x - 1, y };
            }
            break;
        }

        nextDir = (nextDir + 3) % 4;
      }

      // Prune the stack
      if (visited[nextPos.x][nextPos.y]) {
        while (
          nextPos.x !== stack[stack.length - 1].x ||
          nextPos.y !== stack[stack.length - 1].y
        ) {
          stack.pop();
        }
      } else {
        stack.push(nextPos);
      }
    } else {
      return true;
    }
  },
  draw: DFS.draw,
};

export class MazeSolver {
  constructor() {
    this.solvers = { DFS, KEEP_RIGHT };
  }

  initialize(maze, algorithm, algoParams, x1 = 0, y1 = 0, x2 = maze.width - 1, y2 = maze.height - 1) {
    this.maze = maze;
    this.algorithm = algorithm.toUpperCase();
    this.algoParams = {
      ...algoParams,
      startPos: { x: x1, y: y1 },
      endPos: { x: x2, y: y2 },
    };
    this.solvers[this.algorithm].initialize(maze, this.algoParams);
  }

  step() {
    return this.solvers[this.algorithm].step(this.maze, this.algoParams);
  }

  draw(sketch, xCellSize, yCellSize) {
    this.solvers[this.algorithm].draw(sketch, xCellSize, yCellSize, this.algoParams);
  }

  solve() {
    let result;
    while (result === undefined) {
      result = this.step();
    }
    return result;
  }
}