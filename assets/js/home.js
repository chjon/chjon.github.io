const FRAME_DELAY = 100;

let canvas;
let ctx;
let ball;

class Ball {
    constructor(posX, posY) {
        this.posX = posX;
        this.posY = posY;
        this.velX = 1;
        this.velY = 1;
    }

    tick() {
        this.posX += this.velX;
        this.posY += this.velY;
    }

    draw() {
        ctx.fillStyle = "rgba(0, 0, 255, 255)";
        ctx.fillRect(this.posX, this.posY, 5, 5);
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