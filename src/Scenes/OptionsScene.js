import Button from '../Objects/Button.js';

export default class OptionsScene extends Phaser.Scene {
  constructor() {
    super('Options');
  }

  init(data) {
    this.prevScene = data.prevScene;
  }

  create() {
    const { width, height } = this.cameras.main;
    this.text = this.add.text(width / 2, height / 4, 'Options', { fontSize: 40 }).setOrigin(0.5);

    this.musicButton = this.add.image(width / 4, height / 2, 'checkedBox').setOrigin(0.5);
    this.musicText = this.add.text(width * 3 / 4, height / 2, 'Music Enabled', { fontSize: 24 }).setOrigin(0.5);

    this.soundButton = this.add.image(width / 4, height * 5 / 8, 'checkedBox').setOrigin(0.5);
    this.soundText = this.add.text(width * 3 / 4, height * 5 / 8, 'Sound Enabled', { fontSize: 24 }).setOrigin(0.5);

    this.musicButton.setInteractive().on('pointerdown', () => {
      this.registry.values.musicOn = !this.registry.values.musicOn;
      this.updateAudio();
    });

    this.soundButton.setInteractive().on('pointerdown', () => {
      this.registry.values.soundOn = !this.registry.values.soundOn;
      this.updateAudio();
    });

    if (this.prevScene) {
      this.resume = new Button(this, width * 4 / 5, height / 8, 'buttonBlue', 'buttonBlue', 'Resume', () => {
        this.scene.wake(this.prevScene);
        this.scene.stop();
      });
    }

    this.menuButton = new Button(this, width - 100, 500, 'buttonBlue', 'buttonBlue', 'Menu', () => {
      if (this.prevScene) {
        console.log(this.prevScene);
        this.scene.get(this.prevScene).scene.start('Title');
        this.scene.stop();
      } else {
        this.scene.start('Title');
      }
    });

    this.updateAudio();
  }

  updateAudio() {
    if (!this.registry.values.musicOn) {
      this.musicButton.setTexture('box');
      this.registry.values.bgMusic.stop();
      this.registry.values.bgMusicPlaying = false;
    } else {
      this.musicButton.setTexture('checkedBox');
      if (!this.registry.values.bgMusicPlaying) {
        this.registry.values.bgMusic.play();
        this.registry.values.bgMusicPlaying = true;
      }
    }

    this.soundButton.setTexture(this.registry.values.soundOn ? 'checkedBox' : 'box');
  }
}
