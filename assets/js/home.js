const FRAME_DELAY = 10;

let canvas;
let ctx;
let ball;

class Ball {
    constructor(posX, posY) {
        this.posX = posX;
        this.posY = posY;
        this.velX = 5;
        this.velY = 2;
        this.width = 64;
        this.height = 48;
    }

    tick() {
        this.posX += this.velX;
        this.posY += this.velY;

        if (this.posX <= 0 || this.posX + this.width >= canvas.width) {
            this.velX *= -1;
        }

        if (this.posY <= 0 || this.posY + this.height >= canvas.height) {
            this.velY *= -1;
        }
    }

    draw() {
        ctx.fillStyle = "rgba(0, 0, 255, 255)";
        ctx.fillRect(this.posX, this.posY, this.width, this.height);
    }
}

function tick() {
    ball.tick();
}

/**
 * Draw all the cells
 */
function draw() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the ball
    ball.draw();

    ctx.stroke();
}

window.onload = () => {
    canvas = document.getElementById("background-canvas");
    canvas.width  = innerWidth;
    canvas.height = innerHeight;
    ctx = canvas.getContext("2d");
    ball = new Ball(100, 100);

    setInterval(() => {
        tick();
        draw();
    }, FRAME_DELAY);
}