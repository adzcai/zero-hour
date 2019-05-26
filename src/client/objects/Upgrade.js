import defaultFont from '../../shared/defaultFont';
import { UPGRADES } from '../../shared/CONSTANTS';
import getCookie from '../../shared/getCookie';

export default class Upgrade extends Phaser.GameObjects.Text {
  constructor(scene, index, text, count) {
    super(scene, 0, 0, text, defaultFont());

    const { width, height } = this.scene.cameras.main;

    this.index = index; // Used to track the y coordinate
    this.count = count;
    this.cost = UPGRADES[text].cost * Math.pow(2, UPGRADES[text].inc);

    this.setPosition(width / 2, height * (parseInt(index, 10) + 2) / (Object.keys(UPGRADES).length + 3))
      .setInteractive()
      .setOrigin(1, 0.5);

    this.scene.add.existing(this);

    this.costText = this.scene.add.text(
      width * 3 / 4,
      height * (parseInt(index, 10) + 2) / (Object.keys(UPGRADES).length + 3),
      `$${cost}`,
      defaultFont(),
    ).setOrigin(0.5);

    this.colorPlaceValues = {
      red: 0x10000,
      green: 0x100,
      blue: 1,
    };
  }

  purchase() {
    // Reduce the amount of money that the player has
    this.scene.registry.values.money -= this.cost;
    this.scene.moneyText.setText(`Money: $${this.scene.registry.values.money}`);

    // Increase the counter for the number of times the user has bought this upgrade
    this.count += 1;

    // Update the cost of this upgrade
    this.cost *= 2;
    this.costText.setText(`$${this.cost}`);

    // Send a post request to update the count
    $.ajax({
      type: 'POST',
      url: '/update-upgrade',
      data: {
        count: this.count,
        refreshToken: getCookie('refreshJwt'),
      },
      success(data) {},
      error(xhr) {
        window.alert(JSON.stringify(xhr));
      },
    });

    this.flashCost(0x00ff00);
  }

  flashCost(color) {
    this.costText.setTint(color);
    this.scene.time.delayedCall(1000, () => this.costText.setTint());
  }
}
