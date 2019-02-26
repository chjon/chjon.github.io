import * as sketch from './sketch.js';

function setup() {

}

function draw() {
  sketch.setStroke('#FFFFFF');
  sketch.rect(0, 0, 300, 300);
}

sketch.init(setup, draw, 'resistor-color-decoder', 300, 300);