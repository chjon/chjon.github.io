const FRAME_DELAY = 100;
const MAX_DIMENSIONS = { width: 50, height: 50 };

class GOL {
    getColor(alpha) {
        return 'rgba(0, 50, 0, ' + alpha + ')';
    }

    constructor({ width, height }, ctx, { numCols, numRows }, initialProbability = 0.3, alphaCoefficient = 0.2) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.numCols = numCols;
        this.numRows = numRows;
        this.initialProbability = initialProbability;
        this.alphaCoefficient = alphaCoefficient;

        this.maxDist = (numCols * numCols + numRows * numRows) / 4;
        this.cellWidth = width / numCols;
        this.cellHeight = height / numRows;
        this.cells = [];

        this.init();
    }

    init() {
        this.cells = [];
        for (let i = 0; i < this.numCols; i = i + 1) {
            this.cells[i] = [];
            for (let j = 0; j < this.numRows; j = j + 1) {
                this.cells[i][j] = Math.random() < this.initialProbability;
            }
        }
    }

    iterate(callback) {
        for (let i = 0; i < this.numCols; i = i + 1) {
            for (let j = 0; j < this.numRows; j = j + 1) {
                callback(i, j);
            }
        }
    }

    tick() {
        const neighbourCount = [];
        this.iterate((x, y) => {
            if (!neighbourCount[x]) neighbourCount[x] = [];
            neighbourCount[x][y] = 0;

            for (let i = -1; i <= 1; i = i + 1) {
                for (let j = -1; j <= 1; j = j + 1) {
                    if (i != 0 || j != 0) {
                        neighbourCount[x][y] += (this.cells[x + i] && this.cells[x + i][y + j]) ? (1) : (0);
                    }
                }
            }
        });

        this.iterate((i, j) => {
            this.cells[i][j] = (
                (neighbourCount[i][j] === 3) ||
                (neighbourCount[i][j] === 2 && this.cells[i][j])
            );
        });
    }

    draw() {
        this.iterate((i, j) => {
            if (this.cells[i][j]) {
                const distX = Math.abs(this.numCols - 2 * (i + 1));
                const distY = Math.abs(this.numRows - 2 * (j + 1));
                const alpha = this.alphaCoefficient * this.maxDist / (distX * distX + distY * distY);
                
                this.ctx.fillStyle = this.getColor(alpha);
                this.ctx.fillRect(
                    this.cellWidth * i,
                    this.cellHeight * j,
                    this.cellWidth,
                    this.cellHeight
                );
            }
        });
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

window.onload = () => {
    const canvas = document.getElementById('background-canvas');
    canvas.width  = innerWidth;
    canvas.height = innerHeight;
    const ctx = canvas.getContext('2d');
    const gol = new GOL(canvas, ctx, constrainDimensions(
        { actualWidth: canvas.width, actualHeight: canvas.height },
        { maxWidth: MAX_DIMENSIONS.width, maxHeight: MAX_DIMENSIONS.height },
    ));

    setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        gol.draw();
        ctx.stroke();
        gol.tick();
    }, FRAME_DELAY);
}