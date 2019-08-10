function randomPosition(max) {
  return Math.floor(Math.random() * max) + 50;
}

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

      .setPath('audio')
      .audio('laser', 'Laser_Shoot.wav')
      .audio('laser1', 'sfx_laser1.ogg')
      .audio('laser2', 'sfx_laser2.ogg')
      .audio('lose', 'sfx_lose.ogg')
      .audio('shieldDown', 'sfx_shieldDown.ogg')
      .audio('shieldUp', 'sfx_shieldUp.ogg')
      .audio('powerup', 'sfx_twoTone.ogg')
      .audio('select', 'Blip_Select.wav')
      .audio('explosion', 'Explosion.wav')

      .audio('titleMusic', 'Title Theme.mp3')
      .audio('gameMusic', 'Sunstrider.mp3')
      .audio('victoryMusic', 'All Clear.mp3')

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

    io.on('connection', (socket) => {
      console.log(`A user connected at socket ${socket.id}`);

      socket
        .on('joinGame', (attack, body) => {
          console.log(`Player ${socket.id} joined the game`);
          players[socket.id] = new Player(attack, body, socket.id);
          console.log(players[socket.id]);
          this.players.add(new PlayerShip(this, players[socket.id])); // Create the sprite using the player data

          // We send the client the information of the current players
          socket.emit('currentPlayers', players);
          socket.emit('arenaBounds', 480, 640);
          // And tell all of the other clients that a new player has joined
          socket.broadcast.emit('newPlayer', players[socket.id]);
        })
        .on('playerInput', (data) => {
          if (!players[socket.id]) return;
          players[socket.id].input = data;
        })
        .on('leaveGame', () => {
          console.log(`Player ${socket.id} left the game`);
          delete players[socket.id];
          socket.broadcast.emit('leaveGame', socket.id);
        })
        .on('disconnect', () => {
          console.log(`The user at socket ${socket.id} disconnected`);
          if (players[socket.id]) {
            console.log(`Player ${socket.id} left the game`);
            delete players[socket.id];
            socket.broadcast.emit('leaveGame', socket.id);
          }
        });
    });
  }

  update() {
    this.players.getChildren().forEach((playerShip) => {
      if (players[playerShip.playerId]) {
        playerShip.update(players[playerShip.playerId].input);
        players[playerShip.playerId].x = playerShip.x;
        players[playerShip.playerId].y = playerShip.y;
        players[playerShip.playerId].rotation = playerShip.rotation;
      }
    });
    
    this.physics.world.wrap(this.players, 5);
    io.emit('playerUpdates', players);
    // TODO change this to:
    // for (let id of Object.keys(players)) {
    //   // emit to socket #{id}
    // }
  }

  fireLaser() {
    console.log('laser fired');
  }

  removePlayer(playerId) {
    this.players.getChildren().forEach((player) => {
      if (playerId === player.playerId) {
        player.destroy();
      }
    });
  }
}
