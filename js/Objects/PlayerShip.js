export default class PlayerShip extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y);

    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);

    this.body.setCollideWorldBounds(true);

    this.setDepth(10);

    this.setTexture('spaceshooter', this.scene.registry.get('playerTexture'));
    this.body.setSize(this.displayHeight, this.displayHeight);

    this.maxHP = 1000;
    this.hp = this.maxHP;

    this.keys = this.scene.input.keyboard.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT,SPACE,ENTER');

    this.nextShot = 0;
    this.defaultShootDelay = 200;
    this.nextMissile = 0;
    this.missileDelay = 500;

    this.attack = {
      delay: this.defaultShootDelay,
      spedUp: false,
      type: 'laser',
      numShots: 1,
      scatter: false,
    };

    this.accel = 1000;
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

  update(time, delta) {
    super.preUpdate(time, delta);

    if (this.body.speed > 0.5) this.thrust.emitParticle(8, this.x, this.y);

    if (this.keys.SPACE.isDown && this.scene.time.now > this.nextShot) this.shoot();
    if (this.keys.ENTER.isDown && this.scene.time.now > this.nextMissile) this.shootMissile();

    if (this.keys.LEFT.isDown || this.keys.A.isDown) this.body.setAccelerationX(-this.accel);
    else if (this.keys.RIGHT.isDown || this.keys.D.isDown) this.body.setAccelerationX(this.accel);
    else this.body.setAccelerationX(0);

    if (this.keys.UP.isDown || this.keys.W.isDown) this.body.setAccelerationY(-this.accel);
    else if (this.keys.DOWN.isDown || this.keys.S.isDown) this.body.setAccelerationY(this.accel);
    else this.body.setAccelerationY(0);

    const nextPoint = this.body.velocity.clone().add(this.body.position);
    if (!nextPoint.equals(this.body.position)) {
      const angle = Phaser.Math.Angle.BetweenPoints(this.body, nextPoint) + Math.PI / 2;
      this.setRotation(angle);
    }

    if (this.attack.scatter && this.scene.time.now > this.attack.scatter) this.attack.scatter = false;
    if (this.attack.spedUp && this.scene.time.now > this.attack.spedUp) this.attack.spedUp = false;
  }

  shoot() {
    this.nextShot = this.scene.time.now + (this.attack.spedUp ? this.defaultShootDelay / 2 : this.defaultShootDelay);

    let angle = this.rotation;
    const { x, y } = new Phaser.Math.Vector2().setToPolar(angle, this.displayWidth / 2);

    if (this.attack.scatter) angle += Phaser.Math.FloatBetween(-Math.PI / 16, Math.PI / 16);

    if (this.attack.type === 'laser') {
      for (let i = 0; i < this.attack.numShots; i += 1) {
        this.scene.bullets.get().init(this.laserColor).fire(
          this.x + x - 2 * x * (i + 1) / (this.attack.numShots + 1),
          this.y + y - 2 * y * (i + 1) / (this.attack.numShots + 1),
          angle,
        );
      }
    } else if (this.attack.type === 'spread') {
      const total = (this.attack.numShots - 1) * Math.PI / 4;
      const base = angle - total / 2;
      for (let i = 0; i < this.attack.numShots; i += 1) {
        this.scene.bullets.get().init(this.laserColor).fire(
          this.x,
          this.y,
          base + i * Math.PI / 4,
        );
      }
    } else if (this.attack.type === 'allAround') {
      for (let i = 0; i < this.attack.numShots; i += 1) {
        this.scene.bullets.get().init(this.laserColor).fire(
          this.x,
          this.y,
          angle + i * (2 * Math.PI) / this.attack.numShots,
        );
      }
    }
  }

  shootMissile() {
    this.nextMissile = this.scene.time.now + (this.attack.spedUp ? this.missileDelay / 2 : this.missileDelay);
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
}
