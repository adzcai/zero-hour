import PlayerShip from '../objects/PlayerShip';
import Mob from '../objects/Mob';
import Laser from '../objects/Laser';
import Powerup from '../objects/Powerup';
import Button from '../objects/Button';
import defaultFont from '../../shared/defaultFont';
import getCookie from '../../shared/getCookie';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  create() {
    this.state = 'running';
    this._score = 0;

    const { width, height } = this.cameras.main;

    this.scene.get('Background').changeColor('purple').changeSpeed(5).playBgMusic('gameMusic');

    this.hpBox = this.add.rectangle(5, 5, width / 3, height / 12, 0xfff, 0.8).setOrigin(0);
    this.hpBar = this.add.rectangle(10, 15, width / 3 - 10, height / 12 - 20, 0x00ff00, 1).setOrigin(0);

    this.scoreText = this.add.text(width / 2, 5, '0', defaultFont(24)).setOrigin(0.5, 0);

    this.progressBox = this.add.rectangle(width - 5, 5, width / 12, height / 2, 0xffffff, 0.6).setOrigin(1, 0);
    this.progressBar = this.add.rectangle(width - 10, 10,
      this.progressBox.displayWidth - 10,
      this.progressBox.displayHeight - 10, 0x00ff00, 1).setOrigin(1, 0);
    this.progressImg = this.add.image(0, 0, 'spaceshooter', this.registry.get('playerTexture').replace('Ship', 'Life'));

    this.physics.world.setBounds(0, 0, width, height).setBoundsCollision(false, false, true, true);

    this.input.keyboard.on('keyup_ESC', () => {
      this.scene.sleep();
      this.scene.launch('Options');
    });

    // ========== INITIALIZING ENTITIES ==========
    this.player = new PlayerShip(this, width / 2, height - 5, 'spaceshooter', 'playerShip1_blue');
    this.bullets = this.physics.add.group({ classType: Laser });
    this.enemies = this.physics.add.group({ classType: Mob });
    this.powerups = this.physics.add.group({ classType: Powerup });

    this.physics.add.collider(this.player, this.enemies, (player, enemy) => {
      enemy.end();

      this.sound.play('shieldDown');

      this.player.hp -= enemy.value * 10;
      this.hpBar.displayWidth = Phaser.Math.Percent(this.player.hp, 0, this.registry.values.playerBody.maxHP) * (this.hpBox.displayWidth - 10);
      if (this.player.hp <= 0 && this.state === 'running') this.gameOver('died');
    });

    this.physics.add.overlap(this.bullets, this.enemies, (bullet, enemy) => {
      enemy.hitBy(bullet);
      bullet.destroy();
    });

    this.physics.add.overlap(this.player, this.powerups, (player, powerup) => {
      powerup.apply(player);
      powerup.destroy();
    });

    this.title = new Button(this, width / 2, height / 3, `Level ${this.registry.values.level}`);
    this.tweens.add({
      targets: this.title,
      alpha: 0,
      duration: 1000,
      delay: 1000,
      onComplete: () => {
        this.initSpawners();
        this.title.destroy();
      },
    });

    this.progressTween = this.tweens.addCounter({
      from: 0,
      to: 1,
      duration: Math.sqrt(this.registry.values.level) * 25 * 1000,
      onUpdate: (t) => {
        this.progressBar.displayHeight = (1 - t.getValue()) * (this.progressBox.height - 10);
        const { x, y } = this.progressBar.getBottomLeft();
        this.progressImg.setPosition(x + this.progressBar.displayWidth / 2, y);
      },
      onComplete: () => this.gameOver('won'),
    });

    this.coins = this.add.particles('coins', 'coin_06', {
      scale: 0.2,
      callbackScope: this,
      blendMode: 'ADD',
      lifespan: 4000,
      speedX: {
        onEmit: () => Phaser.Math.Between(-100, 100),
      },
      accelerationY: {
        onEmit: () => Phaser.Math.Between(250, 400),
      },
      deathZone: {
        type: 'onEnter',
        source: {
          contains: (x, y) => {
            if (this.player.body.hitTest(x, y)) {
              this.registry.values.money += 100;
              return true;
            }
            return false;
          },
        },
      },
      on: false,
    });
  }

  update(time, delta) {
    this.player.update(time, delta);
    this.physics.world.wrap(this.player, 5);
    if (this.state === 'landing' && this.player.getBottomLeft().y > this.cameras.main.height) this.showGameOverMessage('Game Over');
  }

  initSpawners() {
    this.time.addEvent({
      callback: () => {
        const frame = Phaser.Math.RND.pick(this.registry.get('ENEMYTYPES'));
        this.enemies.get(0, 0, 'spaceshooter', frame).init();
      },
      delay: 1000 / this.registry.values.level,
      loop: true,
    });

    this.time.addEvent({
      callback: () => {
        if (Math.random() < 0.5) {
          const frame = Phaser.Math.RND.pick(Object.keys(this.registry.get('POWERUPTYPES')));
          this.powerups.get(0, 0, 'spaceshooter', frame).init();
        }
      },
      delay: 500,
      loop: true,
    });
  }

  gameOver(type) {
    this.state = 'ending';

    const { width, height } = this.cameras.main;

    this.enemies.children.each(child => child.end());
    this.time.removeAllEvents();
    this.tweens.killAll();
    this.coins.destroy();

    if (type === 'died') {
      this.sound.play('lose');
      this.player.play('sonicExplosionSlow').once('animationcomplete', () => this.player.destroy());
      this.showGameOverMessage('Game Over\n\nYou Died');
    } else if (type === 'won') {
      // We move the player to the top of the screen
      this.player.body.setDrag(0);
      this.player.body.setCollideWorldBounds(false);
      this.tweens.add({
        targets: this.player,
        x: width / 2,
        y: height / 12,
        duration: 1000,
        onComplete: () => {
          this.player.body.reset(this.player.x, this.player.y);
          this.player.body.setVelocityY(150);
          this.state = 'landing';
        },
      });

      // We spawn a platform below the screen and move it to the bottom of the screen
      this.platform = this.physics.add.image(width / 2, height * 1.5, 'spaceshooter2', 'spaceStation_024');
      this.platform.setScale((width / 3) / this.platform.displayWidth).setOrigin(0.5, 0);
      this.tweens.add({
        targets: this.platform,
        x: width / 2,
        y: height - this.platform.displayHeight,
        duration: 1000,
        onComplete: () => this.platform.body.setImmovable(),
      });

      // When the player lands ON TOP of the platform, we game over with the message 'You Won'
      this.physics.add.collider(this.player, this.platform, () => {
        if (this.platform.body.touching.up) {
          this.score += 5000;
          this.showGameOverMessage('Game Over\n\nYou Won');
          if (this.registry.values.musicOn) this.scene.get('Background').playBgMusic('victoryMusic');
        }
      });

      // If he misses the platform, it's handled in update()

      this.registry.values.level += 1;
    }
  }

  showGameOverMessage(message) {
    this.state = 'over';

    const { width, height } = this.cameras.main;

    // Stop the player's current movement
    this.player.body.reset(this.player.x, this.player.y);

    this.gameOverText = this.add.text(width / 2, height * 3 / 8, message, defaultFont(24)).setOrigin(0.5).setDepth(50);

    // Flashes the gameOverText a few times
    this.flashTimer = this.time.addEvent({
      callback: () => {
        this.gameOverText.setVisible(!this.gameOverText.visible);

        if (this.flashTimer.getOverallProgress() === 1) { // When it's finished, show the player's score and prompt restart
          this.add.text(width / 2, height / 2, `Your score: ${this.score}`, defaultFont(18)).setOrigin(0.5).setDepth(50);
          this.add.text(width / 2, height * 2 / 3, 'Press any key to restart', defaultFont(18)).setOrigin(0.5).setDepth(50);
          $.ajax({
            type: 'POST',
            url: 'submit-score',
            data: {
              score: this.score,
              refreshToken: getCookie('refreshJwt'),
            },
          });
          this.input.keyboard.on('keyup', (e) => {
            e.stopPropagation();
            this.scene.start('Title')
          });
        }
      },
      delay: 750,
      repeat: 3,
    });
  }

  set score(val) {
    this._score = val;
    this.scoreText.setText(val);
  }

  get score() { return this._score; }
}
