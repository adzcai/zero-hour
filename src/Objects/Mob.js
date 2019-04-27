export default class Mob extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, 'spaceshooter', frame);

    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);

    this.maxHP = 1000;
    this.hp = this.maxHP;
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    this.hpBar.setPosition(this.x, this.y - 32);
  }

  init() {
    const { width } = this.scene.cameras.main;

    this.setRandomPosition(0, -320, width, 320);

    this.hpBar = this.scene.add.rectangle(this.x, this.y, this.width, 10, 0xff00, 1);

    if (this.frame.name.startsWith('meteor')) {
      this.body.setAngularVelocity(300);
      this.body.setVelocityY(300);
    } else if (this.frame.name.startsWith('ufo')) {
      this.tween = this.scene.tweens.add({
        targets: this,
        x: Phaser.Math.Between(-200, 200),
        duration: 2000,
        ease: 'Sine.easeInOut',
        repeat: -1,
        yoyo: true,
      });
      this.body.setVelocityY(100);
    }
  }

  hitBy(bullet) {
    this.hp -= bullet.damage;
    this.hpBar.displayWidth = Phaser.Math.Percent(this.hp, 0, this.maxHP) * this.width;
    if (this.hp <= 0) this.end();
  }

  end() {
    this.body.destroy();
    this.hpBar.destroy();
    if (this.tween) this.tween.stop();
    this.scene.add.sprite(this.x, this.y).play('sonicExplosion');
    this.destroy();
  }
}
