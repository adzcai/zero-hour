export default class PlayerShip extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y);

    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);

    this.body.setCollideWorldBounds(true);

    this.setDepth(10);

    this.setTexture('spaceshooter', this.scene.registry.get('playerTexture'));
    this.body.setSize();

    this.maxHP = 1000;
    this.hp = this.maxHP;
    this.powerups = {};

    this.keys = this.scene.input.keyboard.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT,SPACE');

    this.canShoot = true;
    this.shootDelay = 100;
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

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    if (this.body.speed > 0.5) this.thrust.emitParticle(8, this.x, this.y);

    if (this.keys.SPACE.isDown && this.canShoot) {
      this.canShoot = false;
      this.scene.time.delayedCall(this.shootDelay, () => {
        this.canShoot = true;
      });

      this.scene.bullets.get().fire(this);
    }

    if (this.keys.LEFT.isDown || this.keys.A.isDown) this.body.setAccelerationX(-this.accel);
    else if (this.keys.RIGHT.isDown || this.keys.D.isDown) this.body.setAccelerationX(this.accel);
    else this.body.setAccelerationX(0);

    if (this.keys.UP.isDown || this.keys.W.isDown) this.body.setAccelerationY(-this.accel);
    else if (this.keys.DOWN.isDown || this.keys.S.isDown) this.body.setAccelerationY(this.accel);
    else this.body.setAccelerationY(0);

    const nextPoint = this.body.velocity.clone().add(this.body.position);
    const angle = Phaser.Math.Angle.BetweenPoints(this.body, nextPoint) + Math.PI / 2;
    this.setRotation(angle);

    for (let pwrup of Object.keys(this.powerups)) {
      if (this.scene.time.now >= this.powerups[pwrup])
        delete this.powerups[pwrup];
    }
  }

  pickup(powerup) {
    this.powerups[powerup.frame.name] = this.scene.time.now + 1000;
  }
}
