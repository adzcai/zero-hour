const {
  ARENA_WIDTH, ARENA_HEIGHT, SHIP_TURN_SPEED, SHIP_DRAG, SHIP_MAX_SPEED, SHIP_ACCEL, SHIP_RADIUS,
} = require('./consts');
const Vec = require('./Vec');

module.exports = class Player {
  constructor(room, id, pos, attack, body) {
    this.room = room;
    this.id = id;
    this.pos = pos;
    console.log('player pos', pos.x, pos.y);
    this.vel = new Vec();
    this.accel = new Vec();

    this.rotation = 0;
    this.attack = attack;
    this.body = body;
    this.hp = body.maxHP;
    this.rad = SHIP_RADIUS;
    this.alive = true;
    this.laserCount = 0;

    this.input = {
      LEFT: { isDown: false },
      RIGHT: { isDown: false },
      UP: { isDown: false },
      DOWN: { isDown: false },
      SPACE: { isDown: false },
      ENTER: { isDown: false },
    };

    this.nextLaser = Date.now();
    this.nextMissile = Date.now();

    this.powerups = {
      spedUp: false,
      scatter: false,
      numShots: 0,
    };

    const color = body.texture.split('_')[1];
    this.laserColor = `laser${color === 'orange' ? 'Red' : color.charAt(0).toUpperCase() + color.slice(1)}01`;
    // TODO add konami
    this.missileColor = `missile${color === 'orange' ? 'Red' : color.charAt(0).toUpperCase() + color.slice(1)}`;
  }

  update(delta) {
    const left = this.input.LEFT.isDown;
    const right = this.input.RIGHT.isDown;
    const up = this.input.UP.isDown;
    const down = this.input.DOWN.isDown;
    const space = this.input.SPACE.isDown;
    const enter = this.input.ENTER.isDown;

    if (left && !right) {
      this.rotation -= SHIP_TURN_SPEED*delta/1000;
    } else if (right && !left) {
      this.rotation += SHIP_TURN_SPEED*delta/1000;
    }

    if (up && !down) {
      this.accel = Vec.Polar(SHIP_ACCEL, this.rotation);
    } else if (down && !up) {
      this.accel = Vec.Polar(-SHIP_ACCEL, this.rotation);
    } else {
      this.accel.x = 0;
      this.accel.y = 0;
      this.vel.scale(SHIP_DRAG);
    }

    if (space && Date.now() > this.nextLaser) {
      this.nextLaser = Date.now() + (this.powerups.spedUp
        ? this.attack.laser.delay / 2
        : this.attack.laser.delay);
      this.fireLaser(this.attack.TYPES[this.attack.index]);
    }
    if (enter && Date.now() > this.nextMissile) {
      this.nextMissile = new Date() + (this.powerups.spedUp
        ? this.attack.missile.delay / 2
        : this.attack.missile.delay);
      this.room.fire({
        ship: this,
        pos: new Vec(this.x, this.y),
        isMissile: true,
        type: this.missileColor,
      });
    }

    Object.keys(this.powerups).forEach((k) => {
      if (this.powerups[k] && Date.now() > this.powerups[k]) {
        this.powerups[k] = false;
      }
    });

    this.vel.add(this.accel);
    if (this.vel.r > SHIP_MAX_SPEED) this.vel.normalize(SHIP_MAX_SPEED);
    this.pos.add(this.vel);
    if (this.pos.x < 0) this.pos.x = ARENA_WIDTH + this.pos.x;
    else if (this.pos.x > ARENA_WIDTH) this.pos.x -= ARENA_WIDTH;
    if (this.pos.y < 0) this.pos.y = ARENA_HEIGHT + this.pos.y;
    else if (this.pos.y > ARENA_HEIGHT) this.pos.y -= ARENA_HEIGHT;
  }

  fireLaser(type) {
    const shootLaser = (x, y, theta) => this.room.fire({
      id: `${this.id}-${this.laserCount++}`,
      speed: this.attack.laser.speed,
      damage: this.attack.laser.damage,
      isMissile: false,
      type: this.laserColor,
      pos: new Vec(this.pos.x + x, this.pos.y + y),
      theta: this.powerups.scatter ? theta - Math.PI/16 + Math.random()*Math.PI/8 : theta,
    });

    const { x, y } = Vec.Polar(this.rotation, this.rad / 2);
    const nLasers = this.attack.laser.numShots + this.powerups.numShots;

    if (type === 'Forward') {
      for (let i = 1; i <= nLasers; i += 1) {
        shootLaser(
          x - 2*x*i/(nLasers+1),
          y - 2*y*i/(nLasers+1),
          this.rotation,
        );
      }
    } else if (type === 'Spread') {
      const total = Math.PI*1.5*(-4 / (nLasers+3) + 1);
      const inc = total / (nLasers-1);
      const base = this.rotation - total / 2;
      for (let i = 0; i < nLasers; i += 1) shootLaser(0, 0, base + i * inc);
    } else if (type === 'All Around') {
      for (let i = 0; i < nLasers; i += 1) {
        shootLaser(0, 0, this.rotation + i * (2*Math.PI) / nLasers);
      }
    }
  }

  /** returns an object representation of this object for transfer to the client. */
  repr() {
    return {
      id: this.id,
      x: this.pos.x,
      y: this.pos.y,
      keys: this.input,
      rotation: this.rotation,
      texture: this.body.texture,
    };
  }
};
