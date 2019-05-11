import Button from '../objects/Button.js';

export default class ChooseShipScene extends Phaser.Scene {
  constructor() {
    super('ChooseShip');
  }

  create() {
    const { width, height } = this.cameras.main;

    const colors = ['blue', 'green', 'orange', 'red'];
    for (let i = 1; i <= 3; i += 1) {
      for (const j of Object.keys(colors)) {
        this.add.image(
          width * i / 4, height * (parseInt(j, 10) + 1) / 5,
          'spaceshooter', `playerShip${i}_${colors[j]}`,
        ).setInteractive();
      }
    }

    this.title = new Button(this, width / 2, height / 2, 'Click any ship to begin');

    this.input.on('gameobjectup', (pointer, obj) => {
      if (obj.frame.name !== 'buttonBlue') {
        this.registry.set('playerTexture', obj.frame.name);
        this.scene.start('Title');
      }
    });
  }
}
