import Button from '../Objects/Button.js';

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

    // let x = width / 12;
    // let y = height / 12;
    // for (let frame of Object.keys(this.textures.get('coins').frames)) {
    //   console.log(frame)
    //   this.add.image(x, y, 'coins', frame);
    //   this.add.text(x, y, frame, {fontFamily: 'future', fontSize: 18, fill: '#ff0000'}).setDepth(100);
    //   x += width / 5;
    //   if (x >= width) {
    //     x = width / 12;
    //     y += height / 10;
    //   }
    // }
  }
}
