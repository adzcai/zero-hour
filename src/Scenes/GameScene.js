import PlayerShip from '../Objects/PlayerShip.js';
import Mob from '../Objects/Mob.js';
import Laser from '../Objects/Laser.js';
import Powerup from '../Objects/Powerup.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  create() {
    const { width, height } = this.cameras.main;

    this.background = this.add.tileSprite(0, 0, width, height, 'black').setOrigin(0);

    this.hpBox = this.add.rectangle(5, 5, width / 3, height / 12, 0xfff, 0.8).setOrigin(0);
    this.hpBar = this.add.rectangle(10, 15, width / 3 - 10, height / 12 - 20, 0x0f0).setOrigin(0);
    // this.coverHpBar = this.add.rectangle(width / 3, height / 12 - 5, 0, height / 12 - 20, 0xfff).setOrigin(1, 0);

    this.physics.world.setBounds(0, 0, width, height).setBoundsCollision(false, false, true, true);

    this.minimap = this.cameras.add(width - 5 - width / 4, 5, width / 4, height / 3)
      .setZoom(0.2).setScroll(width / 2, height / 4);

    this.input.keyboard.on('keyup_ESC', () => {
      this.scene.sleep();
      this.scene.launch('Options', { prevScene: 'Game' });
    });

    // ========== INITIALIZING ENTITIES ==========
    this.player = new PlayerShip(this, width / 2, height - 5, 'spaceshooter', 'playerShip1_blue');
    this.bullets = this.physics.add.group({ classType: Laser });
    this.enemies = this.physics.add.group({ classType: Mob });
    this.powerups = this.physics.add.group({ classType: Powerup });

    this.physics.add.collider(this.player, this.enemies, (player, enemy) => {
      enemy.end();
      this.player.hp -= enemy.hp / 5;
      this.hpBar.displayWidth = Phaser.Math.Percent(this.player.hp, 0, this.player.maxHP) * (this.hpBox.displayWidth - 10);
      if (this.player.hp <= 0) {
        this.gameOver();
      }
    });

    this.physics.add.overlap(this.bullets, this.enemies, (bullet, enemy) => {
      bullet.destroy();
      enemy.hitBy(bullet);
    });

    this.physics.add.overlap(this.player, this.powerups, (player, powerup) => {
      this.player.pickup(powerup);
      powerup.destroy();
    })

    this.time.addEvent({
      callback: () => this.createAsteroid(),
      delay: 1000,
      loop: true,
    });

    this.time.addEvent({
      callback: () => {
        if (Math.random() < 0.25) this.createPowerup();
      },
      delay: 1000,
      loop: true
    });
  }

  update() {
    if (this.gameOver) return;
    this.background.tilePositionY -= 3;
    this.physics.world.wrap(this.player, 10);
  }

  createAsteroid() {
    this.enemies.get(0, 0, 'spaceshooter', Phaser.Math.RND.pick(this.registry.get('ENEMYTYPES'))).init();
  }

  createPowerup() {
    this.powerups.get(0, 0, 'spaceshooter', Phaser.Math.RND.pick(this.registry.get('POWERUPTYPES'))).init();
  }

  gameOver() {
    this.gameOver = true;

    const { width, height } = this.cameras.main;
    this.add.text(width / 2, height * 3 / 8, 'Game Over', {
      font: '24px monospace',
      fill: '#ffffff',
    });

    if (this.message) {
      this.add.text(width / 2, height * 9 / 16, this.message, {
        font: '18px monospace',
        fill: '#ffffff',
      });
    }

    this.add.text(width / 2, height * 3 / 4, 'Press any key to restart', {
      font: '18px monospace',
      fill: '#ffffff',
    });

    this.enemies.children.each(child => child.end());

    this.input.keyboard.on('keyup', () => this.scene.start('Title'));
  }
}
