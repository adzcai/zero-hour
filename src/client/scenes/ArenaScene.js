const inputMessage = document.getElementById('inputMessage');

export default class ArenaScene extends Phaser.Scene {
  constructor() {
    super('Arena');
  }

  create() {
    socket.emit('joinGame');

    this.otherPlayers = this.physics.add.group();
    this.cursors = this.input.keyboard.createCursorKeys();
    this.createEnemies();

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
            player.flipX = playerInfo.flipX;
            player.setPosition(playerInfo.x, playerInfo.y);
          }
        });
      })
      .on('laserPacket', (laserPacket) => {
        console.log(laserPacket);
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
    this.player = this.add.sprite(0, 0, 'spaceshooter', 'playerShip1_blue');

    this.container = this.add.container(playerInfo.x, playerInfo.y);
    this.container.setSize(16, 16);
    this.physics.world.enable(this.container);
    this.container.add(this.player);

    // add weapon
    this.weapon = this.add.sprite(10, 0, 'spaceshooter', 'laserBlue01');
    this.weapon.setScale(2);
    this.weapon.setSize(8, 8);
    this.physics.world.enable(this.weapon);

    this.container.add(this.weapon);
    this.attacking = false;

    // update camera
    this.updateCamera();

    // don't go out of the map
    this.container.body.setCollideWorldBounds(true);

    this.physics.add.overlap(this.weapon, this.spawns, this.onMeetEnemy, false, this);
    this.physics.add.collider(this.container, this.spawns);
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
    this.cameras.main.startFollow(this.container);
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
    let x; let
      y;
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

  update() {
    if (this.container) {
      this.container.body.setVelocity(0);

      // Horizontal movement
      if (this.cursors.left.isDown) {
        this.container.body.setVelocityX(-80);
      } else if (this.cursors.right.isDown) {
        this.container.body.setVelocityX(80);
      }

      // Vertical movement
      if (this.cursors.up.isDown) {
        this.container.body.setVelocityY(-80);
      } else if (this.cursors.down.isDown) {
        this.container.body.setVelocityY(80);
      }

      if (Phaser.Input.Keyboard.JustDown(this.cursors.space) && !this.attacking && document.activeElement !== inputMessage) {
        this.attacking = true;
        setTimeout(() => {
          this.attacking = false;
          this.weapon.angle = 0;
        }, 150);
      }

      if (this.attacking) {
        if (this.weapon.flipX) {
          this.weapon.angle -= 10;
        } else {
          this.weapon.angle += 10;
        }
      }

      const { x, y } = this.container;
      const { flipX } = this.player;
      if (this.container.oldPosition
        && (x !== this.container.oldPosition.x
        || y !== this.container.oldPosition.y
        || flipX !== this.container.oldPosition.flipX)) {
        socket.emit('playerMovement', { x, y, flipX });
      }

      this.container.oldPosition = {
        x: this.container.x,
        y: this.container.y,
        flipX: this.player.flipX,
      };
    }
  }
}
