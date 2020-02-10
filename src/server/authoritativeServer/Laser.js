const Vec = require('./Vec');

const LIFESPAN = 3000;
const MISSILE_SPEED = 100;

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
    this.theta = theta;

    if (this.isMissile) this.target = room.findTarget(this.pos);
    else this.vel = Vec.Polar(speed, theta);
  }

  update(delta) {
    if (this.isMissile) {
      if (this.target === null) this.target = this.room.findTarget(this.pos);
      if (this.target !== null) this.vel = this.pos.to(this.target).normalize(MISSILE_SPEED);
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
    };
  }
};
