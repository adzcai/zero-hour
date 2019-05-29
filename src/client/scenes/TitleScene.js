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

    const inc = height / 7;

    new Button(this, width / 4, inc, 'Play', 'Game');
    new Button(this, width * 3 / 4, inc, 'Arena', 'Arena');
    new Button(this, width / 2, inc * 2, 'Choose Ship', 'ChooseShip')
    new Button(this, width / 2, inc * 3, 'Options', 'Options');
    new Button(this, width / 2, inc * 4, 'Upgrades', 'Upgrades');
    new Button(this, width / 2, inc * 5, 'Leaderboard', 'Leaderboard');
    new Button(this, width / 2, inc * 6, 'Credits', 'Credits');

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
