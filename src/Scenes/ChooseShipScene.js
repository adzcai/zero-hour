import Button from "../Objects/Button.js";

export default class ChooseShipScene extends Phaser.Scene {
  constructor() {
    super("ChooseShip");
  }

  create() {
    const { width, height } = this.cameras.main;

    this.background = this.add.tileSprite(0, 0, width, height, "blue").setOrigin(0);

    const colors = ["blue", "green", "orange", "red"];
    for (let i = 1; i <= 3; i++)
      for (let j in colors)
        this.add.image(width * i / 4, height * (parseInt(j) + 1) / 5, "spaceshooter", `playerShip${i}_${colors[j]}`).setInteractive();

    new Button(this, width / 2, height / 2, "buttonBlue", "buttonBlue", "Click any ship to begin");

    this.input.on("gameobjectup", (pointer, obj) => {
      if (obj.frame.name !== "buttonBlue") this.scene.start("Title", obj.frame.name)
    });
  }

  update() {
    this.background.tilePositionY -= 1;
  }
}