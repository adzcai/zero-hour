export default class PlayerShip extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y);

    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);

    this.body.setCollideWorldBounds(true);

    this.setDepth(10);

    this.setTexture('spaceshooter', this.scene.registry.get('playerTexture'));
    this.body.setSize(this.displayHeight, this.displayHeight);

    this.hp = this.scene.registry.values.playerBody.maxHP;

    this.nextShot = 0;
    this.nextMissile = 0;

    this.powerups = {
      spedUp: false,
      scatter: false,
      numShots: 0,
    };

    this.body.useDamping = true;
    this.body.setDrag(0.85);
    this.body.setMaxVelocity(650);

    this.thrust = this.scene.add.particles('trace').setDepth(this.depth - 1).createEmitter({
      scale: { start: 0.2, end: 0 },
      blendMode: 'ADD',
      lifespan: {
        onEmit: (/* particle, key, t, value */) => Phaser.Math.Percent(this.body.speed, 0, this.body.maxSpeed) * 500,
      },
      alpha: {
        onEmit: () => Phaser.Math.Percent(this.body.speed, 0, this.body.maxSpeed),
      },
      angle: {
        onEmit: (/* particle, key, t, value */) => {
          const v = Phaser.Math.Between(-10, 10);
          return (Phaser.Math.RadToDeg(this.body.angle) - 180) + v;
        },
      },
      rotate: {
        onEmit: () => Phaser.Math.RadToDeg(this.body.angle) - 90,
      },
      speed: 500,
      on: false,
    }).startFollow(this);
  }

  update(time, delta, keys) {
    if (!this.body) return;
    if (this.body.speed > 5) this.thrust.emitParticle(8, this.x, this.y);

    if (this.scene.state === 'running') {
      if (keys.SPACE.isDown && this.scene.time.now > this.nextShot) this.shoot();
      if (keys.ENTER.isDown && this.scene.time.now > this.nextMissile) this.shootMissile();

      if (keys.LEFT.isDown || keys.A.isDown) this.body.setAccelerationX(-this.accel);
      else if (keys.RIGHT.isDown || keys.D.isDown) this.body.setAccelerationX(this.accel);
      else this.body.setAccelerationX(0);

      if (keys.UP.isDown || keys.W.isDown) this.body.setAccelerationY(-this.accel);
      else if (keys.DOWN.isDown || keys.S.isDown) this.body.setAccelerationY(this.accel);
      else this.body.setAccelerationY(0);
    } else if (this.scene.state === 'landing') {
      if (keys.LEFT.isDown || keys.A.isDown) this.body.setAccelerationX(-this.accel);
      else if (keys.RIGHT.isDown || keys.D.isDown) this.body.setAccelerationX(this.accel);
      else this.body.setAccelerationX(0);
    }

    const nextPoint = this.body.velocity.clone().add(this.body.position);
    if (!nextPoint.equals(this.body.position)) {
      const angle = Phaser.Math.Angle.BetweenPoints(this.body, nextPoint) + Math.PI / 2;
      this.setRotation(angle);
    }

    if (this.powerups.scatter && this.scene.time.now > this.powerups.scatter) this.powerups.scatter = false;
    if (this.powerups.spedUp && this.scene.time.now > this.powerups.spedUp) this.powerups.spedUp = false;
  }

  shoot() {
    this.nextShot = this.scene.time.now + (this.powerups.spedUp ? this.attack.laser.delay / 2 : this.attack.laser.delay);
    this.fireLaser(this.numLaserShots === 1 ? 'Forward' : this.attack.type);
  }

  fireLaser(type) {
    const angle = this.rotation;
    const { x, y } = new Phaser.Math.Vector2().setToPolar(angle, this.displayWidth / 2);

    this.scene.sound.play(Phaser.Math.RND.pick(['laser', 'laser1', 'laser2']));

    const addScatter = theta => (this.powerups.scatter ? (theta + Phaser.Math.FloatBetween(-Math.PI / 16, Math.PI / 16)) : theta);

    if (type === 'Forward') {
      for (let i = 0; i < this.numLaserShots; i += 1) {
        this.scene.bullets.get().init(this.laserColor).fire(
          this.x + x - 2 * x * (i + 1) / (this.numLaserShots + 1),
          this.y + y - 2 * y * (i + 1) / (this.numLaserShots + 1),
          addScatter(angle),
        );
      }
    } else if (type === 'Spread') {
      const total = Math.PI * 1.5 * (-4 / (this.numLaserShots + 3) + 1);
      const inc = total / (this.numLaserShots - 1);
      const base = angle - total / 2;
      for (let i = 0; i < this.numLaserShots; i += 1) {
        this.scene.bullets.get().init(this.laserColor).fire(
          this.x,
          this.y,
          addScatter(base + i * inc),
        );
      }
    } else if (type === 'All Around') {
      for (let i = 0; i < this.numLaserShots; i += 1) {
        this.scene.bullets.get().init(this.laserColor).fire(
          this.x,
          this.y,
          addScatter(angle + i * (2 * Math.PI) / this.numLaserShots),
        );
      }
    }
  }

  shootMissile() {
    this.nextMissile = this.scene.time.now + (this.powerups.spedUp ? this.attack.missile.delay / 2 : this.attack.missile.delay);
    this.scene.bullets.get().init(this.missileColor).fire(this.x, this.y);
  }

  get laserColor() {
    if (this.scene.registry.get('konami')) return `laser${Phaser.Math.RND.pick(['Red', 'Green', 'Blue'])}0${Phaser.Math.RND.pick([1, 2])}`;
    const color = this.scene.registry.get('playerTexture').split('_')[1];
    return `laser${color === 'orange' ? 'Red' : color.charAt(0).toUpperCase() + color.slice(1)}01`;
  }

  get missileColor() {
    if (this.scene.registry.get('konami')) return `missile${Phaser.Math.RND.pick(['Red', 'Green', 'Blue'])}`;
    const color = this.scene.registry.get('playerTexture').split('_')[1];
    return `missile${color === 'orange' ? 'Red' : color.charAt(0).toUpperCase() + color.slice(1)}`;
  }

  get attack() {
    return this.scene.registry.values.playerAttack;
  }

  get accel() {
    return this.scene.registry.values.playerBody.accel;
  }

  get numLaserShots() {
    return this.scene.registry.values.playerAttack.laser.numShots + this.powerups.numShots;
  }
}
