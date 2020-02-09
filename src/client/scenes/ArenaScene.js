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
    const existingLaserIds = [];

    const { width, height } = this.cameras.main;

    this.hpBox = this.add.rectangle(5, 5, width / 3, height / 12, 0xfff, 0.8)
      .setOrigin(0)
      .setScrollFactor(0);
    this.hpBar = this.add.rectangle(10, 15, width / 3 - 10, height / 12 - 20, 0x00ff00, 1)
      .setOrigin(0)
      .setScrollFactor(0);

    socket.emit('joinGame', this.registry.values.playerAttack, this.registry.values.playerBody);

    socket
      .on('currentPlayers', (players) => {
        players.forEach((p) => {
          this.displayPlayer(p);
        });
      })
      .on('arenaBounds', (arenaWidth, arenaHeight) => {
        this.physics.world.setBounds(0, 0, arenaWidth, arenaHeight);
        const { bounds } = this.physics.world;
        this.add.tileSprite(0, 0, arenaWidth, arenaHeight, 'purple').setOrigin(0).setDepth(-5);
        this.cameras.main.setBounds(
          -width / 2, -height / 2,
          bounds.width + width, bounds.height + height,
        );
      })
      .on('newPlayer', (data) => {
        this.displayPlayer(data);
      })
      .on('leaveGame', (id) => {
        this.players.getChildren().forEach((player) => {
          if (id === player.id) player.destroy();
        });
      })
      .on('playerUpdates', (players) => {
        players.forEach((p) => { // For each player in the game
          const player = this.players.getChildren().find(ship => p.id === ship.id);
          player.setPosition(p.x, p.y);
          player.setRotation(p.rotation);
        });
      })
      .on('laserUpdates', (lasers) => {
        // We create all of the new lasers
        lasers.filter(({ id }) => !existingLaserIds.includes(id)).forEach((data) => {
          const shooter = data.id.substring(0, data.id.lastIndexOf('-'));
          const { x, y } = this.players.getChildren().find(ship => ship.id === shooter);
          data.x = x || data.x;
          data.y = y || data.y;
          const laser = new Laser(this, data);
          this.lasers.add(laser, true);
          this.physics.velocityFromRotation(data.theta-Math.PI/2, laser.speed, laser.body.velocity);
          laser.body.velocity.scale(2);
          existingLaserIds.push(data.id);
        });
      })
      .on('hit', (hp, maxHp) => {
        this.sound.play('shieldDown');
        this.hpBar.displayWidth = Phaser.Math.Percent(hp, 0, maxHp) * (this.hpBox.displayWidth-10);
      });

    this.input.keyboard.on('keyup_ESC', () => {
      this.quit();
    });

    this.keys = this.input.keyboard.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT,SPACE,ENTER');

    this.upKeyPressed = false;
    this.downKeyPressed = false;
    this.leftKeyPressed = false;
    this.rightKeyPressed = false;
    this.spaceKeyPressed = false;
    this.enterKeyPressed = false;
  }

  quit() {
    this.lasers.clear(true, true);
    socket.emit('leaveGame');
    ['currentGame', 'arenaBounds', 'newPlayer', 'leaveGame', 'playerUpdates', 'laserUpdates'].forEach(event => socket.off(event));
    this.scene.start('Title');
  }

  /**
   * See `src/server/authoritative-server/js/Player.js`.
   * @param {Player} data
   */
  displayPlayer({
    x, y, id, texture,
  }) {
    const player = this.add.sprite(x, y, 'spaceshooter', texture);
    player.setTint(Math.random() * 0xffffff);
    player.id = id;
    if (id === socket.id) {
      console.log('player pos', x, y);
      this.cameras.main.startFollow(player);
      this.physics.add.collider(player, this.lasers, (p, laser) => {
        // laser.end();
        this.sound.play('shieldDown');
        player.hp -= laser.damage * 10;
        // this.hpBar.displayWidth = Phaser.Math.Percent(this.player.hp, 0, this.registry.values.playerBody.maxHP) * (this.hpBox.displayWidth - 10);
        if (player.hp <= 0 && this.state === 'running') this.gameOver('died');
      });
    }
    this.players.add(player);
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

    if (this.hp <= 0) this.quit();
    this.lasers.getChildren().forEach((laser) => {
      if (laser.lifespan < 0) this.lasers.remove(laser, true, true);
    });
  }
}
