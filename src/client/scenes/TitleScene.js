import Button from '../objects/Button';
import getCookie from '../../shared/getCookie';

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super('Title');
  }

  create() {
    const { width, height } = this.cameras.main;

    this.scene.get('Background')
      .changeColor('blue')
      .changeSpeed(1)
      .playBgMusic('titleMusic');

    const inc = height / 8;

    new Button(this, width / 4, inc, 'Play', () => {
      $.ajax({
        type: 'GET',
        url: '/player-data',
        data: {
          refreshToken: getCookie('refreshJwt'),
        },
        success: (data) => {
          this.scene.start('Game', { level: data.highestLevel });
        },
        error: (xhr) => {
          console.error(xhr);
        },
      });
    });

    new Button(this, width * 3 / 4, inc, 'Arena', 'Arena');

    const buttons = [
      ['Choose Level', 'ChooseLevel'],
      ['Choose Ship', () => this.scene.start('ChooseShip', { chooseShip: true })],
      ['Options', 'Options'],
      ['Upgrades', 'Upgrades'],
      ['Leaderboard', 'Leaderboard'],
      ['Credits', 'Credits'],
    ];

    for (let i = 0; i < buttons.length; i++) {
      new Button(this, width / 2, inc * (2 + i), buttons[i][0], buttons[i][1]);
    }

    this.input.keyboard.createCombo(
      [38, 38, 40, 40, 37, 39, 37, 39, 66, 65, 13],
      { resetOnMatch: true },
    );

    this.input.keyboard.on('keycombomatch', () => {
      this.registry.set('konami', true);
    })
      .on('keyup_ENTER', () => {
        this.scene.get('Background').changeColor('purple');
      });
  }
}
