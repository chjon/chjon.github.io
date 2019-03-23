export class DisjointSet {
  constructor(numSets) {
    this.numSets = numSets;
    this.sets = [];
    for (let i = 0; i < numSets; i++) {
      this.sets[i] = i;
    }
  }

  getSet(i) {
    return (i === this.sets[i]) ? (i) : (this.getSet(this.sets[i]));
  }

  join(i, j) {
    i = this.getSet(i);
    j = this.getSet(j);

    if (i !== j) {
      this.numSets--;
      this.sets[j] = i;
    }
  }

  getNumSets() {
    return this.numSets;
  }
}