import Button from '../objects/Button';
import { defaultFont } from '../objects/Util';
import Upgrade from '../objects/Upgrade';

export default class UpgradesScene extends Phaser.Scene {
  constructor() {
    super('Upgrades');
  }

  create() {
    const { width, height } = this.cameras.main;

    this.NUMUPGRADES = 7;
    const upgradeButtons = [];

    const upgrades = Object.keys(this.registry.values.upgrades);
    for (let i = 0; i < upgrades.length; i += 1) {
      upgradeButtons.push(new Upgrade(this, i, upgrades[i]));
    }

    this.moneyText = this.add.text(5, 5, `Money: ${this.registry.values.money}`, defaultFont());

    this.title = new Button(this, width / 2, height / (upgrades.length + 3), 'Upgrades');

    this.input.on('gameobjectup', (pointer, obj) => {
      if (upgradeButtons.includes(obj)) {
        if (this.registry.values.money >= obj.registryValue().cost) obj.purchase();
        else obj.flashCost(0xff0000);
      }
    });

    this.back = new Button(this, width / 2, height * (upgrades.length + 2) / (upgrades.length + 3), 'Back', 'Title');
  }
}
