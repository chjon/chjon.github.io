export class Maze {
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

  draw(sketch, width, height) {
    const hScaleFactor = width / this.width;
    const vScaleFactor = height / this.height;

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
