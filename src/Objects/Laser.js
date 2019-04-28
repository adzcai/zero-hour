export default class Laser extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y);

    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);

    this.damage = 400;
    this.speed = 750;
  }

  init(type) {
    this.setName(type);
    this.play(type);
    return this;
  }

  preUpdate() {
    if (!Phaser.Geom.Rectangle.ContainsPoint(this.scene.physics.world.bounds, this)) this.destroy();
  }

  fire(x, y, angle) {
    this.setRotation(angle);

    this.body.reset(x, y);
    this.scene.physics.velocityFromRotation(angle - Math.PI / 2, this.speed, this.body.velocity);
    this.body.velocity.scale(2);

    if (this.scene.registry.get('soundOn')) this.scene.sound.play(Phaser.Math.RND.pick(['laser', 'laser1', 'laser2']));
  }
}
