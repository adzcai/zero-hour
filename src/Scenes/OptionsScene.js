import Button from "../Objects/Button.js";

export default class OptionsScene extends Phaser.Scene {
  constructor() {
    super("Options");
  }

  create() {
    const { width, height } = this.cameras.main;
    this.text = this.add.text(width / 2, height / 4, "Options", { fontSize: 40 }).setOrigin(0.5);
    
    this.musicButton = this.add.image(width / 4, height / 2, "checkedBox").setOrigin(0.5);
    this.musicText = this.add.text(width * 3 / 4, height / 2, "Music Enabled", { fontSize: 24 }).setOrigin(0.5);

    this.soundButton = this.add.image(width / 4, height * 5 / 8, "checkedBox").setOrigin(0.5);
    this.soundText = this.add.text(width * 3 / 4, height * 5 / 8, "Sound Enabled", { fontSize: 24 }).setOrigin(0.5);

    this.musicButton.setInteractive().on("pointerdown", () => {
      this.registry.values.musicOn = !this.registry.values.musicOn;
      this.updateAudio();
    });

    this.soundButton.setInteractive().on("pointerdown", () => {
      this.registry.values.soundOn = !this.registry.values.soundOn;
      this.updateAudio();
    });

    this.menuButton = new Button(this, width - 100, 500, "buttonBlue", "buttonBlue", "Menu", "Title");

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

    this.soundButton.setTexture(this.registry.values.soundOn ? "checkedBox" : "box");
  }
};
