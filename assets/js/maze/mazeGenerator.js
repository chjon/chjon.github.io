import * as maths from '../math-utils.js';
import * as arrays from '../array-utils.js';
import { DisjointSet } from '../data-structures/disjoint-set.js';
import { Maze } from './maze.js';

export class MazeGenerator {
  generate(width, height, generationType) {
    if (generationType === 'DFS') {
      return this.generateDFS(width, height);
    } else if (generationType === 'Kruskal') {
      return this.generateKruskal(width, height);
    }
  }

  generateMazeDFS(width, height) {
    const stack = [{ x: maths.randInt(width), y: maths.randInt(height) }];
    const visited = newNDArray([width, height], false);
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

  generateDFSAnimated(width, height) {
    this.width = width;
    this.height = height;
    this.stack = [{ x: maths.randInt(width), y: maths.randInt(height) }];
    this.visited = newNDArray([width, height], false);
    this.maze = new Maze(width, height);
  }

  generateDFSStep() {
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

  generateKruskal(width, height) {
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

  generateKruskalAnimated(width, height) {
    this.width = width;
    this.height = height;
    this.sets = new DisjointSet(width * height);
    this.maze = new Maze(width, height);
    this.walls = maths.shuffleList(this.maze.getWalls());
    return this.maze;
  }

  generateKruskalStep() {
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

  drawDFS(sketch, width, height) {
    const hScaleFactor = width / this.width;
    const vScaleFactor = height / this.height;

    // Draw visited cells
    sketch.setFill('#066');
    arrays.forEach(this.visited, (visited, [x, y]) => {
      if (visited) {
        sketch.fillRect(hScaleFactor * x, vScaleFactor * y, hScaleFactor * (x + 1), vScaleFactor * (y + 1));
      }
    });

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
    this.maze.draw(sketch, width, height);
  }

  drawKruskal(sketch, width, height) {
    this.maze.draw(sketch, width, height);
    if (this.walls.length && this.sets.getNumSets() > 1) {
      const hScaleFactor = width / this.width;
      const vScaleFactor = height / this.height;
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
