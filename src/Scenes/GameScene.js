import PlayerShip from '../Objects/PlayerShip.js';
import Mob from '../Objects/Mob.js';
import Laser from '../Objects/Laser.js';
import Powerup from '../Objects/Powerup.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  create() {
    this.running = true;

    const { width, height } = this.cameras.main;

    this.hpBox = this.add.rectangle(5, 5, width / 3, height / 12, 0xfff, 0.8).setOrigin(0);
    this.hpBar = this.add.rectangle(10, 15, width / 3 - 10, height / 12 - 20, 0x0f0, 1).setOrigin(0);

    this.progressBox = this.add.rectangle(width - 5, 5, width / 12, height / 2, 0xffffff, 0.6).setOrigin(1, 0);
    this.progressBar = this.add.rectangle(width - 10, 10, this.progressBox.displayWidth - 10, this.progressBox.displayHeight - 10, 0x00bbbb, 1).setOrigin(1, 0);

    this.physics.world.setBounds(0, 0, width, height).setBoundsCollision(false, false, true, true);

    // this.minimap = this.cameras.add(width - 5 - width / 4, 5, width / 4, height / 3)
    //   .setZoom(0.2).setScroll(width / 2, height / 4);

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
      if (this.player.hp <= 0 && this.running) {
        this.gameOver();
      }
    });

    this.physics.add.overlap(this.bullets, this.enemies, (bullet, enemy) => {
      bullet.destroy();
      enemy.hitBy(bullet);
    });

    this.physics.add.overlap(this.player, this.powerups, (player, powerup) => {
      powerup.apply(player);
      powerup.destroy();
    });

    this.time.addEvent({
      callback: () => this.createAsteroid(),
      delay: 1000,
      loop: true,
    });

    this.time.addEvent({
      callback: () => {
        if (Math.random() < 0.5) this.createPowerup();
      },
      delay: 500,
      loop: true,
    });

    this.scene.get('Background').changeColor('purple').changeSpeed(5);

    this.startTime = this.time.now;
    this.duration = 30 * 1000;
  }

  update(time, delta) {
    if (!this.running) return;
    this.player.update(time, delta);
    this.physics.world.wrap(this.player, 10);

    this.progressBar.displayHeight = Phaser.Math.Percent(this.time.now - this.startTime, 0, this.duration) * (this.progressBox.displayHeight - 10);
    if (this.time.now > this.startTime + this.duration) this.gameOver();
  }

  createAsteroid() {
    this.enemies.get(0, 0, 'spaceshooter', Phaser.Math.RND.pick(this.registry.get('ENEMYTYPES'))).init();
  }

  createPowerup() {
    this.powerups.get(0, 0, 'spaceshooter', Phaser.Math.RND.pick(Object.keys(this.registry.get('POWERUPTYPES')))).init();
  }

  gameOver() {
    this.running = false;

    this.player.body.reset(this.player.x, this.player.y);

    this.player.play('sonicExplosionSlow');

    const { width, height } = this.cameras.main;
    this.gameOverText = this.add.text(width / 2, height * 3 / 8, 'Game Over', {
      font: '24px monospace',
      fill: '#ffffff',
    }).setOrigin(0.5);

    this.enemies.children.each(child => child.end());
    this.time.removeAllEvents();

    this.flashTimer = this.time.addEvent({
      callback: () => {
        this.gameOverText.setVisible(!this.gameOverText.visible);
        if (this.flashTimer.getOverallProgress() === 1) {
          this.add.text(width / 2, height * 3 / 4, 'Press any key to restart', {
            font: '18px monospace',
            fill: '#ffffff',
          }).setOrigin(0.5);
          this.input.keyboard.on('keyup', () => this.scene.start('Title'));
        }
      },
      delay: 1000,
      repeat: 4,
    });
  }
}
