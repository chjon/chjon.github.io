import * as arrays from '../array-utils.js';

export class Maze {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.hWalls = arrays.newNDArray([this.width, this.height - 1], true);
    this.vWalls = arrays.newNDArray([this.width - 1, this.height], true);
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

  draw(sketch, width, height) {
    const hScaleFactor = width / this.width;
    const vScaleFactor = height / this.height;

    arrays.forEach(this.hWalls, (hasWall, [x, y]) => {
      if (hasWall) {
        sketch.line(hScaleFactor * x, vScaleFactor * (y + 1), hScaleFactor * (x + 1), vScaleFactor * (y + 1));
      }
    });

    arrays.forEach(this.vWalls, (hasWall, [x, y]) => {
      if (hasWall) {
        sketch.line(hScaleFactor * (x + 1), vScaleFactor * y, hScaleFactor * (x + 1), vScaleFactor * (y + 1));
      }
    });
  }
}
