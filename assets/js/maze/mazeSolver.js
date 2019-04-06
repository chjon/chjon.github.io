import * as maths from '../math-utils.js';
import * as arrays from '../array-utils.js';
import { PriorityQueue } from '../data-structures/priority-queue.js'

const BACKTRACK_DFS = {
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
        let directionToMove = randomize ? maths.randInt(0, numPossibleMoves) : 0;
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
    BACKTRACK_DFS.initialize(maze, algoParams);
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
  draw: BACKTRACK_DFS.draw,
};

const DIJKSTRA = {
  initialize: (maze, algoParams = {}) => {
    const endPos = algoParams.endPos;
    algoParams.queue = new PriorityQueue(algoParams.heuristic || ((a, b) => {
      return maths.dist2(a.x, a.y, endPos.x, endPos.y) - maths.dist2(b.x, b.y, endPos.x, endPos.y)
    }));
    algoParams.queue.push(algoParams.startPos);
    algoParams.distances = arrays.newNDArray([maze.width, maze.height], { distance: Number.MAX_VALUE });
    algoParams.distances[algoParams.startPos.x][algoParams.startPos.y].distance = 0;
    algoParams.queuePriority = algoParams.queuePriority || ['TOP', 'BOTTOM', 'LEFT', 'RIGHT'];
    algoParams.validateAndPushList = algoParams.queuePriority
    .reverse()
    .map((val) => {
      const direction = val.toUpperCase();
      if (direction === 'TOP') {
        return { validator: 'openOnTop', xOffset: 0, yOffset: -1 };
      } else if (direction === 'BOTTOM') {
        return { validator: 'openOnBottom', xOffset: 0, yOffset: 1 };
      } else if (direction === 'LEFT') {
        return { validator: 'openOnLeft', xOffset: -1, yOffset: 0 };
      } else if (direction === 'RIGHT') {
        return { validator: 'openOnRight', xOffset: 1, yOffset: 0 };
      }
    });
    algoParams.angleOffset = maths.TWO_PI * Math.random();
  },
  step: (maze, algoParams) => {
    const { queue, distances, endPos, validateAndPushList } = algoParams;
    if (!queue.length()) {
      return false;
    }

    const cur = queue.peek();
    const { x, y } = cur;
    if (x !== endPos.x || y !== endPos.y) {
      algoParams.prev = queue.pop();
      const curDist = distances[x][y].distance;
      const tryPush = (x, y) => {
        if (curDist < algoParams.distances[x][y].distance) {
          if (!algoParams.distances[x][y].prev) {
            algoParams.queue.push({ x, y });
          }
          algoParams.distances[x][y].distance = curDist + 1;
          algoParams.distances[x][y].prev = cur;
        }
      }

      // Add next positions to queue
      validateAndPushList.forEach(({ validator, xOffset, yOffset }) => {
        if (maze[validator](x, y)) {
          tryPush(x + xOffset, y + yOffset);
        }
      })
    } else {
      return true;
    }
  },
  draw: (sketch, xCellSize, yCellSize, algoParams) => {
    const { queue, distances, startPos, endPos, prev, angleOffset } = algoParams;

    // Draw visited cells
    sketch.setFill('#066');
    arrays.forEach(distances, ({ distance }, [x, y]) => {      
      sketch.setFill('rgba(' +
        `${128 + 128 * Math.sin(angleOffset + distance * maths.TWO_PI / 64 + 2 * maths.TWO_PI / 3)},` +
        `${128 + 128 * Math.sin(angleOffset + distance * maths.TWO_PI / 64 + maths.TWO_PI / 3)},` +
        `${128 + 128 * Math.sin(angleOffset + distance * maths.TWO_PI / 64)},` +
        `1)`
      );
      if (distance !== Number.MAX_VALUE) {
        sketch.fillRect(xCellSize * x, yCellSize * y, xCellSize * (x + 1), yCellSize * (y + 1));
      }
    });

    if (queue.length()) {
			sketch.setFill('#A00');
			let cur = queue.peek();
			do {
				sketch.fillRect(xCellSize * cur.x, yCellSize * cur.y, xCellSize * (cur.x + 1), yCellSize * (cur.y + 1));
				cur = distances[cur.x][cur.y].prev
			} while(cur);
    }

    // Draw shortest paths
    sketch.setStroke('#000');
    arrays.forEach(distances, ({ prev, distance }, [x, y]) => {
      if (prev && distance !== Number.MAX_VALUE) {
        sketch.line(xCellSize * (prev.x + 0.5), yCellSize * (prev.y + 0.5), xCellSize * (x + 0.5), yCellSize * (y + 0.5));
      }
    });

		// Draw start and end positions
    sketch.setFill('#FF0');
    sketch.fillRect(
      xCellSize * startPos.x, yCellSize * startPos.y,
      xCellSize * (startPos.x + 1), yCellSize * (startPos.y + 1),
    );
    sketch.fillRect(
      xCellSize * endPos.x, yCellSize * endPos.y,
      xCellSize * (endPos.x + 1), yCellSize * (endPos.y + 1),
    );
  }
};

const BFS = {
  ...DIJKSTRA,
  initialize: (maze, algoParams = {}) => {
    algoParams.heuristic = () => {
      return 1;
    };
    DIJKSTRA.initialize(maze, algoParams);
  },
}

const DFS = {
  ...DIJKSTRA,
  initialize: (maze, algoParams = {}) => {
    algoParams.heuristic = () => {
      return -1;
    };
    DIJKSTRA.initialize(maze, algoParams);
  },
}

export class MazeSolver {
  constructor() {
		this.initialized = false;
    this.solvers = {
      'BACKTRACK DFS': BACKTRACK_DFS,
      BFS,
      DFS,
      'DIJKSTRA\'S': DIJKSTRA,
      'KEEP-RIGHT': KEEP_RIGHT,
    };
  }

  initialize(maze, algorithm, algoParams = {}) {
    this.maze = maze;
    this.algorithm = algorithm.toUpperCase();
    this.algoParams = {
      ...algoParams,
      startPos: algoParams.startPos || {
        x: maths.randInt(0, maze.width),
        y: maths.randInt(0, maze.height),
      },
      endPos: algoParams.endPos || {
        x: maths.randInt(0, maze.width),
        y: maths.randInt(0, maze.height),
      },
    };
    this.solvers[this.algorithm].initialize(maze, this.algoParams);
		this.initialized = true;
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