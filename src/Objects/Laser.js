export default class Laser extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture, key) {
    super(scene, x, y, texture, key);

    this.play('laserBlue');
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);

    this.body.setCollideWorldBounds(true);

    this.damage = 400;
    this.speed = 750;
  }

  fire(player) {
    this
      .setActive(true)
      .setVisible(true)
      .setAngle(player.body.rotation)
      .setPosition(player.x, player.y);

    this.body.reset(player.x, player.y);

    const angle = Phaser.Math.DegToRad(player.body.rotation - 90);
    this.scene.physics.velocityFromRotation(angle, this.speed, this.body.velocity);

    this.body.velocity.scale(2);

    if (this.scene.registry.get("soundOn")) this.scene.sound.play('laser');
  }
}
