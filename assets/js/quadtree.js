import * as maths from './math-utils.js';
import * as sketch from './sketch.js';

export class Quadtree {
  constructor(x, y, width, height, maxBucketSize, maxDepth, isRoot = false) {
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
    this.isRoot = isRoot;
    this.bucket = [];
    this.length = 0;
  }
  
  isInBounds(x, y) {
    return (
      x >= this.bounds.left && x < this.bounds.right &&
      y >= this.bounds.top && y < this.bounds.bottom
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

  getCorrectQuad(x, y) {
    if (x < this.mid.x) {
      return (y < this.mid.y) ? (this.nw) : (this.sw);
    } else {
      return (y < this.mid.y) ? (this.ne) : (this.se);
    }
  }

  addPointToQuad(x, y) {
    return this
      .getCorrectQuad(x, y)
      .addPoint(x, y);
  }

  addPoint(x, y) {
    if (!this.isInBounds(x, y)) return;
    this.length++;

    if (this.bucket && this.bucket.length === this.maxBucketSize && this.maxDepth) {
      const halfWidth = (this.bounds.right - this.bounds.left) / 2;
      const halfHeight = (this.bounds.bottom - this.bounds.top) / 2;
      this.nw = new Quadtree(this.bounds.left, this.bounds.top, halfWidth, halfHeight, this.maxBucketSize, this.maxDepth - 1);
      this.ne = new Quadtree(this.mid.x, this.bounds.top, halfWidth, halfHeight, this.maxBucketSize, this.maxDepth - 1);
      this.sw = new Quadtree(this.bounds.left, this.mid.y, halfWidth, halfHeight, this.maxBucketSize, this.maxDepth - 1);
      this.se = new Quadtree(this.mid.x, this.mid.y, halfWidth, halfHeight, this.maxBucketSize, this.maxDepth - 1);
      
      this.bucket.forEach(({ x, y }) => {
        this.addPointToQuad( x, y );
      });

      this.bucket = undefined;
    };

    if (this.bucket || !this.maxDepth) {
      this.bucket.push({ x, y });
    } else {
      this.addPointToQuad( x, y );
    }
  }

  popClosestWithin(x, y, maxR2) {
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
        const closest = this.bucket[closestIndex];
        this.bucket = this.bucket.slice(0, closestIndex).concat(
          this.bucket.slice(closestIndex + 1, this.bucket.length)
        );

        this.length--;
        return closest; 
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

      const tmpPoint = tmpTree.popClosestWithin(x, y, boundR2);
      if (!tmpPoint) continue;

      const tmpDist2 = maths.dist2(x, y, tmpPoint.x, tmpPoint.y);

      if (tmpDist2 < boundR2) {
        if (minTree) {
          minTree.addPoint(minPoint.x, minPoint.y);
        }

        minTree = tmpTree;
        minPoint = tmpPoint;
      } else {
        tmpTree.addPoint(tmpPoint);
      }
    }

    if (minPoint) {
      this.length--;

      if (this.length === 0) {
        this.bucket = [];
      }
    }
    return minPoint;
  }

  draw() {
    sketch.rect(this.bounds.left, this.bounds.top, this.bounds.right, this.bounds.bottom);

    if (this.bucket) {
      this.bucket.forEach(({ x, y }) => {
        sketch.ellipse(x, y, 5, 5);
      });
    } else {
      this.ne.draw();
      this.nw.draw();
      this.se.draw();
      this.sw.draw();
    }
  }
}