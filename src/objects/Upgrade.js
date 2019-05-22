import { defaultFont } from './Util';

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
      `$${this.registryValue().cost}`,
      defaultFont(),
    ).setOrigin(0.5);

    this.colorPlaceValues = {
      red: 0x10000,
      green: 0x100,
      blue: 1,
    };
  }

  purchase() {
    this.count += 1;

    // Reduce the amount of money that the player has
    this.scene.registry.values.money -= this.registryValue().cost;
    this.scene.moneyText.setText(`Money: ${this.scene.registry.values.money}`);

    // Update the cost of this upgrade
    this.registryValue().cost = this.registryValue().cost * 2;
    this.registryValue().value += this.registryValue().inc;
    this.costText.setText(`$${this.registryValue().cost}`);

    this.flashCost(0x00ff00);
  }

  flashCost(color) {
    this.costText.setTint(color);
    this.scene.time.delayedCall(1000, () => this.costText.setTint());
  }

  /**
   * This was originally a getter, but Phaser threw me errors when it tried to destroy the sprite.
   * Making it a function seems to fix that. It returns the information stored in the global registry
   * about this upgrade.
   */
  registryValue() {
    return this.scene.registry.values.upgrades[this.text];
  }
}
