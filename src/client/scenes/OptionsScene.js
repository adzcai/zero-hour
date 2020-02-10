import Button from '../objects/Button';
import defaultFont from '../../shared/defaultFont';
import getCookie from '../../shared/getCookie';

export default class OptionsScene extends Phaser.Scene {
  constructor() {
    super('Options');
  }

  create() {
    const { width, height } = this.cameras.main;

    let paused;
    if (this.scene.isSleeping('Game')) paused = 'Game';
    else if (this.scene.isSleeping('Arena')) paused = 'Arena';
    else paused = false;

    const inc = height / 7;

    this.text = this.add.text(width / 2, inc, 'Options', defaultFont(40)).setOrigin(0.5);

    this.musicButton = this.add.image(width / 4, inc * 2, 'checkedBox').setOrigin(0.5);
    this.musicButton.setInteractive().on('pointerdown', () => {
      this.registry.values.musicOn = !this.registry.values.musicOn;
      this.updateAudio();
    });
    this.musicText = this.add.text(width / 2, inc * 2, 'Music Enabled', defaultFont(24)).setOrigin(0.25, 0.5);

    this.soundButton = this.add.image(width / 4, inc * 3, this.sound.mute ? 'checkedBox' : 'box').setOrigin(0.5);
    this.soundButton.setInteractive().on('pointerdown', () => {
      this.sound.mute = !this.sound.mute;
      this.soundButton.setTexture(this.sound.mute ? 'checkedBox' : 'box'); // Check the box to represent whether or not the sound is on
    });
    this.soundText = this.add.text(width / 2, inc * 3, 'Sound Enabled', defaultFont(24)).setOrigin(0.25, 0.5);

    this.howToPlay = new Button(this, width / 2, inc * 4, 'Controls', 'PowerupInfo');

    this.reset = new Button(this, width / 2, inc * 5, 'RESET GAME (BE SURE)', () => {
      const sure = confirm('Are you sure? This will clear all user data. This cannot be reversed.');
      if (!sure) return;

      this.registry.reset();

      $.ajax({
        type: 'POST',
        url: 'reset-all',
        data: {
          refreshToken: getCookie('refreshJwt'),
        },
        success: () => {
          this.scene.stop('Background');
          this.scene.stop('Game');
          this.scene.stop('Arena');
          this.scene.stop('Title');
          this.scene.start('Preloader');
        },
        error: (xhr) => {
          console.error(xhr);
        },
      });
    });

    if (paused) {
      this.resume = new Button(this, width / 4, inc * 6, 'Resume', () => {
        this.scene.wake(paused);
        this.scene.stop();
      });
    }

    this.menuButton = new Button(this, paused ? width * 3 / 4 : width / 2, inc * 6, 'Menu', () => {
      if (paused) this.scene.stop(paused); // Stop the game scene if it is running
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
  }
}
