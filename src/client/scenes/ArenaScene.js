import PlayerShip from "../objects/PlayerShip";
import Laser from "../objects/Laser";
import Powerup from "../objects/Powerup";

export default class ArenaScene extends Phaser.Scene {
  constructor() {
    super('Arena');
  }

  create() {
    this.state = 'running';

    this.otherPlayers = this.physics.add.group();
    this.cursors = this.input.keyboard.createCursorKeys();

    this.lasers = this.physics.add.group({ classType: Laser });
    this.enemyLasers = this.physics.add.group({ classType: Laser });
    this.powerups = this.physics.add.group({ classType: Powerup });

    const { width, height } = this.cameras.main;

    this.hpBox = this.add.rectangle(5, 5, width / 3, height / 12, 0xfff, 0.8)
      .setOrigin(0)
      .setScrollFactor(0);
    this.hpBar = this.add.rectangle(10, 15, width / 3 - 10, height / 12 - 20, 0x00ff00, 1)
      .setOrigin(0)
      .setScrollFactor(0);

    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);
    socket.emit('joinGame', x, y, this.registry.values.playerTexture);

    socket
      .on('currentPlayers', (players) => {
        Object.keys(players).forEach((id) => {
          if (players[id].playerId === socket.id) {
            this.createPlayer(players[id]);
          } else {
            this.addOtherPlayers(players[id]);
          }
        });
      })
      .on('arenaBounds', (arenaWidth, arenaHeight) => {
        this.physics.world.setBounds(0, 0, arenaWidth, arenaHeight);
        const bounds = this.physics.world.bounds;
        this.add.rectangle(bounds.x, bounds.y, bounds.width, bounds.height, 0xff0000, 0.1).setOrigin(0);
        this.cameras.main.setBounds(-width / 2, -height / 2, bounds.width + width, bounds.height + height);
      })
      .on('newPlayer', (playerInfo) => {
        if (playerInfo.playerId !== socket.id) {
          this.addOtherPlayers(playerInfo);
        }
      })
      .on('leaveGame', (playerId) => {
        if (playerId === socket.id || !this.otherPlayers) return;
        this.otherPlayers.getChildren().forEach((player) => {
          if (playerId === player.playerId) {
            player.destroy();
          }
        });
      })
      .on('playerMoved', (playerInfo) => {
        if (!this.otherPlayers) return;
        this.otherPlayers.getChildren().forEach((player) => {
          if (playerInfo.playerId === player.playerId) {
            player.setPosition(playerInfo.x, playerInfo.y);
            player.setRotation(playerInfo.rotation);
          }
        });
      })
      .on('laserFired', (laser) => {
        this.enemyLasers.get().init(laser.type).fire(laser.x, laser.y, laser.theta);
      })
      .on('laserHit', (laserId) => {
        this.enemyLasers.getChildren().forEach((laser) => {
          if (laser.id === laserId) laser.destroy();
        })
      });

    this.input.keyboard.on('keyup_ESC', () => {
      this.quit();
    });
  }

  quit() {
    socket.emit('leaveGame');
    socket.removeAllListeners();
    this.scene.start('Title');
  }

  createPlayer(playerInfo) {
    this.player = new PlayerShip(this, playerInfo.x, playerInfo.y);
    // update camera
    this.updateCamera();

    this.physics.add.overlap(this.player, this.enemyLasers, (player, laser) => {
      socket.emit('laserHit', laser.id);
      laser.destroy();

      this.sound.play('shieldDown');
      this.player.hp -= laser.damage;
      this.hpBar.displayWidth = Phaser.Math.Percent(this.player.hp, 0, this.registry.values.playerBody.maxHP) * (this.hpBox.displayWidth - 10);

      if (this.player.hp <= 0 && this.state === 'running') {
        this.quit();
      }
    });

    this.physics.add.overlap(this.lasers, this.otherPlayers, (laser, otherPlayer) => {
      laser.destroy();
    });

    this.keys = this.input.keyboard.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT,SPACE,ENTER');
  }

  addOtherPlayers(playerInfo) {
    const otherPlayer = this.add.sprite(playerInfo.x, playerInfo.y, 'spaceshooter', playerInfo.playerTexture);
    otherPlayer.setTint(Math.random() * 0xffffff);
    otherPlayer.playerId = playerInfo.playerId;
    this.otherPlayers.add(otherPlayer);
  }

  updateCamera() {
    // limit camera to map
    this.cameras.main.startFollow(this.player);
    this.cameras.main.roundPixels = true; // avoid tile bleed
  }

  update(time, delta) {
    if (this.player) {
      this.player.update(time, delta, this.keys);
      
      const { x, y, rotation } = this.player;
      if (this.player.oldPosition
        && ((Math.abs(x - this.player.oldPosition.x) > 1)
        || (Math.abs(y - this.player.oldPosition.y) > 1))) {
        socket.emit('playerMovement', { x, y, rotation });
      }

      this.player.oldPosition = { x, y, rotation };
    }
  }

  findTarget(x, y) {
    const { width, height } = this.cameras.main;

    let target = null;
    let min = Phaser.Math.Distance.Between(0, 0, width, height);

    this.otherPlayers.getChildren().forEach((child) => {
      const dist = Phaser.Math.Distance.Between(x, y, child.x, child.y);
      if (dist < min) {
        min = dist;
        target = child;
      }
    });

    return target;
  }

  fireLaser(type, x, y, theta) {
    this.lasers.get().init(type).fire(x, y, theta);
    socket.emit('laserFired', { type, x, y, theta });
  }
}
