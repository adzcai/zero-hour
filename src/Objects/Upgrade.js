import { defaultFont } from './Font.js';

export default class Upgrade extends Phaser.GameObjects.Text {
  constructor(scene, index, text) {
    super(scene, 0, 0, text, defaultFont());

    const { width, height } = this.scene.cameras.main;

    this.index = index;

    this.setPosition(width / 2, height * (parseInt(index, 10) + 2) / (this.scene.NUMUPGRADES + 3))
      .setInteractive()
      .setOrigin(1, 0.5);

    this.scene.add.existing(this);
    this.count = 0;

    this.costText = this.scene.add.text(
      width * 3 / 4,
      height * (parseInt(index, 10) + 2) / (this.scene.NUMUPGRADES + 3),
      `$${this.data.cost}`,
      defaultFont(),
    ).setOrigin(0.5);

    this.colorPlaceValues = {
      red: 0x10000,
      green: 0x100,
      blue: 1,
    };
  }

  purchase() {
    // console.log('buy ' + this.text);
    this.count += 1;
    console.log(this.data);

    // Reduce the amount of money that the player has
    this.scene.registry.values.money -= this.data.cost;
    this.scene.moneyText.setText(`Money: ${this.scene.registry.values.money}`);

    // Update the cost of this upgrade
    this.scene.registry.values.upgrades[this.text].cost = this.data.cost * 2;
    this.scene.registry.values.upgrades[this.text].value += this.data.inc;
    this.costText.setText(`$${this.data.cost}`);

    this.flashCost('green');
  }

  flashCost(color) {
    this.costText.setTint(0xff0000);
    this.scene.time.delayedCall(1000, () => this.costText.setTint());
  }

  get data() {
    return this.scene.registry.values.upgrades[this.text];
  }
}
