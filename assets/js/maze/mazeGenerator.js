import * as maths from '../math-utils.js';
import * as arrays from '../array-utils.js';
import { DisjointSet } from '../data-structures/disjoint-set.js';
import { Maze } from './maze.js';

const DFS = {
  initialize: (algoParams) => {
    const maze = algoParams.maze;
    algoParams.stack = [{ x: maths.randInt(0, maze.width), y: maths.randInt(0, maze.height) }];
    algoParams.visited = arrays.newNDArray([maze.width, maze.height], false);
  },
  step: (algoParams) => {
    const { maze, stack, visited } = algoParams;
    if (stack.length > 0) {
      const { x, y } = stack[stack.length - 1];
      visited[x][y] = true;
      const numPossibleMoves = getNumPossibleMoves(x, y, visited);
      if (numPossibleMoves) {
        let directionToMove = maths.randInt(0, numPossibleMoves);
        if (x > 0 && !visited[x - 1][y]) {
          if (!directionToMove) {
            maze.setVWall(x - 1, y, false);
            stack.push({ x: x - 1, y: y });
            return;
          } else {
            directionToMove--;
          }
        }
        if (x < maze.width - 1 && !visited[x + 1][y]) {
          if (!directionToMove) {
            maze.setVWall(x, y, false);
            stack.push({ x: x + 1, y: y });
            return;
          } else {
            directionToMove--;
          }
        }
        if (y > 0 && !visited[x][y - 1]) {
          if (!directionToMove) {
            maze.setHWall(x, y - 1, false);
            stack.push({ x: x, y: y - 1 });
            return;
          } else {
            directionToMove--;
          }
        }
        if (y < maze.height - 1 && !visited[x][y + 1]) {
          if (!directionToMove) {
            maze.setHWall(x, y, false);
            stack.push({ x: x, y: y + 1 });
            return;
          } else {
            directionToMove--;
          }
        }
      } else {
        stack.pop();
      }
    } else {
      return maze;
    }
  },
  draw: (sketch, xCellSize, yCellSize, algoParams) => {
    const { maze, stack, visited } = algoParams;

    // Draw visited cells
    sketch.setFill('#066');
    arrays.forEach(visited, (visited, [x, y]) => {
      if (visited) {
        sketch.fillRect(xCellSize * x, yCellSize * y, xCellSize * (x + 1), yCellSize * (y + 1));
      }
    });

    // Draw stacked cells
    sketch.setFill('#050');
    stack.forEach(({ x, y }) => {
      sketch.fillRect(xCellSize * x, yCellSize * y, xCellSize * (x + 1), yCellSize * (y + 1));
    });

    // Draw top of stack
    sketch.setFill('#A00');
    if (stack.length) {
      const { x, y } = stack[stack.length - 1];
      sketch.fillRect(xCellSize * x, yCellSize * y, xCellSize * (x + 1), yCellSize * (y + 1));
    }

    // Draw maze walls
    maze.draw(sketch, xCellSize, yCellSize);
  },
};

const KRUSKAL = {
  initialize: (algoParams) => {
    const maze = algoParams.maze;
    algoParams.sets = new DisjointSet(maze.width * maze.height);
    algoParams.walls = maths.shuffleList(maze.getWalls());
  },
  step: (algoParams) => {
    const { maze, walls, sets, integrity } = algoParams;
    if (!walls.length) {
      return;
    }

    if (sets.getNumSets() <= 1) {
      return maze;
    }

    const { x, y, isHorizontal } = walls.pop();
    const cell1 = x + y * maze.width;
    const cell2 = (isHorizontal) ? (x + (y + 1) * maze.width) : (x + 1 + y * maze.width);
    const set1 = sets.getSet(cell1);
    const set2 = sets.getSet(cell2);
    if (set1 !== set2 || (integrity !== undefined && Math.random() >= integrity)) {
      sets.join(set1, set2);
      if (isHorizontal) {
        maze.setHWall(x, y, false);
      } else {
        maze.setVWall(x, y, false);
      }
    }
  },
  draw: (sketch, xCellSize, yCellSize, algoParams) => {
    const { sets, walls } = algoParams;
    if (walls.length && sets.getNumSets() > 1) {
      const { x, y, isHorizontal } = walls[walls.length - 1];

      sketch.setStroke('#A00');
      if (isHorizontal) {
        sketch.line(xCellSize * x, yCellSize * (y + 1), xCellSize * (x + 1), yCellSize * (y + 1));
      } else {
        sketch.line(xCellSize * (x + 1), yCellSize * y, xCellSize * (x + 1), yCellSize * (y + 1));
      }
    }
  }
}

function getNumPossibleMoves(x, y, visited) {
  let numPossibleMoves = 0;
  if (x > 0 && !visited[x - 1][y]) numPossibleMoves++;
  if (y > 0 && !visited[x][y - 1]) numPossibleMoves++;
  if (x < visited.length - 1 && !visited[x + 1][y]) numPossibleMoves++;
  if (y < visited[x].length - 1 && !visited[x][y + 1]) numPossibleMoves++;

  return numPossibleMoves;
}

export class MazeGenerator {
  constructor() {
    this.generators = { DFS, 'KRUSKAL\'S': KRUSKAL };
  }

  initialize(width, height, algorithm, algoParams) {
    this.algorithm = algorithm.toUpperCase();
    this.algoParams = { ...algoParams, maze: new Maze(width, height) };
    this.generators[this.algorithm].initialize(this.algoParams);
		return this.algoParams.maze;
  }

  step() {
    return this.generators[this.algorithm].step(this.algoParams);
  }

  draw(sketch, xCellSize, yCellSize) {
    this.generators[this.algorithm].draw(sketch, xCellSize, yCellSize, this.algoParams);
  }

  generate() {
    let maze;
    while (!maze) {
      maze = this.step();
    }
    return maze;
  }
}
