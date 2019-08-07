import Laser from '../objects/Laser';
import Powerup from '../objects/Powerup';

/**
 * This is the game's multiplayer scene, which allows the player to connect to the server via
 * their socket. It doesn't do much besides display the information that the server sends it.
 * The only information it sends is the player information at the start, and then the player's
 * input.
 */
export default class ArenaScene extends Phaser.Scene {
  constructor() {
    super('Arena');
  }

  create() {
    this.players = this.physics.add.group();
    this.lasers = this.physics.add.group({ classType: Laser });
    this.powerups = this.physics.add.group({ classType: Powerup });

    const { width, height } = this.cameras.main;

    this.hpBox = this.add.rectangle(5, 5, width / 3, height / 12, 0xfff, 0.8)
      .setOrigin(0)
      .setScrollFactor(0);
    this.hpBar = this.add.rectangle(10, 15, width / 3 - 10, height / 12 - 20, 0x00ff00, 1)
      .setOrigin(0)
      .setScrollFactor(0);

    socket.emit('joinGame', this.registry.values.playerBody.texture);

    socket
      .on('currentPlayers', (players) => {
        Object.keys(players).forEach((id) => {
          this.displayPlayer(players[id], players[id].playerId === socket.id);
        });
      })
      .on('arenaBounds', (arenaWidth, arenaHeight) => {
        this.physics.world.setBounds(0, 0, arenaWidth, arenaHeight);
        const { bounds } = this.physics.world;
        this.add.rectangle(bounds.x, bounds.y, bounds.width, bounds.height, 0xff0000, 0.1).setOrigin(0);
        this.cameras.main.setBounds(-width / 2, -height / 2, bounds.width + width, bounds.height + height);
      })
      .on('newPlayer', (playerInfo) => {
        this.displayPlayer(playerInfo, false);
      })
      .on('hit', () => {
        this.sound.play('shieldDown');
        this.player.hp -= laser.damage;
        this.hpBar.displayWidth = Phaser.Math.Percent(this.player.hp, 0, this.registry.values.playerBody.maxHP) * (this.hpBox.displayWidth - 10);
      })
      .on('leaveGame', (playerId) => {
        this.players.getChildren().forEach((player) => {
          if (playerId === player.playerId) {
            player.destroy();
          }
        });
      })
      .on('playerUpdates', (players) => {
        Object.keys(players).forEach((id) => { // For each player in the game
          this.players.getChildren().forEach((player) => { // For each player in the client's group object
            if (id === player.playerId) {
              player.setPosition(players[id].x, players[id].y);
              player.setRotation(players[id].rotation + Math.PI); // the Math.PI accounts for the rotation of the game sprite
            }
          });
        });
      });

    this.input.keyboard.on('keyup_ESC', () => {
      this.quit();
    });

    this.keys = this.input.keyboard.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT,SPACE,ENTER');

    this.upKeyPressed = this.downKeyPressed = this.leftKeyPressed = this.rightKeyPressed = this.spaceKeyPressed = this.enterKeyPressed = false;
  }

  quit() {
    socket.emit('leaveGame');
    socket.removeAllListeners();
    this.scene.start('Title');
  }

  displayPlayer(playerInfo) {
    const otherPlayer = this.add.sprite(playerInfo.x, playerInfo.y, 'spaceshooter', playerInfo.texture);
    otherPlayer.setTint(Math.random() * 0xffffff);
    otherPlayer.playerId = playerInfo.playerId;
    this.players.add(otherPlayer);
  }

  update(time, delta) {
    const left = this.leftKeyPressed;
    const right = this.rightKeyPressed;
    const up = this.upKeyPressed;
    const down = this.downKeyPressed;
    const space = this.spaceKeyPressed;
    const enter = this.enterKeyPressed;

    if (this.keys.LEFT.isDown || this.keys.A.isDown) {
      this.leftKeyPressed = true;
    } else if (this.keys.RIGHT.isDown || this.keys.D.isDown) {
      this.rightKeyPressed = true;
    } else {
      this.leftKeyPressed = false;
      this.rightKeyPressed = false;
    }

    if (this.keys.UP.isDown || this.keys.W.isDown) {
      this.upKeyPressed = true;
    } else if (this.keys.DOWN.isDown || this.keys.S.isDown) {
      this.downKeyPressed = true;
    } else {
      this.upKeyPressed = false;
      this.downKeyPressed = false;
    }

    this.spaceKeyPressed = this.keys.SPACE.isDown;
    this.enterKeyPressed = this.keys.ENTER.isDown;

    if (
      left !== this.leftKeyPressed
      || right !== this.rightKeyPressed
      || up !== this.upKeyPressed
      || down !== this.downKeyPressed
      || space !== this.spaceKeyPressed
      || enter !== this.enterKeyPressed
    ) {
      socket.emit('playerInput', {
        left: this.leftKeyPressed,
        right: this.rightKeyPressed,
        up: this.upKeyPressed,
        down: this.downKeyPressed,
        space: this.spaceKeyPressed,
        enter: this.enterKeyPressed,
      });
    }
  }
}
