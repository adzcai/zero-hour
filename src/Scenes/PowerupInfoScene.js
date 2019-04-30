import Button from '../Objects/Button.js';
import { defaultFont } from '../Objects/Util.js';

export default class PowerupInfoScene extends Phaser.Scene {
  constructor() {
    super('PowerupInfo');
  }

  create() {
    const { width, height } = this.cameras.main;

    const types = Object.keys(this.registry.get('POWERUPTYPES'));
    const numPerRow = Math.ceil(types.length / 2);
    const inc = height / (2 + 3 + 1);

    this.title = new Button(this, width / 2, inc, 'How to Play');

    this.howToPlayText = this.add.text(width / 2, inc * 2, 'Use WASD or the arrow keys to move. Press or hold space to shoot. Press enter to fire missiles.', defaultFont(18, width)).setOrigin(0.5);

    this.infoText = this.add.text(width / 2, inc * 3.5, 'Hover over a powerup to see its description', defaultFont(24, width)).setOrigin(0.5).setDepth(10);

    for (let i = 0; i < types.length; i += 1) {
      this.add.image(
        width * ((i % numPerRow) + 1) / (numPerRow + 1),
        inc * Math.floor((parseInt(i, 10) / numPerRow) + 3),
        'spaceshooter',
        types[i],
      ).setInteractive();
    }

    this.input.on('gameobjectover', (pointer, obj) => {
      if (types.includes(obj.frame.name)) this.infoText.setText(this.registry.get('POWERUPTYPES')[obj.frame.name]);
    });

    this.back = new Button(this, width / 2, inc * 5, 'Back', 'Options');
  }
}
