import PlayerShip from "../objects/PlayerShip";
import Laser from "../objects/Laser";
import Mob from "../objects/Mob";
import Powerup from "../objects/Powerup";

export default class ArenaScene extends Phaser.Scene {
  constructor() {
    super('Arena');
  }

  create() {
    socket.emit('joinGame');

    this.state = 'running';

    this.otherPlayers = this.physics.add.group();
    this.cursors = this.input.keyboard.createCursorKeys();
    this.createEnemies();

    this.lasers = this.physics.add.group({ classType: Laser });
    this.enemyLasers = this.physics.add.group({ classType: Laser });
    this.enemies = this.physics.add.group({ classType: Mob });
    this.powerups = this.physics.add.group({ classType: Powerup });

    const { width, height } = this.cameras.main;

    this.hpBox = this.add.rectangle(5, 5, width / 3, height / 12, 0xfff, 0.8).setOrigin(0);
    this.hpBar = this.add.rectangle(10, 15, width / 3 - 10, height / 12 - 20, 0x00ff00, 1).setOrigin(0);

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
        this.addOtherPlayers(playerInfo);
      })
      .on('leaveGame', (playerId) => {
        if (playerId === socket.id) return;
        this.otherPlayers.getChildren().forEach((player) => {
          if (playerId === player.playerId) {
            player.destroy();
          }
        });
      })
      .on('playerMoved', (playerInfo) => {
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
      this.scene.sleep();
      this.scene.launch('Options');
    });

    this.events.on('shutdown', () => {
      socket.emit('leaveGame');
    });
  }

  createPlayer(playerInfo) {
    this.player = new PlayerShip(this, 300, 300);
    // update camera
    this.updateCamera();

    this.physics.add.collider(this.player, this.spawns);
    this.physics.add.overlap(this.player, this.enemyLasers, (player, laser) => {
      socket.emit('laserHit', laser.id);
      laser.destroy();

      this.sound.play('shieldDown');
      this.player.hp -= laser.damage;
      this.hpBar.displayWidth = Phaser.Math.Percent(this.player.hp, 0, this.registry.values.playerBody.maxHP) * (this.hpBox.displayWidth - 10);

      if (this.player.hp <= 0 && this.state === 'running') {
        this.scene.start('Title');
      }
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

  createEnemies() {
    this.spawns = this.physics.add.group({
      classType: Phaser.GameObjects.Sprite,
    });

    for (let i = 0; i < 5; i++) {
      const location = this.getValidLocation();
      // parameters are x, y, width, height
      const enemy = this.spawns.create(location.x, location.y, 'spaceshooter', this.getEnemySprite());
      enemy.body.setCollideWorldBounds(true);
      enemy.body.setImmovable();
    }

    // move enemies
    this.timedEvent = this.time.addEvent({
      delay: 3000,
      callback: this.moveEnemies,
      callbackScope: this,
      loop: true,
    });
  }

  moveEnemies() {
    this.spawns.getChildren().forEach((enemy) => {
      const randNumber = Math.floor((Math.random() * 4) + 1);

      switch (randNumber) {
        case 1:
          enemy.body.setVelocityX(50);
          break;
        case 2:
          enemy.body.setVelocityX(-50);
          break;
        case 3:
          enemy.body.setVelocityY(50);
          break;
        case 4:
          enemy.body.setVelocityY(50);
          break;
        default:
          enemy.body.setVelocityX(50);
      }
    });

    setTimeout(() => {
      this.spawns.setVelocityX(0);
      this.spawns.setVelocityY(0);
    }, 500);
  }

  getEnemySprite() {
    const sprites = this.textures.get('spaceshooter').getFrameNames().filter(name => name.startsWith('enemy'));
    return Phaser.Math.RND.pick(sprites);
  }

  getValidLocation() {
    let validLocation = false;
    let x, y;

    while (!validLocation) {
      x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
      y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);

      let occupied = false;
      this.spawns.getChildren().forEach((child) => {
        if (child.getBounds().contains(x, y)) {
          occupied = true;
        }
      });
      if (!occupied) validLocation = true;
    }
    return { x, y };
  }

  onMeetEnemy(player, enemy) {
    if (this.attacking) {
      const location = this.getValidLocation();
      enemy.x = location.x;
      enemy.y = location.y;
    }
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
