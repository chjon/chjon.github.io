import * as maths from '../math-utils.js';

export class Quadtree {
  constructor(x, y, width, height, maxBucketSize, maxDepth) {
    this.mid = {
      x: x + width / 2,
      y: y + height / 2,
    };
    this.bounds = {
      left: x,
      right: x + width,
      top: y,
      bottom: y + height,
    }
    this.maxBucketSize = maxBucketSize;
    this.maxDepth = maxDepth;
    this.bucket = [];
    this.length = 0;
  }
  
  isInBounds(obj) {
    return (
      obj.x >= this.bounds.left && obj.x < this.bounds.right &&
      obj.y >= this.bounds.top && obj.y < this.bounds.bottom
    );
  }

  minDist2(x, y) {
    let closestX = x, closestY = y;

    if (x < this.bounds.left) {
      closestX = this.bounds.left;
    } else if (x > this.bounds.right) {
      closestX = this.bounds.right;
    }

    if (y < this.bounds.top) {
      closestY = this.bounds.top;
    } else if (y > this.bounds.bottom) {
      closestY = this.bounds.bottom;
    }

    return maths.dist2(x, y, closestX, closestY);
  }

  getCorrectQuad(obj) {
    if (obj.x < this.mid.x) {
      return (obj.y < this.mid.y) ? (this.nw) : (this.sw);
    } else {
      return (obj.y < this.mid.y) ? (this.ne) : (this.se);
    }
  }

  pushToQuad(obj) {
    return this
      .getCorrectQuad(obj)
      .push(obj);
  }

  push(obj) {
    if (!this.isInBounds(obj)) return;
    this.length++;

    if (this.bucket && this.bucket.length === this.maxBucketSize && this.maxDepth) {
      const halfWidth = (this.bounds.right - this.bounds.left) / 2;
      const halfHeight = (this.bounds.bottom - this.bounds.top) / 2;
      this.nw = new Quadtree(this.bounds.left, this.bounds.top, halfWidth, halfHeight, this.maxBucketSize, this.maxDepth - 1);
      this.ne = new Quadtree(this.mid.x, this.bounds.top, halfWidth, halfHeight, this.maxBucketSize, this.maxDepth - 1);
      this.sw = new Quadtree(this.bounds.left, this.mid.y, halfWidth, halfHeight, this.maxBucketSize, this.maxDepth - 1);
      this.se = new Quadtree(this.mid.x, this.mid.y, halfWidth, halfHeight, this.maxBucketSize, this.maxDepth - 1);
      
      this.bucket.forEach((storedObj) => {
        this.pushToQuad(storedObj);
      });

      this.bucket = undefined;
    };

    if (this.bucket || !this.maxDepth) {
      this.bucket.push(obj);
    } else {
      this.pushToQuad(obj);
    }
  }

