import Button from '../objects/Button';
import { defaultFont } from '../objects/Util';

export default class OptionsScene extends Phaser.Scene {
  constructor() {
    super('Options');
  }

  init(data) {
    this.prevScene = data.prevScene;
  }

  create() {
    const { width, height } = this.cameras.main;

    const paused = this.scene.isSleeping('Game');

    const inc = height / 7;

    this.text = this.add.text(width / 2, inc, 'Options', defaultFont(40)).setOrigin(0.5);

    this.musicButton = this.add.image(width / 4, inc * 2, 'checkedBox').setOrigin(0.5);
    this.musicButton.setInteractive().on('pointerdown', () => {
      this.registry.values.musicOn = !this.registry.values.musicOn;
      this.updateAudio();
    });
    this.musicText = this.add.text(width / 2, inc * 2, 'Music Enabled', defaultFont(24)).setOrigin(0.25, 0.5);

    this.soundButton = this.add.image(width / 4, inc * 3, 'checkedBox').setOrigin(0.5);
    this.soundButton.setInteractive().on('pointerdown', () => {
      this.registry.values.soundOn = !this.registry.values.soundOn;
      this.updateAudio();
    });
    this.soundText = this.add.text(width / 2, inc * 3, 'Sound Enabled', defaultFont(24)).setOrigin(0.25, 0.5);

    this.howToPlay = new Button(this, width / 2, inc * 4, 'How to Play', 'PowerupInfo');

    this.reset = new Button(this, width / 2, inc * 5, 'RESET GAME (BE SURE)', () => {
      window.localStorage.clear();
      this.scene.stop('Background');
      this.scene.stop('Game');
      this.scene.stop('Title');
      this.scene.start('Preloader');
    });

    if (paused) {
      this.resume = new Button(this, width / 4, inc * 6, 'Resume', () => {
        this.scene.wake('Game');
        this.scene.stop();
      });
    }

    this.menuButton = new Button(this, width * 3 / 4, inc * 6, 'Menu', () => {
      if (paused) this.scene.stop('Game'); // Stop the game scene if it is running
      this.scene.start('Title'); // Go to the game scene
    });

    this.updateAudio();
  }

  updateAudio() {
    if (!this.registry.values.musicOn) { // If the user turns the music off
      this.musicButton.setTexture('box'); // we uncheck the box
      this.scene.get('Background').bgMusic.stop(); // stop the music
    } else { // If they turn it on
      this.musicButton.setTexture('checkedBox'); // check the box
      if (!this.scene.get('Background').bgMusic.isPlaying) { // If the music is not already playing
        this.scene.get('Background').bgMusic.play(); // we play the music
      }
    }

    this.soundButton.setTexture(this.registry.values.soundOn ? 'checkedBox' : 'box'); // Check the box to represent whether or not the sound is on
  }
}
