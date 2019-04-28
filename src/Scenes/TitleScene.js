import Button from '../Objects/Button.js';

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super('Title');
  }

  create() {
    const { width, height } = this.cameras.main;

    this.gameButton = new Button(this, width / 2, height / 2 - 100, 'buttonBlue', 'buttonBlue', 'Play', 'Game');
    this.optionsButton = new Button(this, width / 2, height / 2, 'buttonBlue', 'buttonBlue', 'Options', 'Options');
    this.creditsButton = new Button(this, width / 2, height / 2 + 100, 'buttonBlue', 'buttonBlue', 'Credits', 'Credits');

    if (this.registry.values.musicOn && !this.registry.values.bgMusicPlaying) {
      this.bgMusic = this.sound.add('bgMusic', { volume: 0.5, loop: true });
      this.bgMusic.play();
      this.registry.values.bgMusicPlaying = true;
      this.registry.values.bgMusic = this.bgMusic;
    }

    this.input.keyboard.createCombo([38, 38, 40, 40, 37, 39, 37, 39, 66, 65, 13], { resetOnMatch: true });

    this.input.keyboard.on('keycombomatch', () => {
      this.registry.set('konami', true);
    })
      .on('keyup_ENTER', () => {
        this.scene.get('Background').changeColor('purple');
      });
  }
}
