function randomPosition(max) {
  return Math.floor(Math.random() * max) + 50;
}

class AuthoritativeScene extends Phaser.Scene {
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
    console.log('Assets loaded');
  }

  create() {
    this.players = this.physics.add.group();

    this.scores = {
      blue: 0,
      red: 0
    };

    this.star = this.physics.add.image(randomPosition(700), randomPosition(500), 'star');
    this.physics.add.collider(this.players);

    this.physics.add.overlap(this.players, this.star, function (star, player) {
      if (players[player.playerId].team === 'red') {
        this.scores.red += 10;
      } else {
        this.scores.blue += 10;
      }
      this.star.setPosition(randomPosition(700), randomPosition(500));
      io.emit('updateScore', this.scores);
      io.emit('starLocation', { x: this.star.x, y: this.star.y });
    });

    io.on('connection', (socket) => {
      console.log(`A user connected at socket ${socket.id}`);

      socket
        .on('joinGame', (x, y, texture) => {
          console.log(`Player ${socket.id} joined the game`);
          players[socket.id] = {
            x, y,
            rotation: Math.floor(Math.random() * 2 * Math.PI),
            playerId: socket.id,
            playerTexture: texture,
          };
          // We send the client the information of the current players
          socket.emit('currentPlayers', players);
          socket.emit('arenaBounds', ARENA_WIDTH, ARENA_HEIGHT);
          // And tell all of the other clients that a new player has joined
          socket.broadcast.emit('newPlayer', players[socket.id]);
        })
        .on('playerInput', (data) => {
          if (!players[socket.id]) return;
          // players[socket.id].x = data.x;
          // players[socket.id].y = data.y;
          // players[socket.id].rotation = data.rotation;
          // socket.broadcast.emit('playerMoved', players[socket.id]);
          this.handlePlayerInput(socket.id, data);
        })
        .on('laserFired', (laser) => {
          socket.broadcast.emit('laserFired', laser);
        })
        .on('laserHit', (laserId) => {
          socket.broadcast.emit('laserHit', laserId);
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
      const input = players[player.playerId].input;
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
  }

  handlePlayerInput(playerId, input) {
    this.players.getChildren().forEach((player) => {
      if (playerId === player.playerId) {
        players[player.playerId].input = input;
      }
    });
  }

  addPlayer(playerInfo) {
    const player = this.physics.add.image(playerInfo.x, playerInfo.y, 'ship').setOrigin(0.5, 0.5).setDisplaySize(53, 40);
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
