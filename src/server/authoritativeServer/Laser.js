const Vec = require('./Vec');

const LIFESPAN = 3000;

module.exports = class Laser {
  constructor(room, {
    id, shooter, pos, damage, isMissile, type, speed, theta,
  }) {
    this.id = id;
    this.room = room;
    this.shooter = shooter;
    this.pos = pos;
    this.damage = damage;
    this.isMissile = isMissile;
    this.type = type;
    this.lifespan = LIFESPAN;
    this.speed = speed;
    this.theta = theta;
    this.vel = Vec.Polar(speed, theta);
  }

  update(delta) {
    if (this.isMissile) {
      if (!this.target) this.target = this.room.findTarget(this.id, this.pos);
      if (this.target) {
        console.log('pos, vel, target pos:', this.pos, this.vel, this.target.pos);
        this.vel = Vec.To(this.pos, this.target.pos);
        console.log('vel after normalization by', this.speed, 'and r:', this.vel, this.vel.r);
        this.vel.normalize(this.speed);
        console.log('vel:', this.vel);
      }
    }
    this.pos.add(this.vel);
    this.lifespan -= delta;
  }

  repr() {
    return {
      id: this.id,
      x: this.pos.x,
      y: this.pos.y,
      theta: this.theta,
      type: this.type,
      lifespan: this.lifespan,
      target: this.target ? this.target.id : null,
    };
  }
};
