import defaultFont from '../../shared/defaultFont';

export default class DeathScene extends Phaser.Scene {
  constructor() {
    super('Death');
  }

  create() {
    const { width, height } = this.cameras.main;

    this.add.text(width / 2, height / 4, 'You Died!', defaultFont(18)).setOrigin(0.5);
    this.add.text(width / 2, height / 2, 'Press any key to begin', defaultFont(12)).setOrigin(0.5);

    this.input.keyboard.on('keyup', () => {
      this.scene.start('Title');
    });
  }
}
