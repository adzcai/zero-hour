import Button from "../Objects/Button.js";

export default class TitleScene extends Phaser.Scene {
  constructor () {
    super("Title");
  }

  create () {
    const { width, height } = this.cameras.main;
    // Game
    this.gameButton = new Button(this, width / 2, height / 2 - 100, "buttonBlue.png", "buttonBlue.png", "Play", "Game");

    // Options
    this.optionsButton = new Button(this, width / 2, height / 2, "buttonBlue.png", "buttonBlue.png", "Options", "Options");

    // Credits
    this.creditsButton = new Button(this, width / 2, height / 2 + 100, "buttonBlue.png", "buttonBlue.png", "Credits", "Credits");

    if (this.registry.values.musicOn && !this.registry.values.bgMusicPlaying) {
      this.bgMusic = this.sound.add("bgMusic", { volume: 0.5, loop: true });
      this.bgMusic.play();
      this.registry.values.bgMusicPlaying = true;
      this.registry.values.bgMusic = this.bgMusic;
    }
  }

  centerButton (gameObject, offset = 0) {
    Phaser.Display.Align.In.Center(
      gameObject,
      this.add.zone(config.width/2, config.height/2 - offset * 100, config.width, config.height)
    );
  }

  centerButtonText (gameText, gameButton) {
    Phaser.Display.Align.In.Center(
      gameText,
      gameButton
    );
  }
};
