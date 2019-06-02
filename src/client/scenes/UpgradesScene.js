import Button from '../objects/Button';
import Upgrade from '../objects/Upgrade';
import defaultFont from '../../shared/defaultFont';
import { UPGRADES } from '../../shared/constants';
import getCookie from '../../shared/getCookie';

export default class UpgradesScene extends Phaser.Scene {
  constructor() {
    super('Upgrades');
  }

  create() {
    $.ajax({
      type: 'GET',
      url: '/player-data',
      data: {
        refreshToken: getCookie('refreshJwt'),
      },
      success: (data) => {
        this.upgrades = data.upgrades;

        const { width, height } = this.cameras.main;
        const numUpgrades = Object.keys(UPGRADES).length;

        const upgradeButtons = [];

        Object.keys(UPGRADES).forEach((key, i) => {
          upgradeButtons.push(new Upgrade(this, i, key, this.upgrades[key] || 0));
        });

        this.moneyText = this.add.text(5, 5, `Money: ${this.registry.values.money}`, defaultFont());

        this.title = new Button(this, width / 2, height / (numUpgrades + 3), 'Upgrades');

        this.input.on('gameobjectup', (pointer, obj) => {
          if (upgradeButtons.includes(obj)) {
            if (this.registry.values.money >= obj.cost) obj.purchase();
            else obj.flashCost(0xff0000);
          }
        });

        this.back = new Button(this, width / 2, height * (numUpgrades + 2) / (numUpgrades + 3), 'Back', 'Title');
      },
      error(xhr) {
        console.error(xhr);
      },
    });

    $.ajax({
      type: 'POST',
      url: '/submit-money',
      data: {
        money: this.registry.values.money,
        refreshToken: getCookie('refreshJwt'),
      },
      error(xhr) {
        console.error(xhr);
      },
    });
  }
}
