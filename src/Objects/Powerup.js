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

  apply(player) {
    const type = this.frame.name;

    if (this.scene.registry.values.soundOn) this.scene.sound.play('powerup');

    if (type === 'bolt_gold') {
      player.powerups.spedUp = this.scene.time.now + 3000;
    } else if (type.endsWith('shield')) {
      if (this.scene.registry.values.soundOn) this.scene.sound.play('shieldUp');
      player.hp = Math.min(player.hp + 50, this.scene.registry.values.playerBody.maxHP);
    } else if (type.endsWith('star')) {
      player.powerups.scatter = this.scene.time.now + 3000;
    } else if (type.endsWith('star_bronze')) {
      player.powerups.numShots += 1;
    } else if (type.startsWith('pill')) {
      this.scene.registry.values.playerAttack.type = 'All Around';
    } else if (type.startsWith('things')) {
      this.scene.registry.values.playerAttack.type = 'Spread';
    }
  }
}
