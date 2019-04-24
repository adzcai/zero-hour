import Button from "../Objects/Button.js";

export default class OptionsScene extends Phaser.Scene {
  constructor () {
    super("Options");
  }

  create () {
    this.text = this.add.text(300, 100, "Options", { fontSize: 40 });
    this.musicButton = this.add.image(200, 200, "checkedBox");
    this.musicText = this.add.text(250, 190, "Music Enabled", { fontSize: 24 });

    this.soundButton = this.add.image(200, 300, "checkedBox");
    this.soundText = this.add.text(250, 290, "Sound Enabled", { fontSize: 24 });

    this.musicButton.setInteractive();
    this.soundButton.setInteractive();

    this.musicButton.on("pointerdown", function () {
      this.registry.values.musicOn = !this.registry.values.musicOn;
      this.updateAudio();
    }.bind(this));

    this.soundButton.on("pointerdown", function () {
      this.registry.values.soundOn = !this.registry.values.soundOn;
      this.updateAudio();
    }.bind(this));

    this.menuButton = new Button(this, 400, 500, "blueButton1", "blueButton2", "Menu", "Title");

    this.updateAudio();
  }

  updateAudio() {
    if (!this.registry.values.musicOn) {
      this.musicButton.setTexture("box");
      this.registry.values.bgMusic.stop();
      this.registry.values.bgMusicPlaying = false;
    } else {
      this.musicButton.setTexture("checkedBox");
      if (!this.registry.values.bgMusicPlaying) {
        this.registry.values.bgMusic.play();
        this.registry.values.bgMusicPlaying = true;
      }
    }

    if (!this.registry.values.soundOn) {
      this.soundButton.setTexture("box");
    } else {
      this.soundButton.setTexture("checkedBox");
    }
  }
};
