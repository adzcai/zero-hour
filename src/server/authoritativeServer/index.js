const Room = require('./Room');

module.exports = (io) => {
  const rooms = [new Room(io)];

  io.on('connection', (socket) => {
    console.log(`A user connected at socket ${socket.id}`);
    socket.on('joinGame', (attack, body) => {
      if (rooms[rooms.length-1].players.length === 8) rooms.push(new Room(io));
      rooms[rooms.length-1].addPlayer(socket, attack, body);
    });
    socket.on('disconnect', () => {
      console.log(`socket[id=${socket.id}] disconnected`);
    });
  });

  let prev = Date.now();
  setInterval(() => {
    rooms.forEach(room => room.update(Date.now() - prev));
    prev = Date.now();
  }, 50);
};
