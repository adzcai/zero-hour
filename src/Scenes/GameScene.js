import PlayerShip from "../Objects/PlayerShip.js";
import Mob from "../Objects/Mob.js";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("Game");
  }

  create() {
    console.log("game");
    const { width, height } = this.cameras.main;

    this.background = this.add.tileSprite(0, 0, width, height, "black").setOrigin(0);

    this.physics.world.setBounds(0, 0, width, height);

    this.player = new PlayerShip(this, width / 2, height - 5, "spaceshooter", "playerShip1_blue");
    this.enemies = this.physics.add.group();

    this.physics.add.collider(this.player, this.enemies, () => {

    });
  }

  spawnMob() {
    const mob = new Mob(this);
    this.enemies.add(mob);
  }

  update(time, delta) {
    this.background.tilePositionY -= 3;
    this.physics.world.wrap(this.player, 10);
  }
};
