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

    if (type === 'bolt_gold') {
      player.attack.spedUp = this.scene.time.now + 3000;
    } else if (type.endsWith('shield')) {
      player.hp = Math.min(player.hp + 50, player.maxHP);
    } else if (type.endsWith('star')) {
      player.attack.scatter = this.scene.time.now + 3000;
    } else if (type.endsWith('star_bronze')) {
      player.attack.numShots += 1;
    } else if (type.startsWith('pill')) {
      player.attack.type = 'allAround';
    } else if (type.startsWith('things')) {
      player.attack.type = 'spread';
    }
  }
}
