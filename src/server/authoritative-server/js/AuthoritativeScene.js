function randomPosition(max) {
  return Math.floor(Math.random() * max) + 50;
}

/**
 * We map the players two ways: firstly through this dictionary which contains all of the
 * information, as well as through a phaser group that tracks the physics of the player.
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
        .on('joinGame', (texture) => {
          console.log(`Player ${socket.id} joined the game`);
          players[socket.id] = {
            // TODO: fix hardcoded values
            x: randomPosition(480),
            y: randomPosition(640),
            rotation: Math.floor(Math.random() * 2 * Math.PI), // a random angle
            playerId: socket.id,
            texture,
            input: {
              left: false,
              right: false,
              up: false,
              down: false,
              space: false,
              enter: false,
            },
          };
          this.addPlayer(players[socket.id]);
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
    this.players.getChildren().forEach((player) => {
      if (!players[player.playerId]) return;
      const { input } = players[player.playerId];
      if (input.left) {
        player.setAngularVelocity(-300);
      } else if (input.right) {
        player.setAngularVelocity(300);
      } else {
        player.setAngularVelocity(0);
      }

      if (input.up) {
        this.physics.velocityFromRotation(player.rotation + 1.5, 200, player.body.acceleration);
      } else {
        player.setAcceleration(0);
      }

      players[player.playerId].x = player.x;
      players[player.playerId].y = player.y;
      players[player.playerId].rotation = player.rotation;
    });
    this.physics.world.wrap(this.players, 5);
    io.emit('playerUpdates', players);
    // TODO change this to:
    // for (let id of Object.keys(players)) {
    //   // emit to socket #{id}
    // }
  }

  addPlayer(playerInfo) {
    const player = this.physics.add.image(playerInfo.x, playerInfo.y, 'spaceshooter', playerInfo.texture).setOrigin(0.5, 0.5).setDisplaySize(53, 40);
    player.setDrag(100);
    player.setAngularDrag(100);
    player.setMaxVelocity(200);
    player.playerId = playerInfo.playerId;
    this.players.add(player);
  }

  removePlayer(playerId) {
    this.players.getChildren().forEach((player) => {
      if (playerId === player.playerId) {
        player.destroy();
      }
    });
  }
}