  getClosestWithin(x, y, maxR2) {
    let boundR2 = maxR2;
    const minDist2Val = this.minDist2(x, y);

    // Check if the desired range is possibly in this quadtree
    if (minDist2Val > boundR2) {
      return undefined;
    } 

    // Check the current bucket
    if (this.bucket) {
      if (!this.bucket.length) return undefined;

      let closestIndex = 0;
      let minDist2 = maths.dist2(x, y, this.bucket[0].x, this.bucket[0].y)
      for (let i = 1; i < this.bucket.length; i = i + 1) {
        const newDist2 = maths.dist2(x, y, this.bucket[i].x, this.bucket[i].y);
        if (newDist2 < minDist2) {
          closestIndex = i;
          minDist2 = newDist2;
        }
      }

      if (minDist2 < boundR2) {
        return this.bucket[closestIndex];
      } else {
        return undefined;
      }
    }

    // Sort by the minimum possible distance to a quadtree as an initial heuristic
    let treeMinDist2Pairs = [
      { qTree: this.ne, dist2: (this.ne.length) ? (this.ne.minDist2(x, y)) : (undefined) },
      { qTree: this.nw, dist2: (this.nw.length) ? (this.nw.minDist2(x, y)) : (undefined) },
      { qTree: this.se, dist2: (this.se.length) ? (this.se.minDist2(x, y)) : (undefined) },
      { qTree: this.sw, dist2: (this.sw.length) ? (this.sw.minDist2(x, y)) : (undefined) },
    ].sort((a, b) => {
      if (b.dist2 === undefined) return -1;
      if (a.dist2 === undefined) return 1;
      return a.dist2 - b.dist2;
    });
    
    let minTree = undefined;
    let minPoint = undefined;

    for (let i = 0; i < treeMinDist2Pairs.length; i = i + 1) {
      // Check if the current guess is closer than any other possible distance
      if (treeMinDist2Pairs[i].dist2 === undefined && boundR2 < treeMinDist2Pairs[i].dist2) {
        break;
      }

      // Check if the next quadtree contains a closer point
      const tmpTree = treeMinDist2Pairs[i].qTree;
      if (!tmpTree.length) continue;

      const tmpPoint = tmpTree.getClosestWithin(x, y, boundR2);
      if (!tmpPoint) continue;

      const tmpDist2 = maths.dist2(x, y, tmpPoint.x, tmpPoint.y);

      if (tmpDist2 < boundR2) {
        minTree = tmpTree;
        minPoint = tmpPoint;
      }
    }

    return minPoint;
  }

  pop(obj) {
    if (!this.isInBounds(obj)) {
      return undefined;
    }

    // Check the current bucket
    if (this.bucket) {
      if (!this.bucket.length) return undefined;

      let foundIndex;
      for (let i = 0; i < this.bucket.length; i = i + 1) {
        if (this.bucket[i] === obj) {
          foundIndex = i;
          break;
        }
      }

      if (foundIndex !== undefined) {
        const retVal = this.bucket[foundIndex];
        this.bucket = this.bucket.slice(0, foundIndex).concat(
          this.bucket.slice(foundIndex + 1, this.bucket.length)
        );

        this.length--;
        return retVal;
      }

      return undefined;
    }

    const retVal = this
      .getCorrectQuad(obj)
      .pop(obj);

    if (retVal) {
      this.length--;
      if (!this.length) {
        this.bucket = [];
      }
    }

    return retVal;
  }

  getAllWithin(x1, y1, x2, y2) {
    // Make sure the coordinates of the selection box are increasing
    if (x2 < x1) {
      const temp = x1;
      x1 = x2;
      x2 = temp;
    }

    if (y2 < y1) {
      const temp = y1;
      y1 = y2;
      y2 = temp;
    }

    // Get shallow children in bounds
    if (this.bucket) {
      return this.bucket.filter((obj) => {
        return obj.x >= x1 && obj.x <= x2 && obj.y >= y1 && obj.y <= y2;
      });
    }

    // Get deep children
    let foundPoints = [];
    if (x1 < this.mid.x) {
      if (y1 < this.mid.y) {
        foundPoints = foundPoints.concat(this.nw.getAllWithin(x1, y1, x2, y2));
      }

      if (y2 >= this.mid.y) {
        foundPoints = foundPoints.concat(this.sw.getAllWithin(x1, y1, x2, y2));
      }
    }

    if (x2 >= this.mid.x) {
      if (y1 < this.mid.y) {
        foundPoints = foundPoints.concat(this.ne.getAllWithin(x1, y1, x2, y2));
      }

      if (y2 >= this.mid.y) {
        foundPoints = foundPoints.concat(this.se.getAllWithin(x1, y1, x2, y2));
      }
    }

    return foundPoints;
  }

  // Get all the objects in the quadtree
  getAll() {
    if (this.bucket) {
      return this.bucket.slice(0);
    }

    return []
      .concat(this.ne.getAll())
      .concat(this.nw.getAll())
      .concat(this.se.getAll())
      .concat(this.sw.getAll());
  }

  clear() {
    this.bucket = [];
    this.length = 0;
    this.ne = undefined;
    this.nw = undefined;
    this.se = undefined;
    this.sw = undefined;
  }
}