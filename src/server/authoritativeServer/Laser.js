const Vec = require('./Vec');

const LIFESPAN = 3000;

module.exports = class Laser {
  constructor(room, {
    id, type, damage, speed, pos, theta,
  }) {
    this.id = id;
    this.shooter = this.id.substring(0, this.id.lastIndexOf('-'));
    this.room = room;
    this.damage = damage;

    this.type = type;
    this.isMissile = type.startsWith('missile');

    this.lifespan = LIFESPAN;

    this.speed = speed;
    this.pos = pos;
    this.vel = Vec.Polar(speed, theta);
    this.theta = theta;
  }

  update(delta) {
    if (this.isMissile) {
      if (!this.target) this.target = this.room.findTarget(this.shooter, this.pos);
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
      type: this.type,
      damage: this.damage,
      lifespan: this.lifespan,
      target: this.target ? this.target.id : null,
      speed: this.speed,
      x: this.pos.x,
      y: this.pos.y,
      theta: this.theta,
    };
  }
};
