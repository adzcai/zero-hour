export default class Laser extends Phaser.GameObjects.Sprite {
  constructor(scene, {
    id, x, y, type, theta, lifespan,
  }) {
    super(scene, x, y);

    this.shooter = id.substring(0, id.lastIndexOf('-'));

    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);

    this.speed = this.scene.registry.values.playerAttack.laser.speed;
    this.damage = this.scene.registry.values.playerAttack.laser.damage;

    this.lifespan = lifespan || 5000;

    this.setName(type);
    this.play(type);
    this.id = id || Math.random().toString(36).substring(2, 15);

    this.body.setCollideWorldBounds(true);
    this.body.onWorldBounds = true;
    this.body.world.on('worldbounds', (obj) => {
      if (obj.gameObject.id === this.id) this.lifespan = -1;
    });

    if (this.name.startsWith('missile')) {
      this.speed = this.scene.registry.values.playerAttack.missile.speed;
      this.damage = this.scene.registry.values.playerAttack.missile.damage;
      this.target = this.scene.findTarget(this.x, this.y);
    } else {
      this.setRotation(theta);
    }
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    if (this.name.startsWith('missile')) {
      if (this.target === null) this.target = this.scene.findTarget(this.x, this.y);
      else if (!this.target.body) this.target = null;
      else this.scene.physics.moveToObject(this, this.target, this.speed);
    }
    this.lifespan -= delta;
  }
}
