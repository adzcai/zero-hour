function randomPosition(max) {
  return Math.floor(Math.random() * max) + 50;
}

const ARENA_WIDTH = 4800;
const ARENA_HEIGHT = 4800;

/**
 * We map the players two ways: firstly through this dictionary which contains all of the
 * information, as well as through a phaser group that tracks the physics of the player.
 * @type {Object.<string, Player>}
 */
const players = {};

/**
 * This scene handles all of the logic for the multiplayer part of our game.
 */
class AuthoritativeScene extends Phaser.Scene {
  /** Load in our asset files. */
  preload() {
    this.load.setBaseURL('../../../assets/')

      .setPath('images/ui')
      .image('box', 'grey_box.png')
      .image('checkedBox', 'blue_boxCheckmark.png')

      .setPath('images/backgrounds')
      .image('black')
      .image('blue')
      .image('darkPurple')
      .image('purple')

      .setPath('images/particles')
      .image('trace', 'trace_01.png')
      .image('flare', 'spark_05.png')


      .setPath('spritesheets')
      .atlasXML('spaceshooter')
      .atlasXML('spaceshooter2')
      .atlasXML('coins')

      .setPath('images/explosions');

    for (let i = 0; i < 9; i += 1) {
      this.load
        .image(`regularExplosion0${i}`)
        .image(`sonicExplosion0${i}`);
    }
  }

  create() {
    this.players = this.physics.add.group();
    this.lasers = this.physics.add.group({ classType: Laser });

    this.physics.world.setBounds(0, 0, ARENA_WIDTH, ARENA_HEIGHT);

    this.physics.add.overlap(this.lasers, this.players, (laser, player) => {
      if (player.playerId === laser.shooterId) return;
      player.hp -= laser.damage;
      io.to(player.playerId).emit('hit', player.hp, player.playerBody.maxHP);
      if (player.hp <= 0) { // we remove the player from the game
        if (players[player.playerId]) delete players[player.playerId];
        io.to(player.playerId).emit('death');
        io.emit('leaveGame', player.playerId);
        player.destroy();
      }
      laser.destroy();
    });

    io.on('connection', (socket) => {
      console.log(`A user connected at socket ${socket.id}`);

      socket
        .on('joinGame', (attack, body) => {
          console.log(`Player ${socket.id} joined the game`);
          players[socket.id] = new Player(attack, body, socket.id);
          this.players.add(new PlayerShip(this, players[socket.id])); // Create the sprite using the player data

          // We send the client the information of the current players
          socket.emit('currentPlayers', players);
          socket.emit('arenaBounds', ARENA_WIDTH, ARENA_HEIGHT);
          // And tell all of the other clients that a new player has joined
          socket.broadcast.emit('newPlayer', players[socket.id]);
        })
        .on('playerInput', (data) => {
          if (!players[socket.id]) return;
          players[socket.id].input = data;
        })
        .on('leaveGame', () => this.removePlayer(socket))
        .on('disconnect', () => {
          console.log(`The user at socket ${socket.id} disconnected`);
          this.removePlayer(socket);
        });
    });
  }

  update(time, delta) {
    super.update(time, delta);
    this.players.getChildren().forEach((playerShip) => {
      if (players[playerShip.playerId]) {
        playerShip.update(players[playerShip.playerId].input);
        players[playerShip.playerId].x = playerShip.x;
        players[playerShip.playerId].y = playerShip.y;
        players[playerShip.playerId].rotation = playerShip.rotation;
      }
    });

    this.lasers.getChildren().forEach(laser => laser.update(time, delta));

    this.physics.world.wrap(this.players, 5);
    io.emit('playerUpdates', players);
    io.emit('laserUpdates', this.lasers.getChildren().map(laser => ({
      type: laser.name,
      x: laser.x,
      y: laser.y,
      theta: laser.rotation,
      speed: laser.speed,
    })));
    // TODO change this to:
    // for (let id of Object.keys(players)) {
    //   // emit to socket #{id}
    // }
  }

  fireLaser(shooterId, type, x, y, theta, speed, damage) {
    const id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    this.lasers.get(x, y, 'spaceshooter', type, true).init(shooterId, id, speed, damage).fire(theta);
  }

  removePlayer(socket) {
    console.log(`Player ${socket.id} left the game`);
    if (players[socket.id]) delete players[socket.id];
    const left = this.players.getChildren().find(player => player.playerId === socket.id);
    if (left) left.destroy();
    socket.broadcast.emit('leaveGame', socket.id);
  }
}
