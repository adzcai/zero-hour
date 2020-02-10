import Laser from '../objects/Laser';
import Powerup from '../objects/Powerup';
import PlayerShip from '../objects/PlayerShip';

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
          if (!player) return;
          player.keys = p.keys;
          player.setRotation(p.rotation);
          player.body.x = p.x;
          player.body.y = p.y;
          player.x = p.x;
          player.y = p.y;
        });
      })
      .on('laserUpdates', (lasers) => {
        // We create all of the new lasers
        lasers.forEach((data) => {
          if (existingLaserIds.includes(data.id)) {
            const laser = this.lasers.getChildren().find(l => l.id === data.id);
            if (laser) laser.update(data);
            return;
          }

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
        try { this.sound.play('shieldDown'); } catch (e) { console.error(e); }
        this.hpBar.displayWidth = Phaser.Math.Percent(hp, 0, maxHp) * (this.hpBox.displayWidth-10);
      });

    this.input.keyboard.on('keyup_ESC', () => {
      this.quit();
    });

    this.keys = this.input.keyboard.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT,SPACE,ENTER');
  }

  quit() {
    this.players.clear(true, true);
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
    if (id === socket.id) {
      console.log('player pos', x, y);
      const player = new PlayerShip(this, x, y);
      player.id = id;
      this.cameras.main.startFollow(player);
      this.physics.add.overlap(player, this.lasers, (p, laser) => {
        if (laser.shooter === p.id) return;
        laser.destroy();
        try { this.sound.play('shieldDown'); } catch (e) { console.error(e); }
        player.hp -= laser.damage * 10;
        this.hpBar.displayWidth = Phaser.Math.Percent(player.hp, 0, this.registry.values.playerBody.maxHP) * (this.hpBox.displayWidth - 10);
        if (player.hp <= 0) this.quit();
      });
      this.players.add(player);
    } else {
      const player = this.add.sprite(x, y, 'spaceshooter', texture);
      player.setTint(Math.random() * 0xffffff);
      player.id = id;
      this.players.add(player);
    }
  }

  findTarget(shooter, x, y) {
    let target = null;
    let min = Infinity;

    this.players.getChildren().forEach((ship) => {
      if (ship.id === shooter) return;
      const dist = Phaser.Math.Distance.Between(x, y, ship.x, ship.y);
      if (dist < min) {
        min = dist;
        target = ship;
      }
    });

    return target;
  }

  update(time, delta) {
    socket.emit('playerInput', {
      UP: { isDown: this.keys.UP.isDown },
      DOWN: { isDown: this.keys.DOWN.isDown },
      LEFT: { isDown: this.keys.LEFT.isDown },
      RIGHT: { isDown: this.keys.RIGHT.isDown },
      SPACE: { isDown: this.keys.SPACE.isDown },
      ENTER: { isDown: this.keys.ENTER.isDown },
    });
    if (this.hp <= 0) this.quit();
    this.lasers.getChildren().forEach((laser) => {
      console.log(laser.lifespan, laser.x, laser.y);
      if (laser.lifespan < 0) this.lasers.remove(laser, true, true);
    });
    // this.players.getChildren().forEach(player => player.update(time, delta, player.keys));
  }
}
