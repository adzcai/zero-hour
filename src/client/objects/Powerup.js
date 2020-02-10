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

    try { this.scene.sound.play('powerup'); } catch (e) { console.error(e); }

    if (type === 'bolt_gold') {
      player.powerups.spedUp = this.scene.time.now + 3000;
    } else if (type.endsWith('shield')) {
      try { this.scene.sound.play('shieldUp'); } catch (e) { console.error(e); }
      player.hp = Math.min(player.hp + 50, this.scene.registry.values.playerBody.maxHP);
    } else if (type.endsWith('star')) {
      player.powerups.scatter = this.scene.time.now + 3000;
    } else if (type.endsWith('star_bronze')) {
      player.powerups.numShots += 1;
    }
  }
}
