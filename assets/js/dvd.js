import * as sketch from './sketch.js';

const SPEED = 2;
let window;
let bounceObj;
let logo = new Image();

function getRandColor() {
  const baseIntensity = 0;
  const r = Math.floor((256 - baseIntensity) * Math.random()) + baseIntensity;
  const g = Math.floor((256 - baseIntensity) * Math.random()) + baseIntensity;
  const b = Math.floor((256 - baseIntensity) * Math.random()) + baseIntensity;
  return `rgba(${r}, ${g}, ${b}, 1)`;
}

class BounceObj {
  constructor(posX, posY, velX, velY, width, height, color) {
    this.pos = { x: posX, y: posY };
    this.vel = { x: velX, y: velY };
    this.width = width;
    this.height = height;
    this.color = color;
  }

  step() {
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;

    // Handle wall collisions
    if (this.pos.x < 0) {
      this.pos.x *= -1;
      this.vel.x *= -1;
      this.color = getRandColor();
    } else if (this.pos.x + this.width > window.width) {
      this.pos.x = 2 * (window.width - this.width) - this.pos.x;
      this.vel.x *= -1;
      this.color = getRandColor();
    }

    if (this.pos.y < 0) {
      this.pos.y *= -1;
      this.vel.y *= -1;
      this.color = getRandColor();
    } else if (this.pos.y + this.height > window.height) {
      this.pos.y = 2 * (window.height - this.height) - this.pos.y;
      this.vel.y *= -1;
      this.color = getRandColor();
    }
  }

  draw() {
    sketch.drawImage(logo, this.pos.x, this.pos.y, this.width, this.height, this.color);
  }
}

function setup() {
  sketch.setFrameInterval(20);
  window = { width: sketch.getWidth(), height: sketch.getHeight() };
  logo.src = '/assets/img/dvd-logo.png';
  logo.onload = () => {
    bounceObj = new BounceObj(
      window.width * Math.random(),
      window.height * Math.random(),
      SPEED * ((Math.random() < 0.5) ? (-1) : (1)),
      SPEED * ((Math.random() < 0.5) ? (-1) : (1)),
      150, 80,
      getRandColor()
    );
  }
}

function draw() {
  sketch.setStroke('#FFFFFF');
  bounceObj.draw();
  bounceObj.step();
}

sketch.init(setup, draw);