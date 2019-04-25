export default class PlayerShip extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);

    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);

    this.powerups = {};

    this.keys = this.scene.input.keyboard.addKeys("W,A,S,D,UP,DOWN,LEFT,RIGHT,SPACE");

    this.canShoot = true;
    this.accel = 1000;

    this.body.useDamping = true;
    this.body.setDrag(0.85);
    this.body.setMaxVelocity(650);
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    if (this.keys.SPACE.isDown && this.canShoot) {
      this.canShoot = false;
      this.scene.sound.play("laser");
      this.scene.time.delayedCall(this.shootDelay,() => this.canShoot = true);
    }

    if (this.keys.LEFT.isDown || this.keys.A.isDown)
      this.body.setAccelerationX(-this.accel)
    else if (this.keys.RIGHT.isDown || this.keys.D.isDown)
      this.body.setAccelerationX(this.accel);
    else
      this.body.setAccelerationX(0);
    
    if (this.keys.UP.isDown || this.keys.W.isDown)
      this.body.setAccelerationY(-this.accel)
    else if (this.keys.DOWN.isDown || this.keys.S.isDown)
      this.body.setAccelerationY(this.accel)
    else
      this.body.setAccelerationY(0);
  }
}