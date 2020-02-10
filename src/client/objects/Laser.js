export default class Laser extends Phaser.GameObjects.Sprite {
  constructor(scene, {
    id, x, y, type, theta, lifespan,
  }) {
    super(scene, x, y);

    this.shooter = id.substring(0, id.lastIndexOf('-'));

    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);

    this.lifespan = lifespan || 5000;

    this.setName(type);
    this.play(type);
    this.id = id || Math.random().toString(36).substring(2, 15);

    this.body.setCollideWorldBounds(true);
    this.body.onWorldBounds = true;
    this.body.world.on('worldbounds', (obj) => {
      if (obj.gameObject.id === this.id) this.lifespan = -1;
    });

    const { speed, damage } = this.scene.registry.values.playerAttack[this.name.startsWith('missile') ? 'missile' : 'laser'];
    this.speed = speed;
    this.damage = damage;
    this.setRotation(theta);
  }

  update({
    x, y, theta, lifespan, target,
  }) {
    console.log('UPDATING', x, y);
    this.x = x;
    this.y = y;
    this.body.x = x;
    this.body.y = y;
    this.setRotation(theta);
    this.lifespan = lifespan;
    if (this.name.startsWith('missile') && target) this.target = this.scene.players.getChildren().find(p => p.id === target);
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    if (this.name.startsWith('missile')) {
      if (!this.target) this.target = this.scene.findTarget(this.shooter, this.x, this.y);
      if (this.target) this.scene.physics.moveToObject(this, this.target, this.speed);
    }
    this.lifespan -= delta;
  }
}
