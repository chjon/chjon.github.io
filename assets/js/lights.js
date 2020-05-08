import * as dom from './dom-utils.js';
import * as sketch from './sketch.js';

let window;
let mousePos;
let mouseDown = false;
let light;
let walls = [];
let angleDelta = 0.000001;

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  mag() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  rotate(a) {
    return new Vector(
      this.x * Math.cos(a) - this.y * Math.sin(a),
      this.x * Math.sin(a) + this.y * Math.cos(a)
    );
  }

  mul(s) {
    return new Vector(s * this.x, s * this.y);
  }
}

class Wall {
  /**
   * Construct a wall with arbitrary orientation
   * @param {Vector} p1 first point
   * @param {Vector} p2 second point
   */
  constructor(p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
  }

  draw() {
    sketch.line(this.p1.x, this.p1.y, this.p2.x, this.p2.y);
  }
}

class Light {
  constructor(pos, alpha) {
    this.pos = pos;
    this.alpha = alpha;
  }

  setPos(pos) {
    this.pos = pos;
  }

  /**
   * Find the wall with the closest intersection
   * @param {Vector} dir
   * @param {Wall[]} walls 
   */
  getIntersection(dir, walls) {
    const { x, y } = walls.reduce((min, wall) => {
      const wallScale = (dir.y * (wall.p1.x - this.pos.x) - dir.x * (wall.p1.y - this.pos.y)) / (dir.y * (wall.p1.x - wall.p2.x) - dir.x * (wall.p1.y - wall.p2.y));
      if (wallScale >= 0 && wallScale <= 1) {
        const dirScale = (wall.p1.x + wallScale * (wall.p2.x - wall.p1.x) - this.pos.x) / dir.x;
        if (dirScale >= 0) {
          const x = wall.p1.x + wallScale * (wall.p2.x - wall.p1.x);
          const y = wall.p1.y + wallScale * (wall.p2.y - wall.p1.y);
          const dx = x - this.pos.x;
          const dy = y - this.pos.y;
          const dist2 = dx * dx + dy * dy;
          if (dist2 < min.dist2) return { x, y, dist2 };
        }
      }
      return min;
    }, { x: 0, y: 0, dist2: Infinity });
    return { x, y };
  }

  /**
   * Draw light
   * @param {Wall[]} walls 
   */
  draw(walls) {
    let intersections = [];
    const castRay = ({ x, y }) => {
      const dir = new Vector(x - this.pos.x, y - this.pos.y);
      intersections.push(this.getIntersection(dir.rotate(+angleDelta), walls));
      intersections.push(this.getIntersection(dir.rotate(-angleDelta), walls));
    };

    walls.forEach((wall) => {
      castRay(wall.p1);
      castRay(wall.p2);
    });

    intersections.sort((a, b) => {
      return Math.atan2(a.y - this.pos.y, a.x - this.pos.x) - Math.atan2(b.y - this.pos.y, b.x - this.pos.x);
    });

    sketch.poly(intersections);
  }
}

const B64LUT = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_-';

function fromBase64(val) {
  return B64LUT.indexOf(val.charAt(0)) * 64 + B64LUT.indexOf(val.charAt(1))
}

function decodeB64(data) {
  const decoded = [];
  let last;
  let first;
  for (let i = 0; i < data.length; i = i + 4) {
    const cur = new Vector(
      fromBase64(data.charAt(i + 0) + data.charAt(i + 1)),
      fromBase64(data.charAt(i + 2) + data.charAt(i + 3))
    );

    if (last && cur.x === last.x && cur.y === last.y) {
      decoded.push(new Wall(first, last));
      last = undefined;
    } else {
      if (last) {
        decoded.push(new Wall(last, cur));
      } else {
        first = cur;
      }
      last = cur;
    }
  }

  return decoded.map((wall) => {
    return new Wall(wall.p1.mul(25), wall.p2.mul(25));
  });
}

const letterEncoding = {
  a: "0202020C040C04080608060C080C0802080204040406060606040604",
  b: "0202020C070C080B080807070806080307020702040404060606060406040408040A060A06080608",
  h: "0202020C040C04080608060C080C080206020606040604020402",
  i: "0202020C040C04020402",
  p: "0202020C040C040808080802080204040406060606040604",
  y: "020202080408040C060C06080808080206020606040604020402",
};

const letterWallMap = Object.keys(letterEncoding).reduce((letterWallMap, key) => {
  letterWallMap[key] = decodeB64(letterEncoding[key]);
  return letterWallMap;
}, {});

function decodePlaintext(msg) {
  let msgWalls = [];
  let offset = 0;
  for (let i = 0; i < msg.length; ++i) {
    let letterWalls = letterWallMap[msg.charAt(i)];
    const width = letterWalls.reduce((max, wall) => {
      return Math.max(max, wall.p1.x, wall.p2.x);
    }, -Infinity);
    msgWalls = msgWalls.concat(letterWalls.map((wall) => {
      return new Wall(
        new Vector(wall.p1.x + offset, wall.p1.y),
        new Vector(wall.p2.x + offset, wall.p2.y)
      );
    }));
    offset += width;
  }

  return msgWalls;
}

function setup() {
  sketch.setFrameInterval(20);
  window = { width: sketch.getWidth(), height: sketch.getHeight() };

  // Window borders
  walls.push(new Wall({ x: 0, y: 0 }, { x: 0, y: window.height }));
  walls.push(new Wall({ x: 0, y: window.height }, { x: window.width, y: window.height }));
  walls.push(new Wall({ x: window.width, y: window.height }, { x: window.width, y: 0 }));
  walls.push(new Wall({ x: window.width, y: 0 }, { x: 0, y: 0 }));
  
  const { query } = dom.decodeURI();
  const msg = query.m || "m";

  if (msg) {
    walls = walls.concat(decodePlaintext(msg));
  } else if (query.d) {
    walls = walls.concat(decodeB64(query.d));
  }
  
  console.log(walls);


  mousePos = new Vector(0, 0);
  light = new Light(mousePos, 1);
}

function draw() {

  // Drawing
  sketch.setStroke('#FFFFFFFF');
  walls.forEach((wall) => { wall.draw(); });

  if (mouseDown) {
    sketch.setFill('#FFFF007F');
    light.draw(walls);
  }

  // Calculation
  light.pos = mousePos;
}

document.onmousemove = (e) => {
  mousePos = sketch.getMousePos(e);
}

document.onmousedown = (e) => {
  mouseDown = true;
}

document.onmouseup = (e) => {
  mouseDown = false;
}

sketch.init(setup, draw);