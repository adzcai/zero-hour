import Button from "../Objects/Button.js";

const style = {
  font: "18px monospace",
  fill: "#ffffff"
};

/**
 * This scene loads all of the necessary assets into our game.
 */
export default class PreloaderScene extends Phaser.Scene {
  constructor() {
    super("Preloader");
  }

  preload() {
    const { width, height } = this.cameras.main;

    // add logo image
    this.logo = this.add.image(width / 2, height / 2, "logo");

    // display progress bar
    this.progressBar = this.add.graphics().fillStyle(0xffffff, 1);
    this.progressBox = this.add.rectangle(width / 2, height / 2, width / 2.5, height / 12, 0x222222, 0.8);

    this.loadingText = this.add.text(width / 2, height / 2 - 50, "Loading...", style).setOrigin(0.5);
    this.percentText = this.add.text(width / 2, height / 2 - 5, "0%", style).setOrigin(0.5);
    this.assetText = this.add.text(width / 2, height / 2 + 50, "", style).setOrigin(0.5);

    // update progress bar
    this.load.on("progress", value => {
      this.percentText.setText(parseInt(value * 100) + "%");
      const { x, y } = this.progressBox.getTopLeft();
      this.progressBar.fillRect(x + 10, y + 5, (this.progressBox.width - 20) * value, this.progressBox.height - 10);
    });

    // update file progress text
    this.load.on("fileprogress", file => this.assetText.setText("Loading asset: " + file.key));

    // load assets needed in our game
    this.load.setBaseURL("assets/")

    .audio("bgMusic", ["TownTheme.mp3"])
    .image("phaserLogo", "logo.png")

    .setPath("ui/")
    .image("box", "grey_box.png")
    .image("checkedBox", "blue_boxCheckmark.png")

    .setPath("backgrounds/")
    .image("black").image("blue").image("darkPurple").image("purple")

    .setPath("sounds/")
    .audio("laser", "Laser_Shoot.wav")

    .setPath("explosions");

    for (let i = 0; i < 9; i++) {
      this.load
      .image(`regularExplosion0${i}`)
      .image(`sonicExplosion0${i}`);
    }
  }

  create() {
    for (let explType of ["regular", "sonic"]) { // Create explosion animations
      this.anims.create({
        key: `${explType}Explosion`,
        frames: [...Array(9).keys()].map(i => ({key: `${explType}Explosion0${i}`})),
        frameRate: 8
      });
    }

    this.registry.set({
      soundOn: true,
      musicOn: true,
      bgMusicPlaying: false
    });

    this.time.delayedCall(500, () => {
      this.logo.destroy();
      this.progressBar.destroy();
      this.progressBox.destroy();
      this.loadingText.destroy();
      this.percentText.destroy();
      this.assetText.destroy();

      this.scene.start("ChooseShip");
    });
  }
};
