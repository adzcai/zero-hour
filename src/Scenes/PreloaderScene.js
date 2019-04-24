export default class PreloaderScene extends Phaser.Scene {
  constructor () {
    super("Preloader");
  }

  init() {
    this.readyCount = 0;
  }

  preload() {
    const { width, height } = this.cameras.main;

    // add logo image
    this.add.image(width / 2, height / 2, "logo");

    // display progress bar
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics()
      .fillStyle(0x222222, 0.8)
      .fillRect(width / 2, height / 2, width / 2.5, height / 12);

    const loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: "Loading...",
      style: {
        font: "20px monospace",
        fill: "#ffffff"
      }
    });
    loadingText.setOrigin(0.5, 0.5);

    const percentText = this.make.text({
      x: width / 2,
      y: height / 2 - 5,
      text: "0%",
      style: {
        font: "18px monospace",
        fill: "#ffffff"
      }
    });
    percentText.setOrigin(0.5, 0.5);

    const assetText = this.make.text({
      x: width / 2,
      y: height / 2 + 50,
      text: "",
      style: {
        font: "18px monospace",
        fill: "#ffffff"
      }
    });
    assetText.setOrigin(0.5, 0.5);

    // update progress bar
    this.load.on("progress", function (value) {
      percentText.setText(parseInt(value * 100) + "%");
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(250, 280, 300 * value, 30);
    });

    // update file progress text
    this.load.on("fileprogress", function (file) {
      assetText.setText("Loading asset: " + file.key);
    });

    // remove progress bar when complete
    this.load.on("complete", function () {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
      assetText.destroy();
      this.ready();
    }.bind(this));

    this.timedEvent = this.time.delayedCall(3000, this.ready, [], this);

    // load assets needed in our game
    this.load.setBaseURL("assets/")

    .audio("bgMusic", ["TownTheme.mp3"])
    .image("phaserLogo", "logo.png")

    .setPath("ui/")
    .image("box", "grey_box.png")
    .image("checkedBox", "blue_boxCheckmark.png")

    .setPath("backgrounds/")
    .image("black").image("blue").image("darkPurple").image("purple")
  }

  ready() {

    this.registry.set({
      soundOn: true,
      musicOn: true,
      bgMusicPlaying: false
    })
    this.scene.start("Title");
    this.readyCount++;
    if (this.readyCount === 2) {
      this.scene.start("Title");
    }
  }
};
