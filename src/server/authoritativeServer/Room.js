const { v4 } = require('uuid');
const { ARENA_WIDTH, ARENA_HEIGHT } = require('./consts');
const Player = require('./Player');
const Laser = require('./Laser');
const Vec = require('./Vec');

module.exports = class Room {
  constructor(io) {
    this.id = v4();
    this.io = io;
    this.players = [];
    this.lasers = [];
  }

  addPlayer(socket, attack, body) {
    console.log(`Player ${socket.id} joined the game`);

    const pos = new Vec(Math.random()*ARENA_WIDTH, Math.random()*ARENA_HEIGHT);
    const player = new Player(this, socket.id, pos, attack, body);

    socket.join(this.id);
    socket.emit('currentPlayers', this.players.map(p => p.repr()));
    socket.emit('arenaBounds', ARENA_WIDTH, ARENA_HEIGHT);
    this.io.to(this.id).emit('newPlayer', player.repr());

    socket.on('playerInput', (keys) => {
      const pp = this.players.find(p => p.id === socket.id);
      if (pp) player.keys = keys;
    });
    socket.on('leaveGame', this.removePlayer.bind(this, socket));
    socket.on('disconnect', this.removePlayer.bind(this, socket));

    this.players.push(player);
  }

  removePlayer(socket) {
    console.log(`Player ${socket.id} left room ${this.id}`);
    this.players = this.players.filter(p => p.id !== socket.id);
    socket.broadcast.to(this.id).emit('leaveGame', socket.id);
    socket.leave(this.id);
  }

  /**
   * @emits playerUpdates
   * @emits laserUpdates
   */
  update(delta) {
    this.io.to(this.id).emit('playerUpdates', this.players.map(p => p.repr()));
    this.io.to(this.id).emit('laserUpdates', this.lasers.map(l => l.repr()));

    this.players.forEach(ship => ship.update(delta));
    this.lasers.forEach(laser => laser.update(delta));
    this.players = this.players.filter(ship => ship.hp > 0);
    this.lasers = this.lasers.filter(laser => laser.lifespan > 0);
  }

  fire(opts) {
    this.lasers.push(new Laser(this, opts));
  }

  findTarget(id, { x, y }) {
    let target = null;
    let min = Infinity;

    this.players.forEach((p) => {
      if (p.id === id) return;
      const dist = Math.sqrt(((x-p.pos.x)**2) + ((y-p.pos.y)**2));
      if (dist < min) {
        min = dist;
        target = p;
      }
    });

    return target;
  }
};
