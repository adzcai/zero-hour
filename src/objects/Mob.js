export default class Mob extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, 'spaceshooter', frame);

    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);

    this.maxHP = Math.pow(this.displayWidth, 1.5) * this.scene.registry.values.level;
    this.hp = this.maxHP;
    this.value = Math.floor(Math.sqrt(this.maxHP));

    if (Math.random() < 0.1) {
      this.setTint(0xff0000);
      this.value *= 4;
    }

    this.numCoins = Math.floor(Phaser.Math.FloatBetween(0.5, 1) * Math.sqrt(this.value) / 2);
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
        x: `+=${Phaser.Math.Between(-200, 200)}`,
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
    this.scene.score += this.value;
    this.scene.coins.emitParticleAt(this.x, this.y, this.numCoins);

    if (this.scene.registry.values.soundOn) this.scene.sound.play('explosion');

    this.hpBar.destroy();
    if (this.tween) this.tween.stop();
    const expl = this.scene.add.sprite(this.x, this.y).play('sonicExplosion');
    expl.on('animationcomplete', expl.destroy);
    this.destroy();
  }
}
