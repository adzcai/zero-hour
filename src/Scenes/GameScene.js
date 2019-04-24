export default class GameScene extends Phaser.Scene {
  constructor () {
    super("Game");
  }

  create () {
    const { width, height } = this.cameras.main;
    this.background = this.add.tileSprite(0, 0, width, height, "black").setOrigin(0);
  }

  update(time, delta) {
    this.background.tilePositionY -= 3;
  }
};
