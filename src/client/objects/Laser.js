export default class Laser extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y);

    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);

    this.speed = this.scene.registry.values.playerAttack.laser.speed;
    this.damage = this.scene.registry.values.playerAttack.laser.damage;

    this.lifespan = this.name.startsWith('missile') ? 5000 : 1000;
  }

  init(type) {
    this.setName(type);
    this.play(type);

    if (this.name.startsWith('missile')) {
      this.speed = this.scene.registry.values.playerAttack.missile.speed;
      this.damage = this.scene.registry.values.playerAttack.missile.damage;
    }
    return this;
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    if (this.name.startsWith('missile')) {
      if (this.target === null) this.findTarget();
      else if (!this.target.body) this.target = null;
      else this.scene.physics.moveToObject(this, this.target, this.speed);
    }
    this.lifespan -= delta;
    if (this.lifespan <= 0) this.destroy();
  }

  fire(x, y, radians) {
    this.body.reset(x, y);
    this.scene.sound.play(Phaser.Math.RND.pick(['laser', 'laser1', 'laser2']), { volume: 0.2 });

    if (this.name.startsWith('missile')) {
      this.findTarget();
    } else {
      this.setRotation(radians);

      this.scene.physics.velocityFromRotation(radians - Math.PI / 2, this.speed, this.body.velocity);
      this.body.velocity.scale(2);
    }
  }

  findTarget() {
    const { width, height } = this.scene.cameras.main;
    this.target = null;
    let min = Phaser.Math.Distance.Between(0, 0, width, height);

    this.scene.enemies.children.each((child) => {
      const dist = Phaser.Math.Distance.Between(this.x, this.y, child.x, child.y);
      if (dist < min) {
        min = dist;
        this.target = child;
      }
    });
  }
}
