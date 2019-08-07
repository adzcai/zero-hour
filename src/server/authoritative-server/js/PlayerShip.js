class PlayerShip {
  constructor(attack, body) {
    this.attack = attack;
    this.body = body;
    this.hp = this.body.maxHP;

    this.nextShot = 0;
    this.nextMissile = 0;

    this.powerups = {
      spedUp: false,
      scatter: false,
      numShots: 0,
    };
  }

  /**
   *
   * @param {Phaser.Scene} scene
   * @param {Number} x
   * @param {Number} y
   */
  createPhysics(scene, x, y) {
    /** @type {Phaser.Physics.Arcade.Image} */
    this.sprite = scene.physics.add.image(x, y, 'spaceshooter', this.sprite.body.texture);

    this.sprite.body.useDamping = true;
    this.sprite.body.setDrag(0.85);
    this.sprite.body.setMaxVelocity(650);

    this.sprite.body.setSize(this.sprite.displayHeight, this.sprite.displayHeight);
    this.sprite.body.setCollideWorldBounds(true);
  }

  update(time, delta, keys) {
    if (!this.sprite.body) return;

    if (keys.SPACE && this.sprite.scene.time.now > this.nextShot) this.shoot();
    if (keys.ENTER && this.sprite.scene.time.now > this.nextMissile) this.shootMissile();

    if (keys.LEFT) this.sprite.body.setAccelerationX(-this.body.accel);
    else if (keys.RIGHT) this.sprite.body.setAccelerationX(this.body.accel);
    else this.sprite.body.setAccelerationX(0);

    if (keys.UP) this.sprite.body.setAccelerationY(-this.body.accel);
    else if (keys.DOWN) this.sprite.body.setAccelerationY(this.body.accel);
    else this.sprite.body.setAccelerationY(0);

    const nextPoint = this.sprite.body.velocity.clone().add(this.sprite.body.position);
    if (!nextPoint.equals(this.sprite.body.position)) {
      const angle = Phaser.Math.Angle.BetweenPoints(this.sprite.body, nextPoint) + Math.PI / 2;
      this.setRotation(angle);
    }

    for (const k of Object.keys(this.powerups)) {
      if (this.powerups[k] && this.sprite.scene.time.now > this.powerups[k]) {
        this.powerups[k] = false;
      }
    }
  }

  shoot() {
    this.nextShot = this.sprite.scene.time.now + (this.powerups.spedUp ? this.attack.laser.delay / 2 : this.attack.laser.delay);
    this.fireLaser(this.numLaserShots === 1 ? 'Forward' : this.attack.type);
  }

  fireLaser(type) {
    const angle = this.rotation;
    const { x, y } = new Phaser.Math.Vector2().setToPolar(angle, this.displayWidth / 2);

    const addScatter = theta => (this.powerups.scatter ? (theta + Phaser.Math.FloatBetween(-Math.PI / 16, Math.PI / 16)) : theta);

    if (type === 'Forward') {
      for (let i = 0; i < this.numLaserShots; i += 1) {
        this.sprite.scene.fireLaser(
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
        this.sprite.scene.fireLaser(
          this.x,
          this.y,
          addScatter(base + i * inc),
        );
      }
    } else if (type === 'All Around') {
      for (let i = 0; i < this.numLaserShots; i += 1) {
        this.sprite.scene.fireLaser(
          this.x,
          this.y,
          addScatter(angle + i * (2 * Math.PI) / this.numLaserShots),
        );
      }
    }
  }

  shootMissile() {
    this.nextMissile = this.sprite.scene.time.now + (this.powerups.spedUp ? this.attack.missile.delay / 2 : this.attack.missile.delay);
    this.sprite.scene.fireLaser(
      this.x,
      this.y,
    );
  }

  get numLaserShots() {
    return this.attack.laser.numShots + this.powerups.numShots;
  }
}
