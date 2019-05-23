import Button from '../objects/Button';

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

    const inc = height / 6;

    this.gameButton = new Button(this, width / 2, inc, 'Play', 'Game');
    this.optionsButton = new Button(this, width / 2, inc * 2, 'Options', 'Options');
    this.upgradesButton = new Button(this, width / 2, inc * 3, 'Upgrades', 'Upgrades');
    this.leaderboardButton = new Button(this, width / 2, inc * 4, 'Leaderboard', () => {
      $.ajax({
        type: 'GET',
        url: '/scores',
        success: (scores) => {
          this.scene.start('Leaderboard', { scores });
        },
        error(xhr) {
          console.log(xhr);
        },
      });
    });
    this.creditsButton = new Button(this, width / 2, inc * 5, 'Credits', 'Credits');

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
