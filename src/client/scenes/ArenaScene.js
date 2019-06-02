import PlayerShip from "../objects/PlayerShip";
import Laser from "../objects/Laser";
import Mob from "../objects/Mob";
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

    this.hpBox = this.add.rectangle(5, 5, width / 3, height / 12, 0xfff, 0.8).setOrigin(0).setScrollFactor(0);
    this.hpBar = this.add.rectangle(10, 15, width / 3 - 10, height / 12 - 20, 0x00ff00, 1).setOrigin(0).setScrollFactor(0);

    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);
    socket.emit('joinGame', x, y);

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
      .on('newPlayer', (playerInfo) => {
        if (playerInfo.id !== socket.id)
          this.addOtherPlayers(playerInfo);
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
      socket.emit('leaveGame');
      this.player.destroy();
      this.scene.start('Title');
    });
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
        socket.emit('leaveGame');
        this.player.destroy();
        this.scene.start('Title');
      }
    });

    this.physics.add.overlap(this.lasers, this.otherPlayers, (laser, otherPlayer) => {
      laser.destroy();
    });

    this.keys = this.input.keyboard.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT,SPACE,ENTER');
  }

  addOtherPlayers(playerInfo) {
    const otherPlayer = this.add.sprite(playerInfo.x, playerInfo.y, 'spaceshooter', 'playerShip3_red');
    otherPlayer.setTint(Math.random() * 0xffffff);
    otherPlayer.playerId = playerInfo.playerId;
    this.otherPlayers.add(otherPlayer);
  }

  updateCamera() {
    // limit camera to map
    this.cameras.main.setBounds(0, 0, 1024, 1024);
    this.cameras.main.startFollow(this.player);
    this.cameras.main.roundPixels = true; // avoid tile bleed
  }

  getValidLocation() {
    let validLocation = false;
    let x, y;

    while (!validLocation) {
      x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
      y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);

      let occupied = false;
      if (!occupied) validLocation = true;
    }
    return { x, y };
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

  fireLaser(type, x, y, theta) {
    this.lasers.get().init(type).fire(x, y, theta);
    socket.emit('laserFired', { type, x, y, theta });
  }
}
