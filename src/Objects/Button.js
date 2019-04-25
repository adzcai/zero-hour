export default class Button extends Phaser.GameObjects.Container {
  constructor(scene, x, y, key1 = "buttonBlue", key2 = "buttonBlue", text, targetScene, originX, originY) {
    super(scene, x, y);

    this.button = this.scene.add.sprite(0, 0, "spaceshooter", key1).setInteractive().setOrigin(originX, originY);
    this.text = this.scene.add.text(0, 0, text, { fontSize: "32px", fill: "#000", padding: { x: 20, y: 10 } }).setOrigin(originX, originY);
    this.button.setDisplaySize(this.text.displayWidth, this.text.displayHeight);
    Phaser.Display.Align.In.Center(this.text, this.button);

    this.add([this.button, this.text]); // We add both of the objects to the container

    this.button // Handle events for the button
    .on("pointerover", () => this.button.setTexture("spaceshooter", key2))
    .on("pointerout", () => this.button.setTexture("spaceshooter", key1));
    
    if (targetScene) this.button.once("pointerup", () => {
      console.log(targetScene);
      this.scene.scene.start(targetScene)
    });

    this.scene.add.existing(this);
  }

  setText(val) {
    this.text.setText(val);
  }
}