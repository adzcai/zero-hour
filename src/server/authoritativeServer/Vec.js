class Vector {
  constructor(x=0, y=0) {
    this.x = x;
    this.y = y;
  }

  add(vec) {
    this.x += vec.x;
    this.y += vec.y;
  }

  normalize(r1) {
    if (this.r === 0) return;
    const x = this.x*r1/this.r;
    const y = this.y*r1/this.r;
    this.x = x;
    this.y = y;
  }

  scale(k) {
    this.x *= k;
    this.y *= k;
  }

  get r() {
    return Math.sqrt(this.x*this.x + this.y*this.y);
  }
}

// Using heading notation
Vector.Polar = (r=0, theta=0) => new Vector(r*Math.sin(theta), -r*Math.cos(theta));
Vector.To = (vec1, vec2) => new Vector(vec2.x - vec1.x, vec2.y - vec1.y);

module.exports = Vector;
