class Vector {
  constructor(x=0, y=0) {
    this.x = x;
    this.y = y;
  }

  add(vec) {
    this.x += vec.x;
    this.y += vec.y;
  }

  to(vec) {
    return new Vector(vec.x - this.x, vec.y - this.y);
  }

  normalize(r1) {
    [this.x, this.y] = [this.x*r1/this.r, this.y*r1/this.r];
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
Vector.Polar = (r, theta) => new Vector(r*Math.sin(theta), -r*Math.cos(theta));

module.exports = Vector;
