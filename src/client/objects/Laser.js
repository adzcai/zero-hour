export default class Laser extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y);

    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);

    this.speed = this.scene.registry.values.playerAttack.laser.speed;
    this.damage = this.scene.registry.values.playerAttack.laser.damage;
    
    this.lifespan = 10000;
  }

  init(type) {
    this.setName(type);
    this.play(type);
    this.id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    this.body.setCollideWorldBounds(true);
    this.body.onWorldBounds = true;
    this.body.world.on('worldbounds', (obj) => {
      if (obj.gameObject.id === this.id) this.destroy();
    });

    if (this.name.startsWith('missile')) {
      this.speed = this.scene.registry.values.playerAttack.missile.speed;
      this.damage = this.scene.registry.values.playerAttack.missile.damage;
    }
    return this;
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    if (this.name.startsWith('missile')) {
      if (this.target === null) this.target = this.scene.findTarget(this.x, this.y);
      else if (!this.target.body) this.target = null;
      else this.scene.physics.moveToObject(this, this.target, this.speed);
    }
    this.lifespan -= delta;
    if (this.lifespan <= 0) this.destroy();
  }

  fire(x, y, radians) {
    this.body.reset(x, y);

    if (this.name.startsWith('missile')) {
      this.target = this.scene.findTarget(this.x, this.y);
    } else {
      this.setRotation(radians);

      this.scene.physics.velocityFromRotation(radians - Math.PI / 2, this.speed, this.body.velocity);
      this.body.velocity.scale(2);
    }
  }
}
