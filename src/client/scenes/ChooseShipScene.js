import Button from '../objects/Button';
import getCookie from '../../shared/getCookie';

export default class ChooseShipScene extends Phaser.Scene {
  constructor() {
    super('ChooseShip');
  }

  init(data) {
    this.chooseShip = data.chooseShip;
  }

  create() {
    if (this.chooseShip) this.promptShip();
    else {
      $.ajax({
        type: 'GET',
        url: '/player-data',
        data: {
          refreshToken: getCookie('refreshJwt'),
        },
        success: (data) => {
          if (data.shipTexture) {
            this.registry.values.playerBody.texture = data.shipTexture;
            this.scene.start('Title');
          } else {
            this.promptShip();
          }
        },
        error: (xhr) => {
          console.error(xhr);
        },
      });
    }
  }

  promptShip() {
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
        const frame = obj.frame.name;
        $.ajax({
          type: 'POST',
          url: '/submit-texture',
          data: {
            frame,
            refreshToken: getCookie('refreshJwt'),
          },
          success: () => {
            this.registry.values.playerBody.texture = frame;
            this.scene.start('Title');
          },
          error: (xhr) => {
            console.error(xhr);
          },
        });
      }
    });
  }
}
