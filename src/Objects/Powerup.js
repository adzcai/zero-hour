export default class Powerup extends Phaser.GameObjects.Image {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);

    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
  }

  init() {
    this.setRandomPosition(0, -320, this.scene.cameras.main.width, 320);
    this.body.setVelocityY(Phaser.Math.Between(300, 500));
  }
}