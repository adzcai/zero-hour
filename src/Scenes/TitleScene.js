import Button from "../Objects/Button.js";

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super("Title");
  }

  create() {
    const { width, height } = this.cameras.main;
    console.log("title")
    this.background = this.add.tileSprite(0, 0, width, height, "blue").setOrigin(0);

    this.gameButton = new Button(this, width / 2, height / 2 - 100, "buttonBlue", "buttonBlue", "Play", "Game");
    this.optionsButton = new Button(this, width / 2, height / 2, "buttonBlue", "buttonBlue", "Options", "Options");
    this.creditsButton = new Button(this, width / 2, height / 2 + 100, "buttonBlue", "buttonBlue", "Credits", "Credits");

    if (this.registry.values.musicOn && !this.registry.values.bgMusicPlaying) {
      this.bgMusic = this.sound.add("bgMusic", { volume: 0.5, loop: true });
      this.bgMusic.play();
      this.registry.values.bgMusicPlaying = true;
      this.registry.values.bgMusic = this.bgMusic;
    }
  }

  update(time, delta) {
    this.background.tilePositionY -= 1;
  }

  centerButton(obj, offset = 0) {
    const { width, height } = this.cameras.main;
    Phaser.Display.Align.In.Center(obj, this.add.zone(width / 2, height / 2 - offset * 100, width, height));
  }

  centerButtonText(gameText, gameButton) {
    Phaser.Display.Align.In.Center(gameText, gameButton);
  }
};
