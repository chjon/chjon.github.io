import * as dom from './dom-utils.js';
import * as sketch from './sketch.js';

let window;
let mousePos;
let mouseDown = false;
let light;
let walls = [];
const ANGLE_DELTA = 0.000001;
const SPACE_SIZE = 5;
const LINE_WIDTH = 32;

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
      intersections.push(this.getIntersection(dir.rotate(+ANGLE_DELTA), walls));
      intersections.push(this.getIntersection(dir.rotate(-ANGLE_DELTA), walls));
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

  return decoded;
}

const letterEncoding = {
  a: "0203020C040C04080608060C080C080307020302030204040406060606040604",
  b: "0202020C070C080B080807070806080307020702040404060606060406040408040A060A06080608",
  c: "0203020B030C080C080A040A04040804080203020302",
  d: "0202020C070C080B0803070207020404040A060A06040604",
  e: "0202020C080C080A040A04080808080604060404080408020802",
  f: "0202020C040C04080808080604060404080408020802",
  g: "0203020B030C070C080B08080608060A040A04040804080203020302",
  h: "0202020C040C04080608060C080C080206020606040604020402",
  i: "0202020C040C04020402",
  j: "020A020C080C08020602060A060A",
  k: "0202020C040C0408060C080C060708020602040604020402",
  l: "0202020C080C080A040A04020402",
  m: "0202020C040C0406060A0806080C0A0C0A020802060604020402",
  n: "0202020C040C0406060C080C08020602060804020402",
  o: "0203020B030C070C080B08030702030203020404040A060A06040604",
  p: "0202020C040C04080708080708030702070204040406060606040604",
  q: "0203020B030C080C070B080A08030702030203020404040A060A06040604",
  r: "0202020C040C0408060C080C06080708080708030702070204040406060606040604",
  s: "0203020703080608060A020A020C070C080B08070706040604040804080203020302",
  t: "020202040404040C060C0604080408020802",
  u: "0202020B030C070C080B08020602060A040A04020402",
  v: "0202040C060C08020602050804020402",
  w: "0202040C060C0709080C0A0C0C020A0209090706050904020402",
  x: "02020407020C040C0509060C080C060708020602050504020402",
  y: "02020408040C060C060808020602050604020402",
  z: "020202040604020A020C080C080A040A080408020802",
  "'": "0202020403040206040404020402",
  "!": "02020208040804020402020A020C040C040A040A",
};

const letterWallMap = Object.keys(letterEncoding).reduce((letterWallMap, key) => {
  letterWallMap[key] = decodeB64(letterEncoding[key]);
  return letterWallMap;
}, {});

function decodePlaintext(msg) {
  let words = [];
  let wordWalls = [];
  let offset = new Vector(0, 0);
  let prevWordWidth = 0;
  let curWordWidth = 0;
  let lineHeight = 0;
  for (let i = 0; i < msg.length; ++i) {
    let letterWalls = letterWallMap[msg.charAt(i)] || [];
    if (msg.charAt(i) == ' ') {
      if (prevWordWidth + curWordWidth > LINE_WIDTH) {
        words.push(wordWalls);
        wordWalls = [];
        offset.x = 0;
        offset.y += lineHeight;
        lineHeight = 0;
      } else {
        prevWordWidth += SPACE_SIZE;
        offset.x += SPACE_SIZE;
      }
    } else {
      const { width, height } = letterWalls.reduce(({ width, height }, wall) => {
        return { width: Math.max(width, wall.p1.x, wall.p2.x), height: Math.max(height, wall.p1.y, wall.p2.y) };
      }, { width: 0, height: lineHeight });
      lineHeight = height;

      curWordWidth += width;
      wordWalls = wordWalls.concat(letterWalls.map((wall) => {
        return new Wall(
          new Vector(wall.p1.x + offset.x, wall.p1.y + offset.y),
          new Vector(wall.p2.x + offset.x, wall.p2.y + offset.y)
        );
      }));
      offset.x += width;
    }
  }

  if (prevWordWidth + curWordWidth > LINE_WIDTH) {
    words.push(wordWalls);
  }

  return words;
}

function centerAndScale(wordWalls, maxWidth, maxHeight) {
  const paddingPercent = 0.1;
  const padding = new Vector(maxWidth * paddingPercent, maxHeight * paddingPercent);
  maxWidth = maxWidth - 2 * padding.x;
  maxHeight = maxHeight - 2 * padding.y;
  const bounds = wordWalls.reduce((bounds, lineWalls) => {
    return lineWalls.reduce((bounds, wall) => {
      return {
        min: new Vector(Math.min(bounds.min.x, wall.p1.x, wall.p2.x), Math.min(bounds.min.y, wall.p1.y, wall.p2.y)),
        max: new Vector(Math.max(bounds.max.x, wall.p1.x, wall.p2.x), Math.max(bounds.max.y, wall.p1.y, wall.p2.y)),
      };
    }, bounds);
  }, { min: new Vector(Infinity, Infinity), max: new Vector(-Infinity, -Infinity) });
  const size = new Vector(bounds.max.x - bounds.min.x, bounds.max.y - bounds.min.y);
  const center = new Vector((bounds.max.x + bounds.min.x) / 2, (bounds.max.y + bounds.min.y) / 2);
  const scale = new Vector(maxWidth / size.x, maxHeight / size.y);
  const scaleFactor = scale.x * size.y > maxHeight ? scale.y : scale.x;
  return wordWalls.map((lineWalls) => {
    const lineBounds = lineWalls.reduce(({ min, max }, wall) => {
      return { min: Math.min(min, wall.p1.x, wall.p2.x), max: Math.max(max, wall.p1.x, wall.p2.x) };
    }, { min: Infinity, max: -Infinity });
    const delta = (lineBounds.max + lineBounds.min) / 2;
    return lineWalls.map((wall) => {
      return new Wall(
        new Vector((wall.p1.x - delta) * scaleFactor + maxWidth / 2 + padding.x, (wall.p1.y - center.y) * scaleFactor + maxHeight / 2 + padding.y),
        new Vector((wall.p2.x - delta) * scaleFactor + maxWidth / 2 + padding.x, (wall.p2.y - center.y) * scaleFactor + maxHeight / 2 + padding.y)
      );
    });
  });
}

function flatten(list) {
  return list.reduce((flatList, element) => {
    if (Array.isArray(element)) {
      flatList = flatList.concat(flatten(element));
    } else {
      flatList.push(element);
    }
    return flatList;
  }, []);
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
  const msg = query.m || "lights";

  if (query.d) {
    walls = walls.concat(decodeB64(query.d));
  } else {
    walls = walls.concat(flatten(centerAndScale(decodePlaintext(msg), window.width, window.height)));
  }

  mousePos = new Vector(0, 0);
  light = new Light(mousePos, 1);
}

function draw() {
  // Drawing
  let ctx = sketch.getContext();
  var grd = ctx.createRadialGradient(
    light.pos.x, light.pos.y, Math.floor(0.1 * Math.min(window.width, window.height)),
    light.pos.x, light.pos.y, Math.floor(0.4 * Math.min(window.width, window.height))
  );
  grd.addColorStop(0, '#FFFF007F');
  grd.addColorStop(1, '#FFFF0000');
  ctx.fillStyle = grd;
  light.draw(walls);
  
  if (mouseDown) {
    sketch.setStroke('#FFFFFFFF');
    walls.forEach((wall) => { wall.draw(); });
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