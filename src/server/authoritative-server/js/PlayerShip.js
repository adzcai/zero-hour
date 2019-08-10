/**
 * The game object that the server uses to handle logic.
 */
class PlayerShip extends Phaser.GameObjects.Image {
  /**
   * @param {Phaser.Scene} scene 
   * @param {Player} data 
   */
  constructor(scene, data) {
    super(scene, data.x, data.y, 'spaceshooter', data.playerBody.texture);

    console.log(data.playerBody.texture);
    this.playerAttack = data.playerAttack;
    this.playerBody = data.playerBody;
    this.playerId = data.playerId;
    this.hp = this.playerBody.maxHP;

    this.nextShot = 0;
    this.nextMissile = 0;

    this.powerups = {
      spedUp: false,
      scatter: false,
      numShots: 0,
    };

    // Creates the physics body for this object
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);

    this.body.useDamping = true;
    this.body.setDrag(0.85);
    this.body.setMaxVelocity(650);

    // Make the body square
    this.body.setSize(this.displayHeight, this.displayHeight);
  }

  update(input) {
    if (!this.body) return;

    if (input.left) {
      this.body.setAngularVelocity(-300);
    } else if (input.right) {
      this.body.setAngularVelocity(300);
    } else {
      this.body.setAngularVelocity(0);
    }

    if (input.up) {
      this.scene.physics.velocityFromRotation(this.rotation, 200, this.body.acceleration);
    } else {
      this.body.setAcceleration(0);
    }

    if (input.space && this.scene.time.now > this.nextShot) this.shoot();
    if (input.enter && this.scene.time.now > this.nextMissile) this.shootMissile();

    for (const k of Object.keys(this.powerups)) {
      if (this.powerups[k] && this.scene.time.now > this.powerups[k]) {
        this.powerups[k] = false;
      }
    }
  }

  shoot() {
    this.nextShot = this.scene.time.now + (this.powerups.spedUp ? this.playerAttack.laser.delay / 2 : this.playerAttack.laser.delay);
    this.fireLaser(this.numLaserShots === 1 ? 'Forward' : this.playerAttack.type);
  }

  fireLaser(type) {
    const angle = this.rotation;
    const { x, y } = new Phaser.Math.Vector2().setToPolar(angle, this.displayWidth / 2);

    const addScatter = theta => (this.powerups.scatter ? (theta + Phaser.Math.FloatBetween(-Math.PI / 16, Math.PI / 16)) : theta);

    if (type === 'Forward') {
      for (let i = 0; i < this.numLaserShots; i += 1) {
        this.scene.fireLaser(
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
        this.scene.fireLaser(
          this.x,
          this.y,
          addScatter(base + i * inc),
        );
      }
    } else if (type === 'All Around') {
      for (let i = 0; i < this.numLaserShots; i += 1) {
        this.scene.fireLaser(
          this.x,
          this.y,
          addScatter(angle + i * (2 * Math.PI) / this.numLaserShots),
        );
      }
    }
  }

  shootMissile() {
    this.nextMissile = this.scene.time.now + (this.powerups.spedUp ? this.playerAttack.missile.delay / 2 : this.playerAttack.missile.delay);
    this.scene.fireLaser(
      this.x,
      this.y,
    );
  }

  get numLaserShots() {
    return this.playerAttack.laser.numShots + this.powerups.numShots;
  }
}
