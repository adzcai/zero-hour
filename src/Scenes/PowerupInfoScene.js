import Button from '../Objects/Button.js';

export default class PowerupInfoScene extends Phaser.Scene {
  constructor() {
    super('PowerupInfo');
  }

  create() {
    const { width, height } = this.cameras.main;

    const types = Object.keys(this.registry.get('POWERUPTYPES'));

    const numPerRow = Math.ceil(types.length / 2);

    this.title = new Button(this, width / 2, height / 5, 'Powerup Info');

    this.infoText = this.add.text(width / 2, height / 2, 'Hover over an icon to see its description', {
      font: '24px monospace',
      fill: '#ffffff',
      wordWrap: { width, useAdvancedWrap: true },
      align: 'center',
    }).setOrigin(0.5).setDepth(10);

    for (let i = 0; i < types.length; i += 1) {
      this.add.image(
        width * ((i % numPerRow) + 1) / (numPerRow + 1),
        height * Math.floor((parseInt(i, 10) / numPerRow) + 2) / 5,
        'spaceshooter',
        types[i],
      ).setInteractive();
    }

    this.input.on('gameobjectover', (pointer, obj) => {
      if (types.includes(obj.frame.name)) this.infoText.setText(this.registry.get('POWERUPTYPES')[obj.frame.name]);
    });

    this.back = new Button(this, width / 2, height * 4 / 5, 'Back', 'Options');
  }
}
