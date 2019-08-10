class Laser extends Phaser.GameObjects.Image {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);

    this.id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    this.setName(frame);

    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);

    this.lifespan = 10000;
  }

  init(speed, damage) {
    this.speed = speed;
    this.damage = damage;

    this.body.setCollideWorldBounds(true);
    this.body.onWorldBounds = true;
    this.body.world.on('worldbounds', (obj) => {
      if (obj.gameObject.id === this.id) this.destroy();
    });

    return this; // for future chaining
  }

  preUpdate(time, delta) {
    // if (this.name.startsWith('missile')) {
    //   if (this.target === null) this.target = this.scene.findTarget(this.x, this.y);
    //   else if (!this.target.body) this.target = null;
    //   else this.scene.physics.moveToObject(this, this.target, this.speed);
    // }
    this.lifespan -= delta;
    if (this.lifespan <= 0) this.destroy();
  }

  fire(radians) {
    // if (this.name.startsWith('missile')) {
    //   this.target = this.scene.findTarget(this.x, this.y);
    // } else {
      this.setRotation(radians);

      this.scene.physics.velocityFromRotation(radians - Math.PI / 2, this.speed, this.body.velocity);
      this.body.velocity.scale(2);
    // }
  }
}
