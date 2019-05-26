import defaultFont from '../../shared/defaultFont';
import deepSet from '../../shared/deepSet';
import { UPGRADES } from '../../shared/constants';
import getCookie from '../../shared/getCookie';

export default class Upgrade extends Phaser.GameObjects.Text {
  constructor(scene, index, text, count) {
    super(scene, 0, 0, text, defaultFont());

    const { width, height } = this.scene.cameras.main;

    this.index = index; // Used to track the y coordinate

    this.setPosition(width / 16, height * (parseInt(index, 10) + 2) / (Object.keys(UPGRADES).length + 3))
      .setInteractive()
      .setOrigin(0, 0.5);

    this.scene.add.existing(this);
    
    this.costText = this.scene.add.text(width * 5 / 8, this.y, '', defaultFont()).setOrigin(0, 0.5);
    this.valueText = this.scene.add.text(width * 15 / 16,this.y,this.value,defaultFont()).setOrigin(1, 0.5);

    this.count = count; // Use the setter to update the text

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

    // Send a post request to update the count
    $.ajax({
      type: 'POST',
      url: '/update-upgrade',
      data: {
        upgrade: this.text,
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

  set count(val) {
    this._count = val;
    this.cost = UPGRADES[this.text].getCost(val);
    this.value = UPGRADES[this.text].getValue(val);

    this.costText.setText(`$${this.cost}`);
    this.valueText.setText(this.value);

    deepSet(this.scene.registry.values, UPGRADES[this.text].variable, this.value);
  }

  get count() { return this._count; }
}
